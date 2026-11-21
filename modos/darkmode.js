// /modos/darkmode.js

function aplicarTemaInmediato() {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark' || (!currentTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
}

aplicarTemaInmediato();

function rutaBaseProyecto() {
  const pathActual = decodeURIComponent(window.location.pathname || '');
  return /Modulo de /i.test(pathActual) ? '../' : '';
}

const RUTAS_VENDEDORES_SISTEMA = ['Ruta 2', 'Ruta 3', 'Ruta 4', 'Ruta 5', 'Ruta 9'];
window.RUTAS_VENDEDORES_SISTEMA = RUTAS_VENDEDORES_SISTEMA;

function normalizarRutaSistema(raw, fallback = 'Ruta 2') {
  const s = String(raw || '').trim();
  if (!s) return fallback;
  const low = s.toLowerCase();
  const m = low.match(/ruta\s*([0-9]+)|^([23459])$/);
  if (m) {
    const num = m[1] || m[2];
    const cand = `Ruta ${num}`;
    if (RUTAS_VENDEDORES_SISTEMA.includes(cand)) return cand;
    return cand;
  }
  return s;
}
window.normalizarRutaSistema = normalizarRutaSistema;

const CLIENTES_RUTA_DEFAULT_MAP = {
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
window.CLIENTES_RUTA_DEFAULT_MAP = CLIENTES_RUTA_DEFAULT_MAP;

const CLIENTES_SEMILLA_GLOBAL = [
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
window.CLIENTES_SEMILLA_GLOBAL = CLIENTES_SEMILLA_GLOBAL;

const USUARIOS_SEMILLA_GLOBAL = [
  { id: 'USR-001', nombre: 'Administrador Maestro', username: 'superadmin', password: '1234', rol: 'Superadmin', ruta: 'Dirección General', email: 'superadmin@gentilsupply.com', telefono: '0414-7900001', estado: 'Activo' },
  { id: 'USR-002', nombre: 'Carlos Eduardo Gentil', username: 'gerente', password: '1234', rol: 'Gerente', ruta: 'Gerencia General', email: 'gerencia@gentilsupply.com', telefono: '0414-7900002', estado: 'Activo' },
  { id: 'USR-003', nombre: 'Vendedor Ruta 2', username: 'ruta2', password: '1234', rol: 'Vendedor', ruta: 'Ruta 2', email: 'ruta2@gentilsupply.com', telefono: '0412-3548810', estado: 'Activo' },
  { id: 'USR-004', nombre: 'Mariana Salazar', username: 'facturacion', password: '1234', rol: 'Facturación', ruta: 'Facturación y Cobranzas', email: 'facturacion@gentilsupply.com', telefono: '0424-8812200', estado: 'Activo' },
  { id: 'USR-005', nombre: 'José Rodríguez', username: 'despacho', password: '1234', rol: 'Operador de Despacho', ruta: 'Almacén El Piache', email: 'despacho@gentilsupply.com', telefono: '0416-6950099', estado: 'Activo' },
  { id: 'USR-006', nombre: 'Vendedor Ruta 3', username: 'ruta3', password: '1234', rol: 'Vendedor', ruta: 'Ruta 3', email: 'ruta3@gentilsupply.com', telefono: '0412-3548813', estado: 'Activo' },
  { id: 'USR-007', nombre: 'Vendedor Ruta 4', username: 'ruta4', password: '1234', rol: 'Vendedor', ruta: 'Ruta 4', email: 'ruta4@gentilsupply.com', telefono: '0414-3548814', estado: 'Activo' },
  { id: 'USR-008', nombre: 'Vendedor Ruta 5', username: 'ruta5', password: '1234', rol: 'Vendedor', ruta: 'Ruta 5', email: 'ruta5@gentilsupply.com', telefono: '0416-3548815', estado: 'Activo' },
  { id: 'USR-009', nombre: 'Vendedor Ruta 9', username: 'ruta9', password: '1234', rol: 'Vendedor', ruta: 'Ruta 9', email: 'ruta9@gentilsupply.com', telefono: '0424-3548819', estado: 'Activo' }
];
window.USUARIOS_SEMILLA_GLOBAL = USUARIOS_SEMILLA_GLOBAL;

function validarAccesoSesionModulo() {
  // Requisito temporal desactivado por solicitud del usuario: permite navegar a cualquier módulo sin login obligatorio.
}

// =============================================================================
// CONEXIÓN DIRECTA A BASE DE DATOS MYSQL + FORMATO FAC EN TODAS LAS FACTURAS
// =============================================================================
function normalizarNumeroFacturaFAC(raw, corrFallback = 1) {
  const s = String(raw ?? '').trim().toUpperCase();
  if (s) {
    const mFac = s.match(/^FAC-(\d+)$/);
    if (mFac) return 'FAC-' + String(Math.max(1, parseInt(mFac[1], 10))).padStart(6, '0');
    const mNum = s.match(/(\d+)/);
    if (mNum) return 'FAC-' + String(Math.max(1, parseInt(mNum[1], 10))).padStart(6, '0');
  }
  return 'FAC-' + String(Math.max(1, parseInt(corrFallback, 10) || 1)).padStart(6, '0');
}
window.normalizarNumeroFacturaFAC = normalizarNumeroFacturaFAC;

function normalizarNumeroControlFAC(raw, corrFallback = 1) {
  const s = String(raw ?? '').trim();
  if (/^\d{2}-\d{6}$/.test(s)) return s;
  const m = s.match(/(\d+)/);
  const num = m ? Math.max(1, parseInt(m[1], 10)) : Math.max(1, parseInt(corrFallback, 10) || 1);
  return '00-' + String(num).padStart(6, '0');
}

function normalizarListaFacturasFAC(lista, _origSet) {
  if (!Array.isArray(lista)) return lista;
  let cambio = false;
  const norm = lista.map((f, idx) => {
    if (!f || typeof f !== 'object') return f;
    const corrBase = Number(f.correlativo) > 0 ? Number(f.correlativo) : (idx + 1);
    const numFAC = normalizarNumeroFacturaFAC(f.numero, corrBase);
    const m = numFAC.match(/(\d+)/);
    const corr = m ? parseInt(m[1], 10) : corrBase;
    const ctrl = normalizarNumeroControlFAC(f.control, corr);
    if (f.numero !== numFAC || f.correlativo !== corr || f.control !== ctrl) {
      cambio = true;
      return Object.assign({}, f, { correlativo: corr, numero: numFAC, control: ctrl });
    }
    return f;
  });
  if (cambio && typeof _origSet === 'function') {
    try { _origSet.call(localStorage, 'gs_facturas_v1', JSON.stringify(norm)); } catch (e) {}
  }
  return norm;
}

(function initPuenteBaseDatosGentilSupply() {
  const DB_CLAVES = new Set([
    'gs_clientes_v1',
    'gs_inventario_v1',
    'gs_movimientos_inv_v1',
    'gs_ventas_v2',
    'gs_pagos_v2',
    'gs_facturas_v1',
    'gs_despachos_v1',
    'gs_usuarios_v1',
    'gs_tasa_bcv',
    'gs_tasa_bcv_meta'
  ]);

  const _origSetItem = Storage.prototype.setItem;
  const _ultimoSnapshotDb = {};
  const _colaSync = {};
  let _timerSync = null;

  function urlApiBaseDatos() {
    return `${rutaBaseProyecto()}Base de Datos/api.php`;
  }

  // 1. Hidratar desde MySQL si el servidor PHP entregó datos reales en bootstrap_db.php
  const boot = window.__GS_DB_BOOTSTRAP__;
  if (boot && boot.conectado === true) {
    DB_CLAVES.forEach(k => {
      if (!(k in boot) || boot[k] === null || boot[k] === undefined) return;
      if (k === 'gs_tasa_bcv' || k === 'gs_tasa_bcv_meta') {
        const valStr = typeof boot[k] === 'string' ? boot[k] : JSON.stringify(boot[k]);
        if (valStr && valStr !== 'null') {
          _origSetItem.call(localStorage, k, valStr);
          _ultimoSnapshotDb[k] = valStr;
        }
        return;
      }
      if (Array.isArray(boot[k])) {
        const valArr = k === 'gs_facturas_v1' ? normalizarListaFacturasFAC(boot[k], null) : boot[k];
        if (valArr.length > 0 || localStorage.getItem(k) === null) {
          const jsonStr = JSON.stringify(valArr);
          _origSetItem.call(localStorage, k, jsonStr);
          _ultimoSnapshotDb[k] = jsonStr;
        }
      }
    });
  }

  // 2. Garantizar formato FAC-XXXXXX, rutas comerciales individuales y vendedores (Ruta 2, 3, 4, 5 y 9)
  try {
    const rawCli = localStorage.getItem('gs_clientes_v1');
    if (rawCli) {
      const parsedC = JSON.parse(rawCli);
      if (Array.isArray(parsedC) && parsedC.length) {
        let modC = false;
        const normC = parsedC.map(c => {
          if (!c || typeof c !== 'object') return c;
          const rutaMap = CLIENTES_RUTA_DEFAULT_MAP[c.nombre];
          const rutaActual = c.ruta ? normalizarRutaSistema(c.ruta) : (rutaMap || 'Ruta 2');
          const activoActual = c.activo !== false && c.activo !== 0 && c.activo !== '0';
          if (c.ruta !== rutaActual || c.activo !== activoActual) {
            modC = true;
            return Object.assign({}, c, { ruta: rutaActual, activo: activoActual });
          }
          return c;
        });
        CLIENTES_SEMILLA_GLOBAL.forEach(seed => {
          if (!normC.some(x => x && (x.nombre === seed.nombre || x.rif === seed.rif))) {
            normC.push(Object.assign({}, seed, { activo: true }));
            modC = true;
          }
        });
        if (modC) _origSetItem.call(localStorage, 'gs_clientes_v1', JSON.stringify(normC));
      }
    } else {
      _origSetItem.call(localStorage, 'gs_clientes_v1', JSON.stringify(CLIENTES_SEMILLA_GLOBAL.map(s => Object.assign({}, s, { activo: true }))));
    }

    const rawUsr = localStorage.getItem('gs_usuarios_v1');
    if (rawUsr) {
      const parsedU = JSON.parse(rawUsr);
      if (Array.isArray(parsedU) && parsedU.length) {
        let modU = false;
        const normU = parsedU.map(u => {
          if (!u || typeof u !== 'object') return u;
          let cambiado = false;
          let nuevoObj = Object.assign({}, u);
          if (u.rol === 'Vendedor') {
            const rutaNorm = normalizarRutaSistema(u.ruta || u.username);
            if (u.ruta !== rutaNorm) {
              nuevoObj.ruta = rutaNorm;
              cambiado = true;
            }
          } else if (u.ruta === 'Almacén La Asunción') {
            nuevoObj.ruta = 'Almacén El Piache';
            cambiado = true;
          }
          if (!u.password) {
            const matchSeed = USUARIOS_SEMILLA_GLOBAL.find(s => String(s.username).toLowerCase() === String(u.username || '').toLowerCase());
            nuevoObj.password = matchSeed ? matchSeed.password : '1234';
            cambiado = true;
          }
          if (cambiado) modU = true;
          return cambiado ? nuevoObj : u;
        });
        USUARIOS_SEMILLA_GLOBAL.forEach(seedU => {
          if (!normU.some(x => x && String(x.username || '').toLowerCase() === seedU.username.toLowerCase())) {
            normU.push(Object.assign({}, seedU));
            modU = true;
          }
        });
        if (modU) _origSetItem.call(localStorage, 'gs_usuarios_v1', JSON.stringify(normU));
      }
    } else {
      _origSetItem.call(localStorage, 'gs_usuarios_v1', JSON.stringify(USUARIOS_SEMILLA_GLOBAL));
    }

    const rawVen = localStorage.getItem('gs_ventas_v2');
    if (rawVen) {
      const parsedV = JSON.parse(rawVen);
      if (Array.isArray(parsedV) && parsedV.length) {
        const listaCliActual = JSON.parse(localStorage.getItem('gs_clientes_v1') || '[]');
        let modV = false;
        const normV = parsedV.map(v => {
          if (!v || typeof v !== 'object') return v;
          const cliRel = listaCliActual.find(c => c && c.nombre === v.cliente);
          const rutaEsperada = normalizarRutaSistema(
            v.ruta || (cliRel && cliRel.ruta) || CLIENTES_RUTA_DEFAULT_MAP[v.cliente] || 'Ruta 2'
          );
          if (v.ruta !== rutaEsperada) {
            modV = true;
            return Object.assign({}, v, { ruta: rutaEsperada });
          }
          return v;
        });
        if (modV) _origSetItem.call(localStorage, 'gs_ventas_v2', JSON.stringify(normV));
      }
    }

    const rawFac = localStorage.getItem('gs_facturas_v1');
    if (rawFac) {
      const parsed = JSON.parse(rawFac);
      if (Array.isArray(parsed)) {
        normalizarListaFacturasFAC(parsed, _origSetItem);
      }
    }
    const rawDesp = localStorage.getItem('gs_despachos_v1');
    if (rawDesp) {
      const parsedD = JSON.parse(rawDesp);
      if (Array.isArray(parsedD)) {
        let modD = false;
        const normD = parsedD.map((d, i) => {
          if (d && d.facturaNumero) {
            const fn = normalizarNumeroFacturaFAC(d.facturaNumero, i + 1);
            if (fn !== d.facturaNumero) {
              modD = true;
              return Object.assign({}, d, { facturaNumero: fn });
            }
          }
          return d;
        });
        if (modD) _origSetItem.call(localStorage, 'gs_despachos_v1', JSON.stringify(normD));
      }
    }
  } catch (e) {}

  function enviarLoteSync(usarBeacon) {
    const claves = Object.keys(_colaSync);
    if (!claves.length) return;
    const payload = {};
    claves.forEach(k => {
      payload[k] = _colaSync[k];
      delete _colaSync[k];
    });
    const bodyStr = JSON.stringify({ action: 'sync_all', payload });
    const endpoint = urlApiBaseDatos();

    if (usarBeacon && navigator.sendBeacon) {
      try {
        const blob = new Blob([bodyStr], { type: 'application/json' });
        if (navigator.sendBeacon(endpoint, blob)) return;
      } catch (e) {}
    }

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyStr,
      keepalive: true
    }).catch(() => {});
  }

  function programarSync(key, rawValue) {
    if (_ultimoSnapshotDb[key] === rawValue) return;
    _ultimoSnapshotDb[key] = rawValue;

    let parsed = rawValue;
    if (key !== 'gs_tasa_bcv') {
      try { parsed = JSON.parse(rawValue); } catch (e) { return; }
    }
    _colaSync[key] = parsed;
    clearTimeout(_timerSync);
    _timerSync = setTimeout(() => enviarLoteSync(false), 20);
  }

  // 3. Interceptar escrituras en localStorage para reflejarlas automáticamente en MySQL
  Storage.prototype.setItem = function(key, value) {
    let valFinal = String(value);
    if (this === window.localStorage && DB_CLAVES.has(key)) {
      if (key === 'gs_facturas_v1') {
        try {
          const parsed = JSON.parse(valFinal);
          if (Array.isArray(parsed)) {
            valFinal = JSON.stringify(normalizarListaFacturasFAC(parsed, null));
          }
        } catch (e) {}
      } else if (key === 'gs_despachos_v1') {
        try {
          const parsedD = JSON.parse(valFinal);
          if (Array.isArray(parsedD)) {
            valFinal = JSON.stringify(parsedD.map((d, i) => (
              d && d.facturaNumero ? Object.assign({}, d, { facturaNumero: normalizarNumeroFacturaFAC(d.facturaNumero, i + 1) }) : d
            )));
          }
        } catch (e) {}
      }
      _origSetItem.call(this, key, valFinal);
      programarSync(key, valFinal);
      return;
    }
    _origSetItem.call(this, key, valFinal);
  };

  window.addEventListener('pagehide', () => {
    clearTimeout(_timerSync);
    enviarLoteSync(true);
  });

  window.gsSincronizarTodoConDB = function() {
    DB_CLAVES.forEach(k => {
      const v = localStorage.getItem(k);
      if (v === null) return;
      try {
        _colaSync[k] = k === 'gs_tasa_bcv' ? v : JSON.parse(v);
      } catch (e) {}
    });
    enviarLoteSync(false);
  };

  window.gsEstadoBaseDatos = function() {
    return {
      conectado: Boolean(window.__GS_DB_BOOTSTRAP__ && window.__GS_DB_BOOTSTRAP__.conectado),
      error: (window.__GS_DB_BOOTSTRAP__ && window.__GS_DB_BOOTSTRAP__.error) || null
    };
  };
})();

// Inyecta estilos globales: sidebar flexible con desplazamiento por mouse y datagrids compactos estilo Registro de Pagos
function initEstilosSistemaUI() {
  if (document.getElementById('gentilUiEnhancements')) return;
  const style = document.createElement('style');
  style.id = 'gentilUiEnhancements';
  style.textContent = `
    /* Sidebar flexible: permite subir y bajar suavemente con la rueda del mouse */
    aside {
      height: 100vh;
      max-height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      scroll-behavior: smooth;
      gap: 1rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.28) transparent;
    }
    aside > * {
      flex-shrink: 0;
    }
    aside::-webkit-scrollbar {
      width: 6px;
    }
    aside::-webkit-scrollbar-track {
      background: transparent;
    }
    aside::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.24);
      border-radius: 9999px;
    }
    aside::-webkit-scrollbar-thumb:hover {
      background-color: rgba(255, 255, 255, 0.42);
    }

    /* Datagrids compactos con diseño limpio estilo Historial de Ventas y tipografía compacta */
    table.datagrid-compacto {
      font-size: 0.78rem;
      line-height: 1.35;
      color: #4b5563;
      border-collapse: collapse;
    }
    html.dark table.datagrid-compacto {
      color: #d1d5db;
    }
    table.datagrid-compacto thead {
      background-color: transparent !important;
      border-bottom: 1px solid #f3f4f6 !important;
    }
    html.dark table.datagrid-compacto thead {
      background-color: transparent !important;
      border-bottom: 1px solid #374151 !important;
    }
    table.datagrid-compacto thead tr {
      background-color: transparent !important;
    }
    table.datagrid-compacto thead th {
      font-size: 0.6875rem !important;
      line-height: 1.25 !important;
      padding: 0.65rem 0.85rem !important;
      font-weight: 700 !important;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #064e3b;
      border-radius: 0.5rem;
      transition: background-color 0.15s ease;
    }
    table.datagrid-compacto thead th[onclick]:hover {
      background-color: rgba(236, 253, 245, 0.75);
    }
    html.dark table.datagrid-compacto thead th {
      color: #34d399;
    }
    html.dark table.datagrid-compacto thead th[onclick]:hover {
      background-color: rgba(55, 65, 81, 0.6);
    }
    table.datagrid-compacto tbody tr {
      border-color: #f9fafb;
    }
    html.dark table.datagrid-compacto tbody tr {
      border-color: #374151;
    }
    table.datagrid-compacto tbody td {
      font-size: 0.78rem !important;
      line-height: 1.35 !important;
      padding: 0.65rem 0.85rem !important;
    }
    table.datagrid-compacto tbody td .text-sm,
    table.datagrid-compacto tbody td .text-base {
      font-size: 0.78rem !important;
      line-height: 1.35 !important;
    }
    table.datagrid-compacto tbody td .text-xs {
      font-size: 0.6875rem !important;
      line-height: 1.3 !important;
    }
    table.datagrid-compacto tbody td .text-\\[11px\\],
    table.datagrid-compacto tbody td .text-\\[10px\\] {
      font-size: 0.64rem !important;
      line-height: 1.25 !important;
    }
    table.datagrid-compacto tbody td button,
    table.datagrid-compacto tbody td a {
      font-size: 0.7rem !important;
    }

    /* Desplegables unificados en todo el sistema estilo Rastreo por Municipios ("Todos los Municipios") */
    select:not(#selectorRutaActivaVentas) {
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      appearance: none !important;
      background-color: #f9fafb !important;
      border: 1px solid #e5e7eb !important;
      color: #374151 !important;
      border-radius: 0.5rem !important;
      font-size: 0.875rem !important;
      line-height: 1.25rem !important;
      padding: 0.625rem 2.5rem 0.625rem 1rem !important;
      cursor: pointer;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    select:not(#selectorRutaActivaVentas):focus {
      outline: none !important;
      border-color: #1c4d37 !important;
      box-shadow: 0 0 0 2px rgba(28, 77, 55, 0.2) !important;
    }
    html.dark select:not(#selectorRutaActivaVentas) {
      background-color: #111827 !important;
      border-color: #374151 !important;
      color: #e5e7eb !important;
    }
    html.dark select:not(#selectorRutaActivaVentas) option {
      background-color: #111827;
      color: #f3f4f6;
    }
    select#selectorRutaActivaVentas {
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      appearance: none !important;
      background-color: #f9fafb !important;
      border: 1px solid #e5e7eb !important;
      color: #1c4d37 !important;
      border-radius: 0.5rem !important;
      padding: 0.25rem 2rem 0.25rem 0.75rem !important;
      font-size: 0.875rem !important;
      font-weight: 700 !important;
      cursor: pointer;
    }
    html.dark select#selectorRutaActivaVentas {
      background-color: #111827 !important;
      border-color: #374151 !important;
      color: #34d399 !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
}
initEstilosSistemaUI();

// Sincroniza dinámicamente el color de letras, ejes, leyendas y grillas de Chart.js con el modo claro y oscuro
function sincronizarGraficasYTextoTema() {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#f3f4f6' : '#1f2937';
  const subTextColor = isDark ? '#d1d5db' : '#4b5563';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(17, 24, 39, 0.08)';

  if (!window.Chart) return;
  window.Chart.defaults.color = textColor;
  window.Chart.defaults.borderColor = gridColor;

  const instancias = window.Chart.instances ? Object.values(window.Chart.instances) : [];
  instancias.forEach(chart => {
    if (!chart || !chart.options) return;
    chart.options.color = textColor;
    if (!chart.options.plugins) chart.options.plugins = {};
    if (!chart.options.plugins.legend) chart.options.plugins.legend = {};
    if (!chart.options.plugins.legend.labels) chart.options.plugins.legend.labels = {};
    chart.options.plugins.legend.labels.color = textColor;

    if (chart.options.plugins.title) {
      chart.options.plugins.title.color = textColor;
    }

    if (chart.options.scales) {
      Object.values(chart.options.scales).forEach(scale => {
        if (!scale) return;
        if (!scale.ticks) scale.ticks = {};
        scale.ticks.color = subTextColor;
        if (!scale.grid) scale.grid = {};
        scale.grid.color = gridColor;
        if (scale.title) scale.title.color = textColor;
      });
    }
    chart.update('none');
  });
}

window.sincronizarGraficasYTextoTema = sincronizarGraficasYTextoTema;

// Carga automática del conector de tasa oficial BCV (../API's/bcv.js) en todos los módulos
function initConectorBCV() {
  if (window.sincronizarTasaBCV || document.getElementById('scriptConectorBCV')) return;
  const s = document.createElement('script');
  s.id = 'scriptConectorBCV';
  s.src = `${rutaBaseProyecto()}API's/bcv.js`;
  document.head.appendChild(s);
}
initConectorBCV();

function cerrarSesionSistema() {
  confirmarAccionSistema({
    titulo: 'Cerrar Sesión',
    mensaje: '¿Deseas cerrar la sesión actual y volver al inicio de sesión?',
    icono: 'log-out',
    textoConfirmar: 'Cerrar Sesión',
    onConfirm: () => {
      try { localStorage.removeItem('gs_sesion_activa'); } catch (e) {}
      window.location.href = `${rutaBaseProyecto()}login.php`;
    }
  });
}
window.cerrarSesionSistema = cerrarSesionSistema;

// Suprime el título del documento durante window.print() en todos los módulos para evitar encabezados del navegador
let _sysTituloPrevioImpresion = '';
window.addEventListener('beforeprint', () => {
  if (document.title && document.title !== '\u200B') {
    _sysTituloPrevioImpresion = document.title;
    document.title = '\u200B';
  }
});
window.addEventListener('afterprint', () => {
  if (_sysTituloPrevioImpresion) {
    document.title = _sysTituloPrevioImpresion;
    _sysTituloPrevioImpresion = '';
  }
});

function initSaludoRolModulo() {
  const pathActual = decodeURIComponent(window.location.pathname || '');
  if (!/Modulo de /i.test(pathActual) || pathActual.includes('Modulo de Ventas')) return;

  let rolDefecto = 'Administrador';
  if (pathActual.includes('Modulo de facturacion')) rolDefecto = 'Facturación';
  else if (pathActual.includes('Modulo de Despacho')) rolDefecto = 'Operador de Despacho';
  else if (pathActual.includes('Modulo de Administrador')) rolDefecto = 'Gerente';
  else if (pathActual.includes('Modulo de Superadmin')) rolDefecto = 'Superadmin';

  let rolActivo = rolDefecto;
  try {
    const ses = JSON.parse(localStorage.getItem('gs_sesion_activa'));
    if (ses && ses.rol) rolActivo = ses.rol;
  } catch (e) {}

  document.querySelectorAll('.nombreRolModulo').forEach(el => {
    el.textContent = rolActivo;
  });

  if (pathActual.includes('Modulo de facturacion')) {
    const sideUser = document.querySelector('aside p.font-semibold.text-sm.text-white');
    if (sideUser && sideUser.textContent.trim() === 'Admin') {
      sideUser.textContent = rolActivo;
    }
  }
}

// Inicializar el estado al cargar cualquier página
document.addEventListener('DOMContentLoaded', () => {
  aplicarTemaInmediato();
  initEstilosSistemaUI();
  initConectorBCV();
  initLogoModuloSuperior();
  initSaludoRolModulo();
  initBotonRetornoAdmin();
  sincronizarGraficasYTextoTema();
  requestAnimationFrame(() => {
    sincronizarGraficasYTextoTema();
    requestAnimationFrame(() => {
      document.documentElement.classList.add('theme-ready');
      sincronizarGraficasYTextoTema();
    });
  });
});

// Función global para alternar y persistir el modo oscuro
function toggleDarkMode() {
  document.documentElement.classList.add('theme-ready');
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
    localStorage.setItem('theme', 'dark');
  }
  sincronizarGraficasYTextoTema();
}

// Notificación del sistema unificada (reemplaza las alertas nativas de localhost)
let _sysToastTimer;
function mostrarNotificacionSistema(msg) {
  if (typeof window.toast === 'function' && window.toast !== mostrarNotificacionSistema) {
    window.toast(msg);
    return;
  }
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'hidden opacity-0 translate-y-2 transition-all duration-300 fixed bottom-6 right-6 z-[100] max-w-md px-5 py-3 rounded-xl bg-[#1c4d37] dark:bg-emerald-600 text-white text-sm shadow-lg';
    document.body.appendChild(t);
  }
  t.textContent = String(msg ?? '');
  t.classList.remove('hidden');
  requestAnimationFrame(() => t.classList.remove('opacity-0', 'translate-y-2'));
  clearTimeout(_sysToastTimer);
  _sysToastTimer = setTimeout(() => {
    t.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => t.classList.add('hidden'), 300);
  }, 3200);
}

// Reemplazar window.alert para que ningún error muestre el diálogo nativo "localhost dice..."
window.alert = function(msg) {
  mostrarNotificacionSistema(msg);
};

// Cuadro de confirmación del sistema (estilo tarjeta modal Gentil Supply, sin diálogo nativo del navegador)
let _sysConfirmCallback = null;

function _asegurarModalConfirmacionSistema() {
  let modal = document.getElementById('modalConfirmacionSistema');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'modalConfirmacionSistema';
  modal.className = 'fixed inset-0 z-[90] hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200';
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 text-center space-y-4">
      <div id="sysConfirmIconWrap" class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-400 flex items-center justify-center mx-auto">
        <i id="sysConfirmIcon" data-lucide="shield-check" class="w-9 h-9"></i>
      </div>
      <div>
        <h3 id="sysConfirmTitulo" class="text-xl font-bold text-[#1c4d37] dark:text-white">Confirmar acción</h3>
        <p id="sysConfirmMensaje" class="text-sm text-gray-500 dark:text-gray-400 mt-1"></p>
      </div>
      <div id="sysConfirmDetalle" class="hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-left text-sm space-y-2"></div>
      <div class="flex gap-3 pt-2">
        <button type="button" id="sysConfirmBtnCancelar" class="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold transition-colors text-sm">
          Cancelar
        </button>
        <button type="button" id="sysConfirmBtnAceptar" class="flex-1 bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-semibold shadow-sm transition-colors text-sm">
          Confirmar
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const btnCancelar = document.getElementById('sysConfirmBtnCancelar');
  const btnAceptar = document.getElementById('sysConfirmBtnAceptar');
  btnCancelar.addEventListener('click', () => cerrarConfirmacionSistema());
  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) cerrarConfirmacionSistema();
  });
  btnAceptar.addEventListener('click', () => {
    const cb = _sysConfirmCallback;
    cerrarConfirmacionSistema();
    if (typeof cb === 'function') cb();
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !modal.classList.contains('hidden')) {
      cerrarConfirmacionSistema();
    }
  });
  return modal;
}

function cerrarConfirmacionSistema() {
  _sysConfirmCallback = null;
  const modal = document.getElementById('modalConfirmacionSistema');
  if (!modal || modal.classList.contains('hidden')) return;
  modal.classList.add('opacity-0');
  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }, 200);
}

function confirmarAccionSistema(opciones) {
  const cfg = opciones || {};
  const modal = _asegurarModalConfirmacionSistema();
  const variante = cfg.variante === 'danger' ? 'danger' : (cfg.variante === 'warning' ? 'warning' : 'primary');

  const iconWrap = document.getElementById('sysConfirmIconWrap');
  const iconEl = document.getElementById('sysConfirmIcon');
  const tituloEl = document.getElementById('sysConfirmTitulo');
  const msgEl = document.getElementById('sysConfirmMensaje');
  const detalleEl = document.getElementById('sysConfirmDetalle');
  const btnCancelar = document.getElementById('sysConfirmBtnCancelar');
  const btnAceptar = document.getElementById('sysConfirmBtnAceptar');

  if (variante === 'danger') {
    iconWrap.className = 'w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto';
    tituloEl.className = 'text-xl font-bold text-red-600 dark:text-red-400';
    btnAceptar.className = 'flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-semibold shadow-sm transition-colors text-sm';
  } else if (variante === 'warning') {
    iconWrap.className = 'w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto';
    tituloEl.className = 'text-xl font-bold text-[#1c4d37] dark:text-white';
    btnAceptar.className = 'flex-1 bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-semibold shadow-sm transition-colors text-sm';
  } else {
    iconWrap.className = 'w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-400 flex items-center justify-center mx-auto';
    tituloEl.className = 'text-xl font-bold text-[#1c4d37] dark:text-white';
    btnAceptar.className = 'flex-1 bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-semibold shadow-sm transition-colors text-sm';
  }

  iconWrap.innerHTML = `<i id="sysConfirmIcon" data-lucide="${cfg.icono || (variante === 'danger' ? 'alert-triangle' : 'shield-check')}" class="w-9 h-9"></i>`;
  tituloEl.textContent = cfg.titulo || 'Confirmar acción';
  msgEl.textContent = cfg.mensaje || '';
  btnCancelar.textContent = cfg.textoCancelar || 'Cancelar';
  btnAceptar.textContent = cfg.textoConfirmar || 'Confirmar';

  if (cfg.detalleHtml) {
    detalleEl.innerHTML = cfg.detalleHtml;
    detalleEl.classList.remove('hidden');
  } else {
    detalleEl.innerHTML = '';
    detalleEl.classList.add('hidden');
  }

  _sysConfirmCallback = typeof cfg.onConfirm === 'function' ? cfg.onConfirm : null;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  requestAnimationFrame(() => modal.classList.remove('opacity-0'));
  if (window.lucide) window.lucide.createIcons();
}

window.confirmarAccionSistema = confirmarAccionSistema;
window.cerrarConfirmacionSistema = cerrarConfirmacionSistema;

// Inserta o verifica el pequeño logo identificador del módulo en la esquina superior izquierda del contenido principal (ajeno al sidebar)
function initLogoModuloSuperior() {
  if (document.querySelector('[data-logo-modulo]')) return;
  const pathActual = decodeURIComponent(window.location.pathname || '');
  if (!/Modulo de /i.test(pathActual)) return;
  const main = document.querySelector('main');
  if (!main) return;

  let cfg = { icono: 'box', nombre: 'Módulo General' };
  if (pathActual.includes('Modulo de Ventas')) {
    cfg = { icono: 'shopping-bag', nombre: 'Módulo de Ventas' };
  } else if (pathActual.includes('Modulo de facturacion')) {
    cfg = { icono: 'receipt', nombre: 'Módulo de Facturación' };
  } else if (pathActual.includes('Modulo de Despacho')) {
    cfg = { icono: 'truck', nombre: 'Módulo de Despacho' };
  } else if (pathActual.includes('Modulo de Administrador')) {
    cfg = { icono: 'briefcase', nombre: 'Módulo de Gerente' };
  } else if (pathActual.includes('Modulo de Superadmin')) {
    cfg = { icono: 'shield-check', nombre: 'Módulo de Superadmin' };
  }

  const h2 = main.querySelector('h2');
  const contenedorTitulo = h2 ? h2.parentElement : main;
  const badge = document.createElement('div');
  badge.setAttribute('data-logo-modulo', 'true');
  badge.className = 'inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm';
  badge.innerHTML = `
    <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
      <i data-lucide="${cfg.icono}" class="w-3.5 h-3.5"></i>
    </div>
    <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · ${cfg.nombre}</span>
  `;

  if (h2 && contenedorTitulo) {
    contenedorTitulo.insertBefore(badge, h2);
  } else {
    main.insertBefore(badge, main.firstChild);
  }
  if (window.lucide) window.lucide.createIcons();
}

// Muestra el botón de retorno en el sidebar si se accedió desde Gerente (?from=admin) o Superadmin (?from=superadmin)
function initBotonRetornoAdmin() {
  const pathActual = decodeURIComponent(window.location.pathname || '');
  if (pathActual.includes('Modulo de Superadmin')) return;

  const params = new URLSearchParams(window.location.search);
  const referrer = decodeURIComponent(document.referrer || '');
  const desdeSuperadmin = params.get('from') === 'superadmin' || referrer.includes('Modulo de Superadmin');
  const desdeAdmin = !desdeSuperadmin && !pathActual.includes('Modulo de Administrador') && (params.get('from') === 'admin' || referrer.includes('Modulo de Administrador'));

  if (!desdeSuperadmin && !desdeAdmin) return;

  const paramOrigen = desdeSuperadmin ? 'superadmin' : 'admin';
  const destinoPanel = desdeSuperadmin ? '../Modulo de Superadmin/dashboard.php' : '../Modulo de Administrador/dashboard.php';
  const etiquetaModo = desdeSuperadmin ? 'Modo Superadmin' : 'Modo Gerente';
  const etiquetaBoton = desdeSuperadmin ? 'Panel de Superadmin' : 'Panel de Gerente';

  if (params.get('from') !== paramOrigen && window.history && window.history.replaceState) {
    const nuevaUrl = window.location.pathname + `?from=${paramOrigen}` + window.location.hash;
    window.history.replaceState(null, '', nuevaUrl);
  }

  document.querySelectorAll('a[href]').forEach(enlace => {
    const href = enlace.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
    if (href.includes('Modulo de Superadmin') || (!desdeSuperadmin && href.includes('Modulo de Administrador'))) return;
    if (href.endsWith('.php')) {
      enlace.setAttribute('href', href + `?from=${paramOrigen}`);
    }
  });

  const nav = document.querySelector('aside nav');
  if (!nav || document.getElementById('btnVolverAdmin')) return;

  const contenedor = document.createElement('div');
  contenedor.id = 'btnVolverAdmin';
  contenedor.className = 'mt-6 pt-4 border-t border-white/15';
  contenedor.innerHTML = `
    <p class="text-[11px] uppercase tracking-wider font-semibold text-emerald-200/70 px-4 mb-1.5">${etiquetaModo}</p>
    <a href="${destinoPanel}" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-white font-medium border border-emerald-300/30 transition shadow-sm">
      <i data-lucide="arrow-left-circle" class="w-5 h-5 text-emerald-200"></i>
      <span>${etiquetaBoton}</span>
    </a>
  `;
  nav.parentNode.appendChild(contenedor);

  if (window.lucide) {
    lucide.createIcons();
  }
}
