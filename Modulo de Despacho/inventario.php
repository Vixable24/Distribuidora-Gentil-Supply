<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Inventario de Despacho</title>
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
        <a href="despachos.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="truck" class="w-5 h-5"></i>
          <span>Órdenes de Despacho</span>
        </a>
        <a href="incidencias.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="clipboard-check" class="w-5 h-5"></i>
          <span>Estado de Despacho</span>
        </a>
        <a href="inventario.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
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

  <!-- CONTENIDO PRINCIPAL: INVENTARIO DE ALMACÉN Y DESPACHO -->
  <main class="flex-1 overflow-y-auto p-8">
    <!-- Encabezado -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="truck" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Despacho</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Inventario de Almacén y Despacho</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Control de existencias por marca, presentación y unidades individuales (Muchy, Galleterías PUIG y Fisa).</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button onclick="abrirKardex()" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm flex items-center gap-2">
          <i data-lucide="history" class="w-4 h-4 text-[#1c4d37] dark:text-emerald-400"></i> Historial / Kardex
        </button>
        <button onclick="irARegistroMovimiento()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm flex items-center gap-2">
          <i data-lucide="plus-circle" class="w-5 h-5"></i> Registrar Movimiento
        </button>
      </div>
    </div>

    <!-- KPIs de Inventario -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Unidades Individuales</p>
          <span class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-400"><i data-lucide="layers" class="w-4 h-4"></i></span>
        </div>
        <p id="invKpiUnidades" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0 uds</p>
        <p id="invKpiUnidadesSub" class="text-xs text-gray-500 dark:text-gray-400 mt-1">Equivalente total en almacén</p>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Empaques / Uds</p>
          <span class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-400"><i data-lucide="package" class="w-4 h-4"></i></span>
        </div>
        <p id="invKpiEmpaques" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0</p>
        <p id="invKpiEmpaquesSub" class="text-xs text-gray-500 dark:text-gray-400 mt-1">Cajas, displays, mangas y sueltos</p>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Valor en Almacén</p>
          <span class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-400"><i data-lucide="dollar-sign" class="w-4 h-4"></i></span>
        </div>
        <p id="invKpiValor" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <p id="invKpiValorSub" class="text-xs text-gray-500 dark:text-gray-400 mt-1">3 marcas · 25 presentaciones</p>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-amber-200 dark:border-amber-900/60 transition-colors">
        <div class="flex items-center justify-between">
          <p class="text-xs text-amber-600 dark:text-amber-400 uppercase font-semibold">Alertas de Reposición</p>
          <span class="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"><i data-lucide="alert-circle" class="w-4 h-4"></i></span>
        </div>
        <p id="invKpiAlertas" class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">0</p>
        <p id="invKpiAlertasSub" class="text-xs text-gray-500 dark:text-gray-400 mt-1">Presentaciones en stock bajo o agotadas</p>
      </div>
    </div>

    <!-- CUADRO PRINCIPAL DE EXISTENCIAS (Diseño unificado con Historial de Ventas) -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="space-y-4 mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
          <!-- Selector de Vista: Por Presentación vs Consolidado por Producto Base -->
          <div class="flex flex-wrap gap-2">
            <button id="tabInvPresentaciones" onclick="cambiarVistaInventario('presentaciones')" class="px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 bg-[#1c4d37] text-white dark:bg-emerald-600">
              <i data-lucide="package" class="w-4 h-4"></i> Existencias por Presentación (25)
            </button>
            <button id="tabInvConsolidado" onclick="cambiarVistaInventario('consolidado')" class="px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
              <i data-lucide="layers" class="w-4 h-4"></i> Consolidado por Producto en Unidades (12)
            </button>
          </div>

          <!-- Botones rápidos de filtro por Marca -->
          <div id="invChipsMarca" class="flex flex-wrap gap-1.5">
            <button type="button" data-marca="" onclick="filtrarPorChipMarca('')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-[#1c4d37] text-white dark:bg-emerald-600">Todas</button>
            <button type="button" data-marca="muchy" onclick="filtrarPorChipMarca('muchy')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">Muchy</button>
            <button type="button" data-marca="puig" onclick="filtrarPorChipMarca('puig')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">Galleterías PUIG</button>
            <button type="button" data-marca="fisa" onclick="filtrarPorChipMarca('fisa')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">Fisa</button>
          </div>
        </div>

        <!-- Barra de búsqueda y selectores de filtro -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div class="relative md:col-span-2">
            <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            <input id="invSearch" type="text" oninput="renderInventario()" placeholder="Buscar producto, presentación, código o pasillo..." class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm">
          </div>
          <div class="relative">
            <select id="invFilterPres" onchange="renderInventario()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="">Todas las presentaciones</option>
              <option value="caja">Cajas</option>
              <option value="display">Displays</option>
              <option value="manga">Mangas</option>
              <option value="sachet">Ristras / Sachet</option>
              <option value="unidad">Unidades sueltas</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
          <div class="relative">
            <select id="invFilterEstado" onchange="renderInventario()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="">Todos los niveles de stock</option>
              <option value="ok">Disponible (Óptimo)</option>
              <option value="bajo">Stock Bajo (Por reponer)</option>
              <option value="agotado">Sin Stock (Agotado)</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
      </div>

      <!-- VISTA 1: TABLA DE EXISTENCIAS POR PRESENTACIÓN -->
      <div id="wrapTablaPresentaciones">
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left text-gray-600 dark:text-gray-300 datagrid-compacto">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
                <th onclick="ordenarInvPresPor('nombre')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Producto">
                  <span class="inline-flex items-center gap-1.5">Producto / Marca <span id="sortIconInvP-nombre" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarInvPresPor('tipo')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Presentación">
                  <span class="inline-flex items-center gap-1.5">Presentación <span id="sortIconInvP-tipo" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarInvPresPor('ubicacion')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Ubicación">
                  <span class="inline-flex items-center gap-1.5">Ubicación <span id="sortIconInvP-ubicacion" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarInvPresPor('stock')" class="py-3 px-4 text-center cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Stock (Empaques)">
                  <span class="inline-flex items-center justify-center gap-1.5">Stock (Empaques) <span id="sortIconInvP-stock" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarInvPresPor('unidades')" class="py-3 px-4 text-center cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Unidades Individuales">
                  <span class="inline-flex items-center justify-center gap-1.5">Unidades Individuales <span id="sortIconInvP-unidades" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarInvPresPor('stockMin')" class="py-3 px-4 text-center cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Mínimo">
                  <span class="inline-flex items-center justify-center gap-1.5">Mínimo <span id="sortIconInvP-stockMin" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarInvPresPor('estado')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Estado">
                  <span class="inline-flex items-center gap-1.5">Estado <span id="sortIconInvP-estado" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th class="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody id="tbodyInventarioPres" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
          </table>
        </div>
        <p id="invEmptyPres" class="hidden p-10 text-center text-gray-400 dark:text-gray-500 text-sm">No se encontraron productos en inventario con esos filtros.</p>
      </div>

      <!-- VISTA 2: TABLA CONSOLIDADA POR PRODUCTO BASE -->
      <div id="wrapTablaConsolidado" class="hidden">
        <div class="p-3.5 mb-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20">
          <p class="text-xs text-gray-600 dark:text-gray-300">
            <b class="text-[#1c4d37] dark:text-emerald-400">Consolidado por Producto Base:</b> Suma todas las unidades individuales disponibles de cada producto (convirtiendo cajas de 24 uds, displays de 18/24 uds, mangas de 12 uds y ristras de 12 sobres a unidades individuales) e indica exactamente qué presentaciones hay en almacén.
          </p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left text-gray-600 dark:text-gray-300 datagrid-compacto">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
                <th onclick="ordenarInvConsPor('baseNombre')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Producto Base">
                  <span class="inline-flex items-center gap-1.5">Producto Base <span id="sortIconInvC-baseNombre" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarInvConsPor('marcaNombre')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Marca">
                  <span class="inline-flex items-center gap-1.5">Marca <span id="sortIconInvC-marcaNombre" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th onclick="ordenarInvConsPor('unidadesTotales')" class="py-3 px-4 text-center cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Total Unidades">
                  <span class="inline-flex items-center justify-center gap-1.5">Total Unidades Disponibles <span id="sortIconInvC-unidadesTotales" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
                <th class="py-3 px-4">Desglose en Almacén (Qué hay de cada presentación)</th>
                <th onclick="ordenarInvConsPor('valorTotal')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Valor Total">
                  <span class="inline-flex items-center justify-end gap-1.5">Valor Total <span id="sortIconInvC-valorTotal" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
                </th>
              </tr>
            </thead>
            <tbody id="tbodyInventarioConsolidado" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
          </table>
        </div>
      </div>
    </div>
  </main>

  <!-- MODAL: Registrar Movimiento en Almacén (Pequeño cuadro compacto: Entrada de Mercancía / Merma) -->
  <div id="modalMovimientoInv" onclick="if(event.target===this) closeModal('modalMovimientoInv')" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
      <div class="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-bold text-[#1c4d37] dark:text-white flex items-center gap-2">
            <i data-lucide="boxes" class="w-5 h-5"></i> Registrar Movimiento en Almacén
          </h3>
          <span id="movResumenBadge" class="inline-block mt-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-400 px-2.5 py-0.5 rounded-full">0 líneas · 0 uds individuales</span>
        </div>
        <button type="button" onclick="closeModal('modalMovimientoInv')" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Cerrar"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>

      <!-- Tipo de Operación: Solo Entrada de Mercancía o Merma -->
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Tipo de Operación</label>
        <input type="hidden" id="movTipoSelect" value="entrada">
        <div id="movTipoOpciones" class="grid grid-cols-2 gap-2.5">
          <button type="button" data-mov="entrada" onclick="seleccionarTipoMovimiento('entrada')" class="py-2.5 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-1.5">
            <i data-lucide="package-plus" class="w-4 h-4"></i> Entrada de Mercancía
          </button>
          <button type="button" data-mov="ajuste" onclick="seleccionarTipoMovimiento('ajuste')" class="py-2.5 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-1.5">
            <i data-lucide="package-minus" class="w-4 h-4"></i> Merma (−)
          </button>
        </div>
        <p id="movTipoInfo" class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1">Entrada de mercancía en almacén: suma existencias al stock actual.</p>
      </div>

      <!-- Selector en Cascada: Marca → Presentación → Producto -->
      <div class="space-y-2.5">
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-200">Producto del Catálogo</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div class="relative">
            <select id="invMarcaSelect" onchange="cargarPresentacionesInv()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 pl-3.5 pr-9 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="" disabled selected>Marca</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
          <div class="relative">
            <select id="invPresentacionSelect" onchange="cargarProductosInv()" disabled class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 pl-3.5 pr-9 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="" disabled selected>Presentación</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
          <div class="relative">
            <select id="invProductoSelect" onchange="actualizarInfoProductoInv()" disabled class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 pl-3.5 pr-9 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="" disabled selected>Producto</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
        <div class="flex gap-2 items-center">
          <p id="invInfoProducto" class="flex-1 text-xs text-gray-500 dark:text-gray-400 px-1">Selecciona marca, presentación y producto.</p>
          <input type="text" inputmode="numeric" pattern="[0-9]*" id="invCantidadInput" placeholder="Cant." autocomplete="off" onkeydown="validarTeclaCantidadInv(event)" oninput="validarInputCantidadInv(this)" onpaste="pegarCantidadInv(event, this)" class="w-24 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm text-center font-mono">
          <button type="button" onclick="agregarAlMovimientoInv()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg transition-colors flex-shrink-0 flex items-center justify-center font-medium text-sm gap-1.5">
            <i data-lucide="plus" class="w-4 h-4"></i> Añadir
          </button>
        </div>
        <p id="invCantidadAviso" class="hidden text-xs font-medium text-red-600 dark:text-red-400 px-1"></p>
      </div>

      <!-- Lista compacta de productos agregados -->
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Productos en el Movimiento</label>
        <div id="listaMovimientoContainer" class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 min-h-[120px] max-h-48 overflow-y-auto space-y-2"></div>
      </div>

      <!-- Pie del cuadro -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Unidades</p>
          <p id="totalUnidadesMovDisplay" class="text-lg font-bold text-[#1c4d37] dark:text-emerald-400">0 uds</p>
        </div>
        <div class="flex gap-2">
          <button type="button" onclick="closeModal('modalMovimientoInv')" class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
          <button type="button" onclick="procesarMovimientoInv()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-colors text-sm flex items-center gap-1.5">
            <i data-lucide="check-circle" class="w-4 h-4"></i> Aplicar al Inventario
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: Ajuste / Movimiento Rápido de un Producto -->
  <div id="modalAjusteInv" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <form onsubmit="guardarAjusteIndividual(event)" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-md overflow-hidden p-6 space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs uppercase font-semibold text-gray-400">Control de Stock</p>
          <h3 id="ajTituloProd" class="text-lg font-bold text-[#1c4d37] dark:text-white">Producto</h3>
          <p id="ajSubProd" class="text-xs text-gray-500 dark:text-gray-400"></p>
        </div>
        <button type="button" onclick="closeModal('modalAjusteInv')" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>

      <input type="hidden" id="ajProdId">

      <div class="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl text-center">
        <div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 uppercase">Stock Actual</p>
          <p id="ajStockActual" class="text-lg font-bold text-gray-900 dark:text-white">0</p>
        </div>
        <div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 uppercase">Contenido</p>
          <p id="ajContiene" class="text-lg font-bold text-[#1c4d37] dark:text-emerald-400">1 ud</p>
        </div>
        <div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 uppercase">Total Unidades</p>
          <p id="ajUnidadesActual" class="text-lg font-bold text-emerald-600 dark:text-emerald-400">0 uds</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Acción</label>
          <div class="relative">
            <select id="ajAccion" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="entrada">Entrada de Mercancía (+)</option>
              <option value="salida">Merma (− Descontar)</option>
              <option value="fijar">Fijar conteo exacto</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Cantidad (Empaques)</label>
          <input type="text" inputmode="numeric" pattern="[0-9]*" id="ajCantidad" required autocomplete="off" onkeydown="validarTeclaEnteroIndividual(event)" oninput="limpiarEnteroNoNegativo(this)" onpaste="pegarEnteroNoNegativo(event, this)" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 px-3 rounded-lg text-sm font-mono">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Stock Mínimo Alerta</label>
          <input type="text" inputmode="numeric" pattern="[0-9]*" id="ajStockMin" required autocomplete="off" onkeydown="validarTeclaEnteroIndividual(event)" oninput="limpiarEnteroNoNegativo(this)" onpaste="pegarEnteroNoNegativo(event, this)" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 px-3 rounded-lg text-sm font-mono">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Ubicación Almacén</label>
          <input type="text" id="ajUbicacion" required class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 px-3 rounded-lg text-sm">
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal('modalAjusteInv')" class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
        <button type="submit" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-colors text-sm">Guardar Cambios</button>
      </div>
    </form>
  </div>

  <!-- MODAL: Historial de Movimientos / Kardex -->
  <div id="modalKardex" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-[#1c4d37] dark:text-white">Historial de Movimientos de Inventario (Kardex)</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Registro cronológico de entradas, salidas por despacho y ajustes de almacén.</p>
        </div>
        <button onclick="closeModal('modalKardex')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div class="flex-1 overflow-y-auto p-6">
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left text-gray-600 dark:text-gray-300 datagrid-compacto">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
                <th class="py-3 px-4">ID / Fecha</th>
                <th class="py-3 px-4">Tipo</th>
                <th class="py-3 px-4">Referencia / Motivo</th>
                <th class="py-3 px-4">Detalle de Productos</th>
                <th class="py-3 px-4 text-center">Unidades</th>
              </tr>
            </thead>
            <tbody id="tbodyKardex" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
          </table>
        </div>
      </div>
      <div class="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
        <button onclick="closeModal('modalKardex')" class="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cerrar</button>
      </div>
    </div>
  </div>

  <!-- Notificación -->
  <div id="toast" class="hidden opacity-0 translate-y-2 transition-all duration-300 fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl bg-[#1c4d37] dark:bg-emerald-600 text-white text-sm shadow-lg"></div>

  <!-- Módulo de modo oscuro -->
  <script src="../modos/darkmode.js"></script>
  <!-- Lógica de despacho e inventario -->
  <script src="despacho.js"></script>
  <script>
    lucide.createIcons();
    initInventario();
  </script>
</body>
</html>

