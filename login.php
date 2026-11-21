<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Iniciar Sesión</title>
  <!-- Modo Oscuro Instantáneo (idéntico al resto del proyecto) -->
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
    html.dark .dark\:bg-gray-900 { background-color: #111827; }
    html.dark .dark\:bg-gray-800 { background-color: #1f2937; }
    html.dark .dark\:border-gray-700 { border-color: #374151; }
    html.dark .dark\:text-white { color: #ffffff; }
    html.dark .dark\:text-gray-100 { color: #f3f4f6; }
    html:not(.theme-ready) *, html:not(.theme-ready) body { transition: none !important; }
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
  <?php require_once __DIR__ . '/Base de Datos/bootstrap_db.php'; ?>
</head>
<body class="bg-[#f4f6f5] dark:bg-gray-900 font-sans antialiased text-gray-800 dark:text-gray-100 min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-300 relative">

  <!-- Botón de Modo Oscuro flotante (estilo fiel a los paneles) -->
  <button type="button" onclick="toggleDarkMode()" title="Alternar modo claro / oscuro" class="fixed top-5 right-5 z-20 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-[#1c4d37] dark:hover:text-emerald-400 shadow-sm transition-colors">
    <i data-lucide="moon" class="w-5 h-5 dark:hidden"></i>
    <i data-lucide="sun" class="w-5 h-5 hidden dark:block"></i>
  </button>

  <div class="w-full max-w-4xl">
    <!-- Tarjeta principal fiel a la estética de Gentil Supply -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-colors">

      <!-- Panel Izquierdo de Marca (#1c4d37 igual que el sidebar) -->
      <div class="md:col-span-5 bg-[#1c4d37] dark:bg-[#0f2d1f] text-white p-8 flex flex-col justify-between gap-8 transition-colors">
        <div class="space-y-6">
          <div class="flex items-center space-x-3">
            <div class="p-2.5 border border-white/25 rounded-xl bg-white/10">
              <i data-lucide="box" class="w-7 h-7 text-white"></i>
            </div>
            <div>
              <span class="block font-bold text-xl tracking-wide leading-tight">Gentil Supply</span>
              <span class="block text-xs text-emerald-200/80 font-medium">Sistema Automatizado</span>
            </div>
          </div>

          <div class="pt-2 space-y-2.5">
            <h1 class="text-2xl font-bold leading-snug text-white">Control Comercial y Logístico</h1>
            <p class="text-sm text-emerald-100/80 leading-relaxed">
              Plataforma unificada de Ventas, Facturación Fiscal, Cobranzas, Inventario de Almacén y Despacho.
            </p>
          </div>

          <div class="space-y-2 pt-2">
            <div class="flex items-center gap-2.5 text-xs text-emerald-100/90 bg-white/10 border border-white/10 rounded-xl px-3.5 py-2.5">
              <i data-lucide="map-pin" class="w-4 h-4 text-emerald-300 flex-shrink-0"></i>
              <span>La Asunción, Estado Nueva Esparta</span>
            </div>
            <div class="flex items-center justify-between gap-2 text-xs text-emerald-100/90 bg-white/10 border border-white/10 rounded-xl px-3.5 py-2.5">
              <span class="flex items-center gap-2">
                <i data-lucide="landmark" class="w-4 h-4 text-emerald-300 flex-shrink-0"></i>
                <span>Tasa Oficial BCV</span>
              </span>
              <span id="loginTasaBcv" class="font-bold text-white font-mono">Bs. --,--</span>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-200/75">
          <span>Distribuidora Gentil Supply, C.A.</span>
          <span id="loginDbBadge" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-emerald-200">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span id="loginDbTexto">Sistema Activo</span>
          </span>
        </div>
      </div>

      <!-- Formulario de Inicio de Sesión -->
      <div class="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
        <div class="mb-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/60">
            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-[#1c4d37] dark:text-emerald-400"></i>
            <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Acceso Autorizado</span>
          </div>
          <h2 class="text-2xl font-bold text-[#1c4d37] dark:text-white">Iniciar Sesión</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Ingresa tu usuario y contraseña para acceder a tu módulo asignado.</p>
        </div>

        <!-- Banner opcional si ya existe una sesión previa en el navegador -->
        <div id="sesionPreviaBox" class="hidden mb-5 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-semibold text-[#1c4d37] dark:text-emerald-300 truncate" id="sesionPreviaTexto"></p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 truncate" id="sesionPreviaSub"></p>
          </div>
          <button type="button" id="btnReanudarSesion" class="px-3 py-1.5 rounded-lg bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold flex-shrink-0 transition-colors">
            Continuar
          </button>
        </div>

        <!-- Alerta de error sin popups nativos -->
        <div id="loginErrorBox" class="hidden mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
          <i data-lucide="alert-circle" class="w-4 h-4 mt-0.5 flex-shrink-0"></i>
          <span id="loginErrorMsg"></span>
        </div>

        <form id="loginForm" onsubmit="iniciarSesion(event)" class="space-y-4">
          <div>
            <label for="loginUsername" class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Usuario</label>
            <div class="relative">
              <i data-lucide="user" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              <input
                type="text"
                id="loginUsername"
                name="username"
                required
                autocomplete="username"
                placeholder="Ej. superadmin, gerente, ruta2, ruta3..."
                class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] transition-colors"
              >
            </div>
          </div>

          <div>
            <label for="loginPassword" class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Contraseña</label>
            <div class="relative">
              <i data-lucide="lock" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              <input
                type="password"
                id="loginPassword"
                name="password"
                required
                autocomplete="current-password"
                placeholder="Ingresa tu contraseña"
                class="w-full pl-10 pr-11 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] transition-colors"
              >
              <button
                type="button"
                onclick="alternarVisibilidadPassword()"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title="Mostrar u ocultar contraseña"
              >
                <i id="loginEyeIcon" data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              id="btnLoginSubmit"
              class="w-full bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white py-3.5 px-6 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <i data-lucide="log-in" class="w-4 h-4"></i>
              <span id="btnLoginTexto">Ingresar al Sistema</span>
            </button>
          </div>
        </form>

        <div class="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span>Módulos: Ventas · Facturación · Despacho · Gerencia · Superadmin</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Scripts globales del sistema -->
  <script src="modos/darkmode.js"></script>
  <script>
    const USUARIOS_FALLBACK_LOGIN = (window.USUARIOS_SEMILLA_GLOBAL && window.USUARIOS_SEMILLA_GLOBAL.length) ? window.USUARIOS_SEMILLA_GLOBAL : [
      { id: 'USR-001', nombre: 'Administrador Maestro', username: 'superadmin', password: '1234', rol: 'Superadmin', ruta: 'Dirección General', email: 'superadmin@gentilsupply.com', estado: 'Activo' },
      { id: 'USR-002', nombre: 'Carlos Eduardo Gentil', username: 'gerente', password: '1234', rol: 'Gerente', ruta: 'Gerencia General', email: 'gerencia@gentilsupply.com', estado: 'Activo' },
      { id: 'USR-003', nombre: 'Vendedor Ruta 2', username: 'ruta2', password: '1234', rol: 'Vendedor', ruta: 'Ruta 2', email: 'ruta2@gentilsupply.com', estado: 'Activo' },
      { id: 'USR-004', nombre: 'Mariana Salazar', username: 'facturacion', password: '1234', rol: 'Facturación', ruta: 'Facturación y Cobranzas', email: 'facturacion@gentilsupply.com', estado: 'Activo' },
      { id: 'USR-005', nombre: 'José Rodríguez', username: 'despacho', password: '1234', rol: 'Operador de Despacho', ruta: 'Almacén La Asunción', email: 'despacho@gentilsupply.com', estado: 'Activo' },
      { id: 'USR-006', nombre: 'Vendedor Ruta 3', username: 'ruta3', password: '1234', rol: 'Vendedor', ruta: 'Ruta 3', email: 'ruta3@gentilsupply.com', estado: 'Activo' },
      { id: 'USR-007', nombre: 'Vendedor Ruta 4', username: 'ruta4', password: '1234', rol: 'Vendedor', ruta: 'Ruta 4', email: 'ruta4@gentilsupply.com', estado: 'Activo' },
      { id: 'USR-008', nombre: 'Vendedor Ruta 5', username: 'ruta5', password: '1234', rol: 'Vendedor', ruta: 'Ruta 5', email: 'ruta5@gentilsupply.com', estado: 'Activo' },
      { id: 'USR-009', nombre: 'Vendedor Ruta 9', username: 'ruta9', password: '1234', rol: 'Vendedor', ruta: 'Ruta 9', email: 'ruta9@gentilsupply.com', estado: 'Activo' }
    ];

    function obtenerModuloDestinoPorRol(rol) {
      const r = String(rol || '').trim().toLowerCase();
      if (r === 'superadmin') return 'Modulo de Superadmin/dashboard.php';
      if (r === 'gerente' || r === 'administrador') return 'Modulo de Administrador/dashboard.php';
      if (r === 'facturación' || r === 'facturacion') return 'Modulo de facturacion/dashboard.php';
      if (r === 'operador de despacho' || r === 'despacho') return 'Modulo de Despacho/dashboard.php';
      return 'Modulo de Ventas/dashboard.php';
    }

    function mostrarErrorLogin(mensaje) {
      const box = document.getElementById('loginErrorBox');
      const msgEl = document.getElementById('loginErrorMsg');
      if (!box || !msgEl) return;
      if (!mensaje) {
        box.classList.add('hidden');
        msgEl.textContent = '';
        return;
      }
      msgEl.textContent = mensaje;
      box.classList.remove('hidden');
    }

    function alternarVisibilidadPassword() {
      const input = document.getElementById('loginPassword');
      const icon = document.getElementById('loginEyeIcon');
      if (!input || !icon) return;
      const mostrar = input.type === 'password';
      input.type = mostrar ? 'text' : 'password';
      icon.setAttribute('data-lucide', mostrar ? 'eye-off' : 'eye');
      if (window.lucide) lucide.createIcons();
    }

    function actualizarWidgetTasaLogin() {
      const el = document.getElementById('loginTasaBcv');
      if (!el) return;
      const tasa = parseFloat(localStorage.getItem('gs_tasa_bcv')) || window.TASA_BCV_ACTUAL || 60.50;
      el.textContent = 'Bs. ' + new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tasa);
    }

    function completarIngreso(usuario) {
      const destino = usuario.moduloInicio || obtenerModuloDestinoPorRol(usuario.rol);
      const rutaNorm = usuario.rol === 'Vendedor' && typeof window.normalizarRutaSistema === 'function'
        ? window.normalizarRutaSistema(usuario.ruta || usuario.username)
        : (usuario.ruta || '');
      const sesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        username: usuario.username,
        rol: usuario.rol,
        ruta: rutaNorm,
        email: usuario.email || '',
        moduloInicio: destino,
        loginEn: new Date().toISOString()
      };
      localStorage.setItem('gs_sesion_activa', JSON.stringify(sesion));
      if (usuario.rol === 'Vendedor' && rutaNorm) {
        localStorage.setItem('gs_ruta_ventas_activa', rutaNorm);
      }
      window.location.href = destino;
    }

    function autenticarEnLocalStorage(username, password) {
      let lista = [];
      try {
        const raw = JSON.parse(localStorage.getItem('gs_usuarios_v1'));
        if (Array.isArray(raw) && raw.length) lista = raw;
      } catch (e) {}

      if (!lista.length) {
        lista = USUARIOS_FALLBACK_LOGIN;
        try { localStorage.setItem('gs_usuarios_v1', JSON.stringify(lista)); } catch (e) {}
      }

      const uClean = username.trim().toLowerCase();
      const encontrado = lista.find(u => u && String(u.username || '').trim().toLowerCase() === uClean);
      if (!encontrado) {
        return { ok: false, mensaje: 'Usuario o contraseña incorrectos.' };
      }

      const seedMatch = USUARIOS_FALLBACK_LOGIN.find(s => s.username === uClean);
      const claveEsperada = encontrado.password !== undefined && encontrado.password !== ''
        ? String(encontrado.password)
        : (seedMatch ? seedMatch.password : '1234');

      if (password !== claveEsperada) {
        return { ok: false, mensaje: 'Usuario o contraseña incorrectos.' };
      }
      if ((encontrado.estado || 'Activo') !== 'Activo') {
        return { ok: false, mensaje: 'Esta cuenta se encuentra inactiva. Contacta al Superadmin.' };
      }

      return { ok: true, usuario: encontrado };
    }

    async function iniciarSesion(e) {
      e.preventDefault();
      mostrarErrorLogin('');

      const username = (document.getElementById('loginUsername').value || '').trim();
      const password = document.getElementById('loginPassword').value || '';
      const btn = document.getElementById('btnLoginSubmit');
      const btnTxt = document.getElementById('btnLoginTexto');

      if (!username || !password) {
        mostrarErrorLogin('Ingresa tu usuario y contraseña para continuar.');
        return;
      }

      btn.disabled = true;
      btnTxt.textContent = 'Verificando...';

      try {
        const resp = await fetch('Base de Datos/api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', username, password })
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.conectado === true) {
            if (data.ok && data.usuario) {
              completarIngreso(data.usuario);
              return;
            }
            mostrarErrorLogin(data.mensaje || 'Usuario o contraseña incorrectos.');
            btn.disabled = false;
            btnTxt.textContent = 'Ingresar al Sistema';
            return;
          }
        }
      } catch (err) {
        // Respaldo automático con almacenamiento local si el servidor MySQL está detenido
      }

      const resLocal = autenticarEnLocalStorage(username, password);
      if (resLocal.ok && resLocal.usuario) {
        completarIngreso(resLocal.usuario);
        return;
      }

      mostrarErrorLogin(resLocal.mensaje || 'Usuario o contraseña incorrectos.');
      btn.disabled = false;
      btnTxt.textContent = 'Ingresar al Sistema';
    }

    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      actualizarWidgetTasaLogin();
      window.addEventListener('bcv-tasa-actualizada', actualizarWidgetTasaLogin);

      if (window.gsEstadoBaseDatos) {
        const dbInfo = window.gsEstadoBaseDatos();
        const badgeTxt = document.getElementById('loginDbTexto');
        if (badgeTxt) badgeTxt.textContent = dbInfo.conectado ? 'MySQL Conectado' : 'Modo Local';
      }

      try {
        const rawSes = localStorage.getItem('gs_sesion_activa');
        const ses = rawSes ? JSON.parse(rawSes) : null;
        if (ses && ses.username && ses.rol) {
          const box = document.getElementById('sesionPreviaBox');
          const txt = document.getElementById('sesionPreviaTexto');
          const sub = document.getElementById('sesionPreviaSub');
          const btn = document.getElementById('btnReanudarSesion');
          if (box && txt && sub && btn) {
            txt.textContent = `Sesión iniciada: ${ses.nombre || ses.username}`;
            sub.textContent = `@${ses.username} · Rol: ${ses.rol}`;
            btn.onclick = () => {
              window.location.href = ses.moduloInicio || obtenerModuloDestinoPorRol(ses.rol);
            };
            box.classList.remove('hidden');
          }
        }
      } catch (e) {}

      const inputUser = document.getElementById('loginUsername');
      if (inputUser) inputUser.focus();
    });
  </script>
</body>
</html>
