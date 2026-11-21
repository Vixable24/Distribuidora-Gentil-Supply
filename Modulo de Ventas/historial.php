<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Historial de Ventas</title>
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

  <!-- BARRA LATERAL (SIDEBAR) -->
  <aside class="w-64 bg-[#1c4d37] dark:bg-[#0f2d1f] text-white flex flex-col justify-between p-4 flex-shrink-0 transition-colors duration-300">
    <div>
      <!-- Logo Header / Botón Modo Oscuro -->
      <div class="flex items-center space-x-3 mb-8 px-2">
        <div class="p-2 border border-white/25 rounded-lg bg-white/10">
          <i data-lucide="box" class="w-6 h-6 text-white"></i>
        </div>
        <div>
          <h1 class="font-bold text-lg leading-tight">Gentil Supply</h1>
          <p class="text-xs text-emerald-200">Sistema de Gestión</p>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="space-y-1">
        <!-- Dashboard en la 1ª posición -->
        <a href="dashboard.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          <span>Dashboard</span>
        </a>
        <a href="ventas.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="plus-circle" class="w-5 h-5"></i>
          <span>Generar Venta</span>
        </a>
        <!-- Opción Activa -->
        <a href="historial.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
          <i data-lucide="history" class="w-5 h-5"></i>
          <span>Historial de Ventas</span>
        </a>
        <a href="clientes.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="users" class="w-5 h-5"></i>
          <span>Clientes</span>
        </a>
        <a href="caja.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="credit-card" class="w-5 h-5"></i>
          <span>Registro de Pagos</span>
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

  <!-- CONTENIDO PRINCIPAL: HISTORIAL DE VENTAS -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Ventas</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Historial de Ventas</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Consulta, busca y supervisa el registro de todas las transacciones pasadas.</p>
      </div>
      <!-- Saludo de Bienvenida (Ruta editable a futuro) -->
      <div class="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 self-start sm:self-auto">
        <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/60 flex items-center justify-center text-[#1c4d37] dark:text-emerald-400">
          <i data-lucide="user-check" class="w-5 h-5"></i>
        </div>
        <div class="leading-tight">
          <p class="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Sesión Activa</p>
          <p class="text-sm font-bold text-[#1c4d37] dark:text-emerald-400">Bienvenido, <span class="nombreRutaActiva">Ruta 2</span></p>
        </div>
      </div>
    </div>

    <!-- Tarjeta Principal de la Tabla de Historial -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      
      <!-- Filtros y Búsqueda -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6 justify-between">
        <div class="relative flex-1">
          <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          <input 
            type="text" 
            id="inputBusquedaHistorial"
            onkeyup="filtrarHistorial()"
            placeholder="Buscar por cliente o ID de venta..." 
            class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm text-gray-700 dark:text-gray-200 transition"
          />
        </div>
        <div class="relative w-full sm:w-64">
          <select id="filtroEstadoHistorial" onchange="filtrarHistorial()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
            <option value="Todos">Todos los Estados</option>
            <option value="Completada">Venta Completada</option>
            <option value="Pendiente">Venta Pendiente</option>
            <option value="Cancelada">Venta Cancelada</option>
            <option value="DESP_En Preparación">Despacho: En Preparación</option>
            <option value="DESP_Completo">Despacho: Completo</option>
            <option value="DESP_Con Incidencia">Despacho: Con Incidencia</option>
          </select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
      </div>

      <!-- Tabla del Historial -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th class="py-3 px-4">ID</th>
              <th class="py-3 px-4">Cliente</th>
              <th onclick="ordenarHistorialPor('fecha')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Fecha">
                <span class="inline-flex items-center gap-1.5">Fecha <i id="sortIconHist-fecha" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th onclick="ordenarHistorialPor('items')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Items">
                <span class="inline-flex items-center gap-1.5">Items <i id="sortIconHist-items" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th onclick="ordenarHistorialPor('total')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Total">
                <span class="inline-flex items-center gap-1.5">Total <i id="sortIconHist-total" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th onclick="ordenarHistorialPor('estado')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Estado">
                <span class="inline-flex items-center gap-1.5">Estado <i id="sortIconHist-estado" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th class="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody id="tablaHistorialVentas" class="divide-y divide-gray-50 dark:divide-gray-700 text-sm">
            <!-- Datos cargados por JS -->
          </tbody>
        </table>
      </div>

    </div>
  </main>

    <!-- MODAL: Detalle del pedido -->
  <div id="modalVenta" onclick="if(event.target===this) closeModal('modalVenta')" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <div id="modalVentaBody" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto"></div>
  </div>

  <!-- Notificación -->
  <div id="toast" class="hidden opacity-0 translate-y-2 transition-all duration-300 fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl bg-[#1c4d37] dark:bg-emerald-600 text-white text-sm shadow-lg"></div>

  <!-- Módulo de modo oscuro -->
  <script src="../modos/darkmode.js"></script>
  <!-- Lógica de ventas -->
  <script src="ventas.js"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>