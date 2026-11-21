// Catálogo de productos por marca para el módulo de Generar Venta.
// Estructura: marca → presentaciones (Unidad, Manga, Caja, Display, Sachet) → productos.
// "precio" es el precio de UNA presentación (una unidad, una caja, una manga...).
// "contiene" es cuántas unidades trae esa presentación.
// NOTA: los precios son valores de ejemplo; reemplázalos por los precios reales.
const catalogoProductos = {
  muchy: {
    nombre: 'Muchy',
    presentaciones: {
      unidad: { nombre: 'Unidades', productos: [
        { id: 'muchy-u-med', baseId: 'muchy-med', baseNombre: 'Muchy Mediano', tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Muchy Mediano (Unidad)', contiene: 1, precio: 0.60, stockInicial: 120, stockMin: 30, ubicacion: 'Pasillo A · Estante 1' },
        { id: 'muchy-u-xl',  baseId: 'muchy-xl',  baseNombre: 'Muchy XL',      tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Muchy XL (Unidad)',      contiene: 1, precio: 1.00, stockInicial: 95,  stockMin: 25, ubicacion: 'Pasillo A · Estante 1' }
      ]},
      manga: { nombre: 'Mangas', productos: [
        { id: 'muchy-manga-peq', baseId: 'muchy-peq', baseNombre: 'Muchy Pequeño', tipo: 'Manga', plural: 'Mangas', nombre: 'Manga Muchy Pequeño (12 und)', contiene: 12, precio: 5.00, stockInicial: 45, stockMin: 12, ubicacion: 'Pasillo A · Estante 2' }
      ]},
      caja: { nombre: 'Cajas', productos: [
        { id: 'muchy-caja-med', baseId: 'muchy-med', baseNombre: 'Muchy Mediano', tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Muchy Mediano (20 und)', contiene: 20, precio: 11.00, stockInicial: 60, stockMin: 15, ubicacion: 'Pasillo A · Estante 3' },
        { id: 'muchy-caja-xl',  baseId: 'muchy-xl',  baseNombre: 'Muchy XL',      tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Muchy XL (10 und)',      contiene: 10, precio: 9.00,  stockInicial: 38, stockMin: 10, ubicacion: 'Pasillo A · Estante 3' }
      ]}
    }
  },
  puig: {
    nombre: 'Galleterías PUIG',
    presentaciones: {
      unidad: { nombre: 'Unidades', productos: [
        { id: 'puig-u-maria', baseId: 'puig-maria', baseNombre: 'Galletas María Delicia', tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'María Delicia (Unidad)', contiene: 1, precio: 0.50, stockInicial: 150, stockMin: 40, ubicacion: 'Pasillo B · Estante 1' },
        { id: 'puig-u-katy',  baseId: 'puig-katy',  baseNombre: 'Galletas Katy',          tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Katy (Unidad)',          contiene: 1, precio: 0.80, stockInicial: 110, stockMin: 30, ubicacion: 'Pasillo B · Estante 1' }
      ]},
      caja: { nombre: 'Cajas', productos: [
        { id: 'puig-caja-maria', baseId: 'puig-maria', baseNombre: 'Galletas María Delicia', tipo: 'Caja', plural: 'Cajas', nombre: 'Caja María Delicia (24 und)', contiene: 24, precio: 11.00, stockInicial: 52, stockMin: 15, ubicacion: 'Pasillo B · Estante 2' },
        { id: 'puig-caja-katy',  baseId: 'puig-katy',  baseNombre: 'Galletas Katy',          tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Katy (24 und)',          contiene: 24, precio: 18.00, stockInicial: 40, stockMin: 12, ubicacion: 'Pasillo B · Estante 2' }
      ]},
      display: { nombre: 'Displays', productos: [
        { id: 'puig-disp-maria', baseId: 'puig-maria', baseNombre: 'Galletas María Delicia', tipo: 'Display', plural: 'Displays pequeños', nombre: 'Display María Delicia (18 und)', contiene: 18, precio: 8.50,  stockInicial: 28, stockMin: 10, ubicacion: 'Pasillo B · Estante 3' },
        { id: 'puig-disp-katy',  baseId: 'puig-katy',  baseNombre: 'Galletas Katy',          tipo: 'Display', plural: 'Displays grandes',  nombre: 'Display Katy (24 und)',           contiene: 24, precio: 18.00, stockInicial: 8,  stockMin: 10, ubicacion: 'Pasillo B · Estante 3' }
      ]}
    }
  },
  fisa: {
    nombre: 'Fisa',
    presentaciones: {
      unidad: { nombre: 'Unidades', productos: [
        { id: 'fisa-u-crema-20',  baseId: 'fisa-crema-20',   baseNombre: 'Crema para el Cuerpo 20 ml',     tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Crema para el Cuerpo 20 ml (Unidad)',  contiene: 1, precio: 0.80, stockInicial: 85,  stockMin: 20, ubicacion: 'Pasillo C · Estante 1' },
        { id: 'fisa-u-crema-365', baseId: 'fisa-crema-365',  baseNombre: 'Crema para el Cuerpo 365 ml',    tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Crema para el Cuerpo 365 ml (Unidad)', contiene: 1, precio: 3.50, stockInicial: 42,  stockMin: 12, ubicacion: 'Pasillo C · Estante 1' },
        { id: 'fisa-u-crema-800', baseId: 'fisa-crema-800',  baseNombre: 'Crema para el Cuerpo 800 ml',    tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Crema para el Cuerpo 800 ml (Unidad)', contiene: 1, precio: 6.50, stockInicial: 25,  stockMin: 8,  ubicacion: 'Pasillo C · Estante 1' },
        { id: 'fisa-u-jabon',     baseId: 'fisa-jabon',      baseNombre: 'Jabón de Baño Every Night',      tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Jabón de Baño Every Night (Unidad)',   contiene: 1, precio: 1.00, stockInicial: 140, stockMin: 36, ubicacion: 'Pasillo C · Estante 2' },
        { id: 'fisa-u-deo-60',    baseId: 'fisa-deo-60',     baseNombre: 'Desodorante Every Night 60 g',   tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Desodorante Every Night 60 g (Unidad)', contiene: 1, precio: 2.00, stockInicial: 64,  stockMin: 18, ubicacion: 'Pasillo C · Estante 2' },
        { id: 'fisa-u-deo-90',    baseId: 'fisa-deo-90',     baseNombre: 'Desodorante Every Night 90 g',   tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Desodorante Every Night 90 g (Unidad)', contiene: 1, precio: 2.80, stockInicial: 50,  stockMin: 15, ubicacion: 'Pasillo C · Estante 2' },
        { id: 'fisa-u-deo-sachet',baseId: 'fisa-deo-sachet', baseNombre: 'Desodorante Every Night Sachet', tipo: 'Sobre',  plural: 'Sobres sueltos',   nombre: 'Desodorante Every Night Sachet (Sobre)', contiene: 1, precio: 0.30, stockInicial: 180, stockMin: 48, ubicacion: 'Pasillo C · Estante 3' }
      ]},
      caja: { nombre: 'Cajas', productos: [
        { id: 'fisa-caja-crema-20',  baseId: 'fisa-crema-20',  baseNombre: 'Crema para el Cuerpo 20 ml',   tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Crema para el Cuerpo 20 ml (12 und)',  contiene: 12, precio: 9.00,  stockInicial: 30, stockMin: 8,  ubicacion: 'Pasillo C · Estante 4' },
        { id: 'fisa-caja-crema-365', baseId: 'fisa-crema-365', baseNombre: 'Crema para el Cuerpo 365 ml',  tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Crema para el Cuerpo 365 ml (12 und)', contiene: 12, precio: 40.00, stockInicial: 18, stockMin: 6,  ubicacion: 'Pasillo C · Estante 4' },
        { id: 'fisa-caja-crema-800', baseId: 'fisa-crema-800', baseNombre: 'Crema para el Cuerpo 800 ml',  tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Crema para el Cuerpo 800 ml (12 und)', contiene: 12, precio: 75.00, stockInicial: 4,  stockMin: 5,  ubicacion: 'Pasillo C · Estante 4' },
        { id: 'fisa-caja-jabon',     baseId: 'fisa-jabon',     baseNombre: 'Jabón de Baño Every Night',    tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Jabón de Baño Every Night (36 und)',   contiene: 36, precio: 32.00, stockInicial: 26, stockMin: 8,  ubicacion: 'Pasillo C · Estante 5' },
        { id: 'fisa-caja-deo-60',    baseId: 'fisa-deo-60',    baseNombre: 'Desodorante Every Night 60 g', tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Desodorante Every Night 60 g (12 und)', contiene: 12, precio: 22.00, stockInicial: 22, stockMin: 6,  ubicacion: 'Pasillo C · Estante 5' },
        { id: 'fisa-caja-deo-90',    baseId: 'fisa-deo-90',    baseNombre: 'Desodorante Every Night 90 g', tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Desodorante Every Night 90 g (12 und)', contiene: 12, precio: 31.00, stockInicial: 7,  stockMin: 8,  ubicacion: 'Pasillo C · Estante 5' }
      ]},
      sachet: { nombre: 'Ristras / Sachet', productos: [
        { id: 'fisa-ristra-deo', baseId: 'fisa-deo-sachet', baseNombre: 'Desodorante Every Night Sachet', tipo: 'Ristra', plural: 'Ristras', nombre: 'Ristra Desodorante Every Night Sachet', contiene: 12, precio: 3.20, stockInicial: 55, stockMin: 15, ubicacion: 'Pasillo C · Estante 3' }
      ]}
    }
  }
};

let carritoActual = [];

// --- DATOS DE VENTAS, PAGOS E INVENTARIO (persistidos en localStorage; sin backend) ---
const VENTAS_KEY = 'gs_ventas_v2';
const PAGOS_KEY = 'gs_pagos_v2';
const INVENTARIO_KEY = 'gs_inventario_v1';
const MOVIMIENTOS_INV_KEY = 'gs_movimientos_inv_v1';
const hoyISO = new Date().toISOString().slice(0, 10);

function construirInventarioSemillaVentas() {
  const lista = [];
  Object.entries(catalogoProductos).forEach(([marcaKey, marca]) => {
    Object.entries(marca.presentaciones).forEach(([presKey, pres]) => {
      pres.productos.forEach(p => {
        lista.push({
          id: p.id,
          baseId: p.baseId,
          baseNombre: p.baseNombre,
          marcaKey,
          marcaNombre: marca.nombre,
          presKey,
          presNombre: pres.nombre,
          tipo: p.tipo,
          plural: p.plural,
          nombre: p.nombre,
          contiene: p.contiene,
          precio: p.precio,
          stock: p.stockInicial,
          stockMin: p.stockMin,
          ubicacion: p.ubicacion
        });
      });
    });
  });
  return lista;
}

function obtenerInventarioCompartido() {
  const base = construirInventarioSemillaVentas();
  try {
    const guardado = JSON.parse(localStorage.getItem(INVENTARIO_KEY));
    if (Array.isArray(guardado) && guardado.length) {
      return base.map(itemBase => {
        const prev = guardado.find(x => x.id === itemBase.id);
        return prev ? Object.assign({}, itemBase, {
          stock: typeof prev.stock === 'number' ? prev.stock : itemBase.stock,
          stockMin: typeof prev.stockMin === 'number' ? prev.stockMin : itemBase.stockMin,
          ubicacion: prev.ubicacion || itemBase.ubicacion
        }) : itemBase;
      });
    }
  } catch (e) { /* usar semilla */ }
  localStorage.setItem(INVENTARIO_KEY, JSON.stringify(base));
  return base;
}

let inventarioVentas = obtenerInventarioCompartido();

function guardarInventarioCompartido() {
  localStorage.setItem(INVENTARIO_KEY, JSON.stringify(inventarioVentas));
}

function registrarMovimientoInventarioDesdeVenta(tipo, referencia, observacion, items) {
  try {
    const movs = JSON.parse(localStorage.getItem(MOVIMIENTOS_INV_KEY)) || [];
    const max = movs.reduce((m, x) => {
      const n = parseInt(String(x.id || '').replace(/\D/g, ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    movs.unshift({
      id: 'MOV-' + String(max + 1).padStart(3, '0'),
      fecha: hoyISO,
      tipo,
      referencia,
      observacion,
      items: items.map(i => ({ id: i.id, nombre: i.nombre, cantidad: i.cantidad, contiene: i.contiene }))
    });
    localStorage.setItem(MOVIMIENTOS_INV_KEY, JSON.stringify(movs));
  } catch (e) { /* ignorar error de storage */ }
}

function stockDisponibleDe(productoId) {
  inventarioVentas = obtenerInventarioCompartido();
  const item = inventarioVentas.find(x => x.id === productoId);
  if (item) return Math.max(0, Number(item.stock) || 0);
  const prod = buscarProducto(productoId);
  return prod ? Math.max(0, Number(prod.stockInicial) || 0) : 0;
}

function cantidadEnCarritoDe(productoId) {
  const item = carritoActual.find(x => x.id === productoId);
  return item ? item.cantidad : 0;
}

function stockRestanteParaAgregar(productoId) {
  return Math.max(0, stockDisponibleDe(productoId) - cantidadEnCarritoDe(productoId));
}

function lineas(...pares) {
  return pares.map(([id, cantidad]) => {
    const p = buscarProducto(id);
    return { id, nombre: p.nombre, cantidad, contiene: p.contiene, precio: p.precio };
  });
}

function totalLineas(items) {
  return items.reduce((t, i) => t + i.precio * i.cantidad, 0);
}

function crearVentaSemilla(id, cliente, fecha, estado, items, extra = {}) {
  const rutaCli = (window.CLIENTES_RUTA_DEFAULT_MAP && window.CLIENTES_RUTA_DEFAULT_MAP[cliente]) || 'Ruta 2';
  return Object.assign({ id, cliente, ruta: extra.ruta || rutaCli, fecha, estado, items, total: totalLineas(items) }, extra);
}

function ventasIniciales() {
  return [
    crearVentaSemilla('V-001', 'Supermercado Central', '2026-04-10', 'Completada', lineas(['muchy-caja-med', 40], ['puig-caja-katy', 20], ['fisa-caja-jabon', 5]), { credito: '0', ruta: 'Ruta 2' }),
    crearVentaSemilla('V-002', 'Tienda El Ahorro', '2026-04-09', 'Pendiente', lineas(['puig-disp-maria', 30], ['fisa-caja-crema-365', 4]), { credito: '15', ruta: 'Ruta 2' }),
    crearVentaSemilla('V-003', 'Minimarket Express', '2026-04-08', 'Completada', lineas(['muchy-manga-peq', 50], ['fisa-ristra-deo', 40], ['puig-caja-maria', 10]), { credito: '0', estadoDespacho: 'En Preparación', ruta: 'Ruta 3' }),
    crearVentaSemilla('V-004', 'Bodega San José', '2026-04-08', 'Completada', lineas(['muchy-caja-xl', 25], ['fisa-caja-deo-60', 6]), { credito: '21+', estadoDespacho: 'Completo', ruta: 'Ruta 4' }),
    crearVentaSemilla('V-005', 'Comercial López', '2026-04-07', 'Cancelada', lineas(['puig-caja-katy', 15], ['muchy-caja-med', 20]),
      { credito: '15', ruta: 'Ruta 5', anulacion: { motivo: 'El cliente canceló el pedido antes del despacho.', fecha: '2026-04-07' } }),
    crearVentaSemilla('V-006', 'Restaurant El Faro', '2026-04-08', 'Completada', lineas(['fisa-caja-jabon', 10], ['puig-disp-maria', 5]), { credito: '0', estadoDespacho: 'Completo', ruta: 'Ruta 3' }),
    crearVentaSemilla('V-007', 'Supermercado Juan Griego', '2026-04-08', 'Completada', lineas(['muchy-caja-xl', 25], ['fisa-ristra-deo', 20]), { credito: '7', estadoDespacho: 'Con Incidencia', ruta: 'Ruta 5' })
  ];
}

function pagosIniciales(ventas) {
  const v = id => ventas.find(x => x.id === id);
  const pago = (n, venta, fecha, metodo, banco, monto, referencia, estado = 'Completado') => ({
    id: 'P-' + String(n).padStart(3, '0'),
    ventaId: venta.id,
    cliente: venta.cliente,
    fecha,
    metodo,
    banco: banco || '',
    monto,
    referencia: referencia || '',
    estado
  });
  const base = [
    pago(1, v('V-001'), '2026-04-10', 'Transferencia', '0134-Banesco', v('V-001').total, '884213', 'Completado'),
    pago(2, v('V-003'), '2026-04-08', 'Pago Móvil', '0102-Banco de Venezuela', v('V-003').total, '550931', 'Completado'),
    pago(3, v('V-004'), '2026-04-08', 'Efectivo ($)', '', v('V-004').total, '', 'Completado'),
    pago(4, v('V-002'), '2026-04-09', 'Pago Móvil', '0105-Banco Mercantil', 50, '771234', 'Por Verificar')
  ];
  if (v('V-006')) base.push(pago(5, v('V-006'), '2026-04-08', 'Efectivo ($)', '', v('V-006').total, '', 'Completado'));
  if (v('V-007')) base.push(pago(6, v('V-007'), '2026-04-08', 'Transferencia', '0134-Banesco', v('V-007').total, '912045', 'Completado'));
  return base;
}

function leerStorage(key, fallback) {
  try {
    const d = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(d) && d.length) return d;
  } catch (e) { /* datos corruptos: se reinician */ }
  return fallback();
}

let ventasData = leerStorage(VENTAS_KEY, ventasIniciales);
let pagosData = leerStorage(PAGOS_KEY, () => pagosIniciales(ventasData));

// Purgar venta anómala / prueba de @backpack y registros con montos absurdos
ventasData = ventasData.filter(v => {
  const c = String(v.cliente || '').toLowerCase();
  const esBackpack = c.includes('backpack');
  const esAbsurdo = (Number(v.total) || 0) > 100000;
  return !esBackpack && !esAbsurdo;
});
const idsVentasValidas = new Set(ventasData.map(v => v.id));
pagosData = pagosData.filter(p => {
  const c = String(p.cliente || '').toLowerCase();
  const esBackpack = c.includes('backpack');
  const esAbsurdo = (Number(p.monto) || 0) > 100000;
  return !esBackpack && !esAbsurdo && idsVentasValidas.has(p.ventaId);
}).map(p => {
  let metodo = p.metodo || 'Efectivo ($)';
  let banco = p.banco || '';
  let ref = p.referencia || '';
  if (metodo === 'Efectivo') metodo = 'Efectivo ($)';
  else if (metodo === 'Zelle') { metodo = 'Transferencia'; if (!banco) banco = 'Banesco'; }
  else if (metodo === 'Punto de Venta') { metodo = 'Pago Móvil'; if (!banco) banco = 'Banco de Venezuela (BDV)'; }
  return { ...p, metodo, banco, referencia: metodo.startsWith('Efectivo') ? '' : ref };
});

function guardarDatos() {
  localStorage.setItem(VENTAS_KEY, JSON.stringify(ventasData));
  localStorage.setItem(PAGOS_KEY, JSON.stringify(pagosData));
}
guardarDatos();

// Limpiar facturas anómalas si existen
try {
  const rawFact = localStorage.getItem('gs_facturas_v1');
  if (rawFact) {
    let facts = JSON.parse(rawFact);
    if (Array.isArray(facts)) {
      facts = facts.filter(f => !String(f.cliente || '').toLowerCase().includes('backpack') && (Number(f.total) || 0) < 100000);
      localStorage.setItem('gs_facturas_v1', JSON.stringify(facts));
    }
  }
} catch (e) {}

// Solo cuentan como pagados los cobros ya verificados/aprobados en Cobranzas de Facturación
const pagadoDe = v => pagosData.filter(p => p.ventaId === v.id && (p.estado === 'Completado' || p.estado === 'Verificado')).reduce((t, p) => t + p.monto, 0);
const enVerificacionDe = v => pagosData.filter(p => p.ventaId === v.id && p.estado === 'Por Verificar').reduce((t, p) => t + p.monto, 0);
const saldoDe = v => Math.max(0, v.total - pagadoDe(v));
const saldoPorRegistrarDe = v => Math.max(0, v.total - pagadoDe(v) - enVerificacionDe(v));
const unidadesDe = v => v.items.reduce((t, i) => t + i.cantidad * i.contiene, 0);
const fmt2 = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtBs = n => 'Bs. ' + new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n) || 0);
const escHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const siguienteId = (prefijo, lista) => prefijo + '-' + String(Math.max(0, ...lista.map(x => parseInt(x.id.split('-')[1]))) + 1).padStart(3, '0');

// Formato de fecha dd-MM-yyyy para Historial de Ventas, Detalle de Pedido y Pagos
function fmtFecha(fechaStr) {
  const s = String(fechaStr || '').trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return s;
}

function obtenerDiasRespetoTasa(credito) {
  const c = String(credito ?? '0').trim();
  if (c === '7') return 7;
  if (c === '15') return 15;
  if (c === '21+' || c === '30' || c === '+30') return 21;
  return 0;
}

function textoAvisoTasaBs() {
  return 'El monto en Bs se respetará el mismo día de despacho; posteriormente será calculado a la tasa BCV del día de pago.';
}

function montoBsDeVenta(v) {
  if (!v) return 0;
  const tasa = (Number(v.tasaBcv) > 0) ? Number(v.tasaBcv) : obtenerTasaBCV();
  return (Number(v.total) || 0) * tasa;
}

function tipoPresentacionDeItem(item) {
  if (!item) return 'Unidad';
  if (item.tipo) return item.tipo;
  const prod = buscarProducto(item.id);
  if (prod && prod.tipo) return prod.tipo;
  const n = String(item.nombre || '').toLowerCase();
  if (n.includes('caja')) return 'Caja';
  if (n.includes('manga')) return 'Manga';
  if (n.includes('display')) return 'Display';
  if (n.includes('ristra') || n.includes('sachet')) return 'Ristra';
  if (n.includes('sobre')) return 'Sobre';
  return (Number(item.contiene) > 1) ? 'Caja' : 'Unidad';
}

function etiquetaEmpaqueSegunCantidad(tipo, cant) {
  const n = Number(cant) || 0;
  const t = String(tipo || 'Unidad');
  if (n === 1) return t;
  const mapaPlural = {
    'Unidad': 'Unidades',
    'Caja': 'Cajas',
    'Manga': 'Mangas',
    'Display': 'Displays',
    'Ristra': 'Ristras',
    'Sobre': 'Sobres'
  };
  return mapaPlural[t] || (t + 's');
}

// --- UTILIDADES DE UI (modales y notificaciones) ---
function openModal(id) {
  const m = document.getElementById(id);
  m.classList.remove('hidden');
  m.classList.add('flex');
  requestAnimationFrame(() => m.classList.remove('opacity-0'));
}

function closeModal(id) {
  const m = document.getElementById(id);
  m.classList.add('opacity-0');
  setTimeout(() => { m.classList.add('hidden'); m.classList.remove('flex'); }, 200);
}

let toastTimer;
function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'hidden opacity-0 translate-y-2 transition-all duration-300 fixed bottom-6 right-6 z-[100] max-w-md px-5 py-3 rounded-xl bg-[#1c4d37] dark:bg-emerald-600 text-white text-sm shadow-lg';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.remove('hidden');
  requestAnimationFrame(() => t.classList.remove('opacity-0', 'translate-y-2'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => t.classList.add('hidden'), 300);
  }, 3200);
}


// --- CLIENTES (compartido entre Generar Venta y Clientes & Cuentas) ---
const CLIENTES_KEY = 'gs_clientes_v1';

const MAPA_MUNICIPIOS_NE = {
  'Porlamar': 'Mariño',
  'Mariño (Porlamar)': 'Mariño',
  'Mariño': 'Mariño',
  'La Asunción': 'Arismendi',
  'Arismendi (La Asunción)': 'Arismendi',
  'Arismendi': 'Arismendi',
  'Pampatar': 'Maneiro',
  'Maneiro (Pampatar)': 'Maneiro',
  'Maneiro': 'Maneiro',
  'San Juan Bautista': 'Díaz',
  'Díaz (San Juan Bautista)': 'Díaz',
  'Díaz': 'Díaz',
  'Juan Griego': 'Marcano',
  'Marcano (Juan Griego)': 'Marcano',
  'Marcano': 'Marcano',
  'Santa Ana': 'Gómez',
  'Gómez (Santa Ana)': 'Gómez',
  'Gómez': 'Gómez',
  'El Valle del Espíritu Santo': 'García',
  'García (El Valle del Espíritu Santo)': 'García',
  'García': 'García',
  'La Plaza de Paraguachí': 'Antolín del Campo',
  'Antolín del Campo (La Plaza de Paraguachí)': 'Antolín del Campo',
  'Antolín del Campo': 'Antolín del Campo',
  'Boca de Río': 'Península de Macanao',
  'Península de Macanao (Boca de Río)': 'Península de Macanao',
  'Península de Macanao': 'Península de Macanao',
  'Punta de Piedras': 'Tubores',
  'Tubores (Punta de Piedras)': 'Tubores',
  'Tubores': 'Tubores',
  'San Pedro de Coche': 'Villalba',
  'Villalba (San Pedro de Coche)': 'Villalba',
  'Villalba': 'Villalba'
};

function limpiarZonaMunicipio(z) {
  if (!z) return 'Mariño';
  if (MAPA_MUNICIPIOS_NE[z]) return MAPA_MUNICIPIOS_NE[z];
  const sinParentesis = String(z).replace(/\s*\(.*?\)/g, '').trim();
  return MAPA_MUNICIPIOS_NE[sinParentesis] || sinParentesis || 'Mariño';
}

function normalizarRifSinGuiones(rifRaw) {
  const limpio = String(rifRaw || '').toUpperCase().replace(/[^VEJGP0-9]/g, '');
  const m = limpio.match(/^([VEJGP])(\d+)$/);
  if (!m) return limpio || 'J000000000';
  const letra = m[1];
  let digitos = m[2];
  if (letra === 'V' && digitos.length > 8) digitos = digitos.slice(0, 8);
  else if (digitos.length > 9) digitos = digitos.slice(0, 9);
  return letra + digitos;
}

function normalizarTelefonoConCodigo(telRaw) {
  const s = String(telRaw || '').trim();
  if (!s) return '';
  let soloDigitos = s.replace(/\D+/g, '');
  if (soloDigitos.startsWith('58') && soloDigitos.length >= 12) {
    soloDigitos = soloDigitos.slice(2);
  }
  if (!soloDigitos.startsWith('0') && soloDigitos.length === 10) {
    soloDigitos = '0' + soloDigitos;
  }
  if (soloDigitos.length === 11 && soloDigitos.startsWith('0')) {
    const cod = soloDigitos.slice(0, 4);
    const parte1 = soloDigitos.slice(4, 7);
    const parte2 = soloDigitos.slice(7);
    return `${cod}-${parte1}-${parte2}`;
  }
  return s;
}

// --- GESTIÓN DE RUTAS INDIVIDUALES DE VENDEDORES (Ruta 2, 3, 4, 5 y 9) ---
const RUTA_ACTIVA_KEY = 'gs_ruta_ventas_activa';
const RUTAS_VENTAS_VALIDAS = ['Ruta 2', 'Ruta 3', 'Ruta 4', 'Ruta 5', 'Ruta 9'];
const MAPA_RUTA_CLIENTE_DEF = (window.CLIENTES_RUTA_DEFAULT_MAP) || {
  'Supermercado Central': 'Ruta 2',
  'Tienda El Ahorro': 'Ruta 2',
  'Bodegón Los Pescadores C.A.': 'Ruta 2',
  'Minimarket Express': 'Ruta 3',
  'Restaurant El Faro': 'Ruta 3',
  'Bodega San José': 'Ruta 4',
  'Abastos San Juan Bautista': 'Ruta 4',
  'Comercial López': 'Ruta 5',
  'Supermercado Juan Griego': 'Ruta 5',
  'Abastos La Asunción': 'Ruta 9',
  'Panadería Santa Ana': 'Ruta 9'
};

function normalizarRutaVenta(raw, fallback = 'Ruta 2') {
  if (typeof window.normalizarRutaSistema === 'function') {
    return window.normalizarRutaSistema(raw, fallback);
  }
  const s = String(raw || '').trim();
  if (!s) return fallback;
  const m = s.toLowerCase().match(/ruta\s*([0-9]+)|^([23459])$/);
  if (m) return `Ruta ${m[1] || m[2]}`;
  return s;
}

function leerSesionActivaVentas() {
  try {
    return JSON.parse(localStorage.getItem('gs_sesion_activa')) || null;
  } catch (e) {
    return null;
  }
}

function estaBloqueadoARutaVendedor() {
  const ses = leerSesionActivaVentas();
  return Boolean(ses && ses.rol === 'Vendedor' && ses.username);
}

function obtenerRutaActivaVentas() {
  const ses = leerSesionActivaVentas();
  if (ses && ses.rol === 'Vendedor' && (ses.ruta || ses.username)) {
    return normalizarRutaVenta(ses.ruta || ses.username, 'Ruta 2');
  }
  const guardada = localStorage.getItem(RUTA_ACTIVA_KEY);
  return normalizarRutaVenta(guardada, 'Ruta 2');
}

function actualizarIdentidadRutaVentas() {
  const rutaActiva = obtenerRutaActivaVentas();
  const ses = leerSesionActivaVentas();
  const bloqueado = estaBloqueadoARutaVendedor();

  const renderBadge = (el) => {
    if (!el) return;
    if (bloqueado && ses) {
      el.textContent = rutaActiva;
      return;
    }
    const opciones = RUTAS_VENTAS_VALIDAS.includes(rutaActiva) ? RUTAS_VENTAS_VALIDAS : [rutaActiva, ...RUTAS_VENTAS_VALIDAS];
    el.innerHTML = `
      <div class="relative inline-block align-middle">
        <select id="selectorRutaActivaVentas" onchange="cambiarRutaActivaVentas(this.value)" title="Cambiar ruta de vendedor activa" class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[#1c4d37] dark:text-emerald-400 font-bold text-sm rounded-lg pl-3 pr-8 py-1.5 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
          ${opciones.map(r => `<option value="${escHtml(r)}" ${r === rutaActiva ? 'selected' : ''}>${escHtml(r)}</option>`).join('')}
        </select>
        <i data-lucide="chevron-down" class="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
      </div>`;
  };

  renderBadge(document.getElementById('nombreRutaActiva'));
  document.querySelectorAll('.nombreRutaActiva').forEach(el => renderBadge(el));

  // Actualizar etiqueta "Usuario:" del sidebar sin @ y mostrando rol/ruta correspondiente
  const sideUserEl = document.querySelector('aside p.font-semibold.text-sm.text-white');
  if (sideUserEl) {
    if (ses && ses.rol && !bloqueado) {
      sideUserEl.textContent = `${ses.rol} · ${rutaActiva}`;
    } else {
      sideUserEl.textContent = rutaActiva;
    }
  }
  if (window.lucide) lucide.createIcons();
}

function cambiarRutaActivaVentas(nuevaRuta) {
  if (estaBloqueadoARutaVendedor()) return;
  const norm = normalizarRutaVenta(nuevaRuta, 'Ruta 2');
  localStorage.setItem(RUTA_ACTIVA_KEY, norm);

  // Al cambiar de ruta, limpiar selección previa del cliente para evitar cruzar pedidos entre rutas
  if (document.getElementById('clienteSelect')) {
    document.getElementById('clienteSelect').value = '';
    if (document.getElementById('clienteBuscar')) document.getElementById('clienteBuscar').value = '';
    if (document.getElementById('clienteInfo')) document.getElementById('clienteInfo').textContent = '';
    if (document.getElementById('clienteLimpiar')) document.getElementById('clienteLimpiar').classList.add('hidden');
    if (document.getElementById('clienteLista')) document.getElementById('clienteLista').classList.add('hidden');
  }

  actualizarIdentidadRutaVentas();
  filtrarHistorial();
  renderPagos();
  renderClientes();
  renderDashboardVentas();
  toast(`Cartera cambiada a ${norm} (solo clientes asignados a ${norm}).`);
}

function normalizarCliente(c) {
  return {
    nombre: c.nombre || '',
    rif: normalizarRifSinGuiones(c.rif),
    zona: limpiarZonaMunicipio(c.zona),
    ruta: normalizarRutaVenta(c.ruta, MAPA_RUTA_CLIENTE_DEF[c.nombre] || 'Ruta 2'),
    contacto: c.contacto || '',
    telefono: normalizarTelefonoConCodigo(c.telefono),
    email: c.email || '',
    direccion: c.direccion || '',
    activo: c.activo !== false && c.activo !== 0 && c.activo !== '0'
  };
}

const clientesIniciales = () => [
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
let CLIENTES = leerStorage(CLIENTES_KEY, clientesIniciales)
  .filter(c => !String(c.nombre || '').toLowerCase().includes('backpack'))
  .map(normalizarCliente);
clientesIniciales().forEach(seed => {
  if (!CLIENTES.some(c => c.nombre === seed.nombre || c.rif === seed.rif)) {
    CLIENTES.push(normalizarCliente(seed));
  }
});
function guardarClientes() { localStorage.setItem(CLIENTES_KEY, JSON.stringify(CLIENTES)); }
guardarClientes();

function rutaDeCliente(nombre) {
  const c = CLIENTES.find(x => x.nombre === nombre);
  if (c && c.ruta) return normalizarRutaVenta(c.ruta);
  return MAPA_RUTA_CLIENTE_DEF[nombre] || 'Ruta 2';
}

function clientesDeRutaActiva() {
  const ruta = obtenerRutaActivaVentas();
  return CLIENTES.filter(c => normalizarRutaVenta(c.ruta) === ruta);
}

function esClienteDeRutaActiva(nombre) {
  const ruta = obtenerRutaActivaVentas();
  return CLIENTES.some(c => c.nombre === nombre && normalizarRutaVenta(c.ruta) === ruta);
}

function ventasDeRutaActiva() {
  const ruta = obtenerRutaActivaVentas();
  return ventasData.filter(v => normalizarRutaVenta(v.ruta || rutaDeCliente(v.cliente)) === ruta);
}

function pagosDeRutaActiva() {
  const ids = new Set(ventasDeRutaActiva().map(v => v.id));
  return pagosData.filter(p => ids.has(p.ventaId));
}

function filtrarClientes() {
  const input = document.getElementById('clienteBuscar');
  const lista = document.getElementById('clienteLista');
  if (!input || !lista) return;
  // Al escribir se descarta la selección anterior
  if (document.getElementById('clienteSelect').value && input.value !== document.getElementById('clienteSelect').value) {
    document.getElementById('clienteSelect').value = '';
    document.getElementById('clienteInfo').textContent = '';
  }
  const q = input.value.trim().toLowerCase();
  const res = clientesDeRutaActiva().filter(c => (c.nombre + ' ' + c.rif + ' ' + c.zona).toLowerCase().includes(q));
  const rutaActiva = obtenerRutaActivaVentas();
  lista.innerHTML = res.length ? res.map(c => {
    const desactivado = c.activo === false;
    if (desactivado) {
      return `
      <button type="button" onclick="notificarClienteDesactivado('${c.nombre.replace(/'/g, "\\'")}')" class="w-full text-left px-4 py-2.5 bg-red-50/40 dark:bg-red-950/20 opacity-75 hover:opacity-100 transition-colors flex items-center justify-between gap-3 cursor-not-allowed">
        <div>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300 block">${escHtml(c.nombre)} <span class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Desactivado</span></span>
          <span class="text-[11px] text-red-600 dark:text-red-400 font-medium">${escHtml(c.ruta)} · No disponible para nuevas ventas</span>
        </div>
        <span class="text-xs font-mono text-gray-400 dark:text-gray-500 whitespace-nowrap">${escHtml(c.rif)}</span>
      </button>`;
    }
    return `
    <button type="button" onclick="seleccionarCliente('${c.nombre.replace(/'/g, "\\'")}')" class="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-3">
      <div>
        <span class="text-sm font-medium text-gray-800 dark:text-gray-100 block">${escHtml(c.nombre)}</span>
        <span class="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">${escHtml(c.ruta)} · ${escHtml(c.zona)}</span>
      </div>
      <span class="text-xs font-mono text-gray-400 dark:text-gray-500 whitespace-nowrap">${escHtml(c.rif)}</span>
    </button>`;
  }).join('')
    : `<p class="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">No se encontraron clientes asignados a ${escHtml(rutaActiva)}.</p>`;
  lista.classList.remove('hidden');
  document.getElementById('clienteLimpiar').classList.toggle('hidden', !input.value);
}

function notificarClienteDesactivado(nombre) {
  toast(`El cliente "${nombre}" está desactivado y no puede recibir nuevas ventas. Sus facturas y deudas pendientes siguen activas; desbloquéalo en Clientes con tu contraseña.`);
}

function seleccionarCliente(nombre) {
  const c = clientesDeRutaActiva().find(x => x.nombre === nombre);
  if (!c) {
    toast(`Este cliente no pertenece a la cartera de ${obtenerRutaActivaVentas()}.`);
    return;
  }
  if (c.activo === false) {
    notificarClienteDesactivado(c.nombre);
    return;
  }
  document.getElementById('clienteSelect').value = c.nombre;
  document.getElementById('clienteBuscar').value = c.nombre;
  document.getElementById('clienteInfo').textContent = `${c.rif} · ${c.zona} · ${c.ruta}`;
  document.getElementById('clienteLista').classList.add('hidden');
  document.getElementById('clienteLimpiar').classList.remove('hidden');
}

function limpiarCliente() {
  document.getElementById('clienteSelect').value = '';
  document.getElementById('clienteBuscar').value = '';
  document.getElementById('clienteInfo').textContent = '';
  document.getElementById('clienteLimpiar').classList.add('hidden');
  document.getElementById('clienteBuscar').focus();
  filtrarClientes();
}

document.addEventListener('click', e => {
  const combo = document.getElementById('clienteCombo');
  if (combo && !combo.contains(e.target)) document.getElementById('clienteLista').classList.add('hidden');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('clienteLista')) document.getElementById('clienteLista').classList.add('hidden');
});

// --- LÓGICA DE GENERAR VENTA (`ventas.php`) ---
const CREDITO_LABELS = {
  '0': '0 días (Pago el mismo día)',
  '7': '7 días de crédito',
  '15': '15 días de crédito',
  '21+': '21 días o más de crédito',
  '30': '21 días o más de crédito',
  '+30': '21 días o más de crédito'
};

function etiquetaCredito(val) {
  const c = String(val ?? '0');
  return CREDITO_LABELS[c] || `${c} días`;
}

function seleccionarCredito(valor) {
  const input = document.getElementById('creditoSelect');
  const info = document.getElementById('creditoInfo');
  const contenedor = document.getElementById('creditoOpciones');
  if (!input || !contenedor) return;
  input.value = valor;

  contenedor.querySelectorAll('[data-credito]').forEach(btn => {
    const activo = btn.getAttribute('data-credito') === valor;
    btn.className = 'py-2.5 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-1.5 ' + (
      activo
        ? 'bg-[#1c4d37] text-white border-[#1c4d37] dark:bg-emerald-600 dark:border-emerald-600 shadow-sm'
        : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#1c4d37]/50 dark:hover:border-emerald-500/50'
    );
  });

  if (info) {
    if (valor === '0') {
      info.textContent = 'Pago el mismo día (contado).';
    } else if (valor === '21+') {
      info.textContent = 'Venta a crédito: plazo de pago de 21 días o más.';
    } else {
      info.textContent = `Venta a crédito: plazo de pago de ${valor} días.`;
    }
  }

  const avisoBs = document.getElementById('totalVentaAvisoBs');
  if (avisoBs) {
    avisoBs.textContent = textoAvisoTasaBs(valor);
  }
}

function buscarProducto(id) {
  for (const marca of Object.values(catalogoProductos)) {
    for (const pres of Object.values(marca.presentaciones)) {
      const p = pres.productos.find(x => x.id === id);
      if (p) return p;
    }
  }
  return null;
}

function resetSelect(select, placeholder, deshabilitar) {
  select.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
  select.disabled = deshabilitar;
}

function cargarMarcas() {
  const marcaSelect = document.getElementById('marcaSelect');
  if (!marcaSelect) return;
  Object.entries(catalogoProductos).forEach(([key, m]) => {
    marcaSelect.insertAdjacentHTML('beforeend', `<option value="${key}">${m.nombre}</option>`);
  });
}

function cargarPresentaciones() {
  const marca = catalogoProductos[document.getElementById('marcaSelect').value];
  const presSelect = document.getElementById('presentacionSelect');
  resetSelect(presSelect, 'Presentación', false);
  resetSelect(document.getElementById('productoSelect'), 'Producto', true);
  Object.entries(marca.presentaciones).forEach(([key, p]) => {
    presSelect.insertAdjacentHTML('beforeend', `<option value="${key}">${p.nombre}</option>`);
  });
  actualizarInfoProducto();
}

// Validación estricta de números enteros positivos (bloquea letras, signos +, -, ., ,, e, espacios)
function bloquearTeclasNoNumericas(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const teclasPermitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (teclasPermitidas.includes(e.key)) return;
  if (e.key === 'Enter') {
    if (e.target && e.target.id === 'cantidadInput') {
      e.preventDefault();
      agregarAlCarrito();
    } else if (e.target) {
      e.preventDefault();
      e.target.blur();
    }
    return;
  }
  // Bloquear cualquier carácter que no sea un dígito del 0 al 9 (ni letras, ni signos, ni decimales)
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    return;
  }
  // Evitar que el primer dígito sea 0
  if (e.key === '0' && (!e.target.value || e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length)) {
    e.preventDefault();
  }
}

function pegarSoloEnteros(e, input) {
  e.preventDefault();
  const texto = (e.clipboardData || window.clipboardData).getData('text') || '';
  const soloDigitos = texto.replace(/\D+/g, '').replace(/^0+/, '');
  input.value = soloDigitos;
  if (input.id === 'cantidadInput') {
    validarInputCantidadVenta(input);
  } else if (input.dataset && input.dataset.carritoIndex !== undefined) {
    editarCantidadCarrito(Number(input.dataset.carritoIndex), input);
  }
}

function validarInputCantidadVenta(input) {
  if (!input) return;
  const limpio = input.value.replace(/\D+/g, '').replace(/^0+/, '');
  if (input.value !== limpio) input.value = limpio;
  if (!limpio) return;

  const prodSelect = document.getElementById('productoSelect');
  const prodId = prodSelect ? prodSelect.value : '';
  if (!prodId) return;

  const disponibleRestante = stockRestanteParaAgregar(prodId);
  const num = parseInt(limpio, 10);
  if (disponibleRestante <= 0) {
    input.value = '';
    toast('No quedan más unidades disponibles en inventario para este producto.');
  } else if (num > disponibleRestante) {
    input.value = String(disponibleRestante);
    toast(`Stock máximo disponible para añadir: ${disponibleRestante}.`);
  }
}

function cargarProductos(mantenerSeleccionId = '') {
  const marcaSelect = document.getElementById('marcaSelect');
  const presSelect = document.getElementById('presentacionSelect');
  const prodSelect = document.getElementById('productoSelect');
  if (!marcaSelect || !presSelect || !prodSelect) return;
  const marca = catalogoProductos[marcaSelect.value];
  if (!marca) return;
  const pres = marca.presentaciones[presSelect.value];
  if (!pres) return;

  const seleccionPrevia = mantenerSeleccionId || prodSelect.value;
  resetSelect(prodSelect, 'Producto', false);
  pres.productos.forEach(p => {
    const dispTotal = stockDisponibleDe(p.id);
    const dispRestante = stockRestanteParaAgregar(p.id);
    const sinStock = dispRestante <= 0;
    const nombreLimpio = p.nombre.replace(/\s*\([^)]*\)/g, '').trim();
    const sufijoAgotado = dispTotal <= 0 ? ' — Agotado' : '';
    const selectedAttr = seleccionPrevia === p.id ? ' selected' : '';
    const disabledAttr = sinStock && seleccionPrevia !== p.id ? ' disabled' : '';
    prodSelect.insertAdjacentHTML('beforeend', `<option value="${p.id}"${selectedAttr}${disabledAttr}>${nombreLimpio} ($${p.precio.toFixed(2)})${sufijoAgotado}</option>`);
  });
  actualizarInfoProducto();
}

function explicarEmpaqueProducto(p) {
  if (!p) return '';
  const unitPrice = (p.precio / (p.contiene || 1)).toFixed(2);
  if (p.tipo === 'Caja') {
    return `Cada <b>Caja</b> de ${escHtml(p.baseNombre)} trae <b>${p.contiene} unidades</b> ($${unitPrice} c/u)`;
  }
  if (p.tipo === 'Manga') {
    return `Cada <b>Manga</b> de ${escHtml(p.baseNombre)} trae <b>${p.contiene} unidades</b> ($${unitPrice} c/u)`;
  }
  if (p.tipo === 'Display') {
    return `Cada <b>Display</b> de ${escHtml(p.baseNombre)} trae <b>${p.contiene} unidades</b> ($${unitPrice} c/u)`;
  }
  if (p.tipo === 'Ristra') {
    return `Cada <b>Ristra</b> de ${escHtml(p.baseNombre)} trae <b>${p.contiene} sobres</b> ($${unitPrice} c/u)`;
  }
  return `Venta por <b>${escHtml(p.tipo || 'Unidad')}</b> individual (1 ${(p.tipo || 'unidad').toLowerCase()})`;
}

function actualizarInfoProducto() {
  const info = document.getElementById('infoProducto');
  const prodSelect = document.getElementById('productoSelect');
  const cantInput = document.getElementById('cantidadInput');
  if (!info || !prodSelect) return;

  const p = buscarProducto(prodSelect.value);
  if (!p) {
    info.textContent = 'Selecciona marca, presentación y producto.';
    return;
  }

  const dispTotal = stockDisponibleDe(p.id);
  const enCarrito = cantidadEnCarritoDe(p.id);
  const dispRestante = Math.max(0, dispTotal - enCarrito);
  const detalleEmpaque = explicarEmpaqueProducto(p);
  const etqTipoDisp = etiquetaEmpaqueSegunCantidad(p.tipo, dispRestante).toLowerCase();

  if (dispTotal <= 0) {
    info.innerHTML = `${detalleEmpaque} · <span class="text-red-600 dark:text-red-400 font-semibold">Agotado en inventario (0 disponibles).</span>`;
  } else if (dispRestante <= 0) {
    info.innerHTML = `${detalleEmpaque} · <span class="text-amber-600 dark:text-amber-400 font-semibold">Ya añadiste el total disponible (${dispTotal} ${etiquetaEmpaqueSegunCantidad(p.tipo, dispTotal).toLowerCase()}) a la venta.</span>`;
  } else {
    info.innerHTML = `${detalleEmpaque} · <span class="text-[#1c4d37] dark:text-emerald-400 font-semibold">Disponible: ${dispRestante} ${etqTipoDisp}</span>${p.contiene > 1 ? ` (${dispRestante * p.contiene} uds)` : ''}`;
  }

  if (cantInput && cantInput.value) {
    validarInputCantidadVenta(cantInput);
  }
}

function agregarAlCarrito() {
  const selectProducto = document.getElementById('productoSelect');
  const inputCantidad = document.getElementById('cantidadInput');

  if (!selectProducto || !inputCantidad) return;

  const valorLimpio = String(inputCantidad.value || '').trim();
  if (!selectProducto.value) {
    toast('Por favor, selecciona un producto.');
    return;
  }

  if (!/^[1-9]\d*$/.test(valorLimpio)) {
    toast('Ingresa una cantidad válida en números enteros mayores a 0 (sin letras ni signos).');
    inputCantidad.focus();
    return;
  }

  const productoId = selectProducto.value;
  const cantidad = parseInt(valorLimpio, 10);
  const info = buscarProducto(productoId);
  const stockDisp = stockDisponibleDe(productoId);
  const itemExistente = carritoActual.find(item => item.id === productoId);
  const cantidadActualEnCarrito = itemExistente ? itemExistente.cantidad : 0;
  const disponibleParaAgregar = Math.max(0, stockDisp - cantidadActualEnCarrito);

  if (stockDisp <= 0) {
    toast(`El producto "${info.nombre}" no tiene stock disponible en el inventario.`);
    return;
  }

  if (cantidad > disponibleParaAgregar) {
    toast(`No puedes añadir ${cantidad} de "${info.nombre}". En inventario hay ${stockDisp} disponibles y ya tienes ${cantidadActualEnCarrito} en la venta (máximo adicional: ${disponibleParaAgregar}).`);
    inputCantidad.value = disponibleParaAgregar > 0 ? String(disponibleParaAgregar) : '';
    return;
  }

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carritoActual.push({
      id: productoId,
      nombre: info.nombre,
      tipo: info.tipo || 'Unidad',
      precio: info.precio,
      contiene: info.contiene,
      cantidad: cantidad
    });
  }

  inputCantidad.value = '';
  renderizarCarrito();
  cargarProductos(productoId);
}

function actualizarDisplaysTotalesVenta(totalVenta) {
  const totalDisplay = document.getElementById('totalVentaDisplay');
  const totalBsDisplay = document.getElementById('totalVentaBsDisplay');
  const avisoBs = document.getElementById('totalVentaAvisoBs');
  const creditoVal = (document.getElementById('creditoSelect') && document.getElementById('creditoSelect').value) || '0';
  const tasa = obtenerTasaBCV();

  if (totalDisplay) totalDisplay.textContent = fmt2(totalVenta);
  if (totalBsDisplay) totalBsDisplay.textContent = `${fmtBs(totalVenta * tasa)} (Tasa BCV: Bs. ${tasa.toFixed(2)})`;
  if (avisoBs) avisoBs.textContent = textoAvisoTasaBs(creditoVal);
}

function renderizarCarrito() {
  const contenedor = document.getElementById('listaProductosContainer');
  const totalDisplay = document.getElementById('totalVentaDisplay');
  const resumen = document.getElementById('carritoResumen');
  if (!contenedor || !totalDisplay) return;

  const unidades = carritoActual.reduce((t, i) => t + i.cantidad * i.contiene, 0);
  if (resumen) resumen.textContent = `${carritoActual.length} ${carritoActual.length === 1 ? 'línea' : 'líneas'} · ${unidades} und`;

  if (carritoActual.length === 0) {
    contenedor.innerHTML = `
      <div id="carritoVacioMsg" class="flex flex-col items-center justify-center text-center py-8 text-gray-400 dark:text-gray-500">
        <div class="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-3"><i data-lucide="shopping-cart" class="w-5 h-5"></i></div>
        <p class="text-sm font-medium">Aún no hay productos en la venta</p>
        <p class="text-xs mt-1">Elige marca, presentación y producto para añadirlos.</p>
      </div>`;
    actualizarDisplaysTotalesVenta(0);
    if (window.lucide) lucide.createIcons();
    return;
  }

  let html = '';
  let totalVenta = 0;

  carritoActual.forEach((item, index) => {
    const stockMax = stockDisponibleDe(item.id);
    if (stockMax > 0 && item.cantidad > stockMax) {
      item.cantidad = stockMax;
    }
    const subtotal = item.precio * item.cantidad;
    totalVenta += subtotal;
    const marca = catalogoProductos[item.id.split('-')[0]];
    const tipoItem = tipoPresentacionDeItem(item);
    const detalle = item.contiene > 1
      ? `<span id="carritoItemUds-${index}">${item.cantidad * item.contiene}</span> und (${item.contiene} uds por ${tipoItem.toLowerCase()})`
      : `Venta por ${tipoItem.toLowerCase()}`;
    const enLimite = item.cantidad >= stockMax;

    html += `
      <div class="group flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#1c4d37]/40 dark:hover:border-emerald-500/40 hover:shadow-sm transition-all">
        <div class="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <i data-lucide="${item.contiene > 1 ? 'package' : 'box'}" class="w-5 h-5"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">${escHtml(item.nombre)}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${marca ? escHtml(marca.nombre) + ' · ' : ''}${detalle} · ${fmt2(item.precio)} c/u</p>
        </div>
        <div class="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-gray-900">
          <button type="button" onclick="cambiarCantidad(${index}, -1)" class="px-2 py-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Restar"><i data-lucide="minus" class="w-3.5 h-3.5"></i></button>
          <input type="text" inputmode="numeric" pattern="[0-9]*" data-carrito-index="${index}" value="${item.cantidad}" onkeydown="bloquearTeclasNoNumericas(event)" oninput="editarCantidadCarrito(${index}, this)" onpaste="pegarSoloEnteros(event, this)" onblur="normalizarCantidadCarrito(${index}, this)" class="w-12 text-center text-sm font-semibold bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-gray-800 py-1" title="Editar cantidad">
          <button type="button" id="btnMasCarrito-${index}" onclick="cambiarCantidad(${index}, 1)" class="px-2 py-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${enLimite ? 'opacity-40 cursor-not-allowed' : ''}" title="${enLimite ? 'Límite de stock alcanzado' : 'Sumar'}"><i data-lucide="plus" class="w-3.5 h-3.5"></i></button>
        </div>
        <span id="carritoItemSubtotal-${index}" class="w-20 text-right text-sm font-bold text-[#1c4d37] dark:text-emerald-400 flex-shrink-0">${fmt2(subtotal)}</span>
        <button type="button" onclick="eliminarDelCarrito(${index})" class="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0" title="Eliminar item">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  });

  contenedor.innerHTML = html;
  actualizarDisplaysTotalesVenta(totalVenta);
  if (window.lucide) lucide.createIcons();
}

function actualizarTotalesCarritoEnVivo() {
  const resumen = document.getElementById('carritoResumen');
  const unidades = carritoActual.reduce((t, i) => t + i.cantidad * i.contiene, 0);
  const totalVenta = totalLineas(carritoActual);
  if (resumen) resumen.textContent = `${carritoActual.length} ${carritoActual.length === 1 ? 'línea' : 'líneas'} · ${unidades} und`;
  actualizarDisplaysTotalesVenta(totalVenta);
}

function editarCantidadCarrito(index, input) {
  const item = carritoActual[index];
  if (!item || !input) return;

  const limpio = input.value.replace(/\D+/g, '').replace(/^0+/, '');
  if (input.value !== limpio) input.value = limpio;
  if (!limpio) return; // Se normaliza en onblur si lo deja vacío

  const stockMax = stockDisponibleDe(item.id);
  let nuevaCant = parseInt(limpio, 10);
  if (nuevaCant > stockMax) {
    nuevaCant = stockMax;
    input.value = String(stockMax);
    toast(`No puedes superar el stock disponible en inventario (${stockMax} para "${item.nombre}").`);
  }

  item.cantidad = nuevaCant;
  const subEl = document.getElementById(`carritoItemSubtotal-${index}`);
  if (subEl) subEl.textContent = fmt2(item.precio * item.cantidad);
  const udsEl = document.getElementById(`carritoItemUds-${index}`);
  if (udsEl) udsEl.textContent = String(item.cantidad * item.contiene);
  const btnMas = document.getElementById(`btnMasCarrito-${index}`);
  if (btnMas) btnMas.classList.toggle('opacity-40', item.cantidad >= stockMax);
  if (btnMas) btnMas.classList.toggle('cursor-not-allowed', item.cantidad >= stockMax);

  actualizarTotalesCarritoEnVivo();
  cargarProductos();
}

function normalizarCantidadCarrito(index, input) {
  const item = carritoActual[index];
  if (!item || !input) return;
  const limpio = input.value.replace(/\D+/g, '').replace(/^0+/, '');
  const stockMax = stockDisponibleDe(item.id);
  if (!limpio || parseInt(limpio, 10) <= 0) {
    item.cantidad = 1;
  } else {
    item.cantidad = Math.min(stockMax, parseInt(limpio, 10));
  }
  renderizarCarrito();
  cargarProductos();
}

function cambiarCantidad(index, delta) {
  const item = carritoActual[index];
  if (!item) return;

  if (delta > 0) {
    const stockMax = stockDisponibleDe(item.id);
    if (item.cantidad + delta > stockMax) {
      item.cantidad = stockMax;
      toast(`Límite de inventario alcanzado: solo hay ${stockMax} disponibles de "${item.nombre}".`);
      renderizarCarrito();
      cargarProductos();
      return;
    }
  }

  item.cantidad += delta;
  if (item.cantidad <= 0) carritoActual.splice(index, 1);
  renderizarCarrito();
  cargarProductos();
}

function eliminarDelCarrito(index) {
  carritoActual.splice(index, 1);
  renderizarCarrito();
  cargarProductos();
}

function cerrarModalVentaRegistrada() {
  closeModal('modalVentaRegistrada');
}

function procesarVenta() {
  const selectCliente = document.getElementById('clienteSelect');
  if (!selectCliente) return;

  if (!selectCliente.value) {
    toast("Por favor, selecciona un cliente antes de generar la venta.");
    return;
  }

  if (carritoActual.length === 0) {
    toast("Agrega al menos un producto para procesar la venta.");
    return;
  }

  // Verificar disponibilidad en inventario antes de confirmar la venta
  inventarioVentas = obtenerInventarioCompartido();
  for (const linea of carritoActual) {
    const disp = stockDisponibleDe(linea.id);
    if (linea.cantidad > disp) {
      toast(`Stock insuficiente para "${linea.nombre}". Disponible en inventario: ${disp}. Ajusta la cantidad antes de continuar.`);
      renderizarCarrito();
      return;
    }
  }

  const creditoVal = (document.getElementById('creditoSelect') && document.getElementById('creditoSelect').value) || '0';
  const tasa = obtenerTasaBCV();
  const totalUsd = totalLineas(carritoActual);
  const totalBs = Math.round(totalUsd * tasa * 100) / 100;
  const baseUsd = Math.round((totalUsd / 1.16) * 100) / 100;
  const ivaUsd = Math.round((totalUsd - baseUsd) * 100) / 100;
  const totalUds = carritoActual.reduce((sum, i) => sum + ((Number(i.cantidad) || 0) * (Number(i.contiene) || 1)), 0);
  const totalEmpaques = carritoActual.reduce((sum, i) => sum + (Number(i.cantidad) || 0), 0);
  const clienteNombre = selectCliente.value;
  const cliObj = CLIENTES.find(c => c.nombre === clienteNombre) || {};
  const rutaActiva = obtenerRutaActivaVentas();
  if (!esClienteDeRutaActiva(clienteNombre)) {
    toast(`El cliente seleccionado no pertenece a la cartera de ${rutaActiva}.`);
    return;
  }
  if (cliObj.activo === false) {
    notificarClienteDesactivado(clienteNombre);
    return;
  }
  const idPreliminar = siguienteId('V', ventasData);

  const construirFilasDetalleProductos = (items) => items.map(i => {
    const tipo = tipoPresentacionDeItem(i);
    const etq = etiquetaEmpaqueSegunCantidad(tipo, i.cantidad);
    const udsLinea = (Number(i.cantidad) || 0) * (Number(i.contiene) || 1);
    const subUsd = (Number(i.cantidad) || 0) * (Number(i.precio) || 0);
    const subBs = subUsd * tasa;
    return `
      <div class="flex items-start justify-between gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0 text-xs">
        <div class="min-w-0">
          <p class="font-semibold text-gray-800 dark:text-gray-100 truncate">${escHtml(i.nombre)}</p>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">
            <span class="font-semibold text-[#1c4d37] dark:text-emerald-400">${i.cantidad} ${escHtml(etq)}</span>
            ${i.contiene > 1 ? ` × ${i.contiene} uds = <b>${udsLinea} uds</b>` : ` (<b>${udsLinea} uds</b>)`}
            · P.Unit: ${fmt2(i.precio)}
          </p>
        </div>
        <div class="text-right whitespace-nowrap flex-shrink-0">
          <p class="font-bold text-gray-900 dark:text-white">${fmt2(subUsd)}</p>
          <p class="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">${fmtBs(subBs)}</p>
        </div>
      </div>
    `;
  }).join('');

  const resumenEmpaquesPrelim = resumenEmpaquesPedido({ items: carritoActual });
  const filasCarritoHtml = construirFilasDetalleProductos(carritoActual);

  const detalleConfirmHtml = `
    <div class="flex justify-between items-center pb-1.5 border-b border-gray-200 dark:border-gray-700">
      <span class="text-xs uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">Orden Preliminar</span>
      <span class="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-300">${escHtml(idPreliminar)} · ${fmtFecha(hoyISO)}</span>
    </div>
    <div class="flex justify-between gap-2"><span class="text-gray-500 dark:text-gray-400">Cliente:</span><span class="font-semibold text-gray-800 dark:text-gray-100 text-right">${escHtml(clienteNombre)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">RIF / Municipio:</span><span class="font-mono text-xs font-medium text-gray-700 dark:text-gray-200">${escHtml(cliObj.rif || 'Sin RIF')} · ${escHtml(cliObj.zona || 'Nueva Esparta')}</span></div>
    ${cliObj.telefono ? `<div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Teléfono / Contacto:</span><span class="text-xs font-medium text-gray-700 dark:text-gray-200">${escHtml(cliObj.telefono)}${cliObj.contacto ? ' · ' + escHtml(cliObj.contacto) : ''}</span></div>` : ''}
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Condición de Pago:</span><span class="font-semibold text-[#1c4d37] dark:text-emerald-400">${escHtml(etiquetaCredito(creditoVal))}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Tasa BCV del Día:</span><span class="font-mono text-xs font-medium text-gray-700 dark:text-gray-200">${fmtBs(tasa)} / USD</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Empaques / Unidades:</span><span class="font-medium text-gray-700 dark:text-gray-200 text-right text-xs">${escHtml(resumenEmpaquesPrelim || (totalEmpaques + ' empaques'))} (<b>${totalUds} uds</b>)</span></div>
    <div class="border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
      <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Desglose de Productos (${carritoActual.length} ${carritoActual.length === 1 ? 'línea' : 'líneas'})</p>
      <div class="max-h-36 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1">
        ${filasCarritoHtml}
      </div>
    </div>
    <div class="space-y-1 border-t border-gray-200 dark:border-gray-700 pt-2 text-xs">
      <div class="flex justify-between text-gray-500 dark:text-gray-400"><span>Base Imponible:</span><span>${fmt2(baseUsd)} · ${fmtBs(baseUsd * tasa)}</span></div>
      <div class="flex justify-between text-gray-500 dark:text-gray-400"><span>IVA (16%):</span><span>${fmt2(ivaUsd)} · ${fmtBs(ivaUsd * tasa)}</span></div>
      <div class="flex justify-between items-baseline pt-1">
        <span class="text-gray-700 dark:text-gray-200 font-bold text-sm">Total a Registrar:</span>
        <div class="text-right">
          <p class="font-bold text-lg text-[#1c4d37] dark:text-emerald-400">${fmt2(totalUsd)}</p>
          <p class="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300">${fmtBs(totalBs)}</p>
        </div>
      </div>
    </div>
    <div class="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300">
      ${escHtml(textoAvisoTasaBs(creditoVal))}
    </div>
  `;

  confirmarAccionSistema({
    titulo: 'Confirmar Venta',
    mensaje: 'Verifica el desglose completo antes de registrar la venta y descontar del inventario.',
    icono: 'shopping-cart',
    textoConfirmar: 'Confirmar Venta',
    detalleHtml: detalleConfirmHtml,
    onConfirm: () => {
      // Re-verificar disponibilidad en inventario antes de confirmar definitivamente
      inventarioVentas = obtenerInventarioCompartido();
      for (const linea of carritoActual) {
        const disp = stockDisponibleDe(linea.id);
        if (linea.cantidad > disp) {
          toast(`Stock insuficiente para "${linea.nombre}". Disponible en inventario: ${disp}. Ajusta la cantidad antes de continuar.`);
          renderizarCarrito();
          return;
        }
      }

      const venta = {
        id: siguienteId('V', ventasData),
        cliente: clienteNombre,
        ruta: cliObj.ruta || rutaActiva,
        fecha: hoyISO,
        credito: creditoVal,
        estado: 'Pendiente',
        stockDescontado: true,
        tasaBcv: tasa,
        items: carritoActual.map(i => ({
          id: i.id,
          nombre: i.nombre,
          tipo: tipoPresentacionDeItem(i),
          cantidad: i.cantidad,
          contiene: i.contiene,
          precio: i.precio
        })),
        total: totalUsd
      };

      // Descontar del inventario compartido y registrar en el Kardex de Despacho
      venta.items.forEach(linea => {
        const itemInv = inventarioVentas.find(x => x.id === linea.id);
        if (itemInv) {
          itemInv.stock = Math.max(0, itemInv.stock - linea.cantidad);
        }
      });
      guardarInventarioCompartido();
      registrarMovimientoInventarioDesdeVenta(
        'salida',
        `Pedido ${venta.id} · ${venta.cliente}`,
        `Salida comprometida desde Generar Venta (${etiquetaCredito(creditoVal)})`,
        venta.items
      );

      ventasData.unshift(venta);
      guardarDatos();

      // Mostrar cuadro modal de confirmación con botón Aceptar, desglose de productos y aviso de Bs
      const detalleModal = document.getElementById('modalVentaRegistradaDetalle');
      const unidadesTotales = unidadesDe(venta);
      const desgloseEmp = resumenEmpaquesPedido(venta);
      if (detalleModal) {
        detalleModal.innerHTML = `
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">N° de Venta:</span><span class="font-bold text-[#1c4d37] dark:text-emerald-400">${escHtml(venta.id)}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Fecha de Emisión:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${fmtFecha(venta.fecha)}</span></div>
          <div class="flex justify-between gap-2"><span class="text-gray-500 dark:text-gray-400">Cliente:</span><span class="font-semibold text-gray-800 dark:text-gray-100 text-right">${escHtml(venta.cliente)}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">RIF / Municipio:</span><span class="font-mono text-xs font-medium text-gray-700 dark:text-gray-200">${escHtml(cliObj.rif || 'Sin RIF')} · ${escHtml(cliObj.zona || 'Nueva Esparta')}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Condición:</span><span class="font-medium text-gray-700 dark:text-gray-200">${escHtml(etiquetaCredito(creditoVal))}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Tasa BCV:</span><span class="font-mono text-xs font-medium text-gray-700 dark:text-gray-200">${fmtBs(tasa)} / USD</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Empaques / Unidades:</span><span class="font-medium text-gray-700 dark:text-gray-200 text-xs">${escHtml(desgloseEmp)} (${unidadesTotales} und)</span></div>
          <div class="border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Productos Registrados (${venta.items.length})</p>
            <div class="max-h-36 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1">
              ${construirFilasDetalleProductos(venta.items)}
            </div>
          </div>
          <div class="space-y-1 border-t border-gray-200 dark:border-gray-700 pt-2 text-xs">
            <div class="flex justify-between text-gray-500 dark:text-gray-400"><span>Base Imponible:</span><span>${fmt2(baseUsd)} · ${fmtBs(baseUsd * tasa)}</span></div>
            <div class="flex justify-between text-gray-500 dark:text-gray-400"><span>IVA (16%):</span><span>${fmt2(ivaUsd)} · ${fmtBs(ivaUsd * tasa)}</span></div>
            <div class="flex justify-between items-baseline pt-1">
              <span class="text-gray-700 dark:text-gray-200 font-semibold text-sm">Total Registrado:</span>
              <div class="text-right">
                <p class="font-bold text-lg text-[#1c4d37] dark:text-emerald-400">${fmt2(venta.total)}</p>
                <p class="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300">${fmtBs(montoBsDeVenta(venta))}</p>
              </div>
            </div>
          </div>
          <div class="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300">
            ${escHtml(textoAvisoTasaBs(creditoVal))}
          </div>
        `;
      }
      openModal('modalVentaRegistrada');
      toast(`¡Venta ${venta.id} registrada exitosamente!`);
      if (window.lucide) lucide.createIcons();

      limpiarCliente();
      seleccionarCredito('0');
      document.getElementById('clienteLista').classList.add('hidden');
      carritoActual = [];
      renderizarCarrito();
      cargarProductos();
    }
  });
}


// --- LÓGICA DE HISTORIAL DE VENTAS (`historial.php`) ---
function getBadgeEstado(estado) {
  switch (estado) {
    case 'Completada':
      return '<span class="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium">Completada</span>';
    case 'Pendiente':
      return '<span class="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs px-2.5 py-1 rounded-md font-medium">Pendiente</span>';
    case 'Cancelada':
      return '<span class="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs px-2.5 py-1 rounded-md font-medium">Cancelada</span>';
    default:
      return `<span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-md font-medium">${escHtml(estado)}</span>`;
  }
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

let ordenHistorial = { campo: 'fecha', dir: 'desc' };

function resumenEmpaquesPedido(venta) {
  if (!venta || !Array.isArray(venta.items) || !venta.items.length) return '';
  const conteo = {};
  venta.items.forEach(i => {
    const t = tipoPresentacionDeItem(i);
    conteo[t] = (conteo[t] || 0) + (Number(i.cantidad) || 0);
  });
  return Object.entries(conteo)
    .map(([tipo, cant]) => `${cant} ${etiquetaEmpaqueSegunCantidad(tipo, cant)}`)
    .join(' · ');
}

function ordenarListaHistorial(lista) {
  const copia = [...lista];
  const mult = ordenHistorial.dir === 'asc' ? 1 : -1;
  copia.sort((a, b) => {
    let va, vb;
    switch (ordenHistorial.campo) {
      case 'fecha':
        va = String(a.fecha || '');
        vb = String(b.fecha || '');
        return va.localeCompare(vb) * mult;
      case 'items':
        va = unidadesDe(a);
        vb = unidadesDe(b);
        return (va - vb) * mult;
      case 'total':
        va = Number(a.total) || 0;
        vb = Number(b.total) || 0;
        return (va - vb) * mult;
      case 'estado':
        va = String(a.estado || '');
        vb = String(b.estado || '');
        return va.localeCompare(vb) * mult;
      default:
        return 0;
    }
  });
  return copia;
}

function actualizarIconosOrdenHistorial() {
  ['fecha', 'items', 'total', 'estado'].forEach(c => {
    const icon = document.getElementById(`sortIconHist-${c}`);
    if (!icon) return;
    if (ordenHistorial.campo === c) {
      icon.setAttribute('data-lucide', ordenHistorial.dir === 'asc' ? 'arrow-up' : 'arrow-down');
      icon.classList.remove('opacity-60');
      icon.classList.add('opacity-100');
    } else {
      icon.setAttribute('data-lucide', 'arrow-up-down');
      icon.classList.add('opacity-60');
      icon.classList.remove('opacity-100');
    }
  });
}

function ordenarHistorialPor(campo) {
  if (ordenHistorial.campo === campo) {
    ordenHistorial.dir = ordenHistorial.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenHistorial.campo = campo;
    ordenHistorial.dir = campo === 'estado' ? 'asc' : 'desc';
  }
  filtrarHistorial();
}

function obtenerEstadoDespachoDeVenta(venta) {
  if (!venta || venta.estado === 'Cancelada') {
    return { paso: 0, estado: 'Anulado', guiaId: '', facturaNumero: '' };
  }
  let facturas = [];
  let despachos = [];
  try { facturas = JSON.parse(localStorage.getItem('gs_facturas_v1')) || []; } catch (e) {}
  try { despachos = JSON.parse(localStorage.getItem('gs_despachos_v1')) || []; } catch (e) {}

  const fac = facturas.find(f => f.ventaId === venta.id && f.estado !== 'Anulada');
  const orden = despachos.find(o =>
    (o.ventaId && o.ventaId === venta.id) ||
    (fac && o.facturaNumero && o.facturaNumero === fac.numero)
  );

  // Cuando llega de Facturación sin guía de carga aún no tiene estado de despacho
  if (!orden) {
    return {
      paso: 0,
      estado: 'Sin estado',
      guiaId: '',
      facturaNumero: fac ? fac.numero : '',
      facturada: Boolean(fac)
    };
  }

  let estRaw = orden.estado || 'En Preparación';
  if (estRaw === 'Pendiente' || estRaw === 'En Proceso') estRaw = 'En Preparación';
  if (estRaw === 'Despachado') estRaw = 'Completo';

  let paso = 1;
  if (estRaw === 'En Preparación') paso = 1;
  else if (estRaw === 'Completo') paso = 2;
  else if (estRaw === 'Con Incidencia') paso = 2;

  return {
    paso,
    estado: estRaw,
    guiaId: orden.id || '',
    facturaNumero: fac ? fac.numero : (orden.facturaNumero || ''),
    facturada: Boolean(fac)
  };
}

function getBadgeDespachoVenta(venta) {
  const info = obtenerEstadoDespachoDeVenta(venta);
  if (info.paso === 0) return '';
  if (info.estado === 'Completo') {
    return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/60"><i data-lucide="check-circle" class="w-3 h-3"></i> Despacho: Completo</span>`;
  }
  if (info.estado === 'En Preparación') {
    return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/60"><i data-lucide="package" class="w-3 h-3"></i> En Preparación</span>`;
  }
  if (info.estado === 'Con Incidencia') {
    return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/60"><i data-lucide="alert-triangle" class="w-3 h-3"></i> Con Incidencia</span>`;
  }
  return '';
}

function renderTablaHistorial(lista) {
  const tbody = document.getElementById('tablaHistorialVentas');
  if (!tbody) return;
  tbody.innerHTML = '';
  actualizarIconosOrdenHistorial();

  const rutaFiltro = obtenerRutaActivaVentas();
  const baseLista = Array.isArray(lista)
    ? lista.filter(v => normalizarRutaVenta(v.ruta || rutaDeCliente(v.cliente)) === rutaFiltro)
    : ventasDeRutaActiva();
  const ordenada = ordenarListaHistorial(baseLista);

  if (ordenada.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-8 text-gray-400 dark:text-gray-500">No se encontraron registros de ventas para ${escHtml(rutaFiltro)}.</td>
      </tr>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  ordenada.forEach(venta => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition cursor-pointer';
    tr.onclick = () => verDetalleVentaHistorial(venta.id);
    const desgloseEmpaques = resumenEmpaquesPedido(venta);
    const badgeDesp = getBadgeDespachoVenta(venta);
    const rutaVenta = venta.ruta || rutaDeCliente(venta.cliente);
    tr.innerHTML = `
      <td class="py-4 px-4"><p class="font-medium text-gray-900 dark:text-gray-100">${venta.id}</p><span class="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#1c4d37] dark:bg-emerald-900/30 dark:text-emerald-300">${escHtml(rutaVenta)}</span></td>
      <td class="py-4 px-4 text-gray-700 dark:text-gray-300">${escHtml(venta.cliente)}</td>
      <td class="py-4 px-4 text-gray-600 dark:text-gray-300 font-mono text-xs">${fmtFecha(venta.fecha)}</td>
      <td class="py-4 px-4">
        <p class="text-gray-800 dark:text-gray-200 font-medium">${unidadesDe(venta)} und</p>
        ${desgloseEmpaques ? `<p class="text-[11px] font-semibold text-[#1c4d37] dark:text-emerald-400">${escHtml(desgloseEmpaques)}</p>` : ''}
      </td>
      <td class="py-4 px-4">
        <p class="font-semibold text-gray-900 dark:text-gray-100">${fmt2(venta.total)}</p>
        <p class="text-xs font-semibold text-emerald-700 dark:text-emerald-400">${fmtBs(montoBsDeVenta(venta))}</p>
      </td>
      <td class="py-4 px-4">
        <div class="flex flex-col items-start gap-1">
          ${getBadgeEstado(venta.estado)}
          ${badgeDesp}
        </div>
      </td>
      <td class="py-4 px-4 text-center">
        <button class="text-gray-400 hover:text-[#1c4d37] dark:hover:text-emerald-400 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="Ver detalles">
          <i data-lucide="eye" class="w-4 h-4"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (window.lucide) lucide.createIcons();
}

function filtrarHistorial() {
  const inputBusq = document.getElementById('inputBusquedaHistorial');
  const selectEst = document.getElementById('filtroEstadoHistorial');
  if (!inputBusq || !selectEst) return;

  const query = inputBusq.value.toLowerCase();
  const estadoFiltro = selectEst.value;

  const filtradas = ventasDeRutaActiva().filter(venta => {
    const infoDesp = obtenerEstadoDespachoDeVenta(venta);
    const coincideTexto = venta.cliente.toLowerCase().includes(query) ||
      venta.id.toLowerCase().includes(query) ||
      fmtFecha(venta.fecha).toLowerCase().includes(query) ||
      infoDesp.estado.toLowerCase().includes(query);
    let coincideEstado = true;
    if (estadoFiltro && estadoFiltro !== 'Todos') {
      if (estadoFiltro.startsWith('DESP_')) {
        const buscado = estadoFiltro.replace('DESP_', '');
        coincideEstado = venta.estado !== 'Cancelada' && infoDesp.estado === buscado;
      } else {
        coincideEstado = venta.estado === estadoFiltro;
      }
    }
    return coincideTexto && coincideEstado;
  });

  renderTablaHistorial(filtradas);
}

// Detalle profesional del pedido (modal)
function verDetalleVentaHistorial(id) {
  const v = ventasData.find(x => x.id === id);
  const body = document.getElementById('modalVentaBody');
  if (!v || !body) return;

  const tasa = (Number(v.tasaBcv) > 0) ? Number(v.tasaBcv) : obtenerTasaBCV();
  const pagado = pagadoDe(v);
  const saldo = saldoDe(v);
  const pagos = pagosData.filter(p => p.ventaId === v.id);
  const cancelada = v.estado === 'Cancelada';
  const anulable = v.estado !== 'Cancelada'; // se permite anular pedidos pendientes o ya realizados

  const filas = v.items.map(i => {
    const tipoPres = tipoPresentacionDeItem(i);
    const etqPres = etiquetaEmpaqueSegunCantidad(tipoPres, i.cantidad);
    const subUsd = i.precio * i.cantidad;
    return `
    <tr>
      <td class="py-3 px-4 text-gray-800 dark:text-gray-100">
        <p class="font-medium">${escHtml(i.nombre)}</p>
        ${i.contiene > 1 ? `<p class="text-[11px] text-gray-400 dark:text-gray-500">Cada ${escHtml(tipoPres.toLowerCase())} trae ${i.contiene} uds</p>` : ''}
      </td>
      <td class="py-3 px-4 text-center">
        <span class="font-bold text-gray-900 dark:text-gray-100 block leading-tight">${i.cantidad}</span>
        <span class="text-[11px] font-semibold uppercase tracking-wide text-[#1c4d37] dark:text-emerald-400 block mt-0.5">${escHtml(etqPres)}</span>
      </td>
      <td class="py-3 px-4 text-center text-gray-500 dark:text-gray-400">${i.cantidad * i.contiene} uds</td>
      <td class="py-3 px-4 text-right">
        <p class="text-gray-800 dark:text-gray-200">${fmt2(i.precio)}</p>
        <p class="text-[11px] text-gray-400 dark:text-gray-500">${fmtBs(i.precio * tasa)}</p>
      </td>
      <td class="py-3 px-4 text-right">
        <p class="font-semibold text-gray-900 dark:text-gray-100">${fmt2(subUsd)}</p>
        <p class="text-xs font-semibold text-emerald-700 dark:text-emerald-400">${fmtBs(subUsd * tasa)}</p>
      </td>
    </tr>`;
  }).join('');

  const filasPagos = pagos.length ? pagos.map(p => {
    const tachado = p.estado === 'Anulado' || p.estado === 'Rechazado';
    const estadoBadge = p.estado === 'Por Verificar'
      ? '<span class="ml-1.5 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-medium">Por verificar en Cobranzas</span>'
      : p.estado === 'Anulado' || p.estado === 'Rechazado'
        ? `<span class="ml-1.5 text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-medium">${p.estado}</span>`
        : '<span class="ml-1.5 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-medium">Verificado</span>';
    return `
    <div class="flex items-center justify-between text-sm py-2 ${tachado ? 'opacity-60 line-through' : ''}">
      <div><p class="font-medium text-gray-800 dark:text-gray-100">${escHtml(p.metodo)} <span class="text-xs text-gray-400 font-normal">· ${escHtml(p.referencia || 'Sin referencia')}</span>${estadoBadge}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">${fmtFecha(p.fecha)} · ${p.id}</p></div>
      <div class="text-right">
        <span class="font-semibold block ${p.estado === 'Por Verificar' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">${fmt2(p.monto)}</span>
        <span class="text-[11px] text-gray-400 dark:text-gray-500">${fmtBs(p.monto * (p.tasa || tasa))}</span>
      </div>
    </div>`;
  }).join('') : '<p class="text-sm text-gray-400 dark:text-gray-500 py-2">Aún no hay pagos registrados para este pedido.</p>';

  const bloqueAnulacion = cancelada
    ? `<div class="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-900/20 text-sm text-red-800 dark:text-red-300 flex gap-3">
         <i data-lucide="ban" class="w-5 h-5 flex-shrink-0"></i>
         <div><p class="font-semibold">Venta anulada${v.anulacion ? ' el ' + fmtFecha(v.anulacion.fecha) : ''}</p><p>${escHtml(v.anulacion ? v.anulacion.motivo : 'Sin motivo registrado.')}</p></div>
       </div>`
    : '';

  const bloqueCompletada = v.estado === 'Completada'
    ? `<div class="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-900/20 text-sm text-emerald-800 dark:text-emerald-300 flex gap-3">
         <i data-lucide="check-circle" class="w-5 h-5 flex-shrink-0"></i>
         <p><span class="font-semibold">Venta completada.</span> El pedido fue pagado en su totalidad. Si necesitas anular la venta o su factura asociada, puedes hacerlo indicando el motivo.</p>
       </div>`
    : '';

  const infoDesp = obtenerEstadoDespachoDeVenta(v);
  const bloqueProgresoDespacho = !cancelada ? `
    <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/60 space-y-2.5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xs font-bold uppercase tracking-wider text-[#1c4d37] dark:text-emerald-400 flex items-center gap-1.5">
          <i data-lucide="truck" class="w-4 h-4"></i> Estado de Despacho
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">${infoDesp.facturaNumero ? `Factura ${escHtml(infoDesp.facturaNumero)}` : 'Sin factura emitida'}${infoDesp.guiaId ? ` · Guía ${escHtml(infoDesp.guiaId)}` : ' · Sin guía asignada'}</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div class="p-2.5 rounded-lg border ${infoDesp.facturada ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'}">
          <p class="leading-tight">1. Facturada (Sin estado)</p>
          <p class="text-[10px] opacity-80 font-normal">Lista para guía de carga</p>
        </div>
        <div class="p-2.5 rounded-lg border ${infoDesp.paso >= 1 ? 'bg-blue-50 dark:bg-blue-900/25 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300 font-semibold' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'}">
          <p class="leading-tight">2. En Preparación</p>
          <p class="text-[10px] opacity-80 font-normal">Guía de carga asignada</p>
        </div>
        <div class="p-2.5 rounded-lg border ${infoDesp.estado === 'Completo' ? 'bg-emerald-50 dark:bg-emerald-900/25 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-semibold' : infoDesp.estado === 'Con Incidencia' ? 'bg-red-50 dark:bg-red-900/25 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 font-semibold' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'}">
          <p class="leading-tight">3. ${infoDesp.estado === 'Con Incidencia' ? 'Con Incidencia' : 'Completo'}</p>
          <p class="text-[10px] opacity-80 font-normal">Estado de Despacho</p>
        </div>
      </div>
    </div>` : '';

  body.innerHTML = `
    <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">Detalle del pedido</p>
        <h3 class="text-2xl font-bold text-[#1c4d37] dark:text-white">${v.id}</h3>
      </div>
      <div class="flex items-center gap-3">
        ${getBadgeEstado(v.estado)}
        <button onclick="closeModal('modalVenta')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Cerrar"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div><p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Cliente</p><p class="font-medium text-gray-800 dark:text-gray-100">${escHtml(v.cliente)}</p></div>
        <div><p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Fecha</p><p class="font-medium font-mono text-gray-800 dark:text-gray-100">${fmtFecha(v.fecha)}</p></div>
        <div><p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Crédito</p><p class="font-medium text-[#1c4d37] dark:text-emerald-400">${escHtml(etiquetaCredito(v.credito))}</p></div>
        <div><p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Productos</p><p class="font-medium text-gray-800 dark:text-gray-100">${v.items.length} líneas</p></div>
        <div><p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Unidades</p><p class="font-medium text-gray-800 dark:text-gray-100">${unidadesDe(v)}</p></div>
      </div>

      ${bloqueAnulacion}
      ${bloqueCompletada}
      ${bloqueProgresoDespacho}

      <div class="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 dark:bg-gray-900/60 text-xs uppercase text-[#1c4d37] dark:text-emerald-400 font-bold">
            <tr><th class="py-3 px-4">Producto</th><th class="py-3 px-4 text-center">Cant.</th><th class="py-3 px-4 text-center">Unidades</th><th class="py-3 px-4 text-right">Precio</th><th class="py-3 px-4 text-right">Subtotal</th></tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">${filas}</tbody>
        </table>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Pagos registrados</p>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">${filasPagos}</div>
        </div>
        <div class="space-y-3 self-start">
          <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2.5 text-sm">
            <div class="flex justify-between items-baseline">
              <span class="text-gray-500 dark:text-gray-400">Total del pedido</span>
              <div class="text-right">
                <p class="font-bold text-gray-900 dark:text-white">${fmt2(v.total)}</p>
                <p class="text-xs font-semibold text-emerald-700 dark:text-emerald-400">${fmtBs(v.total * tasa)}</p>
              </div>
            </div>
            <div class="flex justify-between items-baseline">
              <span class="text-gray-500 dark:text-gray-400">Pagado (verificado)</span>
              <div class="text-right">
                <p class="font-semibold text-emerald-600 dark:text-emerald-400">${fmt2(pagado)}</p>
                <p class="text-[11px] text-gray-400 dark:text-gray-500">${fmtBs(pagado * tasa)}</p>
              </div>
            </div>
            ${enVerificacionDe(v) > 0 ? `<div class="flex justify-between items-baseline"><span class="text-gray-500 dark:text-gray-400">En verificación (Cobranzas)</span><span class="font-semibold text-amber-600 dark:text-amber-400">${fmt2(enVerificacionDe(v))}</span></div>` : ''}
            <div class="flex justify-between items-baseline border-t border-gray-200 dark:border-gray-700 pt-2">
              <span class="text-gray-500 dark:text-gray-400">Saldo pendiente</span>
              <div class="text-right">
                <p class="font-bold ${cancelada ? 'text-gray-400' : saldo > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">${cancelada ? '—' : fmt2(saldo)}</p>
                ${!cancelada ? `<p class="text-xs font-semibold text-amber-700 dark:text-amber-300">${fmtBs(saldo * tasa)}</p>` : ''}
              </div>
            </div>
          </div>
          <div class="flex items-start gap-2.5 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 rounded-xl px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300">
            <i data-lucide="info" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
            <p>${escHtml(textoAvisoTasaBs(v.credito))}</p>
          </div>
        </div>
      </div>

      <div id="panelAnular" class="hidden p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-900/20 space-y-3">
        <p class="text-sm text-red-800 dark:text-red-300">${textoAdvertenciaAnulacion(v, pagado)}</p>
        <textarea id="motivoAnulacion" rows="2" placeholder="Motivo de la anulación (obligatorio)" class="w-full bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/60 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm"></textarea>
        <div class="flex justify-end gap-2">
          <button onclick="document.getElementById('panelAnular').classList.add('hidden')" class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-white dark:hover:bg-gray-700 transition-colors">Volver</button>
          <button onclick="confirmarAnulacion('${v.id}')" class="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-colors text-sm">Confirmar anulación</button>
        </div>
      </div>
    </div>

    <div class="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
      <button onclick="closeModal('modalVenta')" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cerrar</button>
      ${!anulable ? '' : `<button onclick="document.getElementById('panelAnular').classList.remove('hidden')" class="bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 px-5 py-3 rounded-xl font-medium transition-colors text-sm flex items-center gap-2"><i data-lucide="ban" class="w-4 h-4"></i> Anular venta</button>`}
    </div>`;

  openModal('modalVenta');
  if (window.lucide) lucide.createIcons();
}

function textoAdvertenciaAnulacion(v, pagado) {
  return pagado > 0
    ? `Esta venta está <b>${escHtml(v.estado)}</b> con cobros por ${fmt2(pagado)}. Al anularla se revertirán esos cobros y se habilitará la anulación fiscal de su factura. Esta acción no se puede deshacer.`
    : `Esta venta está <b>${escHtml(v.estado)}</b>. Al anularla el pedido quedará cancelado. Esta acción no se puede deshacer.`;
}

function confirmarAnulacion(id) {
  const motivo = document.getElementById('motivoAnulacion').value.trim();
  if (!motivo) {
    toast('Indica el motivo de la anulación.');
    return;
  }
  const v = ventasData.find(x => x.id === id);
  if (!v || v.estado === 'Cancelada') {
    toast('Esta venta ya se encuentra anulada.');
    return;
  }

  const tasa = (Number(v.tasaBcv) > 0) ? Number(v.tasaBcv) : obtenerTasaBCV();
  const detalleHtml = `
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">N° de Pedido:</span><span class="font-bold text-red-600 dark:text-red-400">${escHtml(v.id)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Cliente:</span><span class="font-semibold text-gray-800 dark:text-gray-100">${escHtml(v.cliente)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Fecha:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${fmtFecha(v.fecha)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Monto ($ / Bs):</span><span class="font-bold text-gray-800 dark:text-gray-100">${fmt2(v.total)} · ${fmtBs(v.total * tasa)}</span></div>
    <div class="border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
      <span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Motivo de anulación:</span>
      <p class="text-xs font-medium text-red-600 dark:text-red-400">${escHtml(motivo)}</p>
    </div>
  `;

  confirmarAccionSistema({
    titulo: 'Confirmar Anulación de Venta',
    mensaje: 'El pedido quedará cancelado y los productos serán reintegrados automáticamente al inventario.',
    icono: 'ban',
    variante: 'danger',
    textoConfirmar: 'Confirmar Anulación',
    detalleHtml,
    onConfirm: () => {
      v.estado = 'Cancelada';
      v.anulacion = { motivo, fecha: hoyISO };
      pagosData.filter(p => p.ventaId === id).forEach(p => { p.estado = 'Anulado'; });

      // Si la venta había descontado productos del inventario, reintegrarlos al almacén
      if (v.stockDescontado && Array.isArray(v.items)) {
        inventarioVentas = obtenerInventarioCompartido();
        v.items.forEach(linea => {
          const itemInv = inventarioVentas.find(x => x.id === linea.id);
          if (itemInv) itemInv.stock += linea.cantidad;
        });
        v.stockDescontado = false;
        guardarInventarioCompartido();
        registrarMovimientoInventarioDesdeVenta(
          'entrada',
          `Reintegro por anulación ${v.id}`,
          `Devolución automática al inventario: ${motivo}`,
          v.items
        );
      }

      guardarDatos();
      closeModal('modalVenta');
      filtrarHistorial();
      toast(`Venta ${id} anulada correctamente.`);
    }
  });
}


// --- LÓGICA DE REGISTRO DE PAGOS (`caja.php`) ---
const TASA_BCV_DEFAULT = 60.50;
function obtenerTasaBCV() {
  const guardada = parseFloat(localStorage.getItem('gs_tasa_bcv'));
  return (guardada && guardada > 0) ? guardada : TASA_BCV_DEFAULT;
}

function esMetodoEnBs(metodo) {
  return metodo === 'Efectivo (Bs)' || metodo === 'Pago Móvil' || metodo === 'Transferencia';
}

function obtenerLimitesCobroActual() {
  const selVenta = document.getElementById('cobroVenta');
  const v = selVenta ? ventasData.find(x => x.id === selVenta.value) : null;
  const disponibleUsd = v ? Math.round(saldoPorRegistrarDe(v) * 100) / 100 : 0;
  const selMetodo = document.getElementById('cobroMetodo');
  const metodo = (selMetodo && selMetodo.value) || 'Efectivo ($)';
  const tasa = obtenerTasaBCV();

  let maxMonto = 0;
  if (v && disponibleUsd > 0) {
    if (metodo === 'Efectivo (Bs)') {
      maxMonto = Math.round(disponibleUsd * tasa);
    } else if (metodo === 'Efectivo ($)') {
      maxMonto = Math.floor(disponibleUsd);
    } else {
      // Pago Móvil y Transferencia se registran en Bolívares (Bs)
      maxMonto = Math.round(disponibleUsd * tasa * 100) / 100;
    }
  }
  return { venta: v, disponibleUsd, tasa, metodo, maxMonto };
}

function mostrarAvisoMontoCobro(msg) {
  const aviso = document.getElementById('cobroMontoAviso');
  if (!aviso) return;
  if (!msg) {
    aviso.textContent = '';
    aviso.classList.add('hidden');
    return;
  }
  aviso.textContent = msg;
  aviso.classList.remove('hidden');
}

function buscarPagoConReferenciaDuplicada(ref) {
  if (!ref || ref.length < 6) return null;
  return pagosData.find(p =>
    p.estado !== 'Anulado' &&
    p.estado !== 'Rechazado' &&
    String(p.referencia || '').trim() === ref
  ) || null;
}

function verificarReferenciaEnTiempoReal() {
  const inp = document.getElementById('cobroReferencia');
  const aviso = document.getElementById('cobroRefAviso');
  if (!inp || !aviso) return;
  const ref = inp.value.trim();
  if (!ref) {
    aviso.textContent = '';
    aviso.classList.add('hidden');
    return;
  }
  const dup = buscarPagoConReferenciaDuplicada(ref);
  if (dup) {
    aviso.textContent = `Referencia ya registrada en el cobro ${dup.id} (${dup.cliente}).`;
    aviso.classList.remove('hidden');
  } else if (ref.length < 6) {
    aviso.textContent = `Faltan ${6 - ref.length} dígito(s) (mínimo 6 dígitos).`;
    aviso.classList.remove('hidden');
  } else {
    aviso.textContent = '';
    aviso.classList.add('hidden');
  }
}

function bloquearTeclasSoloNumeros(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const permitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];
  if (permitidas.includes(e.key)) return;
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
}

function validarInputSoloNumeros(input, maxLen = 8) {
  if (!input) return;
  const limpio = input.value.replace(/\D+/g, '').slice(0, maxLen);
  if (input.value !== limpio) input.value = limpio;
  if (input.id === 'cobroReferencia') verificarReferenciaEnTiempoReal();
}

function pegarReferencia(e, input) {
  e.preventDefault();
  const texto = (e.clipboardData || window.clipboardData).getData('text') || '';
  const digitos = texto.replace(/\D+/g, '');
  input.value = digitos.length > 8 ? digitos.slice(-8) : digitos;
  verificarReferenciaEnTiempoReal();
}

function bloquearTeclasMontoCobro(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const permitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];
  if (permitidas.includes(e.key)) return;
  const { metodo } = obtenerLimitesCobroActual();
  const esEfectivo = metodo === 'Efectivo ($)' || metodo === 'Efectivo (Bs)';
  if (esEfectivo) {
    // Efectivo: SOLO números enteros, nada de letras, comas ni puntos decimales
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  } else {
    // Electrónico: permite dígitos y un solo punto o coma decimal
    if (e.key === '.' || e.key === ',') {
      const val = e.target.value || '';
      if (!val || val.includes('.') || val.includes(',')) e.preventDefault();
      return;
    }
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  }
}

function actualizarMontoCobro(input) {
  if (!input) return;
  const { venta, metodo, maxMonto } = obtenerLimitesCobroActual();
  if (!venta) {
    input.value = '';
    mostrarAvisoMontoCobro('Selecciona primero un pedido para ingresar el monto.');
    calcularEquivalenteCobro();
    return;
  }

  const esEfectivo = metodo === 'Efectivo ($)' || metodo === 'Efectivo (Bs)';
  mostrarAvisoMontoCobro('');

  if (esEfectivo) {
    let enteros = input.value.replace(/\D+/g, '').replace(/^0+/, '');
    if (enteros) {
      const num = parseInt(enteros, 10);
      if (num > maxMonto) {
        enteros = maxMonto > 0 ? String(maxMonto) : '';
        const etqMax = metodo === 'Efectivo (Bs)'
          ? `Bs. ${new Intl.NumberFormat('es-VE').format(maxMonto)}`
          : fmt2(maxMonto);
        const msg = `No puedes superar el saldo máximo de la factura (${etqMax}).`;
        mostrarAvisoMontoCobro(msg);
        toast(msg);
      }
    }
    if (input.value !== enteros) input.value = enteros;
  } else {
    let val = input.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    const partes = val.split('.');
    if (partes.length > 2) {
      val = partes[0] + '.' + partes.slice(1).join('');
    }
    if (partes[0] && partes[0].length > 1) {
      partes[0] = partes[0].replace(/^0+(?=\d)/, '');
      val = partes.length > 1 ? `${partes[0]}.${partes[1]}` : partes[0];
    }
    if (val.includes('.')) {
      const [ent, dec] = val.split('.');
      val = `${ent}.${(dec || '').slice(0, 2)}`;
    }
    const num = parseFloat(val);
    if (!isNaN(num) && num > maxMonto) {
      val = Number.isInteger(maxMonto) ? String(maxMonto) : maxMonto.toFixed(2);
      const msg = `No puedes superar el saldo máximo de la factura (${fmtBs(maxMonto)}).`;
      mostrarAvisoMontoCobro(msg);
      toast(msg);
    }
    if (input.value !== val) input.value = val;
  }

  calcularEquivalenteCobro();
}

function pegarMontoCobro(e, input) {
  e.preventDefault();
  const texto = (e.clipboardData || window.clipboardData).getData('text') || '';
  input.value = texto;
  actualizarMontoCobro(input);
}

function rellenarMaximoCobro() {
  const { venta, metodo, maxMonto } = obtenerLimitesCobroActual();
  const inp = document.getElementById('cobroMonto');
  if (!venta || !inp) return;
  if (metodo === 'Efectivo (Bs)' || metodo === 'Efectivo ($)') {
    inp.value = maxMonto > 0 ? String(maxMonto) : '';
  } else {
    inp.value = maxMonto > 0 ? (Number.isInteger(maxMonto) ? String(maxMonto) : maxMonto.toFixed(2)) : '';
  }
  mostrarAvisoMontoCobro('');
  calcularEquivalenteCobro();
}

function actualizarBadgeMaximoCobro() {
  const badge = document.getElementById('cobroMontoMaxBadge');
  if (!badge) return;
  const { venta, metodo, maxMonto } = obtenerLimitesCobroActual();
  if (!venta || maxMonto <= 0) {
    badge.classList.add('hidden');
    return;
  }
  badge.classList.remove('hidden');
  if (metodo === 'Efectivo (Bs)') {
    badge.textContent = `Máx: Bs. ${new Intl.NumberFormat('es-VE').format(maxMonto)}`;
  } else if (metodo === 'Efectivo ($)') {
    badge.textContent = `Máx: $${maxMonto}`;
  } else {
    badge.textContent = `Máx: ${fmtBs(maxMonto)}`;
  }
}

function calcularEquivalenteCobro() {
  const { venta, disponibleUsd, tasa, metodo, maxMonto } = obtenerLimitesCobroActual();
  const wrapEquiv = document.getElementById('wrapperCobroEquivalente');
  const txtUsd = document.getElementById('cobroEquivalenteUsd');
  const infoTasa = document.getElementById('cobroTasaInfo');
  const tituloEquiv = document.getElementById('cobroEquivTitulo');
  const subMontoBs = document.getElementById('cobroMontoBsSub');
  const inpMonto = document.getElementById('cobroMonto');
  const valorRaw = parseFloat((inpMonto && inpMonto.value) || '0') || 0;

  if (subMontoBs) {
    if (!venta) {
      subMontoBs.textContent = '';
    } else if (esMetodoEnBs(metodo)) {
      const bsActual = valorRaw > 0 ? valorRaw : (disponibleUsd * tasa);
      subMontoBs.textContent = `Total en Bs: ${fmtBs(bsActual)} (Total pedido: ${fmtBs(venta.total * tasa)})`;
    } else {
      const usdActual = valorRaw > 0 ? valorRaw : disponibleUsd;
      subMontoBs.textContent = `Total en Bs: ${fmtBs(usdActual * tasa)} (Total pedido: ${fmtBs(venta.total * tasa)})`;
    }
  }

  if (!wrapEquiv || !txtUsd) return;

  if (esMetodoEnBs(metodo)) {
    wrapEquiv.classList.remove('hidden');
    if (tituloEquiv) tituloEquiv.textContent = 'Equivalente en Dólares (Referencia BCV)';
    if (infoTasa) infoTasa.textContent = `Tasa oficial BCV: Bs. ${tasa.toFixed(2)} / USD`;
    const montoBs = valorRaw;
    let usdCalc = 0;
    if (montoBs > 0 && tasa > 0) {
      usdCalc = (venta && Math.abs(montoBs - maxMonto) < 0.01) ? disponibleUsd : (montoBs / tasa);
    }
    txtUsd.textContent = `$${usdCalc.toFixed(2)} USD`;
  } else {
    wrapEquiv.classList.add('hidden');
  }
}

function badgeEstadoPago(estado) {
  if (estado === 'Por Verificar') {
    return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Por Verificar (Cobranzas)</span>';
  }
  if (estado === 'Anulado' || estado === 'Rechazado') {
    return `<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">${estado}</span>`;
  }
  return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Verificado</span>';
}

let ordenPagos = { campo: 'fecha', dir: 'desc' };

function estadoNormalizadoPago(p) {
  if (!p) return 'Verificado';
  if (p.estado === 'Por Verificar') return 'Por Verificar';
  if (p.estado === 'Anulado' || p.estado === 'Rechazado') return p.estado;
  return 'Verificado';
}

function ordenarListaPagos(lista) {
  const copia = [...lista];
  const mult = ordenPagos.dir === 'asc' ? 1 : -1;
  copia.sort((a, b) => {
    switch (ordenPagos.campo) {
      case 'fecha':
        return String(a.fecha || '').localeCompare(String(b.fecha || '')) * mult;
      case 'metodo':
        return String(a.metodo || '').localeCompare(String(b.metodo || '')) * mult;
      case 'monto':
        return ((Number(a.monto) || 0) - (Number(b.monto) || 0)) * mult;
      case 'estado':
        return estadoNormalizadoPago(a).localeCompare(estadoNormalizadoPago(b)) * mult;
      default:
        return 0;
    }
  });
  return copia;
}

function actualizarIconosOrdenPagos() {
  ['fecha', 'metodo', 'monto', 'estado'].forEach(c => {
    const icon = document.getElementById(`sortIconPagos-${c}`);
    if (!icon) return;
    if (ordenPagos.campo === c) {
      icon.setAttribute('data-lucide', ordenPagos.dir === 'asc' ? 'arrow-up' : 'arrow-down');
      icon.classList.remove('opacity-60');
      icon.classList.add('opacity-100');
    } else {
      icon.setAttribute('data-lucide', 'arrow-up-down');
      icon.classList.add('opacity-60');
      icon.classList.remove('opacity-100');
    }
  });
}

function ordenarPagosPor(campo) {
  if (ordenPagos.campo === campo) {
    ordenPagos.dir = ordenPagos.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenPagos.campo = campo;
    ordenPagos.dir = (campo === 'metodo' || campo === 'estado') ? 'asc' : 'desc';
  }
  renderPagos();
}

function renderPagos() {
  const tbody = document.getElementById('tablaPagos');
  if (!tbody) return;
  const q = (document.getElementById('busquedaPagos') && document.getElementById('busquedaPagos').value || '').toLowerCase();
  const fMetodo = (document.getElementById('filtroMetodoPagos') && document.getElementById('filtroMetodoPagos').value) || 'Todos';
  const fEstado = (document.getElementById('filtroEstadoPagos') && document.getElementById('filtroEstadoPagos').value) || 'Todos';
  const fFecha = (document.getElementById('filtroFechaPagos') && document.getElementById('filtroFechaPagos').value) || '';
  const tasaActual = obtenerTasaBCV();

  actualizarIconosOrdenPagos();

  const pagosRuta = pagosDeRutaActiva();
  const ventasRuta = ventasDeRutaActiva();
  const filtrada = pagosRuta.filter(p => {
    const texto = (p.cliente + ' ' + (p.referencia || '') + ' ' + p.ventaId + ' ' + p.metodo + ' ' + (p.banco || '') + ' ' + p.estado + ' ' + fmtFecha(p.fecha)).toLowerCase();
    if (q && !texto.includes(q)) return false;
    if (fMetodo !== 'Todos' && p.metodo !== fMetodo) return false;
    if (fEstado !== 'Todos') {
      if (fEstado === 'Verificado' && p.estado !== 'Completado' && p.estado !== 'Verificado') return false;
      if (fEstado === 'Por Verificar' && p.estado !== 'Por Verificar') return false;
      if (fEstado === 'Anulado' && p.estado !== 'Anulado' && p.estado !== 'Rechazado') return false;
    }
    if (fFecha && p.fecha !== fFecha) return false;
    return true;
  });

  const lista = ordenarListaPagos(filtrada);

  tbody.innerHTML = lista.length ? lista.map(p => {
    const inactivo = p.estado === 'Anulado' || p.estado === 'Rechazado';
    const pendienteVerif = p.estado === 'Por Verificar';
    let detalleMetodo = '';

    if (p.metodo === 'Efectivo (Bs)') {
      const bsVal = p.montoBs || Math.round(p.monto * (p.tasa || tasaActual));
      detalleMetodo = `
        <span class="inline-flex items-center gap-1 font-semibold text-[#1c4d37] dark:text-emerald-400">Efectivo (Bs)</span>
        <p class="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">Bs. ${new Intl.NumberFormat('es-VE').format(bsVal)}</p>
        <p class="text-[11px] text-gray-400 dark:text-gray-500">Tasa BCV: Bs. ${(p.tasa || tasaActual).toFixed(2)}</p>`;
    } else if (p.metodo === 'Efectivo ($)') {
      detalleMetodo = `
        <span class="inline-flex items-center gap-1 font-semibold text-[#1c4d37] dark:text-emerald-400">Efectivo ($)</span>
        <p class="text-[11px] text-gray-400 dark:text-gray-500">Billetes en mano (sin referencia)</p>`;
    } else {
      const bsVal = p.montoBs || (p.monto * (p.tasa || tasaActual));
      detalleMetodo = `
        <span class="font-semibold text-gray-800 dark:text-gray-200">${escHtml(p.metodo)}</span>
        ${p.banco ? `<p class="text-xs text-[#1c4d37] dark:text-emerald-400 font-medium">${escHtml(p.banco)}</p>` : ''}
        <p class="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">${fmtBs(bsVal)}</p>
        <p class="text-xs font-mono text-gray-500 dark:text-gray-400">Ref: ${escHtml(p.referencia || 'Sin referencia')} · Tasa: Bs. ${(p.tasa || tasaActual).toFixed(2)}</p>`;
    }

    return `
    <tr class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
      <td class="py-3.5 px-4 font-mono text-xs">${fmtFecha(p.fecha)}</td>
      <td class="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">${escHtml(p.cliente)}</td>
      <td class="py-3.5 px-4 font-mono font-medium text-[#1c4d37] dark:text-emerald-400">${p.ventaId}</td>
      <td class="py-3.5 px-4">${detalleMetodo}</td>
      <td class="py-3.5 px-4 text-right font-bold ${inactivo ? 'text-gray-400 line-through' : pendienteVerif ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">
        <p>+${fmt2(p.monto)}</p>
        <p class="text-[11px] font-normal text-gray-400 dark:text-gray-500">${fmtBs(p.montoBs || (p.monto * (p.tasa || tasaActual)))}</p>
      </td>
      <td class="py-3.5 px-4 text-center">${badgeEstadoPago(p.estado)}</td>
    </tr>`;
  }).join('')
    : `<tr><td colspan="6" class="text-center py-8 text-gray-400 dark:text-gray-500">No se encontraron pagos para ${escHtml(obtenerRutaActivaVentas())}.</td></tr>`;

  const verificados = pagosRuta.filter(p => p.estado === 'Completado' || p.estado === 'Verificado');
  const hoyUsd = verificados.filter(p => p.fecha === hoyISO).reduce((t, p) => t + p.monto, 0);
  const hoyBs = verificados.filter(p => p.fecha === hoyISO).reduce((t, p) => t + (p.montoBs || (p.monto * (p.tasa || tasaActual))), 0);
  const totalCobradoUsd = verificados.reduce((t, p) => t + p.monto, 0);
  const totalCobradoBs = verificados.reduce((t, p) => t + (p.montoBs || (p.monto * (p.tasa || tasaActual))), 0);
  const porCobrarUsd = ventasRuta.filter(v => v.estado === 'Pendiente').reduce((t, v) => t + saldoDe(v), 0);
  const porCobrarBs = porCobrarUsd * tasaActual;

  const set = (i, v) => { const el = document.getElementById(i); if (el) el.textContent = v; };
  set('cajaHoy', fmt2(hoyUsd));
  set('cajaHoyBs', fmtBs(hoyBs));
  set('cajaTotal', fmt2(totalCobradoUsd));
  set('cajaTotalBs', fmtBs(totalCobradoBs));
  set('cajaPorCobrar', fmt2(porCobrarUsd));
  set('cajaPorCobrarBs', fmtBs(porCobrarBs));
  if (window.lucide) lucide.createIcons();
}

function cambiarMetodoCobro() {
  const { venta, metodo, maxMonto } = obtenerLimitesCobroActual();
  const wrapBanco = document.getElementById('wrapperCobroBanco');
  const wrapRef = document.getElementById('wrapperCobroReferencia');
  const wrapEquiv = document.getElementById('wrapperCobroEquivalente');
  const lblMonto = document.getElementById('cobroMontoLabel');
  const inpMonto = document.getElementById('cobroMonto');
  const nota = document.getElementById('cobroMetodoNota');
  const inpRef = document.getElementById('cobroReferencia');
  const avisoRef = document.getElementById('cobroRefAviso');

  const esEfectivo = metodo === 'Efectivo ($)' || metodo === 'Efectivo (Bs)';
  if (wrapBanco) wrapBanco.classList.toggle('hidden', esEfectivo);
  if (wrapRef) wrapRef.classList.toggle('hidden', esEfectivo);
  mostrarAvisoMontoCobro('');
  if (avisoRef) { avisoRef.textContent = ''; avisoRef.classList.add('hidden'); }

  if (metodo === 'Efectivo (Bs)') {
    if (lblMonto) lblMonto.textContent = 'Monto en Efectivo (Bs)';
    if (inpMonto) {
      inpMonto.inputMode = 'numeric';
      inpMonto.placeholder = venta ? `Máx: ${maxMonto} Bs (solo enteros)` : 'Selecciona un pedido';
      inpMonto.value = (venta && maxMonto > 0) ? String(maxMonto) : '';
    }
    if (wrapEquiv) wrapEquiv.classList.remove('hidden');
    if (inpRef) { inpRef.value = ''; inpRef.required = false; }
    if (nota) nota.textContent = 'Pago en Efectivo (Bs): solo números enteros hasta el límite de la factura. Abajo se refleja el equivalente en $ BCV.';
  } else if (metodo === 'Efectivo ($)') {
    if (lblMonto) lblMonto.textContent = 'Monto en Efectivo ($ USD)';
    if (inpMonto) {
      inpMonto.inputMode = 'numeric';
      inpMonto.placeholder = venta ? `Máx: $${maxMonto} (solo enteros)` : 'Selecciona un pedido';
      inpMonto.value = (venta && maxMonto > 0) ? String(maxMonto) : '';
    }
    if (wrapEquiv) wrapEquiv.classList.add('hidden');
    if (inpRef) { inpRef.value = ''; inpRef.required = false; }
    if (nota) nota.textContent = 'Pago en Efectivo ($ USD): solo números enteros hasta el límite de la factura, sin referencia ni banco.';
  } else {
    // Transferencia o Pago Móvil (en Bolívares con referencia en $ BCV abajo)
    if (lblMonto) lblMonto.textContent = `Monto en ${metodo} (Bs)`;
    if (inpMonto) {
      inpMonto.inputMode = 'decimal';
      inpMonto.placeholder = venta ? `Máx: ${fmtBs(maxMonto)}` : 'Selecciona un pedido';
      inpMonto.value = (venta && maxMonto > 0) ? (Number.isInteger(maxMonto) ? String(maxMonto) : maxMonto.toFixed(2)) : '';
    }
    if (wrapEquiv) wrapEquiv.classList.remove('hidden');
    if (inpRef) inpRef.required = true;
    if (nota) nota.textContent = `Pago por ${metodo} (en Bs): selecciona el banco emisor, ingresa la referencia (6 a 8 dígitos) y el monto en Bs. Abajo se refleja el equivalente en $ BCV.`;
  }

  actualizarBadgeMaximoCobro();
  calcularEquivalenteCobro();
}

function abrirCobro() {
  const clientes = [...new Set(ventasDeRutaActiva().filter(v => v.estado === 'Pendiente' && saldoPorRegistrarDe(v) > 0).map(v => v.cliente))];
  const sel = document.getElementById('cobroCliente');
  sel.innerHTML = '<option value="" disabled selected>Seleccionar cliente con saldo pendiente</option>' + clientes.map(c => `<option>${escHtml(c)}</option>`).join('');
  const selVenta = document.getElementById('cobroVenta');
  selVenta.innerHTML = '<option value="" disabled selected>Seleccionar pedido</option>';
  selVenta.disabled = true;

  const inpMonto = document.getElementById('cobroMonto');
  if (inpMonto) {
    inpMonto.value = '';
    inpMonto.disabled = true;
  }
  const inpRef = document.getElementById('cobroReferencia');
  if (inpRef) inpRef.value = '';
  const selBanco = document.getElementById('cobroBanco');
  if (selBanco) selBanco.value = '0102-Banco de Venezuela';
  const inpFecha = document.getElementById('cobroFecha');
  if (inpFecha) {
    inpFecha.value = hoyISO;
    inpFecha.max = hoyISO;
    inpFecha.removeAttribute('min');
  }
  const selMetodo = document.getElementById('cobroMetodo');
  if (selMetodo) selMetodo.value = 'Efectivo ($)';
  cambiarMetodoCobro();
  document.getElementById('cobroInfo').textContent = clientes.length ? 'Selecciona un cliente para ver sus pedidos pendientes.' : 'No hay pedidos pendientes por registrar pago (o sus pagos ya están en verificación en Cobranzas).';
  if (document.getElementById('cobroInfoBs')) document.getElementById('cobroInfoBs').textContent = '';
  if (document.getElementById('cobroMontoBsSub')) document.getElementById('cobroMontoBsSub').textContent = '';
  openModal('modalCobro');
}

function cargarPedidosCobro() {
  const cliente = document.getElementById('cobroCliente').value;
  const sel = document.getElementById('cobroVenta');
  const tasa = obtenerTasaBCV();
  const pend = ventasDeRutaActiva().filter(v => v.cliente === cliente && v.estado === 'Pendiente' && saldoPorRegistrarDe(v) > 0);
  sel.innerHTML = '<option value="" disabled selected>Seleccionar pedido</option>' + pend.map(v => {
    const disp = saldoPorRegistrarDe(v);
    return `<option value="${v.id}">${v.id} · Por registrar ${fmt2(disp)} (${fmtBs(disp * tasa)})</option>`;
  }).join('');
  sel.disabled = false;
  const inpMonto = document.getElementById('cobroMonto');
  if (inpMonto) {
    inpMonto.value = '';
    inpMonto.disabled = true;
  }
  mostrarAvisoMontoCobro('');
  actualizarBadgeMaximoCobro();
  calcularEquivalenteCobro();
  document.getElementById('cobroInfo').textContent = 'Selecciona el pedido a cobrar.';
  if (document.getElementById('cobroInfoBs')) document.getElementById('cobroInfoBs').textContent = '';
}

function actualizarSaldoCobro() {
  const { venta, disponibleUsd, metodo, maxMonto } = obtenerLimitesCobroActual();
  if (!venta) return;
  const enVerif = enVerificacionDe(venta);
  const tasa = obtenerTasaBCV();
  const monto = document.getElementById('cobroMonto');
  monto.disabled = false;

  if (metodo === 'Efectivo (Bs)') {
    monto.value = maxMonto > 0 ? String(maxMonto) : '';
    monto.placeholder = `Máx: ${maxMonto} Bs (solo enteros)`;
    mostrarAvisoMontoCobro('');
  } else if (metodo === 'Efectivo ($)') {
    monto.value = maxMonto > 0 ? String(maxMonto) : '';
    monto.placeholder = `Máx: $${maxMonto} (solo enteros)`;
    if (maxMonto === 0 && disponibleUsd > 0) {
      mostrarAvisoMontoCobro(`El saldo restante (${fmt2(disponibleUsd)}) es menor a $1 USD; usa Efectivo (Bs), Pago Móvil o Transferencia.`);
    } else {
      mostrarAvisoMontoCobro('');
    }
  } else {
    monto.value = maxMonto > 0 ? (Number.isInteger(maxMonto) ? String(maxMonto) : maxMonto.toFixed(2)) : '';
    monto.placeholder = `Máx: ${fmtBs(maxMonto)}`;
    mostrarAvisoMontoCobro('');
  }

  // Permitir elegir libremente cualquier día anterior al de hoy (sin limitación de fecha mínima)
  const inpFecha = document.getElementById('cobroFecha');
  if (inpFecha) {
    inpFecha.removeAttribute('min');
    inpFecha.max = hoyISO;
  }

  const pagado = pagadoDe(venta);
  document.getElementById('cobroInfo').textContent = `Total ${fmt2(venta.total)} · Verificado ${fmt2(pagado)}${enVerif > 0 ? ` · En verificación ${fmt2(enVerif)}` : ''} · Máximo a cobrar ${fmt2(disponibleUsd)}`;
  if (document.getElementById('cobroInfoBs')) {
    document.getElementById('cobroInfoBs').textContent = `Total en Bs: ${fmtBs(venta.total * tasa)} · Verificado: ${fmtBs(pagado * tasa)} · Máximo a cobrar en Bs: ${fmtBs(disponibleUsd * tasa)}`;
  }
  actualizarBadgeMaximoCobro();
  calcularEquivalenteCobro();
}

function guardarCobro(e) {
  e.preventDefault();
  const { venta: v, disponibleUsd: disponible, tasa, metodo, maxMonto } = obtenerLimitesCobroActual();
  if (!v) { toast('Selecciona primero el cliente y el pedido a cobrar.'); return; }
  if (disponible <= 0) { toast('Este pedido ya no posee saldo pendiente por registrar.'); return; }

  const fechaCobro = (document.getElementById('cobroFecha') && document.getElementById('cobroFecha').value) || '';
  if (!fechaCobro) {
    toast('Selecciona la fecha del pago.');
    return;
  }
  if (fechaCobro > hoyISO) {
    toast('La fecha del pago no puede ser posterior a la fecha actual.');
    return;
  }

  let montoUsd = 0;
  let montoBs = 0;
  let referencia = '';
  let banco = '';

  if (metodo === 'Efectivo (Bs)') {
    const rawBs = (document.getElementById('cobroMonto') && document.getElementById('cobroMonto').value.trim()) || '';
    if (!/^\d+$/.test(rawBs) || parseInt(rawBs, 10) <= 0) {
      toast('Para efectivo en Bs debes ingresar un monto entero mayor a 0.');
      const inp = document.getElementById('cobroMonto');
      if (inp) inp.focus();
      return;
    }
    montoBs = parseInt(rawBs, 10);
    if (montoBs > maxMonto) {
      toast(`El monto en Bs no puede superar el máximo de la factura (Bs. ${new Intl.NumberFormat('es-VE').format(maxMonto)}).`);
      rellenarMaximoCobro();
      return;
    }
    // Si paga el máximo exacto en Bs, cerramos el saldo exacto en USD sin dejar centavos residuales
    montoUsd = (montoBs === maxMonto)
      ? disponible
      : Math.min(disponible, Math.round((montoBs / tasa) * 100) / 100);
  } else if (metodo === 'Efectivo ($)') {
    const rawUsd = (document.getElementById('cobroMonto') && document.getElementById('cobroMonto').value.trim()) || '';
    if (!/^\d+$/.test(rawUsd) || parseInt(rawUsd, 10) <= 0) {
      toast('Para efectivo en $ debes ingresar un monto entero mayor a 0 (sin decimales).');
      const inp = document.getElementById('cobroMonto');
      if (inp) inp.focus();
      return;
    }
    montoUsd = parseInt(rawUsd, 10);
    if (montoUsd > maxMonto) {
      toast(`El monto en efectivo ($${montoUsd}) no puede superar el máximo de la factura ($${maxMonto}).`);
      rellenarMaximoCobro();
      return;
    }
  } else {
    // Transferencia o Pago Móvil (en Bolívares)
    banco = (document.getElementById('cobroBanco') && document.getElementById('cobroBanco').value) || '';
    referencia = (document.getElementById('cobroReferencia') && document.getElementById('cobroReferencia').value.trim()) || '';

    if (!/^\d{6,8}$/.test(referencia)) {
      toast('El número de referencia debe contener exclusivamente números (sin letras) y tener entre 6 y 8 dígitos.');
      const inp = document.getElementById('cobroReferencia');
      if (inp) inp.focus();
      return;
    }

    const pagoDuplicado = buscarPagoConReferenciaDuplicada(referencia);
    if (pagoDuplicado) {
      toast(`El número de referencia #${referencia} ya fue utilizado en el cobro ${pagoDuplicado.id} (${pagoDuplicado.cliente}). Verifica el comprobante.`);
      const inp = document.getElementById('cobroReferencia');
      if (inp) inp.focus();
      return;
    }

    const rawMontoBs = (document.getElementById('cobroMonto') && document.getElementById('cobroMonto').value.trim()) || '';
    montoBs = parseFloat(rawMontoBs);
    if (!(montoBs > 0) || montoBs > maxMonto + 0.01) {
      toast(`El monto en Bs debe ser mayor que 0 y no puede superar el máximo de la factura (${fmtBs(maxMonto)}).`);
      rellenarMaximoCobro();
      return;
    }
    montoBs = Math.round(montoBs * 100) / 100;
    montoUsd = (Math.abs(montoBs - maxMonto) < 0.01)
      ? disponible
      : Math.min(disponible, Math.round((montoBs / tasa) * 100) / 100);
  }

  const montoBsMostrar = esMetodoEnBs(metodo)
    ? montoBs
    : Math.round(montoUsd * tasa * 100) / 100;

  const detalleCobroHtml = `
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Cliente:</span><span class="font-semibold text-gray-800 dark:text-gray-100">${escHtml(v.cliente)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Pedido:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${escHtml(v.id)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Fecha del pago:</span><span class="font-medium text-gray-700 dark:text-gray-200">${fmtFecha(fechaCobro)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Método:</span><span class="font-medium text-gray-700 dark:text-gray-200">${escHtml(metodo)}</span></div>
    ${banco ? `<div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Banco:</span><span class="font-medium text-gray-700 dark:text-gray-200">${escHtml(banco)}</span></div>` : ''}
    ${referencia ? `<div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Referencia:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${escHtml(referencia)}</span></div>` : ''}
    <div class="flex justify-between items-baseline border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
      <span class="text-gray-500 dark:text-gray-400 font-semibold">Monto a Registrar:</span>
      <div class="text-right">
        <p class="font-bold text-lg text-[#1c4d37] dark:text-emerald-400">${esMetodoEnBs(metodo) ? fmtBs(montoBsMostrar) : fmt2(montoUsd)}</p>
        <p class="text-xs font-semibold text-emerald-700 dark:text-emerald-300">${esMetodoEnBs(metodo) ? `Equiv. BCV: ${fmt2(montoUsd)} USD` : fmtBs(montoBsMostrar)}</p>
      </div>
    </div>
  `;

  confirmarAccionSistema({
    titulo: 'Confirmar Registro de Cobro',
    mensaje: 'El cobro quedará registrado y será enviado a Cobranzas (Facturación) para su verificación.',
    icono: 'wallet',
    textoConfirmar: 'Confirmar Cobro',
    detalleHtml: detalleCobroHtml,
    onConfirm: () => {
      pagosData.unshift({
        id: siguienteId('P', pagosData),
        ventaId: v.id,
        cliente: v.cliente,
        fecha: fechaCobro,
        metodo: metodo,
        banco: banco,
        monto: montoUsd,
        montoBs: montoBs,
        tasa: tasa,
        referencia: referencia,
        estado: 'Por Verificar'
      });
      guardarDatos();
      closeModal('modalCobro');
      renderPagos();
      const detalleNotif = esMetodoEnBs(metodo)
        ? `Cobro por ${metodo} (${fmtBs(montoBs)} ≈ $${montoUsd.toFixed(2)} USD)`
        : `Cobro (${metodo} · ${fmt2(montoUsd)})`;
      toast(`${detalleNotif} registrado y enviado a Cobranzas (Facturación) para su verificación.`);
    }
  });
}

// --- LÓGICA DE CLIENTES (`clientes.php`) ---
const FORMATOS_RIF = {
  V: {
    boton: 'V · Venezolano',
    min: 7,
    max: 8,
    placeholder: '12345678 (7 u 8 dígitos sin guiones)',
    ejemplo: 'V12345678',
    ayuda: 'Cédula / RIF de Persona Natural (Venezolana): 7 u 8 dígitos corridos sin guiones (Ej: V12345678 o V1234567).'
  },
  E: {
    boton: 'E · Extranjero',
    min: 7,
    max: 9,
    placeholder: '12345678 (todo junto, sin guiones)',
    ejemplo: 'E12345678',
    ayuda: 'RIF de Persona Natural (Extranjera con cédula): Todo junto sin guiones (Ej: E12345678).'
  },
  J: {
    boton: 'J · Jurídico',
    min: 9,
    max: 9,
    placeholder: '312345678 (9 dígitos sin guiones)',
    ejemplo: 'J312345678',
    ayuda: 'RIF Jurídico (Empresas, Compañías Anónimas, etc.): Letra J seguida de los 9 dígitos totales sin guiones (Ej: J312345678).'
  },
  G: {
    boton: 'G · Gubernamental',
    min: 9,
    max: 9,
    placeholder: '200012345 (9 dígitos sin guiones)',
    ejemplo: 'G200012345',
    ayuda: 'RIF Gubernamental (Organismos del Estado): Letra G seguida de los 9 dígitos correlativos sin interrupciones (Ej: G200012345).'
  },
  P: {
    boton: 'P · Pasaporte',
    min: 7,
    max: 9,
    placeholder: '123456780 (sin espacios ni guiones)',
    ejemplo: 'P123456780',
    ayuda: 'RIF de No Residente / Pasaporte (P): Letra P seguida del número identificador sin espacios ni guiones (Ej: P123456780).'
  }
};

function toggleMenuRifTipo() {
  const menu = document.getElementById('menuRifTipoDropdown');
  if (!menu) return;
  menu.classList.toggle('hidden');
}

function seleccionarTipoRif(tipo) {
  const cfg = FORMATOS_RIF[tipo] || FORMATOS_RIF.J;
  const inputTipo = document.getElementById('cliRifTipo');
  const lbl = document.getElementById('lblRifTipoActual');
  const numInput = document.getElementById('cliRifNumero');
  const ayuda = document.getElementById('cliRifAyuda');
  const menu = document.getElementById('menuRifTipoDropdown');

  if (inputTipo) inputTipo.value = tipo;
  if (lbl) lbl.textContent = cfg.boton;
  if (menu) menu.classList.add('hidden');

  if (numInput) {
    numInput.maxLength = cfg.max;
    numInput.placeholder = cfg.placeholder;
    const soloDigitos = numInput.value.replace(/\D+/g, '').slice(0, cfg.max);
    numInput.value = soloDigitos;
  }
  if (ayuda) ayuda.textContent = cfg.ayuda;
  actualizarPreviewRif();
}

function actualizarPreviewRif() {
  const preview = document.getElementById('cliRifPreview');
  const inputTipo = document.getElementById('cliRifTipo');
  const numInput = document.getElementById('cliRifNumero');
  if (!preview || !inputTipo || !numInput) return;

  const tipo = inputTipo.value || 'J';
  const cfg = FORMATOS_RIF[tipo] || FORMATOS_RIF.J;
  const digitos = numInput.value.replace(/\D+/g, '');
  preview.textContent = digitos ? `Formato: ${tipo}${digitos}` : `Ejemplo: ${cfg.ejemplo}`;
}

function bloquearTeclasRifNumero(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const permitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];
  if (permitidas.includes(e.key)) return;
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
}

function validarInputRifNumero(input) {
  if (!input) return;
  const tipo = (document.getElementById('cliRifTipo') && document.getElementById('cliRifTipo').value) || 'J';
  const cfg = FORMATOS_RIF[tipo] || FORMATOS_RIF.J;
  const limpio = input.value.replace(/\D+/g, '').slice(0, cfg.max);
  if (input.value !== limpio) input.value = limpio;
  actualizarPreviewRif();
}

function pegarRifNumero(e, input) {
  e.preventDefault();
  const texto = (e.clipboardData || window.clipboardData).getData('text') || '';
  // Si pegan algo como "J-31234567-8" o "V12345678", detecta la letra si viene incluida
  const mLetra = texto.trim().toUpperCase().match(/^([VEJGP])/);
  if (mLetra) seleccionarTipoRif(mLetra[1]);
  const tipo = (document.getElementById('cliRifTipo') && document.getElementById('cliRifTipo').value) || 'J';
  const cfg = FORMATOS_RIF[tipo] || FORMATOS_RIF.J;
  input.value = texto.replace(/\D+/g, '').slice(0, cfg.max);
  actualizarPreviewRif();
}

// Validación estricta del teléfono: solo dígitos y guion en formato 123-4567 o 1234567
function bloquearTeclasTelefono(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const permitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];
  if (permitidas.includes(e.key)) return;
  if (e.key === '-') {
    const digitos = (e.target.value || '').replace(/\D+/g, '');
    const yaTieneGuion = (e.target.value || '').includes('-');
    // El guion solo se permite si ya se escribieron exactamente 3 dígitos numéricos y no hay otro guion (ejemplo: 123-)
    if (yaTieneGuion || digitos.length !== 3) {
      e.preventDefault();
    }
    return;
  }
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
}

function validarInputTelefono(input) {
  if (!input) return;
  let val = input.value;
  if (val.includes('-')) {
    const partes = val.split('-');
    const antes = partes[0].replace(/\D+/g, '').slice(0, 3);
    const despues = partes.slice(1).join('').replace(/\D+/g, '').slice(0, 4);
    if (antes.length === 3) {
      input.value = antes + '-' + despues;
    } else {
      input.value = antes + despues;
    }
  } else {
    input.value = val.replace(/\D+/g, '').slice(0, 7);
  }
}

function pegarTelefono(e, input) {
  e.preventDefault();
  const texto = (e.clipboardData || window.clipboardData).getData('text') || '';
  input.value = texto;
  validarInputTelefono(input);
}

document.addEventListener('click', e => {
  const wrapper = document.getElementById('rifDropdownWrapper');
  const menu = document.getElementById('menuRifTipoDropdown');
  if (wrapper && menu && !wrapper.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

function comprasDeCliente(nombre) {
  return ventasData.filter(v => v.cliente === nombre && v.estado !== 'Cancelada').reduce((t, v) => t + v.total, 0);
}
function saldoDeCliente(nombre) {
  return ventasData.filter(v => v.cliente === nombre && v.estado === 'Pendiente').reduce((t, v) => t + saldoDe(v), 0);
}

let ordenClientes = { campo: 'nombre', dir: 'asc' };

function ordenarClientesPor(campo) {
  if (ordenClientes.campo === campo) {
    ordenClientes.dir = ordenClientes.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenClientes.campo = campo;
    ordenClientes.dir = (campo === 'compras' || campo === 'saldo') ? 'desc' : 'asc';
  }
  renderClientes();
}

function renderClientes() {
  const tbody = document.getElementById('tablaClientes');
  if (!tbody) return;
  const q = document.getElementById('busquedaClientes').value.toLowerCase();
  const rutaActual = obtenerRutaActivaVentas();
  const clientesRuta = clientesDeRutaActiva();
  const filtrada = clientesRuta.filter(c => (c.nombre + ' ' + c.rif + ' ' + c.contacto + ' ' + c.email + ' ' + c.zona + ' ' + (c.ruta || '')).toLowerCase().includes(q));
  const mult = ordenClientes.dir === 'asc' ? 1 : -1;
  const lista = [...filtrada].sort((a, b) => {
    switch (ordenClientes.campo) {
      case 'nombre':
        return String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es') * mult;
      case 'contacto':
        return String(a.contacto || '').localeCompare(String(b.contacto || ''), 'es') * mult;
      case 'telefono':
        return String(a.telefono || '').localeCompare(String(b.telefono || '')) * mult;
      case 'compras':
        return (comprasDeCliente(a.nombre) - comprasDeCliente(b.nombre)) * mult;
      case 'saldo':
        return (saldoDeCliente(a.nombre) - saldoDeCliente(b.nombre)) * mult;
      default:
        return 0;
    }
  });
  ['nombre', 'contacto', 'telefono', 'compras', 'saldo'].forEach(c => {
    const icon = document.getElementById(`sortIconCli-${c}`);
    if (!icon) return;
    if (ordenClientes.campo === c) {
      icon.setAttribute('data-lucide', ordenClientes.dir === 'asc' ? 'arrow-up' : 'arrow-down');
      icon.classList.remove('opacity-60');
      icon.classList.add('opacity-100');
    } else {
      icon.setAttribute('data-lucide', 'arrow-up-down');
      icon.classList.add('opacity-60');
      icon.classList.remove('opacity-100');
    }
  });
  const tasa = obtenerTasaBCV();
  tbody.innerHTML = lista.length ? lista.map(c => {
    const compras = comprasDeCliente(c.nombre);
    const saldo = saldoDeCliente(c.nombre);
    const realIdx = CLIENTES.indexOf(c);
    const inactivo = c.activo === false;
    const badgeEstadoCli = inactivo
      ? '<span class="ml-1.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Desactivado</span>'
      : '';
    const btnEstado = inactivo
      ? `<button type="button" onclick="event.stopPropagation(); abrirModalDesbloquearCliente(${realIdx})" class="text-amber-600 hover:text-[#1c4d37] dark:text-amber-400 dark:hover:text-emerald-400 p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors" title="Desbloquear / Reactivar Cliente">
          <i data-lucide="unlock" class="w-4 h-4"></i>
        </button>`
      : `<button type="button" onclick="event.stopPropagation(); desactivarCliente(${realIdx})" class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Desactivar Cliente (Bloquear Ventas)">
          <i data-lucide="lock" class="w-4 h-4"></i>
        </button>`;
    return `<tr onclick="verCuentaCliente(${realIdx})" class="${inactivo ? 'bg-red-50/20 dark:bg-red-950/10' : ''} hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
      <td class="py-3.5 px-4"><p class="font-semibold ${inactivo ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}">${escHtml(c.nombre)}${badgeEstadoCli}</p><p class="text-xs text-gray-400 dark:text-gray-500"><span class="font-mono font-semibold text-[#1c4d37] dark:text-emerald-400">${escHtml(c.rif)}</span> · ${escHtml(c.zona)} · <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#1c4d37] dark:bg-emerald-900/30 dark:text-emerald-300">${escHtml(c.ruta || rutaActual)}</span></p></td>
      <td class="py-3.5 px-4">${escHtml(c.contacto || '—')}<p class="text-xs text-gray-400 dark:text-gray-500">${escHtml(c.email || '')}</p></td>
      <td class="py-3.5 px-4 font-mono text-xs">${escHtml(c.telefono || '—')}</td>
      <td class="py-3.5 px-4 font-medium"><p>${fmt2(compras)}</p><p class="text-[11px] text-gray-400 dark:text-gray-500">${fmtBs(compras * tasa)}</p></td>
      <td class="py-3.5 px-4 font-bold ${saldo > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}"><p>${fmt2(saldo)}</p><p class="text-[11px] font-normal text-gray-400 dark:text-gray-500">${fmtBs(saldo * tasa)}</p></td>
      <td class="py-3.5 px-4 text-center">
        <div class="inline-flex items-center justify-center gap-1">
          <button type="button" onclick="event.stopPropagation(); abrirEditarCliente(${realIdx})" class="text-gray-400 hover:text-[#1c4d37] dark:hover:text-emerald-400 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Editar Perfil del Cliente">
            <i data-lucide="pencil" class="w-4 h-4"></i>
          </button>
          <button type="button" onclick="event.stopPropagation(); verCuentaCliente(${realIdx})" class="text-gray-400 hover:text-[#1c4d37] dark:hover:text-emerald-400 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Ver Cuenta">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
          ${btnEstado}
        </div>
      </td>
    </tr>`;
  }).join('') : `<tr><td colspan="6" class="text-center py-8 text-gray-400 dark:text-gray-500">No se encontraron clientes asignados a ${escHtml(rutaActual)}.</td></tr>`;
  if (window.lucide) lucide.createIcons();
}

function abrirModalCliente() {
  const form = document.getElementById('formCliente');
  if (form) form.reset();
  if (document.getElementById('cliEditIndex')) document.getElementById('cliEditIndex').value = '-1';
  const titulo = document.getElementById('modalClienteTitulo');
  if (titulo) {
    titulo.innerHTML = '<i data-lucide="user-plus" class="w-5 h-5"></i> Registrar Nuevo Cliente';
  }
  const btn = document.getElementById('btnGuardarCliente');
  if (btn) btn.textContent = 'Guardar Cliente';
  if (document.getElementById('cliZona')) document.getElementById('cliZona').value = 'Mariño';
  const rutaActiva = obtenerRutaActivaVentas();
  const selRuta = document.getElementById('cliRuta');
  if (selRuta) {
    selRuta.value = rutaActiva;
    selRuta.disabled = estaBloqueadoARutaVendedor();
  }
  if (document.getElementById('cliTelCodigo')) document.getElementById('cliTelCodigo').value = '0412';
  if (document.getElementById('cliTelNumero')) document.getElementById('cliTelNumero').value = '';
  seleccionarTipoRif('J');
  openModal('modalCliente');
  if (window.lucide) lucide.createIcons();
}

function abrirEditarCliente(idx) {
  const c = CLIENTES[idx];
  if (!c) return;

  if (document.getElementById('cliEditIndex')) document.getElementById('cliEditIndex').value = String(idx);
  const titulo = document.getElementById('modalClienteTitulo');
  if (titulo) {
    titulo.innerHTML = '<i data-lucide="user-pen" class="w-5 h-5"></i> Editar Perfil del Cliente';
  }
  const btn = document.getElementById('btnGuardarCliente');
  if (btn) btn.textContent = 'Guardar Cambios';

  document.getElementById('cliNombre').value = c.nombre || '';
  document.getElementById('cliContacto').value = c.contacto || '';
  document.getElementById('cliEmail').value = c.email || '';
  document.getElementById('cliDireccion').value = c.direccion || '';

  const selRuta = document.getElementById('cliRuta');
  if (selRuta) {
    selRuta.value = normalizarRutaVenta(c.ruta || obtenerRutaActivaVentas());
    selRuta.disabled = estaBloqueadoARutaVendedor();
  }

  // Cargar Zona limpia (Municipio de Nueva Esparta)
  const selZona = document.getElementById('cliZona');
  if (selZona) {
    const zonaNorm = limpiarZonaMunicipio(c.zona);
    const existeOpcion = Array.from(selZona.options || []).some(o => o.value === zonaNorm);
    if (!existeOpcion && zonaNorm) {
      selZona.insertAdjacentHTML('beforeend', `<option value="${escHtml(zonaNorm)}">${escHtml(zonaNorm)}</option>`);
    }
    selZona.value = zonaNorm;
  }

  // Separar letra (V, E, J, G, P) y dígitos del RIF
  const rifNorm = normalizarRifSinGuiones(c.rif);
  const mRif = rifNorm.match(/^([VEJGP])(\d+)$/);
  const letraRif = mRif ? mRif[1] : 'J';
  const digitosRif = mRif ? mRif[2] : rifNorm.replace(/\D+/g, '');
  seleccionarTipoRif(letraRif);
  document.getElementById('cliRifNumero').value = digitosRif;
  actualizarPreviewRif();

  // Separar código de operador (0412, 0422, 0416, 0426, 0414, 0424) y número de teléfono
  const telNorm = normalizarTelefonoConCodigo(c.telefono);
  const selCod = document.getElementById('cliTelCodigo');
  const inpNum = document.getElementById('cliTelNumero');
  const mTel = telNorm.match(/^(0\d{3})-(.+)$/);
  if (mTel && selCod && inpNum) {
    const cod = mTel[1];
    const existeOpcion = Array.from(selCod.options || []).some(o => o.value === cod);
    selCod.value = existeOpcion ? cod : '0412';
    inpNum.value = mTel[2];
  } else if (inpNum) {
    const soloDig = telNorm.replace(/\D+/g, '');
    if (soloDig.length >= 10 && selCod) {
      const cod = soloDig.startsWith('0') ? soloDig.slice(0, 4) : '0' + soloDig.slice(0, 3);
      const existeOpcion = Array.from(selCod.options || []).some(o => o.value === cod);
      selCod.value = existeOpcion ? cod : '0412';
      inpNum.value = soloDig.slice(-7);
    } else {
      inpNum.value = telNorm.replace(/[^0-9-]/g, '').slice(0, 8);
    }
  }

  openModal('modalCliente');
  if (window.lucide) lucide.createIcons();
}

function cerrarModalCliente() {
  const menu = document.getElementById('menuRifTipoDropdown');
  if (menu) menu.classList.add('hidden');
  closeModal('modalCliente');
}

function registrarCliente(e) {
  e.preventDefault();
  const editIdx = parseInt((document.getElementById('cliEditIndex') && document.getElementById('cliEditIndex').value) || '-1', 10);
  const nombre = document.getElementById('cliNombre').value.trim();
  const tipoRif = ((document.getElementById('cliRifTipo') && document.getElementById('cliRifTipo').value) || 'J').toUpperCase();
  const cfgRif = FORMATOS_RIF[tipoRif] || FORMATOS_RIF.J;
  const digitosRif = (document.getElementById('cliRifNumero').value || '').replace(/\D+/g, '');

  if (digitosRif.length < cfgRif.min || digitosRif.length > cfgRif.max) {
    const rangoTxt = cfgRif.min === cfgRif.max ? `${cfgRif.min} dígitos` : `entre ${cfgRif.min} y ${cfgRif.max} dígitos`;
    toast(`El formato ${tipoRif} requiere ${rangoTxt} corridos sin guiones (Ejemplo: ${cfgRif.ejemplo}).`);
    document.getElementById('cliRifNumero').focus();
    return;
  }

  const rif = `${tipoRif}${digitosRif}`;

  // Validar duplicados (excluyendo el propio cliente si se está editando)
  const clienteDuplicado = CLIENTES.find((c, idx) =>
    idx !== editIdx && (c.nombre.toLowerCase() === nombre.toLowerCase() || normalizarRifSinGuiones(c.rif) === rif)
  );
  if (clienteDuplicado) {
    toast(`Ya existe otro cliente registrado con ese nombre o RIF (asignado a ${clienteDuplicado.ruta || 'otra ruta'}).`);
    return;
  }

  // Validar y ensamblar teléfono (código + número de 7 dígitos)
  const codArea = (document.getElementById('cliTelCodigo') && document.getElementById('cliTelCodigo').value) || '0412';
  const numTelRaw = (document.getElementById('cliTelNumero') && document.getElementById('cliTelNumero').value.trim()) || '';
  if (numTelRaw) {
    const patronSinGuion = /^\d{7}$/;
    const patronConGuion = /^\d{3}-\d{4}$/;
    if (!patronSinGuion.test(numTelRaw) && !patronConGuion.test(numTelRaw)) {
      toast('El número telefónico debe tener exactamente 7 dígitos: en formato directo 1234567 o con guion 123-4567 (3 dígitos antes del guion y 4 dígitos después).');
      document.getElementById('cliTelNumero').focus();
      return;
    }
  }
  const telefonoFinal = numTelRaw ? `${codArea}-${numTelRaw}` : '';

  const rutaAsignada = estaBloqueadoARutaVendedor()
    ? obtenerRutaActivaVentas()
    : normalizarRutaVenta((document.getElementById('cliRuta') && document.getElementById('cliRuta').value) || obtenerRutaActivaVentas());

  const esEdicion = editIdx >= 0 && Boolean(CLIENTES[editIdx]);
  const datosCliente = {
    nombre,
    rif,
    zona: document.getElementById('cliZona').value || 'Mariño',
    ruta: rutaAsignada,
    contacto: document.getElementById('cliContacto').value.trim(),
    telefono: telefonoFinal,
    email: document.getElementById('cliEmail').value.trim(),
    direccion: document.getElementById('cliDireccion').value.trim(),
    activo: esEdicion ? (CLIENTES[editIdx].activo !== false) : true
  };

  const formRef = e.target;
  const detalleClienteHtml = `
    <div class="flex justify-between gap-2"><span class="text-gray-500 dark:text-gray-400">Cliente / Empresa:</span><span class="font-semibold text-gray-800 dark:text-gray-100 text-right">${escHtml(datosCliente.nombre)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Cédula / RIF:</span><span class="font-mono font-bold text-[#1c4d37] dark:text-emerald-400">${escHtml(datosCliente.rif)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Ruta Comercial:</span><span class="font-bold text-[#1c4d37] dark:text-emerald-400">${escHtml(datosCliente.ruta)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Zona:</span><span class="font-medium text-gray-700 dark:text-gray-200">${escHtml(datosCliente.zona)}</span></div>
    ${datosCliente.contacto ? `<div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Contacto:</span><span class="font-medium text-gray-700 dark:text-gray-200">${escHtml(datosCliente.contacto)}</span></div>` : ''}
    ${datosCliente.telefono ? `<div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Teléfono:</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200">${escHtml(datosCliente.telefono)}</span></div>` : ''}
    ${datosCliente.email ? `<div class="flex justify-between gap-2"><span class="text-gray-500 dark:text-gray-400">Correo:</span><span class="font-medium text-gray-700 dark:text-gray-200 text-right truncate">${escHtml(datosCliente.email)}</span></div>` : ''}
  `;

  if (esEdicion) {
    confirmarAccionSistema({
      titulo: 'Confirmar Edición de Perfil',
      mensaje: '¿Deseas guardar los cambios realizados en el perfil de este cliente?',
      icono: 'user-check',
      textoConfirmar: 'Guardar Cambios',
      detalleHtml: detalleClienteHtml,
      onConfirm: () => {
        if (!CLIENTES[editIdx]) return;
        const nombreAnterior = CLIENTES[editIdx].nombre;
        CLIENTES[editIdx] = datosCliente;

        // Si cambió el nombre o RIF del cliente, sincronizar pedidos, pagos y facturas asociadas
        if (nombreAnterior !== nombre) {
          ventasData.forEach(v => { if (v.cliente === nombreAnterior) v.cliente = nombre; });
          pagosData.forEach(p => { if (p.cliente === nombreAnterior) p.cliente = nombre; });
          guardarDatos();
        }
        try {
          const facturas = JSON.parse(localStorage.getItem('gs_facturas_v1'));
          if (Array.isArray(facturas)) {
            facturas.forEach(f => {
              if (f.cliente === nombreAnterior || f.cliente === nombre) {
                f.cliente = nombre;
                f.rif = rif;
              }
            });
            localStorage.setItem('gs_facturas_v1', JSON.stringify(facturas));
          }
        } catch (err) { /* ignorar si no hay facturas */ }

        guardarClientes();
        cerrarModalCliente();
        renderClientes();
        toast(`Perfil del cliente "${nombre}" actualizado correctamente.`);
      }
    });
  } else {
    confirmarAccionSistema({
      titulo: 'Confirmar Registro de Cliente',
      mensaje: '¿Deseas registrar este nuevo cliente en el sistema?',
      icono: 'user-plus',
      textoConfirmar: 'Registrar Cliente',
      detalleHtml: detalleClienteHtml,
      onConfirm: () => {
        CLIENTES.unshift(datosCliente);
        guardarClientes();
        if (formRef && typeof formRef.reset === 'function') formRef.reset();
        cerrarModalCliente();
        renderClientes();
        toast(`Cliente "${nombre}" (${rif}) registrado.`);
      }
    });
  }
}

function verCuentaCliente(idx) {
  const c = CLIENTES[idx];
  const pedidos = ventasDeRutaActiva().filter(v => v.cliente === c.nombre);
  const filas = pedidos.length ? pedidos.map(v => `
    <div class="flex items-center justify-between text-sm py-2.5">
      <div><p class="font-semibold text-gray-800 dark:text-gray-100">${v.id} <span class="text-xs font-normal font-mono text-gray-400">· ${fmtFecha(v.fecha)}</span></p>
      <p class="text-xs text-gray-500 dark:text-gray-400">Total ${fmt2(v.total)} (${fmtBs(montoBsDeVenta(v))}) · Saldo ${v.estado === 'Cancelada' ? '—' : fmt2(saldoDe(v))}</p></div>
      ${getBadgeEstado(v.estado)}
    </div>`).join('') : '<p class="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">Este cliente aún no tiene pedidos.</p>';
  document.getElementById('modalCuentaBody').innerHTML = `
    <div class="flex items-start justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
      <div><p class="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400"><span class="font-mono font-bold text-[#1c4d37] dark:text-emerald-400">${escHtml(c.rif)}</span> · ${escHtml(c.zona)} · <span class="font-bold text-[#1c4d37] dark:text-emerald-400">${escHtml(c.ruta || obtenerRutaActivaVentas())}</span></p><h3 class="text-xl font-bold text-[#1c4d37] dark:text-white">${escHtml(c.nombre)}</h3></div>
      <button onclick="closeModal('modalCuenta')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
    </div>
    <div class="grid grid-cols-2 gap-3 text-sm mb-4">
      <div><p class="text-xs text-gray-500 dark:text-gray-400">Contacto</p><p class="font-medium">${escHtml(c.contacto || '—')}</p></div>
      <div><p class="text-xs text-gray-500 dark:text-gray-400">Teléfono</p><p class="font-medium font-mono">${escHtml(c.telefono || '—')}</p></div>
      <div><p class="text-xs text-gray-500 dark:text-gray-400">Correo</p><p class="font-medium truncate">${escHtml(c.email || '—')}</p></div>
      <div><p class="text-xs text-gray-500 dark:text-gray-400">Dirección</p><p class="font-medium truncate">${escHtml(c.direccion || '—')}</p></div>
      <div><p class="text-xs text-gray-500 dark:text-gray-400">Compras totales</p><p class="font-bold text-[#1c4d37] dark:text-emerald-400">${fmt2(comprasDeCliente(c.nombre))}</p></div>
      <div><p class="text-xs text-gray-500 dark:text-gray-400">Saldo pendiente</p><p class="font-bold text-amber-600 dark:text-amber-400">${fmt2(saldoDeCliente(c.nombre))}</p></div>
    </div>
    <p class="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Pedidos</p>
    <div class="divide-y divide-gray-100 dark:divide-gray-700 mb-4 max-h-60 overflow-y-auto">${filas}</div>
    <div class="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
      <button type="button" onclick="closeModal('modalCuenta'); abrirEditarCliente(${idx})" class="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-[#1c4d37] dark:text-emerald-300 text-sm font-semibold transition-colors flex items-center gap-2">
        <i data-lucide="pencil" class="w-4 h-4"></i> Editar Perfil
      </button>
      <button type="button" onclick="closeModal('modalCuenta')" class="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cerrar</button>
    </div>`;
  openModal('modalCuenta');
  if (window.lucide) lucide.createIcons();
}

function desactivarCliente(idx) {
  const c = CLIENTES[idx];
  if (!c || c.activo === false) return;
  const saldo = saldoDeCliente(c.nombre);
  confirmarAccionSistema({
    titulo: 'Desactivar Cliente',
    mensaje: 'El cliente quedará bloqueado para realizar nuevas ventas. Sus facturas emitidas y saldo pendiente permanecerán vigentes.',
    icono: 'lock',
    variante: 'danger',
    textoConfirmar: 'Desactivar Cliente',
    detalleHtml: `
      <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Cliente:</span><span class="font-semibold text-gray-800 dark:text-gray-100">${escHtml(c.nombre)}</span></div>
      <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">RIF / Ruta:</span><span class="font-mono font-bold text-[#1c4d37] dark:text-emerald-400">${escHtml(c.rif)} · ${escHtml(c.ruta || obtenerRutaActivaVentas())}</span></div>
      <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Deuda Pendiente:</span><span class="font-bold text-amber-600 dark:text-amber-400">${fmt2(saldo)}</span></div>
    `,
    onConfirm: () => {
      if (!CLIENTES[idx]) return;
      CLIENTES[idx].activo = false;
      guardarClientes();
      renderClientes();
      filtrarClientes();
      toast(`Cliente "${c.nombre}" desactivado. No se le podrán registrar nuevas ventas hasta desbloquearlo.`);
    }
  });
}

function obtenerUsuarioAutorizadorDesbloqueo() {
  const ses = leerSesionActivaVentas();
  if (ses && ses.username) return ses.username;
  const rutaAct = obtenerRutaActivaVentas();
  try {
    const usuarios = JSON.parse(localStorage.getItem('gs_usuarios_v1')) || window.USUARIOS_SEMILLA_GLOBAL || [];
    const match = usuarios.find(u => u && u.rol === 'Vendedor' && normalizarRutaVenta(u.ruta || u.username) === rutaAct);
    if (match && match.username) return match.username;
  } catch (e) {}
  return 'ruta' + String(rutaAct).replace(/\D+/g, '') || 'ruta2';
}

function abrirModalDesbloquearCliente(idx) {
  const c = CLIENTES[idx];
  const modal = document.getElementById('modalDesbloquearCliente');
  if (!c || !modal) return;

  const saldo = saldoDeCliente(c.nombre);
  const userAuth = obtenerUsuarioAutorizadorDesbloqueo();
  document.getElementById('desbloqClienteIdx').value = String(idx);
  document.getElementById('desbloqPassword').value = '';
  document.getElementById('desbloqPassword').type = 'password';
  const eye = document.getElementById('desbloqEyeIcon');
  if (eye) eye.setAttribute('data-lucide', 'eye');
  const errBox = document.getElementById('desbloqError');
  if (errBox) errBox.classList.add('hidden');
  document.getElementById('desbloqSubtitulo').textContent = `Ingresa la contraseña del usuario (${userAuth}) para desbloquear y reactivar a este cliente.`;
  document.getElementById('desbloqDetalle').innerHTML = `
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Cliente:</span><span class="font-semibold text-gray-800 dark:text-gray-100">${escHtml(c.nombre)}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">RIF / Ruta:</span><span class="font-mono font-bold text-[#1c4d37] dark:text-emerald-400">${escHtml(c.rif)} · ${escHtml(c.ruta || obtenerRutaActivaVentas())}</span></div>
    <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Saldo Pendiente:</span><span class="font-bold text-amber-600 dark:text-amber-400">${fmt2(saldo)}</span></div>
  `;
  openModal('modalDesbloquearCliente');
  if (window.lucide) lucide.createIcons();
  setTimeout(() => {
    const inp = document.getElementById('desbloqPassword');
    if (inp) inp.focus();
  }, 120);
}

function cerrarModalDesbloquearCliente() {
  closeModal('modalDesbloquearCliente');
}

function alternarVisibilidadPasswordDesbloq() {
  const inp = document.getElementById('desbloqPassword');
  const icon = document.getElementById('desbloqEyeIcon');
  if (!inp || !icon) return;
  const mostrar = inp.type === 'password';
  inp.type = mostrar ? 'text' : 'password';
  icon.setAttribute('data-lucide', mostrar ? 'eye-off' : 'eye');
  if (window.lucide) lucide.createIcons();
}

async function confirmarDesbloqueoCliente(e) {
  e.preventDefault();
  const idx = parseInt((document.getElementById('desbloqClienteIdx') && document.getElementById('desbloqClienteIdx').value) || '-1', 10);
  const c = CLIENTES[idx];
  const password = (document.getElementById('desbloqPassword') && document.getElementById('desbloqPassword').value) || '';
  const errBox = document.getElementById('desbloqError');
  const errTxt = document.getElementById('desbloqErrorTexto');
  const btn = document.getElementById('btnConfirmarDesbloq');
  if (!c) return;

  const mostrarErr = (msg) => {
    if (errTxt) errTxt.textContent = msg;
    if (errBox) errBox.classList.remove('hidden');
  };

  if (!password) {
    mostrarErr('Ingresa la contraseña del usuario para desbloquear.');
    return;
  }

  const userAuth = obtenerUsuarioAutorizadorDesbloqueo();
  if (btn) btn.disabled = true;

  let autorizado = false;
  let verificadoEnDb = false;

  try {
    const resp = await fetch('../Base de Datos/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username: userAuth, password })
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.conectado === true) {
        verificadoEnDb = true;
        autorizado = Boolean(data.ok);
        if (!autorizado) {
          mostrarErr(data.mensaje || `Contraseña incorrecta para el usuario ${userAuth}.`);
        }
      }
    }
  } catch (err) {}

  if (!verificadoEnDb) {
    let usuarios = [];
    try {
      usuarios = JSON.parse(localStorage.getItem('gs_usuarios_v1')) || [];
    } catch (e2) {}
    if (!Array.isArray(usuarios) || !usuarios.length) {
      usuarios = window.USUARIOS_SEMILLA_GLOBAL || [];
    }
    const uObj = usuarios.find(u => u && String(u.username || '').toLowerCase() === String(userAuth).toLowerCase());
    const seedU = (window.USUARIOS_SEMILLA_GLOBAL || []).find(s => String(s.username).toLowerCase() === String(userAuth).toLowerCase());
    const claveReal = (uObj && uObj.password) ? String(uObj.password) : (seedU ? seedU.password : '1234');
    if (uObj && (uObj.estado || 'Activo') !== 'Activo') {
      mostrarErr('La cuenta del usuario está inactiva.');
    } else if (password === claveReal) {
      autorizado = true;
    } else {
      mostrarErr(`Contraseña incorrecta para el usuario ${userAuth}.`);
    }
  }

  if (btn) btn.disabled = false;
  if (!autorizado) {
    const inp = document.getElementById('desbloqPassword');
    if (inp) inp.focus();
    return;
  }

  CLIENTES[idx].activo = true;
  guardarClientes();
  cerrarModalDesbloquearCliente();
  renderClientes();
  filtrarClientes();
  toast(`Cliente "${c.nombre}" desbloqueado y habilitado nuevamente para ventas.`);
}

// --- COMÚN & DASHBOARD DE VENTAS CONECTADO A DATOS REALES ---
let chartCajaVentasInst = null;
let chartTendenciaVentasInst = null;

function renderDashboardVentas() {
  const kpiHoy = document.getElementById('kpiVentasHoy');
  if (!kpiHoy) return;

  const tasaActual = obtenerTasaBCV();
  const ventasRuta = ventasDeRutaActiva();
  const pagosRuta = pagosDeRutaActiva();
  const clientesRuta = clientesDeRutaActiva();
  const rutaActiva = obtenerRutaActivaVentas();

  const activas = ventasRuta.filter(v => v.estado !== 'Cancelada');
  const canceladas = ventasRuta.filter(v => v.estado === 'Cancelada');
  const totalVentasActivasUsd = activas.reduce((t, v) => t + (Number(v.total) || 0), 0);
  const totalVentasActivasBs = activas.reduce((t, v) => t + montoBsDeVenta(v), 0);
  const cajaVerificada = pagosRuta.filter(p => pagoVerificado(p)).reduce((t, p) => t + (Number(p.monto) || 0), 0);
  const enVerifTotal = pagosRuta.filter(p => p.estado === 'Por Verificar').reduce((t, p) => t + (Number(p.monto) || 0), 0);
  const porCobrarTotal = activas.reduce((t, v) => t + saldoDe(v), 0);
  const pagosActivos = pagosRuta.filter(p => p.estado !== 'Anulado' && p.estado !== 'Rechazado');
  const clientesConSaldo = clientesRuta.filter(c => saldoDeCliente(c.nombre) > 0).length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('kpiVentasHoy', fmt2(totalVentasActivasUsd));
  set('kpiVentasHoySub', `${fmtBs(totalVentasActivasBs)} · Tasa BCV: ${fmtBs(tasaActual)}`);
  set('kpiBalanceCaja', fmt2(cajaVerificada));
  set('kpiBalanceCajaSub', `Por cobrar: ${fmt2(porCobrarTotal)}${enVerifTotal > 0 ? ` · En verif.: ${fmt2(enVerifTotal)}` : ''}`);
  set('kpiClientesActivos', clientesRuta.length);
  set('kpiClientesActivosSub', `${clientesConSaldo} ${clientesConSaldo === 1 ? 'cliente con saldo' : 'clientes con saldo'} · ${rutaActiva}`);
  set('kpiTransacciones', activas.length + pagosActivos.length);
  set('kpiTransaccionesSub', `${activas.length} ${activas.length === 1 ? 'venta activa' : 'ventas activas'} · ${pagosActivos.length} ${pagosActivos.length === 1 ? 'cobro' : 'cobros'}${canceladas.length ? ` · ${canceladas.length} anul.` : ''}`);

  if (!window.Chart) return;
  const isDark = document.documentElement.classList.contains('dark');
  const tickColor = isDark ? '#d1d5db' : '#374151';
  const gridColor = isDark ? 'rgba(75, 85, 99, 0.25)' : 'rgba(229, 231, 235, 0.8)';

  // Gráfica 1: Ventas Facturadas vs. Cobros por Pedido ($ USD)
  const canvasCaja = document.getElementById('chartCaja');
  if (canvasCaja) {
    const pedidosChart = [...activas].sort((a, b) => (a.fecha || '').localeCompare(b.fecha || '') || (a.id || '').localeCompare(b.id || '')).slice(-8);
    const labelsPedidos = pedidosChart.length
      ? pedidosChart.map(v => `${v.id} · ${v.cliente.split(' ')[0]}`)
      : ['Sin pedidos'];
    const dataTotalPedido = pedidosChart.length ? pedidosChart.map(v => Math.round((Number(v.total) || 0) * 100) / 100) : [0];
    const dataCobradoPedido = pedidosChart.length ? pedidosChart.map(v => Math.round(pagadoDe(v) * 100) / 100) : [0];
    const dataPendientePedido = pedidosChart.length ? pedidosChart.map(v => Math.round(saldoDe(v) * 100) / 100) : [0];

    if (chartCajaVentasInst) chartCajaVentasInst.destroy();
    chartCajaVentasInst = new Chart(canvasCaja.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labelsPedidos,
        datasets: [
          {
            label: 'Total Venta ($)',
            data: dataTotalPedido,
            backgroundColor: '#1c4d37',
            borderRadius: 6
          },
          {
            label: 'Cobrado Verificado ($)',
            data: dataCobradoPedido,
            backgroundColor: '#2d6a4f',
            borderRadius: 6
          },
          {
            label: 'Saldo por Cobrar ($)',
            data: dataPendientePedido,
            backgroundColor: '#d97706',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: tickColor } },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${fmt2(ctx.parsed.y || 0)} (${fmtBs((ctx.parsed.y || 0) * tasaActual)})`
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

  // Gráfica 2: Tendencia Real de Ventas por Fecha ($ USD)
  const canvasVentas = document.getElementById('chartVentas');
  if (canvasVentas) {
    const porFecha = {};
    activas.forEach(v => {
      const f = v.fecha || hoyISO;
      if (!porFecha[f]) porFecha[f] = { fecha: f, totalUsd: 0, count: 0 };
      porFecha[f].totalUsd += Number(v.total) || 0;
      porFecha[f].count += 1;
    });
    const fechasOrd = Object.values(porFecha).sort((a, b) => a.fecha.localeCompare(b.fecha));
    const labelsFechas = fechasOrd.length
      ? fechasOrd.map(r => fmtFecha(r.fecha))
      : ['Sin ventas'];
    const dataFechasUsd = fechasOrd.length
      ? fechasOrd.map(r => Math.round(r.totalUsd * 100) / 100)
      : [0];

    if (chartTendenciaVentasInst) chartTendenciaVentasInst.destroy();
    chartTendenciaVentasInst = new Chart(canvasVentas.getContext('2d'), {
      type: 'line',
      data: {
        labels: labelsFechas,
        datasets: [{
          label: 'Ventas por Fecha ($ USD)',
          data: dataFechasUsd,
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
                const r = fechasOrd[ctx.dataIndex];
                const usdVal = ctx.parsed.y || 0;
                return `${fmt2(usdVal)} (${fmtBs(usdVal * tasaActual)})${r ? ` · ${r.count} ${r.count === 1 ? 'pedido' : 'pedidos'}` : ''}`;
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

// Inicialización automática según la vista activa
document.addEventListener('DOMContentLoaded', () => {
  actualizarIdentidadRutaVentas();
  cargarMarcas();
  seleccionarCredito('0');
  renderizarCarrito();
  renderTablaHistorial(ventasDeRutaActiva());
  renderPagos();
  renderClientes();
  renderDashboardVentas();

  const modalExito = document.getElementById('modalVentaRegistrada');
  if (modalExito) {
    modalExito.addEventListener('click', e => {
      if (e.target.id === 'modalVentaRegistrada') cerrarModalVentaRegistrada();
    });
  }

  const refrescarModuloVentas = () => {
    ventasData = leerStorage(VENTAS_KEY, ventasIniciales);
    pagosData = leerStorage(PAGOS_KEY, () => pagosIniciales(ventasData));
    CLIENTES = leerStorage(CLIENTES_KEY, clientesIniciales).map(normalizarCliente);
    inventarioVentas = obtenerInventarioCompartido();
    actualizarIdentidadRutaVentas();
    renderizarCarrito();
    cargarProductos();
    renderTablaHistorial(ventasDeRutaActiva());
    renderPagos();
    renderClientes();
    renderDashboardVentas();
  };

  window.addEventListener('storage', refrescarModuloVentas);
  window.addEventListener('bcv-tasa-actualizada', () => {
    renderizarCarrito();
    renderTablaHistorial(ventasDeRutaActiva());
    renderPagos();
    renderDashboardVentas();
  });
});