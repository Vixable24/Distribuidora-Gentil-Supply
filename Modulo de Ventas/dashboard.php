<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Dashboard</title>
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

  <!-- BARRA LATERAL (SIDEBAR - Misma temática y componentes) -->
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

      <!-- Navegación: Dashboard en 1ª posición (Activo) -->
      <nav class="space-y-1">
        <a href="dashboard.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
          <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          <span>Dashboard</span>
        </a>
        <a href="ventas.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="plus-circle" class="w-5 h-5"></i>
          <span>Generar Venta</span>
        </a>
        <a href="historial.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
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

  <!-- CONTENIDO PRINCIPAL: DASHBOARD -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Ventas</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Dashboard</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Resumen general de operaciones, ventas y estado de caja.</p>
      </div>
      <!-- Saludo de Bienvenida (Ruta editable a futuro) -->
      <div class="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 self-start sm:self-auto">
        <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/60 flex items-center justify-center text-[#1c4d37] dark:text-emerald-400">
          <i data-lucide="user-check" class="w-5 h-5"></i>
        </div>
        <div class="leading-tight">
          <p class="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Sesión Activa</p>
          <p id="saludoUsuarioDashboard" class="text-sm font-bold text-[#1c4d37] dark:text-emerald-400">Bienvenido, <span id="nombreRutaActiva">Ruta 2</span></p>
        </div>
      </div>
    </div>

    <!-- Tarjetas de Métricas (KPIs Conectados a Datos Reales) -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Ventas Activas</p>
        <p id="kpiVentasHoy" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span id="kpiVentasHoySub" class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 inline-block">Bs. 0,00</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Balance de Caja (Verificado)</p>
        <p id="kpiBalanceCaja" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span id="kpiBalanceCajaSub" class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 inline-block">Por cobrar: $0.00</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Clientes Activos</p>
        <p id="kpiClientesActivos" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0</p>
        <span id="kpiClientesActivosSub" class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 inline-block">En cartera de Ventas</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Transacciones</p>
        <p id="kpiTransacciones" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0</p>
        <span id="kpiTransaccionesSub" class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 inline-block">0 ventas · 0 cobros</span>
      </div>
    </div>

    <!-- Gráficos Conectados a Datos Reales -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Ventas Facturadas vs. Cobros por Pedido ($ USD)</h3>
        <canvas id="chartCaja"></canvas>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Tendencia Real de Ventas por Fecha ($ USD)</h3>
        <canvas id="chartVentas"></canvas>
      </div>
    </div>
  </main>

  <!-- Módulo de modo oscuro -->
  <script src="../modos/darkmode.js"></script>
  <!-- Lógica de ventas -->
  <script src="ventas.js"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>