<?php
// Módulo de Superadmin - Rastreo por Municipios - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de Superadmin/rastreo.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Rastreo por Municipios (Superadmin)</title>
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
          colors: { brand: { DEFAULT: '#1c4d37', dark: '#133928', light: '#2d6a4f', bg: '#f4f6f5' } }
        }
      }
    }
  </script>
  <?php require_once __DIR__ . '/../Base de Datos/bootstrap_db.php'; ?>
</head>
<body class="bg-[#f4f6f5] dark:bg-gray-900 font-sans antialiased text-gray-800 dark:text-gray-100 flex h-screen overflow-hidden transition-colors duration-300">

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
        <a href="dashboard.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          <span>Dashboard</span>
        </a>
        <a href="usuarios.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="users" class="w-5 h-5"></i>
          <span>Gestión de Usuarios</span>
        </a>
        <a href="rastreo.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
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

  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6">
      <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
        <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
        </div>
        <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Superadmin</span>
      </div>
      <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Rastreo por Municipios</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Trazabilidad completa de facturas por municipio en Nueva Esparta (5 etapas).</p>
    </div>

    <div id="rastreoMunicipios" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="flex flex-col sm:flex-row gap-3 mb-5">
        <div class="relative flex-1">
          <i data-lucide="search" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          <input type="text" id="busquedaFacturaRastreo" oninput="renderRastreoMunicipios()" placeholder="Buscar factura, venta o cliente..." class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 pl-9 pr-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm">
        </div>
        <div class="relative w-full sm:w-64">
          <select id="filtroMunicipioRastreo" onchange="seleccionarMunicipioRastreo(this.value)" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
            <option value="Todos">Todos los Municipios</option>
            <option value="Antolín del Campo">Antolín del Campo</option>
            <option value="Arismendi">Arismendi</option>
            <option value="Díaz">Díaz</option>
            <option value="García">García</option>
            <option value="Gómez">Gómez</option>
            <option value="Maneiro">Maneiro</option>
            <option value="Marcano">Marcano</option>
            <option value="Mariño">Mariño</option>
            <option value="Península de Macanao">Península de Macanao</option>
            <option value="Tubores">Tubores</option>
            <option value="Villalba">Villalba</option>
          </select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
      </div>

      <div id="gridMunicipiosRastreo" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#1c4d37] dark:text-emerald-400">Facturas por Municipio</h4>
            <span id="contadorFacturasRastreo" class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-300">0 facturas</span>
          </div>
          <div id="listaFacturasMunicipio" class="space-y-2.5 max-h-[420px] overflow-y-auto pr-1"></div>
        </div>
        <div class="lg:col-span-7 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div id="contenedorLineaTiempo5"></div>
        </div>
      </div>
    </div>
  </main>

  <script src="../modos/darkmode.js"></script>
  <script src="../Modulo de Administrador/admin.js"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>
