<?php
// Hidratación inicial directa desde MySQL hacia todos los módulos PHP del sistema
// Se incluye silenciosamente dentro de <head> sin alterar el diseño ni la estética visual.
// Ubicación: Sistema Gentil Supply 2/Base de Datos/bootstrap_db.php

declare(strict_types=1);

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
echo "<script>window.__GS_DB_BOOTSTRAP__ = " . json_encode($__gsBootstrap, $__jsonFlags) . ";</script>\n";
