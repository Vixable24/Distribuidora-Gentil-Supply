<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Órdenes de Despacho</title>
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
      #zonaImpresion { display: block !important; width: 100% !important; box-sizing: border-box !important; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important; }
      #zonaImpresion * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      #zonaImpresion thead { display: table-header-group; }
      #zonaImpresion tr, #zonaImpresion .print-avoid-break { break-inside: avoid; page-break-inside: avoid; }
      #zonaImpresion .print-footer-preview { display: none !important; }
      a[href]::after { content: none !important; }
    }
  </style>
  <?php require_once __DIR__ . '/../Base de Datos/bootstrap_db.php'; ?>
</head>
<body class="bg-[#f4f6f5] dark:bg-gray-900 font-sans antialiased text-gray-800 dark:text-gray-100 flex h-screen overflow-hidden transition-colors duration-300">

  <!-- BARRA LATERAL -->
  <aside class="w-64 bg-[#1c4d37] dark:bg-[#0f2d1f] text-white flex flex-col justify-between p-4 flex-shrink-0 transition-colors duration-300">
    <div>
      <div class="flex items-center space-x-3 mb-8 px-2">
        <div class="p-2 border border-white/25 rounded-lg bg-white/10">
          <i data-lucide="box" class="w-6 h-6 text-white"></i>
        </div>
        <div>
          <h1 class="font-bold text-lg leading-tight">Gentil Supply</h1>
          <p class="text-xs text-emerald-200">Módulo de Despacho</p>
        </div>
      </div>

      <nav class="space-y-1">
        <a href="dashboard.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          <span>Dashboard</span>
        </a>
        <a href="despachos.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
          <i data-lucide="truck" class="w-5 h-5"></i>
          <span>Órdenes de Despacho</span>
        </a>
        <a href="incidencias.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="clipboard-check" class="w-5 h-5"></i>
          <span>Estado de Despacho</span>
        </a>
        <a href="inventario.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="package" class="w-5 h-5"></i>
          <span>Inventario</span>
        </a>
      </nav>
    </div>

    <div class="bg-white/10 rounded-xl p-3 flex items-center justify-between border border-white/10">
      <div>
        <p class="text-xs text-emerald-200">Usuario:</p>
        <p class="font-semibold text-sm text-white">Operador de Despacho</p>
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
    <div class="mb-6 flex items-center justify-between gap-4">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="truck" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Despacho</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Gestión de Despachos y Logística</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Municipio Arismendi, Nueva Esparta - Control de Rutas</p>
      </div>
      <button onclick="abrirModalGuia()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm flex items-center gap-2 flex-shrink-0">
        <i data-lucide="plus" class="w-5 h-5"></i> Nueva Guía de Carga
      </button>
    </div>

    <!-- Indicadores -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">En Preparación</p>
        <p id="statPend" class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">0</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Despachos Completos</p>
        <p id="statRuta" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/60 transition-colors">
        <p class="text-xs text-red-500 dark:text-red-400 uppercase font-semibold">Con Incidencia</p>
        <p id="statInc" class="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">0</p>
      </div>
    </div>

    <!-- Cuadro Principal de Órdenes (Diseño unificado con Historial de Ventas) -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <!-- Filtros y vista -->
      <div class="flex flex-col md:flex-row gap-3 mb-6">
        <div class="relative flex-1">
          <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          <input id="search" type="text" placeholder="Buscar por cliente, RIF o N° de orden..." class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm">
        </div>
        <div class="relative">
          <select id="filterEstado" class="w-full md:w-56 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
            <option value="">Todos los estados</option>
            <option value="En Preparación">En Preparación</option>
            <option value="Completo">Completo</option>
            <option value="Con Incidencia">Con Incidencia</option>
          </select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
        <div class="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 self-start md:self-auto">
          <button id="btnTabla" onclick="setVista('tabla')">Tabla</button>
          <button id="btnKanban" onclick="setVista('kanban')">Kanban</button>
        </div>
      </div>

      <!-- Vista Kanban -->
      <div id="kanban" class="hidden grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"></div>

      <!-- Vista Tabla -->
      <div id="tablaWrap">
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left text-gray-600 dark:text-gray-300 datagrid-compacto">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
                <th onclick="ordenarDespachosPor('id')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por N° Orden / Factura">
                  <span class="inline-flex items-center gap-1.5">N° Orden / Factura <span id="sortIconDesp-id" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarDespachosPor('cliente')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Cliente">
                  <span class="inline-flex items-center gap-1.5">Cliente / RIF <span id="sortIconDesp-cliente" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarDespachosPor('conductor')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Conductor">
                  <span class="inline-flex items-center gap-1.5">Conductor / Vehículo <span id="sortIconDesp-conductor" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarDespachosPor('zona')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Destino">
                  <span class="inline-flex items-center gap-1.5">Destino <span id="sortIconDesp-zona" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarDespachosPor('fecha')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Fecha">
                  <span class="inline-flex items-center gap-1.5">Fecha <span id="sortIconDesp-fecha" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarDespachosPor('estado')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Estado">
                  <span class="inline-flex items-center gap-1.5">Estado <span id="sortIconDesp-estado" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th class="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody id="tbody" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
          </table>
        </div>
        <p id="empty" class="hidden p-10 text-center text-gray-400 dark:text-gray-500 text-sm">No se encontraron órdenes con esos filtros.</p>
      </div>
    </div>
  </main>

  <!-- MODAL: Nueva Guía de Carga (Exclusivamente a partir de Facturas Emitidas, con datos de cliente auto-rellenados) -->
  <div id="modalGuia" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <form onsubmit="crearGuia(event)" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 class="text-xl font-bold text-[#1c4d37] dark:text-white">Nueva Guía de Carga</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Selecciona una factura emitida; los datos del cliente y productos se rellenan automáticamente desde la venta.</p>
        </div>
        <button type="button" onclick="closeModal('modalGuia')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Factura Emitida (Obligatoria)</label>
          <div class="relative">
            <select id="gFacturaSelect" required onchange="cargarDatosFacturaEnGuia()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"></select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
          <p id="gFacturaInfo" class="text-xs text-gray-500 dark:text-gray-400 mt-1"></p>
        </div>
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Cliente (Registrado en Venta)</label>
          <input required readonly id="gCliente" placeholder="Se rellena automáticamente al elegir la factura" class="w-full bg-gray-100 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg text-sm font-semibold cursor-not-allowed">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">RIF Fiscal (Auto-rellenado)</label>
          <input required readonly id="gRif" placeholder="Se rellena automáticamente" class="w-full bg-gray-100 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg text-sm font-mono cursor-not-allowed">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Destino / Municipio (De la Venta)</label>
          <input required readonly id="gZona" placeholder="Se rellena automáticamente" class="w-full bg-gray-100 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg text-sm cursor-not-allowed">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Fecha de Guía</label>
          <input required type="date" id="gFecha" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Conductor / Vehículo</label>
          <div class="relative">
            <select id="gConductor" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer"></select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
        <div class="sm:col-span-2">
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-200">Mercancía de la Factura (Auto-rellenada)</label>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Estado al asignar guía: En Preparación</span>
          </div>
          <textarea id="gItems" readonly rows="3" placeholder="Los productos de la factura emitida aparecerán aquí automáticamente..." class="w-full bg-gray-100 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg text-sm cursor-not-allowed"></textarea>
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal('modalGuia')" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
        <button id="btnCrearGuiaSubmit" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">Crear Guía</button>
      </div>
    </form>
  </div>

  <!-- MODAL: Registrar Incidencia -->
  <div id="modalInc" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <form onsubmit="guardarIncidencia(event)" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
      <h3 class="text-xl font-bold text-red-600 dark:text-red-400">Registrar Incidencia — <span id="incOrden"></span></h3>
      <div>
        <p class="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">¿Con quién es el problema?</p>
        <div class="grid grid-cols-2 gap-3">
          <label class="cursor-pointer">
            <input type="radio" name="incTipo" value="cliente" class="peer sr-only" checked onchange="renderAlertaInc()">
            <div class="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 peer-checked:border-[#1c4d37] dark:peer-checked:border-emerald-400 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 text-center text-sm font-medium transition-colors">Con el Cliente</div>
          </label>
          <label class="cursor-pointer">
            <input type="radio" name="incTipo" value="transporte" class="peer sr-only" onchange="renderAlertaInc()">
            <div class="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 peer-checked:border-[#1c4d37] dark:peer-checked:border-emerald-400 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 text-center text-sm font-medium transition-colors">Equipo de Transporte</div>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Motivo</label>
        <div class="relative">
          <select id="incMotivo" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer"></select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
      </div>
      <div id="incAlerta"></div>
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Descripción</label>
        <textarea id="incDesc" required rows="3" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm"></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal('modalInc')" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
        <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm">Registrar Incidencia</button>
      </div>
    </form>
  </div>

  <!-- MODAL: Detalle / Nota de Entrega -->
  <div id="modalDet" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-bold text-[#1c4d37] dark:text-white">Guía de Carga / Nota de Entrega</h3>
        <button onclick="closeModal('modalDet')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Cerrar"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div id="printArea" class="bg-white text-gray-900 rounded-xl border border-gray-300 p-6 text-sm"></div>
      <div class="flex justify-end gap-2 pt-2">
        <button onclick="closeModal('modalDet')" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cerrar</button>
        <button onclick="imprimirGuiaCarga()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm flex items-center gap-2">
          <i data-lucide="printer" class="w-4 h-4"></i> Imprimir
        </button>
      </div>
    </div>
  </div>

  <div id="zonaImpresion"></div>

  <!-- Notificación -->
  <div id="toast" class="hidden opacity-0 translate-y-2 transition-all duration-300 fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl bg-[#1c4d37] dark:bg-emerald-600 text-white text-sm shadow-lg"></div>

  <!-- Módulo de modo oscuro -->
  <script src="../modos/darkmode.js"></script>
  <!-- Lógica de despacho -->
  <script src="despacho.js"></script>
  <script>
    lucide.createIcons();
    initOrdenes();
  </script>
</body>
</html>

