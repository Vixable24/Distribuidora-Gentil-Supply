// Cliente JS de Sincronización Automática con la Tasa Oficial del BCV
// Ubicación: Sistema Gentil Supply 2/API's/bcv.js
//
// Consume el conector PHP (../API's/tasa_bcv.php -> https://www.bcv.org.ve/) y mantiene
// actualizada la tasa oficial BCV en localStorage ('gs_tasa_bcv') acorde al día calendario
// de Venezuela (America/Caracas, UTC-4), reiniciando automáticamente el ciclo cada medianoche (00:00).

(function() {
  const TASA_STORAGE_KEY = 'gs_tasa_bcv';
  const TASA_META_KEY = 'gs_tasa_bcv_meta';
  const TASA_FALLBACK = 60.50;
  const REVALIDACION_PENDIENTE_MS = 15 * 60 * 1000; // 15 min si la fechaValor aún es anterior al día actual

  function leerTasaActual() {
    const val = parseFloat(localStorage.getItem(TASA_STORAGE_KEY));
    return (val && val > 1) ? val : TASA_FALLBACK;
  }

  function obtenerDiaVenezuelaISO(fechaObj) {
    const d = fechaObj instanceof Date ? fechaObj : new Date();
    try {
      const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Caracas',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(d);
      const y = (partes.find(p => p.type === 'year') || {}).value;
      const m = (partes.find(p => p.type === 'month') || {}).value;
      const day = (partes.find(p => p.type === 'day') || {}).value;
      if (y && m && day) return `${y}-${m}-${day}`;
    } catch (e) {}
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function convertirFechaACaracasISO(fechaRaw, fallback) {
    const s = String(fechaRaw || '').trim();
    if (!s) return fallback;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) {
      return obtenerDiaVenezuelaISO(parsed);
    }
    return s.slice(0, 10) || fallback;
  }

  function leerMetaGuardada() {
    try {
      const meta = JSON.parse(localStorage.getItem(TASA_META_KEY));
      return (meta && typeof meta === 'object') ? meta : null;
    } catch (e) {
      return null;
    }
  }

  function obtenerUltimoDiaVerificado() {
    const meta = leerMetaGuardada();
    if (!meta) return '';
    return String(meta.diaVerificado || meta.verificacionDia || '');
  }

  function obtenerFechaValorGuardada() {
    const meta = leerMetaGuardada();
    if (!meta) return '';
    return String(meta.fechaValor || meta.fechaBCV || '');
  }

  function obtenerTimestampUltimaConsulta() {
    const meta = leerMetaGuardada();
    if (!meta) return 0;
    if (meta.timestamp) return Number(meta.timestamp) * 1000;
    const iso = meta.actualizado || meta.consultadoEl;
    if (iso) {
      const t = new Date(iso).getTime();
      if (!isNaN(t)) return t;
    }
    return 0;
  }

  function reiniciarEstadoLocalPorMedianoche() {
    const diaHoy = obtenerDiaVenezuelaISO();
    const metaPrev = leerMetaGuardada() || {};
    const metaReset = Object.assign({}, metaPrev, {
      diaVerificado: '',
      verificacionDia: '',
      reiniciadoEnMedianoche: diaHoy
    });
    try {
      localStorage.setItem(TASA_META_KEY, JSON.stringify(metaReset));
    } catch (e) {}
  }

  function calcularMsHastaMedianocheVenezuela(segundosServidor) {
    if (Number(segundosServidor) > 0) {
      return Math.max(1000, (Number(segundosServidor) + 2) * 1000);
    }
    // America/Caracas es UTC-4 fijo sin horario de verano: su medianoche 00:00:02 es 04:00:02 UTC
    const ahora = new Date();
    const diaCaracas = obtenerDiaVenezuelaISO(ahora);
    const [y, m, d] = diaCaracas.split('-').map(Number);
    const proximaMedianocheCaracasUTC = Date.UTC(y, m - 1, d + 1, 4, 0, 2, 0);
    const diff = proximaMedianocheCaracasUTC - ahora.getTime();
    if (diff > 1000) return diff;
    return 60 * 1000;
  }

  function aplicarNuevaTasaBCV(tasaNum, metaInfo, esVerificacionReal = true) {
    const tasa = Math.round(Number(tasaNum) * 100) / 100;
    if (!(tasa > 1)) return;

    const info = metaInfo || {};
    const diaHoy = obtenerDiaVenezuelaISO();
    const metaPrev = leerMetaGuardada() || {};
    const anterior = parseFloat(localStorage.getItem(TASA_STORAGE_KEY)) || 0;

    localStorage.setItem(TASA_STORAGE_KEY, String(tasa));
    window.TASA_BCV_ACTUAL = tasa;

    const esOffline = Boolean(info.offlineFallback) || !esVerificacionReal;
    const diaVerifFinal = esOffline
      ? String(info.diaVerificado || info.verificacionDia || metaPrev.diaVerificado || metaPrev.verificacionDia || '')
      : diaHoy;
    const fechaValorFinal = convertirFechaACaracasISO(
      info.fechaValor || info.fechaBCV || metaPrev.fechaValor || metaPrev.fechaBCV || diaHoy,
      diaHoy
    );
    const actualizadoFinal = String(info.actualizado || info.consultadoEl || new Date().toISOString());

    const meta = Object.assign({}, metaPrev, info, {
      tasa,
      tasaExacta: Number(info.tasaExacta || tasa),
      fuente: info.fuente || metaPrev.fuente || 'https://www.bcv.org.ve/',
      fechaValor: fechaValorFinal,
      fechaBCV: fechaValorFinal,
      diaVerificado: diaVerifFinal,
      verificacionDia: diaVerifFinal,
      acordeAlDia: fechaValorFinal >= diaHoy,
      actualizado: actualizadoFinal,
      consultadoEl: actualizadoFinal,
      timestamp: Math.floor(Date.now() / 1000)
    });
    localStorage.setItem(TASA_META_KEY, JSON.stringify(meta));

    if (Number(info.segundosHastaMedianoche) > 0) {
      programarVerificacionMedianoche(Number(info.segundosHastaMedianoche));
    }

    // Actualizar campos de tasa visibles en pantalla si existen
    const facTasaInput = document.getElementById('facTasa');
    if (facTasaInput && (!facTasaInput.value || Number(facTasaInput.value) === anterior || Number(facTasaInput.value) === TASA_FALLBACK)) {
      facTasaInput.value = tasa.toFixed(2);
    }

    const cobroTasaInfo = document.getElementById('cobroTasaInfo');
    if (cobroTasaInfo) {
      cobroTasaInfo.textContent = `Tasa oficial BCV (${fechaValorFinal}): Bs. ${tasa.toFixed(2)} / USD`;
    }

    // Refrescar vistas activas en Ventas, Facturación y Gerencia
    try {
      if (typeof window.renderizarCarrito === 'function' && document.getElementById('listaProductosContainer')) window.renderizarCarrito();
      if (typeof window.filtrarHistorial === 'function' && document.getElementById('tablaHistorialVentas')) window.filtrarHistorial();
      if (typeof window.renderPagos === 'function' && document.getElementById('tablaPagos')) window.renderPagos();
      if (typeof window.actualizarBadgeMaximoCobro === 'function' && document.getElementById('cobroMontoMaxBadge')) window.actualizarBadgeMaximoCobro();
      if (typeof window.calcularEquivalenteCobro === 'function' && document.getElementById('wrapperCobroEquivalente')) window.calcularEquivalenteCobro();
      if (typeof window.initDashboardVentas === 'function' && document.getElementById('kpiVentasHoy')) window.initDashboardVentas();

      if (typeof window.renderFacturas === 'function' && document.getElementById('tablaFacturas')) window.renderFacturas();
      if (typeof window.actualizarResumenFactura === 'function' && document.getElementById('facVenta') && document.getElementById('facVenta').value) window.actualizarResumenFactura();
      if (typeof window.renderCobranzas === 'function' && document.getElementById('tablaCobranzas')) window.renderCobranzas();
      if (typeof window.renderCuentasPorCobrar === 'function' && document.getElementById('tablaCxC')) window.renderCuentasPorCobrar();
      if (typeof window.renderReportesFacturacion === 'function' && document.getElementById('tablaReporteFacturacion')) window.renderReportesFacturacion();
      if (typeof window.initDashboardFacturacion === 'function' && document.getElementById('chartFacturacionBs')) window.initDashboardFacturacion();

      if (typeof window.initAdminDashboard === 'function' && document.getElementById('kpiAdminVentas')) window.initAdminDashboard();
      if (typeof window.renderReportes === 'function' && document.getElementById('tablaRankingProductos')) window.renderReportes();
    } catch (err) { /* continuar */ }

    window.dispatchEvent(new CustomEvent('bcv-tasa-actualizada', { detail: meta }));
  }

  async function sincronizarTasaBCV(forzar = false, resetMedianoche = false) {
    const enSubcarpeta = /Modulo de /i.test(decodeURIComponent(window.location.pathname || ''));
    const params = [];
    if (forzar) params.push('force=1');
    if (resetMedianoche) params.push('reset=1');
    params.push(`_t=${Date.now()}`);
    const endpoint = `${enSubcarpeta ? '../' : ''}API's/tasa_bcv.php?${params.join('&')}`;

    try {
      const resp = await fetch(endpoint, { cache: 'no-store' });
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.ok && Number(data.tasa) > 1 && !data.offlineFallback) {
          aplicarNuevaTasaBCV(data.tasa, data, true);
          return Number(data.tasa);
        }
      }
    } catch (e) { /* intentar respaldo directo desde el navegador */ }

    // Respaldo directo desde el navegador si el backend PHP local no tiene salida de red pero el navegador sí
    try {
      const respDirecto = await fetch(`https://ve.dolarapi.com/v1/dolares/oficial?_t=${Date.now()}`, { cache: 'no-store' });
      if (respDirecto.ok) {
        const d = await respDirecto.json();
        if (d && Number(d.promedio) > 1) {
          const diaHoy = obtenerDiaVenezuelaISO();
          const exacta = Number(d.promedio);
          const tasaRed = Math.round(exacta * 100) / 100;
          const fechaValor = d.fechaActualizacion ? convertirFechaACaracasISO(d.fechaActualizacion, diaHoy) : diaHoy;
          aplicarNuevaTasaBCV(tasaRed, {
            tasa: tasaRed,
            tasaExacta: exacta,
            fuente: 'BCV Oficial (https://www.bcv.org.ve/)',
            fechaValor,
            diaVerificado: diaHoy
          }, true);
          return tasaRed;
        }
      }
    } catch (e2) { /* mantener última tasa guardada sin marcar el día como verificado */ }

    const guardada = leerTasaActual();
    aplicarNuevaTasaBCV(guardada, { fuente: 'Tasa BCV en caché local', offlineFallback: true }, false);
    return guardada;
  }

  window.TASA_BCV_ACTUAL = leerTasaActual();
  window.obtenerTasaBCVOficial = leerTasaActual;
  window.sincronizarTasaBCV = sincronizarTasaBCV;
  window.obtenerDiaBCVVenezuela = obtenerDiaVenezuelaISO;

  // Verifica si ya se actualizó la tasa en el día actual (hora Venezuela); si cambió de día o la fechaValor es anterior, sincroniza
  function verificarTasaDelDia() {
    const diaHoy = obtenerDiaVenezuelaISO();
    const ultimoDia = obtenerUltimoDiaVerificado();
    const fechaValor = obtenerFechaValorGuardada();
    const tasaGuardada = parseFloat(localStorage.getItem(TASA_STORAGE_KEY));

    if (!tasaGuardada || tasaGuardada <= 1 || ultimoDia !== diaHoy) {
      if (ultimoDia && ultimoDia !== diaHoy) {
        reiniciarEstadoLocalPorMedianoche();
      }
      sincronizarTasaBCV(true, ultimoDia !== diaHoy);
      return;
    }

    // Si ya se consultó hoy pero la fechaValor publicada aún era de un día anterior y pasaron >= 15 min, revalidar
    const edadMs = Date.now() - obtenerTimestampUltimaConsulta();
    if (fechaValor && fechaValor < diaHoy && edadMs >= REVALIDACION_PENDIENTE_MS) {
      sincronizarTasaBCV(false, false);
      return;
    }

    aplicarNuevaTasaBCV(tasaGuardada, leerMetaGuardada() || { fuente: 'Tasa oficial BCV del día', diaVerificado: diaHoy }, true);
  }

  // Programa el reinicio y actualización automática exactamente a la medianoche (00:00:02 America/Caracas)
  let timerMedianoche = null;
  function programarVerificacionMedianoche(segundosServidor) {
    if (timerMedianoche) clearTimeout(timerMedianoche);
    const msHastaMedianoche = calcularMsHastaMedianocheVenezuela(segundosServidor);
    timerMedianoche = setTimeout(async () => {
      reiniciarEstadoLocalPorMedianoche();
      await sincronizarTasaBCV(true, true);
      programarVerificacionMedianoche();
    }, msHastaMedianoche);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      verificarTasaDelDia();
      programarVerificacionMedianoche();
    });
  } else {
    verificarTasaDelDia();
    programarVerificacionMedianoche();
  }

  // Si el equipo estuvo suspendido o cambió de pestaña y cruzó la medianoche en Venezuela, reinicia y actualiza
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    const diaHoy = obtenerDiaVenezuelaISO();
    if (obtenerUltimoDiaVerificado() !== diaHoy) {
      reiniciarEstadoLocalPorMedianoche();
      sincronizarTasaBCV(true, true);
      programarVerificacionMedianoche();
    } else if (obtenerFechaValorGuardada() < diaHoy && (Date.now() - obtenerTimestampUltimaConsulta()) >= REVALIDACION_PENDIENTE_MS) {
      sincronizarTasaBCV(false, false);
    }
  });

  setInterval(() => {
    const diaHoy = obtenerDiaVenezuelaISO();
    if (obtenerUltimoDiaVerificado() !== diaHoy) {
      reiniciarEstadoLocalPorMedianoche();
      sincronizarTasaBCV(true, true);
      programarVerificacionMedianoche();
    } else if (obtenerFechaValorGuardada() < diaHoy && (Date.now() - obtenerTimestampUltimaConsulta()) >= REVALIDACION_PENDIENTE_MS) {
      sincronizarTasaBCV(false, false);
    }
  }, 60 * 1000);
})();
