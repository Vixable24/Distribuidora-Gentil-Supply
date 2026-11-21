<?php
// Módulo de Superadmin - Gestión de Usuarios y Roles - Distribuidora Gentil Supply, C.A.
// Ubicación: Sistema Gentil Supply 2/Modulo de Superadmin/usuarios.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Gestión de Usuarios (Superadmin)</title>
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
            brand: { DEFAULT: '#1c4d37', dark: '#133928', light: '#2d6a4f', bg: '#f4f6f5' }
          }
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
        <a href="usuarios.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
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

  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Superadmin</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Gestión de Usuarios</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Crea, edita y controla los accesos por rol en Ventas, Facturación, Despacho, Gerencia y Superadmin.</p>
      </div>
      <button onclick="abrirModalUsuario()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm flex items-center gap-2 self-start sm:self-auto">
        <i data-lucide="user-plus" class="w-4 h-4"></i> Nuevo Usuario
      </button>
    </div>

    <!-- KPIs de Usuarios -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Usuarios</p>
        <p id="usrKpiTotal" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400 mt-2">0</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Usuarios Activos</p>
        <p id="usrKpiActivos" class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">0</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Usuarios Inactivos</p>
        <p id="usrKpiInactivos" class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">0</p>
      </div>
    </div>

    <!-- Filtros y Tabla de Usuarios -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="flex flex-col md:flex-row gap-3 mb-6">
        <div class="relative flex-1">
          <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          <input type="text" id="busquedaUsuarios" oninput="renderUsuarios()" placeholder="Buscar por nombre, usuario, correo o ruta..." class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>
        <div class="relative w-full md:w-52">
          <select id="filtroRolUsuario" onchange="renderUsuarios()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
            <option value="Todos">Todos los Roles</option>
            <option value="Superadmin">Superadmin</option>
            <option value="Gerente">Gerente</option>
            <option value="Vendedor">Vendedor</option>
            <option value="Facturación">Facturación</option>
            <option value="Operador de Despacho">Operador de Despacho</option>
          </select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
        <div class="relative w-full md:w-44">
          <select id="filtroEstadoUsuario" onchange="renderUsuarios()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
            <option value="Todos">Todos</option>
            <option value="Activo">Activos</option>
            <option value="Inactivo">Inactivos</option>
          </select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-gray-600 dark:text-gray-300 datagrid-compacto">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider select-none">
              <th onclick="ordenarUsuariosPor('nombre')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors">
                <span class="inline-flex items-center gap-1.5">Nombre / Usuario <span id="sortIconUsr-nombre"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarUsuariosPor('rol')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors">
                <span class="inline-flex items-center gap-1.5">Rol / Módulo <span id="sortIconUsr-rol"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th onclick="ordenarUsuariosPor('ruta')" class="py-3 px-4 cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors">
                <span class="inline-flex items-center gap-1.5">Ruta / Área <span id="sortIconUsr-ruta"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th class="py-3 px-4">Contacto</th>
              <th onclick="ordenarUsuariosPor('estado')" class="py-3 px-4 text-center cursor-pointer hover:bg-emerald-50/70 dark:hover:bg-gray-700/60 rounded-lg transition-colors">
                <span class="inline-flex items-center justify-center gap-1.5">Estado <span id="sortIconUsr-estado"><i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i></span></span>
              </th>
              <th class="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody id="tablaUsuarios" class="divide-y divide-gray-50 dark:divide-gray-700"></tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- MODAL: Crear / Editar Usuario -->
  <div id="modalUsuario" onclick="if(event.target===this) cerrarModalUsuario()" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <form onsubmit="guardarUsuario(event)" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
        <h3 id="modalUsuarioTitulo" class="text-xl font-bold text-[#1c4d37] dark:text-white flex items-center gap-2">
          <i data-lucide="user-plus" class="w-5 h-5"></i> Crear Nuevo Usuario
        </h3>
        <button type="button" onclick="cerrarModalUsuario()" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>

      <input type="hidden" id="usrEditId" value="">

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Nombre Completo</label>
          <input id="usrNombre" type="text" required placeholder="Ej. Luis Fernando Rojas" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2.5 px-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Nombre de Usuario</label>
          <input id="usrUsername" type="text" required placeholder="Ej. lrojas" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2.5 px-3.5 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Contraseña</label>
          <input id="usrPassword" type="password" placeholder="Mínimo 4 caracteres (ej. 1234)" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2.5 px-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Rol del Sistema</label>
          <div class="relative">
            <select id="usrRol" required class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 pl-3.5 pr-9 rounded-lg appearance-none text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
              <option value="Vendedor">Vendedor (Módulo Ventas)</option>
              <option value="Facturación">Facturación y Cobranzas</option>
              <option value="Operador de Despacho">Operador de Despacho</option>
              <option value="Gerente">Gerente (Administrador)</option>
              <option value="Superadmin">Superadmin (Acceso Total)</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Ruta / Área Asignada</label>
          <input id="usrRuta" type="text" list="listaRutasSistema" placeholder="Ej. Ruta 2, Ruta 3, Ruta 4, Ruta 5, Ruta 9" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2.5 px-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
          <datalist id="listaRutasSistema">
            <option value="Ruta 2">
            <option value="Ruta 3">
            <option value="Ruta 4">
            <option value="Ruta 5">
            <option value="Ruta 9">
            <option value="Dirección General">
            <option value="Gerencia General">
            <option value="Facturación y Cobranzas">
            <option value="Almacén La Asunción">
          </datalist>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Correo Electrónico</label>
          <input id="usrEmail" type="email" required placeholder="usuario@gentilsupply.com" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2.5 px-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Teléfono</label>
          <input id="usrTelefono" type="text" placeholder="0414-1234567" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2.5 px-3.5 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
        </div>
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Estado de la Cuenta</label>
          <div class="relative">
            <select id="usrEstado" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 pl-3.5 pr-9 rounded-lg appearance-none text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37]">
              <option value="Activo">Activo (Puede iniciar sesión)</option>
              <option value="Inactivo">Inactivo (Acceso bloqueado)</option>
            </select>
            <i data-lucide="chevron-down" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="cerrarModalUsuario()" class="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
        <button id="btnGuardarUsuario" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-colors text-sm">Guardar Usuario</button>
      </div>
    </form>
  </div>

  <div id="toast" class="hidden opacity-0 translate-y-2 transition-all duration-300 fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl bg-[#1c4d37] dark:bg-emerald-600 text-white text-sm shadow-lg max-w-sm"></div>

  <script src="../modos/darkmode.js"></script>
  <script src="superadmin.js"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>
