<?php
// API REST JSON Conectada a MySQL - Sistema Gentil Supply
// Ubicación: Sistema Gentil Supply 2/Base de Datos/api.php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

require_once __DIR__ . '/repositorio.php';

$pdo = DatabaseGentilSupply::intentarConectar();
if (!$pdo) {
    echo json_encode([
        'ok' => false,
        'conectado' => false,
        'mensaje' => DatabaseGentilSupply::obtenerUltimoError() ?: 'Base de datos MySQL no disponible',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

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
    $rawBody = file_get_contents('php://input');
    $body = json_decode($rawBody ?: '{}', true);
    if (!is_array($body)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'conectado' => true, 'mensaje' => 'JSON inválido'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $postAction = $body['action'] ?? $action ?: 'sync_key';

    if ($postAction === 'login') {
        $res = RepositorioGentilSupply::autenticarUsuario(
            $pdo,
            (string)($body['username'] ?? ''),
            (string)($body['password'] ?? '')
        );
        $res['conectado'] = true;
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($postAction === 'sync_key') {
        $key = (string)($body['key'] ?? '');
        $val = $body['value'] ?? null;
        $res = RepositorioGentilSupply::sincronizarClave($pdo, $key, $val);
        $res['conectado'] = true;
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($postAction === 'sync_all' && is_array($body['payload'] ?? null)) {
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
