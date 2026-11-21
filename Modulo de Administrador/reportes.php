<?php
// Módulo de Administrador - Reportes de Productos Vendidos - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de Administrador/reportes.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Reportes Categorizados de Gerencia</title>
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
  <!-- Chart.js para las gráficas -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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

  <!-- BARRA LATERAL (SIDEBAR DEL GERENTE) -->
  <aside class="w-64 bg-[#1c4d37] dark:bg-[#0f2d1f] text-white flex flex-col justify-between p-4 flex-shrink-0 transition-colors duration-300">
    <div>
      <!-- Logo Header -->
      <div class="flex items-center space-x-3 mb-8 px-2">
        <div class="p-2 border border-white/25 rounded-lg bg-white/10">
          <i data-lucide="briefcase" class="w-6 h-6 text-white"></i>
        </div>
        <div>
          <h1 class="font-bold text-lg leading-tight">Gentil Supply</h1>
          <p class="text-xs text-emerald-200">Módulo de Gerente</p>
        </div>
      </div>

      <!-- Navegación Principal -->
      <nav class="space-y-1">
        <a href="dashboard.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          <span>Dashboard</span>
        </a>
        <a href="rastreo.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="map-pin" class="w-5 h-5"></i>
          <span>Rastreo por Municipios</span>
        </a>
        <a href="reportes.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
          <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
          <span>Reportes Categorizados</span>
        </a>

        <div class="pt-4 pb-1 px-4">
          <p class="text-[11px] uppercase tracking-wider font-semibold text-emerald-200/70">Accesos Directos</p>
        </div>
        <a href="../Modulo de Ventas/dashboard.php?from=admin" class="flex items-center justify-between px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <span class="flex items-center space-x-3"><i data-lucide="shopping-cart" class="w-4 h-4"></i><span>Ventas</span></span>
          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 opacity-60"></i>
        </a>
        <a href="../Modulo de facturacion/dashboard.php?from=admin" class="flex items-center justify-between px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <span class="flex items-center space-x-3"><i data-lucide="file-text" class="w-4 h-4"></i><span>Facturación</span></span>
          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 opacity-60"></i>
        </a>
        <a href="../Modulo de Despacho/dashboard.php?from=admin" class="flex items-center justify-between px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <span class="flex items-center space-x-3"><i data-lucide="truck" class="w-4 h-4"></i><span>Despacho</span></span>
          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 opacity-60"></i>
        </a>
      </nav>
    </div>

    <!-- Usuario / Sesión -->
    <div class="bg-white/10 rounded-xl p-3 flex items-center justify-between border border-white/10">
      <div>
        <p class="text-xs text-emerald-200">Cargo:</p>
        <p class="font-semibold text-sm text-white">Gerente General</p>
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

  <!-- CONTENIDO PRINCIPAL: REPORTES CATEGORIZADOS DE GERENCIA -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="briefcase" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Gerente</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Centro de Reportes Categorizados de Gerencia</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Descarga y filtra reportes ejecutivos por <b>cliente</b>, por <b>estado de factura</b>, por <b>línea de producto</b> y por <b>rango de fecha</b>.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2.5">
        <button type="button" onclick="descargarReporteGerenciaCSV('facturas')" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all">
          <i data-lucide="download" class="w-4 h-4"></i> Descargar Facturas (CSV)
        </button>
        <button type="button" onclick="descargarReporteGerenciaCSV('productos')" class="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all">
          <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> Descargar Productos (CSV)
        </button>
        <button type="button" onclick="imprimirReporteGerencia()" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 font-medium px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all">
          <i data-lucide="printer" class="w-4 h-4"></i> Imprimir / PDF
        </button>
      </div>
    </div>

    <!-- Indicadores Resumen del Reporte -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Unidades Individuales Vendidas</p>
        <p id="repTotalUnidades" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0 uds</p>
        <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">Conteo total individualizado</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Producto #1 en Ventas</p>
        <p id="repProductoLider" class="text-xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2 truncate">—</p>
        <span id="repProductoLiderSub" class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 inline-block">0 unidades</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Monto Total ($ USD)</p>
        <p id="repTotalIngresos" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span id="repTotalPaquetes" class="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">0 empaques / uds</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Monto Total (Bs.)</p>
        <p id="repTotalIngresosBs" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">Bs. 0,00</p>
        <span id="repTotalFacturasSub" class="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">Equivalente según tasa BCV</span>
      </div>
    </div>

    <!-- Filtros Categorizados del Reporte (Cliente, Estado de Factura, Línea, Rango de Fecha) -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 space-y-3 transition-colors">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-bold uppercase tracking-wider text-[#1c4d37] dark:text-emerald-400 flex items-center gap-1.5">
          <i data-lucide="sliders-horizontal" class="w-4 h-4"></i> Filtros Categorizados (Cliente · Estado de Factura · Línea · Rango de Fecha)
        </h3>
        <button type="button" onclick="limpiarFiltrosReporteGerencia()" class="text-xs font-semibold text-gray-500 hover:text-[#1c4d37] dark:text-gray-400 dark:hover:text-emerald-400 transition-colors">
          Restablecer filtros
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div class="lg:col-span-2">
          <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Buscar producto, factura o cliente</label>
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            <input id="busquedaReporte" type="text" oninput="renderReportes()" placeholder="Buscar..." class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-9 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm">
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Por Cliente</label>
          <div class="relative">
            <select id="filtroClienteReporte" onchange="renderReportes()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="todos">Todos los Clientes</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Por Estado de Factura</label>
          <div class="relative">
            <select id="filtroEstadoReporte" onchange="renderReportes()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="activas">Todas las Vigentes</option>
              <option value="emitidas">Facturas Emitidas</option>
              <option value="completadas">Pagadas / Completadas</option>
              <option value="pendientes">Pendientes de Cobro</option>
              <option value="sin_facturar">Ventas Sin Facturar</option>
              <option value="anuladas">Facturas / Ventas Anuladas</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Por Línea / Marca</label>
          <div class="relative">
            <select id="filtroMarcaReporte" onchange="renderReportes()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="todas">Todas las Líneas</option>
              <option value="muchy">Línea Muchy</option>
              <option value="puig">Línea Galleterías PUIG</option>
              <option value="fisa">Línea Fisa</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Desde</label>
            <input type="date" id="filtroFechaDesdeReporte" onchange="renderReportes()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-xs">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Hasta</label>
            <input type="date" id="filtroFechaHastaReporte" onchange="renderReportes()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-xs">
          </div>
        </div>
      </div>
    </div>

    <!-- Selector de Pestañas para mantener los reportes limpios y sin sobrecarga -->
    <div class="flex flex-wrap gap-2 mb-5">
      <button type="button" id="tabRepAdmin-facturas" onclick="switchTabReporteAdmin('facturas')" class="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-[#1c4d37] text-white dark:bg-emerald-600 shadow-sm">
        1. Facturas Categorizadas
      </button>
      <button type="button" id="tabRepAdmin-productos" onclick="switchTabReporteAdmin('productos')" class="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
        2. Ranking y Gráfica de Productos
      </button>
      <button type="button" id="tabRepAdmin-presentaciones" onclick="switchTabReporteAdmin('presentaciones')" class="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
        3. Desglose por Presentación
      </button>
    </div>

    <!-- PARTE 0: REPORTE CATEGORIZADO DE FACTURAS Y OPERACIONES -->
    <div id="secRepAdmin-facturas" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">Reporte Categorizado de Facturas y Ventas</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">Filtrado por cliente, estado de factura, línea de producto y rango de fecha.</p>
        </div>
        <button type="button" onclick="descargarReporteGerenciaCSV('facturas')" class="text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-[#1c4d37] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition-colors flex items-center gap-1.5 self-start sm:self-auto">
          <i data-lucide="download" class="w-3.5 h-3.5"></i> Exportar CSV
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th class="py-3 px-4">Factura / Pedido</th>
              <th class="py-3 px-4">Fecha</th>
              <th class="py-3 px-4">Cliente / Municipio</th>
              <th class="py-3 px-4">Línea(s)</th>
              <th class="py-3 px-4 text-center">Estado Factura</th>
              <th class="py-3 px-4 text-right">Total ($ USD)</th>
              <th class="py-3 px-4 text-right">Total (Bs.)</th>
            </tr>
          </thead>
          <tbody id="tablaFacturasCategorizadas" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
        </table>
      </div>
    </div>

    <!-- PARTE 1: RANKING + GRÁFICA DE PRODUCTOS -->
    <div id="secRepAdmin-productos" class="hidden space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div class="mb-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">Ranking de Productos por Unidades Individuales</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
                <th class="py-3 px-4 text-center w-16">Pos.</th>
                <th class="py-3 px-4">Producto / Marca</th>
                <th class="py-3 px-4 text-center">Unidades Individuales</th>
                <th class="py-3 px-4">Cantidad</th>
                <th class="py-3 px-4">Participación</th>
                <th class="py-3 px-4 text-right">Total (USD)</th>
              </tr>
            </thead>
            <tbody id="tablaRankingProductos" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
          </table>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Gráfica de Unidades Vendidas por Producto</h3>
        <canvas id="chartReporteUnidades" height="95"></canvas>
      </div>
    </div>

    <!-- PARTE 2: DESGLOSE DETALLADO POR PRESENTACIÓN -->
    <div id="secRepAdmin-presentaciones" class="hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="mb-4">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">Detalle por Presentación (Cajas, Displays, Mangas y Unidades)</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th class="py-3 px-4">Producto Base</th>
              <th class="py-3 px-4">Presentación Vendida</th>
              <th class="py-3 px-4 text-center">Cantidad Vendida</th>
              <th class="py-3 px-4">Conversión a Unidades</th>
              <th class="py-3 px-4">Pedidos</th>
              <th class="py-3 px-4 text-right">Subtotal (USD)</th>
            </tr>
          </thead>
          <tbody id="tablaDetallePresentaciones" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
        </table>
      </div>
    </div>
  </main>

  <div id="zonaImpresion"></div>
  <style>
    #zonaImpresion { display: none; }
    @media print {
      @page {
        size: letter portrait;
        margin: 12mm 14mm 17mm 14mm;
        @top-left { content: none; }
        @top-center { content: none; }
        @top-right { content: none; }
        @bottom-left {
          content: "Página " counter(page) "/" counter(pages);
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          font-size: 8.5pt;
          font-weight: 700;
          color: #1c4d37;
          vertical-align: bottom;
          padding-bottom: 4mm;
        }
        @bottom-center { content: none; }
        @bottom-right {
          content: "Distribuidora Gentil Supply, C.A.";
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          font-size: 8pt;
          color: #6b7280;
          vertical-align: bottom;
          padding-bottom: 4mm;
        }
      }
      html, body { margin: 0 !important; padding: 0 !important; display: block !important; height: auto !important; overflow: visible !important; background: #fff !important; color: #111827 !important; }
      body > *:not(#zonaImpresion) { display: none !important; }
      #zonaImpresion { display: block !important; padding: 0 !important; box-sizing: border-box !important; width: 100% !important; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important; }
      #zonaImpresion * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      #zonaImpresion thead { display: table-header-group; }
      #zonaImpresion tr, #zonaImpresion .print-avoid-break { break-inside: avoid; page-break-inside: avoid; }
      #zonaImpresion .print-footer-preview { display: none !important; }
      a[href]::after { content: none !important; }
    }
  </style>

  <!-- Scripts -->
  <script src="../modos/darkmode.js"></script>
  <script src="admin.js"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>

