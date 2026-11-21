<?php
// Módulo de Dashboard de Facturación - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de facturacion/dashboard.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gentil Supply - Dashboard de Facturación</title>
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
    <!-- Chart.js para las gráficas fiscales -->
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

      <!-- Navegación propia del módulo de facturación con el Dashboard en 1ª posición -->
      <nav class="space-y-1">
        <a href="dashboard.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
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

  <!-- CONTENIDO PRINCIPAL: DASHBOARD DE FACTURACIÓN -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Facturación</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Dashboard de Facturación</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Municipio Arismendi, Nueva Esparta - Resumen de emisión fiscal y documentos.</p>
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

    <!-- Tarjetas de Métricas (KPIs Fiscales Conectados a Datos Reales) -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Facturas Emitidas Vigentes</p>
        <p id="dashFacEmitidas" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0</p>
        <span id="dashFacEmitidasSub" class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 inline-block">0 emitidas hoy</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Facturado (Bs)</p>
        <p id="dashFacTotalBs" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">Bs. 0,00</p>
        <span id="dashFacTasaSub" class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 inline-block">Incluye IVA (16%)</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Facturado (USD)</p>
        <p id="dashFacTotalUsd" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span id="dashFacCobradoSub" class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 inline-block">$0.00 cobrado verificado</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Pendientes por Procesar</p>
        <p id="dashFacPendientes" class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">0 Órdenes</p>
        <span id="dashFacPorVerifSub" class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 inline-block">0 pagos por verificar</span>
      </div>
    </div>

    <!-- Gráficos de Facturación (Conectados a Facturas y Cobranzas Reales) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Emisión de Facturas Fiscales (Bs)</h3>
        <canvas id="chartFacturacionBs"></canvas>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Distribución Real de Pagos / Cobranzas</h3>
        <canvas id="chartCobranzas"></canvas>
      </div>
    </div>
  </main>

  <!-- Scripts -->
  <script src="../modos/darkmode.js"></script>
  <script src="facturacion.js"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>