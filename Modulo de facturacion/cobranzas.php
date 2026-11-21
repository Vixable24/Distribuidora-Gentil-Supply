<?php
// Módulo de Cobranzas y Pagos - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de facturacion/cobranzas.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gentil Supply - Módulo de Cobranzas</title>
  <!-- Modo Oscuro Instantáneo (previene parpadeo claro al cambiar de pestaña) -->
  <script>
    (function() {
      try {
        var t = localStorage.getItem('theme');
        if (t === 'dark' || (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        }
      } catch (e) {}
    })();
  </script>
  <style>
    html.dark, html.dark body { background-color: #111827; color: #f3f4f6; }
    html.dark aside { background-color: #0f2d1f; }
    html.dark .dark\:bg-gray-900 { background-color: #111827; }
    html.dark .dark\:bg-gray-800 { background-color: #1f2937; }
    html.dark .dark\:border-gray-700 { border-color: #374151; }
    html.dark .dark\:text-white { color: #ffffff; }
    html.dark .dark\:text-gray-100 { color: #f3f4f6; }
    html:not(.theme-ready) *, html:not(.theme-ready) body, html:not(.theme-ready) aside { transition: none !important; }
  </style>
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        brand: {
                            DEFAULT: '#1c4d37',
                            dark: '#133928',
                            light: '#2d6a4f',
                            bg: '#f4f6f5'
                        }
                    }
                }
            }
        }
    </script>
  <?php require_once __DIR__ . '/../Base de Datos/bootstrap_db.php'; ?>
</head>
<body class="bg-[#f4f6f5] dark:bg-gray-900 font-sans antialiased text-gray-800 dark:text-gray-100 flex h-screen overflow-hidden transition-colors duration-300">

  <!-- BARRA LATERAL (SIDEBAR EXCLUSIVO DE FACTURACIÓN) -->
  <aside class="w-64 bg-[#1c4d37] dark:bg-[#0f2d1f] text-white flex flex-col justify-between p-4 flex-shrink-0 transition-colors duration-300">
    <div>
      <!-- Logo Header / Botón Modo Oscuro -->
      <div class="flex items-center space-x-3 mb-8 px-2">
        <div class="p-2 border border-white/25 rounded-lg bg-white/10">
          <i data-lucide="box" class="w-6 h-6 text-white"></i>
        </div>
        <div>
          <h1 class="font-bold text-lg leading-tight">Gentil Supply</h1>
          <p class="text-xs text-emerald-200">Módulo de Facturación</p>
        </div>
      </div>

      <!-- Navegación propia del módulo de facturación -->
      <nav class="space-y-1">
        <!-- Dashboard en 1ª posición -->
        <a href="dashboard.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          <span>Dashboard</span>
        </a>
        <a href="facturacion.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="file-text" class="w-5 h-5"></i>
          <span>Facturación</span>
        </a>
        <!-- Opción Activa: Cobranzas -->
        <a href="cobranzas.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
          <i data-lucide="wallet" class="w-5 h-5"></i>
          <span>Cobranzas</span>
        </a>
        <a href="anulaciones.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="ban" class="w-5 h-5"></i>
          <span>Anulaciones</span>
        </a>
        <a href="reportes.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
          <span>Reportes</span>
        </a>
      </nav>
    </div>

    <!-- Usuario / Sesión -->
    <div class="bg-white/10 rounded-xl p-3 flex items-center justify-between border border-white/10">
      <div>
        <p class="text-xs text-emerald-200">Usuario:</p>
        <p class="font-semibold text-sm text-white">Admin</p>
      </div>
      <div class="flex items-center gap-1">
        <button type="button" onclick="toggleDarkMode()" title="Cambiar modo claro / oscuro" class="p-2 hover:bg-white/10 rounded-lg text-emerald-200 hover:text-white transition">
          <i data-lucide="moon" class="w-4 h-4 dark:hidden"></i>
          <i data-lucide="sun" class="w-4 h-4 hidden dark:block"></i>
        </button>
        <button onclick="logout()" title="Cerrar sesión" class="p-2 hover:bg-white/10 rounded-lg text-emerald-200 hover:text-white transition">
          <i data-lucide="log-out" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </aside>

  <!-- CONTENIDO PRINCIPAL: COBRANZAS -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Facturación</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Registro de Pagos y Cobranza</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Verificación de los pagos registrados en Ventas antes de aprobar cada venta.</p>
      </div>
      <button onclick="renderCobranzas(); renderCuentasPorCobrar(); toast('Datos actualizados desde Ventas.')" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        <i data-lucide="refresh-cw" class="w-5 h-5"></i> Actualizar
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Pagos por Verificar</p>
        <p id="kpiPorVerificar" class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">0</p>
        <span id="kpiMontoPorVerificar" class="text-xs text-gray-500 font-medium mt-2 inline-block">$0.00 en espera</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Verificado Hoy</p>
        <p id="kpiVerificadoHoy" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span class="text-xs text-gray-500 font-medium mt-2 inline-block">Aprobado en Cobranzas</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Pagos Rechazados</p>
        <p id="kpiRechazados" class="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">0</p>
        <span class="text-xs text-gray-500 font-medium mt-2 inline-block">Devueltos a Ventas</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total por Cobrar</p>
        <p id="kpiPorCobrar" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span class="text-xs text-gray-500 font-medium mt-2 inline-block">Saldo de ventas pendientes</span>
      </div>
    </div>

    <!-- Verificación de pagos -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors mb-6">
      <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-1">Pagos Registrados en Ventas</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Verifica que el dinero fue recibido. Al cubrir el total, la venta queda aprobada como Completada en Ventas.</p>
      <div class="flex flex-col sm:flex-row gap-3 mb-6 justify-between">
        <div class="relative flex-1">
          <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          <input type="text" id="busquedaCobranzas" onkeyup="renderCobranzas()" placeholder="Buscar por cliente, venta, método, banco o referencia..." class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] transition">
        </div>
        <div class="relative w-full sm:w-56">
          <select id="filtroEstadoCobranza" onchange="setFiltroCobranza(this.value)" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
            <option value="Por Verificar" selected>Por verificar</option>
            <option value="Verificado">Verificados</option>
            <option value="Rechazado">Rechazados</option>
            <option value="Todos">Todos los Estados</option>
          </select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th onclick="ordenarCobranzasPor('fecha')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Fecha">
                <span class="inline-flex items-center gap-1.5">Fecha <span id="sortIconCob-fecha" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarCobranzasPor('cliente')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Cliente">
                <span class="inline-flex items-center gap-1.5">Cliente <span id="sortIconCob-cliente" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarCobranzasPor('venta')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Venta">
                <span class="inline-flex items-center gap-1.5">Venta <span id="sortIconCob-venta" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarCobranzasPor('metodo')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Método">
                <span class="inline-flex items-center gap-1.5">Método <span id="sortIconCob-metodo" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarCobranzasPor('monto')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Monto">
                <span class="inline-flex items-center justify-end gap-1.5">Monto <span id="sortIconCob-monto" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarCobranzasPor('estado')" class="py-3 px-4 text-center cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Estado">
                <span class="inline-flex items-center justify-center gap-1.5">Estado <span id="sortIconCob-estado" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th class="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody id="tablaCobranzas" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
        </table>
      </div>
    </div>

    <!-- Cuentas por cobrar -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-1">Control de Cuentas por Cobrar</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Ventas pendientes registradas en el Módulo de Ventas y su saldo.</p>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th onclick="ordenarCxCPor('fecha')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Fecha / Venta">
                <span class="inline-flex items-center gap-1.5">Venta <span id="sortIconCxC-fecha" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarCxCPor('cliente')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Cliente">
                <span class="inline-flex items-center gap-1.5">Cliente <span id="sortIconCxC-cliente" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarCxCPor('total')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Total">
                <span class="inline-flex items-center justify-end gap-1.5">Total <span id="sortIconCxC-total" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarCxCPor('verificado')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Verificado">
                <span class="inline-flex items-center justify-end gap-1.5">Verificado <span id="sortIconCxC-verificado" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarCxCPor('enVerif')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por En verificación">
                <span class="inline-flex items-center justify-end gap-1.5">En verificación <span id="sortIconCxC-enVerif" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarCxCPor('saldo')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Saldo">
                <span class="inline-flex items-center justify-end gap-1.5">Saldo <span id="sortIconCxC-saldo" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
            </tr>
          </thead>
          <tbody id="tablaCxC" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- MODAL: Rechazar pago (Interfaz mejorada con desglose completo de detalles como en la aprobación) -->
  <div id="modalRechazo" onclick="if(event.target===this) closeModal('modalRechazo')" data-modal class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <form onsubmit="confirmarRechazo(event)" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 space-y-4">
      <div class="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
            <i data-lucide="x-circle" class="w-6 h-6"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-red-600 dark:text-red-400">Rechazar Pago en Cobranzas</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Verifica los detalles del cobro e indica la causa de devolución a Ventas.</p>
          </div>
        </div>
        <button type="button" onclick="closeModal('modalRechazo')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Tarjeta con detalles completos del pago a rechazar (mismo nivel de detalle que la aprobación) -->
      <div id="rechazoInfo" class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm space-y-2"></div>

      <!-- Motivo del rechazo -->
      <div>
        <label class="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5">Motivo del rechazo (obligatorio)</label>
        <textarea id="rechazoMotivo" required rows="3" placeholder="Ej. La referencia no aparece en el estado de cuenta bancario." class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm"></textarea>
      </div>

      <div class="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
        <i data-lucide="alert-circle" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
        <p>Al rechazar este pago, su monto se descontará de pagos en verificación y el saldo volverá a quedar exigible en el Módulo de Ventas.</p>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <button type="button" onclick="closeModal('modalRechazo')" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
        <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition-colors text-sm flex items-center gap-2"><i data-lucide="x-circle" class="w-4 h-4"></i> Rechazar Pago</button>
      </div>
    </form>
  </div>

  <!-- Notificación -->
  <div id="toast" class="hidden opacity-0 translate-y-2 transition-all duration-300 fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl bg-[#1c4d37] dark:bg-emerald-600 text-white text-sm shadow-lg max-w-sm"></div>

  <!-- Scripts -->
  <script src="../modos/darkmode.js"></script>
  <script src="facturacion.js"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>
