// Lógica del Módulo de Administrador - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de Administrador/admin.js
//
// Conecta y consolida en tiempo real la información de:
//   - Módulo de Ventas (gs_ventas_v2, gs_pagos_v2, gs_clientes_v1)
//   - Módulo de Facturación (gs_facturas_v1)
//   - Módulo de Despacho (gs_despachos_v1)
// Incluye el motor de Reportes de Productos Vendidos por unidades individuales
// y el desglose detallado de qué presentaciones se vendieron de cada producto.

const VENTAS_KEY = 'gs_ventas_v2';
const PAGOS_KEY = 'gs_pagos_v2';
const CLIENTES_KEY = 'gs_clientes_v1';
const FACTURAS_KEY = 'gs_facturas_v1';
const DESPACHOS_KEY = 'gs_despachos_v1';
const hoyISO = new Date().toISOString().slice(0, 10);

// Catálogo maestro y mapeo de cada presentación a su producto base individual
const CATALOGO_PRODUCTOS = {
  'muchy-u-med':        { baseId: 'muchy-med',        baseNombre: 'Muchy Mediano',                  marca: 'Muchy',            marcaKey: 'muchy', tipo: 'Unidad',  plural: 'Unidades sueltas', contiene: 1,  precio: 0.60, nombre: 'Muchy Mediano (Unidad)' },
  'muchy-caja-med':     { baseId: 'muchy-med',        baseNombre: 'Muchy Mediano',                  marca: 'Muchy',            marcaKey: 'muchy', tipo: 'Caja',    plural: 'Cajas',            contiene: 20, precio: 11.00, nombre: 'Caja Muchy Mediano' },
  'muchy-u-xl':         { baseId: 'muchy-xl',         baseNombre: 'Muchy XL',                       marca: 'Muchy',            marcaKey: 'muchy', tipo: 'Unidad',  plural: 'Unidades sueltas', contiene: 1,  precio: 1.00, nombre: 'Muchy XL (Unidad)' },
  'muchy-caja-xl':      { baseId: 'muchy-xl',         baseNombre: 'Muchy XL',                       marca: 'Muchy',            marcaKey: 'muchy', tipo: 'Caja',    plural: 'Cajas',            contiene: 10, precio: 9.00, nombre: 'Caja Muchy XL' },
  'muchy-manga-peq':    { baseId: 'muchy-peq',        baseNombre: 'Muchy Pequeño',                  marca: 'Muchy',            marcaKey: 'muchy', tipo: 'Manga',   plural: 'Mangas',           contiene: 12, precio: 5.00, nombre: 'Manga Muchy Pequeño' },

  'puig-u-maria':       { baseId: 'puig-maria',       baseNombre: 'Galletas María Delicia',         marca: 'Galleterías PUIG', marcaKey: 'puig',  tipo: 'Unidad',  plural: 'Unidades sueltas', contiene: 1,  precio: 0.50, nombre: 'María Delicia (Unidad)' },
  'puig-caja-maria':    { baseId: 'puig-maria',       baseNombre: 'Galletas María Delicia',         marca: 'Galleterías PUIG', marcaKey: 'puig',  tipo: 'Caja',    plural: 'Cajas',            contiene: 24, precio: 11.00, nombre: 'Caja María Delicia' },
  'puig-disp-maria':    { baseId: 'puig-maria',       baseNombre: 'Galletas María Delicia',         marca: 'Galleterías PUIG', marcaKey: 'puig',  tipo: 'Display', plural: 'Displays pequeños', contiene: 18, precio: 8.50, nombre: 'Display María Delicia (pequeño)' },
  'puig-u-katy':        { baseId: 'puig-katy',        baseNombre: 'Galletas Katy',                  marca: 'Galleterías PUIG', marcaKey: 'puig',  tipo: 'Unidad',  plural: 'Unidades sueltas', contiene: 1,  precio: 0.80, nombre: 'Katy (Unidad)' },
  'puig-caja-katy':     { baseId: 'puig-katy',        baseNombre: 'Galletas Katy',                  marca: 'Galleterías PUIG', marcaKey: 'puig',  tipo: 'Caja',    plural: 'Cajas',            contiene: 24, precio: 18.00, nombre: 'Caja Katy' },
  'puig-disp-katy':     { baseId: 'puig-katy',        baseNombre: 'Galletas Katy',                  marca: 'Galleterías PUIG', marcaKey: 'puig',  tipo: 'Display', plural: 'Displays grandes',  contiene: 24, precio: 18.00, nombre: 'Display Katy (grande)' },

  'fisa-u-crema-20':    { baseId: 'fisa-crema-20',    baseNombre: 'Crema para el Cuerpo 20 ml',     marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Unidad',  plural: 'Unidades sueltas', contiene: 1,  precio: 0.80, nombre: 'Crema para el Cuerpo 20 ml (Unidad)' },
  'fisa-caja-crema-20': { baseId: 'fisa-crema-20',    baseNombre: 'Crema para el Cuerpo 20 ml',     marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Caja',    plural: 'Cajas',            contiene: 12, precio: 9.00, nombre: 'Caja Crema para el Cuerpo 20 ml (12 und)' },
  'fisa-u-crema-365':   { baseId: 'fisa-crema-365',   baseNombre: 'Crema para el Cuerpo 365 ml',    marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Unidad',  plural: 'Unidades sueltas', contiene: 1,  precio: 3.50, nombre: 'Crema para el Cuerpo 365 ml (Unidad)' },
  'fisa-caja-crema-365':{ baseId: 'fisa-crema-365',   baseNombre: 'Crema para el Cuerpo 365 ml',    marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Caja',    plural: 'Cajas',            contiene: 12, precio: 40.00, nombre: 'Caja Crema para el Cuerpo 365 ml (12 und)' },
  'fisa-u-crema-800':   { baseId: 'fisa-crema-800',   baseNombre: 'Crema para el Cuerpo 800 ml',    marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Unidad',  plural: 'Unidades sueltas', contiene: 1,  precio: 6.50, nombre: 'Crema para el Cuerpo 800 ml (Unidad)' },
  'fisa-caja-crema-800':{ baseId: 'fisa-crema-800',   baseNombre: 'Crema para el Cuerpo 800 ml',    marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Caja',    plural: 'Cajas',            contiene: 12, precio: 75.00, nombre: 'Caja Crema para el Cuerpo 800 ml (12 und)' },
  'fisa-u-jabon':       { baseId: 'fisa-jabon',       baseNombre: 'Jabón de Baño Every Night',      marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Unidad',  plural: 'Unidades sueltas', contiene: 1,  precio: 1.00, nombre: 'Jabón de Baño Every Night (Unidad)' },
  'fisa-caja-jabon':    { baseId: 'fisa-jabon',       baseNombre: 'Jabón de Baño Every Night',      marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Caja',    plural: 'Cajas',            contiene: 36, precio: 32.00, nombre: 'Caja Jabón de Baño Every Night (36 und)' },
  'fisa-u-deo-60':      { baseId: 'fisa-deo-60',      baseNombre: 'Desodorante Every Night 60 g',   marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Unidad',  plural: 'Unidades sueltas', contiene: 1,  precio: 2.00, nombre: 'Desodorante Every Night 60 g (Unidad)' },
  'fisa-caja-deo-60':   { baseId: 'fisa-deo-60',      baseNombre: 'Desodorante Every Night 60 g',   marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Caja',    plural: 'Cajas',            contiene: 12, precio: 22.00, nombre: 'Caja Desodorante Every Night 60 g (12 und)' },
  'fisa-u-deo-90':      { baseId: 'fisa-deo-90',      baseNombre: 'Desodorante Every Night 90 g',   marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Unidad',  plural: 'Unidades sueltas', contiene: 1,  precio: 2.80, nombre: 'Desodorante Every Night 90 g (Unidad)' },
  'fisa-caja-deo-90':   { baseId: 'fisa-deo-90',      baseNombre: 'Desodorante Every Night 90 g',   marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Caja',    plural: 'Cajas',            contiene: 12, precio: 31.00, nombre: 'Caja Desodorante Every Night 90 g (12 und)' },
  'fisa-u-deo-sachet':  { baseId: 'fisa-deo-sachet',  baseNombre: 'Desodorante Every Night Sachet', marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Sobre',   plural: 'Sobres sueltos',   contiene: 1,  precio: 0.30, nombre: 'Desodorante Every Night Sachet (Sobre)' },
  'fisa-ristra-deo':    { baseId: 'fisa-deo-sachet',  baseNombre: 'Desodorante Every Night Sachet', marca: 'Fisa',             marcaKey: 'fisa',  tipo: 'Ristra',  plural: 'Ristras',          contiene: 12, precio: 3.20, nombre: 'Ristra Desodorante Every Night Sachet' }
};

// Semillas de respaldo por si se abre Administrador antes que otros módulos
function lineasSemilla(...pares) {
  return pares.map(([id, cantidad]) => {
    const p = CATALOGO_PRODUCTOS[id];
    return { id, nombre: p.nombre, cantidad, contiene: p.contiene, precio: p.precio };
  });
}

function ventasSemilla() {
  const crear = (id, cliente, fecha, estado, items, extra = {}) => ({
    id, cliente, fecha, estado, items,
    total: items.reduce((t, i) => t + i.precio * i.cantidad, 0),
    ...extra
  });
  return [
    crear('V-001', 'Supermercado Central', '2026-04-10', 'Completada', lineasSemilla(['muchy-caja-med', 40], ['puig-caja-katy', 20], ['fisa-caja-jabon', 5]), { credito: '0' }),
    crear('V-002', 'Tienda El Ahorro', '2026-04-09', 'Pendiente', lineasSemilla(['puig-disp-maria', 30], ['fisa-caja-crema-365', 4]), { credito: '15' }),
    crear('V-003', 'Minimarket Express', '2026-04-08', 'Completada', lineasSemilla(['muchy-manga-peq', 50], ['fisa-ristra-deo', 40], ['puig-caja-maria', 10]), { credito: '0', estadoDespacho: 'En Preparación' }),
    crear('V-004', 'Bodega San José', '2026-04-08', 'Completada', lineasSemilla(['muchy-caja-xl', 25], ['fisa-caja-deo-60', 6]), { credito: '21+', estadoDespacho: 'Completo' }),
    crear('V-005', 'Comercial López', '2026-04-07', 'Cancelada', lineasSemilla(['puig-caja-katy', 15], ['muchy-caja-med', 20]),
      { credito: '15', anulacion: { motivo: 'El cliente canceló el pedido antes del despacho.', fecha: '2026-04-07' } }),
    crear('V-006', 'Restaurant El Faro', '2026-04-08', 'Completada', lineasSemilla(['fisa-caja-jabon', 10], ['puig-disp-maria', 5]), { credito: '0', estadoDespacho: 'Completo' }),
    crear('V-007', 'Supermercado Juan Griego', '2026-04-08', 'Completada', lineasSemilla(['muchy-caja-xl', 25], ['fisa-ristra-deo', 20]), { credito: '7', estadoDespacho: 'Con Incidencia' })
  ];
}

function pagosSemilla(ventas) {
  const v = id => ventas.find(x => x.id === id);
  const pago = (n, venta, fecha, metodo, monto, referencia, estado = 'Completado') => ({
    id: 'P-' + String(n).padStart(3, '0'), ventaId: venta.id, cliente: venta.cliente, fecha, metodo, monto, referencia, estado
  });
  const res = [
    pago(1, v('V-001'), '2026-04-10', 'Transferencia', v('V-001').total, '884213', 'Completado'),
    pago(2, v('V-003'), '2026-04-08', 'Pago Móvil', v('V-003').total, '550931', 'Completado'),
    pago(3, v('V-004'), '2026-04-08', 'Efectivo ($)', v('V-004').total, '', 'Completado'),
    pago(4, v('V-002'), '2026-04-09', 'Pago Móvil', 50, '771234', 'Por Verificar')
  ];
  if (v('V-006')) res.push(pago(5, v('V-006'), '2026-04-08', 'Efectivo ($)', v('V-006').total, '', 'Completado'));
  if (v('V-007')) res.push(pago(6, v('V-007'), '2026-04-08', 'Transferencia', v('V-007').total, '912045', 'Completado'));
  return res;
}

function despachosSemilla() {
  return [
    { id: 'GS-00101', facturaNumero: 'FAC-000002', ventaId: 'V-003', cliente: 'Minimarket Express', rif: 'J317788990', cond: 0, zona: 'Maneiro', fecha: hoyISO, estado: 'En Preparación', items: '50 Manga Muchy Pequeño (600 uds), 40 Ristra Desodorante Every Night Sachet (480 uds), 10 Caja María Delicia (240 uds)' },
    { id: 'GS-00102', facturaNumero: 'FAC-000003', ventaId: 'V-004', cliente: 'Bodega San José', rif: 'J289900112', cond: 1, zona: 'Díaz', fecha: hoyISO, estado: 'Completo', items: '25 Caja Muchy XL (250 uds), 6 Caja Desodorante Every Night 60 g (72 uds)' },
    { id: 'GS-00103', facturaNumero: 'FAC-000004', ventaId: 'V-006', cliente: 'Restaurant El Faro', rif: 'J401258770', cond: 2, zona: 'Maneiro', fecha: hoyISO, estado: 'Completo', items: '10 Caja Jabón de Baño Every Night (360 uds), 5 Display María Delicia (90 uds)' },
    { id: 'GS-00104', facturaNumero: 'FAC-000005', ventaId: 'V-007', cliente: 'Supermercado Juan Griego', rif: 'J315500981', cond: 3, zona: 'Marcano', fecha: hoyISO, estado: 'Con Incidencia', items: '25 Caja Muchy XL (250 uds), 20 Ristra Desodorante Every Night Sachet (240 uds)',
      incidencia: { tipo: 'transporte', motivo: 'Avería del vehículo', desc: 'Falla de caja en la vía a Juan Griego.', fecha: hoyISO, resuelta: false } }
  ];
}

function leerConSemilla(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) { /* usar semilla */ }
  const data = fallback();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

function leerArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtUsd = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtBs = n => 'Bs. ' + new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const fmtNum = n => new Intl.NumberFormat('es-VE').format(n);
const tasaBCV = () => parseFloat(localStorage.getItem('gs_tasa_bcv')) || 60.50;

function fmtFecha(fechaStr) {
  const s = String(fechaStr || '').trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : s;
}

const MUNICIPIOS_NE = [
  'Arismendi', 'Mariño', 'Maneiro', 'Marcano', 'Gómez',
  'Díaz', 'García', 'Antolín del Campo', 'Península de Macanao', 'Tubores', 'Villalba'
];

const MAPA_MUNICIPIO_CLIENTE_DEFAULT = {
  'Supermercado Central': 'Mariño',
  'Tienda El Ahorro': 'Arismendi',
  'Minimarket Express': 'Maneiro',
  'Bodega San José': 'Marcano',
  'Comercial López': 'Gómez',
  'Bodegón Los Pescadores C.A.': 'Mariño',
  'Abastos La Asunción': 'Arismendi',
  'Restaurant El Faro': 'Maneiro',
  'Supermercado Juan Griego': 'Marcano',
  'Panadería Santa Ana': 'Gómez',
  'Licorería Valle del Espíritu Santo': 'García',
  'Inversiones Boca de Río': 'Península de Macanao'
};

let ventas = [];
let pagos = [];
let clientes = [];
let facturas = [];
let despachos = [];

function municipioDeCliente(nombre, direccionFallback = '') {
  const cli = clientes.find(c => c.nombre === nombre);
  if (cli && cli.zona && MUNICIPIOS_NE.includes(cli.zona)) return cli.zona;
  for (const mun of MUNICIPIOS_NE) {
    if (String(direccionFallback || '').toLowerCase().includes(mun.toLowerCase())) return mun;
  }
  return MAPA_MUNICIPIO_CLIENTE_DEFAULT[nombre] || 'Arismendi';
}

function rifDeCliente(nombre) {
  const cli = clientes.find(c => c.nombre === nombre);
  if (cli && cli.rif) return cli.rif;
  return 'J312345678';
}

function rutaDeCliente(nombre, ventaObj = null) {
  if (ventaObj && ventaObj.ruta) return ventaObj.ruta;
  const cli = clientes.find(c => c.nombre === nombre);
  if (cli && cli.ruta) return cli.ruta;
  if (window.CLIENTES_RUTA_DEFAULT_MAP && window.CLIENTES_RUTA_DEFAULT_MAP[nombre]) return window.CLIENTES_RUTA_DEFAULT_MAP[nombre];
  return 'Ruta 2';
}

function facturasSemillaDesdeVentas(listaVentas) {
  const tasa = tasaBCV();
  const baseVentas = listaVentas.filter(v => v.estado === 'Completada');
  const seleccion = baseVentas.length ? baseVentas : listaVentas.filter(v => v.estado !== 'Cancelada').slice(0, 3);
  return seleccion.map((v, idx) => {
    const corr = idx + 1;
    const total = Math.round(((v.items || []).reduce((t, i) => t + i.precio * i.cantidad, 0)) * 100) / 100;
    const base = Math.round((total / 1.16) * 100) / 100;
    return {
      correlativo: corr,
      numero: 'FAC-' + String(corr).padStart(6, '0'),
      control: '00-' + String(corr).padStart(6, '0'),
      ventaId: v.id,
      cliente: v.cliente,
      rif: rifDeCliente(v.cliente),
      direccion: municipioDeCliente(v.cliente),
      fecha: v.fecha || hoyISO,
      credito: v.credito || '0',
      tasa: Number(v.tasaBcv) > 0 ? Number(v.tasaBcv) : tasa,
      items: (v.items || []).map(i => ({ id: i.id, nombre: i.nombre, cantidad: i.cantidad, contiene: i.contiene, precio: i.precio })),
      base,
      iva: Math.round((total - base) * 100) / 100,
      total
    };
  });
}

function cargarTodo() {
  clientes = leerArray(CLIENTES_KEY);
  ventas = leerConSemilla(VENTAS_KEY, ventasSemilla).filter(v => {
    const c = String(v.cliente || '').toLowerCase();
    return !c.includes('backpack') && (Number(v.total) || 0) < 100000;
  });
  const idsVentas = new Set(ventas.map(v => v.id));
  pagos = leerConSemilla(PAGOS_KEY, () => pagosSemilla(ventas)).filter(p => {
    const c = String(p.cliente || '').toLowerCase();
    return !c.includes('backpack') && (Number(p.monto) || 0) < 100000 && idsVentas.has(p.ventaId);
  });
  if (localStorage.getItem(FACTURAS_KEY) === null && ventas.length > 0) {
    localStorage.setItem(FACTURAS_KEY, JSON.stringify(facturasSemillaDesdeVentas(ventas)));
  }
  facturas = leerArray(FACTURAS_KEY)
    .filter(f => !String(f.cliente || '').toLowerCase().includes('backpack') && (Number(f.total) || 0) < 100000)
    .map((f, idx) => {
      const corrBase = Number(f.correlativo) > 0 ? Number(f.correlativo) : (idx + 1);
      const numero = typeof window.normalizarNumeroFacturaFAC === 'function'
        ? window.normalizarNumeroFacturaFAC(f.numero, corrBase)
        : f.numero;
      return Object.assign({}, f, { numero });
    });
  despachos = leerConSemilla(DESPACHOS_KEY, despachosSemilla);
  localStorage.setItem(VENTAS_KEY, JSON.stringify(ventas));
  localStorage.setItem(PAGOS_KEY, JSON.stringify(pagos));
}

function filtrarVentasCategorizadas({ filtroCliente = 'todos', filtroEstado = 'activas', filtroMarca = 'todas', fechaDesde = '', fechaHasta = '', query = '' } = {}) {
  cargarTodo();
  const q = String(query || '').trim().toLowerCase();
  return ventas.filter(v => {
    if (filtroCliente !== 'todos' && v.cliente !== filtroCliente) return false;
    if (fechaDesde && (v.fecha || '') < fechaDesde) return false;
    if (fechaHasta && (v.fecha || '') > fechaHasta) return false;

    const fac = facturas.find(f => f.ventaId === v.id);
    const facActiva = fac && fac.estado !== 'Anulada';
    const anulada = v.estado === 'Cancelada' || (fac && fac.estado === 'Anulada');

    if (filtroEstado === 'activas' && anulada) return false;
    if (filtroEstado === 'emitidas' && !facActiva) return false;
    if (filtroEstado === 'completadas' && v.estado !== 'Completada') return false;
    if (filtroEstado === 'pendientes' && (v.estado !== 'Pendiente' || anulada)) return false;
    if (filtroEstado === 'sin_facturar' && (facActiva || anulada)) return false;
    if (filtroEstado === 'anuladas' && !anulada) return false;

    if (filtroMarca !== 'todas') {
      const tieneMarca = (v.items || []).some(item => {
        const meta = CATALOGO_PRODUCTOS[item.id];
        return meta && meta.marcaKey === filtroMarca;
      });
      if (!tieneMarca) return false;
    }

    if (q) {
      const numFac = fac ? fac.numero : 'sin facturar';
      const mun = municipioDeCliente(v.cliente, fac && fac.direccion);
      const nombresItems = (v.items || []).map(i => i.nombre).join(' ');
      const blob = `${v.id} ${numFac} ${v.cliente} ${mun} ${fmtFecha(v.fecha)} ${nombresItems}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
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

// ======================================================================
// MOTOR DE CONSOLIDACIÓN DE PRODUCTOS VENDIDOS (UNIDADES INDIVIDUALES)
// ======================================================================
function calcularReporteProductos(soloCompletadasOrOpciones = false, filtroMarcaArg = 'todas') {
  cargarTodo();
  let ventasValidas = [];
  let filtroMarca = filtroMarcaArg;
  if (typeof soloCompletadasOrOpciones === 'object' && soloCompletadasOrOpciones !== null) {
    filtroMarca = soloCompletadasOrOpciones.filtroMarca || 'todas';
    ventasValidas = filtrarVentasCategorizadas(soloCompletadasOrOpciones);
  } else {
    const soloCompletadas = Boolean(soloCompletadasOrOpciones);
    ventasValidas = ventas.filter(v => soloCompletadas ? v.estado === 'Completada' : v.estado !== 'Cancelada');
  }

  const porProductoBase = {};
  const porPresentacion = {};

  ventasValidas.forEach(v => {
    (v.items || []).forEach(item => {
      const meta = CATALOGO_PRODUCTOS[item.id] || {
        baseId: item.id,
        baseNombre: item.nombre,
        marca: 'General',
        marcaKey: 'general',
        tipo: item.contiene > 1 ? 'Caja / Paquete' : 'Unidad',
        plural: item.contiene > 1 ? 'Paquetes' : 'Unidades',
        contiene: item.contiene || 1,
        precio: item.precio || 0,
        nombre: item.nombre
      };

      if (filtroMarca !== 'todas' && meta.marcaKey !== filtroMarca) return;

      const contiene = item.contiene || meta.contiene || 1;
      const paquetes = Number(item.cantidad) || 0;
      const unidadesIndividuales = paquetes * contiene;
      const subtotalUsd = paquetes * (Number(item.precio) || meta.precio || 0);

      // 1) Agrupación por producto base (sumando todas las unidades individuales)
      if (!porProductoBase[meta.baseId]) {
        porProductoBase[meta.baseId] = {
          baseId: meta.baseId,
          baseNombre: meta.baseNombre,
          marca: meta.marca,
          marcaKey: meta.marcaKey,
          unidadesIndividuales: 0,
          paquetesTotales: 0,
          ingresosUsd: 0,
          presentaciones: {},
          pedidos: []
        };
      }
      const grupo = porProductoBase[meta.baseId];
      grupo.unidadesIndividuales += unidadesIndividuales;
      grupo.paquetesTotales += paquetes;
      grupo.ingresosUsd += subtotalUsd;

      if (!grupo.presentaciones[item.id]) {
        grupo.presentaciones[item.id] = {
          id: item.id,
          nombre: meta.nombre,
          tipo: meta.tipo,
          plural: meta.plural,
          contiene,
          paquetes: 0,
          unidadesIndividuales: 0,
          ingresosUsd: 0
        };
      }
      grupo.presentaciones[item.id].paquetes += paquetes;
      grupo.presentaciones[item.id].unidadesIndividuales += unidadesIndividuales;
      grupo.presentaciones[item.id].ingresosUsd += subtotalUsd;
      grupo.pedidos.push({
        ventaId: v.id,
        cliente: v.cliente,
        fecha: v.fecha,
        estado: v.estado,
        presentacionNombre: meta.nombre,
        tipo: meta.tipo,
        paquetes,
        contiene,
        unidadesIndividuales,
        subtotalUsd
      });

      // 2) Agrupación por presentación específica ("qué fue lo que se vendió")
      if (!porPresentacion[item.id]) {
        porPresentacion[item.id] = {
          id: item.id,
          nombre: meta.nombre,
          baseNombre: meta.baseNombre,
          marca: meta.marca,
          marcaKey: meta.marcaKey,
          tipo: meta.tipo,
          plural: meta.plural,
          contiene,
          paquetes: 0,
          unidadesIndividuales: 0,
          ingresosUsd: 0,
          pedidos: []
        };
      }
      porPresentacion[item.id].paquetes += paquetes;
      porPresentacion[item.id].unidadesIndividuales += unidadesIndividuales;
      porPresentacion[item.id].ingresosUsd += subtotalUsd;
      porPresentacion[item.id].pedidos.push({
        ventaId: v.id,
        cliente: v.cliente,
        fecha: v.fecha,
        paquetes,
        unidadesIndividuales,
        subtotalUsd
      });
    });
  });

  // Ordenar de mayor a menor por unidades individuales vendidas
  const rankingProductos = Object.values(porProductoBase).sort((a, b) => b.unidadesIndividuales - a.unidadesIndividuales);
  const rankingPresentaciones = Object.values(porPresentacion).sort((a, b) => b.unidadesIndividuales - a.unidadesIndividuales);

  const totalUnidades = rankingProductos.reduce((t, p) => t + p.unidadesIndividuales, 0);
  const totalPaquetes = rankingProductos.reduce((t, p) => t + p.paquetesTotales, 0);
  const totalIngresos = rankingProductos.reduce((t, p) => t + p.ingresosUsd, 0);

  return {
    rankingProductos,
    rankingPresentaciones,
    totalUnidades,
    totalPaquetes,
    totalIngresos
  };
}

function describirQueSeVendio(grupo) {
  return Object.values(grupo.presentaciones)
    .sort((a, b) => b.unidadesIndividuales - a.unidadesIndividuales)
    .map(p => {
      if (p.contiene > 1) {
        const etiquetaEmpaque = p.paquetes === 1 ? p.tipo : p.plural;
        return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-300 text-xs font-medium border border-emerald-200/60 dark:border-emerald-800/60">
          <b>${fmtNum(p.paquetes)} ${esc(etiquetaEmpaque)}</b> de ${p.contiene} uds <span class="text-gray-500 dark:text-gray-400">(= ${fmtNum(p.unidadesIndividuales)} uds)</span>
        </span>`;
      }
      const etiquetaUnidad = p.paquetes === 1 ? p.tipo : p.plural;
      return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium border border-blue-200/60 dark:border-blue-800/60">
        <b>${fmtNum(p.paquetes)} ${esc(etiquetaUnidad)}</b> <span class="text-gray-500 dark:text-gray-400">(= ${fmtNum(p.unidadesIndividuales)} uds)</span>
      </span>`;
    }).join(' ');
}

// ======================================================================
// DASHBOARD GENERAL DE ADMINISTRADOR (dashboard.php)
// ======================================================================
let chartTopAdmin = null;
let chartModulosAdmin = null;

function initAdminDashboard() {
  if (!$('kpiAdminVentas')) return;
  cargarTodo();

  const ventasActivas = ventas.filter(v => v.estado !== 'Cancelada');
  const ventasCompletadas = ventas.filter(v => v.estado === 'Completada');
  const ventasPendientes = ventas.filter(v => v.estado === 'Pendiente');
  const totalVentasUsd = ventasActivas.reduce((t, v) => t + v.total, 0);

  const pagosVerificados = pagos.filter(p => p.estado === 'Completado' || p.estado === 'Verificado');
  const pagosPorVerificar = pagos.filter(p => p.estado === 'Por Verificar');
  const totalCobradoUsd = pagosVerificados.reduce((t, p) => t + p.monto, 0);
  const totalEnVerifUsd = pagosPorVerificar.reduce((t, p) => t + p.monto, 0);

  const facturasActivas = facturas.filter(f => f.estado !== 'Anulada');
  const ventasFacturadasIds = new Set(facturasActivas.map(f => f.ventaId));
  const pendientesPorFacturar = ventasActivas.filter(v => !ventasFacturadasIds.has(v.id));

  const despachosPend = despachos.filter(d => d.estado === 'Pendiente' || d.estado === 'En Preparación' || d.estado === 'En Proceso');
  const despachosRuta = despachos.filter(d => d.estado === 'Completo' || d.estado === 'Despachado');
  const despachosInc = despachos.filter(d => d.estado === 'Con Incidencia');

  const rep = calcularReporteProductos(false, 'todas');

  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set('kpiAdminVentas', fmtUsd(totalVentasUsd));
  set('kpiAdminVentasSub', `${ventasActivas.length} pedidos activos · ${fmtNum(rep.totalUnidades)} uds`);

  set('kpiAdminCobrado', fmtUsd(totalCobradoUsd));
  set('kpiAdminPorVerificar', `${pagosPorVerificar.length} por verificar (${fmtUsd(totalEnVerifUsd)})`);

  set('kpiAdminFacturas', `${facturasActivas.length} Emitidas`);
  set('kpiAdminPorFacturar', `${pendientesPorFacturar.length} por facturar`);

  set('kpiAdminDespachos', `${despachosRuta.length} Completos`);
  set('kpiAdminIncidencias', `${despachosPend.length} en prep. · ${despachosInc.length} incidencias`);

  // Tarjetas de resumen por módulo
  set('modVentasCompletadas', ventasCompletadas.length);
  set('modVentasPendientes', ventasPendientes.length);
  set('modVentasUnidades', fmtNum(rep.totalUnidades) + ' uds');

  set('modFactEmitidas', facturasActivas.length);
  set('modFactPorVerificar', pagosPorVerificar.length);
  set('modFactPorEmitir', pendientesPorFacturar.length);

  set('modDespPendientes', despachosPend.length);
  set('modDespRuta', despachosRuta.length);
  set('modDespIncidencias', despachosInc.length);

  // Tabla de resumen ejecutivo de pedidos entre módulos
  const tbody = $('tablaResumenEjecutivo');
  if (tbody) {
    tbody.innerHTML = ventas.slice(0, 6).map(v => {
      const fac = facturas.find(f => f.ventaId === v.id && f.estado !== 'Anulada');
      const uds = (v.items || []).reduce((t, i) => t + i.cantidad * (i.contiene || 1), 0);
      const badgeEst = v.estado === 'Completada'
        ? '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Completada</span>'
        : v.estado === 'Pendiente'
          ? '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Pendiente</span>'
          : '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Cancelada</span>';
      const badgeFac = fac
        ? `<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-[#1c4d37] dark:bg-emerald-900/30 dark:text-emerald-300">${esc(fac.numero)}</span>`
        : '<span class="text-xs text-gray-400 dark:text-gray-500">Sin facturar</span>';
      const creditoTxt = (!v.credito || v.credito === '0')
        ? '0 días (Contado)'
        : (v.credito === '21+' ? '21 días o más' : `${v.credito} días`);
      return `
      <tr class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
        <td class="py-3.5 px-4 font-semibold text-[#1c4d37] dark:text-emerald-400">${esc(v.id)}</td>
        <td class="py-3.5 px-4 font-medium text-gray-900 dark:text-white">${esc(v.cliente)}<p class="text-[11px] font-bold text-[#1c4d37] dark:text-emerald-400">${esc(rutaDeCliente(v.cliente, v))}</p></td>
        <td class="py-3.5 px-4 text-gray-500 dark:text-gray-400">${esc(v.fecha)}</td>
        <td class="py-3.5 px-4 font-semibold text-gray-800 dark:text-gray-200">${fmtNum(uds)} uds</td>
        <td class="py-3.5 px-4 text-xs font-medium text-gray-600 dark:text-gray-300">${esc(creditoTxt)}</td>
        <td class="py-3.5 px-4 font-bold text-gray-900 dark:text-white">${fmtUsd(v.total)}</td>
        <td class="py-3.5 px-4">${badgeFac}</td>
        <td class="py-3.5 px-4">${badgeEst}</td>
      </tr>`;
    }).join('');
  }

  // Gráficos
  if (window.Chart) {
    const dark = document.documentElement.classList.contains('dark');
    Chart.defaults.color = dark ? '#d1d5db' : '#4b5563';

    const top5 = rep.rankingProductos.slice(0, 5);
    const ctxTop = $('chartAdminTopProductos');
    if (ctxTop) {
      if (chartTopAdmin) chartTopAdmin.destroy();
      chartTopAdmin = new Chart(ctxTop.getContext('2d'), {
        type: 'bar',
        data: {
          labels: top5.map(p => p.baseNombre),
          datasets: [{
            label: 'Unidades Individuales Vendidas',
            data: top5.map(p => p.unidadesIndividuales),
            backgroundColor: ['#1c4d37', '#2d6a4f', '#40916c', '#52b788', '#74c69d'],
            borderRadius: 8
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true } }
        }
      });
    }

    const ctxMod = $('chartAdminModulos');
    if (ctxMod) {
      if (chartModulosAdmin) chartModulosAdmin.destroy();
      chartModulosAdmin = new Chart(ctxMod.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Ventas Completadas', 'Ventas Pendientes', 'Pagos por Verificar', 'Despachos en Ruta', 'Incidencias Logísticas'],
          datasets: [{
            data: [ventasCompletadas.length, ventasPendientes.length, pagosPorVerificar.length, despachosRuta.length, despachosInc.length],
            backgroundColor: ['#1c4d37', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: {
          cutout: '62%',
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }
  }

  if (window.sincronizarGraficasYTextoTema) window.sincronizarGraficasYTextoTema();
  renderRastreoMunicipios();
  if (window.lucide) lucide.createIcons();
}

// ======================================================================
// RASTREO DE FACTURAS POR MUNICIPIOS + LÍNEA DE TIEMPO 5 (5 ETAPAS)
// ======================================================================
let facturaRastreoSeleccionada = null;

function seleccionarMunicipioRastreo(mun) {
  const sel = $('filtroMunicipioRastreo');
  if (sel && sel.value !== mun) sel.value = mun;
  facturaRastreoSeleccionada = null;
  renderRastreoMunicipios();
}

function seleccionarFacturaRastreo(idDoc) {
  facturaRastreoSeleccionada = idDoc;
  renderRastreoMunicipios();
}

function obtenerDocumentosRastreoMunicipios() {
  cargarTodo();
  const tasaDef = tasaBCV();
  const listaDocs = [];
  const ventasConFactura = new Set();

  facturas.forEach(f => {
    const v = ventas.find(x => x.id === f.ventaId);
    if (v) ventasConFactura.add(v.id);
    const mun = municipioDeCliente(f.cliente, f.direccion);
    const tasa = Number(f.tasa) > 0 ? Number(f.tasa) : tasaDef;
    listaDocs.push({
      key: f.numero,
      facturaNumero: f.numero,
      control: f.control || '00-000001',
      ventaId: f.ventaId,
      cliente: f.cliente,
      rif: f.rif || rifDeCliente(f.cliente),
      ruta: rutaDeCliente(f.cliente, v),
      municipio: mun,
      fecha: f.fecha || (v && v.fecha) || hoyISO,
      totalUsd: Number(f.total) || 0,
      totalBs: (Number(f.total) || 0) * tasa,
      tasa,
      facturada: true,
      anulada: f.estado === 'Anulada' || (v && v.estado === 'Cancelada'),
      motivoAnulacion: f.motivoAnulacion || (v && v.anulacion && v.anulacion.motivo) || '',
      venta: v || null,
      factura: f
    });
  });

  // Incluir también ventas activas pendientes de facturar para visibilidad completa por municipio
  ventas.forEach(v => {
    if (ventasConFactura.has(v.id)) return;
    const mun = municipioDeCliente(v.cliente);
    const tasa = Number(v.tasaBcv) > 0 ? Number(v.tasaBcv) : tasaDef;
    listaDocs.push({
      key: v.id,
      facturaNumero: `Por emitir (${v.id})`,
      control: 'Pendiente',
      ventaId: v.id,
      cliente: v.cliente,
      rif: rifDeCliente(v.cliente),
      ruta: rutaDeCliente(v.cliente, v),
      municipio: mun,
      fecha: v.fecha || hoyISO,
      totalUsd: Number(v.total) || 0,
      totalBs: (Number(v.total) || 0) * tasa,
      tasa,
      facturada: false,
      anulada: v.estado === 'Cancelada',
      motivoAnulacion: (v.anulacion && v.anulacion.motivo) || '',
      venta: v,
      factura: null
    });
  });

  return listaDocs;
}

function construirTimeline5Factura(doc) {
  const pagosVenta = pagos.filter(p => p.ventaId === doc.ventaId && p.estado !== 'Anulado' && p.estado !== 'Rechazado');
  const pagosVerificados = pagosVenta.filter(p => p.estado === 'Completado' || p.estado === 'Verificado');
  const montoVerificado = pagosVerificados.reduce((t, p) => t + (Number(p.monto) || 0), 0);
  const cobroCompletado = (doc.venta && doc.venta.estado === 'Completada') || (doc.totalUsd > 0 && montoVerificado >= doc.totalUsd - 0.01);
  const cobroEnProceso = pagosVenta.length > 0 && !cobroCompletado;

  const despAsociado = despachos.find(d =>
    d.id === doc.ventaId ||
    String(d.cliente || '').toLowerCase() === String(doc.cliente || '').toLowerCase() ||
    String(d.zona || '').toLowerCase().includes(String(doc.municipio || '').toLowerCase())
  );

  const enRutaOEntregado = cobroCompletado || (despAsociado && (despAsociado.estado === 'Despachado' || despAsociado.estado === 'En Preparación'));
  const entregadoFinal = (doc.venta && doc.venta.estado === 'Completada' && doc.facturada) || (despAsociado && despAsociado.estado === 'Despachado' && cobroCompletado);

  const etapas = [
    {
      paso: 1,
      titulo: '1. Pedido Registrado en Ventas',
      modulo: 'Módulo de Ventas',
      icono: 'shopping-cart',
      fecha: fmtFecha((doc.venta && doc.venta.fecha) || doc.fecha),
      estado: 'completado',
      descripcion: `Orden ${doc.ventaId} generada para ${doc.cliente} (${doc.municipio}) con reserva automática de stock.`
    },
    {
      paso: 2,
      titulo: '2. Emisión de Factura Fiscal',
      modulo: 'Módulo de Facturación',
      icono: 'file-text',
      fecha: doc.facturada ? fmtFecha(doc.fecha) : 'Pendiente',
      estado: doc.anulada ? 'anulado' : (doc.facturada ? 'completado' : 'actual'),
      descripcion: doc.facturada
        ? `Factura ${doc.facturaNumero} (Control ${doc.control}) emitida por ${fmtUsd(doc.totalUsd)} / ${fmtBs(doc.totalBs)}.`
        : `Pendiente por emitir comprobante fiscal en Facturación para el pedido ${doc.ventaId}.`
    },
    {
      paso: 3,
      titulo: '3. Verificación de Cobranza',
      modulo: 'Módulo de Cobranzas',
      icono: 'wallet',
      fecha: pagosVerificados[0] ? fmtFecha(pagosVerificados[0].fecha) : (pagosVenta[0] ? fmtFecha(pagosVenta[0].fecha) : 'En espera'),
      estado: doc.anulada ? 'anulado' : (cobroCompletado ? 'completado' : (cobroEnProceso ? 'actual' : 'pendiente')),
      descripcion: cobroCompletado
        ? `Pago 100% verificado en Cobranzas (${fmtUsd(doc.totalUsd)}).`
        : cobroEnProceso
          ? `Pago registrado en revisión por Cobranzas (${pagosVenta[0].metodo}).`
          : 'En espera de registro y conciliación del pago del cliente.'
    },
    {
      paso: 4,
      titulo: '4. Despacho y Ruta Municipal',
      modulo: 'Módulo de Despacho',
      icono: 'truck',
      fecha: despAsociado ? fmtFecha(despAsociado.fecha || doc.fecha) : fmtFecha(doc.fecha),
      estado: doc.anulada ? 'anulado' : (entregadoFinal ? 'completado' : (enRutaOEntregado ? 'actual' : 'pendiente')),
      descripcion: enRutaOEntregado
        ? `Guía de carga asignada a unidad de transporte con destino al Municipio ${doc.municipio}, Nueva Esparta.`
        : `Programado para despacho hacia el Municipio ${doc.municipio}.`
    },
    {
      paso: 5,
      titulo: '5. Entrega Conforme y Cierre en Destino',
      modulo: `Destino · Municipio ${doc.municipio}`,
      icono: 'check-circle-2',
      fecha: entregadoFinal ? fmtFecha(doc.fecha) : 'Por confirmar',
      estado: doc.anulada ? 'anulado' : (entregadoFinal ? 'completado' : 'pendiente'),
      descripcion: doc.anulada
        ? `Operación anulada: ${doc.motivoAnulacion || 'Documento anulado en sistema'}.`
        : entregadoFinal
          ? `Factura y mercancía recibidas conforme por ${doc.cliente} en el Municipio ${doc.municipio}.`
          : `Pendiente de acta de recepción conforme en el Municipio ${doc.municipio}.`
    }
  ];

  const completadasCount = etapas.filter(e => e.estado === 'completado').length;
  return { etapas, completadasCount };
}

function renderRastreoMunicipios() {
  const gridMun = $('gridMunicipiosRastreo');
  const listaEl = $('listaFacturasMunicipio');
  const timelineEl = $('contenedorLineaTiempo5');
  if (!gridMun || !listaEl || !timelineEl) return;

  const docs = obtenerDocumentosRastreoMunicipios();
  const munFiltro = ($('filtroMunicipioRastreo') && $('filtroMunicipioRastreo').value) || 'Todos';
  const query = (($('busquedaFacturaRastreo') && $('busquedaFacturaRastreo').value) || '').trim().toLowerCase();

  // Contabilizar por municipio
  const resumenMun = {};
  MUNICIPIOS_NE.forEach(m => { resumenMun[m] = { municipio: m, count: 0, totalUsd: 0 }; });
  docs.forEach(d => {
    if (!resumenMun[d.municipio]) resumenMun[d.municipio] = { municipio: d.municipio, count: 0, totalUsd: 0 };
    resumenMun[d.municipio].count += 1;
    if (!d.anulada) resumenMun[d.municipio].totalUsd += d.totalUsd;
  });

  // Renderizar tarjetas de municipios (Todos + municipios con actividad o principales)
  const municipiosOrdenados = Object.values(resumenMun).sort((a, b) => b.count - a.count);
  const tarjetasMun = [
    {
      key: 'Todos',
      label: 'Todos (Nva. Esparta)',
      count: docs.length,
      totalUsd: docs.filter(d => !d.anulada).reduce((t, d) => t + d.totalUsd, 0)
    },
    ...municipiosOrdenados.slice(0, 5).map(m => ({
      key: m.municipio,
      label: m.municipio,
      count: m.count,
      totalUsd: m.totalUsd
    }))
  ];

  gridMun.innerHTML = tarjetasMun.map(m => {
    const activo = munFiltro === m.key;
    return `
      <button type="button" onclick="seleccionarMunicipioRastreo('${esc(m.key)}')" class="text-left p-3 rounded-xl border transition-all ${activo ? 'bg-[#1c4d37] text-white border-[#1c4d37] dark:bg-emerald-600 dark:border-emerald-500 shadow-sm' : 'bg-gray-50 dark:bg-gray-900 hover:bg-emerald-50/50 dark:hover:bg-gray-700/60 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'}">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-bold truncate">${esc(m.label)}</span>
          <span class="text-[11px] font-bold px-1.5 py-0.5 rounded-md ${activo ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-300'}">${m.count}</span>
        </div>
        <p class="text-xs font-semibold mt-1 ${activo ? 'text-emerald-100' : 'text-gray-500 dark:text-gray-400'}">${fmtUsd(m.totalUsd)}</p>
      </button>
    `;
  }).join('');

  // Filtrar documentos por municipio y búsqueda
  const filtrados = docs.filter(d => {
    if (munFiltro !== 'Todos' && d.municipio !== munFiltro) return false;
    if (query) {
      const blob = `${d.facturaNumero} ${d.ventaId} ${d.cliente} ${d.rif} ${d.municipio} ${fmtFecha(d.fecha)}`.toLowerCase();
      if (!blob.includes(query)) return false;
    }
    return true;
  });

  const contEl = $('contadorFacturasRastreo');
  if (contEl) contEl.textContent = `${filtrados.length} ${filtrados.length === 1 ? 'documento' : 'documentos'}`;

  if (!filtrados.length) {
    listaEl.innerHTML = '<div class="text-center py-10 text-sm text-gray-400 dark:text-gray-500">No hay facturas registradas en este municipio con el filtro actual.</div>';
    timelineEl.innerHTML = '<div class="text-center py-16 text-sm text-gray-400 dark:text-gray-500">Selecciona un municipio con facturas activas para visualizar su Línea de Tiempo de 5 Etapas.</div>';
    if (window.lucide) lucide.createIcons();
    return;
  }

  let docActivo = filtrados.find(d => d.key === facturaRastreoSeleccionada) || filtrados[0];
  facturaRastreoSeleccionada = docActivo.key;

  listaEl.innerHTML = filtrados.map(d => {
    const sel = d.key === docActivo.key;
    const { completadasCount } = construirTimeline5Factura(d);
    const badgeEtapa = d.anulada
      ? '<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Anulada</span>'
      : `<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-[#1c4d37] dark:bg-emerald-900/40 dark:text-emerald-300">Etapa ${completadasCount}/5</span>`;
    return `
      <div onclick="seleccionarFacturaRastreo('${esc(d.key)}')" class="p-3.5 rounded-xl border cursor-pointer transition-all ${sel ? 'bg-white dark:bg-gray-800 border-[#1c4d37] dark:border-emerald-500 ring-2 ring-[#1c4d37]/15 shadow-sm' : 'bg-white/70 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 hover:border-emerald-400'}">
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="font-bold text-sm text-[#1c4d37] dark:text-emerald-400">${esc(d.facturaNumero)}</span>
          ${badgeEtapa}
        </div>
        <p class="text-xs font-semibold text-gray-800 dark:text-gray-100">${esc(d.cliente)}</p>
        <div class="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
          <span class="inline-flex items-center gap-1 font-medium text-[#1c4d37] dark:text-emerald-300"><i data-lucide="map-pin" class="w-3 h-3"></i> ${esc(d.municipio)} · ${esc(d.ruta || 'Ruta 2')}</span>
          <span class="font-mono">${esc(fmtFecha(d.fecha))}</span>
        </div>
        <div class="flex items-baseline justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/70">
          <span class="text-xs font-bold text-gray-900 dark:text-white">${fmtUsd(d.totalUsd)}</span>
          <span class="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">${fmtBs(d.totalBs)}</span>
        </div>
      </div>
    `;
  }).join('');

  const { etapas, completadasCount } = construirTimeline5Factura(docActivo);
  const porcentaje = Math.round((completadasCount / 5) * 100);

  timelineEl.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
      <div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-lg font-extrabold text-[#1c4d37] dark:text-emerald-400">${esc(docActivo.facturaNumero)}</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-300 font-bold">Municipio ${esc(docActivo.municipio)}</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 font-bold">${esc(docActivo.ruta || 'Ruta 2')}</span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${esc(docActivo.cliente)} · RIF ${esc(docActivo.rif)} · Pedido ${esc(docActivo.ventaId)}</p>
      </div>
      <div class="text-left sm:text-right">
        <p class="text-sm font-bold text-gray-900 dark:text-white">${fmtUsd(docActivo.totalUsd)}</p>
        <p class="text-xs font-semibold text-emerald-700 dark:text-emerald-400">${fmtBs(docActivo.totalBs)}</p>
      </div>
    </div>

    <!-- Barra de progreso de las 5 etapas -->
    <div class="mb-5">
      <div class="flex items-center justify-between text-xs font-bold mb-1.5">
        <span class="text-gray-600 dark:text-gray-300">Línea de Tiempo de Trazabilidad (5 Etapas)</span>
        <span class="text-[#1c4d37] dark:text-emerald-400">${completadasCount} de 5 etapas completadas (${porcentaje}%)</span>
      </div>
      <div class="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full ${docActivo.anulada ? 'bg-red-500' : 'bg-[#1c4d37] dark:bg-emerald-500'} rounded-full transition-all duration-300" style="width:${porcentaje}%"></div>
      </div>
    </div>

    <!-- 5 Etapas de la Línea de Tiempo -->
    <div class="space-y-3">
      ${etapas.map(e => {
        const esComp = e.estado === 'completado';
        const esAct = e.estado === 'actual';
        const esAnu = e.estado === 'anulado';
        const badgeCls = esComp
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
          : esAct
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
            : esAnu
              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
        const circleCls = esComp
          ? 'bg-[#1c4d37] text-white dark:bg-emerald-600'
          : esAct
            ? 'bg-amber-500 text-white'
            : esAnu
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400';
        const textoEst = esComp ? 'Completado' : esAct ? 'En curso' : esAnu ? 'Anulado' : 'Pendiente';
        return `
          <div class="flex items-start gap-3.5 p-3 rounded-xl border ${esComp ? 'bg-white dark:bg-gray-800 border-emerald-200/80 dark:border-emerald-800/50' : esAct ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60' : 'bg-white/50 dark:bg-gray-800/40 border-gray-200/70 dark:border-gray-700/60'}">
            <div class="w-9 h-9 rounded-xl ${circleCls} flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-xs">
              <i data-lucide="${e.icono}" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-sm font-bold text-gray-900 dark:text-white">${esc(e.titulo)}</p>
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-mono text-gray-500 dark:text-gray-400">${esc(e.fecha)}</span>
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${badgeCls}">${textoEst}</span>
                </div>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-300 mt-0.5">${esc(e.descripcion)}</p>
              <span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">${esc(e.modulo)}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// ======================================================================
// MÓDULO DE REPORTES CATEGORIZADOS DE GERENCIA (reportes.php)
// ======================================================================
let chartReporteRanking = null;

function poblarSelectClientesReporteGerencia() {
  const sel = $('filtroClienteReporte');
  if (!sel) return;
  const actual = sel.value || 'todos';
  const nombres = [...new Set([...ventas.map(v => v.cliente), ...facturas.map(f => f.cliente), ...clientes.map(c => c.nombre)].filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  sel.innerHTML = '<option value="todos">Todos los Clientes</option>' +
    nombres.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
  if (nombres.includes(actual)) sel.value = actual;
}

function obtenerFiltrosReporteGerencia() {
  return {
    filtroCliente: ($('filtroClienteReporte') && $('filtroClienteReporte').value) || 'todos',
    filtroEstado: ($('filtroEstadoReporte') && $('filtroEstadoReporte').value) || 'activas',
    filtroMarca: ($('filtroMarcaReporte') && $('filtroMarcaReporte').value) || 'todas',
    fechaDesde: ($('filtroFechaDesdeReporte') && $('filtroFechaDesdeReporte').value) || '',
    fechaHasta: ($('filtroFechaHastaReporte') && $('filtroFechaHastaReporte').value) || '',
    query: (($('busquedaReporte') && $('busquedaReporte').value) || '').trim().toLowerCase()
  };
}

function limpiarFiltrosReporteGerencia() {
  if ($('busquedaReporte')) $('busquedaReporte').value = '';
  if ($('filtroClienteReporte')) $('filtroClienteReporte').value = 'todos';
  if ($('filtroEstadoReporte')) $('filtroEstadoReporte').value = 'activas';
  if ($('filtroMarcaReporte')) $('filtroMarcaReporte').value = 'todas';
  if ($('filtroFechaDesdeReporte')) $('filtroFechaDesdeReporte').value = '';
  if ($('filtroFechaHastaReporte')) $('filtroFechaHastaReporte').value = '';
  renderReportes();
}

function lineasDeVentaGerencia(v) {
  const s = new Set();
  (v.items || []).forEach(i => {
    const meta = CATALOGO_PRODUCTOS[i.id];
    if (meta && meta.marca) s.add(meta.marca);
  });
  return [...s];
}

function renderReportes() {
  const tbodyRanking = $('tablaRankingProductos');
  if (!tbodyRanking) return;
  cargarTodo();
  poblarSelectClientesReporteGerencia();

  const filtros = obtenerFiltrosReporteGerencia();
  const ventasCat = filtrarVentasCategorizadas(filtros);
  const rep = calcularReporteProductos(filtros);
  const tasaActual = tasaBCV();

  const totalBs = ventasCat.reduce((t, v) => {
    const fac = facturas.find(f => f.ventaId === v.id);
    const tasa = (fac && Number(fac.tasa) > 0) ? Number(fac.tasa) : ((Number(v.tasaBcv) > 0) ? Number(v.tasaBcv) : tasaActual);
    return t + (Number(v.total) || 0) * tasa;
  }, 0);

  // KPIs superiores
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set('repTotalUnidades', fmtNum(rep.totalUnidades) + ' uds');
  set('repTotalPaquetes', fmtNum(rep.totalPaquetes) + ' empaques / uds');
  set('repTotalIngresos', fmtUsd(rep.totalIngresos));
  set('repTotalIngresosBs', fmtBs(totalBs));
  set('repTotalFacturasSub', `${ventasCat.length} operaciones en el filtro`);
  if (rep.rankingProductos.length > 0) {
    const top1 = rep.rankingProductos[0];
    set('repProductoLider', top1.baseNombre);
    set('repProductoLiderSub', `${fmtNum(top1.unidadesIndividuales)} unidades individuales (${top1.marca})`);
  } else {
    set('repProductoLider', 'Sin ventas');
    set('repProductoLiderSub', '0 unidades');
  }

  // 0) Tabla de Facturas y Operaciones Categorizadas
  const tbodyFacCat = $('tablaFacturasCategorizadas');
  if (tbodyFacCat) {
    tbodyFacCat.innerHTML = ventasCat.length ? ventasCat.map(v => {
      const fac = facturas.find(f => f.ventaId === v.id);
      const mun = municipioDeCliente(v.cliente, fac && fac.direccion);
      const lineas = lineasDeVentaGerencia(v);
      const tasa = (fac && Number(fac.tasa) > 0) ? Number(fac.tasa) : ((Number(v.tasaBcv) > 0) ? Number(v.tasaBcv) : tasaActual);
      const anulada = v.estado === 'Cancelada' || (fac && fac.estado === 'Anulada');
      const badgeEstado = anulada
        ? '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Anulada</span>'
        : v.estado === 'Completada'
          ? '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Pagada / Completada</span>'
          : fac
            ? '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Emitida · Pendiente Cobro</span>'
            : '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Venta Sin Facturar</span>';

      return `
      <tr class="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors">
        <td class="py-3.5 px-4">
          <p class="font-bold text-[#1c4d37] dark:text-emerald-400">${esc(fac ? fac.numero : 'Sin Factura')}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">Pedido ${esc(v.id)}</p>
        </td>
        <td class="py-3.5 px-4 font-mono text-xs">${esc(fmtFecha(v.fecha))}</td>
        <td class="py-3.5 px-4">
          <p class="font-semibold text-gray-900 dark:text-white">${esc(v.cliente)}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Mpio. ${esc(mun)} · <span class="font-bold text-[#1c4d37] dark:text-emerald-400">${esc(rutaDeCliente(v.cliente, v))}</span></p>
        </td>
        <td class="py-3.5 px-4">
          <div class="flex flex-wrap gap-1">${lineas.map(l => `<span class="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-300">${esc(l)}</span>`).join('')}</div>
        </td>
        <td class="py-3.5 px-4 text-center">${badgeEstado}</td>
        <td class="py-3.5 px-4 text-right font-bold text-gray-900 dark:text-white">${fmtUsd(v.total)}</td>
        <td class="py-3.5 px-4 text-right font-bold text-[#1c4d37] dark:text-emerald-400">${fmtBs(v.total * tasa)}</td>
      </tr>`;
    }).join('') : '<tr><td colspan="7" class="text-center py-8 text-gray-400 dark:text-gray-500">No se encontraron facturas ni ventas con los filtros seleccionados.</td></tr>';
  }

  // Filtrar productos por texto si el usuario escribió en el buscador
  const productosFiltrados = rep.rankingProductos;

  // 1) Tabla Principal: Ranking por Mayor Cantidad de Ventas (Unidades Individuales)
  tbodyRanking.innerHTML = productosFiltrados.length ? productosFiltrados.map(p => {
    const pos = rep.rankingProductos.indexOf(p) + 1;
    const pct = rep.totalUnidades > 0 ? Math.round((p.unidadesIndividuales / rep.totalUnidades) * 100) : 0;
    const medalla = pos === 1
      ? '<span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 font-bold text-xs">1°</span>'
      : pos === 2
        ? '<span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-bold text-xs">2°</span>'
        : pos === 3
          ? '<span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 font-bold text-xs">3°</span>'
          : `<span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 font-semibold text-xs">${pos}°</span>`;

    return `
    <tr class="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors">
      <td class="py-4 px-4 text-center">${medalla}</td>
      <td class="py-4 px-4">
        <p class="font-bold text-gray-900 dark:text-white">${esc(p.baseNombre)}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">${esc(p.marca)}</p>
      </td>
      <td class="py-4 px-4 text-center">
        <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1c4d37] text-white dark:bg-emerald-600 font-bold text-sm shadow-xs">
          ${fmtNum(p.unidadesIndividuales)} uds
        </span>
      </td>
      <td class="py-4 px-4">
        <div class="flex flex-wrap gap-1.5">${describirQueSeVendio(p)}</div>
      </td>
      <td class="py-4 px-4 w-40">
        <div class="flex items-center gap-2">
          <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-[#1c4d37] dark:bg-emerald-500 rounded-full" style="width:${pct}%"></div>
          </div>
          <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 w-9 text-right">${pct}%</span>
        </div>
      </td>
      <td class="py-4 px-4 text-right font-bold text-gray-900 dark:text-white">${fmtUsd(p.ingresosUsd)}</td>
    </tr>`;
  }).join('') : '<tr><td colspan="6" class="text-center py-10 text-gray-400 dark:text-gray-500">No se encontraron productos vendidos con esos filtros.</td></tr>';

  // 2) Segunda Tabla / Sección: Detalle específico de qué presentación se vendió de cada producto
  const tbodyDetalle = $('tablaDetallePresentaciones');
  if (tbodyDetalle) {
    const presFiltradas = rep.rankingPresentaciones;

    tbodyDetalle.innerHTML = presFiltradas.length ? presFiltradas.map(pr => {
      const etiquetaCantidad = pr.paquetes === 1 ? pr.tipo : pr.plural;
      const explicacionConversion = pr.contiene > 1
        ? `${fmtNum(pr.paquetes)} ${pr.paquetes === 1 ? pr.tipo.toLowerCase() : pr.plural.toLowerCase()} × ${pr.contiene} uds c/u = ${fmtNum(pr.unidadesIndividuales)} uds`
        : `${fmtNum(pr.paquetes)} ${pr.paquetes === 1 ? 'unidad directa' : 'unidades directas'}`;
      const detallePedidos = pr.pedidos.map(ped =>
        `<span class="inline-block text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-1 mb-1">${esc(ped.ventaId)} (${esc(ped.cliente)}: ${ped.paquetes} → ${fmtNum(ped.unidadesIndividuales)} uds)</span>`
      ).join('');

      return `
      <tr class="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors">
        <td class="py-3.5 px-4">
          <p class="font-semibold text-gray-900 dark:text-white">${esc(pr.baseNombre)}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">${esc(pr.marca)}</p>
        </td>
        <td class="py-3.5 px-4">
          <span class="font-medium text-[#1c4d37] dark:text-emerald-400">${esc(pr.nombre)}</span>
          <p class="text-xs text-gray-400 dark:text-gray-500">${pr.contiene > 1 ? `Empaque de ${pr.contiene} unidades individuales` : 'Presentación unitaria (1 ud)'}</p>
        </td>
        <td class="py-3.5 px-4 text-center font-semibold text-gray-800 dark:text-gray-200">${fmtNum(pr.paquetes)} ${esc(etiquetaCantidad)}</td>
        <td class="py-3.5 px-4">
          <p class="font-bold text-[#1c4d37] dark:text-emerald-400">${fmtNum(pr.unidadesIndividuales)} uds individuales</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">${esc(explicacionConversion)}</p>
        </td>
        <td class="py-3.5 px-4">${detallePedidos}</td>
        <td class="py-3.5 px-4 text-right font-bold text-gray-900 dark:text-white">${fmtUsd(pr.ingresosUsd)}</td>
      </tr>`;
    }).join('') : '<tr><td colspan="6" class="text-center py-10 text-gray-400 dark:text-gray-500">No hay presentaciones registradas para este filtro.</td></tr>';
  }

  // Gráfico de barras del ranking
  const ctx = $('chartReporteUnidades');
  if (ctx && window.Chart) {
    const dark = document.documentElement.classList.contains('dark');
    Chart.defaults.color = dark ? '#d1d5db' : '#4b5563';
    if (chartReporteRanking) chartReporteRanking.destroy();
    chartReporteRanking = new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: productosFiltrados.map(p => p.baseNombre),
        datasets: [{
          label: 'Unidades Individuales Vendidas',
          data: productosFiltrados.map(p => p.unidadesIndividuales),
          backgroundColor: '#1c4d37',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  if (window.sincronizarGraficasYTextoTema) window.sincronizarGraficasYTextoTema();
  if (window.lucide) lucide.createIcons();
}

function descargarReporteGerenciaCSV(tipo = 'facturas') {
  const filtros = obtenerFiltrosReporteGerencia();
  const ventasCat = filtrarVentasCategorizadas(filtros);
  const rep = calcularReporteProductos(filtros);
  const tasaActual = tasaBCV();

  let encabezados = [];
  let filasCsv = [];
  let nombreArchivo = '';

  if (tipo === 'productos') {
    if (!rep.rankingProductos.length) {
      if (window.mostrarNotificacionSistema) window.mostrarNotificacionSistema('No hay productos en el filtro actual para descargar.');
      return;
    }
    encabezados = ['Posición', 'Producto Base', 'Línea / Marca', 'Unidades Individuales Vendidas', 'Empaques Despachados', 'Total ($ USD)', 'Total (Bs.)'];
    filasCsv = rep.rankingProductos.map((p, idx) => [
      idx + 1,
      p.baseNombre,
      p.marca,
      p.unidadesIndividuales,
      p.paquetesTotales,
      p.ingresosUsd.toFixed(2),
      (p.ingresosUsd * tasaActual).toFixed(2)
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'));
    nombreArchivo = `Reporte_Gerencia_Productos_${fmtFecha(hoyISO)}.csv`;
  } else {
    if (!ventasCat.length) {
      if (window.mostrarNotificacionSistema) window.mostrarNotificacionSistema('No hay facturas ni ventas en el filtro actual para descargar.');
      return;
    }
    encabezados = ['N° Factura', 'N° Pedido', 'Fecha', 'Cliente', 'RIF', 'Municipio', 'Ruta', 'Línea(s)', 'Estado Factura / Venta', 'Total ($ USD)', 'Tasa BCV', 'Total (Bs.)'];
    filasCsv = ventasCat.map(v => {
      const fac = facturas.find(f => f.ventaId === v.id);
      const mun = municipioDeCliente(v.cliente, fac && fac.direccion);
      const rutaCli = rutaDeCliente(v.cliente, v);
      const tasa = (fac && Number(fac.tasa) > 0) ? Number(fac.tasa) : ((Number(v.tasaBcv) > 0) ? Number(v.tasaBcv) : tasaActual);
      const anulada = v.estado === 'Cancelada' || (fac && fac.estado === 'Anulada');
      const est = anulada ? 'Anulada' : (v.estado === 'Completada' ? 'Pagada / Completada' : (fac ? 'Emitida Pendiente Cobro' : 'Sin Facturar'));
      return [
        fac ? fac.numero : 'Sin Facturar',
        v.id,
        fmtFecha(v.fecha),
        v.cliente,
         (fac && fac.rif) || rifDeCliente(v.cliente),
        mun,
        rutaCli,
        lineasDeVentaGerencia(v).join(' / '),
        est,
        (Number(v.total) || 0).toFixed(2),
        tasa.toFixed(2),
        ((Number(v.total) || 0) * tasa).toFixed(2)
      ].map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(';');
    });
    nombreArchivo = `Reporte_Gerencia_Facturas_${fmtFecha(hoyISO)}.csv`;
  }

  const contenido = '\uFEFF' + [encabezados.join(';'), ...filasCsv].join('\r\n');
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (window.mostrarNotificacionSistema) {
    window.mostrarNotificacionSistema(`Reporte categorizado descargado: ${nombreArchivo}`);
  }
}

let _tituloOriginalGerencia = '';
function imprimirReporteGerencia() {
  const filtros = obtenerFiltrosReporteGerencia();
  const ventasCat = filtrarVentasCategorizadas(filtros);
  const rep = calcularReporteProductos(filtros);
  const tasaActual = tasaBCV();
  const zona = $('zonaImpresion');
  if (!zona) {
    window.print();
    return;
  }

  const filasFac = ventasCat.map(v => {
    const fac = facturas.find(f => f.ventaId === v.id);
    const mun = municipioDeCliente(v.cliente, fac && fac.direccion);
    const tasa = (fac && Number(fac.tasa) > 0) ? Number(fac.tasa) : ((Number(v.tasaBcv) > 0) ? Number(v.tasaBcv) : tasaActual);
    const est = (v.estado === 'Cancelada' || (fac && fac.estado === 'Anulada')) ? 'Anulada' : (v.estado === 'Completada' ? 'Pagada' : (fac ? 'Emitida' : 'Sin Facturar'));
    return `
      <tr>
        <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb"><b>${esc(fac ? fac.numero : 'Sin Factura')}</b> (${esc(v.id)})</td>
        <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb">${esc(fmtFecha(v.fecha))}</td>
        <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb">${esc(v.cliente)} · ${esc(mun)} · <b>${esc(rutaDeCliente(v.cliente, v))}</b></td>
        <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb">${esc(lineasDeVentaGerencia(v).join(', '))}</td>
        <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb;text-align:center">${esc(est)}</td>
        <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${fmtUsd(v.total)}</td>
        <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${fmtBs(v.total * tasa)}</td>
      </tr>`;
  }).join('');

  zona.innerHTML = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;font-size:11.5px;line-height:1.4;font-variant-numeric:tabular-nums">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1c4d37;padding-bottom:10px;margin-bottom:12px">
        <div>
          <div style="font-size:17px;font-weight:800;color:#1c4d37">Distribuidora Gentil Supply, C.A. — Módulo de Gerente</div>
          <div style="font-size:12px;font-weight:700;color:#374151;margin-top:2px">Reporte Categorizado de Facturas, Líneas y Productos</div>
          <div style="font-size:10.5px;color:#6b7280">Registros incluidos: ${ventasCat.length} operaciones</div>
        </div>
        <div style="text-align:right;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:7px 12px">
          <div style="font-size:10.5px;color:#4b5563">Fecha: <b>${esc(fmtFecha(hoyISO))}</b></div>
          <div style="font-size:11px;color:#374151">Unidades Vendidas: <b>${fmtNum(rep.totalUnidades)} uds</b></div>
          <div style="font-size:12px;color:#1c4d37">Total ($ USD): <b>${fmtUsd(rep.totalIngresos)}</b></div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f3f4f6;border-top:1px solid #d1d5db;border-bottom:1.5px solid #1c4d37">
            <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:#1c4d37">Factura / Pedido</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:#1c4d37">Fecha</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:#1c4d37">Cliente / Municipio</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:#1c4d37">Línea</th>
            <th style="padding:7px 8px;text-align:center;font-size:10px;text-transform:uppercase;color:#1c4d37">Estado</th>
            <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:#1c4d37">Total ($)</th>
            <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:#1c4d37">Total (Bs.)</th>
          </tr>
        </thead>
        <tbody>${filasFac}</tbody>
      </table>
      <div class="print-footer-preview" style="margin-top:18px;padding-top:8px;border-top:1px solid #d1d5db;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#1c4d37;font-weight:700">
        <span>Página 1/1</span>
        <span style="font-size:10px;font-weight:500;color:#6b7280">Distribuidora Gentil Supply, C.A.</span>
      </div>
    </div>`;
  _tituloOriginalGerencia = document.title;
  document.title = '\u200B';
  window.print();
}

window.addEventListener('afterprint', () => {
  if (_tituloOriginalGerencia) {
    document.title = _tituloOriginalGerencia;
    _tituloOriginalGerencia = '';
  }
  const z = $('zonaImpresion');
  if (z) z.innerHTML = '';
});

function switchTabReporteAdmin(tab) {
  ['facturas', 'productos', 'presentaciones'].forEach(t => {
    const sec = $(`secRepAdmin-${t}`);
    const btn = $(`tabRepAdmin-${t}`);
    if (sec) sec.classList.toggle('hidden', t !== tab);
    if (btn) {
      btn.className = t === tab
        ? 'px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-[#1c4d37] text-white dark:bg-emerald-600 shadow-sm'
        : 'px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
  if ($('gridMunicipiosRastreo') && !$('kpiAdminVentas')) {
    cargarTodo();
    renderRastreoMunicipios();
  }
  renderReportes();
  const refrescarGerencia = () => {
    initAdminDashboard();
    if ($('gridMunicipiosRastreo') && !$('kpiAdminVentas')) {
      cargarTodo();
      renderRastreoMunicipios();
    }
    renderReportes();
  };
  window.addEventListener('storage', refrescarGerencia);
  window.addEventListener('bcv-tasa-actualizada', refrescarGerencia);
});

