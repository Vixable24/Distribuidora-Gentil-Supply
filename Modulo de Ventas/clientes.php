<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Clientes & Cuentas</title>
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

      <!-- Navegación (Dashboard en 1ª posición) -->
      <nav class="space-y-1">
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
        <!-- Opción Activa -->
        <a href="clientes.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
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

  <!-- CONTENIDO PRINCIPAL: CLIENTES -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Ventas</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Clientes & Cuentas</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Directorio y supervisión de cuentas corrientes de clientes.</p>
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
        <!-- Botón que activa el Modal -->
        <button onclick="abrirModalCliente()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all">
          <i data-lucide="user-plus" class="w-5 h-5"></i>
          Nuevo Cliente
        </button>
      </div>
    </div>

    <!-- SECCIÓN DE TABLA Y BÚSQUEDA -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div class="relative flex-1 max-w-xl">
          <i data-lucide="search" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input type="text" id="busquedaClientes" onkeyup="renderClientes()" placeholder="Buscar por cliente, RIF, contacto o zona..." 
                 class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>
      </div>

      <!-- TABLA DE CLIENTES -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th onclick="ordenarClientesPor('nombre')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Cliente">
                <span class="inline-flex items-center gap-1.5">CLIENTE / EMPRESA <i id="sortIconCli-nombre" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th onclick="ordenarClientesPor('contacto')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Contacto">
                <span class="inline-flex items-center gap-1.5">CONTACTO <i id="sortIconCli-contacto" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th onclick="ordenarClientesPor('telefono')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Teléfono">
                <span class="inline-flex items-center gap-1.5">TELÉFONO <i id="sortIconCli-telefono" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th onclick="ordenarClientesPor('compras')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Compras Totales">
                <span class="inline-flex items-center gap-1.5">COMPRAS TOTALES <i id="sortIconCli-compras" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th onclick="ordenarClientesPor('saldo')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors" title="Ordenar por Saldo Pendiente">
                <span class="inline-flex items-center gap-1.5">SALDO PENDIENTE <i id="sortIconCli-saldo" data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span>
              </th>
              <th class="py-3 px-4 text-center">ACCIONES</th>
            </tr>
          </thead>
          <tbody id="tablaClientes" class="divide-y divide-gray-50 dark:divide-gray-700">
            <!-- Datos cargados por JS -->
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- MODAL: NUEVO / EDITAR CLIENTE -->
  <div id="modalCliente" onclick="if(event.target===this) cerrarModalCliente()" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden opacity-0 items-center justify-center p-4 transition-opacity duration-200">
    <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-xl border border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
        <h3 id="modalClienteTitulo" class="text-xl font-bold text-[#1c4d37] dark:text-white flex items-center gap-2">
          <i data-lucide="user-plus" class="w-5 h-5"></i> Registrar Nuevo Cliente
        </h3>
        <button type="button" onclick="cerrarModalCliente()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <form id="formCliente" onsubmit="registrarCliente(event)" class="space-y-4">
        <input type="hidden" id="cliEditIndex" value="-1">

        <!-- Nombre o Empresa -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre o Empresa</label>
          <input id="cliNombre" type="text" required placeholder="Ej. Distribuidora Los Andes C.A." class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>

        <!-- Cédula / RIF con botón desplegable de formato (V, E, J, G, P) -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cédula / RIF Fiscal</label>
            <span id="cliRifPreview" class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-400">Formato: J312345678</span>
          </div>
          <input type="hidden" id="cliRifTipo" value="J">
          <div class="flex items-stretch gap-2 relative" id="rifDropdownWrapper">
            <!-- Botón desplegable V, E, J, G, P -->
            <div class="relative">
              <button type="button" id="btnRifTipoDropdown" onclick="toggleMenuRifTipo()" class="h-full px-4 py-2.5 rounded-lg bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-colors">
                <span id="lblRifTipoActual">J · Jurídico</span>
                <i data-lucide="chevron-down" class="w-4 h-4"></i>
              </button>
              <!-- Menú desplegable con los 5 formatos -->
              <div id="menuRifTipoDropdown" class="hidden absolute left-0 mt-1.5 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-30 py-1.5 divide-y divide-gray-100 dark:divide-gray-700">
                <button type="button" onclick="seleccionarTipoRif('V')" class="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/70 dark:hover:bg-gray-700 transition-colors flex items-start gap-3">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-300 font-bold text-sm flex items-center justify-center flex-shrink-0">V</span>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 dark:text-white">Persona Natural (Venezolana)</p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">Ej: <b>V12345678</b> o <b>V1234567</b> (7 u 8 dígitos sin guiones)</p>
                  </div>
                </button>
                <button type="button" onclick="seleccionarTipoRif('E')" class="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/70 dark:hover:bg-gray-700 transition-colors flex items-start gap-3">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-300 font-bold text-sm flex items-center justify-center flex-shrink-0">E</span>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 dark:text-white">Persona Natural (Extranjera)</p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">Ej: <b>E12345678</b> (8 dígitos corridos sin guiones)</p>
                  </div>
                </button>
                <button type="button" onclick="seleccionarTipoRif('J')" class="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/70 dark:hover:bg-gray-700 transition-colors flex items-start gap-3">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-300 font-bold text-sm flex items-center justify-center flex-shrink-0">J</span>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 dark:text-white">RIF Jurídico (Empresas / C.A.)</p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">Ej: <b>J312345678</b> (Letra J + 9 dígitos totales)</p>
                  </div>
                </button>
                <button type="button" onclick="seleccionarTipoRif('G')" class="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/70 dark:hover:bg-gray-700 transition-colors flex items-start gap-3">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-300 font-bold text-sm flex items-center justify-center flex-shrink-0">G</span>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 dark:text-white">RIF Gubernamental (Organismos)</p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">Ej: <b>G200012345</b> (Letra G + 9 dígitos correlativos)</p>
                  </div>
                </button>
                <button type="button" onclick="seleccionarTipoRif('P')" class="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/70 dark:hover:bg-gray-700 transition-colors flex items-start gap-3">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-300 font-bold text-sm flex items-center justify-center flex-shrink-0">P</span>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 dark:text-white">No Residente / Pasaporte (P)</p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">Ej: <b>P123456780</b> (Letra P + 9 dígitos sin espacios)</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Campo numérico del RIF (todo corrido sin guiones) -->
            <input id="cliRifNumero" type="text" inputmode="numeric" required maxlength="9" placeholder="312345678 (9 dígitos sin guiones)" autocomplete="off" onkeydown="bloquearTeclasRifNumero(event)" oninput="validarInputRifNumero(this)" onpaste="pegarRifNumero(event, this)" class="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-sm font-mono tracking-wide text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
          </div>
          <p id="cliRifAyuda" class="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 px-1">RIF Jurídico (Empresas, Compañías Anónimas): Letra J seguida de 9 dígitos totales sin guiones (Ej: J312345678).</p>
        </div>

        <!-- Persona de Contacto y Zona (Municipios de Nueva Esparta) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Persona de Contacto</label>
            <input id="cliContacto" type="text" placeholder="Ej. Ana Pérez" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
          </div>
            <!-- Zona (Municipio de Nueva Esparta) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zona (Municipio de Nueva Esparta)</label>
            <div class="relative">
              <select id="cliZona" required class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg pl-3.5 pr-9 py-2.5 text-sm text-gray-800 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] cursor-pointer">
                <option value="Antolín del Campo">Antolín del Campo</option>
                <option value="Arismendi">Arismendi</option>
                <option value="Díaz">Díaz</option>
                <option value="García">García</option>
                <option value="Gómez">Gómez</option>
                <option value="Maneiro">Maneiro</option>
                <option value="Marcano">Marcano</option>
                <option value="Mariño" selected>Mariño</option>
                <option value="Península de Macanao">Península de Macanao</option>
                <option value="Tubores">Tubores</option>
                <option value="Villalba">Villalba</option>
              </select>
              <i data-lucide="chevron-down" class="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none"></i>
            </div>
          </div>
        </div>

        <!-- Ruta Comercial Asignada (Cartera Exclusiva) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ruta Asignada (Cartera Individual)</label>
          <div class="relative">
            <select id="cliRuta" required class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg pl-3.5 pr-9 py-2.5 text-sm font-semibold text-[#1c4d37] dark:text-emerald-400 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed">
              <option value="Ruta 2">Ruta 2</option>
              <option value="Ruta 3">Ruta 3</option>
              <option value="Ruta 4">Ruta 4</option>
              <option value="Ruta 5">Ruta 5</option>
              <option value="Ruta 9">Ruta 9</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none"></i>
          </div>
          <p id="cliRutaAyuda" class="text-[11px] text-gray-500 dark:text-gray-400 mt-1 px-1">Los clientes registrados aquí pertenecerán únicamente a esta ruta y no aparecerán en otras rutas.</p>
        </div>

        <!-- Teléfono: Código de Operador / Área + Número (solo dígitos limpios y '-') -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono (Código + Número)</label>
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div class="sm:col-span-5 relative">
              <select id="cliTelCodigo" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg pl-3 pr-8 py-2.5 text-sm font-mono font-medium text-gray-800 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] cursor-pointer">
                <option value="0412" selected>0412</option>
                <option value="0422">0422</option>
                <option value="0416">0416</option>
                <option value="0426">0426</option>
                <option value="0414">0414</option>
                <option value="0424">0424</option>
              </select>
              <i data-lucide="chevron-down" class="w-4 h-4 absolute right-2.5 top-3 text-gray-400 pointer-events-none"></i>
            </div>
            <div class="sm:col-span-7">
              <input id="cliTelNumero" type="text" inputmode="numeric" maxlength="8" placeholder="123-4567 o 1234567" autocomplete="off" onkeydown="bloquearTeclasTelefono(event)" oninput="validarInputTelefono(this)" onpaste="pegarTelefono(event, this)" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-sm font-mono text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
            </div>
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1 px-1">Código de 4 dígitos y número de 7 dígitos (Ej: 123-4567 o 1234567).</p>
        </div>

        <!-- Correo Electrónico -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
          <input id="cliEmail" type="email" placeholder="contacto@empresa.com" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>

        <!-- Dirección Fiscal / Local -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección Fiscal / Local</label>
          <textarea id="cliDireccion" rows="2" placeholder="Av. Principal, Local 4..." class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]"></textarea>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button type="button" onclick="cerrarModalCliente()" class="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl text-sm font-medium transition-colors">Cancelar</button>
          <button type="submit" id="btnGuardarCliente" class="px-5 py-2.5 bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors">Guardar Cliente</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: CUENTA DEL CLIENTE -->
  <div id="modalCuenta" onclick="if(event.target===this) closeModal('modalCuenta')" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden opacity-0 items-center justify-center p-4 transition-opacity duration-200">
    <div id="modalCuentaBody" class="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 dark:border-gray-700"></div>
  </div>

  <!-- Notificación -->
  <div id="toast" class="hidden opacity-0 translate-y-2 transition-all duration-300 fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl bg-[#1c4d37] dark:bg-emerald-600 text-white text-sm shadow-lg"></div>

  <!-- Scripts de Funcionalidad e Iconos -->
  <script src="../modos/darkmode.js"></script>
  <script src="ventas.js"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>
