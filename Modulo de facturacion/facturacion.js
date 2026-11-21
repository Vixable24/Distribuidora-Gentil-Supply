// Lógica del Módulo de Facturación - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de facturacion/facturacion.js
//
// Solo frontend. Lee las ventas, pagos y clientes que guarda el Módulo de Ventas en
// localStorage (no hay enlaces de navegación entre módulos: solo se comparten datos).
//   - facturacion.php: emitir facturas a partir de las ventas y vista previa de impresión.
//   - cobranzas.php:   verificar o rechazar los pagos registrados en Ventas (caja.php).

// Datos fiscales del emisor. AJUSTAR con los datos reales de la empresa.
const EMPRESA = {
  razonSocial: 'Distribuidora Gentil Supply, C.A.',
  rif: 'J-00000000-0',
  domicilio: 'La Asunción, Municipio Arismendi, Estado Nueva Esparta'
};
const IVA = 0.16;

// Claves compartidas con el Módulo de Ventas
const VENTAS_KEY = 'gs_ventas_v2';
const PAGOS_KEY = 'gs_pagos_v2';
const CLIENTES_KEY = 'gs_clientes_v1';
// Claves propias de Facturación
const FACTURAS_KEY = 'gs_facturas_v1';
const TASA_KEY = 'gs_tasa_bcv';

const hoyISO = new Date().toISOString().slice(0, 10);
const $ = id => document.getElementById(id);
const leer = (key, def) => { try { const d = JSON.parse(localStorage.getItem(key)); return d ?? def; } catch (e) { return def; } };
const guardar = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const usd = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const bs = n => 'Bs. ' + new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const r2 = n => Math.round(n * 100) / 100;

function fmtFecha(fechaStr) {
  const s = String(fechaStr || '').trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : s;
}

function montoBsDePago(p) {
  if (!p) return 0;
  if (Number(p.montoBs) > 0) return Number(p.montoBs);
  const tasa = Number(p.tasa) > 0 ? Number(p.tasa) : tasaBCV();
  return (Number(p.monto) || 0) * tasa;
}

function montoBsDeVenta(v) {
  if (!v) return 0;
  const tasa = Number(v.tasaBcv) > 0 ? Number(v.tasaBcv) : tasaBCV();
  return (Number(v.total) || 0) * tasa;
}

let ventas = leer(VENTAS_KEY, []);
let pagos = leer(PAGOS_KEY, []);
let clientes = leer(CLIENTES_KEY, []);
let facturas = leer(FACTURAS_KEY, []);

const tasaBCV = () => parseFloat(localStorage.getItem(TASA_KEY)) || 60.50;
const rifDe = nombre => (clientes.find(c => c.nombre === nombre) || {}).rif || 'J312345678';
const direccionDe = nombre => { const c = clientes.find(x => x.nombre === nombre) || {}; return c.direccion || c.zona || 'Nueva Esparta'; };
const rutaDe = (nombre, ventaRel = null) => {
  if (ventaRel && ventaRel.ruta) return ventaRel.ruta;
  const c = clientes.find(x => x.nombre === nombre);
  if (c && c.ruta) return c.ruta;
  if (window.CLIENTES_RUTA_DEFAULT_MAP && window.CLIENTES_RUTA_DEFAULT_MAP[nombre]) return window.CLIENTES_RUTA_DEFAULT_MAP[nombre];
  return 'Ruta 2';
};

function asegurarDatosBaseFacturacion() {
  if (!Array.isArray(ventas) || ventas.length === 0) {
    ventas = [
      { id: 'V-001', cliente: 'Supermercado Central', fecha: '2026-04-10', estado: 'Completada', credito: '0', items: [{ id: 'muchy-caja-med', nombre: 'Caja Muchy Mediano', cantidad: 40, contiene: 20, precio: 11.00 }, { id: 'puig-caja-katy', nombre: 'Caja Katy', cantidad: 20, contiene: 24, precio: 18.00 }, { id: 'fisa-caja-jabon', nombre: 'Caja Jabón de Baño Every Night (36 und)', cantidad: 5, contiene: 36, precio: 32.00 }], total: 960 },
      { id: 'V-002', cliente: 'Tienda El Ahorro', fecha: '2026-04-09', estado: 'Pendiente', credito: '15', items: [{ id: 'puig-disp-maria', nombre: 'Display María Delicia (pequeño)', cantidad: 30, contiene: 18, precio: 8.50 }, { id: 'fisa-caja-crema-365', nombre: 'Caja Crema para el Cuerpo 365 ml (12 und)', cantidad: 4, contiene: 12, precio: 40.00 }], total: 415 },
      { id: 'V-003', cliente: 'Minimarket Express', fecha: '2026-04-08', estado: 'Completada', credito: '0', items: [{ id: 'muchy-manga-peq', nombre: 'Manga Muchy Pequeño', cantidad: 50, contiene: 12, precio: 5.00 }, { id: 'fisa-ristra-deo', nombre: 'Ristra Desodorante Every Night Sachet', cantidad: 40, contiene: 12, precio: 3.20 }, { id: 'puig-caja-maria', nombre: 'Caja María Delicia', cantidad: 10, contiene: 24, precio: 11.00 }], total: 488 },
      { id: 'V-004', cliente: 'Bodega San José', fecha: '2026-04-08', estado: 'Completada', credito: '21+', items: [{ id: 'muchy-caja-xl', nombre: 'Caja Muchy XL', cantidad: 25, contiene: 10, precio: 9.00 }, { id: 'fisa-caja-deo-60', nombre: 'Caja Desodorante Every Night 60 g (12 und)', cantidad: 6, contiene: 12, precio: 22.00 }], total: 357 },
      { id: 'V-005', cliente: 'Comercial López', fecha: '2026-04-07', estado: 'Cancelada', credito: '15', anulacion: { motivo: 'El cliente canceló el pedido antes del despacho.', fecha: '2026-04-07' }, items: [{ id: 'puig-caja-katy', nombre: 'Caja Katy', cantidad: 15, contiene: 24, precio: 18.00 }, { id: 'muchy-caja-med', nombre: 'Caja Muchy Mediano', cantidad: 20, contiene: 20, precio: 11.00 }], total: 490 },
      { id: 'V-006', cliente: 'Restaurant El Faro', fecha: '2026-04-08', estado: 'Completada', credito: '0', items: [{ id: 'fisa-caja-jabon', nombre: 'Caja Jabón de Baño Every Night (36 und)', cantidad: 10, contiene: 36, precio: 32.00 }, { id: 'puig-disp-maria', nombre: 'Display María Delicia (pequeño)', cantidad: 5, contiene: 18, precio: 8.50 }], total: 362.5 },
      { id: 'V-007', cliente: 'Supermercado Juan Griego', fecha: '2026-04-08', estado: 'Completada', credito: '7', items: [{ id: 'muchy-caja-xl', nombre: 'Caja Muchy XL', cantidad: 25, contiene: 10, precio: 9.00 }, { id: 'fisa-ristra-deo', nombre: 'Ristra Desodorante Every Night Sachet', cantidad: 20, contiene: 12, precio: 3.20 }], total: 289 }
    ];
    guardar(VENTAS_KEY, ventas);
  }
  if (!Array.isArray(pagos) || pagos.length === 0) {
    pagos = [
      { id: 'P-001', ventaId: 'V-001', cliente: 'Supermercado Central', fecha: '2026-04-10', metodo: 'Transferencia', banco: '0134-Banesco', monto: 960, referencia: '884213', estado: 'Completado' },
      { id: 'P-002', ventaId: 'V-003', cliente: 'Minimarket Express', fecha: '2026-04-08', metodo: 'Pago Móvil', banco: '0102-Banco de Venezuela', monto: 488, referencia: '550931', estado: 'Completado' },
      { id: 'P-003', ventaId: 'V-004', cliente: 'Bodega San José', fecha: '2026-04-08', metodo: 'Efectivo ($)', banco: '', monto: 357, referencia: '', estado: 'Completado' },
      { id: 'P-004', ventaId: 'V-002', cliente: 'Tienda El Ahorro', fecha: '2026-04-09', metodo: 'Pago Móvil', banco: '0105-Banco Mercantil', monto: 50, referencia: '771234', estado: 'Por Verificar' },
      { id: 'P-005', ventaId: 'V-006', cliente: 'Restaurant El Faro', fecha: '2026-04-08', metodo: 'Efectivo ($)', banco: '', monto: 362.5, referencia: '', estado: 'Completado' },
      { id: 'P-006', ventaId: 'V-007', cliente: 'Supermercado Juan Griego', fecha: '2026-04-08', metodo: 'Transferencia', banco: '0134-Banesco', monto: 289, referencia: '912045', estado: 'Completado' }
    ];
    guardar(PAGOS_KEY, pagos);
  }
  if (!Array.isArray(clientes) || clientes.length === 0) {
    clientes = (window.CLIENTES_SEMILLA_GLOBAL && window.CLIENTES_SEMILLA_GLOBAL.length)
      ? JSON.parse(JSON.stringify(window.CLIENTES_SEMILLA_GLOBAL))
      : [
          { nombre: 'Supermercado Central', rif: 'J301122334', zona: 'Mariño', ruta: 'Ruta 2', contacto: 'Carlos Mendoza', telefono: '0412-555-1234', email: 'compras@supercentral.com', direccion: 'Av. 4 de Mayo, Porlamar, Mpio. Mariño' },
          { nombre: 'Tienda El Ahorro', rif: 'J294455667', zona: 'Arismendi', ruta: 'Ruta 2', contacto: 'María Brito', telefono: '0414-998-2211', email: 'admin@elahorro.com', direccion: 'Calle Independencia, La Asunción, Mpio. Arismendi' },
          { nombre: 'Bodegón Los Pescadores C.A.', rif: 'J304567123', zona: 'Mariño', ruta: 'Ruta 2', contacto: 'Ramón Díaz', telefono: '0424-559-0077', email: 'lospescadores@correo.com', direccion: 'Calle Igualdad, Porlamar, Mpio. Mariño' },
          { nombre: 'Minimarket Express', rif: 'J317788990', zona: 'Maneiro', ruta: 'Ruta 3', contacto: 'Luis Gómez', telefono: '0424-881-3300', email: 'ventas@miniexpress.com', direccion: 'Av. Aldonza Manrique, Pampatar, Mpio. Maneiro' },
          { nombre: 'Restaurant El Faro', rif: 'J401258770', zona: 'Maneiro', ruta: 'Ruta 3', contacto: 'Marco Antonini', telefono: '0414-792-8810', email: 'gerencia@elfaro.ve', direccion: 'Sector La Caranta, Pampatar, Mpio. Maneiro' },
          { nombre: 'Bodega San José', rif: 'J289900112', zona: 'Díaz', ruta: 'Ruta 4', contacto: 'José Marín', telefono: '0416-772-4410', email: 'bodegasanjose@correo.com', direccion: 'Sector El Espinal, San Juan Bautista, Mpio. Díaz' },
          { nombre: 'Abastos San Juan Bautista', rif: 'J308911245', zona: 'Díaz', ruta: 'Ruta 4', contacto: 'Carmen Velásquez', telefono: '0426-890-3321', email: 'abastossanjuan@correo.com', direccion: 'Calle Real, San Juan Bautista, Mpio. Díaz' },
          { nombre: 'Comercial López', rif: 'V12345678', zona: 'Marcano', ruta: 'Ruta 5', contacto: 'Pedro López', telefono: '0414-334-5590', email: 'comerciallopez@correo.com', direccion: 'Calle La Marina, Juan Griego, Mpio. Marcano' },
          { nombre: 'Supermercado Juan Griego', rif: 'J315500981', zona: 'Marcano', ruta: 'Ruta 5', contacto: 'Roberto Marín', telefono: '0412-699-4411', email: 'compras@superjuangriego.com', direccion: 'Av. Jesús Rafael Leandro, Juan Griego, Mpio. Marcano' },
          { nombre: 'Abastos La Asunción', rif: 'J298712345', zona: 'Arismendi', ruta: 'Ruta 9', contacto: 'Ana Rojas', telefono: '0412-660-1188', email: 'abastosasuncion@correo.com', direccion: 'Frente a la Plaza Bolívar, La Asunción, Mpio. Arismendi' },
          { nombre: 'Panadería Santa Ana', rif: 'J123456789', zona: 'Gómez', ruta: 'Ruta 9', contacto: 'Elena Salazar', telefono: '0416-220-9944', email: 'panaderiasantaana@correo.com', direccion: 'Calle Principal, Santa Ana, Mpio. Gómez' }
        ];
    guardar(CLIENTES_KEY, clientes);
  }
}

function normalizarFacturaFACItem(f, idx) {
  if (!f || typeof f !== 'object') return f;
  const corrBase = Number(f.correlativo) > 0 ? Number(f.correlativo) : (idx + 1);
  const num = typeof window.normalizarNumeroFacturaFAC === 'function'
    ? window.normalizarNumeroFacturaFAC(f.numero, corrBase)
    : ('FAC-' + String((String(f.numero || '').match(/(\d+)/) || [0, corrBase])[1]).padStart(6, '0'));
  const corr = parseInt((num.match(/(\d+)/) || [0, corrBase])[1], 10) || corrBase;
  const ctrl = /^\d{2}-\d{6}$/.test(String(f.control || '')) ? f.control : ('00-' + String(corr).padStart(6, '0'));
  return Object.assign({}, f, { correlativo: corr, numero: num, control: ctrl });
}

function asegurarFacturasSemilla() {
  asegurarDatosBaseFacturacion();
  if (localStorage.getItem(FACTURAS_KEY) !== null && Array.isArray(facturas) && facturas.length > 0) {
    facturas = facturas.map(normalizarFacturaFACItem);
    return;
  }
  const tasa = tasaBCV();
  const baseVentas = ventas.filter(v => v.estado === 'Completada');
  const seleccion = baseVentas.length ? baseVentas : ventas.filter(v => v.estado !== 'Cancelada').slice(0, 2);
  if (!seleccion.length) return;
  facturas = seleccion.map((v, idx) => {
    const corr = idx + 1;
    const total = r2((v.items || []).reduce((t, i) => t + i.precio * i.cantidad, 0));
    const base = r2(total / (1 + IVA));
    return {
      correlativo: corr,
      numero: 'FAC-' + String(corr).padStart(6, '0'),
      control: '00-' + String(corr).padStart(6, '0'),
      ventaId: v.id,
      cliente: v.cliente,
      rif: rifDe(v.cliente),
      direccion: direccionDe(v.cliente),
      fecha: v.fecha || hoyISO,
      credito: v.credito || '0',
      tasa: Number(v.tasaBcv) > 0 ? Number(v.tasaBcv) : tasa,
      items: (v.items || []).map(i => ({ id: i.id, nombre: i.nombre, cantidad: i.cantidad, contiene: i.contiene, precio: i.precio })),
      base,
      iva: r2(total - base),
      total
    };
  });
  guardar(FACTURAS_KEY, facturas);
}

function recargarDatos() {
  ventas = leer(VENTAS_KEY, []);
  pagos = leer(PAGOS_KEY, []);
  clientes = leer(CLIENTES_KEY, []);
  facturas = leer(FACTURAS_KEY, []).map(normalizarFacturaFACItem);
  asegurarFacturasSemilla();
}
asegurarFacturasSemilla();
const pagoVerificado = p => p.estado === 'Completado' || p.estado === 'Verificado';
const pagadoVerificado = v => pagos.filter(p => p.ventaId === v.id && pagoVerificado(p)).reduce((t, p) => t + p.monto, 0);

// --- UI comunes ---
function openModal(id) {
  const m = $(id);
  m.classList.remove('hidden');
  m.classList.add('flex');
  requestAnimationFrame(() => m.classList.remove('opacity-0'));
}

function closeModal(id) {
  const m = $(id);
  m.classList.add('opacity-0');
  setTimeout(() => { m.classList.add('hidden'); m.classList.remove('flex'); }, 200);
}

let toastTimer;
function toast(msg) {
  let t = $('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'fixed bottom-5 right-5 z-[100] hidden opacity-0 translate-y-2 transition-all duration-300 bg-[#1c4d37] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium';
    document.body.appendChild(t);
  }
  t.classList.remove('z-50');
  t.classList.add('z-[100]');
  t.textContent = msg;
  t.classList.remove('hidden');
  requestAnimationFrame(() => t.classList.remove('opacity-0', 'translate-y-2'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => t.classList.add('hidden'), 300);
  }, 3200);
}

function logout() {
  if (typeof window.cerrarSesionSistema === 'function') {
    window.cerrarSesionSistema();
    return;
  }
  confirmarAccionSistema({
    titulo: 'Cerrar Sesión',
    mensaje: '¿Deseas cerrar la sesión actual?',
    icono: 'log-out',
    textoConfirmar: 'Cerrar Sesión',
    onConfirm: () => {
      try { localStorage.removeItem('gs_sesion_activa'); } catch (e) {}
      window.location.href = '../login.php';
    }
  });
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('[data-modal]').forEach(m => { if (!m.classList.contains('hidden')) closeModal(m.id); });
});

// ======================================================================
// FACTURACIÓN (facturacion.php)
// ======================================================================

// Los precios de Ventas se toman como precio final (IVA incluido), para que el total
// facturado coincida con lo que se cobra al cliente.
function calcularMontos(items) {
  const total = r2(items.reduce((t, i) => t + i.precio * i.cantidad, 0));
  const base = r2(total / (1 + IVA));
  return { base, iva: r2(total - base), total };
}

const ventaFacturada = id => facturas.find(f => f.ventaId === id);
const ventasPorFacturar = () => ventas.filter(v => v.estado !== 'Cancelada' && !ventaFacturada(v.id));

function estadoDespachoDeFactura(f) {
  if (!f || f.estado === 'Anulada') return 'Anulada';
  let despachos = [];
  try { despachos = JSON.parse(localStorage.getItem('gs_despachos_v1')) || []; } catch (e) {}
  const orden = despachos.find(o =>
    (o.facturaNumero && o.facturaNumero === f.numero) ||
    (o.ventaId && o.ventaId === f.ventaId)
  );
  const v = ventas.find(x => x.id === f.ventaId);
  let est = (orden && orden.estado) || f.estadoDespacho || (v && v.estadoDespacho) || 'Pendiente';
  if (est === 'En Preparación') est = 'En Proceso';
  return est;
}

function badgeDespachoFactura(f) {
  if (!f || f.estado === 'Anulada') return '';
  const est = estadoDespachoDeFactura(f);
  if (est === 'Despachado') {
    return '<span class="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/60">3. Despachado</span>';
  }
  if (est === 'En Proceso') {
    return '<span class="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/60">2. En Proceso</span>';
  }
  if (est === 'Con Incidencia') {
    return '<span class="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/60">Despacho: Incidencia</span>';
  }
  return '<span class="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/60">1. Despacho Pendiente</span>';
}

function badgeFactura(f) {
  if (f.estado === 'Anulada') {
    return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Anulada</span>';
  }
  const v = ventas.find(x => x.id === f.ventaId);
  if (v && v.estado === 'Cancelada') {
    return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Venta anulada · por anular</span>';
  }
  return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Emitida</span>';
}

function badgePago(v) {
  if (!v) return '';
  if (v.estado === 'Completada') return '<span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Pagada</span>';
  if (v.estado === 'Cancelada') return '<span class="text-xs font-medium text-red-600 dark:text-red-400">Anulada</span>';
  return '<span class="text-xs font-medium text-amber-600 dark:text-amber-400">Pendiente de pago</span>';
}

let ordenFacturas = { campo: 'numero', dir: 'desc' };

function ordenarFacturasPor(campo) {
  if (ordenFacturas.campo === campo) {
    ordenFacturas.dir = ordenFacturas.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenFacturas.campo = campo;
    ordenFacturas.dir = (campo === 'cliente' || campo === 'estado') ? 'asc' : 'desc';
  }
  renderFacturas();
}

function renderFacturas() {
  const tbody = $('tablaFacturas');
  if (!tbody) return;
  recargarDatos();
  const q = (($('busquedaFacturas') && $('busquedaFacturas').value) || '').toLowerCase();
  const fEst = ($('filtroEstadoFacturas') && $('filtroEstadoFacturas').value) || 'Todos';
  const filtrada = facturas.filter(f => {
    const v = ventas.find(x => x.id === f.ventaId);
    const estCat = estadoCategorizadoFactura(f);
    const coincideTxt = (f.numero + ' ' + f.cliente + ' ' + f.rif + ' ' + f.ventaId + ' ' + fmtFecha(f.fecha)).toLowerCase().includes(q);
    if (!coincideTxt) return false;
    if (fEst === 'Emitida' && f.estado === 'Anulada') return false;
    if (fEst === 'Pagada' && estCat !== 'Pagada') return false;
    if (fEst === 'Pendiente' && estCat !== 'Pendiente') return false;
    if (fEst === 'Anulada' && estCat !== 'Anulada') return false;
    return true;
  });

  const mult = ordenFacturas.dir === 'asc' ? 1 : -1;
  const lista = [...filtrada].sort((a, b) => {
    const ta = (Number(a.total) || 0) * (Number(a.tasa) || tasaBCV());
    const tb = (Number(b.total) || 0) * (Number(b.tasa) || tasaBCV());
    switch (ordenFacturas.campo) {
      case 'numero': return String(a.numero || '').localeCompare(String(b.numero || '')) * mult;
      case 'cliente': return String(a.cliente || '').localeCompare(String(b.cliente || ''), 'es') * mult;
      case 'fecha': return String(a.fecha || '').localeCompare(String(b.fecha || '')) * mult;
      case 'total': return ((Number(a.total) || 0) - (Number(b.total) || 0)) * mult;
      case 'totalBs': return (ta - tb) * mult;
      case 'estado': return estadoCategorizadoFactura(a).localeCompare(estadoCategorizadoFactura(b), 'es') * mult;
      default: return 0;
    }
  });

  if (typeof actualizarIconosOrden === 'function') {
    actualizarIconosOrden('sortIconFac', ['numero', 'cliente', 'fecha', 'total', 'totalBs', 'estado'], ordenFacturas);
  }

  tbody.innerHTML = lista.length ? lista.map(f => {
    const vRel = ventas.find(v => v.id === f.ventaId);
    const rutaCli = rutaDe(f.cliente, vRel);
    return `
    <tr class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
      <td class="py-3.5 px-4"><p class="font-semibold text-gray-900 dark:text-white">${esc(f.numero)}</p><p class="text-xs text-gray-400 dark:text-gray-500">Venta ${esc(f.ventaId)}</p></td>
      <td class="py-3.5 px-4"><p class="text-gray-800 dark:text-gray-100 font-medium">${esc(f.cliente)}</p><p class="text-xs text-gray-400 dark:text-gray-500">${esc(f.rif)} · <span class="font-bold text-[#1c4d37] dark:text-emerald-400">${esc(rutaCli)}</span></p></td>
      <td class="py-3.5 px-4 whitespace-nowrap font-mono text-xs">${esc(fmtFecha(f.fecha))}</td>
      <td class="py-3.5 px-4 font-bold text-gray-900 dark:text-white">${usd(f.total)}</td>
      <td class="py-3.5 px-4 whitespace-nowrap font-bold text-[#1c4d37] dark:text-emerald-400">${bs(f.total * f.tasa)}</td>
      <td class="py-3.5 px-4"><div class="flex flex-col gap-1 items-start">${badgeFactura(f)}${badgePago(vRel)}</div></td>
      <td class="py-3.5 px-4 text-center">
        <button onclick="vistaPreviaFactura('${f.numero}')" class="text-gray-400 hover:text-[#1c4d37] dark:hover:text-emerald-400 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Vista previa e impresión">
          <i data-lucide="printer" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>`;
  }).join('')
    : '<tr><td colspan="7" class="text-center py-10 text-gray-400 dark:text-gray-500">Aún no hay facturas emitidas. Usa "Nueva Factura" para facturar una venta.</td></tr>';

  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  const activas = facturas.filter(f => f.estado !== 'Anulada');
  const deHoy = activas.filter(f => f.fecha === hoyISO);
  set('kpiFacturasHoy', deHoy.length);
  set('kpiMontoBs', bs(activas.reduce((t, f) => t + f.total * f.tasa, 0)));
  set('kpiMontoUsd', usd(activas.reduce((t, f) => t + f.total, 0)));
  const pend = ventasPorFacturar().length;
  set('kpiPorFacturar', `${pend} ${pend === 1 ? 'Venta' : 'Ventas'}`);
  if (window.lucide) lucide.createIcons();
}

function emitirFactura() {
  recargarDatos();
  const pend = ventasPorFacturar();
  const clientesPend = [...new Set(pend.map(v => v.cliente))];
  const selCliente = $('facCliente');
  const selVenta = $('facVenta');
  const infoCli = $('facClienteInfo');

  if (selCliente) {
    selCliente.innerHTML = '<option value="" disabled selected>Seleccionar cliente con ventas por facturar</option>' +
      clientesPend.map(c => `<option value="${esc(c)}">${esc(c)} (${esc(rifDe(c))})</option>`).join('');
    selCliente.disabled = clientesPend.length === 0;
  }
  if (selVenta) {
    selVenta.innerHTML = '<option value="" disabled selected>Selecciona primero un cliente</option>';
    selVenta.disabled = true;
  }
  if (infoCli) {
    infoCli.textContent = clientesPend.length
      ? 'Selecciona un cliente para listar sus ventas pendientes de facturación.'
      : 'No hay ventas pendientes por facturar en el Módulo de Ventas.';
  }

  $('facTasa').value = tasaBCV() || 60.50;
  $('facResumen').innerHTML = pend.length
    ? '<p class="text-sm text-gray-400 dark:text-gray-500 text-center py-6">Selecciona primero el cliente y luego la venta para visualizar el desglose fiscal en $ y en Bs.</p>'
    : '<p class="text-sm text-gray-400 dark:text-gray-500 text-center py-6">No hay ventas pendientes por facturar en el Módulo de Ventas.</p>';
  $('btnEmitir').disabled = true;
  openModal('modalFactura');
}

function cargarVentasClienteFactura() {
  recargarDatos();
  const cliente = ($('facCliente') && $('facCliente').value) || '';
  const selVenta = $('facVenta');
  const infoCli = $('facClienteInfo');
  const pend = ventasPorFacturar().filter(v => v.cliente === cliente);

  if (selVenta) {
    selVenta.innerHTML = '<option value="" disabled selected>Seleccionar venta por facturar</option>' +
      pend.map(v => `<option value="${v.id}">${v.id} · ${fmtFecha(v.fecha)} · ${usd(v.total)}</option>`).join('');
    selVenta.disabled = pend.length === 0;
  }
  if (infoCli) {
    infoCli.textContent = pend.length
      ? `${pend.length} ${pend.length === 1 ? 'venta disponible' : 'ventas disponibles'} para facturar a ${cliente}.`
      : 'Este cliente no tiene ventas pendientes por facturar.';
  }
  $('facResumen').innerHTML = '<p class="text-sm text-gray-400 dark:text-gray-500 text-center py-6">Selecciona la venta a facturar para ver el detalle de los montos en $ y en Bs.</p>';
  $('btnEmitir').disabled = true;
  if (pend.length === 1 && selVenta) {
    selVenta.value = pend[0].id;
    actualizarResumenFactura();
  }
}

function actualizarResumenFactura() {
  const v = ventas.find(x => x.id === ($('facVenta') && $('facVenta').value));
  const tasa = parseFloat($('facTasa').value) || 0;
  $('btnEmitir').disabled = !v || !(tasa > 0);
  if (!v) return;
  const m = calcularMontos(v.items);
  const filas = v.items.map(i => `
    <div class="flex justify-between items-baseline gap-3 py-1.5 text-sm">
      <span class="text-gray-700 dark:text-gray-300 truncate">${i.cantidad} × ${esc(i.nombre)}</span>
      <div class="text-right whitespace-nowrap">
        <span class="font-medium text-gray-900 dark:text-gray-100">${usd(i.precio * i.cantidad)}</span>
        ${tasa > 0 ? `<span class="block text-[11px] text-gray-500 dark:text-gray-400">${bs(i.precio * i.cantidad * tasa)}</span>` : ''}
      </div>
    </div>`).join('');
  $('facResumen').innerHTML = `
    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
      <span class="font-semibold text-gray-700 dark:text-gray-200">${esc(v.cliente)} · ${esc(rifDe(v.cliente))}</span><span>Venta del ${esc(fmtFecha(v.fecha))} · ${badgePago(v)}</span>
    </div>
    <div class="divide-y divide-gray-100 dark:divide-gray-700 max-h-36 overflow-y-auto mb-3">${filas}</div>
    <!-- Montos Totales Divididos: uno en $ USD y otro en Bs. -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 space-y-1">
        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Montos en Divisas ($ USD)</p>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Base imponible ($)</span><span class="font-medium text-gray-800 dark:text-gray-200">${usd(m.base)}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">IVA 16% ($)</span><span class="font-medium text-gray-800 dark:text-gray-200">${usd(m.iva)}</span></div>
        <div class="flex justify-between font-bold text-sm text-[#1c4d37] dark:text-emerald-400 pt-1 border-t border-gray-100 dark:border-gray-700"><span>Total ($)</span><span>${usd(m.total)}</span></div>
      </div>
      <div class="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3 space-y-1">
        <p class="text-[11px] font-bold uppercase tracking-wider text-[#1c4d37] dark:text-emerald-400">Montos en Bolívares (Bs.)</p>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Base imponible (Bs)</span><span class="font-medium text-gray-800 dark:text-gray-200">${tasa > 0 ? bs(m.base * tasa) : '—'}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">IVA 16% (Bs)</span><span class="font-medium text-gray-800 dark:text-gray-200">${tasa > 0 ? bs(m.iva * tasa) : '—'}</span></div>
        <div class="flex justify-between font-bold text-sm text-[#1c4d37] dark:text-emerald-400 pt-1 border-t border-emerald-200/70 dark:border-emerald-800/60"><span>Total (Bs)</span><span>${tasa > 0 ? bs(m.total * tasa) : '—'}</span></div>
      </div>
    </div>`;
}

function confirmarEmision() {
  recargarDatos();
  const v = ventas.find(x => x.id === ($('facVenta') && $('facVenta').value));
  const tasa = parseFloat($('facTasa').value);
  if (!v) { toast('Selecciona primero el cliente y la venta a facturar.'); return; }
  if (!(tasa > 0)) { toast('Indica la tasa de cambio BCV (Bs por USD).'); return; }
  if (ventaFacturada(v.id)) { toast(`La venta ${v.id} ya fue facturada.`); return; }
  if (v.estado === 'Cancelada') { toast(`La venta ${v.id} fue anulada y no puede facturarse.`); return; }

  const n = facturas.reduce((max, f) => Math.max(max, f.correlativo || 0), 0) + 1;
  const numeroPrelim = 'FAC-' + String(n).padStart(6, '0');
  const controlPrelim = '00-' + String(n).padStart(6, '0');
  const m = calcularMontos(v.items);

  const detalleHtml = `
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Factura / Control:</span><span class="font-bold text-[#1c4d37] dark:text-emerald-400">${esc(numeroPrelim)} · ${esc(controlPrelim)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Cliente:</span><span class="font-semibold text-gray-800 dark:text-gray-100">${esc(v.cliente)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">RIF Fiscal:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${esc(rifDe(v.cliente))}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Venta Asociada:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${esc(v.id)} (${esc(fmtFecha(v.fecha))})</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Tasa BCV Aplicada:</span><span class="font-medium text-gray-700 dark:text-gray-200">${bs(tasa)} / USD</span></div>
    <div class="grid grid-cols-2 gap-2 pt-2 mt-1 border-t border-gray-200 dark:border-gray-700">
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5">
        <span class="text-[10px] uppercase font-bold text-gray-400 block">Total Factura ($ USD)</span>
        <span class="font-bold text-base text-gray-900 dark:text-white">${usd(m.total)}</span>
      </div>
      <div class="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-lg p-2.5">
        <span class="text-[10px] uppercase font-bold text-[#1c4d37] dark:text-emerald-400 block">Total Factura (Bs.)</span>
        <span class="font-bold text-base text-[#1c4d37] dark:text-emerald-400">${bs(m.total * tasa)}</span>
      </div>
    </div>
  `;

  confirmarAccionSistema({
    titulo: 'Confirmar Emisión de Factura',
    mensaje: '¿Deseas emitir formalmente este comprobante fiscal con desglose de IVA (16%)?',
    icono: 'file-check',
    textoConfirmar: 'Emitir Factura',
    detalleHtml,
    onConfirm: () => {
      recargarDatos();
      if (ventaFacturada(v.id)) { toast(`La venta ${v.id} ya fue facturada.`); return; }
      localStorage.setItem(TASA_KEY, String(tasa));
      const corr = facturas.reduce((max, f) => Math.max(max, f.correlativo || 0), 0) + 1;
      const factura = {
        correlativo: corr,
        numero: 'FAC-' + String(corr).padStart(6, '0'),
        control: '00-' + String(corr).padStart(6, '0'),
        ventaId: v.id,
        cliente: v.cliente,
        rif: rifDe(v.cliente),
        direccion: direccionDe(v.cliente),
        fecha: hoyISO,
        credito: v.credito || '0',
        tasa,
        items: v.items.map(i => ({ id: i.id, nombre: i.nombre, cantidad: i.cantidad, contiene: i.contiene, precio: i.precio })),
        base: m.base,
        iva: m.iva,
        total: m.total,
        estadoDespacho: ''
      };
      facturas.unshift(factura);
      guardar(FACTURAS_KEY, facturas);
      closeModal('modalFactura');
      renderFacturas();
      toast(`Factura ${factura.numero} emitida para la venta ${v.id}.`);
      setTimeout(() => vistaPreviaFactura(factura.numero), 250);
    }
  });
}

// Documento de la factura (se usa tanto en la vista previa como en la impresión)
function documentoFactura(f) {
  const filas = f.items.map((i, idx) => {
    const pu = i.precio / (1 + IVA);
    const fondo = idx % 2 === 1 ? '#fafafa' : '#ffffff';
    return `
    <tr style="background:${fondo}">
      <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:600">${i.cantidad}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb">${esc(i.nombre)}${i.contiene > 1 ? `<div style="font-size:10.5px;color:#6b7280;margin-top:1px">${i.cantidad * i.contiene} unidades individuales</div>` : ''}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${usd(pu)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600">${usd(pu * i.cantidad)}</td>
    </tr>`;
  }).join('');
  const v = ventas.find(x => x.id === f.ventaId);
  const plazo = String(f.credito || (v && v.credito) || '0');
  const condicion = plazo === '0'
    ? '0 días (Pago el mismo día)'
    : (plazo === '21+' ? 'Crédito 21 días o más' : `Crédito ${plazo} días`);

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;font-size:12px;line-height:1.45;font-variant-numeric:tabular-nums">
    ${f.estado === 'Anulada' ? `<div class="print-avoid-break" style="border:1.5px solid #dc2626;border-left:4px solid #dc2626;background:#fef2f2;color:#991b1b;font-weight:700;text-align:center;padding:8px 12px;border-radius:6px;margin-bottom:12px">FACTURA ANULADA el ${esc(f.fechaAnulacion)} — ${esc(f.motivoAnulacion)}</div>` : ''}
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1c4d37;padding-bottom:12px;margin-bottom:14px">
      <div>
        <div style="font-size:18px;font-weight:800;color:#1c4d37;letter-spacing:-0.01em">${esc(EMPRESA.razonSocial)}</div>
        <div style="font-size:11.5px;color:#374151;margin-top:2px">RIF: <b>${esc(EMPRESA.rif)}</b></div>
        <div style="font-size:11px;color:#4b5563">${esc(EMPRESA.domicilio)}</div>
      </div>
      <div style="text-align:right">
        <div style="display:inline-block;padding:2px 10px;border-radius:6px;background:#ecfdf5;border:1px solid #a7f3d0;color:#1c4d37;font-size:10px;font-weight:800;letter-spacing:.06em;margin-bottom:4px">FACTURA FISCAL</div>
        <div style="font-size:16px;font-weight:800;color:#111827">${esc(f.numero)}</div>
        <div style="font-size:11px;color:#4b5563">N° Control: <b>${esc(f.control)}</b></div>
        <div style="font-size:11px;color:#4b5563">Emisión: <b>${esc(fmtFecha(f.fecha))}</b></div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1.25fr 1fr;gap:12px;margin-bottom:14px">
      <div style="border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;padding:10px 12px">
        <div style="font-size:10px;text-transform:uppercase;color:#6b7280;font-weight:700;letter-spacing:.04em">Datos del Cliente</div>
        <div style="font-size:13px;font-weight:700;color:#111827;margin-top:2px">${esc(f.cliente)}</div>
        <div style="font-size:11px;color:#374151">RIF / C.I.: ${esc(f.rif)}</div>
        <div style="font-size:11px;color:#4b5563">${esc(f.direccion)}</div>
      </div>
      <div style="border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;padding:10px 12px;text-align:right">
        <div style="font-size:10px;text-transform:uppercase;color:#6b7280;font-weight:bold">Condiciones Comerciales</div>
        <div style="font-size:11.5px;margin-top:2px">Pedido Ref.: <b>${esc(f.ventaId)}</b> · <b>${esc(rutaDe(f.cliente, v))}</b></div>
        <div style="font-size:11px;color:#374151">${esc(condicion)}</div>
        <div style="font-size:11px;color:#1c4d37;font-weight:600">Tasa BCV: ${bs(f.tasa)} / USD</div>
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:14px">
      <thead>
        <tr style="background:#f3f4f6;border-top:1px solid #d1d5db;border-bottom:1.5px solid #1c4d37">
          <th style="padding:7px 10px;text-align:center;width:58px;font-size:10.5px;text-transform:uppercase;color:#1c4d37">Cant.</th>
          <th style="padding:7px 10px;text-align:left;font-size:10.5px;text-transform:uppercase;color:#1c4d37">Descripción</th>
          <th style="padding:7px 10px;text-align:right;width:95px;font-size:10.5px;text-transform:uppercase;color:#1c4d37">P. Unit.</th>
          <th style="padding:7px 10px;text-align:right;width:110px;font-size:10.5px;text-transform:uppercase;color:#1c4d37">Importe</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>

    <div class="print-avoid-break" style="display:flex;justify-content:flex-end">
      <table style="border-collapse:collapse;min-width:310px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb">
        <tr><td style="padding:5px 10px;color:#4b5563">Base imponible</td><td style="padding:5px 10px;text-align:right">${usd(f.base)}</td><td style="padding:5px 10px;text-align:right;color:#4b5563">${bs(f.base * f.tasa)}</td></tr>
        <tr><td style="padding:5px 10px;color:#4b5563">IVA (16%)</td><td style="padding:5px 10px;text-align:right">${usd(f.iva)}</td><td style="padding:5px 10px;text-align:right;color:#4b5563">${bs(f.iva * f.tasa)}</td></tr>
        <tr style="border-top:2px solid #1c4d37;background:#ecfdf5;font-weight:800;font-size:13.5px;color:#1c4d37"><td style="padding:8px 10px">TOTAL FACTURA</td><td style="padding:8px 10px;text-align:right">${usd(f.total)}</td><td style="padding:8px 10px;text-align:right">${bs(f.total * f.tasa)}</td></tr>
      </table>
    </div>

    <div class="print-avoid-break" style="display:flex;justify-content:space-between;gap:40px;margin-top:44px;text-align:center;font-size:11px;color:#4b5563">
      <div style="flex:1;border-top:1px solid #9ca3af;padding-top:5px">Emitido por (Firma / Sello)</div>
      <div style="flex:1;border-top:1px solid #9ca3af;padding-top:5px">Recibido conforme (Cliente)</div>
    </div>

    <div class="print-footer-preview" style="margin-top:22px;padding-top:8px;border-top:1px solid #d1d5db;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#1c4d37;font-weight:700">
      <span>Página 1/1</span>
      <span style="font-size:10px;font-weight:500;color:#6b7280">${esc(EMPRESA.razonSocial)}</span>
    </div>
  </div>`;
}

let facturaEnVista = null;

function vistaPreviaFactura(numero) {
  recargarDatos();
  const f = facturas.find(x => x.numero === numero);
  if (!f) return;
  facturaEnVista = f;
  $('previewTitulo').textContent = `${f.numero} · ${f.cliente}`;
  $('previewHoja').innerHTML = documentoFactura(f);
  openModal('modalPreview');
  if (window.lucide) lucide.createIcons();
}

// Imprime SOLO la factura: se copia a una zona dedicada y el CSS de impresión (@page margin: 0) oculta URL y cabeceras del navegador
let _tituloOriginalDoc = '';
function imprimirFactura() {
  if (!facturaEnVista) return;
  $('zonaImpresion').innerHTML = documentoFactura(facturaEnVista);
  _tituloOriginalDoc = document.title;
  document.title = '\u200B';
  window.print();
}

window.addEventListener('afterprint', () => {
  if (_tituloOriginalDoc) {
    document.title = _tituloOriginalDoc;
    _tituloOriginalDoc = '';
  }
  const z = $('zonaImpresion');
  if (z) z.innerHTML = '';
});

// ======================================================================
// COBRANZAS (cobranzas.php) - verificación de pagos registrados en Ventas
// ======================================================================
let filtroCobranza = 'Por Verificar';
let ordenCobranza = { campo: 'fecha', dir: 'desc' };
let ordenCxC = { campo: 'fecha', dir: 'desc' };

function setFiltroCobranza(f) {
  filtroCobranza = f;
  const sel = $('filtroEstadoCobranza');
  if (sel && sel.value !== f) sel.value = f;
  renderCobranzas();
}

function badgeCobranza(p) {
  if (p.estado === 'Por Verificar') return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Por Verificar</span>';
  if (p.estado === 'Rechazado') return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Rechazado</span>';
  if (p.estado === 'Anulado') return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">Anulado en Ventas</span>';
  return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Verificado</span>';
}

function estadoNormalizadoCobranza(p) {
  if (!p) return 'Verificado';
  if (p.estado === 'Por Verificar' || p.estado === 'Rechazado' || p.estado === 'Anulado') return p.estado;
  return 'Verificado';
}

function actualizarIconosOrden(prefijo, campos, estadoOrden) {
  campos.forEach(c => {
    const wrap = $(`${prefijo}-${c}`);
    if (!wrap) return;
    if (estadoOrden.campo === c) {
      const ico = estadoOrden.dir === 'asc' ? 'arrow-up' : 'arrow-down';
      wrap.innerHTML = `<i data-lucide="${ico}" class="w-3.5 h-3.5 opacity-100"></i>`;
    } else {
      wrap.innerHTML = '<i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i>';
    }
  });
}

function ordenarCobranzasPor(campo) {
  if (ordenCobranza.campo === campo) {
    ordenCobranza.dir = ordenCobranza.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenCobranza.campo = campo;
    ordenCobranza.dir = (campo === 'cliente' || campo === 'metodo' || campo === 'estado' || campo === 'venta') ? 'asc' : 'desc';
  }
  renderCobranzas();
}

function ordenarListaCobranzas(lista) {
  const copia = [...lista];
  const mult = ordenCobranza.dir === 'asc' ? 1 : -1;
  copia.sort((a, b) => {
    switch (ordenCobranza.campo) {
      case 'fecha':
        return String(a.fecha || '').localeCompare(String(b.fecha || '')) * mult;
      case 'cliente':
        return String(a.cliente || '').localeCompare(String(b.cliente || ''), 'es') * mult;
      case 'venta':
        return String(a.ventaId || '').localeCompare(String(b.ventaId || ''), 'es') * mult;
      case 'metodo':
        return String(a.metodo || '').localeCompare(String(b.metodo || ''), 'es') * mult;
      case 'monto':
        return ((Number(a.monto) || 0) - (Number(b.monto) || 0)) * mult;
      case 'estado':
        return estadoNormalizadoCobranza(a).localeCompare(estadoNormalizadoCobranza(b), 'es') * mult;
      default:
        return 0;
    }
  });
  return copia;
}

function renderCobranzas() {
  const tbody = $('tablaCobranzas');
  if (!tbody) return;
  recargarDatos();
  const q = (($('busquedaCobranzas') && $('busquedaCobranzas').value) || '').toLowerCase();
  const coincideFiltro = p => filtroCobranza === 'Todos'
    || (filtroCobranza === 'Verificado' ? pagoVerificado(p) : p.estado === filtroCobranza);
  const filtrada = pagos.filter(p =>
    coincideFiltro(p) &&
    (p.cliente + ' ' + p.ventaId + ' ' + (p.referencia || '') + ' ' + (p.metodo || '') + ' ' + (p.banco || '') + ' ' + fmtFecha(p.fecha)).toLowerCase().includes(q)
  );
  const lista = ordenarListaCobranzas(filtrada);
  actualizarIconosOrden('sortIconCob', ['fecha', 'cliente', 'venta', 'metodo', 'monto', 'estado'], ordenCobranza);

  tbody.innerHTML = lista.length ? lista.map(p => {
    const v = ventas.find(x => x.id === p.ventaId);
    const totalBsPago = montoBsDePago(p);
    const acciones = p.estado === 'Por Verificar'
      ? `<div class="flex justify-center gap-1">
           <button onclick="verificarPago('${p.id}')" class="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/60 transition-colors" title="Verificar y aprobar"><i data-lucide="check" class="w-4 h-4"></i></button>
           <button onclick="abrirRechazo('${p.id}')" class="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/60 transition-colors" title="Rechazar"><i data-lucide="x" class="w-4 h-4"></i></button>
         </div>`
      : (p.motivoRechazo ? `<p class="text-xs text-red-600 dark:text-red-400 max-w-[180px] mx-auto">${esc(p.motivoRechazo)}</p>` : '<span class="text-xs text-gray-400">—</span>');
    return `
    <tr class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
      <td class="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-gray-700 dark:text-gray-200">${esc(fmtFecha(p.fecha))}<p class="text-[11px] font-sans text-gray-400 dark:text-gray-500">${esc(p.id)}</p></td>
      <td class="py-3.5 px-4"><p class="font-semibold text-gray-900 dark:text-white">${esc(p.cliente)}</p><p class="text-xs text-gray-400 dark:text-gray-500">${esc(rifDe(p.cliente))} · <span class="font-bold text-[#1c4d37] dark:text-emerald-400">${esc(rutaDe(p.cliente, v))}</span></p></td>
      <td class="py-3.5 px-4"><span class="font-mono font-medium text-[#1c4d37] dark:text-emerald-400">${esc(p.ventaId)}</span>${v ? `<p class="text-xs text-gray-400 dark:text-gray-500">Total ${usd(v.total)}</p>` : ''}</td>
      <td class="py-3.5 px-4"><span class="font-medium text-gray-900 dark:text-gray-100">${esc(p.metodo)}</span>${p.banco ? `<p class="text-xs text-[#1c4d37] dark:text-emerald-400 font-medium">${esc(p.banco)}</p>` : ''}${p.montoBs ? `<p class="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">${bs(p.montoBs)}</p>` : ''}<p class="text-xs text-gray-400 dark:text-gray-500">${esc(p.referencia ? `Ref: ${p.referencia}` : (p.metodo && p.metodo.startsWith('Efectivo') ? 'Efectivo en mano' : 'Sin referencia'))}</p></td>
      <td class="py-3.5 px-4 text-right">
        <p class="font-bold text-gray-900 dark:text-white">${usd(p.monto)}</p>
        <p class="text-xs font-semibold text-emerald-700 dark:text-emerald-400">${bs(totalBsPago)}</p>
      </td>
      <td class="py-3.5 px-4 text-center">${badgeCobranza(p)}</td>
      <td class="py-3.5 px-4 text-center">${acciones}</td>
    </tr>`;
  }).join('')
    : `<tr><td colspan="7" class="text-center py-10 text-gray-400 dark:text-gray-500">${filtroCobranza === 'Por Verificar' ? 'No hay pagos pendientes de verificación.' : 'No se encontraron pagos.'}</td></tr>`;

  const porVerif = pagos.filter(p => p.estado === 'Por Verificar');
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set('kpiPorVerificar', porVerif.length);
  set('kpiMontoPorVerificar', usd(porVerif.reduce((t, p) => t + p.monto, 0)) + ' en espera');
  set('kpiVerificadoHoy', usd(pagos.filter(p => p.estado === 'Verificado' && p.fechaVerificacion === hoyISO).reduce((t, p) => t + p.monto, 0)));
  set('kpiRechazados', pagos.filter(p => p.estado === 'Rechazado').length);
  if (window.lucide) lucide.createIcons();
}

function verificarPago(id) {
  recargarDatos();
  const p = pagos.find(x => x.id === id);
  if (!p || p.estado !== 'Por Verificar') return;
  const v = ventas.find(x => x.id === p.ventaId);
  if (v && v.estado === 'Cancelada') { toast(`La venta ${v.id} fue anulada en Ventas; este pago no puede aprobarse.`); return; }

  const detalleHtml = `
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">N° de Pago:</span><span class="font-bold text-[#1c4d37] dark:text-emerald-400">${esc(p.id)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Fecha:</span><span class="font-medium text-gray-700 dark:text-gray-200">${esc(fmtFecha(p.fecha))}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Cliente:</span><span class="font-semibold text-gray-800 dark:text-gray-100">${esc(p.cliente)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Venta:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${esc(p.ventaId)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Método:</span><span class="font-medium text-gray-700 dark:text-gray-200">${esc(p.metodo)}</span></div>
    ${p.banco ? `<div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Banco:</span><span class="font-medium text-gray-700 dark:text-gray-200">${esc(p.banco)}</span></div>` : ''}
    ${p.referencia ? `<div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Referencia:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${esc(p.referencia)}</span></div>` : ''}
    <div class="flex justify-between items-baseline border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
      <span class="text-gray-500 dark:text-gray-400 font-semibold">Monto a Aprobar:</span>
      <div class="text-right">
        <p class="font-bold text-lg text-[#1c4d37] dark:text-emerald-400">${usd(p.monto)}</p>
        <p class="text-xs font-semibold text-emerald-700 dark:text-emerald-300">${bs(montoBsDePago(p))}</p>
      </div>
    </div>
  `;

  confirmarAccionSistema({
    titulo: 'Confirmar Verificación de Pago',
    mensaje: '¿Confirmas que este pago fue recibido correctamente en cuenta/caja?',
    icono: 'check-circle-2',
    textoConfirmar: 'Verificar y Aprobar',
    detalleHtml,
    onConfirm: () => {
      recargarDatos();
      const pagoActual = pagos.find(x => x.id === id);
      if (!pagoActual || pagoActual.estado !== 'Por Verificar') return;
      const ventaActual = ventas.find(x => x.id === pagoActual.ventaId);
      if (ventaActual && ventaActual.estado === 'Cancelada') {
        toast(`La venta ${ventaActual.id} fue anulada en Ventas; este pago no puede aprobarse.`);
        return;
      }

      pagoActual.estado = 'Verificado';
      pagoActual.fechaVerificacion = hoyISO;
      let completada = false;
      if (ventaActual && ventaActual.estado === 'Pendiente' && pagadoVerificado(ventaActual) >= ventaActual.total - 0.001) {
        ventaActual.estado = 'Completada';
        completada = true;
      }
      guardar(PAGOS_KEY, pagos);
      guardar(VENTAS_KEY, ventas);
      renderCobranzas();
      renderCuentasPorCobrar();
      toast(completada ? `Pago verificado. La venta ${ventaActual.id} quedó aprobada como Completada en Ventas.` : `Pago ${pagoActual.id} verificado.`);
    }
  });
}

let pagoARechazar = null;

function seleccionarMotivoRechazoRapido(motivo) {
  const txt = $('rechazoMotivo');
  if (!txt) return;
  txt.value = motivo;
  txt.focus();
}

function abrirRechazo(id) {
  recargarDatos();
  const p = pagos.find(x => x.id === id);
  if (!p) return;
  const v = ventas.find(x => x.id === p.ventaId);
  pagoARechazar = id;
  const totalBsPago = montoBsDePago(p);
  const infoEl = $('rechazoInfo');
  if (infoEl) {
    infoEl.innerHTML = `
      <div class="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
        <span class="text-xs uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">Detalle del Pago Registrado</span>
        <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">${esc(p.id)} · Por Verificar</span>
      </div>
      <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Fecha del Pago:</span><span class="font-mono font-medium text-gray-800 dark:text-gray-200">${esc(fmtFecha(p.fecha))}</span></div>
      <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Cliente / RIF:</span><span class="font-semibold text-gray-900 dark:text-white">${esc(p.cliente)} <span class="text-xs font-mono text-gray-500 dark:text-gray-400">(${esc(rifDe(p.cliente))})</span></span></div>
      <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Venta Asociada:</span><span class="font-mono font-semibold text-[#1c4d37] dark:text-emerald-400">${esc(p.ventaId)}${v ? ` <span class="text-xs font-sans font-normal text-gray-500 dark:text-gray-400">(Total venta: ${usd(v.total)})</span>` : ''}</span></div>
      <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Método de Pago:</span><span class="font-semibold text-gray-800 dark:text-gray-100">${esc(p.metodo)}</span></div>
      ${p.banco ? `<div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Banco Emisor:</span><span class="font-medium text-[#1c4d37] dark:text-emerald-400">${esc(p.banco)}</span></div>` : ''}
      <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">N° de Referencia:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${esc(p.referencia ? p.referencia : 'Sin referencia (Efectivo en mano)')}</span></div>
      <div class="grid grid-cols-2 gap-2 pt-2 mt-1 border-t border-gray-200 dark:border-gray-700">
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5">
          <span class="text-[10px] uppercase font-bold text-gray-400 block">Monto ($ USD)</span>
          <span class="font-bold text-base text-gray-900 dark:text-white">${usd(p.monto)}</span>
        </div>
        <div class="bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-lg p-2.5">
          <span class="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 block">Monto (Bs.)</span>
          <span class="font-bold text-base text-red-600 dark:text-red-400">${bs(totalBsPago)}</span>
        </div>
      </div>
    `;
  }
  $('rechazoMotivo').value = '';
  openModal('modalRechazo');
  if (window.lucide) lucide.createIcons();
}

function confirmarRechazo(e) {
  e.preventDefault();
  recargarDatos();
  const p = pagos.find(x => x.id === pagoARechazar);
  const motivo = $('rechazoMotivo').value.trim();
  if (!p) return;
  if (!motivo) {
    toast('Debes indicar el motivo del rechazo.');
    return;
  }

  const detalleHtml = `
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">N° de Pago:</span><span class="font-bold text-red-600 dark:text-red-400">${esc(p.id)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Cliente:</span><span class="font-semibold text-gray-800 dark:text-gray-100">${esc(p.cliente)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Venta / Método:</span><span class="font-medium text-gray-700 dark:text-gray-200">${esc(p.ventaId)} · ${esc(p.metodo)}</span></div>
    <div class="flex justify-between items-baseline">
      <span class="text-gray-500 dark:text-gray-400">Monto:</span>
      <div class="text-right">
        <span class="font-bold text-gray-800 dark:text-gray-100">${usd(p.monto)}</span>
        <p class="text-[11px] font-semibold text-gray-500 dark:text-gray-400">${bs(montoBsDePago(p))}</p>
      </div>
    </div>
    <div class="border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
      <span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Motivo del rechazo:</span>
      <p class="text-xs font-medium text-red-600 dark:text-red-400">${esc(motivo)}</p>
    </div>
  `;

  confirmarAccionSistema({
    titulo: 'Confirmar Rechazo de Pago',
    mensaje: 'El pago quedará como Rechazado y el saldo volverá a quedar pendiente en Ventas.',
    icono: 'x-circle',
    variante: 'danger',
    textoConfirmar: 'Confirmar Rechazo',
    detalleHtml,
    onConfirm: () => {
      recargarDatos();
      const pagoObj = pagos.find(x => x.id === pagoARechazar);
      if (!pagoObj) return;
      pagoObj.estado = 'Rechazado';
      pagoObj.motivoRechazo = motivo;
      pagoObj.fechaVerificacion = hoyISO;
      guardar(PAGOS_KEY, pagos);
      closeModal('modalRechazo');
      renderCobranzas();
      renderCuentasPorCobrar();
      toast(`Pago ${pagoObj.id} rechazado. El saldo vuelve a quedar pendiente en Ventas.`);
    }
  });
}

function ordenarCxCPor(campo) {
  if (ordenCxC.campo === campo) {
    ordenCxC.dir = ordenCxC.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenCxC.campo = campo;
    ordenCxC.dir = campo === 'cliente' ? 'asc' : 'desc';
  }
  renderCuentasPorCobrar();
}

// Cuentas por cobrar: ventas Pendientes registradas en el Módulo de Ventas
function renderCuentasPorCobrar() {
  const tbody = $('tablaCxC');
  if (!tbody) return;
  const enVerif = v => pagos.filter(p => p.ventaId === v.id && p.estado === 'Por Verificar').reduce((t, p) => t + p.monto, 0);
  const rows = ventas.filter(v => v.estado === 'Pendiente').map(v => {
    const verif = pagadoVerificado(v);
    const espera = enVerif(v);
    const saldo = Math.max(0, v.total - verif);
    const tasa = Number(v.tasaBcv) > 0 ? Number(v.tasaBcv) : tasaBCV();
    return { v, verif, espera, saldo, tasa, f: ventaFacturada(v.id) };
  });

  const mult = ordenCxC.dir === 'asc' ? 1 : -1;
  rows.sort((a, b) => {
    switch (ordenCxC.campo) {
      case 'fecha':
        return String(a.v.fecha || '').localeCompare(String(b.v.fecha || '')) * mult;
      case 'cliente':
        return String(a.v.cliente || '').localeCompare(String(b.v.cliente || ''), 'es') * mult;
      case 'total':
        return ((Number(a.v.total) || 0) - (Number(b.v.total) || 0)) * mult;
      case 'verificado':
        return (a.verif - b.verif) * mult;
      case 'enVerif':
        return (a.espera - b.espera) * mult;
      case 'saldo':
        return (a.saldo - b.saldo) * mult;
      default:
        return 0;
    }
  });

  actualizarIconosOrden('sortIconCxC', ['fecha', 'cliente', 'total', 'verificado', 'enVerif', 'saldo'], ordenCxC);

  tbody.innerHTML = rows.length ? rows.map(({ v, verif, espera, saldo, tasa, f }) => `
    <tr class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
      <td class="py-3.5 px-4"><p class="font-semibold text-gray-900 dark:text-white">${esc(v.id)}</p><p class="text-xs text-gray-400 dark:text-gray-500 font-mono">${esc(fmtFecha(v.fecha))}${f ? ' · ' + esc(f.numero) : ' · Sin facturar'}</p></td>
      <td class="py-3.5 px-4"><p class="text-gray-800 dark:text-gray-100 font-medium">${esc(v.cliente)}</p><p class="text-xs text-gray-400 dark:text-gray-500">${esc(rifDe(v.cliente))}</p></td>
      <td class="py-3.5 px-4 text-right"><p class="font-medium text-gray-800 dark:text-gray-100">${usd(v.total)}</p><p class="text-[11px] text-gray-400 dark:text-gray-500">${bs(v.total * tasa)}</p></td>
      <td class="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400"><p class="font-medium">${usd(verif)}</p><p class="text-[11px] opacity-75">${bs(verif * tasa)}</p></td>
      <td class="py-3.5 px-4 text-right ${espera > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}"><p class="font-medium">${usd(espera)}</p><p class="text-[11px] opacity-75">${bs(espera * tasa)}</p></td>
      <td class="py-3.5 px-4 text-right"><p class="font-bold text-gray-900 dark:text-white">${usd(saldo)}</p><p class="text-xs font-semibold text-emerald-700 dark:text-emerald-400">${bs(saldo * tasa)}</p></td>
    </tr>`).join('') : '<tr><td colspan="6" class="text-center py-8 text-gray-400 dark:text-gray-500">No hay ventas con saldo pendiente en el Módulo de Ventas.</td></tr>';
  const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };
  set('kpiPorCobrar', usd(rows.reduce((t, r) => t + r.saldo, 0)));
  if (window.lucide) lucide.createIcons();
}

// ======================================================================
// ANULACIONES (anulaciones.php y facturacion.php)
// Se permite la anulación de cualquier factura emitida activa (incluyendo ventas Completadas).
// ======================================================================
const facturaActiva = f => f.estado !== 'Anulada';
const facturasPorAnular = () => facturas.filter(f => facturaActiva(f) && (ventas.find(v => v.id === f.ventaId) || {}).estado === 'Cancelada');

function asegurarModalAnulacion() {
  if ($('modalAnulacion')) return;
  const div = document.createElement('div');
  div.id = 'modalAnulacion';
  div.setAttribute('data-modal', '');
  div.className = 'fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200';
  div.onclick = function(ev) { if (ev.target === div) closeModal('modalAnulacion'); };
  div.innerHTML = `
    <form onsubmit="confirmarAnulacionFactura(event)" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
      <h3 class="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2"><i data-lucide="ban" class="w-5 h-5"></i> Anular Factura</h3>
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Factura</label>
        <div class="relative">
          <select id="anuFactura" required onchange="actualizarInfoAnulacion()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"></select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
      </div>
      <div id="anuInfo" class="p-3 rounded-lg text-sm border bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300"></div>
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Motivo de la anulación (obligatorio)</label>
        <textarea id="anuMotivo" required rows="3" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm disabled:opacity-50"></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal('modalAnulacion')" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
        <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm">Confirmar Anulación</button>
      </div>
    </form>`;
  document.body.appendChild(div);
  if (window.lucide) lucide.createIcons();
}

let facturaResumenAbierta = '';
let ordenBitacora = { campo: 'fecha', dir: 'desc' };

function ordenarBitacoraPor(campo) {
  if (ordenBitacora.campo === campo) {
    ordenBitacora.dir = ordenBitacora.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenBitacora.campo = campo;
    ordenBitacora.dir = (campo === 'fecha' || campo === 'monto') ? 'desc' : 'asc';
  }
  renderAnulaciones();
}

function construirResumenCortoFactura(f) {
  if (!f) return '';
  const v = ventas.find(x => x.id === f.ventaId);
  const tasaF = Number(f.tasa) || tasaBCV();
  const plazo = String(f.credito || (v && v.credito) || '0');
  const condicion = plazo === '0' ? '0 días (Mismo día)' : (plazo === '21+' ? '21 días o más' : `${plazo} días`);
  const estDesp = estadoDespachoDeFactura(f);
  const itemsHtml = (f.items || []).map(i => `
    <div class="flex justify-between items-center text-sm py-1.5 border-b border-gray-100 dark:border-gray-700/60 last:border-0 gap-3">
      <span class="text-gray-700 dark:text-gray-200 font-medium">${i.cantidad}× ${esc(i.nombre)}${i.contiene > 1 ? ` <span class="text-xs text-gray-400">(${i.cantidad * i.contiene} uds)</span>` : ''}</span>
      <span class="font-mono text-xs font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">${usd(i.precio * i.cantidad)} <span class="text-emerald-700 dark:text-emerald-400">(${bs(i.precio * i.cantidad * tasaF)})</span></span>
    </div>`).join('');

  return `
    <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm space-y-3 bg-white dark:bg-gray-800/90 p-4 rounded-xl shadow-inner">
      <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-700">
        <span class="text-xs font-bold uppercase tracking-wider text-[#1c4d37] dark:text-emerald-400 flex items-center gap-1.5">
          <i data-lucide="file-text" class="w-4 h-4"></i> Resumen de la Factura ${esc(f.numero)}
        </span>
        <span class="font-mono text-xs text-gray-500 dark:text-gray-400">Control: ${esc(f.control)} · Emisión: ${esc(fmtFecha(f.fecha))}</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div><span class="text-[11px] uppercase font-bold text-gray-400 block">Cliente / RIF</span><span class="font-semibold text-gray-800 dark:text-gray-100">${esc(f.cliente)} (${esc(f.rif)})</span></div>
        <div><span class="text-[11px] uppercase font-bold text-gray-400 block">Venta / Condición</span><span class="font-semibold text-gray-800 dark:text-gray-100">${esc(f.ventaId)} · ${esc(condicion)}</span></div>
        <div><span class="text-[11px] uppercase font-bold text-gray-400 block">Estado Venta / Despacho</span><span class="font-semibold text-[#1c4d37] dark:text-emerald-400">${esc(v ? v.estado : 'Realizada')} · ${esc(estDesp)}</span></div>
        <div><span class="text-[11px] uppercase font-bold text-gray-400 block">Tasa BCV</span><span class="font-semibold text-gray-800 dark:text-gray-100">${bs(tasaF)} / USD</span></div>
      </div>
      <div>
        <span class="text-[11px] uppercase font-bold text-gray-400 block mb-1.5">Productos Facturados (${(f.items || []).length} líneas)</span>
        <div class="bg-gray-50/70 dark:bg-gray-900/50 rounded-lg px-3 py-1.5 border border-gray-100 dark:border-gray-700">${itemsHtml || '<p class="text-xs text-gray-400 py-2">Sin detalle de productos</p>'}</div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div class="bg-gray-50 dark:bg-gray-900/70 rounded-xl p-3 flex justify-between items-center border border-gray-100 dark:border-gray-700">
          <div>
            <span class="text-[11px] uppercase font-bold text-gray-400 block">Total en Divisas ($ USD)</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Base: ${usd(f.base)} · IVA 16%: ${usd(f.iva)}</span>
          </div>
          <span class="text-base font-bold text-gray-900 dark:text-white">${usd(f.total)}</span>
        </div>
        <div class="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl p-3 flex justify-between items-center">
          <div>
            <span class="text-[11px] uppercase font-bold text-[#1c4d37] dark:text-emerald-400 block">Total en Bolívares (Bs.)</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Base: ${bs(f.base * tasaF)} · IVA: ${bs(f.iva * tasaF)}</span>
          </div>
          <span class="text-base font-bold text-[#1c4d37] dark:text-emerald-400">${bs(f.total * tasaF)}</span>
        </div>
      </div>
    </div>`;
}

function asegurarModalDetalleAnulacion() {
  if ($('modalDetalleAnulacion')) return $('modalDetalleAnulacion');
  const div = document.createElement('div');
  div.id = 'modalDetalleAnulacion';
  div.className = 'fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200';
  div.onclick = function(ev) { if (ev.target === div) closeModal('modalDetalleAnulacion'); };
  div.innerHTML = '<div id="modalDetalleAnulacionBody" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto"></div>';
  document.body.appendChild(div);
  return div;
}

function abrirDetalleAnulacion(tipoDoc, refId) {
  recargarDatos();
  asegurarModalDetalleAnulacion();
  const body = $('modalDetalleAnulacionBody');
  if (!body) return;

  let f = null;
  let v = null;
  if (tipoDoc === 'factura') {
    f = facturas.find(x => x.numero === refId) || null;
    if (f) v = ventas.find(x => x.id === f.ventaId) || null;
  } else {
    v = ventas.find(x => x.id === refId) || null;
    if (v) f = facturas.find(x => x.ventaId === v.id) || null;
  }
  if (!f && !v) return;

  const docTitulo = f ? f.numero : v.id;
  const subTitulo = f ? `Comprobante Fiscal · Ctrl ${esc(f.control)}` : 'Registro de Venta Anulada';
  const clienteNombre = (f && f.cliente) || (v && v.cliente) || '—';
  const clienteRif = (f && f.rif) || rifDe(clienteNombre) || '—';
  const fechaDoc = (f && f.fecha) || (v && v.fecha) || '';
  const tasaF = Number((f && f.tasa) || (v && v.tasaBcv) || tasaBCV());
  const plazo = String((f && f.credito) || (v && v.credito) || '0');
  const condicion = plazo === '0' ? '0 días (Mismo día)' : (plazo === '21+' ? '21 días o más' : `${plazo} días`);
  const itemsDoc = (f && Array.isArray(f.items) && f.items.length ? f.items : (v && v.items) || []);
  const totalUsd = Number((f && f.total) ?? (v && v.total) ?? 0);
  const baseUsd = Number((f && f.base) ?? (totalUsd / 1.16));
  const ivaUsd = Number((f && f.iva) ?? (totalUsd - baseUsd));
  const estDesp = f ? estadoDespachoDeFactura(f) : 'Sin factura';

  const facturaAnulada = f && !facturaActiva(f);
  const ventaAnulada = v && v.estado === 'Cancelada';
  const badgeDoc = facturaAnulada
    ? '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Factura Anulada</span>'
    : ventaAnulada && f
      ? '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Venta Anulada · Factura Pendiente</span>'
      : ventaAnulada
        ? '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Venta Anulada</span>'
        : '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Factura Activa</span>';

  let bannerEstado = '';
  if (facturaAnulada) {
    bannerEstado = `
      <div class="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-900/20 text-sm text-red-800 dark:text-red-300 flex gap-3">
        <i data-lucide="ban" class="w-5 h-5 flex-shrink-0 mt-0.5"></i>
        <div class="space-y-1">
          <p class="font-bold">Factura anulada el ${esc(fmtFecha(f.fechaAnulacion || fechaDoc))} · Origen: Facturación</p>
          <p class="leading-relaxed"><span class="font-semibold">Motivo:</span> ${esc(f.motivoAnulacion || 'Sin motivo registrado.')}</p>
        </div>
      </div>`;
  } else if (ventaAnulada) {
    bannerEstado = `
      <div class="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-800 dark:text-amber-300 flex gap-3">
        <i data-lucide="alert-triangle" class="w-5 h-5 flex-shrink-0 mt-0.5"></i>
        <div class="space-y-1">
          <p class="font-bold">Venta anulada el ${esc(fmtFecha((v.anulacion && v.anulacion.fecha) || fechaDoc))} · Origen: Ventas</p>
          <p class="leading-relaxed"><span class="font-semibold">Motivo:</span> ${esc((v.anulacion && v.anulacion.motivo) || 'Sin motivo registrado.')}</p>
          ${f ? '<p class="text-xs font-medium pt-0.5">Esta factura aún figura activa en Facturación y puede ser anulada desde "Solicitar Anulación".</p>' : ''}
        </div>
      </div>`;
  }

  const filasItems = itemsDoc.length ? itemsDoc.map(i => {
    const sub = (Number(i.precio) || 0) * (Number(i.cantidad) || 0);
    const udsTot = (Number(i.cantidad) || 0) * (Number(i.contiene) || 1);
    return `
    <tr>
      <td class="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">
        ${esc(i.nombre)}
        ${i.contiene > 1 ? `<span class="block text-[11px] text-gray-400">Contiene ${i.contiene} uds por empaque</span>` : ''}
      </td>
      <td class="py-3 px-4 text-center font-semibold text-gray-900 dark:text-gray-100">${i.cantidad}</td>
      <td class="py-3 px-4 text-center text-gray-500 dark:text-gray-400">${udsTot} uds</td>
      <td class="py-3 px-4 text-right font-mono text-xs text-gray-700 dark:text-gray-300">
        <p>${usd(i.precio)}</p>
        <p class="text-[11px] text-gray-400">${bs(i.precio * tasaF)}</p>
      </td>
      <td class="py-3 px-4 text-right font-semibold">
        <p class="text-gray-900 dark:text-gray-100">${usd(sub)}</p>
        <p class="text-xs text-emerald-700 dark:text-emerald-400">${bs(sub * tasaF)}</p>
      </td>
    </tr>`;
  }).join('') : '<tr><td colspan="5" class="py-6 text-center text-gray-400 text-sm">Sin productos registrados en este documento.</td></tr>';

  const ventaRef = (f && f.ventaId) || (v && v.id) || '';
  const pagosAsoc = ventaRef ? pagos.filter(p => p.ventaId === ventaRef) : [];
  const pagosHtml = pagosAsoc.length ? pagosAsoc.map(p => `
    <div class="flex items-center justify-between text-sm py-2.5">
      <div>
        <p class="font-medium text-gray-800 dark:text-gray-100">${esc(p.metodo)} <span class="text-xs text-gray-400 font-normal">· ${esc(p.referencia || 'Sin referencia')}</span>
          <span class="ml-1.5 text-[11px] px-2 py-0.5 rounded-full font-semibold ${p.estado === 'Anulado' || p.estado === 'Rechazado' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : p.estado === 'Por Verificar' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'}">${esc(p.estado)}</span>
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">${esc(fmtFecha(p.fecha))} · ${esc(p.id)}</p>
      </div>
      <div class="text-right">
        <p class="font-semibold text-gray-900 dark:text-white">${usd(p.monto)}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">${bs(p.monto * (p.tasa || tasaF))}</p>
      </div>
    </div>`).join('') : '<p class="text-sm text-gray-400 dark:text-gray-500 py-2">No hay pagos registrados para este documento.</p>';

  body.innerHTML = `
    <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase font-semibold tracking-wider text-gray-500 dark:text-gray-400">${subTitulo}</p>
        <h3 class="text-2xl font-bold text-[#1c4d37] dark:text-white mt-0.5">${esc(docTitulo)}</h3>
      </div>
      <div class="flex items-center gap-3">
        ${badgeDoc}
        <button type="button" onclick="closeModal('modalDetalleAnulacion')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Cerrar"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div><p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Cliente / RIF</p><p class="font-medium text-gray-800 dark:text-gray-100 mt-0.5">${esc(clienteNombre)}</p><p class="text-xs font-mono text-gray-400">${esc(clienteRif)}</p></div>
        <div><p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Fecha Emisión</p><p class="font-medium font-mono text-gray-800 dark:text-gray-100 mt-0.5">${esc(fmtFecha(fechaDoc))}</p></div>
        <div><p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Venta / Crédito</p><p class="font-medium text-[#1c4d37] dark:text-emerald-400 mt-0.5">${esc(ventaRef || '—')}</p><p class="text-xs text-gray-500">${esc(condicion)}</p></div>
        <div><p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Tasa BCV</p><p class="font-medium font-mono text-gray-800 dark:text-gray-100 mt-0.5">${bs(tasaF)}</p></div>
        <div><p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Despacho</p><p class="font-medium text-gray-800 dark:text-gray-100 mt-0.5">${esc(estDesp)}</p></div>
      </div>

      ${bannerEstado}

      <div class="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 dark:bg-gray-900/60 text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-400 font-bold border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th class="py-3 px-4">Producto</th>
                <th class="py-3 px-4 text-center">Cant.</th>
                <th class="py-3 px-4 text-center">Unidades</th>
                <th class="py-3 px-4 text-right">Precio Unit.</th>
                <th class="py-3 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">${filasItems}</tbody>
          </table>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1.5">Pagos asociados</p>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">${pagosHtml}</div>
        </div>
        <div class="space-y-3 self-start">
          <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2 text-sm border border-gray-100 dark:border-gray-700">
            <div class="flex justify-between text-gray-500 dark:text-gray-400"><span>Base Imponible ($ USD)</span><span class="font-medium text-gray-800 dark:text-gray-200">${usd(baseUsd)}</span></div>
            <div class="flex justify-between text-gray-500 dark:text-gray-400"><span>IVA (16%) ($ USD)</span><span class="font-medium text-gray-800 dark:text-gray-200">${usd(ivaUsd)}</span></div>
            <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-bold text-base text-gray-900 dark:text-white">
              <span>Total ($ USD)</span><span>${usd(totalUsd)}</span>
            </div>
          </div>
          <div class="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl p-4 space-y-2 text-sm">
            <div class="flex justify-between text-gray-600 dark:text-gray-300"><span>Base Imponible (Bs.)</span><span class="font-medium">${bs(baseUsd * tasaF)}</span></div>
            <div class="flex justify-between text-gray-600 dark:text-gray-300"><span>IVA 16% (Bs.)</span><span class="font-medium">${bs(ivaUsd * tasaF)}</span></div>
            <div class="flex justify-between pt-2 border-t border-emerald-200/70 dark:border-emerald-800/60 font-bold text-base text-[#1c4d37] dark:text-emerald-400">
              <span>Total (Bs.)</span><span>${bs(totalUsd * tasaF)}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <button type="button" onclick="closeModal('modalDetalleAnulacion')" class="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cerrar</button>
        ${f ? `<button type="button" onclick="closeModal('modalDetalleAnulacion'); vistaPreviaFactura('${f.numero}')" class="px-5 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-[#1c4d37] dark:text-emerald-300 text-sm font-semibold transition-colors flex items-center gap-1.5"><i data-lucide="printer" class="w-4 h-4"></i> Vista Previa / Imprimir</button>` : ''}
        ${f && facturaActiva(f) ? `<button type="button" onclick="closeModal('modalDetalleAnulacion'); abrirAnulacion('${f.numero}')" class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5"><i data-lucide="ban" class="w-4 h-4"></i> Solicitar Anulación</button>` : ''}
      </div>
    </div>
  `;

  const modal = $('modalDetalleAnulacion');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  requestAnimationFrame(() => modal.classList.remove('opacity-0'));
  if (window.lucide) lucide.createIcons();
}

function renderAnulaciones() {
  const tbody = $('tablaBitacora');
  const tbodyEmit = $('tablaAnulacionEmitidas');
  if (!tbody && !tbodyEmit) return;
  recargarDatos();

  const porAnular = facturasPorAnular();
  const qEmit = (($('busquedaEmitidasAnulacion') && $('busquedaEmitidasAnulacion').value) || '').toLowerCase();
  const activasParaAnular = facturas.filter(f => facturaActiva(f)).filter(f => {
    if (!qEmit) return true;
    return (f.numero + ' ' + f.ventaId + ' ' + f.cliente + ' ' + f.rif + ' ' + fmtFecha(f.fecha)).toLowerCase().includes(qEmit);
  }).sort((a, b) => {
    const va = ventas.find(x => x.id === a.ventaId);
    const vb = ventas.find(x => x.id === b.ventaId);
    const ca = va && va.estado === 'Cancelada' ? 0 : 1;
    const cb = vb && vb.estado === 'Cancelada' ? 0 : 1;
    if (ca !== cb) return ca - cb;
    return String(b.numero || '').localeCompare(String(a.numero || ''));
  });

  if (tbodyEmit) {
    tbodyEmit.innerHTML = activasParaAnular.length ? activasParaAnular.map(f => {
      const v = ventas.find(x => x.id === f.ventaId);
      const esCanceladaEnVentas = v && v.estado === 'Cancelada';
      const tasaF = Number(f.tasa) || tasaBCV();
      const estadoBadge = esCanceladaEnVentas
        ? `<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Venta anulada · Por anular factura</span>`
        : `<div class="flex flex-wrap gap-1 items-center">${badgeFactura(f)}${badgePago(v)}</div>`;

      return `
      <tr onclick="abrirDetalleAnulacion('factura', '${f.numero}')" class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${esCanceladaEnVentas ? 'bg-amber-50/40 dark:bg-amber-900/10' : ''}">
        <td class="py-3.5 px-4">
          <p class="font-semibold text-gray-900 dark:text-white">${esc(f.numero)}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">Venta ${esc(f.ventaId)}</p>
        </td>
        <td class="py-3.5 px-4">
          <p class="font-medium text-gray-800 dark:text-gray-100">${esc(f.cliente)}</p>
          <p class="text-xs font-mono text-gray-400 dark:text-gray-500">${esc(f.rif)}</p>
        </td>
        <td class="py-3.5 px-4 whitespace-nowrap font-mono text-xs">${esc(fmtFecha(f.fecha))}</td>
        <td class="py-3.5 px-4 text-right">
          <p class="font-bold text-gray-900 dark:text-white">${usd(f.total)}</p>
          <p class="text-xs font-semibold text-[#1c4d37] dark:text-emerald-400">${bs(f.total * tasaF)}</p>
        </td>
        <td class="py-3.5 px-4">${estadoBadge}</td>
        <td class="py-3.5 px-4 text-center">
          <button type="button" onclick="event.stopPropagation(); abrirDetalleAnulacion('factura', '${f.numero}')" class="text-gray-400 hover:text-[#1c4d37] dark:hover:text-emerald-400 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Ver detalles cómodamente">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>`;
    }).join('') : '<tr><td colspan="6" class="text-center py-8 text-gray-400 dark:text-gray-500">No hay facturas activas emitidas.</td></tr>';
  }

  if (tbody) {
    const registros = [
      ...ventas.filter(v => v.estado === 'Cancelada').map(v => ({
        fecha: v.anulacion ? v.anulacion.fecha : v.fecha, tipo: 'Venta', documento: v.id, cliente: v.cliente,
        monto: v.total, motivo: v.anulacion ? v.anulacion.motivo : 'Sin motivo registrado', origen: 'Ventas',
        refTipo: 'venta', refId: v.id
      })),
      ...facturas.filter(f => !facturaActiva(f)).map(f => ({
        fecha: f.fechaAnulacion, tipo: 'Factura', documento: `${f.numero} (Venta ${f.ventaId})`, cliente: f.cliente,
        monto: f.total, motivo: f.motivoAnulacion, origen: 'Facturación',
        refTipo: 'factura', refId: f.numero
      }))
    ];

    const q = (($('busquedaBitacora') && $('busquedaBitacora').value) || '').toLowerCase();
    const fTipo = ($('filtroTipoBitacora') && $('filtroTipoBitacora').value) || 'Todos';
    const filtrada = registros.filter(r => {
      if (fTipo !== 'Todos' && r.tipo !== fTipo) return false;
      return (r.documento + ' ' + r.cliente + ' ' + r.motivo + ' ' + fmtFecha(r.fecha)).toLowerCase().includes(q);
    });

    const mult = ordenBitacora.dir === 'asc' ? 1 : -1;
    const lista = [...filtrada].sort((a, b) => {
      switch (ordenBitacora.campo) {
        case 'fecha': return String(a.fecha || '').localeCompare(String(b.fecha || '')) * mult;
        case 'tipo': return String(a.tipo || '').localeCompare(String(b.tipo || ''), 'es') * mult;
        case 'documento': return String(a.documento || '').localeCompare(String(b.documento || '')) * mult;
        case 'cliente': return String(a.cliente || '').localeCompare(String(b.cliente || ''), 'es') * mult;
        case 'monto': return ((Number(a.monto) || 0) - (Number(b.monto) || 0)) * mult;
        case 'motivo': return String(a.motivo || '').localeCompare(String(b.motivo || ''), 'es') * mult;
        case 'origen': return String(a.origen || '').localeCompare(String(b.origen || ''), 'es') * mult;
        default: return 0;
      }
    });

    if (typeof actualizarIconosOrden === 'function') {
      actualizarIconosOrden('sortIconBit', ['fecha', 'tipo', 'documento', 'cliente', 'monto', 'motivo', 'origen'], ordenBitacora);
    }

    tbody.innerHTML = lista.length ? lista.map(r => `
      <tr onclick="abrirDetalleAnulacion('${r.refTipo}', '${r.refId}')" class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
        <td class="py-3.5 px-4 whitespace-nowrap font-mono text-xs">${esc(fmtFecha(r.fecha))}</td>
        <td class="py-3.5 px-4"><span class="px-2.5 py-1 text-xs font-semibold rounded-full ${r.tipo === 'Factura' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}">${r.tipo}</span></td>
        <td class="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">${esc(r.documento)}</td>
        <td class="py-3.5 px-4">${esc(r.cliente)}</td>
        <td class="py-3.5 px-4 text-right font-semibold">${usd(r.monto)}<p class="text-[11px] font-normal text-gray-400">${bs(r.monto * tasaBCV())}</p></td>
        <td class="py-3.5 px-4 max-w-xs truncate" title="${esc(r.motivo)}">${esc(r.motivo)}</td>
        <td class="py-3.5 px-4 text-xs text-gray-500 dark:text-gray-400">${r.origen}</td>
        <td class="py-3.5 px-4 text-center">
          <button type="button" onclick="event.stopPropagation(); abrirDetalleAnulacion('${r.refTipo}', '${r.refId}')" class="text-gray-400 hover:text-[#1c4d37] dark:hover:text-emerald-400 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Ver detalles completos">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>`).join('')
      : '<tr><td colspan="8" class="text-center py-10 text-gray-400 dark:text-gray-500">No hay anulaciones registradas.</td></tr>';
  }

  const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };
  set('kpiVentasAnuladas', ventas.filter(v => v.estado === 'Cancelada').length);
  set('kpiFacturasAnuladas', facturas.filter(f => !facturaActiva(f)).length);
  set('kpiPorAnular', porAnular.length || activasParaAnular.length);
  if (window.lucide) lucide.createIcons();
}

// Solicitud de anulación: permite anular cualquier factura emitida activa (incluyendo facturas ya realizadas)
function abrirSolicitudAnulacion() {
  asegurarModalAnulacion();
  recargarDatos();
  const anulables = facturas.filter(f => facturaActiva(f));
  const sel = $('anuFactura');
  sel.innerHTML = '<option value="" disabled selected>Seleccionar factura</option>' +
    anulables.map(f => {
      const v = ventas.find(x => x.id === f.ventaId);
      const estV = v ? v.estado : 'Realizada';
      return `<option value="${f.numero}">${f.numero} · Venta ${f.ventaId} (${estV}) · ${esc(f.cliente)} · ${usd(f.total)}</option>`;
    }).join('');
  sel.disabled = anulables.length === 0;
  $('anuMotivo').value = '';
  $('anuInfo').innerHTML = anulables.length
    ? 'Selecciona una factura emitida para ver su resumen fiscal e indicar el motivo de anulación.'
    : 'No hay facturas activas disponibles para anular.';
  openModal('modalAnulacion');
}

function abrirAnulacion(numero) {
  abrirSolicitudAnulacion();
  if ($('anuFactura')) {
    $('anuFactura').value = numero;
    actualizarInfoAnulacion();
  }
}

function actualizarInfoAnulacion() {
  const f = facturas.find(x => x.numero === $('anuFactura').value);
  if (!f) return;
  const v = ventas.find(x => x.id === f.ventaId);
  let aviso = '';
  if (!v) {
    aviso = `<p class="mb-1">Se anulará el comprobante fiscal <b>${esc(f.numero)}</b> emitido a ${esc(f.cliente)}.</p>`;
  } else if (v.estado === 'Cancelada') {
    aviso = `<p class="mb-1">La venta ${esc(v.id)} ya fue anulada en Ventas. Se anulará la factura <b>${esc(f.numero)}</b>.</p>`;
    if (!$('anuMotivo').value && v.anulacion) $('anuMotivo').value = v.anulacion.motivo;
  } else {
    const espera = pagos.filter(p => p.ventaId === v.id && (p.estado === 'Por Verificar' || pagoVerificado(p))).reduce((t, p) => t + p.monto, 0);
    aviso = `<p class="mb-1">La factura <b>${esc(f.numero)}</b> (Venta ${esc(v.id)} · estado <b>${esc(v.estado)}</b>) será anulada formalmente${espera > 0 ? ` y se revertirán sus cobros registrados (${usd(espera)})` : ''}.</p>`;
  }
  $('anuInfo').innerHTML = aviso + construirResumenCortoFactura(f);
  if (window.lucide) lucide.createIcons();
}

function reintegrarStockVentaAnulada(ventaObj) {
  if (!ventaObj || !ventaObj.stockDescontado || !Array.isArray(ventaObj.items)) return;
  try {
    const inv = JSON.parse(localStorage.getItem('gs_inventario_v1'));
    if (Array.isArray(inv)) {
      ventaObj.items.forEach(linea => {
        const itemInv = inv.find(x => x.id === linea.id);
        if (itemInv) itemInv.stock = (Number(itemInv.stock) || 0) + (Number(linea.cantidad) || 0);
      });
      localStorage.setItem('gs_inventario_v1', JSON.stringify(inv));
    }
    ventaObj.stockDescontado = false;
  } catch (err) { /* ignorar error de inventario */ }
}

function confirmarAnulacionFactura(e) {
  e.preventDefault();
  recargarDatos();
  const f = facturas.find(x => x.numero === $('anuFactura').value);
  const motivo = $('anuMotivo').value.trim();
  if (!f) { toast('Selecciona la factura a anular.'); return; }
  if (!motivo) { toast('El motivo de la anulación es obligatorio.'); return; }

  const detalleHtml = `
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Factura / Control:</span><span class="font-bold text-red-600 dark:text-red-400">${esc(f.numero)} · ${esc(f.control)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Fecha de Emisión:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${esc(fmtFecha(f.fecha))}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Cliente / RIF:</span><span class="font-semibold text-gray-800 dark:text-gray-100">${esc(f.cliente)} (${esc(f.rif)})</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Venta Asociada:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${esc(f.ventaId)}</span></div>
    <div class="grid grid-cols-2 gap-2 pt-2 mt-1 border-t border-gray-200 dark:border-gray-700">
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5">
        <span class="text-[10px] uppercase font-bold text-gray-400 block">Total ($ USD)</span>
        <span class="font-bold text-base text-gray-900 dark:text-white">${usd(f.total)}</span>
      </div>
      <div class="bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-lg p-2.5">
        <span class="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 block">Total (Bs.)</span>
        <span class="font-bold text-base text-red-600 dark:text-red-400">${bs(f.total * f.tasa)}</span>
      </div>
    </div>
    <div class="border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
      <span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Motivo de anulación fiscal:</span>
      <p class="text-xs font-medium text-red-600 dark:text-red-400">${esc(motivo)}</p>
    </div>
  `;

  confirmarAccionSistema({
    titulo: 'Confirmar Anulación de Factura',
    mensaje: 'El comprobante fiscal quedará anulado de forma permanente en el Libro de Facturación.',
    icono: 'ban',
    variante: 'danger',
    textoConfirmar: 'Confirmar Anulación',
    detalleHtml,
    onConfirm: () => {
      recargarDatos();
      const facObj = facturas.find(x => x.numero === f.numero);
      if (!facObj) return;
      const ventaObj = ventas.find(x => x.id === facObj.ventaId);
      facObj.estado = 'Anulada';
      facObj.motivoAnulacion = motivo;
      facObj.fechaAnulacion = hoyISO;
      if (ventaObj && ventaObj.estado !== 'Cancelada') {
        ventaObj.estado = 'Cancelada';
        ventaObj.anulacion = { motivo: `Anulada desde Facturación (${facObj.numero}): ${motivo}`, fecha: hoyISO };
        pagos.filter(p => p.ventaId === ventaObj.id && p.estado !== 'Rechazado').forEach(p => { p.estado = 'Anulado'; });
        reintegrarStockVentaAnulada(ventaObj);
        guardar(VENTAS_KEY, ventas);
        guardar(PAGOS_KEY, pagos);
      }
      guardar(FACTURAS_KEY, facturas);
      closeModal('modalAnulacion');
      renderFacturas();
      renderAnulaciones();
      renderReportesFacturacion();
      initDashboardFacturacion();
      toast(`Factura ${facObj.numero} anulada correctamente.`);
    }
  });
}

// ======================================================================
// REPORTES DE FACTURACIÓN (reportes.php)
// ======================================================================
function detectarLineaDeItemFact(item) {
  const txt = ((item.id || '') + ' ' + (item.nombre || '')).toLowerCase();
  if (txt.includes('muchy')) return 'Muchy';
  if (txt.includes('puig') || txt.includes('maría') || txt.includes('maria') || txt.includes('katy')) return 'Galleterías PUIG';
  if (txt.includes('fisa') || txt.includes('every night') || txt.includes('crema') || txt.includes('jabón') || txt.includes('jabon') || txt.includes('desodorante')) return 'Fisa';
  return 'General';
}

function lineasDeFactura(f) {
  const set = new Set((f.items || []).map(detectarLineaDeItemFact));
  return [...set];
}

function estadoCategorizadoFactura(f) {
  if (f.estado === 'Anulada') return 'Anulada';
  const v = ventas.find(x => x.id === f.ventaId);
  if (v && v.estado === 'Cancelada') return 'Anulada';
  if (v && v.estado === 'Completada') return 'Pagada';
  return 'Pendiente';
}

function poblarSelectClientesReporteFacturacion() {
  const sel = $('repFacCliente');
  if (!sel) return;
  const actual = sel.value || 'Todos';
  const nombres = [...new Set([...facturas.map(f => f.cliente), ...ventas.map(v => v.cliente), ...clientes.map(c => c.nombre)].filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  sel.innerHTML = '<option value="Todos">Todos los Clientes</option>' +
    nombres.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
  if (nombres.includes(actual)) sel.value = actual;
}

function obtenerFacturasFiltradasReporte() {
  recargarDatos();
  const fCli = ($('repFacCliente') && $('repFacCliente').value) || 'Todos';
  const fEst = ($('repFacEstado') && $('repFacEstado').value) || 'Todos';
  const fLin = ($('repFacLinea') && $('repFacLinea').value) || 'Todas';
  const fDesde = ($('repFacDesde') && $('repFacDesde').value) || '';
  const fHasta = ($('repFacHasta') && $('repFacHasta').value) || '';

  return facturas.filter(f => {
    if (fCli !== 'Todos' && f.cliente !== fCli) return false;
    const estCat = estadoCategorizadoFactura(f);
    if (fEst === 'Emitida' && f.estado === 'Anulada') return false;
    if (fEst === 'Pagada' && estCat !== 'Pagada') return false;
    if (fEst === 'Pendiente' && estCat !== 'Pendiente') return false;
    if (fEst === 'Anulada' && estCat !== 'Anulada') return false;
    if (fLin !== 'Todas' && !lineasDeFactura(f).includes(fLin)) return false;
    if (fDesde && (f.fecha || '') < fDesde) return false;
    if (fHasta && (f.fecha || '') > fHasta) return false;
    return true;
  });
}

function limpiarFiltrosReporteFacturacion() {
  if ($('repFacCliente')) $('repFacCliente').value = 'Todos';
  if ($('repFacEstado')) $('repFacEstado').value = 'Todos';
  if ($('repFacLinea')) $('repFacLinea').value = 'Todas';
  if ($('repFacDesde')) $('repFacDesde').value = '';
  if ($('repFacHasta')) $('repFacHasta').value = '';
  renderReportesFacturacion();
}

let ordenRepFac = { campo: 'numero', dir: 'desc' };
let ordenRepFacCli = { campo: 'totalUsd', dir: 'desc' };

function ordenarRepFacPor(campo) {
  if (ordenRepFac.campo === campo) {
    ordenRepFac.dir = ordenRepFac.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenRepFac.campo = campo;
    ordenRepFac.dir = (campo === 'cliente' || campo === 'linea' || campo === 'estado') ? 'asc' : 'desc';
  }
  renderReportesFacturacion();
}

function ordenarRepFacCliPor(campo) {
  if (ordenRepFacCli.campo === campo) {
    ordenRepFacCli.dir = ordenRepFacCli.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenRepFacCli.campo = campo;
    ordenRepFacCli.dir = (campo === 'cliente' || campo === 'rif') ? 'asc' : 'desc';
  }
  renderReportesFacturacion();
}

function switchTabReporteFacturacion(tab) {
  const esFacturas = tab !== 'clientes';
  const wrapFac = $('wrapRepFac-facturas');
  const wrapCli = $('wrapRepFac-clientes');
  if (wrapFac) wrapFac.classList.toggle('hidden', !esFacturas);
  if (wrapCli) wrapCli.classList.toggle('hidden', esFacturas);

  const clsOn = 'px-4 py-2 rounded-xl text-xs font-bold transition-colors bg-[#1c4d37] text-white dark:bg-emerald-600 shadow-sm flex items-center gap-1.5';
  const clsOff = 'px-4 py-2 rounded-xl text-xs font-bold transition-colors bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1.5';
  if ($('tabRepFac-facturas')) $('tabRepFac-facturas').className = esFacturas ? clsOn : clsOff;
  if ($('tabRepFac-clientes')) $('tabRepFac-clientes').className = !esFacturas ? clsOn : clsOff;
}

function renderReportesFacturacion() {
  const tbody = $('tablaReporteFacturacion');
  if (!tbody) return;
  recargarDatos();
  poblarSelectClientesReporteFacturacion();
  const listaBase = obtenerFacturasFiltradasReporte();

  const multFac = ordenRepFac.dir === 'asc' ? 1 : -1;
  const lista = [...listaBase].sort((a, b) => {
    const ta = (Number(a.total) || 0) * (Number(a.tasa) || tasaBCV());
    const tb = (Number(b.total) || 0) * (Number(b.tasa) || tasaBCV());
    switch (ordenRepFac.campo) {
      case 'numero': return String(a.numero || '').localeCompare(String(b.numero || '')) * multFac;
      case 'fecha': return String(a.fecha || '').localeCompare(String(b.fecha || '')) * multFac;
      case 'cliente': return String(a.cliente || '').localeCompare(String(b.cliente || ''), 'es') * multFac;
      case 'linea': return lineasDeFactura(a).join(',').localeCompare(lineasDeFactura(b).join(','), 'es') * multFac;
      case 'base': return ((Number(a.base) || 0) - (Number(b.base) || 0)) * multFac;
      case 'total': return ((Number(a.total) || 0) - (Number(b.total) || 0)) * multFac;
      case 'totalBs': return (ta - tb) * multFac;
      case 'estado': return estadoCategorizadoFactura(a).localeCompare(estadoCategorizadoFactura(b), 'es') * multFac;
      default: return 0;
    }
  });

  if (typeof actualizarIconosOrden === 'function') {
    actualizarIconosOrden('sortIconRepFac', ['numero', 'fecha', 'cliente', 'linea', 'total', 'totalBs', 'estado'], ordenRepFac);
  }

  const activas = lista.filter(f => f.estado !== 'Anulada');
  const anuladas = lista.filter(f => f.estado === 'Anulada');
  const totalUsd = activas.reduce((t, f) => t + (Number(f.total) || 0), 0);
  const baseUsd = activas.reduce((t, f) => t + (Number(f.base) || 0), 0);
  const ivaUsd = activas.reduce((t, f) => t + (Number(f.iva) || 0), 0);
  const totalBs = activas.reduce((t, f) => t + (Number(f.total) || 0) * (Number(f.tasa) || tasaBCV()), 0);
  const baseBs = activas.reduce((t, f) => t + (Number(f.base) || 0) * (Number(f.tasa) || tasaBCV()), 0);
  const ivaBs = activas.reduce((t, f) => t + (Number(f.iva) || 0) * (Number(f.tasa) || tasaBCV()), 0);

  const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };
  set('kpiRepFacTotal', `${lista.length} ${lista.length === 1 ? 'Factura' : 'Facturas'}`);
  set('kpiRepFacSub', `${activas.length} vigentes · ${anuladas.length} anuladas`);
  set('kpiRepFacIvaUsd', usd(ivaUsd));
  set('kpiRepFacIvaBs', bs(ivaBs));
  set('kpiRepFacMontoUsd', usd(totalUsd));
  set('kpiRepFacBaseUsd', `Base imponible: ${usd(baseUsd)}`);
  set('kpiRepFacMontoBs', bs(totalBs));
  set('kpiRepFacBaseBs', `Base imponible: ${bs(baseBs)}`);

  tbody.innerHTML = lista.length ? lista.map(f => {
    const v = ventas.find(x => x.id === f.ventaId);
    const tasaF = Number(f.tasa) || tasaBCV();
    const lineas = lineasDeFactura(f);
    return `
    <tr onclick="vistaPreviaFactura('${f.numero}')" class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
      <td class="py-3.5 px-4">
        <p class="font-bold text-gray-900 dark:text-white">${esc(f.numero)}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">Venta ${esc(f.ventaId)}</p>
      </td>
      <td class="py-3.5 px-4">
        <p class="font-semibold text-gray-800 dark:text-gray-100">${esc(f.cliente)}</p>
        <p class="text-xs font-mono text-gray-400 dark:text-gray-500">${esc(f.rif)} · <span class="font-sans font-bold text-[#1c4d37] dark:text-emerald-400">${esc(rutaDe(f.cliente, v))}</span></p>
      </td>
      <td class="py-3.5 px-4 font-mono text-xs whitespace-nowrap">${esc(fmtFecha(f.fecha))}</td>
      <td class="py-3.5 px-4">
        <div class="flex flex-wrap gap-1">${lineas.map(l => `<span class="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-300">${esc(l)}</span>`).join('')}</div>
      </td>
      <td class="py-3.5 px-4 text-right whitespace-nowrap">
        <p class="font-bold text-gray-900 dark:text-white">${usd(f.total)}</p>
        <p class="text-[11px] text-gray-400 dark:text-gray-500">Base ${usd(f.base)} · IVA ${usd(f.iva)}</p>
      </td>
      <td class="py-3.5 px-4 text-right whitespace-nowrap">
        <p class="font-bold text-[#1c4d37] dark:text-emerald-400">${bs(f.total * tasaF)}</p>
      </td>
      <td class="py-3.5 px-4 text-center"><div class="inline-flex flex-col items-center gap-1">${badgeFactura(f)}${badgePago(v)}</div></td>
    </tr>`;
  }).join('') : '<tr><td colspan="7" class="text-center py-10 text-gray-400 dark:text-gray-500">No se encontraron facturas para los filtros seleccionados.</td></tr>';

  const tbodyCli = $('tablaReporteFacClientes');
  if (tbodyCli) {
    const porCli = {};
    activas.forEach(f => {
      if (!porCli[f.cliente]) {
        porCli[f.cliente] = { cliente: f.cliente, rif: f.rif || rifDe(f.cliente), count: 0, totalUsd: 0, totalBs: 0, cobradoUsd: 0 };
      }
      const tasaF = Number(f.tasa) || tasaBCV();
      const v = ventas.find(x => x.id === f.ventaId);
      const cobrado = v ? pagadoVerificado(v) : 0;
      porCli[f.cliente].count += 1;
      porCli[f.cliente].totalUsd += Number(f.total) || 0;
      porCli[f.cliente].totalBs += (Number(f.total) || 0) * tasaF;
      porCli[f.cliente].cobradoUsd += cobrado;
    });
    const multCli = ordenRepFacCli.dir === 'asc' ? 1 : -1;
    const rowsCli = Object.values(porCli).sort((a, b) => {
      const sa = Math.max(0, a.totalUsd - a.cobradoUsd);
      const sb = Math.max(0, b.totalUsd - b.cobradoUsd);
      switch (ordenRepFacCli.campo) {
        case 'cliente': return String(a.cliente || '').localeCompare(String(b.cliente || ''), 'es') * multCli;
        case 'rif': return String(a.rif || '').localeCompare(String(b.rif || '')) * multCli;
        case 'count': return (a.count - b.count) * multCli;
        case 'totalUsd': return (a.totalUsd - b.totalUsd) * multCli;
        case 'totalBs': return (a.totalBs - b.totalBs) * multCli;
        case 'cobradoUsd': return (a.cobradoUsd - b.cobradoUsd) * multCli;
        case 'saldo': return (sa - sb) * multCli;
        default: return 0;
      }
    });
    if (typeof actualizarIconosOrden === 'function') {
      actualizarIconosOrden('sortIconRepCli', ['cliente', 'rif', 'count', 'totalUsd', 'totalBs', 'cobradoUsd', 'saldo'], ordenRepFacCli);
    }
    tbodyCli.innerHTML = rowsCli.length ? rowsCli.map(r => {
      const saldo = Math.max(0, r.totalUsd - r.cobradoUsd);
      return `
      <tr class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
        <td class="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">${esc(r.cliente)}</td>
        <td class="py-3.5 px-4 font-mono text-xs text-gray-500 dark:text-gray-400">${esc(r.rif)}</td>
        <td class="py-3.5 px-4 text-center font-bold text-[#1c4d37] dark:text-emerald-400">${r.count}</td>
        <td class="py-3.5 px-4 text-right font-bold text-gray-900 dark:text-white">${usd(r.totalUsd)}</td>
        <td class="py-3.5 px-4 text-right font-semibold text-[#1c4d37] dark:text-emerald-400">${bs(r.totalBs)}</td>
        <td class="py-3.5 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">${usd(r.cobradoUsd)}</td>
        <td class="py-3.5 px-4 text-right font-bold ${saldo > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}">${usd(saldo)}</td>
      </tr>`;
    }).join('') : '<tr><td colspan="7" class="text-center py-8 text-gray-400 dark:text-gray-500">No hay datos consolidados por cliente con los filtros actuales.</td></tr>';
  }
  if (window.lucide) lucide.createIcons();
}

function descargarReporteFacturacionCSV() {
  const lista = obtenerFacturasFiltradasReporte();
  if (!lista.length) {
    toast('No hay facturas en el filtro actual para exportar.');
    return;
  }
  const encabezados = ['N° Factura', 'N° Control', 'Venta Asociada', 'Fecha', 'Cliente', 'RIF', 'Ruta', 'Líneas', 'Base Imponible ($)', 'IVA 16% ($)', 'Total ($ USD)', 'Tasa BCV', 'Total (Bs.)', 'Estado'];
  const filasCsv = lista.map(f => {
    const v = ventas.find(x => x.id === f.ventaId);
    const tasaF = Number(f.tasa) || tasaBCV();
    const est = estadoCategorizadoFactura(f);
    return [
      f.numero,
      f.control,
      f.ventaId,
      fmtFecha(f.fecha),
      f.cliente,
      f.rif,
      rutaDe(f.cliente, v),
      lineasDeFactura(f).join(' / '),
      (Number(f.base) || 0).toFixed(2),
      (Number(f.iva) || 0).toFixed(2),
      (Number(f.total) || 0).toFixed(2),
      tasaF.toFixed(2),
      ((Number(f.total) || 0) * tasaF).toFixed(2),
      est
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';');
  });
  const contenido = '\uFEFF' + [encabezados.join(';'), ...filasCsv].join('\r\n');
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Reporte_Facturacion_GentilSupply_${fmtFecha(hoyISO)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast(`Reporte CSV descargado (${lista.length} comprobantes).`);
}

function imprimirReporteFacturacion() {
  const lista = obtenerFacturasFiltradasReporte();
  if (!lista.length) {
    toast('No hay comprobantes en el filtro actual para imprimir.');
    return;
  }
  const activas = lista.filter(f => f.estado !== 'Anulada');
  const totalUsd = activas.reduce((t, f) => t + (Number(f.total) || 0), 0);
  const totalBs = activas.reduce((t, f) => t + (Number(f.total) || 0) * (Number(f.tasa) || tasaBCV()), 0);
  const filasHtml = lista.map(f => {
    const v = ventas.find(x => x.id === f.ventaId);
    const tasaF = Number(f.tasa) || tasaBCV();
    return `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb"><b>${esc(f.numero)}</b><br><span style="font-size:10px;color:#6b7280">Venta ${esc(f.ventaId)}</span></td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb">${esc(fmtFecha(f.fecha))}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb">${esc(f.cliente)}<br><span style="font-size:10px;color:#6b7280">${esc(f.rif)} · <b style="color:#1c4d37">${esc(rutaDe(f.cliente, v))}</b></span></td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb">${esc(lineasDeFactura(f).join(', '))}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:right">${usd(f.base)} / ${usd(f.iva)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${usd(f.total)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${bs(f.total * tasaF)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:center">${esc(estadoCategorizadoFactura(f))}</td>
      </tr>`;
  }).join('');

  $('zonaImpresion').innerHTML = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;font-size:11.5px;line-height:1.4;font-variant-numeric:tabular-nums">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1c4d37;padding-bottom:10px;margin-bottom:12px">
        <div>
          <div style="font-size:17px;font-weight:800;color:#1c4d37">${esc(EMPRESA.razonSocial)}</div>
          <div style="font-size:12px;font-weight:700;color:#374151;margin-top:2px">Libro y Reporte Fiscal de Facturación</div>
          <div style="font-size:10.5px;color:#6b7280">RIF: ${esc(EMPRESA.rif)} · Registros: ${lista.length} facturas</div>
        </div>
        <div style="text-align:right;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:7px 12px">
          <div style="font-size:10.5px;color:#4b5563">Fecha de emisión: <b>${esc(fmtFecha(hoyISO))}</b></div>
          <div style="font-size:12px;color:#1c4d37">Total ($ USD): <b>${usd(totalUsd)}</b></div>
          <div style="font-size:11px;color:#374151">Total (Bs.): <b>${bs(totalBs)}</b></div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f3f4f6;border-top:1px solid #d1d5db;border-bottom:1.5px solid #1c4d37">
            <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:#1c4d37">Factura</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:#1c4d37">Fecha</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:#1c4d37">Cliente / RIF</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:#1c4d37">Línea</th>
            <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:#1c4d37">Base / IVA</th>
            <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:#1c4d37">Total ($)</th>
            <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:#1c4d37">Total (Bs.)</th>
            <th style="padding:7px 8px;text-align:center;font-size:10px;text-transform:uppercase;color:#1c4d37">Estado</th>
          </tr>
        </thead>
        <tbody>${filasHtml}</tbody>
      </table>
      <div class="print-footer-preview" style="margin-top:18px;padding-top:8px;border-top:1px solid #d1d5db;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#1c4d37;font-weight:700">
        <span>Página 1/1</span>
        <span style="font-size:10px;font-weight:500;color:#6b7280">${esc(EMPRESA.razonSocial)}</span>
      </div>
    </div>`;
  _tituloOriginalDoc = document.title;
  document.title = '\u200B';
  window.print();
}

// ======================================================================
// DASHBOARD DE FACTURACIÓN (dashboard.php) - Conectado a Datos Reales
// ======================================================================
let chartFacturacionBsInst = null;
let chartCobranzasInst = null;

function initDashboardFacturacion() {
  const kpiEmitidas = $('dashFacEmitidas');
  if (!kpiEmitidas) return;
  recargarDatos();

  const tasaActual = tasaBCV();
  const activas = facturas.filter(f => f.estado !== 'Anulada');
  const anuladas = facturas.filter(f => f.estado === 'Anulada');
  const totalUsd = activas.reduce((t, f) => t + (Number(f.total) || 0), 0);
  const totalBs = activas.reduce((t, f) => t + (Number(f.total) || 0) * (Number(f.tasa) || tasaActual), 0);
  const cobradoVerifUsd = pagos.filter(p => pagoVerificado(p)).reduce((t, p) => t + (Number(p.monto) || 0), 0);
  const pendFacturar = ventasPorFacturar();
  const pagosPorVerif = pagos.filter(p => p.estado === 'Por Verificar');
  const montoPorVerif = pagosPorVerif.reduce((t, p) => t + (Number(p.monto) || 0), 0);
  const saldoPorCobrarUsd = ventas
    .filter(v => v.estado !== 'Cancelada')
    .reduce((t, v) => t + Math.max(0, (Number(v.total) || 0) - pagadoVerificado(v)), 0);
  const montoAnuladoRechazado = pagos
    .filter(p => p.estado === 'Rechazado' || p.estado === 'Anulado')
    .reduce((t, p) => t + (Number(p.monto) || 0), 0)
    + anuladas.reduce((t, f) => t + (Number(f.total) || 0), 0);

  const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };
  set('dashFacEmitidas', `${activas.length}`);
  set('dashFacEmitidasSub', `${activas.length === 1 ? '1 comprobante vigente' : activas.length + ' comprobantes vigentes'} · ${anuladas.length} ${anuladas.length === 1 ? 'anulada' : 'anuladas'}`);
  set('dashFacTotalBs', bs(totalBs));
  set('dashFacTasaSub', `Tasa BCV: ${bs(tasaActual)} / USD`);
  set('dashFacTotalUsd', usd(totalUsd));
  set('dashFacCobradoSub', `Cobrado verificado: ${usd(cobradoVerifUsd)}`);
  set('dashFacPendientes', `${pendFacturar.length} ${pendFacturar.length === 1 ? 'Venta' : 'Ventas'}`);
  set('dashFacPorVerifSub', `${pagosPorVerif.length} ${pagosPorVerif.length === 1 ? 'cobro por verificar' : 'cobros por verificar'} (${usd(montoPorVerif)})`);

  if (!window.Chart) return;
  const isDark = document.documentElement.classList.contains('dark');
  const tickColor = isDark ? '#d1d5db' : '#374151';
  const gridColor = isDark ? 'rgba(75, 85, 99, 0.25)' : 'rgba(229, 231, 235, 0.8)';

  // Gráfica 1: Facturación en Bolívares por comprobante/fecha real
  const canvasFacBs = $('chartFacturacionBs');
  if (canvasFacBs) {
    const ordenadas = [...activas].sort((a, b) => (a.fecha || '').localeCompare(b.fecha || '') || (a.correlativo || 0) - (b.correlativo || 0));
    const labelsFac = ordenadas.length
      ? ordenadas.map(f => `${f.numero} (${fmtFecha(f.fecha).slice(0, 5)})`)
      : ['Sin facturas'];
    const dataFacBs = ordenadas.length
      ? ordenadas.map(f => r2((Number(f.total) || 0) * (Number(f.tasa) || tasaActual)))
      : [0];

    if (chartFacturacionBsInst) chartFacturacionBsInst.destroy();
    chartFacturacionBsInst = new Chart(canvasFacBs.getContext('2d'), {
      type: 'line',
      data: {
        labels: labelsFac,
        datasets: [{
          label: 'Total Facturado (Bs.)',
          data: dataFacBs,
          borderColor: isDark ? '#34d399' : '#1c4d37',
          backgroundColor: isDark ? 'rgba(52, 211, 153, 0.14)' : 'rgba(28, 77, 55, 0.12)',
          borderWidth: 2,
          tension: 0.35,
          fill: true,
          pointBackgroundColor: isDark ? '#34d399' : '#1c4d37',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: tickColor } },
          tooltip: {
            callbacks: {
              label: ctx => {
                const f = ordenadas[ctx.dataIndex];
                if (!f) return bs(ctx.parsed.y || 0);
                return `${f.cliente}: ${bs(ctx.parsed.y)} (${usd(f.total)})`;
              }
            }
          }
        },
        scales: {
          x: { ticks: { color: tickColor }, grid: { color: gridColor } },
          y: { beginAtZero: true, ticks: { color: tickColor }, grid: { color: gridColor } }
        }
      }
    });
  }

  // Gráfica 2: Estado Real de Cobranzas ($ USD)
  const canvasCob = $('chartCobranzas');
  if (canvasCob) {
    if (chartCobranzasInst) chartCobranzasInst.destroy();
    chartCobranzasInst = new Chart(canvasCob.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Cobrado Verificado', 'Por Verificar', 'Saldo por Cobrar', 'Anulado / Rechazado'],
        datasets: [{
          label: 'Monto ($ USD)',
          data: [
            r2(cobradoVerifUsd),
            r2(montoPorVerif),
            r2(saldoPorCobrarUsd),
            r2(montoAnuladoRechazado)
          ],
          backgroundColor: ['#1c4d37', '#d97706', '#2d6a4f', '#dc2626'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: tickColor } },
          tooltip: {
            callbacks: {
              label: ctx => `${usd(ctx.parsed.y || 0)} (${bs((ctx.parsed.y || 0) * tasaActual)})`
            }
          }
        },
        scales: {
          x: { ticks: { color: tickColor }, grid: { color: gridColor } },
          y: { beginAtZero: true, ticks: { color: tickColor }, grid: { color: gridColor } }
        }
      }
    });
  }
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  initDashboardFacturacion();
  renderFacturas();
  renderCuentasPorCobrar();
  renderAnulaciones();
  renderReportesFacturacion();
  if ($('tablaCobranzas')) setFiltroCobranza('Por Verificar');

  const refrescarTodoFacturacion = () => {
    recargarDatos();
    initDashboardFacturacion();
    renderFacturas();
    renderCobranzas();
    renderCuentasPorCobrar();
    renderAnulaciones();
    renderReportesFacturacion();
  };

  window.addEventListener('storage', refrescarTodoFacturacion);
  window.addEventListener('bcv-tasa-actualizada', refrescarTodoFacturacion);
});
