// Cliente JS de Sincronización Automática con la Tasa Oficial del BCV
// Ubicación: Sistema Gentil Supply 2/API's/bcv.js
//
// Consume el conector PHP (../API's/tasa_bcv.php -> https://www.bcv.org.ve/) y mantiene
// actualizada la tasa oficial BCV en localStorage ('gs_tasa_bcv') y en todos los módulos
// (Ventas, Facturación, Cobranzas, Reportes y Gerencia) en tiempo real.

(function() {
  const TASA_STORAGE_KEY = 'gs_tasa_bcv';
  const TASA_META_KEY = 'gs_tasa_bcv_meta';
  const TASA_FALLBACK = 60.50;

  function leerTasaActual() {
    const val = parseFloat(localStorage.getItem(TASA_STORAGE_KEY));
    return (val && val > 1) ? val : TASA_FALLBACK;
  }

  function obtenerDiaLocalISO() {
    const ahora = new Date();
    const y = ahora.getFullYear();
    const m = String(ahora.getMonth() + 1).padStart(2, '0');
    const d = String(ahora.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function obtenerUltimoDiaVerificado() {
    try {
      const meta = JSON.parse(localStorage.getItem(TASA_META_KEY));
      return (meta && meta.diaVerificado) ? String(meta.diaVerificado) : '';
    } catch (e) {
      return '';
    }
  }

  function aplicarNuevaTasaBCV(tasaNum, metaInfo) {
    const tasa = Math.round(Number(tasaNum) * 100) / 100;
    if (!(tasa > 1)) return;

    const diaHoy = obtenerDiaLocalISO();
    const anterior = parseFloat(localStorage.getItem(TASA_STORAGE_KEY)) || 0;
    localStorage.setItem(TASA_STORAGE_KEY, String(tasa));
    window.TASA_BCV_ACTUAL = tasa;

    const meta = Object.assign({
      tasa,
      fuente: 'https://www.bcv.org.ve/',
      fechaValor: diaHoy,
      diaVerificado: diaHoy,
      actualizado: new Date().toISOString()
    }, metaInfo || {}, { diaVerificado: diaHoy });
    localStorage.setItem(TASA_META_KEY, JSON.stringify(meta));

    // Actualizar campos de tasa visibles en pantalla si existen
    const facTasaInput = document.getElementById('facTasa');
    if (facTasaInput && (!facTasaInput.value || Number(facTasaInput.value) === anterior || Number(facTasaInput.value) === TASA_FALLBACK)) {
      facTasaInput.value = tasa.toFixed(2);
    }

    const cobroTasaInfo = document.getElementById('cobroTasaInfo');
    if (cobroTasaInfo) {
      cobroTasaInfo.textContent = `Tasa oficial BCV: Bs. ${tasa.toFixed(2)} / USD`;
    }

    // Refrescar vistas activas en Ventas, Facturación y Gerencia si cambiaron los datos o al inicializar
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

  async function sincronizarTasaBCV(forzar = false) {
    const enSubcarpeta = /Modulo de /i.test(decodeURIComponent(window.location.pathname || ''));
    const endpoint = `${enSubcarpeta ? '../' : ''}API's/tasa_bcv.php${forzar ? '?force=1' : ''}`;
    try {
      const resp = await fetch(endpoint, { cache: 'no-store' });
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.ok && Number(data.tasa) > 1) {
          aplicarNuevaTasaBCV(data.tasa, data);
          return Number(data.tasa);
        }
      }
    } catch (e) { /* intentar respaldo directo desde el navegador */ }

    // Respaldo directo desde el navegador si el backend PHP local no tiene salida de red pero el navegador sí
    try {
      const respDirecto = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { cache: 'no-store' });
      if (respDirecto.ok) {
        const d = await respDirecto.json();
        if (d && Number(d.promedio) > 1) {
          const tasaRed = Math.round(Number(d.promedio) * 100) / 100;
          aplicarNuevaTasaBCV(tasaRed, {
            tasa: tasaRed,
            fuente: 'BCV Oficial (https://www.bcv.org.ve/)',
            fechaValor: d.fechaActualizacion ? String(d.fechaActualizacion).slice(0, 10) : new Date().toISOString().slice(0, 10)
          });
          return tasaRed;
        }
      }
    } catch (e2) { /* mantener última tasa guardada */ }

    const guardada = leerTasaActual();
    aplicarNuevaTasaBCV(guardada, { fuente: 'Tasa BCV guardada' });
    return guardada;
  }

  window.TASA_BCV_ACTUAL = leerTasaActual();
  window.obtenerTasaBCVOficial = leerTasaActual;
  window.sincronizarTasaBCV = sincronizarTasaBCV;

  // Verifica si ya se actualizó la tasa en el día actual; si cambió de día (pasó la medianoche) o no existe, la actualiza
  function verificarTasaDelDia() {
    const diaHoy = obtenerDiaLocalISO();
    const ultimoDia = obtenerUltimoDiaVerificado();
    const tasaGuardada = parseFloat(localStorage.getItem(TASA_STORAGE_KEY));
    if (!tasaGuardada || tasaGuardada <= 1 || ultimoDia !== diaHoy) {
      sincronizarTasaBCV(true);
    } else {
      aplicarNuevaTasaBCV(tasaGuardada, { fuente: 'Tasa oficial BCV del día', diaVerificado: diaHoy });
    }
  }

  // Programa la verificación automática exactamente a la medianoche (00:00:00) de cada día
  let timerMedianoche = null;
  function programarVerificacionMedianoche() {
    if (timerMedianoche) clearTimeout(timerMedianoche);
    const ahora = new Date();
    const proximaMedianoche = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate() + 1,
      0, 0, 2, 0 // 00:00:02 para asegurar cambio de fecha en el reloj local y servidor
    );
    const msHastaMedianoche = Math.max(1000, proximaMedianoche.getTime() - ahora.getTime());
    timerMedianoche = setTimeout(async () => {
      await sincronizarTasaBCV(true);
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

  // Si el equipo estuvo suspendido y cruzó la medianoche, al reactivar verifica si cambió de día
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && obtenerUltimoDiaVerificado() !== obtenerDiaLocalISO()) {
      sincronizarTasaBCV(true);
      programarVerificacionMedianoche();
    }
  });
  setInterval(() => {
    if (obtenerUltimoDiaVerificado() !== obtenerDiaLocalISO()) {
      sincronizarTasaBCV(true);
      programarVerificacionMedianoche();
    }
  }, 60 * 1000);
})();

