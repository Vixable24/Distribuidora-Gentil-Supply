<?php
// Módulo de Facturación - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de facturacion/facturacion.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gentil Supply - Módulo de Facturación</title>
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
        <!-- Ir al Dashboard general -->
        <a href="dashboard.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          <span>Dashboard</span>
        </a>
        <!-- Opción Activa: Facturación -->
        <a href="facturacion.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
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

  <!-- CONTENIDO PRINCIPAL -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6 w-full">
      <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
        <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
          <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
        </div>
        <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Facturación</span>
      </div>
      <div class="w-full flex flex-wrap items-center justify-between gap-4">
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white leading-tight">Gestión de Facturación</h2>
        <div class="flex flex-wrap items-center gap-2.5">
          <button type="button" onclick="recargarDatos(); renderFacturas(); toast('Facturas actualizadas desde Ventas.')" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all">
            <i data-lucide="refresh-cw" class="w-4 h-4 text-[#1c4d37] dark:text-emerald-400"></i> Actualizar
          </button>
          <button onclick="emitirFactura()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <i data-lucide="plus-circle" class="w-5 h-5"></i> Nueva Factura
          </button>
        </div>
      </div>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Municipio Arismendi, Nueva Esparta - Comprobantes fiscales emitidos a partir de las ventas.</p>
    </div>

    <!-- Indicadores Rápidos (Totales divididos en Bs y en $) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Facturas Emitidas Hoy</p>
        <p id="kpiFacturasHoy" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0</p>
        <span class="text-xs text-gray-500 font-medium mt-2 inline-block">Comprobantes del día</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Facturado (Bs.)</p>
        <p id="kpiMontoBs" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">Bs. 0,00</p>
        <span class="text-xs text-gray-500 font-medium mt-2 inline-block">Total en Bolívares (IVA incl.)</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Facturado ($ USD)</p>
        <p id="kpiMontoUsd" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span class="text-xs text-gray-500 font-medium mt-2 inline-block">Total en Divisas (IVA incl.)</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Ventas por Facturar</p>
        <p id="kpiPorFacturar" class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">0 Ventas</p>
        <span class="text-xs text-gray-500 font-medium mt-2 inline-block">Registradas en Ventas</span>
      </div>
    </div>

    <!-- Tabla de Facturas -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-between">
        <h3 class="font-bold text-lg text-gray-800 dark:text-white">Facturas Emitidas</h3>
        <div class="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
          <div class="relative flex-1">
            <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            <input type="text" id="busquedaFacturas" onkeyup="renderFacturas()" placeholder="Buscar por N° de factura, venta, cliente o RIF..." class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
          </div>
          <div class="relative w-full sm:w-56">
            <select id="filtroEstadoFacturas" onchange="renderFacturas()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="Todos">Todos los Estados</option>
              <option value="Emitida">Emitidas</option>
              <option value="Pagada">Pagadas</option>
              <option value="Pendiente">Pendientes de pago</option>
              <option value="Anulada">Anuladas</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
            <tr>
              <th onclick="ordenarFacturasPor('numero')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por N° Factura">
                <span class="inline-flex items-center gap-1.5">N° Factura <span id="sortIconFac-numero" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarFacturasPor('cliente')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Cliente">
                <span class="inline-flex items-center gap-1.5">Cliente / RIF <span id="sortIconFac-cliente" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarFacturasPor('fecha')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Fecha">
                <span class="inline-flex items-center gap-1.5">Fecha <span id="sortIconFac-fecha" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarFacturasPor('total')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Total (USD)">
                <span class="inline-flex items-center gap-1.5">Total (USD) <span id="sortIconFac-total" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarFacturasPor('totalBs')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Total (Bs)">
                <span class="inline-flex items-center gap-1.5">Total (Bs) <span id="sortIconFac-totalBs" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarFacturasPor('estado')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Estado">
                <span class="inline-flex items-center gap-1.5">Estado <span id="sortIconFac-estado" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th class="py-3 px-4 text-center">Imprimir</th>
            </tr>
          </thead>
          <tbody id="tablaFacturas" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- MODAL: Nueva Factura (Cliente y Venta divididos como en Registro de Pago) -->
  <div id="modalFactura" onclick="if(event.target===this) closeModal('modalFactura')" data-modal class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-xl font-bold text-[#1c4d37] dark:text-white flex items-center gap-2"><i data-lucide="file-plus" class="w-5 h-5"></i> Emitir Nueva Factura</h3>
        <button onclick="closeModal('modalFactura')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Cliente</label>
        <div class="relative">
          <select id="facCliente" onchange="cargarVentasClienteFactura()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"></select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Venta / Pedido a facturar</label>
          <div class="relative">
            <select id="facVenta" disabled onchange="actualizarResumenFactura()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"></select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
          <p id="facClienteInfo" class="text-xs text-gray-500 dark:text-gray-400 mt-1.5"></p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Tasa BCV (Bs/USD)</label>
          <input id="facTasa" type="number" step="0.01" min="0.01" placeholder="Ej. 60.50" oninput="actualizarResumenFactura()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm disabled:opacity-50">
        </div>
      </div>
      <div id="facResumen" class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4"></div>
      <p class="text-xs text-gray-500 dark:text-gray-400">Los precios de Ventas se consideran con IVA incluido; la factura desglosa base imponible e IVA (16%) en $ y en Bs.</p>
      <div class="flex justify-end gap-2 pt-2">
        <button onclick="closeModal('modalFactura')" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
        <button id="btnEmitir" onclick="confirmarEmision()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"><i data-lucide="check-circle" class="w-4 h-4"></i> Emitir Factura</button>
      </div>
    </div>
  </div>

  <!-- MODAL: Vista previa de impresión -->
  <div id="modalPreview" onclick="if(event.target===this) closeModal('modalPreview')" data-modal class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-3xl max-h-[92vh] flex flex-col">
      <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
        <div>
          <p class="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">Vista previa de impresión</p>
          <h3 id="previewTitulo" class="text-lg font-bold text-[#1c4d37] dark:text-white"></h3>
        </div>
        <button onclick="closeModal('modalPreview')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div class="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
        <!-- Hoja simulada tamaño carta -->
        <div id="previewHoja" class="bg-white mx-auto shadow-lg rounded-sm p-10" style="max-width:816px;min-height:600px"></div>
      </div>
      <div class="flex justify-end gap-2 p-5 border-t border-gray-100 dark:border-gray-700">
        <button onclick="closeModal('modalPreview')" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cerrar</button>
        <button onclick="imprimirFactura()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"><i data-lucide="printer" class="w-4 h-4"></i> Imprimir</button>
      </div>
    </div>
  </div>

  <!-- Zona exclusiva de impresión con pie de página inferior izquierdo "Página X/Y" -->
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
