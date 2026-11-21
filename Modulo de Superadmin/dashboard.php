<?php
// Módulo de Superadmin - Dashboard General - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de Superadmin/dashboard.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Panel de Superadmin</title>
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
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: { DEFAULT: '#1c4d37', dark: '#133928', light: '#2d6a4f', bg: '#f4f6f5' }
          }
        }
      }
    }
  </script>
  <?php require_once __DIR__ . '/../Base de Datos/bootstrap_db.php'; ?>
</head>
<body class="bg-[#f4f6f5] dark:bg-gray-900 font-sans antialiased text-gray-800 dark:text-gray-100 flex h-screen overflow-hidden transition-colors duration-300">

  <!-- BARRA LATERAL (SIDEBAR DE SUPERADMIN) -->
  <aside class="w-64 bg-[#1c4d37] dark:bg-[#0f2d1f] text-white flex flex-col justify-between p-4 flex-shrink-0 transition-colors duration-300">
    <div>
      <div class="flex items-center space-x-3 mb-8 px-2">
        <div class="p-2 border border-white/25 rounded-lg bg-white/10">
          <i data-lucide="shield-check" class="w-6 h-6 text-white"></i>
        </div>
        <div>
          <h1 class="font-bold text-lg leading-tight">Gentil Supply</h1>
          <p class="text-xs text-emerald-200">Módulo de Superadmin</p>
        </div>
      </div>

      <nav class="space-y-1">
        <a href="dashboard.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
          <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          <span>Dashboard</span>
        </a>
        <a href="usuarios.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="users" class="w-5 h-5"></i>
          <span>Gestión de Usuarios</span>
        </a>
        <a href="rastreo.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="map-pin" class="w-5 h-5"></i>
          <span>Rastreo por Municipios</span>
        </a>
        <a href="reportes.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
          <span>Reportes Categorizados</span>
        </a>

        <div class="pt-4 pb-1 px-4">
          <p class="text-[11px] uppercase tracking-wider font-semibold text-emerald-200/70">Accesos Directos</p>
        </div>
        <a href="../Modulo de Ventas/dashboard.php?from=superadmin" class="flex items-center justify-between px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <span class="flex items-center space-x-3"><i data-lucide="shopping-cart" class="w-4 h-4"></i><span>Ventas</span></span>
          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 opacity-60"></i>
        </a>
        <a href="../Modulo de facturacion/dashboard.php?from=superadmin" class="flex items-center justify-between px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <span class="flex items-center space-x-3"><i data-lucide="file-text" class="w-4 h-4"></i><span>Facturación</span></span>
          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 opacity-60"></i>
        </a>
        <a href="../Modulo de Despacho/dashboard.php?from=superadmin" class="flex items-center justify-between px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <span class="flex items-center space-x-3"><i data-lucide="truck" class="w-4 h-4"></i><span>Despacho</span></span>
          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 opacity-60"></i>
        </a>
        <a href="../Modulo de Administrador/dashboard.php?from=superadmin" class="flex items-center justify-between px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <span class="flex items-center space-x-3"><i data-lucide="briefcase" class="w-4 h-4"></i><span>Gerente</span></span>
          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 opacity-60"></i>
        </a>
      </nav>
    </div>

    <div class="bg-white/10 rounded-xl p-3 flex items-center justify-between border border-white/10">
      <div>
        <p class="text-xs text-emerald-200">Nivel:</p>
        <p class="font-semibold text-sm text-white">Superadministrador</p>
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

  <!-- CONTENIDO PRINCIPAL: DASHBOARD DE SUPERADMIN -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Superadmin</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Panel de Superadministrador</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Control global del sistema, gestión de usuarios y supervisión gerencial completa.</p>
      </div>
      <div class="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 self-start md:self-auto">
        <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/60 flex items-center justify-center text-[#1c4d37] dark:text-emerald-400">
          <i data-lucide="user-check" class="w-5 h-5"></i>
        </div>
        <div class="leading-tight">
          <p class="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Sesión Activa</p>
          <p id="saludoUsuarioDashboard" class="text-sm font-bold text-[#1c4d37] dark:text-emerald-400">Bienvenido, <span class="nombreRolModulo">Superadmin</span></p>
        </div>
      </div>
    </div>

    <!-- KPIs Globales (incluye Usuarios Activos + métricas gerenciales) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-emerald-200/80 dark:border-emerald-800/60 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Usuarios del Sistema</p>
        <p id="kpiSuperUsuarios" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0</p>
        <span id="kpiSuperUsuariosSub" class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 inline-block">0 activos</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Ventas Activas</p>
        <p id="kpiAdminVentas" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span id="kpiAdminVentasSub" class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 inline-block">0 pedidos</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Cobranzas Verificadas</p>
        <p id="kpiAdminCobrado" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span id="kpiAdminPorVerificar" class="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1 inline-block">0 por verificar</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Facturación Fiscal</p>
        <p id="kpiAdminFacturas" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0 Emitidas</p>
        <span id="kpiAdminPorFacturar" class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 inline-block">0 por facturar</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Despacho</p>
        <p id="kpiAdminDespachos" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0 Completos</p>
        <span id="kpiAdminIncidencias" class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 inline-block">0 en prep. · 0 incidencias</span>
      </div>
    </div>

    <!-- 2 Gráficos Consolidados -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">Top 5 Productos Vendidos (Unidades)</h3>
          <a href="reportes.php" class="text-xs font-semibold text-[#1c4d37] dark:text-emerald-400 hover:underline">Ver reportes</a>
        </div>
        <canvas id="chartAdminTopProductos"></canvas>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Balance Operativo</h3>
        <div class="max-w-xs mx-auto">
          <canvas id="chartAdminModulos"></canvas>
        </div>
      </div>
    </div>

    <!-- Tabla Compacta de Operaciones Recientes -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">Operaciones Recientes</h3>
        <a href="rastreo.php" class="text-xs font-semibold text-[#1c4d37] dark:text-emerald-400 hover:underline">Rastreo por municipios →</a>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th class="py-3 px-4">Pedido</th>
              <th class="py-3 px-4">Cliente</th>
              <th class="py-3 px-4">Fecha</th>
              <th class="py-3 px-4">Unidades</th>
              <th class="py-3 px-4">Crédito</th>
              <th class="py-3 px-4">Total</th>
              <th class="py-3 px-4">Factura</th>
              <th class="py-3 px-4">Estado</th>
            </tr>
          </thead>
          <tbody id="tablaResumenEjecutivo" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
        </table>
      </div>
    </div>
  </main>

  <script src="../modos/darkmode.js"></script>
  <script src="../Modulo de Administrador/admin.js"></script>
  <script src="superadmin.js"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>
