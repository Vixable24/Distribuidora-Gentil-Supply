<?php
// API REST JSON Conectada a MySQL + Controlador de Sesiones PHP (session_start) - Sistema Gentil Supply
// Ubicación: Sistema Gentil Supply 2/Base de Datos/api.php

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}

header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

require_once __DIR__ . '/repositorio.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';
$rawBody = $method === 'POST' ? (file_get_contents('php://input') ?: '{}') : '{}';
$body = $method === 'POST' ? json_decode($rawBody, true) : [];
if (!is_array($body)) $body = [];
$postAction = (string)($body['action'] ?? $action);

function guardarSesionPhpUsuario(array $u): array {
    if (session_status() === PHP_SESSION_ACTIVE) {
        @session_regenerate_id(true);
    }
    $sesion = [
        'id'           => (string)($u['id'] ?? 'USR-001'),
        'nombre'       => (string)($u['nombre'] ?? $u['username'] ?? 'Usuario'),
        'username'     => (string)($u['username'] ?? ''),
        'rol'          => (string)($u['rol'] ?? 'Vendedor'),
        'ruta'         => (string)($u['ruta'] ?? ''),
        'email'        => (string)($u['email'] ?? ''),
        'moduloInicio' => (string)($u['moduloInicio'] ?? ''),
        'sessionToken' => bin2hex(random_bytes(16)),
        'loginEn'      => date('c'),
    ];
    $_SESSION['gs_sesion_activa'] = $sesion;
    return $sesion;
}

function destruirSesionPhpUsuario(): void {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        @setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }
    if (session_status() === PHP_SESSION_ACTIVE) {
        @session_destroy();
    }
}

// 1. Acciones de sesión y exportación SQL (operan siempre, con o sin servidor MySQL activo)
if ($action === 'check_session' || $postAction === 'check_session') {
    header('Content-Type: application/json; charset=utf-8');
    $sesion = (!empty($_SESSION['gs_sesion_activa']) && is_array($_SESSION['gs_sesion_activa']))
        ? $_SESSION['gs_sesion_activa']
        : null;
    echo json_encode([
        'ok'      => true,
        'activa'  => $sesion !== null,
        'sesion'  => $sesion,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($action === 'logout' || $postAction === 'logout') {
    header('Content-Type: application/json; charset=utf-8');
    destruirSesionPhpUsuario();
    echo json_encode([
        'ok'        => true,
        'activa'    => false,
        'loggedOut' => true,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($postAction === 'session_start' && is_array($body['usuario'] ?? null)) {
    header('Content-Type: application/json; charset=utf-8');
    $sesion = guardarSesionPhpUsuario($body['usuario']);
    echo json_encode([
        'ok'     => true,
        'activa' => true,
        'sesion' => $sesion,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$pdo = DatabaseGentilSupply::intentarConectar();

if ($action === 'export_sql' || $postAction === 'export_sql') {
    date_default_timezone_set('America/Caracas');
    $sqlDump = RepositorioGentilSupply::exportarRespaldoSQL($pdo);
    $filename = 'gentil_supply_backup_' . date('Y-m-d') . '.sql';
    header('Content-Type: application/sql; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    echo $sqlDump;
    exit;
}

header('Content-Type: application/json; charset=utf-8');

if (!$pdo) {
    echo json_encode([
        'ok' => false,
        'conectado' => false,
        'mensaje' => DatabaseGentilSupply::obtenerUltimoError() ?: 'Base de datos MySQL no disponible',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'GET') {
    if ($action === 'ping') {
        echo json_encode(['ok' => true, 'conectado' => true, 'motor' => 'MySQL / PDO'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    try {
        $estado = RepositorioGentilSupply::obtenerEstadoCompleto($pdo);
        $estado['ok'] = true;
        echo json_encode($estado, JSON_UNESCAPED_UNICODE);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'conectado' => true, 'mensaje' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit;
}

if ($method === 'POST') {
    $accionPost = $postAction ?: 'sync_key';

    if ($accionPost === 'login') {
        $res = RepositorioGentilSupply::autenticarUsuario(
            $pdo,
            (string)($body['username'] ?? ''),
            (string)($body['password'] ?? '')
        );
        if (!empty($res['ok']) && is_array($res['usuario'] ?? null)) {
            $res['sesion'] = guardarSesionPhpUsuario($res['usuario']);
        }
        $res['conectado'] = true;
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($accionPost === 'sync_key') {
        $key = (string)($body['key'] ?? '');
        $val = $body['value'] ?? null;
        $res = RepositorioGentilSupply::sincronizarClave($pdo, $key, $val);
        $res['conectado'] = true;
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($accionPost === 'sync_all' && is_array($body['payload'] ?? null)) {
        $ordenClaves = [
            'gs_tasa_bcv',
            'gs_tasa_bcv_meta',
            'gs_usuarios_v1',
            'gs_clientes_v1',
            'gs_inventario_v1',
            'gs_movimientos_inv_v1',
            'gs_ventas_v2',
            'gs_pagos_v2',
            'gs_facturas_v1',
            'gs_despachos_v1',
        ];
        $errores = [];
        foreach ($ordenClaves as $k) {
            if (!array_key_exists($k, $body['payload'])) continue;
            $r = RepositorioGentilSupply::sincronizarClave($pdo, $k, $body['payload'][$k]);
            if (empty($r['ok'])) $errores[$k] = $r['mensaje'] ?? 'Error al sincronizar';
        }
        echo json_encode([
            'ok' => count($errores) === 0,
            'conectado' => true,
            'errores' => $errores,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    http_response_code(400);
    echo json_encode(['ok' => false, 'conectado' => true, 'mensaje' => 'Acción no soportada'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'mensaje' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
