<?php
// Conexión PDO MySQL - Sistema Gentil Supply (Distribuidora Gentil Supply, C.A.)
// Ubicación: Sistema Gentil Supply 2/Base de Datos/conexion.php

declare(strict_types=1);

class DatabaseGentilSupply {
    private static ?PDO $pdo = null;
    private static ?string $ultimoError = null;

    // Credenciales por defecto (Apache/MariaDB/MySQL/XAMPP), sobreescribibles con variables de entorno GS_DB_*
    private const DB_HOST = '127.0.0.1';
    private const DB_PORT = '3306';
    private const DB_NAME = 'gentil_supply';
    private const DB_USER = 'root';
    private const DB_PASS = '';
    private const DB_CHARSET = 'utf8mb4';

    public static function conectar(): PDO {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }

        if (!class_exists('PDO') || !in_array('mysql', PDO::getAvailableDrivers(), true)) {
            throw new RuntimeException('El controlador PHP pdo_mysql no está habilitado.');
        }

        $host = getenv('GS_DB_HOST') ?: self::DB_HOST;
        $port = getenv('GS_DB_PORT') ?: self::DB_PORT;
        $dbName = getenv('GS_DB_NAME') ?: self::DB_NAME;
        $user = getenv('GS_DB_USER') !== false ? (string)getenv('GS_DB_USER') : self::DB_USER;
        $pass = getenv('GS_DB_PASS') !== false ? (string)getenv('GS_DB_PASS') : self::DB_PASS;

        $opciones = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', $host, $port, $dbName, self::DB_CHARSET);
            self::$pdo = new PDO($dsn, $user, $pass, $opciones);
        } catch (PDOException $e) {
            // Si la base de datos aún no existe (código 1049), intentar crearla e importar gentil_supply.sql automáticamente
            if (str_contains($e->getMessage(), '1049') || str_contains($e->getMessage(), 'Unknown database')) {
                $dsnBase = sprintf('mysql:host=%s;port=%s;charset=%s', $host, $port, self::DB_CHARSET);
                $pdoInit = new PDO($dsnBase, $user, $pass, $opciones);
                self::ejecutarArchivoSql($pdoInit, __DIR__ . '/gentil_supply.sql', $dbName);
                $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', $host, $port, $dbName, self::DB_CHARSET);
                self::$pdo = new PDO($dsn, $user, $pass, $opciones);
            } else {
                throw $e;
            }
        }

        // Verificar que la tabla principal exista; si la BD estaba vacía, inicializarla automáticamente
        try {
            $chk = self::$pdo->query("SHOW TABLES LIKE 'facturas'")->fetch();
            if (!$chk) {
                self::ejecutarArchivoSql(self::$pdo, __DIR__ . '/gentil_supply.sql', $dbName);
            }
        } catch (Throwable $ignore) {
            // La conexión principal ya quedó establecida
        }

        self::$ultimoError = null;
        return self::$pdo;
    }

    public static function intentarConectar(): ?PDO {
        try {
            return self::conectar();
        } catch (Throwable $e) {
            self::$ultimoError = $e->getMessage();
            return null;
        }
    }

    public static function obtenerUltimoError(): ?string {
        return self::$ultimoError;
    }

    private static function ejecutarArchivoSql(PDO $pdo, string $sqlPath, string $dbName): void {
        if (!is_file($sqlPath)) return;
        $raw = file_get_contents($sqlPath);
        if ($raw === false) return;

        $dbEsc = preg_replace('/[^a-zA-Z0-9_]/', '', $dbName) ?: 'gentil_supply';
        $raw = str_replace('`gentil_supply`', "`{$dbEsc}`", $raw);

        // Eliminar comentarios de línea -- ... y dividir sentencias por ; al final de línea
        $lineas = preg_split("/\r?\n/", $raw);
        $limpias = [];
        foreach ($lineas as $l) {
            $trim = ltrim($l);
            if ($trim === '' || str_starts_with($trim, '--')) continue;
            $limpias[] = $l;
        }
        $sqlLimpio = implode("\n", $limpias);
        $sentencias = preg_split('/;\s*(?:\r?\n|$)/', $sqlLimpio);
        foreach ($sentencias as $stmt) {
            $stmt = trim($stmt);
            if ($stmt === '') continue;
            $pdo->exec($stmt);
        }
    }
}
