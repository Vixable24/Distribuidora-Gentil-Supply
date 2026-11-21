<?php
// Módulo de Anulaciones - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de facturacion/anulaciones.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gentil Supply - Módulo de Anulaciones</title>
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
        <a href="cobranzas.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="wallet" class="w-5 h-5"></i>
          <span>Cobranzas</span>
        </a>
        <!-- Opción Activa: Anulaciones -->
        <a href="anulaciones.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
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

  <!-- CONTENIDO PRINCIPAL: ANULACIONES -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Facturación</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Módulo de Anulación de Facturas</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Control de comprobantes anulados con justificación obligatoria, basado en las ventas.</p>
      </div>
      <button onclick="abrirSolicitudAnulacion()" class="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all">
        <i data-lucide="ban" class="w-5 h-5"></i> Solicitar Anulación
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Facturas por Anular</p>
        <p id="kpiPorAnular" class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">0</p>
        <span class="text-xs text-gray-500 font-medium mt-2 inline-block">Su venta fue anulada en Ventas</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Facturas Anuladas</p>
        <p id="kpiFacturasAnuladas" class="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">0</p>
        <span class="text-xs text-gray-500 font-medium mt-2 inline-block">Anuladas en Facturación</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Ventas Anuladas</p>
        <p id="kpiVentasAnuladas" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0</p>
        <span class="text-xs text-gray-500 font-medium mt-2 inline-block">Registradas en Ventas</span>
      </div>
    </div>

    <!-- Cuadro 1: Facturas Emitidas y Estado de Anulación (Diseño unificado con Historial de Ventas) -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors mb-6">
      <div class="flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-between">
        <div>
          <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-0.5">Facturas Emitidas y Estado de Anulación</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">Presiona cualquier factura para ver todos sus detalles cómodamente.</p>
        </div>
        <div class="relative flex-1 max-w-md">
          <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          <input type="text" id="busquedaEmitidasAnulacion" onkeyup="renderAnulaciones()" placeholder="Buscar factura activa, venta o cliente..." class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th class="py-3 px-4">N° Factura</th>
              <th class="py-3 px-4">Cliente</th>
              <th class="py-3 px-4">Fecha</th>
              <th class="py-3 px-4 text-right">Total ($ / Bs.)</th>
              <th class="py-3 px-4">Estado</th>
              <th class="py-3 px-4 text-center">Detalles</th>
            </tr>
          </thead>
          <tbody id="tablaAnulacionEmitidas" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
        </table>
      </div>
    </div>

    <!-- Cuadro 2: Bitácora de Documentos Anulados -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-between">
        <div>
          <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-0.5">Bitácora de Documentos Anulados</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">Ventas y facturas anuladas. Haz clic en cualquier fila para ver el detalle completo.</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
          <div class="relative flex-1">
            <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            <input type="text" id="busquedaBitacora" onkeyup="renderAnulaciones()" placeholder="Buscar por documento, cliente o motivo..." class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
          </div>
          <div class="relative w-full sm:w-48">
            <select id="filtroTipoBitacora" onchange="renderAnulaciones()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="Todos">Todos los Tipos</option>
              <option value="Factura">Facturas Anuladas</option>
              <option value="Venta">Ventas Anuladas</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th onclick="ordenarBitacoraPor('fecha')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Fecha">
                <span class="inline-flex items-center gap-1.5">Fecha <span id="sortIconBit-fecha" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarBitacoraPor('tipo')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Tipo">
                <span class="inline-flex items-center gap-1.5">Tipo <span id="sortIconBit-tipo" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarBitacoraPor('documento')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Documento">
                <span class="inline-flex items-center gap-1.5">Documento <span id="sortIconBit-documento" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarBitacoraPor('cliente')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Cliente">
                <span class="inline-flex items-center gap-1.5">Cliente <span id="sortIconBit-cliente" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarBitacoraPor('monto')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Monto">
                <span class="inline-flex items-center justify-end gap-1.5">Monto <span id="sortIconBit-monto" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarBitacoraPor('motivo')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Motivo">
                <span class="inline-flex items-center gap-1.5">Motivo <span id="sortIconBit-motivo" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarBitacoraPor('origen')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Origen">
                <span class="inline-flex items-center gap-1.5">Origen <span id="sortIconBit-origen" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th class="py-3 px-4 text-center">Detalles</th>
            </tr>
          </thead>
          <tbody id="tablaBitacora" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- MODAL: Detalles Completos del Documento / Anulación (Vista amplia y cómoda estilo Historial de Ventas) -->
  <div id="modalDetalleAnulacion" onclick="if(event.target===this) closeModal('modalDetalleAnulacion')" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <div id="modalDetalleAnulacionBody" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto"></div>
  </div>

  <!-- MODAL: Anular factura -->
  <div id="modalAnulacion" onclick="if(event.target===this) closeModal('modalAnulacion')" data-modal class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
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
