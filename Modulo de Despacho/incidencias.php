<?php
// Módulo de Estado de Despacho - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de Despacho/incidencias.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Estado de Despacho</title>
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
  <script src="https://cdn.tailwindcss.com"></script>
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

  <!-- BARRA LATERAL (Sincronizada con todo el Módulo de Despacho) -->
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
        <a href="incidencias.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
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

  <!-- CONTENIDO PRINCIPAL: ESTADO DE DESPACHO -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6">
      <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
        <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
          <i data-lucide="truck" class="w-3.5 h-3.5"></i>
        </div>
        <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Despacho</span>
      </div>
      <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Estado de Despacho</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Asigna a cada orden con guía en preparación el estado <b>Completo</b> o <b>Con Incidencia</b> (y marca incidencias como resueltas).</p>
    </div>

    <!-- 3 Indicadores Limpios -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">En Preparación</p>
        <p id="estKpiPreparacion" class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">0</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Completos</p>
        <p id="estKpiCompleto" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/60 transition-colors">
        <p class="text-xs text-red-500 dark:text-red-400 uppercase font-semibold">Con Incidencia</p>
        <p id="estKpiIncidencia" class="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">0</p>
      </div>
    </div>

    <!-- Cuadro Principal: Filtros + Tabla de Estado de Despacho (Diseño unificado con Historial de Ventas) -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="flex flex-col sm:flex-row gap-3 mb-6 justify-between">
        <div class="relative flex-1">
          <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          <input id="estBusqueda" type="text" oninput="renderEstadoDespacho()" placeholder="Buscar por guía, factura o cliente..." class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm">
        </div>
        <div class="relative w-full sm:w-56">
          <select id="estFiltroEstado" onchange="renderEstadoDespacho()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
            <option value="">Todos los estados</option>
            <option value="En Preparación">En Preparación</option>
            <option value="Completo">Completo</option>
            <option value="Con Incidencia">Con Incidencia</option>
          </select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th onclick="ordenarEstadoDespachoPor('id')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors">
                <span class="inline-flex items-center gap-1.5">N° Guía / Factura <span id="sortIconEstD-id" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarEstadoDespachoPor('cliente')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors">
                <span class="inline-flex items-center gap-1.5">Cliente <span id="sortIconEstD-cliente" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarEstadoDespachoPor('zona')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors">
                <span class="inline-flex items-center gap-1.5">Destino <span id="sortIconEstD-zona" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarEstadoDespachoPor('fecha')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors">
                <span class="inline-flex items-center gap-1.5">Fecha <span id="sortIconEstD-fecha" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarEstadoDespachoPor('estado')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors">
                <span class="inline-flex items-center gap-1.5">Estado Actual <span id="sortIconEstD-estado" class="inline-flex items-center"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th class="py-3 px-4 text-center">Otorgar Estado</th>
            </tr>
          </thead>
          <tbody id="tbodyEstadoDespacho" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
        </table>
      </div>
      <p id="estVacio" class="hidden p-10 text-center text-gray-400 dark:text-gray-500 text-sm">No se encontraron despachos registrados.</p>
    </div>
  </main>

  <!-- MODAL: Registrar Incidencia -->
  <div id="modalInc" onclick="if(event.target===this) closeModal('modalInc')" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <form onsubmit="guardarIncidencia(event)" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
      <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-xl font-bold text-red-600 dark:text-red-400">Registrar Incidencia — <span id="incOrden"></span></h3>
        <button type="button" onclick="closeModal('modalInc')" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">Origen de la incidencia</p>
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
        <textarea id="incDesc" required rows="3" placeholder="Describe brevemente lo ocurrido..." class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm"></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal('modalInc')" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
        <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm">Guardar Incidencia</button>
      </div>
    </form>
  </div>

  <!-- Notificación -->
  <div id="toast" class="hidden opacity-0 translate-y-2 transition-all duration-300 fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl bg-[#1c4d37] dark:bg-emerald-600 text-white text-sm shadow-lg"></div>

  <!-- Módulo de modo oscuro -->
  <script src="../modos/darkmode.js"></script>
  <!-- Lógica de despacho -->
  <script src="despacho.js"></script>
  <script>
    lucide.createIcons();
    renderEstadoDespacho();
  </script>
</body>
</html>
