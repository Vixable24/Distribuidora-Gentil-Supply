<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Registro de Pagos</title>
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

  <!-- BARRA LATERAL (SIDEBAR UNIFICADO) -->
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
        <a href="historial.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="history" class="w-5 h-5"></i>
          <span>Historial de Ventas</span>
        </a>
        <a href="clientes.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="users" class="w-5 h-5"></i>
          <span>Clientes</span>
        </a>
        <!-- Opción Activa -->
        <a href="caja.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
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

  <!-- CONTENIDO PRINCIPAL: REGISTRO DE PAGOS -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Ventas</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Registro de Pagos</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Supervisión de transacciones, cobros e ingresos de caja.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Saludo de Bienvenida (Ruta editable a futuro) -->
        <div class="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/60 flex items-center justify-center text-[#1c4d37] dark:text-emerald-400">
            <i data-lucide="user-check" class="w-5 h-5"></i>
          </div>
          <div class="leading-tight">
            <p class="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Sesión Activa</p>
            <p class="text-sm font-bold text-[#1c4d37] dark:text-emerald-400">Bienvenido, <span class="nombreRutaActiva">Ruta 2</span></p>
          </div>
        </div>
        <button onclick="abrirCobro()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-colors">
          <i data-lucide="plus" class="w-4 h-4"></i>
          Registrar Cobro
        </button>
      </div>
    </div>

    <!-- RESUMEN DE CAJA -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Cobrado Hoy</p>
        <p id="cajaHoy" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span id="cajaHoyBs" class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1 block">Bs. 0,00</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Cobrado</p>
        <p id="cajaTotal" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">$0.00</p>
        <span id="cajaTotalBs" class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1 block">Bs. 0,00</span>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Por Cobrar</p>
        <p id="cajaPorCobrar" class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">$0.00</p>
        <span id="cajaPorCobrarBs" class="text-xs font-semibold text-amber-700 dark:text-amber-300 mt-1 block">Bs. 0,00</span>
      </div>
    </div>

    <!-- TABLA DE PAGOS -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="flex flex-col lg:flex-row gap-3 mb-6 justify-between">
        <div class="relative flex-1">
          <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          <input type="text" id="busquedaPagos" onkeyup="renderPagos()" placeholder="Buscar por cliente, pedido o referencia..." class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>
        <div class="flex flex-wrap gap-2">
          <div class="relative w-full sm:w-48">
            <select id="filtroMetodoPagos" onchange="renderPagos()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="Todos">Todos los Métodos</option>
              <option value="Efectivo ($)">Efectivo ($)</option>
              <option value="Efectivo (Bs)">Efectivo (Bs)</option>
              <option value="Pago Móvil">Pago Móvil</option>
              <option value="Transferencia">Transferencia</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
          <div class="relative w-full sm:w-48">
            <select id="filtroEstadoPagos" onchange="renderPagos()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="Todos">Todos los Estados</option>
              <option value="Verificado">Verificado</option>
              <option value="Por Verificar">Por Verificar</option>
              <option value="Anulado">Anulado / Rechazado</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
          <input type="date" id="filtroFechaPagos" onchange="renderPagos()" title="Filtrar por fecha" class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th onclick="ordenarPagosPor('fecha')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Fecha">
                <span class="inline-flex items-center gap-1.5">FECHA <i id="sortIconPagos-fecha" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th class="py-3 px-4">CLIENTE</th>
              <th class="py-3 px-4">PEDIDO</th>
              <th onclick="ordenarPagosPor('metodo')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Método">
                <span class="inline-flex items-center gap-1.5">MÉTODO <i id="sortIconPagos-metodo" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th onclick="ordenarPagosPor('monto')" class="py-3 px-4 text-right cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Monto">
                <span class="inline-flex items-center justify-end gap-1.5 w-full">MONTO <i id="sortIconPagos-monto" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th onclick="ordenarPagosPor('estado')" class="py-3 px-4 text-center cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Estado">
                <span class="inline-flex items-center justify-center gap-1.5 w-full">ESTADO <i id="sortIconPagos-estado" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
            </tr>
          </thead>
          <tbody id="tablaPagos" class="divide-y divide-gray-50 dark:divide-gray-700">
            <!-- Datos cargados por JS -->
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- MODAL: Registrar Cobro -->
  <div id="modalCobro" onclick="if(event.target===this) closeModal('modalCobro')" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <form onsubmit="guardarCobro(event)" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
      <h3 class="text-xl font-bold text-[#1c4d37] dark:text-white">Registrar Cobro</h3>
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Cliente</label>
        <div class="relative">
          <select id="cobroCliente" required onchange="cargarPedidosCobro()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"></select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
      </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Pedido</label>
          <div class="relative">
            <select id="cobroVenta" required disabled onchange="actualizarSaldoCobro()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"></select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
          <p id="cobroInfo" class="text-xs text-gray-500 dark:text-gray-400 mt-1.5"></p>
          <p id="cobroInfoBs" class="text-xs font-semibold text-[#1c4d37] dark:text-emerald-400 mt-0.5"></p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Método de pago</label>
            <div class="relative">
              <select id="cobroMetodo" onchange="cambiarMetodoCobro()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="Efectivo ($)" selected>Efectivo ($)</option>
                <option value="Efectivo (Bs)">Efectivo (Bs)</option>
                <option value="Pago Móvil">Pago Móvil</option>
                <option value="Transferencia">Transferencia</option>
              </select>
              <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5 gap-2">
              <label id="cobroMontoLabel" class="block text-sm font-medium text-gray-900 dark:text-gray-200">Monto ($ USD)</label>
              <button type="button" id="cobroMontoMaxBadge" onclick="rellenarMaximoCobro()" class="hidden text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 text-[#1c4d37] dark:text-emerald-300 transition-colors cursor-pointer" title="Usar monto máximo pendiente">
                Máx: $0.00
              </button>
            </div>
            <input id="cobroMonto" required disabled type="text" inputmode="numeric" autocomplete="off" placeholder="Selecciona un pedido" onkeydown="bloquearTeclasMontoCobro(event)" oninput="actualizarMontoCobro(this)" onpaste="pegarMontoCobro(event, this)" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm disabled:opacity-50 disabled:cursor-not-allowed font-mono">
            <p id="cobroMontoBsSub" class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1"></p>
            <p id="cobroMontoAviso" class="hidden text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-1"></p>
          </div>

        <!-- Equivalente en Dólares BCV (Visible únicamente cuando se paga en Efectivo Bs) -->
        <div id="wrapperCobroEquivalente" class="hidden sm:col-span-2 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all select-none">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
              <i data-lucide="calculator" class="w-4 h-4"></i>
            </div>
            <div>
              <p id="cobroEquivTitulo" class="text-xs font-bold text-gray-800 dark:text-gray-200">Equivalente en Dólares (Referencia BCV)</p>
              <p id="cobroTasaInfo" class="text-[11px] text-gray-500 dark:text-gray-400">Tasa oficial BCV: Bs. 60.50 / USD</p>
            </div>
          </div>
          <div class="text-right">
            <span id="cobroEquivalenteUsd" class="text-base font-extrabold font-mono text-[#1c4d37] dark:text-emerald-400 pointer-events-none">$0.00 USD</span>
            <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Solo referente · No editable</p>
          </div>
        </div>

        <div id="wrapperCobroBanco" class="hidden">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Banco de Venezuela (Emisor)</label>
          <div class="relative">
            <select id="cobroBanco" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
              <option value="0102-Banco de Venezuela" selected>0102-Banco de Venezuela</option>
              <option value="0134-Banesco">0134-Banesco</option>
              <option value="0105-Banco Mercantil">0105-Banco Mercantil</option>
              <option value="0108-BBVA Provincial">0108-BBVA Provincial</option>
              <option value="0172-Bancamiga">0172-Bancamiga</option>
              <option value="0191-Banco Nacional de Crédito (BNC)">0191-Banco Nacional de Crédito (BNC)</option>
              <option value="0114-Bancaribe">0114-Bancaribe</option>
              <option value="0115-Banco Exterior">0115-Banco Exterior</option>
              <option value="0175-Banco Bicentenario">0175-Banco Bicentenario</option>
              <option value="0174-Banplus">0174-Banplus</option>
              <option value="0156-100% Banco">0156-100% Banco</option>
              <option value="0138-Banco Plaza">0138-Banco Plaza</option>
              <option value="0163-Banco del Tesoro">0163-Banco del Tesoro</option>
              <option value="0104-Banco Venezolano de Crédito">0104-Banco Venezolano de Crédito</option>
              <option value="0128-Banco Caroní">0128-Banco Caroní</option>
              <option value="0137-Banco Sofitasa">0137-Banco Sofitasa</option>
              <option value="0151-BFC Banco Fondo Común">0151-BFC Banco Fondo Común</option>
              <option value="0157-DelSur Banco Universal">0157-DelSur Banco Universal</option>
              <option value="0168-Bancrecer">0168-Bancrecer</option>
              <option value="0169-R4 Banco Microfinanciero">0169-R4 Banco Microfinanciero</option>
              <option value="0171-Banco Activo">0171-Banco Activo</option>
              <option value="0177-BANFANB">0177-BANFANB</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
        <div id="wrapperCobroReferencia" class="hidden">
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-200">N° de Referencia</label>
            <span class="text-[11px] font-semibold text-[#1c4d37] dark:text-emerald-400">Solo números · 6 a 8 dígitos</span>
          </div>
          <input id="cobroReferencia" type="text" inputmode="numeric" autocomplete="off" maxlength="8" placeholder="Últimos 6 dígitos (Ej: 884213)" onkeydown="bloquearTeclasSoloNumeros(event)" oninput="validarInputSoloNumeros(this, 8)" onpaste="pegarReferencia(event, this)" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm font-mono tracking-wide">
          <p id="cobroRefAviso" class="hidden text-[11px] font-medium text-red-600 dark:text-red-400 mt-1"></p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Fecha del pago</label>
          <input id="cobroFecha" required type="date" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm disabled:opacity-50">
        </div>
      </div>
      <p id="cobroMetodoNota" class="text-xs text-gray-500 dark:text-gray-400 italic">Pago en efectivo: solo números enteros, sin referencia bancaria.</p>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal('modalCobro')" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
        <button class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm">Registrar Cobro</button>
      </div>
    </form>
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