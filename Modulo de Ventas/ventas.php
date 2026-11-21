<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gentil Supply - Generar Venta</title>
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

      <!-- Navegación (Todos los enlaces apuntan directamente al mismo directorio) -->
      <nav class="space-y-1">
        <a href="dashboard.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-white/10 transition">
          <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          <span>Dashboard</span>
        </a>
        <a href="ventas.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/15 text-white font-medium shadow-inner border border-white/10">
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

  <!-- CONTENIDO PRINCIPAL: GENERAR VENTA -->
  <main class="flex-1 overflow-y-auto p-8">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div data-logo-modulo="true" class="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-[#1c4d37] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-xs font-bold tracking-wide text-[#1c4d37] dark:text-emerald-400">Gentil Supply · Módulo de Ventas</span>
        </div>
        <h2 class="text-3xl font-bold text-[#1c4d37] dark:text-white">Generar Venta</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Selecciona el cliente y añade los productos para procesar el pedido.</p>
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

    <!-- Tarjeta Formulario de Venta -->
    <div class="max-w-3xl bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="space-y-6">
        
        <!-- Selección de Cliente (buscador) -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Cliente</label>
          <div id="clienteCombo" class="relative">
            <i data-lucide="search" class="w-4 h-4 absolute left-4 top-3.5 text-gray-400 pointer-events-none"></i>
            <input type="text" id="clienteBuscar" autocomplete="off" placeholder="Buscar cliente por nombre o RIF..." oninput="filtrarClientes()" onfocus="filtrarClientes()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm">
            <button type="button" id="clienteLimpiar" onclick="limpiarCliente()" class="hidden absolute right-3 top-2.5 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Limpiar">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
            <input type="hidden" id="clienteSelect">
            <div id="clienteLista" class="hidden absolute z-20 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1"></div>
          </div>
          <p id="clienteInfo" class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1"></p>
        </div>

        <!-- Condición de Pago / Días de Crédito -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Condición de Pago / Días de Crédito</label>
          <input type="hidden" id="creditoSelect" value="0">
          <div id="creditoOpciones" class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button type="button" data-credito="0" onclick="seleccionarCredito('0')" class="py-2.5 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-1.5">
              <i data-lucide="zap" class="w-4 h-4"></i> 0 días
            </button>
            <button type="button" data-credito="7" onclick="seleccionarCredito('7')" class="py-2.5 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-1.5">
              <i data-lucide="calendar" class="w-4 h-4"></i> 7 días
            </button>
            <button type="button" data-credito="15" onclick="seleccionarCredito('15')" class="py-2.5 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-1.5">
              <i data-lucide="calendar-clock" class="w-4 h-4"></i> 15 días
            </button>
            <button type="button" data-credito="21+" onclick="seleccionarCredito('21+')" class="py-2.5 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-1.5">
              <i data-lucide="clock" class="w-4 h-4"></i> 21 días o más
            </button>
          </div>
          <p id="creditoInfo" class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1">Pago el mismo día (contado).</p>
        </div>

        <!-- Añadir Productos: Marca → Presentación → Producto -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Añadir Productos</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <div class="relative">
              <select id="marcaSelect" onchange="cargarPresentaciones()" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer">
                <option value="" disabled selected>Marca</option>
              </select>
              <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-3.5 text-gray-400 pointer-events-none"></i>
            </div>
            <div class="relative">
              <select id="presentacionSelect" onchange="cargarProductos()" disabled class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="" disabled selected>Presentación</option>
              </select>
              <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-3.5 text-gray-400 pointer-events-none"></i>
            </div>
            <div class="relative">
              <select id="productoSelect" onchange="actualizarInfoProducto()" disabled class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="" disabled selected>Producto</option>
              </select>
              <i data-lucide="chevron-down" class="w-4 h-4 absolute right-4 top-3.5 text-gray-400 pointer-events-none"></i>
            </div>
          </div>
          <div class="flex gap-2">
            <p id="infoProducto" class="flex-1 text-xs text-gray-500 dark:text-gray-400 self-center px-1">Selecciona marca, presentación y producto.</p>
            <input type="text" inputmode="numeric" pattern="[0-9]*" id="cantidadInput" placeholder="Cant." autocomplete="off" onkeydown="bloquearTeclasNoNumericas(event)" oninput="validarInputCantidadVenta(this)" onpaste="pegarSoloEnteros(event, this)" class="w-24 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4d37]/20 focus:border-[#1c4d37] text-sm text-center">
            <button onclick="agregarAlCarrito()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-5 rounded-lg transition-colors flex-shrink-0 flex items-center justify-center font-medium text-sm gap-2 py-3" title="Agregar">
              <i data-lucide="plus" class="w-4 h-4"></i> Añadir
            </button>
          </div>
        </div>

        <!-- Lista de Productos en la Venta Actual -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-200">Productos en la Venta</label>
            <span id="carritoResumen" class="text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-[#1c4d37] dark:text-emerald-400 px-2.5 py-1 rounded-full">0 líneas · 0 und</span>
          </div>
          <div id="listaProductosContainer" class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 min-h-[160px] max-h-72 overflow-y-auto space-y-2"></div>
        </div>

        <!-- Totales y Botón Generar -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total General</p>
              <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-0.5">
                <p id="totalVentaDisplay" class="text-2xl font-bold text-[#1c4d37] dark:text-emerald-400">$0.00</p>
                <p id="totalVentaBsDisplay" class="text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60">Bs. 0,00</p>
              </div>
            </div>
            <button onclick="procesarVenta()" class="bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm flex items-center justify-center gap-2 self-start sm:self-auto">
              <i data-lucide="check-circle" class="w-5 h-5"></i> Generar Venta
            </button>
          </div>
          <div class="flex items-start gap-2.5 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 rounded-xl px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300">
            <i data-lucide="info" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
            <p id="totalVentaAvisoBs">El monto en Bs se respetará el mismo día de despacho; posteriormente será calculado a la tasa BCV del día de pago.</p>
          </div>
        </div>

      </div>
    </div>
  </main>

  <!-- MODAL: Confirmación de Venta Registrada -->
  <div id="modalVentaRegistrada" class="fixed inset-0 z-50 hidden opacity-0 items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 text-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-[#1c4d37] dark:text-emerald-400 flex items-center justify-center mx-auto">
        <i data-lucide="check-circle-2" class="w-9 h-9"></i>
      </div>
      <div>
        <h3 class="text-xl font-bold text-[#1c4d37] dark:text-white">¡Venta Registrada!</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Se ha registrado la venta correctamente y se descontaron los productos del inventario.</p>
      </div>
      <div id="modalVentaRegistradaDetalle" class="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-left text-sm space-y-2"></div>
      <div class="pt-2">
        <button type="button" onclick="cerrarModalVentaRegistrada()" class="w-full bg-[#1c4d37] hover:bg-[#133928] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white py-3 px-6 rounded-xl font-semibold shadow-sm transition-colors text-sm">
          Aceptar
        </button>
      </div>
    </div>
  </div>

  <!-- Notificación -->
  <div id="toast" class="hidden opacity-0 translate-y-2 transition-all duration-300 fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl bg-[#1c4d37] dark:bg-emerald-600 text-white text-sm shadow-lg"></div>

  <!-- Módulo de modo oscuro (subiendo un nivel para buscar la carpeta modos) -->
  <script src="../modos/darkmode.js"></script>
  <!-- Lógica de ventas -->
  <script src="ventas.js"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>