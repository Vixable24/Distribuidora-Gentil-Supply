<?php
// Hidratación inicial directa desde MySQL + Control de Sesión Individual PHP (session_start)
// Si no existe sesión activa o si otra pestaña cerró la sesión, redirige obligatoriamente a login.php.
// Ubicación: Sistema Gentil Supply 2/Base de Datos/bootstrap_db.php

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}

$__scriptActual = basename($_SERVER['SCRIPT_NAME'] ?? '');
$__esPaginaPublica = in_array($__scriptActual, ['login.php', 'index.php', 'api.php', 'tasa_bcv.php'], true);
$__sesionPhpActiva = (!empty($_SESSION['gs_sesion_activa']) && is_array($_SESSION['gs_sesion_activa']))
    ? $_SESSION['gs_sesion_activa']
    : null;

if (PHP_SAPI !== 'cli' && !$__esPaginaPublica && !$__sesionPhpActiva) {
    $__enSubcarpeta = stripos(rawurldecode($_SERVER['SCRIPT_NAME'] ?? ''), 'Modulo de ') !== false;
    $__urlLogin = ($__enSubcarpeta ? '../' : '') . 'login.php';
    if (!headers_sent()) {
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Location: ' . $__urlLogin);
        exit;
    }
    echo "<script>window.location.replace(" . json_encode($__urlLogin) . ");</script>";
    exit;
}

require_once __DIR__ . '/repositorio.php';

$__gsBootstrap = ['conectado' => false];
$__pdo = DatabaseGentilSupply::intentarConectar();
if ($__pdo instanceof PDO) {
    try {
        $__gsBootstrap = RepositorioGentilSupply::obtenerEstadoCompleto($__pdo);
    } catch (Throwable $e) {
        $__gsBootstrap = ['conectado' => false, 'error' => $e->getMessage()];
    }
} else {
    $__err = DatabaseGentilSupply::obtenerUltimoError();
    if ($__err) $__gsBootstrap['error'] = $__err;
}

$__jsonFlags = JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT;
echo "<script>window.__GS_PHP_SESSION__ = " . json_encode($__sesionPhpActiva, $__jsonFlags) . ";\n";
echo "window.__GS_DB_BOOTSTRAP__ = " . json_encode($__gsBootstrap, $__jsonFlags) . ";</script>\n";
