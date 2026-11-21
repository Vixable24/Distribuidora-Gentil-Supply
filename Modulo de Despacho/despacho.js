// Lógica compartida del Módulo de Despacho (dashboard.php, despachos.php, inventario.php, incidencias.php)
// Solo frontend: los datos se guardan en localStorage del navegador (listo para conectar a BD más adelante).

const ZONAS = ['La Asunción', 'Porlamar', 'Pampatar', 'San Juan Bautista', 'Juan Griego', 'Santa Ana', 'El Valle del Espíritu Santo', 'Boca de Río'];

const CONDUCTORES = [
  { n: 'José Rodríguez', v: 'Camión NPR · AB123CD' },
  { n: 'Luis Marcano', v: 'Camión 350 · AC456EF' },
  { n: 'Carlos Salazar', v: 'Furgón Kia · AD789GH' },
  { n: 'Pedro Millán', v: 'Pickup Hilux · AE012IJ' }
];

const MOTIVOS = {
  cliente: ['Cliente ausente / local cerrado', 'Rechazo de mercancía', 'Dirección incorrecta', 'Problema de pago / crédito', 'Falta de personal para descarga'],
  transporte: ['Avería del vehículo', 'Falta de combustible', 'Accidente vial', 'Retraso por tráfico / vía bloqueada', 'Conductor no disponible']
};

const ALERTAS = {
  cliente: {
    clase: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300',
    icono: 'user-x',
    txt: 'Incidencia con el cliente: contactar al vendedor responsable, reprogramar la entrega y retener la mercancía en depósito. Si hubo rechazo, generar nota de devolución al inventario.'
  },
  transporte: {
    clase: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
    icono: 'truck',
    txt: 'Incidencia de transporte: notificar al supervisor de flota, asignar vehículo/conductor de relevo y resguardar la carga. Si hay accidente o daños, levantar reporte para el seguro.'
  }
};

const ESTADO_CLS = {
  'En Preparación': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Completo': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Con Incidencia': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

// ======================================================================
// CATÁLOGO DE PRODUCTOS (Mismo modelo del Módulo de Ventas)
// ======================================================================
const catalogoProductosDespacho = {
  muchy: {
    nombre: 'Muchy',
    presentaciones: {
      unidad: {
        nombre: 'Unidades',
        productos: [
          { id: 'muchy-u-med', baseId: 'muchy-med', baseNombre: 'Muchy Mediano', tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Muchy Mediano (Unidad)', contiene: 1, precio: 0.60, stockInicial: 120, stockMin: 30, ubicacion: 'Pasillo A · Estante 1' },
          { id: 'muchy-u-xl',  baseId: 'muchy-xl',  baseNombre: 'Muchy XL',      tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Muchy XL (Unidad)',      contiene: 1, precio: 1.00, stockInicial: 95,  stockMin: 25, ubicacion: 'Pasillo A · Estante 1' }
        ]
      },
      manga: {
        nombre: 'Mangas',
        productos: [
          { id: 'muchy-manga-peq', baseId: 'muchy-peq', baseNombre: 'Muchy Pequeño', tipo: 'Manga', plural: 'Mangas', nombre: 'Manga Muchy Pequeño', contiene: 12, precio: 5.00, stockInicial: 45, stockMin: 12, ubicacion: 'Pasillo A · Estante 2' }
        ]
      },
      caja: {
        nombre: 'Cajas',
        productos: [
          { id: 'muchy-caja-med', baseId: 'muchy-med', baseNombre: 'Muchy Mediano', tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Muchy Mediano', contiene: 20, precio: 11.00, stockInicial: 60, stockMin: 15, ubicacion: 'Pasillo A · Estante 3' },
          { id: 'muchy-caja-xl',  baseId: 'muchy-xl',  baseNombre: 'Muchy XL',      tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Muchy XL',      contiene: 10, precio: 9.00,  stockInicial: 38, stockMin: 10, ubicacion: 'Pasillo A · Estante 3' }
        ]
      }
    }
  },
  puig: {
    nombre: 'Galleterías PUIG',
    presentaciones: {
      unidad: {
        nombre: 'Unidades',
        productos: [
          { id: 'puig-u-maria', baseId: 'puig-maria', baseNombre: 'Galletas María Delicia', tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'María Delicia (Unidad)', contiene: 1, precio: 0.50, stockInicial: 150, stockMin: 40, ubicacion: 'Pasillo B · Estante 1' },
          { id: 'puig-u-katy',  baseId: 'puig-katy',  baseNombre: 'Galletas Katy',          tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Katy (Unidad)',          contiene: 1, precio: 0.80, stockInicial: 110, stockMin: 30, ubicacion: 'Pasillo B · Estante 1' }
        ]
      },
      caja: {
        nombre: 'Cajas (24 unidades)',
        productos: [
          { id: 'puig-caja-maria', baseId: 'puig-maria', baseNombre: 'Galletas María Delicia', tipo: 'Caja', plural: 'Cajas', nombre: 'Caja María Delicia', contiene: 24, precio: 11.00, stockInicial: 52, stockMin: 15, ubicacion: 'Pasillo B · Estante 2' },
          { id: 'puig-caja-katy',  baseId: 'puig-katy',  baseNombre: 'Galletas Katy',          tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Katy',          contiene: 24, precio: 18.00, stockInicial: 40, stockMin: 12, ubicacion: 'Pasillo B · Estante 2' }
        ]
      },
      display: {
        nombre: 'Displays',
        productos: [
          { id: 'puig-disp-maria', baseId: 'puig-maria', baseNombre: 'Galletas María Delicia', tipo: 'Display', plural: 'Displays pequeños', nombre: 'Display María Delicia (pequeño)', contiene: 18, precio: 8.50,  stockInicial: 28, stockMin: 10, ubicacion: 'Pasillo B · Estante 3' },
          { id: 'puig-disp-katy',  baseId: 'puig-katy',  baseNombre: 'Galletas Katy',          tipo: 'Display', plural: 'Displays grandes',  nombre: 'Display Katy (grande)',           contiene: 24, precio: 18.00, stockInicial: 8,  stockMin: 10, ubicacion: 'Pasillo B · Estante 3' }
        ]
      }
    }
  },
  fisa: {
    nombre: 'Fisa',
    presentaciones: {
      unidad: {
        nombre: 'Unidades',
        productos: [
          { id: 'fisa-u-crema-20',  baseId: 'fisa-crema-20',   baseNombre: 'Crema para el Cuerpo 20 ml',     tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Crema para el Cuerpo 20 ml (Unidad)',    contiene: 1, precio: 0.80, stockInicial: 85,  stockMin: 20, ubicacion: 'Pasillo C · Estante 1' },
          { id: 'fisa-u-crema-365', baseId: 'fisa-crema-365',  baseNombre: 'Crema para el Cuerpo 365 ml',    tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Crema para el Cuerpo 365 ml (Unidad)',   contiene: 1, precio: 3.50, stockInicial: 42,  stockMin: 12, ubicacion: 'Pasillo C · Estante 1' },
          { id: 'fisa-u-crema-800', baseId: 'fisa-crema-800',  baseNombre: 'Crema para el Cuerpo 800 ml',    tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Crema para el Cuerpo 800 ml (Unidad)',   contiene: 1, precio: 6.50, stockInicial: 25,  stockMin: 8,  ubicacion: 'Pasillo C · Estante 1' },
          { id: 'fisa-u-jabon',     baseId: 'fisa-jabon',      baseNombre: 'Jabón de Baño Every Night',      tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Jabón de Baño Every Night (Unidad)',     contiene: 1, precio: 1.00, stockInicial: 140, stockMin: 36, ubicacion: 'Pasillo C · Estante 2' },
          { id: 'fisa-u-deo-60',    baseId: 'fisa-deo-60',     baseNombre: 'Desodorante Every Night 60 g',   tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Desodorante Every Night 60 g (Unidad)',  contiene: 1, precio: 2.00, stockInicial: 64,  stockMin: 18, ubicacion: 'Pasillo C · Estante 2' },
          { id: 'fisa-u-deo-90',    baseId: 'fisa-deo-90',     baseNombre: 'Desodorante Every Night 90 g',   tipo: 'Unidad', plural: 'Unidades sueltas', nombre: 'Desodorante Every Night 90 g (Unidad)',  contiene: 1, precio: 2.80, stockInicial: 50,  stockMin: 15, ubicacion: 'Pasillo C · Estante 2' },
          { id: 'fisa-u-deo-sachet',baseId: 'fisa-deo-sachet', baseNombre: 'Desodorante Every Night Sachet', tipo: 'Sobre',  plural: 'Sobres sueltos',   nombre: 'Desodorante Every Night Sachet (Sobre)', contiene: 1, precio: 0.30, stockInicial: 180, stockMin: 48, ubicacion: 'Pasillo C · Estante 3' }
        ]
      },
      caja: {
        nombre: 'Cajas',
        productos: [
          { id: 'fisa-caja-crema-20',  baseId: 'fisa-crema-20',  baseNombre: 'Crema para el Cuerpo 20 ml',   tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Crema para el Cuerpo 20 ml (12 und)',  contiene: 12, precio: 9.00,  stockInicial: 30, stockMin: 8,  ubicacion: 'Pasillo C · Estante 4' },
          { id: 'fisa-caja-crema-365', baseId: 'fisa-crema-365', baseNombre: 'Crema para el Cuerpo 365 ml',  tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Crema para el Cuerpo 365 ml (12 und)', contiene: 12, precio: 40.00, stockInicial: 18, stockMin: 6,  ubicacion: 'Pasillo C · Estante 4' },
          { id: 'fisa-caja-crema-800', baseId: 'fisa-crema-800', baseNombre: 'Crema para el Cuerpo 800 ml',  tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Crema para el Cuerpo 800 ml (12 und)', contiene: 12, precio: 75.00, stockInicial: 4,  stockMin: 5,  ubicacion: 'Pasillo C · Estante 4' },
          { id: 'fisa-caja-jabon',     baseId: 'fisa-jabon',     baseNombre: 'Jabón de Baño Every Night',    tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Jabón de Baño Every Night (36 und)',   contiene: 36, precio: 32.00, stockInicial: 26, stockMin: 8,  ubicacion: 'Pasillo C · Estante 5' },
          { id: 'fisa-caja-deo-60',    baseId: 'fisa-deo-60',    baseNombre: 'Desodorante Every Night 60 g', tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Desodorante Every Night 60 g (12 und)', contiene: 12, precio: 22.00, stockInicial: 22, stockMin: 6,  ubicacion: 'Pasillo C · Estante 5' },
          { id: 'fisa-caja-deo-90',    baseId: 'fisa-deo-90',    baseNombre: 'Desodorante Every Night 90 g', tipo: 'Caja', plural: 'Cajas', nombre: 'Caja Desodorante Every Night 90 g (12 und)', contiene: 12, precio: 31.00, stockInicial: 7,  stockMin: 8,  ubicacion: 'Pasillo C · Estante 5' }
        ]
      },
      sachet: {
        nombre: 'Sachet (ristra de 12 sobres)',
        productos: [
          { id: 'fisa-ristra-deo', baseId: 'fisa-deo-sachet', baseNombre: 'Desodorante Every Night Sachet', tipo: 'Ristra', plural: 'Ristras', nombre: 'Ristra Desodorante Every Night Sachet', contiene: 12, precio: 3.20, stockInicial: 55, stockMin: 15, ubicacion: 'Pasillo C · Estante 3' }
        ]
      }
    }
  }
};

const hoy = new Date().toISOString().slice(0, 10);
const STORAGE_KEY = 'gs_despachos_v1';
const INVENTARIO_KEY = 'gs_inventario_v1';
const MOVIMIENTOS_INV_KEY = 'gs_movimientos_inv_v1';
const VENTAS_KEY = 'gs_ventas_v2';
const FACTURAS_KEY = 'gs_facturas_v1';
const CLIENTES_KEY = 'gs_clientes_v1';

function asegurarDatosCompartidosDespacho() {
  try {
    let ventas = JSON.parse(localStorage.getItem(VENTAS_KEY));
    if (!Array.isArray(ventas) || !ventas.length) {
      ventas = [
        { id: 'V-001', cliente: 'Supermercado Central', fecha: '2026-04-10', estado: 'Completada', credito: '0', estadoDespacho: 'Sin estado', items: [{ id: 'muchy-caja-med', nombre: 'Caja Muchy Mediano', cantidad: 40, contiene: 20, precio: 11.00 }, { id: 'puig-caja-katy', nombre: 'Caja Katy', cantidad: 20, contiene: 24, precio: 18.00 }, { id: 'fisa-caja-jabon', nombre: 'Caja Jabón de Baño Every Night (36 und)', cantidad: 5, contiene: 36, precio: 32.00 }], total: 960 },
        { id: 'V-002', cliente: 'Tienda El Ahorro', fecha: '2026-04-09', estado: 'Pendiente', credito: '15', estadoDespacho: '', items: [{ id: 'puig-disp-maria', nombre: 'Display María Delicia (pequeño)', cantidad: 30, contiene: 18, precio: 8.50 }, { id: 'fisa-caja-crema-365', nombre: 'Caja Crema para el Cuerpo 365 ml (12 und)', cantidad: 4, contiene: 12, precio: 40.00 }], total: 415 },
        { id: 'V-003', cliente: 'Minimarket Express', fecha: '2026-04-08', estado: 'Completada', credito: '0', estadoDespacho: 'En Preparación', items: [{ id: 'muchy-manga-peq', nombre: 'Manga Muchy Pequeño', cantidad: 50, contiene: 12, precio: 5.00 }, { id: 'fisa-ristra-deo', nombre: 'Ristra Desodorante Every Night Sachet', cantidad: 40, contiene: 12, precio: 3.20 }, { id: 'puig-caja-maria', nombre: 'Caja María Delicia', cantidad: 10, contiene: 24, precio: 11.00 }], total: 488 },
        { id: 'V-004', cliente: 'Bodega San José', fecha: '2026-04-08', estado: 'Completada', credito: '21+', estadoDespacho: 'Completo', items: [{ id: 'muchy-caja-xl', nombre: 'Caja Muchy XL', cantidad: 25, contiene: 10, precio: 9.00 }, { id: 'fisa-caja-deo-60', nombre: 'Caja Desodorante Every Night 60 g (12 und)', cantidad: 6, contiene: 12, precio: 22.00 }], total: 357 },
        { id: 'V-005', cliente: 'Comercial López', fecha: '2026-04-07', estado: 'Cancelada', credito: '15', anulacion: { motivo: 'El cliente canceló el pedido antes del despacho.', fecha: '2026-04-07' }, items: [{ id: 'puig-caja-katy', nombre: 'Caja Katy', cantidad: 15, contiene: 24, precio: 18.00 }, { id: 'muchy-caja-med', nombre: 'Caja Muchy Mediano', cantidad: 20, contiene: 20, precio: 11.00 }], total: 490 },
        { id: 'V-006', cliente: 'Restaurant El Faro', fecha: '2026-04-08', estado: 'Completada', credito: '0', estadoDespacho: 'Completo', items: [{ id: 'fisa-caja-jabon', nombre: 'Caja Jabón de Baño Every Night (36 und)', cantidad: 10, contiene: 36, precio: 32.00 }, { id: 'puig-disp-maria', nombre: 'Display María Delicia (pequeño)', cantidad: 5, contiene: 18, precio: 8.50 }], total: 362.5 },
        { id: 'V-007', cliente: 'Supermercado Juan Griego', fecha: '2026-04-08', estado: 'Completada', credito: '7', estadoDespacho: 'Con Incidencia', items: [{ id: 'muchy-caja-xl', nombre: 'Caja Muchy XL', cantidad: 25, contiene: 10, precio: 9.00 }, { id: 'fisa-ristra-deo', nombre: 'Ristra Desodorante Every Night Sachet', cantidad: 20, contiene: 12, precio: 3.20 }], total: 289 }
      ];
      localStorage.setItem(VENTAS_KEY, JSON.stringify(ventas));
    }
    let clientes = JSON.parse(localStorage.getItem(CLIENTES_KEY));
    if (!Array.isArray(clientes) || !clientes.length) {
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
      localStorage.setItem(CLIENTES_KEY, JSON.stringify(clientes));
    }
    let facturas = JSON.parse(localStorage.getItem(FACTURAS_KEY));
    if (!Array.isArray(facturas) || !facturas.length) {
      const tasa = parseFloat(localStorage.getItem('gs_tasa_bcv')) || 60.50;
      const baseVentas = ventas.filter(v => v.estado === 'Completada');
      facturas = baseVentas.map((v, idx) => {
        const corr = idx + 1;
        const total = Math.round((v.items || []).reduce((t, i) => t + i.precio * i.cantidad, 0) * 100) / 100;
        const base = Math.round((total / 1.16) * 100) / 100;
        const cli = clientes.find(c => c.nombre === v.cliente) || {};
        return {
          correlativo: corr,
          numero: 'FAC-' + String(corr).padStart(6, '0'),
          control: '00-' + String(corr).padStart(6, '0'),
          ventaId: v.id,
          cliente: v.cliente,
          rif: cli.rif || 'J312345678',
          direccion: cli.direccion || cli.zona || 'Nueva Esparta',
          fecha: v.fecha || hoy,
          credito: v.credito || '0',
          tasa,
          items: (v.items || []).map(i => ({ id: i.id, nombre: i.nombre, cantidad: i.cantidad, contiene: i.contiene, precio: i.precio })),
          base,
          iva: Math.round((total - base) * 100) / 100,
          total,
          estadoDespacho: v.estadoDespacho || ''
        };
      });
      localStorage.setItem(FACTURAS_KEY, JSON.stringify(facturas));
    }
  } catch (e) {}
}
asegurarDatosCompartidosDespacho();

const ordenesIniciales = [
  {
    id: 'GS-00101',
    facturaNumero: 'FAC-000002',
    ventaId: 'V-003',
    cliente: 'Minimarket Express',
    rif: 'J317788990',
    cond: 0,
    zona: 'Maneiro',
    fecha: hoy,
    estado: 'En Preparación',
    items: '50 Manga Muchy Pequeño (600 uds), 40 Ristra Desodorante Every Night Sachet (480 uds), 10 Caja María Delicia (240 uds)',
    lineasInv: [
      { id: 'muchy-manga-peq', nombre: 'Manga Muchy Pequeño', cantidad: 50, contiene: 12 },
      { id: 'fisa-ristra-deo', nombre: 'Ristra Desodorante Every Night Sachet', cantidad: 40, contiene: 12 },
      { id: 'puig-caja-maria', nombre: 'Caja María Delicia', cantidad: 10, contiene: 24 }
    ],
    stockDescontado: false
  },
  {
    id: 'GS-00102',
    facturaNumero: 'FAC-000003',
    ventaId: 'V-004',
    cliente: 'Bodega San José',
    rif: 'J289900112',
    cond: 1,
    zona: 'Díaz',
    fecha: hoy,
    estado: 'Completo',
    items: '25 Caja Muchy XL (250 uds), 6 Caja Desodorante Every Night 60 g (72 uds)',
    lineasInv: [
      { id: 'muchy-caja-xl', nombre: 'Caja Muchy XL', cantidad: 25, contiene: 10 },
      { id: 'fisa-caja-deo-60', nombre: 'Caja Desodorante Every Night 60 g (12 und)', cantidad: 6, contiene: 12 }
    ],
    stockDescontado: true
  },
  {
    id: 'GS-00103',
    facturaNumero: 'FAC-000004',
    ventaId: 'V-006',
    cliente: 'Restaurant El Faro',
    rif: 'J401258770',
    cond: 2,
    zona: 'Maneiro',
    fecha: hoy,
    estado: 'Completo',
    items: '10 Caja Jabón de Baño Every Night (360 uds), 5 Display María Delicia (90 uds)',
    lineasInv: [
      { id: 'fisa-caja-jabon', nombre: 'Caja Jabón de Baño Every Night (36 und)', cantidad: 10, contiene: 36 },
      { id: 'puig-disp-maria', nombre: 'Display María Delicia (pequeño)', cantidad: 5, contiene: 18 }
    ],
    stockDescontado: true
  },
  {
    id: 'GS-00104',
    facturaNumero: 'FAC-000005',
    ventaId: 'V-007',
    cliente: 'Supermercado Juan Griego',
    rif: 'J315500981',
    cond: 3,
    zona: 'Marcano',
    fecha: hoy,
    estado: 'Con Incidencia',
    items: '25 Caja Muchy XL (250 uds), 20 Ristra Desodorante Every Night Sachet (240 uds)',
    lineasInv: [
      { id: 'muchy-caja-xl', nombre: 'Caja Muchy XL', cantidad: 25, contiene: 10 },
      { id: 'fisa-ristra-deo', nombre: 'Ristra Desodorante Every Night Sachet', cantidad: 20, contiene: 12 }
    ],
    incidencia: { tipo: 'transporte', motivo: 'Avería del vehículo', desc: 'Falla de caja en la vía a Juan Griego.', fecha: hoy, resuelta: false }
  }
];

// Construye el inventario inicial a partir del catálogo maestro de productos
function construirInventarioInicial() {
  const lista = [];
  Object.entries(catalogoProductosDespacho).forEach(([marcaKey, marca]) => {
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

function construirMovimientosIniciales() {
  return [
    {
      id: 'MOV-001',
      fecha: hoy,
      tipo: 'entrada',
      referencia: 'Recepción Planta #401',
      observacion: 'Abastecimiento inicial de almacén central (Muchy y PUIG)',
      items: [
        { id: 'muchy-caja-med', nombre: 'Caja Muchy Mediano', cantidad: 40, contiene: 20 },
        { id: 'puig-caja-maria', nombre: 'Caja María Delicia', cantidad: 30, contiene: 24 }
      ]
    },
    {
      id: 'MOV-002',
      fecha: hoy,
      tipo: 'salida',
      referencia: 'Guía GS-00103 · Restaurant El Faro',
      observacion: 'Salida autorizada a ruta Pampatar',
      items: [
        { id: 'fisa-caja-jabon', nombre: 'Caja Jabón de Baño Every Night (36 und)', cantidad: 10, contiene: 36 },
        { id: 'puig-disp-maria', nombre: 'Display María Delicia (pequeño)', cantidad: 5, contiene: 18 }
      ]
    },
    {
      id: 'MOV-003',
      fecha: hoy,
      tipo: 'entrada',
      referencia: 'Recepción Fisa #119',
      observacion: 'Ingreso de línea de cuidado personal Every Night',
      items: [
        { id: 'fisa-ristra-deo', nombre: 'Ristra Desodorante Every Night Sachet', cantidad: 35, contiene: 12 },
        { id: 'fisa-caja-crema-365', nombre: 'Caja Crema para el Cuerpo 365 ml (12 und)', cantidad: 12, contiene: 12 }
      ]
    }
  ];
}

let ordenes = cargarOrdenes();
let inventarioData = cargarInventario();
let movimientosInv = cargarMovimientosInv();
let incidenciaActual = null;
let itemsGuiaTemporal = [];

function normalizarEstadoOrdenDespacho(est) {
  if (est === 'Pendiente' || est === 'En Proceso') return 'En Preparación';
  if (est === 'Despachado') return 'Completo';
  if (est === 'En Preparación' || est === 'Completo' || est === 'Con Incidencia') return est;
  return 'En Preparación';
}

function cargarOrdenes() {
  try {
    const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(guardado) && guardado.length) {
      return guardado.map((o, idx) => Object.assign({}, o, {
        estado: normalizarEstadoOrdenDespacho(o.estado),
        facturaNumero: o.facturaNumero
          ? (typeof window.normalizarNumeroFacturaFAC === 'function' ? window.normalizarNumeroFacturaFAC(o.facturaNumero, idx + 1) : o.facturaNumero)
          : o.facturaNumero
      }));
    }
  } catch (e) { /* datos corruptos: se reinician */ }
  const inic = JSON.parse(JSON.stringify(ordenesIniciales));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inic));
  return inic;
}

function sincronizarEstadoDespachoConVentaYFactura(orden, nuevoEstado) {
  if (!orden) return;
  orden.estado = nuevoEstado;
  try {
    const facturas = JSON.parse(localStorage.getItem(FACTURAS_KEY));
    if (Array.isArray(facturas)) {
      facturas.forEach(f => {
        if ((orden.facturaNumero && f.numero === orden.facturaNumero) || (orden.ventaId && f.ventaId === orden.ventaId)) {
          f.estadoDespacho = nuevoEstado;
        }
      });
      localStorage.setItem(FACTURAS_KEY, JSON.stringify(facturas));
    }
  } catch (e) {}
  try {
    const ventas = JSON.parse(localStorage.getItem(VENTAS_KEY));
    if (Array.isArray(ventas)) {
      ventas.forEach(v => {
        if (orden.ventaId && v.id === orden.ventaId) {
          v.estadoDespacho = nuevoEstado;
        }
      });
      localStorage.setItem(VENTAS_KEY, JSON.stringify(ventas));
    }
  } catch (e) {}
}

function guardarOrdenes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenes));
}

function cargarInventario() {
  const base = construirInventarioInicial();
  try {
    const guardado = JSON.parse(localStorage.getItem(INVENTARIO_KEY));
    if (Array.isArray(guardado) && guardado.length) {
      // Sincronizar con el catálogo por si se agregaron metadatos nuevos
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

function guardarInventario() {
  localStorage.setItem(INVENTARIO_KEY, JSON.stringify(inventarioData));
}

function cargarMovimientosInv() {
  try {
    const guardado = JSON.parse(localStorage.getItem(MOVIMIENTOS_INV_KEY));
    if (Array.isArray(guardado) && guardado.length) return guardado;
  } catch (e) { /* usar semilla */ }
  const inicial = construirMovimientosIniciales();
  localStorage.setItem(MOVIMIENTOS_INV_KEY, JSON.stringify(inicial));
  return inicial;
}

function guardarMovimientosInv() {
  localStorage.setItem(MOVIMIENTOS_INV_KEY, JSON.stringify(movimientosInv));
}

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtNum = n => new Intl.NumberFormat('es-VE').format(n);
const fmtUsd = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const contar = e => ordenes.filter(o => o.estado === e).length;
const badge = e => `<span class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${ESTADO_CLS[e]}">${e}</span>`;

function buscarItemInventario(id) {
  return inventarioData.find(x => x.id === id) || null;
}

// --- Utilidades de UI ---
function openModal(id) {
  const m = $(id);
  if (!m) return;
  m.classList.remove('hidden');
  m.classList.add('flex');
  requestAnimationFrame(() => m.classList.remove('opacity-0'));
}

function closeModal(id) {
  const m = $(id);
  if (!m) return;
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

// --- Estadísticas (dashboard y despachos) ---
function renderStats() {
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set('statPend', contar('En Preparación'));
  set('statRuta', contar('Completo'));
  set('statInc', contar('Con Incidencia'));
  set('statTotal', ordenes.length);
}

function actualizarIconosOrdenDespacho(prefijo, campos, estadoOrden) {
  campos.forEach(c => {
    const span = $(`${prefijo}-${c}`);
    if (!span) return;
    if (estadoOrden.campo === c) {
      span.innerHTML = `<i data-lucide="${estadoOrden.dir === 'asc' ? 'arrow-up' : 'arrow-down'}" class="w-3.5 h-3.5 opacity-100"></i>`;
    } else {
      span.innerHTML = `<i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i>`;
    }
  });
}

// ======================================================================
// ÓRDENES DE DESPACHO (despachos.php)
// ======================================================================
let vistaActual = localStorage.getItem('gs_vista_despacho') || 'tabla';
let ordenDespachos = { campo: 'id', dir: 'desc' };

function ordenarDespachosPor(campo) {
  if (ordenDespachos.campo === campo) {
    ordenDespachos.dir = ordenDespachos.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenDespachos.campo = campo;
    ordenDespachos.dir = (campo === 'cliente' || campo === 'conductor' || campo === 'zona' || campo === 'estado') ? 'asc' : 'desc';
  }
  renderOrdenes();
}

function setVista(v) {
  vistaActual = v;
  const k = v === 'kanban';
  $('kanban').classList.toggle('hidden', !k);
  $('kanban').classList.toggle('grid', k);
  $('tablaWrap').classList.toggle('hidden', k);
  const on = 'bg-[#1c4d37] text-white dark:bg-emerald-600';
  const off = 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
  $('btnKanban').className = 'px-4 py-2.5 text-sm font-medium transition-colors ' + (k ? on : off);
  $('btnTabla').className = 'px-4 py-2.5 text-sm font-medium transition-colors ' + (k ? off : on);
  localStorage.setItem('gs_vista_despacho', v);
}

function filtrarOrdenes() {
  const q = $('search') ? $('search').value.trim().toLowerCase() : '';
  const est = $('filterEstado') ? $('filterEstado').value : '';
  const filtrada = ordenes.filter(o => (!est || o.estado === est) && (!q || (o.cliente + ' ' + o.rif + ' ' + o.id + ' ' + (o.facturaNumero || '') + ' ' + (o.ventaId || '')).toLowerCase().includes(q)));
  const mult = ordenDespachos.dir === 'asc' ? 1 : -1;
  return [...filtrada].sort((a, b) => {
    const ca = (CONDUCTORES[a.cond] && CONDUCTORES[a.cond].n) || '';
    const cb = (CONDUCTORES[b.cond] && CONDUCTORES[b.cond].n) || '';
    switch (ordenDespachos.campo) {
      case 'id': return String(a.id || '').localeCompare(String(b.id || '')) * mult;
      case 'cliente': return String(a.cliente || '').localeCompare(String(b.cliente || ''), 'es') * mult;
      case 'conductor': return ca.localeCompare(cb, 'es') * mult;
      case 'zona': return String(a.zona || '').localeCompare(String(b.zona || ''), 'es') * mult;
      case 'fecha': return String(a.fecha || '').localeCompare(String(b.fecha || '')) * mult;
      case 'estado': return String(a.estado || '').localeCompare(String(b.estado || ''), 'es') * mult;
      default: return 0;
    }
  });
}

function btnAccion(color, icono, titulo, onclick, deshabilitado) {
  const cls = deshabilitado ? 'opacity-40 cursor-not-allowed' : '';
  return `<button ${deshabilitado ? 'disabled' : ''} onclick="${onclick}" title="${titulo}" class="p-2 rounded-lg transition-colors ${color} ${cls}"><i data-lucide="${icono}" class="w-4 h-4"></i></button>`;
}

function irASalidaInventarioDeOrden(id) {
  window.location.href = `inventario.php?orden=${encodeURIComponent(id)}`;
}

function rutaDeClienteDesp(nombre) {
  try {
    const cli = (JSON.parse(localStorage.getItem(CLIENTES_KEY)) || []).find(c => c.nombre === nombre);
    if (cli && cli.ruta) return cli.ruta;
  } catch (e) {}
  if (window.CLIENTES_RUTA_DEFAULT_MAP && window.CLIENTES_RUTA_DEFAULT_MAP[nombre]) return window.CLIENTES_RUTA_DEFAULT_MAP[nombre];
  return 'Ruta 2';
}

function renderOrdenes() {
  if (!$('tbody')) return;
  const lista = filtrarOrdenes();
  actualizarIconosOrdenDespacho('sortIconDesp', ['id', 'cliente', 'conductor', 'zona', 'fecha', 'estado'], ordenDespachos);

  $('tbody').innerHTML = lista.map(o => {
    const c = CONDUCTORES[o.cond] || CONDUCTORES[0];
    const rutaCli = o.ruta || rutaDeClienteDesp(o.cliente);
    const subFac = o.facturaNumero ? `<p class="text-xs font-mono text-gray-500 dark:text-gray-400">${esc(o.facturaNumero)}${o.ventaId ? ' · ' + esc(o.ventaId) : ''}</p>` : '';
    return `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
      <td class="px-6 py-4"><p class="font-semibold text-[#1c4d37] dark:text-emerald-400">${esc(o.id)}</p>${subFac}</td>
      <td class="px-6 py-4"><p class="font-medium text-gray-800 dark:text-gray-100">${esc(o.cliente)}</p><p class="text-xs text-gray-500 dark:text-gray-400 font-mono">${esc(o.rif)} · <span class="font-sans font-bold text-[#1c4d37] dark:text-emerald-400">${esc(rutaCli)}</span></p></td>
      <td class="px-6 py-4"><p class="text-gray-800 dark:text-gray-100">${esc(c.n)}</p><p class="text-xs text-gray-500 dark:text-gray-400">${esc(c.v)}</p></td>
      <td class="px-6 py-4 text-gray-700 dark:text-gray-300">${esc(o.zona)}</td>
      <td class="px-6 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap font-mono text-xs">${esc(o.fecha)}</td>
      <td class="px-6 py-4">${badge(o.estado)}</td>
      <td class="px-6 py-4"><div class="flex justify-center gap-1">
        <a href="incidencias.php" title="Gestionar Estado de Despacho" class="p-2 rounded-lg transition-colors bg-emerald-50 text-[#1c4d37] hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/60"><i data-lucide="clipboard-check" class="w-4 h-4"></i></a>
        ${btnAccion('bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600', 'printer', 'Imprimir / Ver Nota de Entrega', `verDetalle('${o.id}')`, false)}
      </div></td></tr>`;
  }).join('');
  $('empty').classList.toggle('hidden', lista.length > 0);

  $('kanban').innerHTML = Object.keys(ESTADO_CLS).map(e => {
    const col = lista.filter(o => o.estado === e);
    const tarjetas = col.map(o => `<button onclick="verDetalle('${o.id}')" class="w-full text-left p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-[#1c4d37] dark:hover:border-emerald-400 transition-colors">
        <p class="font-semibold text-sm text-[#1c4d37] dark:text-emerald-400">${esc(o.id)} ${o.facturaNumero ? `<span class="text-xs font-mono text-gray-400">· ${esc(o.facturaNumero)}</span>` : ''}</p>
        <p class="text-sm text-gray-800 dark:text-gray-100">${esc(o.cliente)}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${esc(o.zona)} · <span class="font-semibold text-[#1c4d37] dark:text-emerald-400">${esc(o.ruta || rutaDeClienteDesp(o.cliente))}</span> · ${esc((CONDUCTORES[o.cond] || CONDUCTORES[0]).n)}</p></button>`).join('');
    return `<div class="bg-gray-50/80 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-200/80 dark:border-gray-700">
      <div class="flex justify-between items-center mb-3">${badge(e)}<span class="text-xs text-gray-500 dark:text-gray-400">${col.length}</span></div>
      <div class="space-y-2">${tarjetas || '<p class="text-xs text-gray-400 dark:text-gray-500 text-center py-6">Sin órdenes</p>'}</div></div>`;
  }).join('');

  renderStats();
  lucide.createIcons();
}

function autorizar(id) {
  const orden = ordenes.find(x => x.id === id);
  if (!orden) return;
  if (orden.estado === 'Pendiente') {
    toast(`La orden ${id} está en Paso 1 (Pendiente). Registra primero su Orden de Salida en Inventario para pasarla a En Proceso.`);
    return;
  }

  const ejecutarDespacho = () => {
    sincronizarEstadoDespachoConVentaYFactura(orden, 'Despachado');

    // Si la orden tiene productos del inventario asociados y aún no se descontaron, descontarlos al despachar
    if (Array.isArray(orden.lineasInv) && orden.lineasInv.length && !orden.stockDescontado) {
      orden.lineasInv.forEach(linea => {
        const itemInv = buscarItemInventario(linea.id);
        if (itemInv) {
          itemInv.stock = Math.max(0, itemInv.stock - linea.cantidad);
        }
      });
      orden.stockDescontado = true;
      movimientosInv.unshift({
        id: siguienteIdMov(),
        fecha: hoy,
        tipo: 'salida',
        referencia: `Guía ${orden.id}${orden.facturaNumero ? ' · ' + orden.facturaNumero : ''} · ${orden.cliente}`,
        observacion: `Salida al concluir despacho a ${orden.zona}`,
        items: orden.lineasInv
      });
      guardarInventario();
      guardarMovimientosInv();
    }

    guardarOrdenes();
    renderOrdenes();
    toast(`Orden ${id} concluida en estado Despachado (reflejado en Ventas y Facturación).`);
  };

  if (typeof window.confirmarAccionSistema === 'function') {
    window.confirmarAccionSistema({
      titulo: 'Confirmar Conclusión de Despacho',
      mensaje: `¿Confirmas que la guía ${orden.id} (${orden.facturaNumero || 'Sin factura'}) ha concluido su proceso y pasa a estado Despachado?`,
      icono: 'truck',
      textoConfirmar: 'Marcar como Despachado',
      detalleHtml: `
        <div class="flex justify-between"><span class="text-gray-500">Guía / Factura:</span><span class="font-bold text-[#1c4d37] dark:text-emerald-400">${esc(orden.id)}${orden.facturaNumero ? ' · ' + esc(orden.facturaNumero) : ''}</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Cliente:</span><span class="font-semibold">${esc(orden.cliente)} (${esc(orden.rif)})</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Destino:</span><span class="font-medium">${esc(orden.zona)}</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Nuevo Estado (Paso 3):</span><span class="font-bold text-emerald-600">Despachado (Reflejado en Ventas)</span></div>
      `,
      onConfirm: ejecutarDespacho
    });
  } else {
    ejecutarDespacho();
  }
}

function abrirIncidencia(id) {
  incidenciaActual = id;
  $('incOrden').textContent = id;
  $('incDesc').value = '';
  document.querySelector('input[name=incTipo][value=cliente]').checked = true;
  renderAlertaInc();
  openModal('modalInc');
}

function renderAlertaInc() {
  const t = document.querySelector('input[name=incTipo]:checked').value;
  $('incMotivo').innerHTML = MOTIVOS[t].map(m => `<option>${m}</option>`).join('');
  const a = ALERTAS[t];
  $('incAlerta').innerHTML = `<div class="p-3 rounded-lg text-sm border flex gap-3 ${a.clase}"><i data-lucide="${a.icono}" class="w-5 h-5 flex-shrink-0"></i><p>${a.txt}</p></div>`;
  lucide.createIcons();
}

function guardarIncidencia(e) {
  e.preventDefault();
  ordenes = cargarOrdenes();
  const o = ordenes.find(x => x.id === incidenciaActual);
  if (!o) return;
  o.incidencia = {
    tipo: document.querySelector('input[name=incTipo]:checked').value,
    motivo: $('incMotivo').value,
    desc: $('incDesc').value.trim(),
    fecha: hoy,
    resuelta: false
  };
  sincronizarEstadoDespachoConVentaYFactura(o, 'Con Incidencia');
  guardarOrdenes();
  closeModal('modalInc');
  if ($('tbody')) renderOrdenes();
  if ($('tbodyEstadoDespacho')) renderEstadoDespacho();
  toast(`Incidencia registrada en la guía ${o.id} (estado: Con Incidencia).`);
}

function verDetalle(id) {
  const o = ordenes.find(x => x.id === id);
  if (!o) return;
  const c = CONDUCTORES[o.cond] || { n: 'Por asignar', v: 'N/A' };
  const badgeEst = o.estado === 'Completo'
    ? 'background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;'
    : (o.estado === 'Con Incidencia'
      ? 'background:#fef2f2;color:#991b1b;border:1px solid #fecaca;'
      : 'background:#fffbeb;color:#92400e;border:1px solid #fde68a;');
  const inc = o.incidencia ? `
    <div class="print-avoid-break" style="margin-top:12px;padding:10px 12px;background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #dc2626;border-radius:8px;color:#7f1d1d;font-size:11.5px">
      <div style="font-weight:700;text-transform:uppercase;font-size:10px;letter-spacing:.04em;margin-bottom:2px">Incidencia (${o.incidencia.tipo === 'cliente' ? 'Cliente' : 'Transporte'})${o.incidencia.resuelta ? ' — RESUELTA' : ''}</div>
      <div><b>${esc(o.incidencia.motivo)}</b> · ${esc(o.incidencia.desc)}</div>
    </div>` : '';
  const filasMercancia = Array.isArray(o.lineasInv) && o.lineasInv.length
    ? `<table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:11.5px;font-variant-numeric:tabular-nums">
        <thead>
          <tr style="background:#f3f4f6;border-bottom:1px solid #d1d5db">
            <th style="padding:6px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:#374151">Producto</th>
            <th style="padding:6px 8px;text-align:center;font-size:10px;text-transform:uppercase;color:#374151;width:90px">Cant. Emp.</th>
            <th style="padding:6px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:#374151;width:110px">Unidades</th>
          </tr>
        </thead>
        <tbody>
          ${o.lineasInv.map((l, idx) => `
            <tr style="background:${idx % 2 === 1 ? '#fafafa' : '#ffffff'}">
              <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-weight:600">${esc(l.nombre || l.id || 'Producto')}</td>
              <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:center">${Number(l.cantidad || 0)}</td>
              <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:right">${Number(l.cantidad || 0) * (Number(l.contiene || 1))} uds</td>
            </tr>`).join('')}
        </tbody>
      </table>`
    : `<p style="font-size:12px;color:#111827;margin-top:4px">${esc(o.items || 'Sin detalle especificado')}</p>`;

  $('printArea').innerHTML = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;font-size:12px;line-height:1.45">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1c4d37;padding-bottom:12px;margin-bottom:14px">
        <div>
          <div style="font-size:18px;font-weight:800;color:#1c4d37;letter-spacing:-0.01em">Distribuidora Gentil Supply, C.A.</div>
          <div style="font-size:11px;color:#4b5563">La Asunción, Mpio. Arismendi, Estado Nueva Esparta</div>
          <div style="font-size:11px;color:#4b5563">Control de Despacho y Logística</div>
        </div>
        <div style="text-align:right">
          <div style="display:inline-block;padding:2px 8px;border-radius:6px;background:#ecfdf5;border:1px solid #a7f3d0;color:#1c4d37;font-size:10px;font-weight:800;letter-spacing:.06em;margin-bottom:4px">NOTA DE ENTREGA</div>
          <div style="font-size:15px;font-weight:800;color:#111827">Guía ${esc(o.id)}</div>
          ${o.facturaNumero ? `<div style="font-size:11px;color:#374151">Factura: <b>${esc(o.facturaNumero)}</b></div>` : ''}
          <div style="font-size:11px;color:#4b5563">Fecha: <b>${esc(o.fecha)}</b></div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
        <div style="border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;text-transform:uppercase;color:#6b7280;font-weight:700;letter-spacing:.04em">Datos del Cliente</div>
          <div style="font-size:13px;font-weight:700;color:#111827;margin-top:2px">${esc(o.cliente)}</div>
          <div style="font-size:11px;color:#4b5563">RIF: ${esc(o.rif)}</div>
          <div style="font-size:11px;color:#4b5563">Municipio: <b>${esc(o.zona)}</b> · Vendedor: <b style="color:#1c4d37">${esc(o.ruta || rutaDeClienteDesp(o.cliente))}</b></div>
        </div>
        <div style="border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;text-transform:uppercase;color:#6b7280;font-weight:700;letter-spacing:.04em">Transporte y Estado</div>
          <div style="font-size:12px;margin-top:2px">Conductor: <b>${esc(c.n)}</b></div>
          <div style="font-size:11px;color:#4b5563">Vehículo: ${esc(c.v)}</div>
          <div style="margin-top:4px"><span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:10.5px;font-weight:700;${badgeEst}">${esc(o.estado || 'En Preparación')}</span></div>
        </div>
      </div>

      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;margin-bottom:12px">
        <div style="font-size:10px;text-transform:uppercase;color:#6b7280;font-weight:700;letter-spacing:.04em">Detalle de Mercancía Despachada</div>
        ${filasMercancia}
      </div>

      ${inc}

      <div class="print-avoid-break" style="display:grid;grid-template-columns:1fr 1fr;gap:36px;margin-top:44px;text-align:center;font-size:11px;color:#4b5563">
        <div style="border-top:1px solid #9ca3af;padding-top:6px">Despachado por (Firma y Sello)</div>
        <div style="border-top:1px solid #9ca3af;padding-top:6px">Recibido conforme (Cliente / Fecha)</div>
      </div>

      <div class="print-footer-preview" style="margin-top:22px;padding-top:8px;border-top:1px solid #d1d5db;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#1c4d37;font-weight:700">
        <span>Página 1/1</span>
        <span style="font-size:10px;font-weight:500;color:#6b7280">Distribuidora Gentil Supply, C.A.</span>
      </div>
    </div>`;
  openModal('modalDet');
  if (window.lucide) lucide.createIcons();
}

function imprimirGuiaCarga() {
  const printArea = $('printArea');
  const zona = $('zonaImpresion');
  if (printArea && zona) {
    zona.innerHTML = printArea.innerHTML;
  }
  window.print();
}

if (!window.__gsDespachoBeforePrintBound) {
  window.__gsDespachoBeforePrintBound = true;
  window.addEventListener('beforeprint', () => {
    const printArea = document.getElementById('printArea');
    const zona = document.getElementById('zonaImpresion');
    if (printArea && zona && printArea.innerHTML.trim()) {
      zona.innerHTML = printArea.innerHTML;
    }
  });
  window.addEventListener('afterprint', () => {
    const zona = document.getElementById('zonaImpresion');
    if (zona) zona.innerHTML = '';
  });
}

// ======================================================================
// NUEVA GUÍA DE CARGA: Solo Facturas Emitidas + Auto-rellenado de Cliente
// ======================================================================
function obtenerFacturasEmitidasDisponiblesParaGuia() {
  asegurarDatosCompartidosDespacho();
  let facturas = [];
  let ventas = [];
  let clientes = [];
  try { facturas = JSON.parse(localStorage.getItem(FACTURAS_KEY)) || []; } catch (e) {}
  try { ventas = JSON.parse(localStorage.getItem(VENTAS_KEY)) || []; } catch (e) {}
  try { clientes = JSON.parse(localStorage.getItem(CLIENTES_KEY)) || []; } catch (e) {}

  const facturasConGuia = new Set(ordenes.map(o => o.facturaNumero).filter(Boolean));
  return facturas
    .filter(f => f && f.estado !== 'Anulada' && !facturasConGuia.has(f.numero))
    .map(f => {
      const v = ventas.find(x => x.id === f.ventaId) || {};
      const c = clientes.find(x => x.nombre === f.cliente) || {};
      return {
        factura: f,
        venta: v,
        clienteObj: c,
        zona: c.zona || f.direccion || 'Mariño'
      };
    });
}

function abrirModalGuia() {
  ordenes = cargarOrdenes();
  const disponibles = obtenerFacturasEmitidasDisponiblesParaGuia();
  const selFac = $('gFacturaSelect');
  const infoFac = $('gFacturaInfo');
  const btnSubmit = $('btnCrearGuiaSubmit');

  if (selFac) {
    selFac.innerHTML = '<option value="" disabled selected>Seleccionar factura emitida...</option>' +
      disponibles.map(({ factura: f }) =>
        `<option value="${esc(f.numero)}">${esc(f.numero)} · Venta ${esc(f.ventaId)} · ${esc(f.cliente)} (${fmtUsd(f.total)})</option>`
      ).join('');
    selFac.disabled = disponibles.length === 0;
  }

  if (infoFac) {
    infoFac.textContent = disponibles.length
      ? `${disponibles.length} ${disponibles.length === 1 ? 'factura emitida disponible' : 'facturas emitidas disponibles'} para generar guía de carga.`
      : 'No hay facturas emitidas pendientes de guía. Emite primero la factura en el Módulo de Facturación.';
  }

  if ($('gCliente')) $('gCliente').value = '';
  if ($('gRif')) $('gRif').value = '';
  if ($('gZona')) $('gZona').value = '';
  if ($('gItems')) $('gItems').value = '';
  if ($('gFecha')) $('gFecha').value = hoy;
  if (btnSubmit) btnSubmit.disabled = true;
  itemsGuiaTemporal = [];

  if (disponibles.length === 1 && selFac) {
    selFac.value = disponibles[0].factura.numero;
    cargarDatosFacturaEnGuia();
  }

  openModal('modalGuia');
  if (window.lucide) lucide.createIcons();
}

function cargarDatosFacturaEnGuia() {
  const numFac = ($('gFacturaSelect') && $('gFacturaSelect').value) || '';
  const disponibles = obtenerFacturasEmitidasDisponiblesParaGuia();
  const reg = disponibles.find(x => x.factura.numero === numFac);
  const btnSubmit = $('btnCrearGuiaSubmit');
  if (!reg) {
    if (btnSubmit) btnSubmit.disabled = true;
    return;
  }

  const { factura: f, venta: v, clienteObj: c, zona } = reg;
  if ($('gCliente')) $('gCliente').value = f.cliente || v.cliente || '';
  if ($('gRif')) $('gRif').value = f.rif || c.rif || '';
  if ($('gZona')) $('gZona').value = zona;

  const listaItems = Array.isArray(f.items) && f.items.length ? f.items : (v.items || []);
  itemsGuiaTemporal = listaItems.map(i => ({
    id: i.id,
    nombre: i.nombre,
    cantidad: Number(i.cantidad) || 0,
    contiene: Number(i.contiene) || 1
  }));

  const textoMercancia = itemsGuiaTemporal
    .map(i => `${i.cantidad} ${i.nombre} (${i.cantidad * i.contiene} uds)`)
    .join(', ');
  if ($('gItems')) $('gItems').value = textoMercancia;
  if ($('gFacturaInfo')) {
    $('gFacturaInfo').textContent = `Datos cargados de ${f.numero} (Venta ${f.ventaId}). Al crear la guía, la orden pasará a estado En Preparación.`;
  }
  if (btnSubmit) btnSubmit.disabled = false;
}

function crearGuia(e) {
  e.preventDefault();
  const numFac = ($('gFacturaSelect') && $('gFacturaSelect').value) || '';
  const disponibles = obtenerFacturasEmitidasDisponiblesParaGuia();
  const reg = disponibles.find(x => x.factura.numero === numFac);
  if (!reg) {
    toast('Solo puedes crear guías de carga a partir de una factura emitida válida.');
    return;
  }

  const { factura: f } = reg;
  const maxNum = ordenes.reduce((m, o) => {
    const num = parseInt(String(o.id || '').replace(/\D+/g, ''), 10);
    return isNaN(num) ? m : Math.max(m, num);
  }, 100);
  const nuevaOrden = {
    id: 'GS-' + String(maxNum + 1).padStart(5, '0'),
    facturaNumero: f.numero,
    ventaId: f.ventaId,
    cliente: $('gCliente').value,
    rif: $('gRif').value.toUpperCase(),
    cond: +$('gConductor').value,
    zona: $('gZona').value,
    fecha: $('gFecha').value || hoy,
    estado: 'En Preparación',
    items: $('gItems').value,
    lineasInv: itemsGuiaTemporal.slice(),
    stockDescontado: false
  };

  ordenes.unshift(nuevaOrden);
  sincronizarEstadoDespachoConVentaYFactura(nuevaOrden, 'En Preparación');
  itemsGuiaTemporal = [];
  guardarOrdenes();
  closeModal('modalGuia');
  renderOrdenes();
  toast(`Guía ${nuevaOrden.id} asignada a la factura ${f.numero} (Estado: En Preparación).`);
}

function initOrdenes() {
  if ($('gConductor')) {
    $('gConductor').innerHTML = CONDUCTORES.map((c, i) => `<option value="${i}">${c.n} — ${c.v}</option>`).join('');
  }
  if ($('gFecha')) $('gFecha').value = hoy;
  if ($('search')) $('search').addEventListener('input', renderOrdenes);
  if ($('filterEstado')) $('filterEstado').addEventListener('change', renderOrdenes);
  ['modalGuia', 'modalInc', 'modalDet'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('click', e => { if (e.target.id === id) closeModal(id); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['modalGuia', 'modalInc', 'modalDet'].forEach(id => {
        const el = $(id);
        if (el && !el.classList.contains('hidden')) closeModal(id);
      });
    }
  });
  window.addEventListener('storage', () => {
    ordenes = cargarOrdenes();
    renderOrdenes();
  });
  setVista(vistaActual);
  renderOrdenes();
}

// ======================================================================
// ESTADO DE DESPACHO (incidencias.php)
// Flujo: Factura emitida (Sin estado) → Guía asignada (En Preparación) →
//        Estado de Despacho otorga: Completo o Con Incidencia (con botón Marcar Resuelto).
// ======================================================================
let ordenEstadoDesp = { campo: 'id', dir: 'desc' };

function ordenarEstadoDespachoPor(campo) {
  if (ordenEstadoDesp.campo === campo) {
    ordenEstadoDesp.dir = ordenEstadoDesp.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenEstadoDesp.campo = campo;
    ordenEstadoDesp.dir = (campo === 'cliente' || campo === 'zona' || campo === 'estado') ? 'asc' : 'desc';
  }
  renderEstadoDespacho();
}

function cambiarEstadoDespachoOrden(id, nuevoEstado) {
  ordenes = cargarOrdenes();
  const orden = ordenes.find(x => x.id === id);
  if (!orden) return;

  sincronizarEstadoDespachoConVentaYFactura(orden, nuevoEstado);

  // Al marcar Completo, descontar del inventario si aún no fue descontado
  if (nuevoEstado === 'Completo' && Array.isArray(orden.lineasInv) && orden.lineasInv.length && !orden.stockDescontado) {
    orden.lineasInv.forEach(linea => {
      const itemInv = buscarItemInventario(linea.id);
      if (itemInv) {
        itemInv.stock = Math.max(0, itemInv.stock - linea.cantidad);
      }
    });
    orden.stockDescontado = true;
    guardarInventario();
  }

  guardarOrdenes();
  if ($('tbodyEstadoDespacho')) renderEstadoDespacho();
  if ($('tbody')) renderOrdenes();
  toast(`Guía ${orden.id} actualizada a "${nuevoEstado}" (reflejado en Ventas).`);
}

function marcarIncidenciaResuelta(id) {
  ordenes = cargarOrdenes();
  const o = ordenes.find(x => x.id === id);
  if (!o) return;
  if (o.incidencia) {
    o.incidencia.resuelta = true;
    o.incidencia.fechaResolucion = hoy;
  }
  sincronizarEstadoDespachoConVentaYFactura(o, 'En Preparación');
  guardarOrdenes();
  if ($('tbodyEstadoDespacho')) renderEstadoDespacho();
  if ($('tbody')) renderOrdenes();
  toast(`Incidencia de ${o.id} marcada como resuelta. La orden volvió a "En Preparación".`);
}

function renderEstadoDespacho() {
  const tbody = $('tbodyEstadoDespacho');
  if (!tbody) return;
  ordenes = cargarOrdenes();

  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set('estKpiPreparacion', ordenes.filter(o => o.estado === 'En Preparación').length);
  set('estKpiCompleto', ordenes.filter(o => o.estado === 'Completo').length);
  set('estKpiIncidencia', ordenes.filter(o => o.estado === 'Con Incidencia').length);

  const q = (($('estBusqueda') && $('estBusqueda').value) || '').trim().toLowerCase();
  const fEst = ($('estFiltroEstado') && $('estFiltroEstado').value) || '';

  const filtrada = ordenes.filter(o => {
    if (fEst && o.estado !== fEst) return false;
    if (q && !(o.id + ' ' + (o.facturaNumero || '') + ' ' + (o.ventaId || '') + ' ' + o.cliente + ' ' + o.zona).toLowerCase().includes(q)) return false;
    return true;
  });

  const mult = ordenEstadoDesp.dir === 'asc' ? 1 : -1;
  const lista = [...filtrada].sort((a, b) => {
    switch (ordenEstadoDesp.campo) {
      case 'id': return String(a.id || '').localeCompare(String(b.id || '')) * mult;
      case 'cliente': return String(a.cliente || '').localeCompare(String(b.cliente || ''), 'es') * mult;
      case 'zona': return String(a.zona || '').localeCompare(String(b.zona || ''), 'es') * mult;
      case 'fecha': return String(a.fecha || '').localeCompare(String(b.fecha || '')) * mult;
      case 'estado': return String(a.estado || '').localeCompare(String(b.estado || ''), 'es') * mult;
      default: return 0;
    }
  });

  actualizarIconosOrdenDespacho('sortIconEstD', ['id', 'cliente', 'zona', 'fecha', 'estado'], ordenEstadoDesp);

  tbody.innerHTML = lista.map(o => {
    const subFac = o.facturaNumero
      ? `<span class="text-xs font-mono text-gray-500 dark:text-gray-400 block">${esc(o.facturaNumero)}${o.ventaId ? ' · Venta ' + esc(o.ventaId) : ''}</span>`
      : '';
    const detalleInc = o.incidencia && !o.incidencia.resuelta
      ? `<p class="text-[11px] text-red-600 dark:text-red-400 mt-1">${esc(o.incidencia.motivo)}${o.incidencia.desc ? ' — ' + esc(o.incidencia.desc) : ''}</p>`
      : (o.incidencia && o.incidencia.resuelta ? `<p class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Incidencia resuelta (${esc(o.incidencia.motivo)})</p>` : '');

    let accionesHtml = '';
    if (o.estado === 'En Preparación') {
      accionesHtml = `
        <div class="inline-flex flex-wrap items-center justify-center gap-1.5">
          <button onclick="cambiarEstadoDespachoOrden('${o.id}', 'Completo')" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5">
            <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Completo
          </button>
          <button onclick="abrirIncidencia('${o.id}')" class="bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800/60 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5">
            <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> Con Incidencia
          </button>
        </div>`;
    } else if (o.estado === 'Con Incidencia') {
      accionesHtml = `
        <button onclick="marcarIncidenciaResuelta('${o.id}')" class="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5">
          <i data-lucide="check" class="w-3.5 h-3.5"></i> Marcar Resuelto
        </button>`;
    } else {
      accionesHtml = `<span class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
        <i data-lucide="check-check" class="w-4 h-4"></i> Entregado / Completo
      </span>`;
    }

    return `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
      <td class="px-6 py-4"><span class="font-semibold text-[#1c4d37] dark:text-emerald-400">${esc(o.id)}</span>${subFac}</td>
      <td class="px-6 py-4"><p class="font-medium text-gray-800 dark:text-gray-100">${esc(o.cliente)}</p><p class="text-xs font-mono text-gray-500 dark:text-gray-400">${esc(o.rif)} · <span class="font-sans font-bold text-[#1c4d37] dark:text-emerald-400">${esc(o.ruta || rutaDeClienteDesp(o.cliente))}</span></p></td>
      <td class="px-6 py-4 text-gray-700 dark:text-gray-300">${esc(o.zona)}</td>
      <td class="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">${esc(o.fecha)}</td>
      <td class="px-6 py-4">${badge(o.estado)}${detalleInc}</td>
      <td class="px-6 py-4 text-center">${accionesHtml}</td>
    </tr>`;
  }).join('');

  if ($('estVacio')) $('estVacio').classList.toggle('hidden', lista.length > 0);
  if (window.lucide) lucide.createIcons();
}

function renderIncidencias() {
  renderEstadoDespacho();
}

// ======================================================================
// DASHBOARD (dashboard.php)
// ======================================================================
let ordenRecientesDesp = { campo: 'id', dir: 'desc' };

function ordenarRecientesDespachoPor(campo) {
  if (ordenRecientesDesp.campo === campo) {
    ordenRecientesDesp.dir = ordenRecientesDesp.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenRecientesDesp.campo = campo;
    ordenRecientesDesp.dir = campo === 'id' ? 'desc' : 'asc';
  }
  renderTablaRecientesDespacho();
}

function renderTablaRecientesDespacho() {
  const tbody = $('tbodyRecientes');
  if (!tbody) return;
  const mult = ordenRecientesDesp.dir === 'asc' ? 1 : -1;
  const recientes = [...ordenes].sort((a, b) => {
    switch (ordenRecientesDesp.campo) {
      case 'id': return String(a.id || '').localeCompare(String(b.id || '')) * mult;
      case 'cliente': return String(a.cliente || '').localeCompare(String(b.cliente || ''), 'es') * mult;
      case 'zona': return String(a.zona || '').localeCompare(String(b.zona || ''), 'es') * mult;
      case 'estado': return String(a.estado || '').localeCompare(String(b.estado || ''), 'es') * mult;
      default: return 0;
    }
  }).slice(0, 6);

  actualizarIconosOrdenDespacho('sortIconRec', ['id', 'cliente', 'zona', 'estado'], ordenRecientesDesp);

  tbody.innerHTML = recientes.map(o => `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
    <td class="px-6 py-3 font-semibold text-[#1c4d37] dark:text-emerald-400">${esc(o.id)}${o.facturaNumero ? ` <span class="text-xs font-mono text-gray-400">· ${esc(o.facturaNumero)}</span>` : ''}</td>
    <td class="px-6 py-3 text-gray-800 dark:text-gray-100">${esc(o.cliente)}</td>
    <td class="px-6 py-3 text-gray-700 dark:text-gray-300">${esc(o.zona)}</td>
    <td class="px-6 py-3">${badge(o.estado)}</td></tr>`).join('');
  if (window.lucide) lucide.createIcons();
}

function initDashboard() {
  renderStats();
  renderTablaRecientesDespacho();

  const dark = document.documentElement.classList.contains('dark');
  const texto = dark ? '#d1d5db' : '#4b5563';
  Chart.defaults.color = texto;
  new Chart($('chartEstados').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(ESTADO_CLS),
      datasets: [{ data: Object.keys(ESTADO_CLS).map(contar), backgroundColor: ['#3b82f6', '#1c4d37', '#ef4444'], borderWidth: 0 }]
    },
    options: { cutout: '65%' }
  });
  const porZona = ZONAS.map(z => ordenes.filter(o => o.zona === z).length);
  new Chart($('chartZonas').getContext('2d'), {
    type: 'bar',
    data: { labels: ZONAS, datasets: [{ label: 'Órdenes', data: porZona, backgroundColor: '#10b981', borderRadius: 6 }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
  });
  if (window.sincronizarGraficasYTextoTema) window.sincronizarGraficasYTextoTema();
  lucide.createIcons();
}

// ======================================================================
// MÓDULO DE INVENTARIO DE ALMACÉN Y DESPACHO (inventario.php)
// Inspirado en la estructura y experiencia de uso del Módulo de Ventas
// ======================================================================
let carritoMovimientoInv = [];
let vistaInventarioActual = 'presentaciones'; // 'presentaciones' | 'consolidado'
let filtroMarcaChip = '';

const MOV_TIPOS_INFO = {
  entrada: 'Entrada de mercancía en almacén: suma las presentaciones y unidades al stock disponible.',
  ajuste: 'Registro de merma en almacén: descuenta existencias del stock actual.'
};

function siguienteIdMov() {
  const max = movimientosInv.reduce((m, x) => {
    const n = parseInt(String(x.id).replace(/\D/g, ''), 10);
    return isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return 'MOV-' + String(max + 1).padStart(3, '0');
}

function mostrarAvisoCantidadInv(msg) {
  const aviso = $('invCantidadAviso');
  if (!aviso) return;
  if (msg) {
    aviso.textContent = msg;
    aviso.classList.remove('hidden');
  } else {
    aviso.textContent = '';
    aviso.classList.add('hidden');
  }
}

function validarTeclaCantidadInv(e) {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    return;
  }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const permitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];
  if (permitidas.includes(e.key)) {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarAlMovimientoInv();
    }
    return;
  }
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    mostrarAvisoCantidadInv('Solo se permiten números enteros mayores a 0 (sin letras, decimales ni signos).');
    return;
  }
  if (e.key === '0' && (!e.target.value || (e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length))) {
    e.preventDefault();
    mostrarAvisoCantidadInv('La cantidad debe ser al menos 1.');
  }
}

function validarInputCantidadInv(input) {
  if (!input) return;
  const orig = input.value;
  const limpio = orig.replace(/\D+/g, '').replace(/^0+/, '');
  if (orig !== limpio) {
    input.value = limpio;
    mostrarAvisoCantidadInv('Se eliminaron caracteres inválidos: ingresa únicamente números enteros.');
    return;
  }
  mostrarAvisoCantidadInv('');

  const tipoMov = ($('movTipoSelect') && $('movTipoSelect').value) || 'entrada';
  const prodId = $('invProductoSelect') && $('invProductoSelect').value;
  const cant = parseInt(limpio, 10) || 0;
  if (tipoMov === 'ajuste' && prodId && cant > 0) {
    const inv = buscarItemInventario(prodId);
    const yaEnLote = (carritoMovimientoInv.find(x => x.id === prodId) || {}).cantidad || 0;
    if (inv && cant + yaEnLote > inv.stock) {
      mostrarAvisoCantidadInv(`La merma total (${cant + yaEnLote}) supera el stock disponible (${inv.stock}).`);
    }
  }
}

function pegarCantidadInv(e, input) {
  e.preventDefault();
  const texto = (e.clipboardData || window.clipboardData).getData('text') || '';
  const limpio = texto.replace(/\D+/g, '').replace(/^0+/, '');
  input.value = limpio;
  if (texto.trim() !== '' && limpio !== texto.trim()) {
    mostrarAvisoCantidadInv('El texto pegado contenía letras o caracteres no numéricos y fue depurado.');
  } else {
    mostrarAvisoCantidadInv('');
  }
}

function irARegistroMovimiento() {
  if ($('modalMovimientoInv')) {
    mostrarAvisoCantidadInv('');
    if ($('invCantidadInput')) $('invCantidadInput').value = '';
    openModal('modalMovimientoInv');
    if (window.lucide) lucide.createIcons();
    setTimeout(() => { if ($('invMarcaSelect')) $('invMarcaSelect').focus(); }, 150);
    return;
  }
  const sec = $('seccionMovimientoInv');
  if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function seleccionarTipoMovimiento(tipo) {
  const input = $('movTipoSelect');
  const info = $('movTipoInfo');
  const contenedor = $('movTipoOpciones');
  if (!input || !contenedor) return;
  const tipoNorm = tipo === 'ajuste' ? 'ajuste' : 'entrada';
  input.value = tipoNorm;

  contenedor.querySelectorAll('[data-mov]').forEach(btn => {
    const activo = btn.getAttribute('data-mov') === tipoNorm;
    const colorActivo = tipoNorm === 'entrada'
      ? 'bg-[#1c4d37] text-white border-[#1c4d37] dark:bg-emerald-600 dark:border-emerald-600 shadow-sm'
      : 'bg-amber-600 text-white border-amber-600 shadow-sm';
    btn.className = 'py-2.5 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-1.5 ' + (
      activo
        ? colorActivo
        : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#1c4d37]/50 dark:hover:border-emerald-500/50'
    );
  });

  if (info) info.textContent = MOV_TIPOS_INFO[tipoNorm] || '';
  mostrarAvisoCantidadInv('');

  if (tipoNorm === 'ajuste') {
    const excedido = carritoMovimientoInv.find(l => {
      const inv = buscarItemInventario(l.id);
      return !inv || l.cantidad > inv.stock;
    });
    if (excedido) {
      const inv = buscarItemInventario(excedido.id);
      mostrarAvisoCantidadInv(`En Merma, "${excedido.nombre}" (${excedido.cantidad}) excede el stock actual (${inv ? inv.stock : 0}).`);
    }
  }
  renderizarCarritoMovimientoInv();
}

// Selectores en cascada: Marca → Presentación → Producto (como en ventas.php)
function cargarMarcasInv() {
  const marcaSelect = $('invMarcaSelect');
  if (!marcaSelect) return;
  marcaSelect.innerHTML = '<option value="" disabled selected>Marca</option>';
  Object.entries(catalogoProductosDespacho).forEach(([key, m]) => {
    marcaSelect.insertAdjacentHTML('beforeend', `<option value="${key}">${m.nombre}</option>`);
  });
}

function cargarPresentacionesInv() {
  const marca = catalogoProductosDespacho[$('invMarcaSelect').value];
  const presSelect = $('invPresentacionSelect');
  const prodSelect = $('invProductoSelect');
  if (!marca || !presSelect || !prodSelect) return;

  presSelect.innerHTML = '<option value="" disabled selected>Presentación</option>';
  presSelect.disabled = false;
  prodSelect.innerHTML = '<option value="" disabled selected>Producto</option>';
  prodSelect.disabled = true;

  Object.entries(marca.presentaciones).forEach(([key, p]) => {
    presSelect.insertAdjacentHTML('beforeend', `<option value="${key}">${p.nombre}</option>`);
  });
  actualizarInfoProductoInv();
}

function cargarProductosInv() {
  const marca = catalogoProductosDespacho[$('invMarcaSelect').value];
  const pres = marca && marca.presentaciones[$('invPresentacionSelect').value];
  const prodSelect = $('invProductoSelect');
  if (!pres || !prodSelect) return;

  prodSelect.innerHTML = '<option value="" disabled selected>Producto</option>';
  prodSelect.disabled = false;

  pres.productos.forEach(p => {
    const itemInv = buscarItemInventario(p.id);
    const stockActual = itemInv ? itemInv.stock : p.stockInicial;
    prodSelect.insertAdjacentHTML('beforeend', `<option value="${p.id}">${p.nombre} — Stock: ${stockActual}</option>`);
  });
  actualizarInfoProductoInv();
}

function actualizarInfoProductoInv() {
  const info = $('invInfoProducto');
  const prodSelect = $('invProductoSelect');
  if (!info || !prodSelect) return;
  const item = buscarItemInventario(prodSelect.value);
  if (!item) {
    info.textContent = 'Selecciona marca, presentación y producto para ver su equivalencia y stock actual.';
    return;
  }
  const udsActuales = item.stock * item.contiene;
  if (item.contiene > 1) {
    info.textContent = `Trae ${item.contiene} uds por ${item.tipo.toLowerCase()} · Stock actual: ${item.stock} ${item.stock === 1 ? item.tipo.toLowerCase() : item.plural.toLowerCase()} (${fmtNum(udsActuales)} uds individuales) · ${item.ubicacion}`;
  } else {
    info.textContent = `Presentación unitaria (1 ud) · Stock actual: ${fmtNum(item.stock)} uds · ${item.ubicacion}`;
  }
}

function agregarAlMovimientoInv() {
  const selectMarca = $('invMarcaSelect');
  const selectPres = $('invPresentacionSelect');
  const selectProducto = $('invProductoSelect');
  const inputCantidad = $('invCantidadInput');
  if (!selectProducto || !inputCantidad) return;

  if (!selectMarca || !selectMarca.value) {
    const msg = 'Selecciona primero una Marca.';
    mostrarAvisoCantidadInv(msg);
    toast(msg);
    return;
  }
  if (!selectPres || !selectPres.value) {
    const msg = 'Selecciona primero una Presentación.';
    mostrarAvisoCantidadInv(msg);
    toast(msg);
    return;
  }
  const productoId = selectProducto.value;
  if (!productoId) {
    const msg = 'Selecciona un Producto del catálogo.';
    mostrarAvisoCantidadInv(msg);
    toast(msg);
    return;
  }

  const rawCant = String(inputCantidad.value || '').trim();
  if (!/^\d+$/.test(rawCant)) {
    const msg = 'Cantidad inválida: solo se permiten números enteros (sin letras ni símbolos).';
    mostrarAvisoCantidadInv(msg);
    toast(msg);
    inputCantidad.focus();
    return;
  }
  const cantidad = parseInt(rawCant, 10);
  if (!(cantidad > 0)) {
    const msg = 'La cantidad debe ser un número entero mayor que 0.';
    mostrarAvisoCantidadInv(msg);
    toast(msg);
    inputCantidad.focus();
    return;
  }

  const info = buscarItemInventario(productoId);
  if (!info) return;

  const tipoMov = ($('movTipoSelect') && $('movTipoSelect').value) || 'entrada';
  const existente = carritoMovimientoInv.find(i => i.id === productoId);
  const cantidadTotalSolicitada = (existente ? existente.cantidad : 0) + cantidad;

  if (tipoMov === 'ajuste') {
    if (info.stock <= 0) {
      const msg = `"${info.nombre}" no tiene existencias disponibles para registrar merma (Stock: 0).`;
      mostrarAvisoCantidadInv(msg);
      toast(msg);
      return;
    }
    if (cantidadTotalSolicitada > info.stock) {
      const msg = `La merma (${cantidadTotalSolicitada}) supera el stock disponible (${info.stock} ${info.plural.toLowerCase()} = ${fmtNum(info.stock * info.contiene)} uds).`;
      mostrarAvisoCantidadInv(msg);
      toast(msg);
      return;
    }
  }

  mostrarAvisoCantidadInv('');
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carritoMovimientoInv.push({
      id: info.id,
      nombre: info.nombre,
      marcaNombre: info.marcaNombre,
      tipo: info.tipo,
      plural: info.plural,
      contiene: info.contiene,
      precio: info.precio,
      cantidad
    });
  }

  inputCantidad.value = '';
  renderizarCarritoMovimientoInv();
}

function cambiarCantidadMovInv(index, delta) {
  const item = carritoMovimientoInv[index];
  if (!item) return;
  const nuevaCant = item.cantidad + delta;
  if (nuevaCant <= 0) {
    carritoMovimientoInv.splice(index, 1);
  } else {
    const tipoMov = ($('movTipoSelect') && $('movTipoSelect').value) || 'entrada';
    const inv = buscarItemInventario(item.id);
    if ((tipoMov === 'salida' || tipoMov === 'ajuste') && inv && nuevaCant > inv.stock) {
      toast(`Stock máximo disponible: ${inv.stock}`);
      return;
    }
    item.cantidad = nuevaCant;
  }
  renderizarCarritoMovimientoInv();
}

function eliminarDelMovimientoInv(index) {
  carritoMovimientoInv.splice(index, 1);
  renderizarCarritoMovimientoInv();
}

function renderizarCarritoMovimientoInv() {
  const contenedor = $('listaMovimientoContainer');
  const totalUdsDisplay = $('totalUnidadesMovDisplay');
  const resumenBadge = $('movResumenBadge');
  if (!contenedor || !totalUdsDisplay) return;

  const tipoMov = ($('movTipoSelect') && $('movTipoSelect').value) || 'entrada';
  const esEntrada = tipoMov === 'entrada';
  const signo = esEntrada ? '+' : '−';
  const colorSigno = esEntrada
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-amber-600 dark:text-amber-400';

  const totalUnidades = carritoMovimientoInv.reduce((t, i) => t + i.cantidad * i.contiene, 0);
  if (resumenBadge) {
    resumenBadge.textContent = `${carritoMovimientoInv.length} ${carritoMovimientoInv.length === 1 ? 'línea' : 'líneas'} · ${fmtNum(totalUnidades)} uds individuales`;
  }
  totalUdsDisplay.textContent = `${carritoMovimientoInv.length ? signo : ''}${fmtNum(totalUnidades)} uds`;

  if (carritoMovimientoInv.length === 0) {
    contenedor.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center py-8 text-gray-400 dark:text-gray-500">
        <div class="w-11 h-11 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-2.5">
          <i data-lucide="package-plus" class="w-5 h-5"></i>
        </div>
        <p class="text-sm font-medium">Aún no hay productos en el lote</p>
        <p class="text-xs mt-0.5">Elige marca, presentación y producto para añadirlos.</p>
      </div>`;
    if (window.lucide) lucide.createIcons();
    return;
  }

  contenedor.innerHTML = carritoMovimientoInv.map((item, idx) => {
    const uds = item.cantidad * item.contiene;
    const detalle = item.contiene > 1
      ? `${fmtNum(uds)} uds (${item.contiene} por ${item.tipo.toLowerCase()})`
      : `${fmtNum(uds)} uds sueltas`;
    return `
      <div class="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
        <div class="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <i data-lucide="${item.contiene > 1 ? 'package' : 'box'}" class="w-4 h-4"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">${esc(item.nombre)}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${esc(item.marcaNombre)} · ${detalle}</p>
        </div>
        <div class="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0">
          <button type="button" onclick="cambiarCantidadMovInv(${idx}, -1)" class="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><i data-lucide="minus" class="w-3.5 h-3.5"></i></button>
          <span class="w-8 text-center text-xs font-bold text-gray-800 dark:text-gray-100">${item.cantidad}</span>
          <button type="button" onclick="cambiarCantidadMovInv(${idx}, 1)" class="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><i data-lucide="plus" class="w-3.5 h-3.5"></i></button>
        </div>
        <span class="text-xs font-bold ${colorSigno} whitespace-nowrap">${signo}${fmtNum(uds)} uds</span>
        <button type="button" onclick="eliminarDelMovimientoInv(${idx})" class="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>`;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function procesarMovimientoInv() {
  const inputCantPendiente = ($('invCantidadInput') && $('invCantidadInput').value || '').trim();
  if (inputCantPendiente !== '' && !/^\d+$/.test(inputCantPendiente)) {
    const msg = 'El campo de cantidad contiene caracteres no válidos. Ingresa solo números enteros.';
    mostrarAvisoCantidadInv(msg);
    toast(msg);
    return;
  }
  if (carritoMovimientoInv.length === 0) {
    const msg = 'Añade al menos un producto a la lista antes de aplicar el movimiento.';
    mostrarAvisoCantidadInv(msg);
    toast(msg);
    return;
  }

  const tipoMov = (($('movTipoSelect') && $('movTipoSelect').value) || 'entrada') === 'ajuste' ? 'ajuste' : 'entrada';
  const esEntrada = tipoMov === 'entrada';
  const referencia = esEntrada ? 'Entrada de Mercancía' : 'Merma de Almacén';
  const observacion = esEntrada ? 'Ingreso de mercancía en almacén' : 'Descuento por merma en almacén';

  for (const linea of carritoMovimientoInv) {
    if (!Number.isInteger(linea.cantidad) || linea.cantidad <= 0) {
      toast(`Cantidad inválida para "${linea.nombre}". Debe ser un número entero mayor a 0.`);
      return;
    }
    const itemInv = buscarItemInventario(linea.id);
    if (!itemInv) {
      toast(`No se encontró el producto "${linea.nombre}" en inventario.`);
      return;
    }
    if (!esEntrada && linea.cantidad > itemInv.stock) {
      const msg = `Stock insuficiente para merma de "${linea.nombre}". Disponible: ${itemInv.stock}.`;
      mostrarAvisoCantidadInv(msg);
      toast(msg);
      return;
    }
  }

  const totalUds = carritoMovimientoInv.reduce((t, i) => t + i.cantidad * i.contiene, 0);
  const ejecutarMovimiento = () => {
    carritoMovimientoInv.forEach(linea => {
      const itemInv = buscarItemInventario(linea.id);
      if (!itemInv) return;
      if (esEntrada) {
        itemInv.stock += linea.cantidad;
      } else {
        itemInv.stock = Math.max(0, itemInv.stock - linea.cantidad);
      }
    });

    const nuevoMov = {
      id: siguienteIdMov(),
      fecha: hoy,
      tipo: tipoMov,
      referencia,
      observacion,
      items: carritoMovimientoInv.map(i => ({
        id: i.id,
        nombre: i.nombre,
        cantidad: i.cantidad,
        contiene: i.contiene
      }))
    };

    movimientosInv.unshift(nuevoMov);
    guardarInventario();
    guardarMovimientosInv();

    carritoMovimientoInv = [];
    if ($('invCantidadInput')) $('invCantidadInput').value = '';
    mostrarAvisoCantidadInv('');
    if ($('invMarcaSelect')) $('invMarcaSelect').selectedIndex = 0;
    if ($('invPresentacionSelect')) {
      $('invPresentacionSelect').innerHTML = '<option value="" disabled selected>Presentación</option>';
      $('invPresentacionSelect').disabled = true;
    }
    if ($('invProductoSelect')) {
      $('invProductoSelect').innerHTML = '<option value="" disabled selected>Producto</option>';
      $('invProductoSelect').disabled = true;
    }
    actualizarInfoProductoInv();
    renderizarCarritoMovimientoInv();
    renderInventario();
    closeModal('modalMovimientoInv');

    toast(`${referencia} (${nuevoMov.id}) aplicada correctamente (${esEntrada ? '+' : '−'}${fmtNum(totalUds)} uds).`);
  };

  if (typeof window.confirmarAccionSistema === 'function') {
    const detalleLineas = carritoMovimientoInv.map(l =>
      `<div class="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-gray-700/60 last:border-0"><span>${esc(l.nombre)}</span><span class="font-bold">${esEntrada ? '+' : '−'}${l.cantidad} (${fmtNum(l.cantidad * l.contiene)} uds)</span></div>`
    ).join('');
    window.confirmarAccionSistema({
      titulo: esEntrada ? 'Confirmar Entrada de Mercancía' : 'Confirmar Merma en Almacén',
      mensaje: esEntrada
        ? '¿Deseas sumar estas existencias al stock del almacén?'
        : '¿Deseas descontar estas existencias por concepto de merma?',
      variante: esEntrada ? 'primary' : 'warning',
      icono: esEntrada ? 'package-plus' : 'package-minus',
      textoConfirmar: esEntrada ? 'Confirmar Entrada' : 'Confirmar Merma',
      detalleHtml: `
        <div class="space-y-1">${detalleLineas}</div>
        <div class="flex justify-between pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 font-bold text-sm">
          <span>Total Unidades:</span>
          <span class="${esEntrada ? 'text-[#1c4d37] dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}">${esEntrada ? '+' : '−'}${fmtNum(totalUds)} uds</span>
        </div>`,
      onConfirm: ejecutarMovimiento
    });
  } else {
    ejecutarMovimiento();
  }
}

// --- Vistas y Filtros del Inventario ---
function cambiarVistaInventario(vista) {
  vistaInventarioActual = vista;
  const esPres = vista === 'presentaciones';
  $('wrapTablaPresentaciones').classList.toggle('hidden', !esPres);
  $('wrapTablaConsolidado').classList.toggle('hidden', esPres);

  const clsActivo = 'px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 bg-[#1c4d37] text-white dark:bg-emerald-600';
  const clsInactivo = 'px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700';
  $('tabInvPresentaciones').className = esPres ? clsActivo : clsInactivo;
  $('tabInvConsolidado').className = !esPres ? clsActivo : clsInactivo;

  renderInventario();
}

function filtrarPorChipMarca(marcaKey) {
  filtroMarcaChip = marcaKey;
  const contenedor = $('invChipsMarca');
  if (contenedor) {
    contenedor.querySelectorAll('[data-marca]').forEach(btn => {
      const activo = btn.getAttribute('data-marca') === marcaKey;
      btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ' + (
        activo
          ? 'bg-[#1c4d37] text-white dark:bg-emerald-600'
          : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      );
    });
  }
  renderInventario();
}

function estadoStockItem(item) {
  if (item.stock <= 0) return 'agotado';
  if (item.stock <= item.stockMin) return 'bajo';
  return 'ok';
}

function badgeEstadoStock(item) {
  const est = estadoStockItem(item);
  if (est === 'agotado') {
    return '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Sin Stock</span>';
  }
  if (est === 'bajo') {
    return '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Stock Bajo</span>';
  }
  return '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Disponible</span>';
}

function renderKPIsInventario() {
  const totalUnidades = inventarioData.reduce((t, i) => t + i.stock * i.contiene, 0);
  const totalEmpaques = inventarioData.reduce((t, i) => t + i.stock, 0);
  const valorTotal = inventarioData.reduce((t, i) => t + i.stock * i.precio, 0);
  const bajos = inventarioData.filter(i => i.stock > 0 && i.stock <= i.stockMin).length;
  const agotados = inventarioData.filter(i => i.stock <= 0).length;

  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set('invKpiUnidades', fmtNum(totalUnidades) + ' uds');
  set('invKpiUnidadesSub', `${movimientosInv.length} movimientos registrados en Kardex`);
  set('invKpiEmpaques', fmtNum(totalEmpaques));
  set('invKpiEmpaquesSub', `${inventarioData.length} presentaciones activas en almacén`);
  set('invKpiValor', fmtUsd(valorTotal));
  set('invKpiValorSub', 'Muchy, Galleterías PUIG y Fisa');
  set('invKpiAlertas', bajos + agotados);
  set('invKpiAlertasSub', `${bajos} en stock bajo · ${agotados} agotados`);
}

let ordenInvPres = { campo: 'nombre', dir: 'asc' };
let ordenInvCons = { campo: 'unidadesTotales', dir: 'desc' };

function ordenarInvPresPor(campo) {
  if (ordenInvPres.campo === campo) {
    ordenInvPres.dir = ordenInvPres.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenInvPres.campo = campo;
    ordenInvPres.dir = (campo === 'stock' || campo === 'unidades' || campo === 'stockMin') ? 'desc' : 'asc';
  }
  renderInventario();
}

function ordenarInvConsPor(campo) {
  if (ordenInvCons.campo === campo) {
    ordenInvCons.dir = ordenInvCons.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenInvCons.campo = campo;
    ordenInvCons.dir = (campo === 'unidadesTotales' || campo === 'valorTotal') ? 'desc' : 'asc';
  }
  renderInventario();
}

function renderInventario() {
  if (!$('tbodyInventarioPres')) return;
  renderKPIsInventario();

  const q = (($('invSearch') && $('invSearch').value) || '').trim().toLowerCase();
  const presFiltro = ($('invFilterPres') && $('invFilterPres').value) || '';
  const estFiltro = ($('invFilterEstado') && $('invFilterEstado').value) || '';

  // 1) Tabla de Existencias por Presentación (25 referencias)
  const filtradosBase = inventarioData.filter(item => {
    if (filtroMarcaChip && item.marcaKey !== filtroMarcaChip) return false;
    if (presFiltro && item.presKey !== presFiltro) return false;
    if (estFiltro && estadoStockItem(item) !== estFiltro) return false;
    if (q && !(item.nombre + ' ' + item.marcaNombre + ' ' + item.ubicacion + ' ' + item.id + ' ' + item.tipo).toLowerCase().includes(q)) return false;
    return true;
  });

  const multP = ordenInvPres.dir === 'asc' ? 1 : -1;
  const filtrados = [...filtradosBase].sort((a, b) => {
    switch (ordenInvPres.campo) {
      case 'nombre': return String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es') * multP;
      case 'tipo': return String(a.tipo || '').localeCompare(String(b.tipo || ''), 'es') * multP;
      case 'ubicacion': return String(a.ubicacion || '').localeCompare(String(b.ubicacion || ''), 'es') * multP;
      case 'stock': return (a.stock - b.stock) * multP;
      case 'unidades': return (a.stock * a.contiene - b.stock * b.contiene) * multP;
      case 'stockMin': return (a.stockMin - b.stockMin) * multP;
      case 'estado': return estadoStockItem(a).localeCompare(estadoStockItem(b), 'es') * multP;
      default: return 0;
    }
  });
  actualizarIconosOrdenDespacho('sortIconInvP', ['nombre', 'tipo', 'ubicacion', 'stock', 'unidades', 'stockMin', 'estado'], ordenInvPres);

  $('tbodyInventarioPres').innerHTML = filtrados.map(item => {
    const uds = item.stock * item.contiene;
    const descPres = item.contiene > 1
      ? `<span class="font-medium text-gray-800 dark:text-gray-200">${esc(item.tipo)}</span> <span class="text-xs text-gray-500 dark:text-gray-400">· ${item.contiene} uds c/u</span>`
      : `<span class="font-medium text-gray-800 dark:text-gray-200">${esc(item.tipo)}</span> <span class="text-xs text-gray-500 dark:text-gray-400">· 1 ud</span>`;

    return `
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
        <td class="px-5 py-3.5">
          <p class="font-semibold text-gray-900 dark:text-white">${esc(item.nombre)}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">${esc(item.marcaNombre)} · ${fmtUsd(item.precio)}</p>
        </td>
        <td class="px-5 py-3.5">${descPres}</td>
        <td class="px-5 py-3.5 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">${esc(item.ubicacion)}</td>
        <td class="px-5 py-3.5 text-center">
          <span class="inline-block min-w-[3.2rem] px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700 text-center font-bold text-gray-900 dark:text-white">${fmtNum(item.stock)}</span>
        </td>
        <td class="px-5 py-3.5 text-center">
          <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-300 font-bold text-xs">
            ${fmtNum(uds)} uds
          </span>
        </td>
        <td class="px-5 py-3.5 text-center text-xs text-gray-500 dark:text-gray-400">${item.stockMin}</td>
        <td class="px-5 py-3.5">${badgeEstadoStock(item)}</td>
        <td class="px-5 py-3.5 text-center">
          <button onclick="abrirModalAjuste('${item.id}')" class="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#1c4d37] hover:text-white dark:bg-gray-700 dark:hover:bg-emerald-600 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors inline-flex items-center gap-1">
            <i data-lucide="sliders" class="w-3.5 h-3.5"></i> Ajustar
          </button>
        </td>
      </tr>`;
  }).join('');

  $('invEmptyPres').classList.toggle('hidden', filtrados.length > 0);

  // 2) Tabla Consolidada por Producto Base (Unidades Individuales + Desglose de Empaques)
  const grupos = {};
  inventarioData.forEach(item => {
    if (filtroMarcaChip && item.marcaKey !== filtroMarcaChip) return;
    if (q && !(item.baseNombre + ' ' + item.nombre + ' ' + item.marcaNombre).toLowerCase().includes(q)) return;

    if (!grupos[item.baseId]) {
      grupos[item.baseId] = {
        baseId: item.baseId,
        baseNombre: item.baseNombre,
        marcaNombre: item.marcaNombre,
        unidadesTotales: 0,
        valorTotal: 0,
        presentaciones: []
      };
    }
    const uds = item.stock * item.contiene;
    grupos[item.baseId].unidadesTotales += uds;
    grupos[item.baseId].valorTotal += item.stock * item.precio;
    grupos[item.baseId].presentaciones.push(item);
  });

  const multC = ordenInvCons.dir === 'asc' ? 1 : -1;
  const listaConsolidada = Object.values(grupos).sort((a, b) => {
    switch (ordenInvCons.campo) {
      case 'baseNombre': return String(a.baseNombre || '').localeCompare(String(b.baseNombre || ''), 'es') * multC;
      case 'marcaNombre': return String(a.marcaNombre || '').localeCompare(String(b.marcaNombre || ''), 'es') * multC;
      case 'unidadesTotales': return (a.unidadesTotales - b.unidadesTotales) * multC;
      case 'valorTotal': return (a.valorTotal - b.valorTotal) * multC;
      default: return 0;
    }
  });
  actualizarIconosOrdenDespacho('sortIconInvC', ['baseNombre', 'marcaNombre', 'unidadesTotales', 'valorTotal'], ordenInvCons);
  const tbodyCons = $('tbodyInventarioConsolidado');
  if (tbodyCons) {
    tbodyCons.innerHTML = listaConsolidada.map(g => {
      const chips = g.presentaciones.map(p => {
        const uds = p.stock * p.contiene;
        const etiq = p.stock === 1 ? p.tipo : p.plural;
        const clsColor = p.contiene > 1
          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60'
          : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60';
        return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${clsColor}">
          <b>${fmtNum(p.stock)} ${esc(etiq)}</b>${p.contiene > 1 ? ` de ${p.contiene} uds` : ''} <span class="text-gray-500 dark:text-gray-400">(= ${fmtNum(uds)} uds)</span>
        </span>`;
      }).join(' ');

      return `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
          <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">${esc(g.baseNombre)}</td>
          <td class="px-6 py-4 text-gray-600 dark:text-gray-300">${esc(g.marcaNombre)}</td>
          <td class="px-6 py-4 text-center">
            <span class="inline-flex items-center px-3 py-1.5 rounded-xl bg-[#1c4d37] text-white dark:bg-emerald-600 font-bold text-sm">
              ${fmtNum(g.unidadesTotales)} uds
            </span>
          </td>
          <td class="px-6 py-4"><div class="flex flex-wrap gap-1.5">${chips}</div></td>
          <td class="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">${fmtUsd(g.valorTotal)}</td>
        </tr>`;
    }).join('');
  }

  if (window.lucide) lucide.createIcons();
}

function ajusteRapidoFila() {
  toast('El ajuste directo con flechas está deshabilitado. Utiliza "Registrar Movimiento" o "Ajustar".');
}

function validarTeclaEnteroIndividual(e) {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    return;
  }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const permitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];
  if (permitidas.includes(e.key)) return;
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
}

function limpiarEnteroNoNegativo(input) {
  if (!input) return;
  let limpio = input.value.replace(/\D+/g, '');
  if (limpio.length > 1) limpio = limpio.replace(/^0+(?=\d)/, '');
  if (input.value !== limpio) input.value = limpio;
}

function pegarEnteroNoNegativo(e, input) {
  e.preventDefault();
  const texto = (e.clipboardData || window.clipboardData).getData('text') || '';
  input.value = texto.replace(/\D+/g, '');
  limpiarEnteroNoNegativo(input);
}

function abrirModalAjuste(id) {
  const item = buscarItemInventario(id);
  if (!item) return;
  $('ajProdId').value = item.id;
  $('ajTituloProd').textContent = item.nombre;
  $('ajSubProd').textContent = `${item.marcaNombre} · ${item.presNombre}`;
  $('ajStockActual').textContent = fmtNum(item.stock);
  $('ajContiene').textContent = `${item.contiene} ${item.contiene === 1 ? 'ud' : 'uds'}`;
  $('ajUnidadesActual').textContent = `${fmtNum(item.stock * item.contiene)} uds`;
  $('ajAccion').value = 'entrada';
  $('ajCantidad').value = '1';
  $('ajStockMin').value = String(item.stockMin);
  $('ajUbicacion').value = item.ubicacion;
  openModal('modalAjusteInv');
}

function guardarAjusteIndividual(e) {
  e.preventDefault();
  const item = buscarItemInventario($('ajProdId').value);
  if (!item) return;

  const accion = $('ajAccion').value;
  const cantRaw = String($('ajCantidad').value || '').trim();
  const minRaw = String($('ajStockMin').value || '').trim();
  if (!/^\d+$/.test(cantRaw) || !/^\d+$/.test(minRaw)) {
    toast('Cantidad y stock mínimo deben ser números enteros válidos (sin letras ni signos).');
    return;
  }
  const cant = parseInt(cantRaw, 10);
  const nuevoMin = parseInt(minRaw, 10);
  const nuevaUbic = $('ajUbicacion').value.trim();

  if ((accion === 'entrada' || accion === 'salida') && cant <= 0) {
    toast('La cantidad debe ser mayor a 0.');
    return;
  }
  if (accion === 'salida' && cant > item.stock) {
    toast(`No puedes descontar ${cant} por merma porque el stock actual es ${item.stock}.`);
    return;
  }

  let diferencia = 0;
  let tipoKardex = 'entrada';
  if (accion === 'entrada') {
    diferencia = cant;
    item.stock += cant;
    tipoKardex = 'entrada';
  } else if (accion === 'salida') {
    diferencia = cant;
    item.stock = Math.max(0, item.stock - cant);
    tipoKardex = 'ajuste';
  } else {
    diferencia = Math.abs(cant - item.stock);
    tipoKardex = cant >= item.stock ? 'entrada' : 'ajuste';
    item.stock = Math.max(0, cant);
  }

  if (!isNaN(nuevoMin) && nuevoMin >= 0) item.stockMin = nuevoMin;
  if (nuevaUbic) item.ubicacion = nuevaUbic;

  if (diferencia > 0) {
    movimientosInv.unshift({
      id: siguienteIdMov(),
      fecha: hoy,
      tipo: tipoKardex,
      referencia: tipoKardex === 'entrada' ? 'Entrada de Mercancía' : 'Merma de Almacén',
      observacion: 'Control individual de stock',
      items: [{ id: item.id, nombre: item.nombre, cantidad: diferencia, contiene: item.contiene }]
    });
    guardarMovimientosInv();
  }

  guardarInventario();
  closeModal('modalAjusteInv');
  renderInventario();
  cargarProductosInv();
  toast(`Inventario de "${item.nombre}" actualizado.`);
}

function abrirKardex() {
  const tbody = $('tbodyKardex');
  if (!tbody) return;

  tbody.innerHTML = movimientosInv.length ? movimientosInv.map(m => {
    const esEntrada = m.tipo === 'entrada';
    const badgeTipo = esEntrada
      ? '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Entrada (+)</span>'
      : m.tipo === 'salida'
        ? '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Salida Despacho (−)</span>'
        : '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Merma (−)</span>';

    const totalUds = (m.items || []).reduce((t, i) => t + i.cantidad * (i.contiene || 1), 0);
    const detalleItems = (m.items || []).map(i =>
      `<span class="inline-block text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-1 mb-1">${i.cantidad}× ${esc(i.nombre)} (${fmtNum(i.cantidad * (i.contiene || 1))} uds)</span>`
    ).join('');

    return `
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
        <td class="px-4 py-3 whitespace-nowrap">
          <p class="font-semibold text-[#1c4d37] dark:text-emerald-400">${esc(m.id)}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">${esc(m.fecha)}</p>
        </td>
        <td class="px-4 py-3">${badgeTipo}</td>
        <td class="px-4 py-3">
          <p class="font-medium text-gray-800 dark:text-gray-100">${esc(m.referencia)}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">${esc(m.observacion || '')}</p>
        </td>
        <td class="px-4 py-3">${detalleItems}</td>
        <td class="px-4 py-3 text-center font-bold ${esEntrada ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}">
          ${esEntrada ? '+' : '−'}${fmtNum(totalUds)} uds
        </td>
      </tr>`;
  }).join('') : '<tr><td colspan="5" class="text-center py-8 text-gray-400">No hay movimientos registrados.</td></tr>';

  openModal('modalKardex');
  if (window.lucide) lucide.createIcons();
}

function bloquearNoEnterosDespacho(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const permitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];
  if (permitidas.includes(e.key)) return;
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    return;
  }
  if (e.key === '0' && (!e.target.value || (e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length))) {
    e.preventDefault();
  }
}

function limpiarEnteroDespacho(input) {
  if (!input) return;
  const limpio = input.value.replace(/\D+/g, '').replace(/^0+/, '');
  if (input.value !== limpio) input.value = limpio;
}

function initInventario() {
  cargarMarcasInv();
  seleccionarTipoMovimiento('entrada');
  renderizarCarritoMovimientoInv();
  renderInventario();

  ['modalMovimientoInv', 'modalAjusteInv', 'modalKardex'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('click', e => { if (e.target.id === id) closeModal(id); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['modalMovimientoInv', 'modalAjusteInv', 'modalKardex'].forEach(id => {
        const el = $(id);
        if (el && !el.classList.contains('hidden')) closeModal(id);
      });
    }
  });
  window.addEventListener('storage', () => {
    inventarioData = cargarInventario();
    movimientosInv = cargarMovimientosInv();
    renderInventario();
    cargarProductosInv();
  });
}
