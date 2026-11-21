// Lógica de Gestión de Usuarios y Control Total - Módulo de Superadmin
// Ubicación: Sistema Gentil Supply 2/Modulo de Superadmin/superadmin.js

const USUARIOS_STORAGE_KEY = 'gs_usuarios_v1';

const USUARIOS_SEMILLA = (window.USUARIOS_SEMILLA_GLOBAL && window.USUARIOS_SEMILLA_GLOBAL.length) ? window.USUARIOS_SEMILLA_GLOBAL : [
  { id: 'USR-001', nombre: 'Administrador Maestro', username: 'superadmin', password: '1234', rol: 'Superadmin', ruta: 'Dirección General', email: 'superadmin@gentilsupply.com', telefono: '0414-7900001', estado: 'Activo' },
  { id: 'USR-002', nombre: 'Carlos Eduardo Gentil', username: 'gerente', password: '1234', rol: 'Gerente', ruta: 'Gerencia General', email: 'gerencia@gentilsupply.com', telefono: '0414-7900002', estado: 'Activo' },
  { id: 'USR-003', nombre: 'Vendedor Ruta 2', username: 'ruta2', password: '1234', rol: 'Vendedor', ruta: 'Ruta 2', email: 'ruta2@gentilsupply.com', telefono: '0412-3548810', estado: 'Activo' },
  { id: 'USR-004', nombre: 'Mariana Salazar', username: 'facturacion', password: '1234', rol: 'Facturación', ruta: 'Facturación y Cobranzas', email: 'facturacion@gentilsupply.com', telefono: '0424-8812200', estado: 'Activo' },
  { id: 'USR-005', nombre: 'José Rodríguez', username: 'despacho', password: '1234', rol: 'Operador de Despacho', ruta: 'Almacén La Asunción', email: 'despacho@gentilsupply.com', telefono: '0416-6950099', estado: 'Activo' },
  { id: 'USR-006', nombre: 'Vendedor Ruta 3', username: 'ruta3', password: '1234', rol: 'Vendedor', ruta: 'Ruta 3', email: 'ruta3@gentilsupply.com', telefono: '0412-3548813', estado: 'Activo' },
  { id: 'USR-007', nombre: 'Vendedor Ruta 4', username: 'ruta4', password: '1234', rol: 'Vendedor', ruta: 'Ruta 4', email: 'ruta4@gentilsupply.com', telefono: '0414-3548814', estado: 'Activo' },
  { id: 'USR-008', nombre: 'Vendedor Ruta 5', username: 'ruta5', password: '1234', rol: 'Vendedor', ruta: 'Ruta 5', email: 'ruta5@gentilsupply.com', telefono: '0416-3548815', estado: 'Activo' },
  { id: 'USR-009', nombre: 'Vendedor Ruta 9', username: 'ruta9', password: '1234', rol: 'Vendedor', ruta: 'Ruta 9', email: 'ruta9@gentilsupply.com', telefono: '0424-3548819', estado: 'Activo' }
];

const _s$ = id => document.getElementById(id);
const _esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function cargarUsuarios() {
  try {
    const d = JSON.parse(localStorage.getItem(USUARIOS_STORAGE_KEY));
    if (Array.isArray(d) && d.length) {
      let cambio = false;
      const lista = d.map(u => {
        if (u && u.rol === 'Vendedor' && typeof window.normalizarRutaSistema === 'function') {
          const r = window.normalizarRutaSistema(u.ruta || u.username);
          if (u.ruta !== r) { cambio = true; return Object.assign({}, u, { ruta: r }); }
        }
        return u;
      });
      USUARIOS_SEMILLA.forEach(s => {
        if (!lista.some(u => u && String(u.username || '').toLowerCase() === s.username.toLowerCase())) {
          lista.push(Object.assign({}, s));
          cambio = true;
        }
      });
      if (cambio) localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(lista));
      return lista;
    }
  } catch (e) {}
  localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(USUARIOS_SEMILLA));
  return JSON.parse(JSON.stringify(USUARIOS_SEMILLA));
}

function guardarUsuarios(lista) {
  localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(lista));
}

let usuariosData = cargarUsuarios();
let ordenUsuarios = { campo: 'nombre', dir: 'asc' };

function ordenarUsuariosPor(campo) {
  if (ordenUsuarios.campo === campo) {
    ordenUsuarios.dir = ordenUsuarios.dir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenUsuarios.campo = campo;
    ordenUsuarios.dir = 'asc';
  }
  renderUsuarios();
}

function badgeRolUsuario(rol) {
  if (rol === 'Superadmin') return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">Superadmin</span>';
  if (rol === 'Gerente') return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-[#1c4d37] dark:bg-emerald-900/40 dark:text-emerald-300">Gerente</span>';
  if (rol === 'Facturación') return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Facturación</span>';
  if (rol === 'Operador de Despacho') return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Despacho</span>';
  return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">Vendedor</span>';
}

function badgeEstadoUsuario(estado) {
  return estado === 'Activo'
    ? '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Activo</span>'
    : '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">Inactivo</span>';
}

function renderKPIsSuperadmin() {
  usuariosData = cargarUsuarios();
  const activos = usuariosData.filter(u => u.estado === 'Activo').length;
  const inactivos = usuariosData.length - activos;
  const set = (id, val) => { const el = _s$(id); if (el) el.textContent = val; };
  set('kpiSuperUsuarios', usuariosData.length);
  set('kpiSuperUsuariosSub', `${activos} activos · ${inactivos} inactivos`);
  set('usrKpiTotal', usuariosData.length);
  set('usrKpiActivos', activos);
  set('usrKpiInactivos', inactivos);
}

function renderUsuarios() {
  renderKPIsSuperadmin();
  const tbody = _s$('tablaUsuarios');
  if (!tbody) return;

  const q = ((_s$('busquedaUsuarios') && _s$('busquedaUsuarios').value) || '').trim().toLowerCase();
  const fRol = (_s$('filtroRolUsuario') && _s$('filtroRolUsuario').value) || 'Todos';
  const fEst = (_s$('filtroEstadoUsuario') && _s$('filtroEstadoUsuario').value) || 'Todos';

  const filtrada = usuariosData.filter(u => {
    if (fRol !== 'Todos' && u.rol !== fRol) return false;
    if (fEst !== 'Todos' && u.estado !== fEst) return false;
    if (q && !(u.nombre + ' ' + u.username + ' ' + u.email + ' ' + (u.ruta || '') + ' ' + u.rol).toLowerCase().includes(q)) return false;
    return true;
  });

  const mult = ordenUsuarios.dir === 'asc' ? 1 : -1;
  const lista = [...filtrada].sort((a, b) => {
    switch (ordenUsuarios.campo) {
      case 'nombre': return String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es') * mult;
      case 'rol': return String(a.rol || '').localeCompare(String(b.rol || ''), 'es') * mult;
      case 'ruta': return String(a.ruta || '').localeCompare(String(b.ruta || ''), 'es') * mult;
      case 'estado': return String(a.estado || '').localeCompare(String(b.estado || ''), 'es') * mult;
      default: return 0;
    }
  });

  ['nombre', 'rol', 'ruta', 'estado'].forEach(c => {
    const span = _s$(`sortIconUsr-${c}`);
    if (!span) return;
    span.innerHTML = ordenUsuarios.campo === c
      ? `<i data-lucide="${ordenUsuarios.dir === 'asc' ? 'arrow-up' : 'arrow-down'}" class="w-3.5 h-3.5 opacity-100"></i>`
      : '<i data-lucide="arrow-up-down" class="w-3.5 h-3.5 opacity-60"></i>';
  });

  tbody.innerHTML = lista.length ? lista.map(u => `
    <tr class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
      <td class="py-3.5 px-4">
        <p class="font-semibold text-gray-900 dark:text-white">${_esc(u.nombre)}</p>
        <p class="text-xs font-mono text-[#1c4d37] dark:text-emerald-400">@${_esc(u.username)} · ${_esc(u.id)}</p>
      </td>
      <td class="py-3.5 px-4">${badgeRolUsuario(u.rol)}</td>
      <td class="py-3.5 px-4 text-gray-700 dark:text-gray-300">${_esc(u.ruta || '—')}</td>
      <td class="py-3.5 px-4">
        <p class="text-xs text-gray-700 dark:text-gray-300">${_esc(u.email)}</p>
        <p class="text-xs font-mono text-gray-400">${_esc(u.telefono || '—')}</p>
      </td>
      <td class="py-3.5 px-4 text-center">${badgeEstadoUsuario(u.estado)}</td>
      <td class="py-3.5 px-4 text-center">
        <div class="inline-flex items-center justify-center gap-1">
          <button onclick="editarUsuario('${u.id}')" title="Editar usuario" class="p-1.5 rounded-lg text-gray-400 hover:text-[#1c4d37] dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i data-lucide="pencil" class="w-4 h-4"></i>
          </button>
          <button onclick="alternarEstadoUsuario('${u.id}')" title="${u.estado === 'Activo' ? 'Desactivar cuenta' : 'Activar cuenta'}" class="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors">
            <i data-lucide="${u.estado === 'Activo' ? 'user-x' : 'user-check'}" class="w-4 h-4"></i>
          </button>
          <button onclick="eliminarUsuario('${u.id}')" title="Eliminar usuario" class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    </tr>`).join('') : '<tr><td colspan="6" class="text-center py-10 text-gray-400 dark:text-gray-500">No se encontraron usuarios.</td></tr>';

  if (window.lucide) lucide.createIcons();
}

function abrirModalUsuario() {
  const modal = _s$('modalUsuario');
  if (!modal) return;
  _s$('usrEditId').value = '';
  _s$('modalUsuarioTitulo').innerHTML = '<i data-lucide="user-plus" class="w-5 h-5"></i> Crear Nuevo Usuario';
  _s$('btnGuardarUsuario').textContent = 'Crear Usuario';
  _s$('usrNombre').value = '';
  _s$('usrUsername').value = '';
  _s$('usrPassword').value = '';
  _s$('usrPassword').required = true;
  _s$('usrRol').value = 'Vendedor';
  _s$('usrRuta').value = '';
  _s$('usrEmail').value = '';
  _s$('usrTelefono').value = '';
  _s$('usrEstado').value = 'Activo';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  requestAnimationFrame(() => modal.classList.remove('opacity-0'));
  if (window.lucide) lucide.createIcons();
}

function editarUsuario(id) {
  usuariosData = cargarUsuarios();
  const u = usuariosData.find(x => x.id === id);
  const modal = _s$('modalUsuario');
  if (!u || !modal) return;
  _s$('usrEditId').value = u.id;
  _s$('modalUsuarioTitulo').innerHTML = '<i data-lucide="user-pen" class="w-5 h-5"></i> Editar Usuario';
  _s$('btnGuardarUsuario').textContent = 'Guardar Cambios';
  _s$('usrNombre').value = u.nombre || '';
  _s$('usrUsername').value = u.username || '';
  _s$('usrPassword').value = '';
  _s$('usrPassword').required = false;
  _s$('usrRol').value = u.rol || 'Vendedor';
  _s$('usrRuta').value = u.ruta || '';
  _s$('usrEmail').value = u.email || '';
  _s$('usrTelefono').value = u.telefono || '';
  _s$('usrEstado').value = u.estado || 'Activo';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  requestAnimationFrame(() => modal.classList.remove('opacity-0'));
  if (window.lucide) lucide.createIcons();
}

function cerrarModalUsuario() {
  const modal = _s$('modalUsuario');
  if (!modal) return;
  modal.classList.add('opacity-0');
  setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 200);
}

function guardarUsuario(e) {
  e.preventDefault();
  usuariosData = cargarUsuarios();
  const editId = _s$('usrEditId').value;
  const nombre = _s$('usrNombre').value.trim();
  const username = _s$('usrUsername').value.trim().toLowerCase().replace(/\s+/g, '');
  const password = _s$('usrPassword').value;
  const rol = _s$('usrRol').value;
  const ruta = _s$('usrRuta').value.trim();
  const email = _s$('usrEmail').value.trim();
  const telefono = _s$('usrTelefono').value.trim();
  const estado = _s$('usrEstado').value;

  if ((!editId && password.length < 4) || (editId && password.length > 0 && password.length < 4)) {
    mostrarNotificacionSistema('La contraseña debe tener al menos 4 caracteres.');
    return;
  }
  const duplicado = usuariosData.some(u => u.id !== editId && (u.username.toLowerCase() === username || u.email.toLowerCase() === email.toLowerCase()));
  if (duplicado) {
    mostrarNotificacionSistema('Ya existe otro usuario registrado con ese nombre de usuario o correo.');
    return;
  }

  const ejecutarGuardado = () => {
    if (editId) {
      const idx = usuariosData.findIndex(u => u.id === editId);
      if (idx >= 0) {
        const cambios = { nombre, username, rol, ruta, email, telefono, estado };
        if (password) cambios.password = password;
        usuariosData[idx] = Object.assign({}, usuariosData[idx], cambios);
      }
      guardarUsuarios(usuariosData);
      cerrarModalUsuario();
      renderUsuarios();
      mostrarNotificacionSistema(`Usuario "${nombre}" actualizado correctamente.`);
    } else {
      const maxNum = usuariosData.reduce((m, u) => {
        const n = parseInt(String(u.id).replace(/\D+/g, ''), 10);
        return isNaN(n) ? m : Math.max(m, n);
      }, 0);
      const nuevo = {
        id: 'USR-' + String(maxNum + 1).padStart(3, '0'),
        nombre,
        username,
        password: password || '1234',
        rol,
        ruta,
        email,
        telefono,
        estado
      };
      usuariosData.unshift(nuevo);
      guardarUsuarios(usuariosData);
      cerrarModalUsuario();
      renderUsuarios();
      mostrarNotificacionSistema(`Usuario "${nombre}" (@${username}) creado con rol ${rol}.`);
    }
  };

  confirmarAccionSistema({
    titulo: editId ? 'Confirmar Edición de Usuario' : 'Confirmar Creación de Usuario',
    mensaje: editId ? '¿Deseas guardar los cambios en esta cuenta de usuario?' : '¿Deseas crear este nuevo usuario en el sistema Gentil Supply?',
    icono: editId ? 'user-check' : 'user-plus',
    textoConfirmar: editId ? 'Guardar Cambios' : 'Crear Usuario',
    detalleHtml: `
      <div class="flex justify-between"><span class="text-gray-500">Nombre:</span><span class="font-semibold">${_esc(nombre)}</span></div>
      <div class="flex justify-between"><span class="text-gray-500">Usuario:</span><span class="font-mono font-bold text-[#1c4d37] dark:text-emerald-400">@${_esc(username)}</span></div>
      <div class="flex justify-between"><span class="text-gray-500">Rol:</span><span class="font-semibold">${_esc(rol)}</span></div>
      <div class="flex justify-between"><span class="text-gray-500">Área / Ruta:</span><span>${_esc(ruta || 'General')}</span></div>
    `,
    onConfirm: ejecutarGuardado
  });
}

function alternarEstadoUsuario(id) {
  usuariosData = cargarUsuarios();
  const u = usuariosData.find(x => x.id === id);
  if (!u) return;
  const nuevoEst = u.estado === 'Activo' ? 'Inactivo' : 'Activo';
  u.estado = nuevoEst;
  guardarUsuarios(usuariosData);
  renderUsuarios();
  mostrarNotificacionSistema(`Cuenta @${u.username} marcada como ${nuevoEst}.`);
}

function eliminarUsuario(id) {
  usuariosData = cargarUsuarios();
  const u = usuariosData.find(x => x.id === id);
  if (!u) return;
  if (u.username === 'superadmin') {
    mostrarNotificacionSistema('No se puede eliminar la cuenta principal de Superadmin.');
    return;
  }
  confirmarAccionSistema({
    titulo: 'Eliminar Usuario',
    mensaje: `¿Estás seguro de eliminar permanentemente la cuenta de "${u.nombre}" (@${u.username})?`,
    icono: 'trash-2',
    variante: 'danger',
    textoConfirmar: 'Eliminar Usuario',
    onConfirm: () => {
      usuariosData = usuariosData.filter(x => x.id !== id);
      guardarUsuarios(usuariosData);
      renderUsuarios();
      mostrarNotificacionSistema(`Usuario @${u.username} eliminado.`);
    }
  });
}

if (typeof window.logout !== 'function') {
  window.logout = function() {
    if (typeof window.cerrarSesionSistema === 'function') {
      window.cerrarSesionSistema();
      return;
    }
    confirmarAccionSistema({
      titulo: 'Cerrar Sesión',
      mensaje: '¿Deseas cerrar la sesión actual?',
      icono: 'log-out',
      textoConfirmar: 'Cerrar Sesión',
      onConfirm: () => {
        try { localStorage.removeItem('gs_sesion_activa'); } catch (e) {}
        window.location.href = '../login.php';
      }
    });
  };
}

document.addEventListener('DOMContentLoaded', () => {
  renderUsuarios();
  window.addEventListener('storage', renderUsuarios);
});
