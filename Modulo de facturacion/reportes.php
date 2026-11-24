<?php
// Módulo de Reportes de Facturación - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de facturacion/reportes.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Reportes de Facturación</title>
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
      <!-- Logo Header -->
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
        <a href="anulaciones.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="ban" class="w-5 h-5"></i>
          <span>Anulaciones</span>
        </a>
        <!-- Opción Activa: Reportes -->
        <a href="reportes.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
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

  <!-- CONTENIDO PRINCIPAL: REPORTES DE FACTURACIÓN -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6 w-full">
      <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
        <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
          <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
        </div>
        <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Facturación</span>
      </div>
      <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white leading-tight">Reportes Fiscales y de Cobranza</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Libro de facturación, IVA (16%), estados de cobro y exportación categorizada por cliente, estado, línea y fechas.</p>
      <div class="mt-4 flex flex-wrap items-center justify-start gap-2.5">
        <button type="button" onclick="descargarReporteFacturacionCSV()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all">
          <i data-lucide="download" class="w-4 h-4"></i> Descargar CSV / Excel
        </button>
        <button type="button" onclick="imprimirReporteFacturacion()" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all">
          <i data-lucide="printer" class="w-4 h-4"></i> Imprimir Reporte
        </button>
      </div>
    </div>

    <!-- KPIs del Reporte (Montos Totales Divididos en $ y Bs) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Comprobantes Filtrados</p>
        <p id="kpiRepFacTotal" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0 Facturas</p>
        <span id="kpiRepFacSub" class="text-xs text-gray-500 font-medium mt-2 inline-block">0 activas · 0 anuladas</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">IVA Débito Fiscal (16%)</p>
        <p id="kpiRepFacIvaUsd" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span id="kpiRepFacIvaBs" class="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-2 inline-block">Bs. 0,00</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Monto Total Facturado ($ USD)</p>
        <p id="kpiRepFacMontoUsd" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span id="kpiRepFacBaseUsd" class="text-xs text-gray-500 font-medium mt-2 inline-block">Base imponible: $0.00</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Monto Total Facturado (Bs.)</p>
        <p id="kpiRepFacMontoBs" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">Bs. 0,00</p>
        <span id="kpiRepFacBaseBs" class="text-xs text-gray-500 font-medium mt-2 inline-block">Base imponible: Bs. 0,00</span>
      </div>
    </div>

    <!-- Cuadro Principal de Reportes (Diseño y tamaño unificado con Historial de Ventas) -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <!-- Barra superior de vista + restablecer -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" id="tabRepFac-facturas" onclick="switchTabReporteFacturacion('facturas')" class="px-4 py-2 rounded-xl text-xs font-bold transition-colors bg-[#1c4d37] text-white dark:bg-emerald-600 shadow-sm flex items-center gap-1.5">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i> Libro Fiscal
          </button>
          <button type="button" id="tabRepFac-clientes" onclick="switchTabReporteFacturacion('clientes')" class="px-4 py-2 rounded-xl text-xs font-bold transition-colors bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1.5">
            <i data-lucide="users" class="w-3.5 h-3.5"></i> Consolidado por Cliente
          </button>
        </div>
        <button type="button" onclick="limpiarFiltrosReporteFacturacion()" class="text-xs font-semibold text-gray-500 hover:text-[#1c4d37] dark:text-gray-400 dark:hover:text-emerald-400 transition-colors self-start sm:self-auto">
          Restablecer filtros
        </button>
      </div>

      <!-- Filtros Categorizados compactos dentro del cuadro -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div class="relative">
          <select id="repFacCliente" onchange="renderReportesFacturacion()" title="Filtrar por Cliente" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
            <option value="Todos">Todos los Clientes</option>
          </select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
        <div class="relative">
          <select id="repFacEstado" onchange="renderReportesFacturacion()" title="Filtrar por Estado de Factura" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
            <option value="Todos">Todos los Estados</option>
            <option value="Emitida">Emitidas Vigentes</option>
            <option value="Pagada">Pagadas / Completadas</option>
            <option value="Pendiente">Pendientes de Cobro</option>
            <option value="Anulada">Anuladas</option>
          </select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
        <div class="relative">
          <select id="repFacLinea" onchange="renderReportesFacturacion()" title="Filtrar por Línea / Marca" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
            <option value="Todas">Todas las Líneas</option>
            <option value="Muchy">Línea Muchy</option>
            <option value="Galleterías PUIG">Línea Galleterías PUIG</option>
            <option value="Fisa">Línea Fisa</option>
          </select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
        <input type="date" id="repFacDesde" onchange="renderReportesFacturacion()" title="Desde fecha" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm">
        <input type="date" id="repFacHasta" onchange="renderReportesFacturacion()" title="Hasta fecha" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm">
      </div>

      <!-- Vista 1: Libro Fiscal de Facturas (7 columnas proporcionadas como Historial de Ventas) -->
      <div id="wrapRepFac-facturas" class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th onclick="ordenarRepFacPor('numero')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por N° Factura">
                <span class="inline-flex items-center gap-1.5">N° Factura <span id="sortIconRepFac-numero" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacPor('cliente')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Cliente">
                <span class="inline-flex items-center gap-1.5">Cliente <span id="sortIconRepFac-cliente" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacPor('fecha')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Fecha">
                <span class="inline-flex items-center gap-1.5">Fecha <span id="sortIconRepFac-fecha" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacPor('linea')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Línea">
                <span class="inline-flex items-center gap-1.5">Línea(s) <span id="sortIconRepFac-linea" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacPor('total')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Total ($ USD)">
                <span class="inline-flex items-center justify-end gap-1.5">Total ($) <span id="sortIconRepFac-total" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacPor('totalBs')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Total (Bs.)">
                <span class="inline-flex items-center justify-end gap-1.5">Total (Bs.) <span id="sortIconRepFac-totalBs" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacPor('estado')" class="py-3 px-4 text-center cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Estado">
                <span class="inline-flex items-center justify-center gap-1.5">Estado <span id="sortIconRepFac-estado" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
            </tr>
          </thead>
          <tbody id="tablaReporteFacturacion" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
        </table>
      </div>

      <!-- Vista 2: Consolidado por Cliente -->
      <div id="wrapRepFac-clientes" class="hidden overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th onclick="ordenarRepFacCliPor('cliente')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Cliente">
                <span class="inline-flex items-center gap-1.5">Cliente <span id="sortIconRepCli-cliente" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacCliPor('rif')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por RIF">
                <span class="inline-flex items-center gap-1.5">RIF <span id="sortIconRepCli-rif" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacCliPor('count')" class="py-3 px-4 text-center cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Cantidad de Facturas">
                <span class="inline-flex items-center justify-center gap-1.5">Facturas <span id="sortIconRepCli-count" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacCliPor('totalUsd')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Facturado ($ USD)">
                <span class="inline-flex items-center justify-end gap-1.5">Facturado ($) <span id="sortIconRepCli-totalUsd" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacCliPor('totalBs')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Facturado (Bs.)">
                <span class="inline-flex items-center justify-end gap-1.5">Facturado (Bs.) <span id="sortIconRepCli-totalBs" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacCliPor('cobradoUsd')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Cobrado Verificado">
                <span class="inline-flex items-center justify-end gap-1.5">Cobrado ($) <span id="sortIconRepCli-cobradoUsd" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarRepFacCliPor('saldo')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Saldo Pendiente">
                <span class="inline-flex items-center justify-end gap-1.5">Saldo ($) <span id="sortIconRepCli-saldo" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
            </tr>
          </thead>
          <tbody id="tablaReporteFacClientes" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
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

