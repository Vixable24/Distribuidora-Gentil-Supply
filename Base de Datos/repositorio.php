<?php
// Repositorio Relacional MySQL <-> Frontend Gentil Supply
// Garantiza formato FAC-XXXXXX en todas las facturas y persistencia completa de todos los módulos.
// Ubicación: Sistema Gentil Supply 2/Base de Datos/repositorio.php

declare(strict_types=1);

require_once __DIR__ . '/conexion.php';

class RepositorioGentilSupply {
    /**
     * Normaliza cualquier número de factura existente al formato único FAC-000001.
     */
    public static function normalizarNumeroFAC(?string $raw, int $corrFallback = 1): string {
        $s = strtoupper(trim((string)$raw));
        if ($s !== '') {
            if (preg_match('/^FAC-(\d+)$/', $s, $m)) {
                $num = max(1, (int)$m[1]);
                return 'FAC-' . str_pad((string)$num, 6, '0', STR_PAD_LEFT);
            }
            if (preg_match('/(\d+)/', $s, $m)) {
                $num = max(1, (int)$m[1]);
                return 'FAC-' . str_pad((string)$num, 6, '0', STR_PAD_LEFT);
            }
        }
        $num = max(1, $corrFallback);
        return 'FAC-' . str_pad((string)$num, 6, '0', STR_PAD_LEFT);
    }

    public static function normalizarNumeroControl(?string $raw, int $corrFallback = 1): string {
        $s = trim((string)$raw);
        if (preg_match('/^\d{2}-\d{6}$/', $s)) return $s;
        if (preg_match('/(\d+)/', $s, $m)) {
            $num = max(1, (int)$m[1]);
            return '00-' . str_pad((string)$num, 6, '0', STR_PAD_LEFT);
        }
        $num = max(1, $corrFallback);
        return '00-' . str_pad((string)$num, 6, '0', STR_PAD_LEFT);
    }

    public static function extraerCorrelativoFAC(string $numeroFAC, int $fallback = 1): int {
        if (preg_match('/(\d+)/', $numeroFAC, $m)) {
            return max(1, (int)$m[1]);
        }
        return max(1, $fallback);
    }

    public static function normalizarRuta(?string $raw, string $fallback = 'Ruta 2'): string {
        $s = trim((string)$raw);
        if ($s === '') return $fallback;
        $low = mb_strtolower($s);
        if (preg_match('/ruta\s*([0-9]+)|^([23459])$/', $low, $m)) {
            $num = $m[1] !== '' ? $m[1] : $m[2];
            return 'Ruta ' . $num;
        }
        return $s;
    }

    private static function resolverRutaClienteDefault(string $nombre): string {
        $mapa = [
            'Supermercado Central' => 'Ruta 2',
            'Tienda El Ahorro' => 'Ruta 2',
            'Bodegón Los Pescadores C.A.' => 'Ruta 2',
            'Minimarket Express' => 'Ruta 3',
            'Restaurant El Faro' => 'Ruta 3',
            'Bodega San José' => 'Ruta 4',
            'Abastos San Juan Bautista' => 'Ruta 4',
            'Comercial López' => 'Ruta 5',
            'Supermercado Juan Griego' => 'Ruta 5',
            'Abastos La Asunción' => 'Ruta 9',
            'Panadería Santa Ana' => 'Ruta 9',
        ];
        return $mapa[$nombre] ?? 'Ruta 2';
    }

    private static bool $esquemaRutasVerificado = false;

    public static function asegurarEsquemaRutas(PDO $pdo): void {
        if (self::$esquemaRutasVerificado) return;
        self::$esquemaRutasVerificado = true;

        try {
            $pdo->exec(
                'CREATE TABLE IF NOT EXISTS `rutas_vendedores` (
                    `codigo` VARCHAR(30) NOT NULL,
                    `nombre` VARCHAR(80) NOT NULL,
                    `descripcion` VARCHAR(160) DEFAULT NULL,
                    `activa` TINYINT(1) NOT NULL DEFAULT 1,
                    PRIMARY KEY (`codigo`)
                 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
            );
            $stRuta = $pdo->prepare('INSERT IGNORE INTO rutas_vendedores (codigo, nombre, descripcion) VALUES (?, ?, ?)');
            foreach (['Ruta 2', 'Ruta 3', 'Ruta 4', 'Ruta 5', 'Ruta 9'] as $r) {
                $stRuta->execute([$r, $r, 'Cartera exclusiva del Vendedor ' . $r]);
            }

            $hasCliRuta = (bool)$pdo->query("SHOW COLUMNS FROM `clientes` LIKE 'ruta'")->fetch();
            if (!$hasCliRuta) {
                $pdo->exec("ALTER TABLE `clientes` ADD COLUMN `ruta` VARCHAR(30) NOT NULL DEFAULT 'Ruta 2' AFTER `municipio_id`, ADD INDEX `idx_clientes_ruta` (`ruta`)");
            }
            $hasCliVend = (bool)$pdo->query("SHOW COLUMNS FROM `clientes` LIKE 'vendedor_id'")->fetch();
            if (!$hasCliVend) {
                $pdo->exec("ALTER TABLE `clientes` ADD COLUMN `vendedor_id` INT UNSIGNED DEFAULT NULL AFTER `ruta`, ADD INDEX `idx_clientes_vendedor` (`vendedor_id`)");
            }
            $hasVenRuta = (bool)$pdo->query("SHOW COLUMNS FROM `ventas` LIKE 'ruta'")->fetch();
            if (!$hasVenRuta) {
                $pdo->exec("ALTER TABLE `ventas` ADD COLUMN `ruta` VARCHAR(30) NOT NULL DEFAULT 'Ruta 2' AFTER `usuario_id`, ADD INDEX `idx_ventas_ruta` (`ruta`)");
            }
            $hasClaveVis = (bool)$pdo->query("SHOW COLUMNS FROM `usuarios` LIKE 'clave_visible'")->fetch();
            if (!$hasClaveVis) {
                $pdo->exec("ALTER TABLE `usuarios` ADD COLUMN `clave_visible` VARCHAR(100) NOT NULL DEFAULT '1234' AFTER `password_hash`");
            }
            $pdo->exec("UPDATE usuarios SET ruta_asignada = 'Almacén El Piache' WHERE ruta_asignada = 'Almacén La Asunción'");

            // Asegurar los 5 vendedores (Ruta 2, 3, 4, 5 y 9) si el esquema ya existía previo a este cambio
            $hash1234 = password_hash('1234', PASSWORD_BCRYPT);
            $vendedores = [
                ['USR-003', 'Vendedor Ruta 2', 'ruta2', 'ruta2@gentilsupply.com', '0412-3548810', 'Ruta 2'],
                ['USR-006', 'Vendedor Ruta 3', 'ruta3', 'ruta3@gentilsupply.com', '0412-3548813', 'Ruta 3'],
                ['USR-007', 'Vendedor Ruta 4', 'ruta4', 'ruta4@gentilsupply.com', '0414-3548814', 'Ruta 4'],
                ['USR-008', 'Vendedor Ruta 5', 'ruta5', 'ruta5@gentilsupply.com', '0416-3548815', 'Ruta 5'],
                ['USR-009', 'Vendedor Ruta 9', 'ruta9', 'ruta9@gentilsupply.com', '0424-3548819', 'Ruta 9'],
            ];
            $stChkU = $pdo->prepare('SELECT id, ruta_asignada FROM usuarios WHERE LOWER(username) = LOWER(?) LIMIT 1');
            $stUpdR = $pdo->prepare('UPDATE usuarios SET ruta_asignada = ? WHERE id = ?');
            $stInsU = $pdo->prepare('INSERT INTO usuarios (codigo, nombre_completo, username, email, telefono, password_hash, clave_visible, rol_id, ruta_asignada, estado) VALUES (?, ?, ?, ?, ?, ?, "1234", 3, ?, "Activo")');
            foreach ($vendedores as [$cod, $nom, $usr, $mail, $tel, $ruta]) {
                $stChkU->execute([$usr]);
                $ex = $stChkU->fetch();
                if ($ex) {
                    if ($ex['ruta_asignada'] !== $ruta) {
                        $stUpdR->execute([$ruta, (int)$ex['id']]);
                    }
                } else {
                    $stInsU->execute([$cod, $nom, $usr, $mail, $tel, $hash1234, $ruta]);
                }
            }

            // Asegurar asignación individual de clientes semilla en BD existente
            $stUpdCliR = $pdo->prepare('UPDATE clientes SET ruta = ?, vendedor_id = ? WHERE LOWER(nombre) = LOWER(?)');
            foreach ([
                'Supermercado Central' => 'Ruta 2',
                'Tienda El Ahorro' => 'Ruta 2',
                'Bodegón Los Pescadores C.A.' => 'Ruta 2',
                'Minimarket Express' => 'Ruta 3',
                'Restaurant El Faro' => 'Ruta 3',
                'Bodega San José' => 'Ruta 4',
                'Abastos San Juan Bautista' => 'Ruta 4',
                'Comercial López' => 'Ruta 5',
                'Supermercado Juan Griego' => 'Ruta 5',
                'Abastos La Asunción' => 'Ruta 9',
                'Panadería Santa Ana' => 'Ruta 9',
            ] as $cliNom => $cliRuta) {
                $vendId = self::resolverVendedorIdPorRuta($pdo, $cliRuta);
                $stUpdCliR->execute([$cliRuta, $vendId, $cliNom]);
            }
        } catch (Throwable $ignore) {}
    }

    private static function resolverVendedorIdPorRuta(PDO $pdo, string $ruta): ?int {
        $rutaNorm = self::normalizarRuta($ruta);
        $st = $pdo->prepare('SELECT id FROM usuarios WHERE ruta_asignada = ? AND rol_id = 3 ORDER BY id ASC LIMIT 1');
        $st->execute([$rutaNorm]);
        $row = $st->fetch();
        return $row ? (int)$row['id'] : null;
    }

    public static function rutaModuloPorRol(string $rol): string {
        $r = mb_strtolower(trim($rol));
        return match ($r) {
            'superadmin' => 'Modulo de Superadmin/dashboard.php',
            'gerente', 'administrador' => 'Modulo de Administrador/dashboard.php',
            'facturación', 'facturacion' => 'Modulo de facturacion/dashboard.php',
            'operador de despacho', 'despacho' => 'Modulo de Despacho/dashboard.php',
            default => 'Modulo de Ventas/dashboard.php',
        };
    }

    public static function autenticarUsuario(PDO $pdo, string $username, string $password): array {
        self::asegurarEsquemaRutas($pdo);
        $userClean = strtolower(trim($username));
        if ($userClean === '' || $password === '') {
            return ['ok' => false, 'motivo' => 'campos', 'mensaje' => 'Ingresa usuario y contraseña.'];
        }

        $st = $pdo->prepare(
            'SELECT u.id, u.codigo, u.nombre_completo, u.username, u.email, u.telefono,
                    u.password_hash, u.ruta_asignada, u.estado, r.nombre AS rol
             FROM usuarios u
             INNER JOIN roles r ON r.id = u.rol_id
             WHERE LOWER(u.username) = ?
             LIMIT 1'
        );
        $st->execute([$userClean]);
        $row = $st->fetch();
        if (!$row) {
            return ['ok' => false, 'motivo' => 'credenciales', 'mensaje' => 'Usuario o contraseña incorrectos.'];
        }

        $hash = (string)($row['password_hash'] ?? '');
        $hashSemillaAntiguo = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
        $esSemillaSencilla = ($hash === $hashSemillaAntiguo && $password === '1234');
        if (!$esSemillaSencilla && !password_verify($password, $hash)) {
            return ['ok' => false, 'motivo' => 'credenciales', 'mensaje' => 'Usuario o contraseña incorrectos.'];
        }

        if ($esSemillaSencilla) {
            $nuevoHash = password_hash('1234', PASSWORD_BCRYPT);
            $stRehash = $pdo->prepare('UPDATE usuarios SET password_hash = ? WHERE id = ?');
            $stRehash->execute([$nuevoHash, (int)$row['id']]);
        }

        if (($row['estado'] ?? 'Activo') !== 'Activo') {
            return ['ok' => false, 'motivo' => 'inactivo', 'mensaje' => 'Esta cuenta se encuentra inactiva. Contacta al Superadmin.'];
        }

        $stAcc = $pdo->prepare('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?');
        $stAcc->execute([(int)$row['id']]);

        $rolNombre = (string)$row['rol'];
        return [
            'ok' => true,
            'usuario' => [
                'id' => (string)$row['codigo'],
                'nombre' => (string)$row['nombre_completo'],
                'username' => (string)$row['username'],
                'rol' => $rolNombre,
                'ruta' => (string)($row['ruta_asignada'] ?? ''),
                'email' => (string)$row['email'],
                'telefono' => (string)($row['telefono'] ?? ''),
                'estado' => (string)$row['estado'],
                'moduloInicio' => self::rutaModuloPorRol($rolNombre),
            ],
        ];
    }

    private static function resolverMunicipioId(PDO $pdo, ?string $nombreZona): int {
        $zona = trim((string)$nombreZona);
        if ($zona === '') $zona = 'Mariño';
        $st = $pdo->prepare('SELECT id FROM municipios WHERE LOWER(nombre) = LOWER(?) LIMIT 1');
        $st->execute([$zona]);
        $row = $st->fetch();
        if ($row) return (int)$row['id'];

        $st = $pdo->prepare('INSERT INTO municipios (nombre) VALUES (?)');
        $st->execute([$zona]);
        return (int)$pdo->lastInsertId();
    }

    private static function resolverClienteId(PDO $pdo, string $nombre, string $rif = '', string $zona = 'Mariño', string $direccion = '', ?string $ruta = null): int {
        $rifLimpio = preg_replace('/[^VEJGP0-9]/', '', strtoupper($rif));
        if ($rifLimpio !== '') {
            $st = $pdo->prepare('SELECT id FROM clientes WHERE rif = ? LIMIT 1');
            $st->execute([$rifLimpio]);
            $row = $st->fetch();
            if ($row) return (int)$row['id'];
        }
        $nombreLimpio = trim($nombre) !== '' ? trim($nombre) : 'Cliente General';
        $st = $pdo->prepare('SELECT id FROM clientes WHERE LOWER(nombre) = LOWER(?) LIMIT 1');
        $st->execute([$nombreLimpio]);
        $row = $st->fetch();
        if ($row) return (int)$row['id'];

        $tipoRif = 'J';
        if (preg_match('/^([VEJGP])/', $rifLimpio, $m)) $tipoRif = $m[1];
        if ($rifLimpio === '') {
            $rifLimpio = 'J' . str_pad((string)random_int(100000000, 999999999), 9, '0', STR_PAD_LEFT);
        }
        $munId = self::resolverMunicipioId($pdo, $zona);
        $rutaFinal = self::normalizarRuta($ruta, self::resolverRutaClienteDefault($nombreLimpio));
        $vendId = self::resolverVendedorIdPorRuta($pdo, $rutaFinal);
        $st = $pdo->prepare(
            'INSERT INTO clientes (nombre, tipo_rif, rif, municipio_id, ruta, vendedor_id, direccion, activo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)'
        );
        $st->execute([$nombreLimpio, $tipoRif, $rifLimpio, $munId, $rutaFinal, $vendId, $direccion ?: $zona]);
        return (int)$pdo->lastInsertId();
    }

    private static function resolverBancoCodigo(PDO $pdo, string $bancoTexto): ?string {
        $txt = trim($bancoTexto);
        if ($txt === '') return null;
        if (preg_match('/^(\d{4})\b/', $txt, $m)) {
            $st = $pdo->prepare('SELECT codigo FROM bancos_venezuela WHERE codigo = ? LIMIT 1');
            $st->execute([$m[1]]);
            if ($st->fetch()) return $m[1];
        }
        $st = $pdo->prepare('SELECT codigo FROM bancos_venezuela WHERE LOWER(nombre) LIKE LOWER(?) LIMIT 1');
        $st->execute(['%' . $txt . '%']);
        $row = $st->fetch();
        return $row ? (string)$row['codigo'] : null;
    }

    private static function resolverPresentacion(PDO $pdo, string $codigoProducto): ?array {
        if ($codigoProducto === '') return null;
        $st = $pdo->prepare('SELECT id, codigo FROM productos_presentaciones WHERE codigo = ? LIMIT 1');
        $st->execute([$codigoProducto]);
        $row = $st->fetch();
        return $row ?: null;
    }

    private static function repararFacturasFormatoFAC(PDO $pdo): void {
        $rows = $pdo->query('SELECT id, correlativo, numero_factura, numero_control FROM facturas ORDER BY correlativo ASC, id ASC')->fetchAll();
        foreach ($rows as $row) {
            $corr = max(1, (int)$row['correlativo'] ?: (int)$row['id']);
            $numNorm = self::normalizarNumeroFAC((string)$row['numero_factura'], $corr);
            $ctrlNorm = self::normalizarNumeroControl((string)$row['numero_control'], $corr);
            if ($numNorm !== $row['numero_factura'] || $ctrlNorm !== $row['numero_control']) {
                try {
                    $st = $pdo->prepare('UPDATE facturas SET numero_factura = ?, numero_control = ?, correlativo = ? WHERE id = ?');
                    $st->execute([$numNorm, $ctrlNorm, self::extraerCorrelativoFAC($numNorm, $corr), (int)$row['id']]);
                } catch (Throwable $ignore) {}
            }
        }
        $desps = $pdo->query('SELECT id, numero_factura FROM despachos WHERE numero_factura IS NOT NULL AND numero_factura <> ""')->fetchAll();
        foreach ($desps as $d) {
            $norm = self::normalizarNumeroFAC((string)$d['numero_factura'], 1);
            if ($norm !== $d['numero_factura']) {
                $st = $pdo->prepare('UPDATE despachos SET numero_factura = ? WHERE id = ?');
                $st->execute([$norm, (int)$d['id']]);
            }
        }
    }

    /**
     * Lee todo el estado operativo desde MySQL en el formato exacto esperado por todos los módulos del frontend.
     */
    public static function obtenerEstadoCompleto(PDO $pdo): array {
        self::asegurarEsquemaRutas($pdo);
        self::repararFacturasFormatoFAC($pdo);

        // 1. Clientes (incluye desactivados para conservar facturas, deudas e historial)
        $clientesRaw = $pdo->query(
            'SELECT c.nombre, c.rif, m.nombre AS zona, c.ruta, c.contacto, c.telefono, c.email, c.direccion, c.activo
             FROM clientes c
             INNER JOIN municipios m ON m.id = c.municipio_id
             ORDER BY c.id ASC'
        )->fetchAll();
        $clientesSql = array_map(static fn($r) => [
            'nombre' => $r['nombre'],
            'rif' => $r['rif'],
            'zona' => $r['zona'],
            'ruta' => $r['ruta'],
            'contacto' => $r['contacto'] ?? '',
            'telefono' => $r['telefono'] ?? '',
            'email' => $r['email'] ?? '',
            'direccion' => $r['direccion'] ?? '',
            'activo' => (bool)$r['activo'],
        ], $clientesRaw);

        // 2. Inventario por presentación
        $invSql = $pdo->query(
            'SELECT pp.codigo AS id, pb.codigo_base AS baseId, pb.nombre_base AS baseNombre,
                    ma.clave AS marcaKey, ma.nombre AS marcaNombre, pp.pres_key AS presKey,
                    pp.pres_nombre AS presNombre, pp.tipo_empaque AS tipo, pp.plural, pp.nombre,
                    pp.contiene_unidades AS contiene, pp.precio_usd AS precio,
                    pp.stock_actual AS stock, pp.stock_minimo AS stockMin, pp.ubicacion_almacen AS ubicacion
             FROM productos_presentaciones pp
             INNER JOIN productos_base pb ON pb.id = pp.producto_base_id
             INNER JOIN marcas ma ON ma.id = pp.marca_id
             WHERE pp.activo = 1
             ORDER BY pp.id ASC'
        )->fetchAll();
        $inventario = array_map(static fn($r) => [
            'id' => $r['id'],
            'baseId' => $r['baseId'],
            'baseNombre' => $r['baseNombre'],
            'marcaKey' => $r['marcaKey'],
            'marcaNombre' => $r['marcaNombre'],
            'presKey' => $r['presKey'],
            'presNombre' => $r['presNombre'],
            'tipo' => $r['tipo'],
            'plural' => $r['plural'],
            'nombre' => $r['nombre'],
            'contiene' => (int)$r['contiene'],
            'precio' => (float)$r['precio'],
            'stock' => (int)$r['stock'],
            'stockMin' => (int)$r['stockMin'],
            'ubicacion' => $r['ubicacion'] ?? '',
        ], $invSql);

        // 3. Movimientos de inventario (Kardex)
        $movsRows = $pdo->query('SELECT id, codigo, fecha_movimiento, tipo, referencia, observacion FROM inventario_movimientos ORDER BY id DESC')->fetchAll();
        $movDetSt = $pdo->prepare('SELECT codigo_producto AS id, nombre_producto AS nombre, cantidad, contiene_unidades AS contiene FROM inventario_movimiento_detalles WHERE movimiento_id = ? ORDER BY id ASC');
        $movimientos = [];
        foreach ($movsRows as $mr) {
            $movDetSt->execute([(int)$mr['id']]);
            $detRows = $movDetSt->fetchAll();
            $movimientos[] = [
                'id' => $mr['codigo'],
                'fecha' => $mr['fecha_movimiento'],
                'tipo' => $mr['tipo'],
                'referencia' => $mr['referencia'],
                'observacion' => $mr['observacion'] ?? '',
                'items' => array_map(static fn($d) => [
                    'id' => $d['id'],
                    'nombre' => $d['nombre'],
                    'cantidad' => (int)$d['cantidad'],
                    'contiene' => (int)$d['contiene'],
                ], $detRows),
            ];
        }

        // 4. Ventas y sus detalles
        $ventasRows = $pdo->query(
            'SELECT v.id, v.codigo, c.nombre AS cliente, COALESCE(NULLIF(v.ruta, ""), c.ruta, "Ruta 2") AS ruta,
                    v.fecha_venta, v.plazo_credito, v.tasa_bcv_aplicada,
                    v.total_usd, v.estado, v.estado_despacho, v.stock_descontado, v.motivo_anulacion, v.fecha_anulacion
             FROM ventas v
             INNER JOIN clientes c ON c.id = v.cliente_id
             ORDER BY v.id DESC'
        )->fetchAll();
        $vDetSt = $pdo->prepare(
            'SELECT codigo_producto AS id, nombre_producto AS nombre, cantidad, contiene_unidades AS contiene, precio_unitario_usd AS precio
             FROM venta_detalles WHERE venta_id = ? ORDER BY id ASC'
        );
        $ventas = [];
        foreach ($ventasRows as $vr) {
            $vDetSt->execute([(int)$vr['id']]);
            $items = array_map(static fn($d) => [
                'id' => $d['id'],
                'nombre' => $d['nombre'],
                'cantidad' => (int)$d['cantidad'],
                'contiene' => (int)$d['contiene'],
                'precio' => (float)$d['precio'],
            ], $vDetSt->fetchAll());
            $ventaObj = [
                'id' => $vr['codigo'],
                'cliente' => $vr['cliente'],
                'ruta' => self::normalizarRuta($vr['ruta']),
                'fecha' => $vr['fecha_venta'],
                'estado' => $vr['estado'],
                'credito' => $vr['plazo_credito'] ?: '0',
                'tasaBcv' => (float)$vr['tasa_bcv_aplicada'],
                'items' => $items,
                'total' => (float)$vr['total_usd'],
                'stockDescontado' => (bool)$vr['stock_descontado'],
            ];
            if ($vr['estado_despacho'] !== '') {
                $ventaObj['estadoDespacho'] = $vr['estado_despacho'];
            }
            if (!empty($vr['motivo_anulacion'])) {
                $ventaObj['anulacion'] = [
                    'motivo' => $vr['motivo_anulacion'],
                    'fecha' => $vr['fecha_anulacion'] ?: $vr['fecha_venta'],
                ];
            }
            $ventas[] = $ventaObj;
        }

        // 5. Pagos / Cobranzas
        $pagosRows = $pdo->query(
            'SELECT p.codigo, v.codigo AS ventaId, c.nombre AS cliente, p.fecha_pago, p.metodo,
                    p.banco_nombre, p.referencia, p.monto_usd, p.monto_bs, p.tasa_bcv, p.estado,
                    p.motivo_rechazo, p.fecha_verificacion
             FROM pagos p
             INNER JOIN ventas v ON v.id = p.venta_id
             INNER JOIN clientes c ON c.id = p.cliente_id
             ORDER BY p.id DESC'
        )->fetchAll();
        $pagos = array_map(static function ($pr) {
            $p = [
                'id' => $pr['codigo'],
                'ventaId' => $pr['ventaId'],
                'cliente' => $pr['cliente'],
                'fecha' => $pr['fecha_pago'],
                'metodo' => $pr['metodo'],
                'banco' => $pr['banco_nombre'] ?? '',
                'monto' => (float)$pr['monto_usd'],
                'montoBs' => (float)$pr['monto_bs'],
                'tasa' => (float)$pr['tasa_bcv'],
                'referencia' => $pr['referencia'] ?? '',
                'estado' => $pr['estado'],
            ];
            if (!empty($pr['motivo_rechazo'])) $p['motivoRechazo'] = $pr['motivo_rechazo'];
            if (!empty($pr['fecha_verificacion'])) $p['fechaVerificacion'] = $pr['fecha_verificacion'];
            return $p;
        }, $pagosRows);

        // 6. Facturas (Todas estrictamente en formato FAC-XXXXXX)
        $facRows = $pdo->query(
            'SELECT f.id, f.correlativo, f.numero_factura, f.numero_control, v.codigo AS ventaId,
                    c.nombre AS cliente, c.rif, COALESCE(f.direccion_fiscal, c.direccion, m.nombre) AS direccion,
                    f.fecha_emision, f.plazo_credito, f.tasa_bcv, f.base_imponible_usd, f.iva_usd, f.total_usd,
                    f.estado, f.estado_despacho, f.motivo_anulacion, f.fecha_anulacion
             FROM facturas f
             INNER JOIN ventas v ON v.id = f.venta_id
             INNER JOIN clientes c ON c.id = f.cliente_id
             INNER JOIN municipios m ON m.id = c.municipio_id
             ORDER BY f.correlativo DESC, f.id DESC'
        )->fetchAll();
        $fDetSt = $pdo->prepare(
            'SELECT codigo_producto AS id, descripcion AS nombre, cantidad, contiene_unidades AS contiene, precio_unitario_usd AS precio
             FROM factura_detalles WHERE factura_id = ? ORDER BY id ASC'
        );
        $facturas = [];
        foreach ($facRows as $fr) {
            $fDetSt->execute([(int)$fr['id']]);
            $items = array_map(static fn($d) => [
                'id' => $d['id'],
                'nombre' => $d['nombre'],
                'cantidad' => (int)$d['cantidad'],
                'contiene' => (int)$d['contiene'],
                'precio' => (float)$d['precio'],
            ], $fDetSt->fetchAll());
            $numFAC = self::normalizarNumeroFAC($fr['numero_factura'], (int)$fr['correlativo']);
            $facObj = [
                'correlativo' => self::extraerCorrelativoFAC($numFAC, (int)$fr['correlativo']),
                'numero' => $numFAC,
                'control' => self::normalizarNumeroControl($fr['numero_control'], (int)$fr['correlativo']),
                'ventaId' => $fr['ventaId'],
                'cliente' => $fr['cliente'],
                'rif' => $fr['rif'],
                'direccion' => $fr['direccion'] ?? 'Nueva Esparta',
                'fecha' => $fr['fecha_emision'],
                'credito' => $fr['plazo_credito'] ?: '0',
                'tasa' => (float)$fr['tasa_bcv'],
                'items' => $items,
                'base' => (float)$fr['base_imponible_usd'],
                'iva' => (float)$fr['iva_usd'],
                'total' => (float)$fr['total_usd'],
                'estado' => $fr['estado'],
                'estadoDespacho' => $fr['estado_despacho'] ?? '',
            ];
            if (!empty($fr['motivo_anulacion'])) $facObj['motivoAnulacion'] = $fr['motivo_anulacion'];
            if (!empty($fr['fecha_anulacion'])) $facObj['fechaAnulacion'] = $fr['fecha_anulacion'];
            $facturas[] = $facObj;
        }

        // 7. Despachos + Incidencias
        $despRows = $pdo->query(
            'SELECT d.id, d.codigo_guia, d.numero_factura, f.numero_factura AS fac_rel_num,
                    COALESCE(d.codigo_venta, v.codigo, "") AS ventaId, c.nombre AS cliente, c.rif,
                    m.nombre AS zona, d.conductor_id, d.fecha_guia, d.estado, d.observaciones_mercancia,
                    d.lineas_inv_json, d.stock_descontado
             FROM despachos d
             INNER JOIN clientes c ON c.id = d.cliente_id
             INNER JOIN municipios m ON m.id = d.municipio_id
             LEFT JOIN facturas f ON f.id = d.factura_id
             LEFT JOIN ventas v ON v.id = d.venta_id
             ORDER BY d.id DESC'
        )->fetchAll();
        $incSt = $pdo->prepare('SELECT tipo, motivo, descripcion, fecha_registro, resuelta FROM despacho_incidencias WHERE despacho_id = ? ORDER BY id DESC LIMIT 1');
        $despachos = [];
        foreach ($despRows as $dr) {
            $incSt->execute([(int)$dr['id']]);
            $incRow = $incSt->fetch();
            $facNum = $dr['numero_factura'] ?: ($dr['fac_rel_num'] ?: '');
            $lineasInv = [];
            if (!empty($dr['lineas_inv_json'])) {
                $dec = json_decode((string)$dr['lineas_inv_json'], true);
                if (is_array($dec)) $lineasInv = $dec;
            }
            $obj = [
                'id' => $dr['codigo_guia'],
                'facturaNumero' => $facNum !== '' ? self::normalizarNumeroFAC($facNum, (int)$dr['id']) : '',
                'ventaId' => $dr['ventaId'],
                'cliente' => $dr['cliente'],
                'rif' => $dr['rif'],
                'cond' => max(0, ((int)$dr['conductor_id']) - 1),
                'zona' => $dr['zona'],
                'fecha' => $dr['fecha_guia'],
                'estado' => $dr['estado'],
                'items' => $dr['observaciones_mercancia'] ?? '',
                'lineasInv' => $lineasInv,
                'stockDescontado' => (bool)$dr['stock_descontado'],
            ];
            if ($incRow) {
                $obj['incidencia'] = [
                    'tipo' => $incRow['tipo'],
                    'motivo' => $incRow['motivo'],
                    'desc' => $incRow['descripcion'],
                    'fecha' => $incRow['fecha_registro'],
                    'resuelta' => (bool)$incRow['resuelta'],
                ];
            }
            $despachos[] = $obj;
        }

        // 8. Usuarios (Superadmin)
        $usrRows = $pdo->query(
            'SELECT u.codigo AS id, u.nombre_completo AS nombre, u.username,
                    COALESCE(NULLIF(u.clave_visible, ""), "1234") AS password,
                    r.nombre AS rol, u.ruta_asignada AS ruta, u.email, u.telefono, u.estado
             FROM usuarios u
             INNER JOIN roles r ON r.id = u.rol_id
             ORDER BY u.id ASC'
        )->fetchAll();

        // 9. Tasa BCV más reciente
        $tasaRow = $pdo->query('SELECT fecha_valor, tasa_usd_bs, tasa_exacta, fecha_bcv_texto, consultado_el, verificacion_dia, fuente FROM tasas_bcv ORDER BY fecha_valor DESC, id DESC LIMIT 1')->fetch();
        $tasaValor = $tasaRow ? (float)$tasaRow['tasa_usd_bs'] : 60.50;
        $tasaMeta = $tasaRow ? [
            'tasa' => (float)$tasaRow['tasa_usd_bs'],
            'tasaExacta' => (float)$tasaRow['tasa_exacta'],
            'fechaBCV' => $tasaRow['fecha_bcv_texto'] ?: $tasaRow['fecha_valor'],
            'consultadoEl' => $tasaRow['consultado_el'] ?: date('c'),
            'verificacionDia' => $tasaRow['verificacion_dia'] ?: $tasaRow['fecha_valor'],
            'fuente' => $tasaRow['fuente'],
        ] : null;

        return [
            'conectado' => true,
            'gs_clientes_v1' => $clientesSql,
            'gs_inventario_v1' => $inventario,
            'gs_movimientos_inv_v1' => $movimientos,
            'gs_ventas_v2' => $ventas,
            'gs_pagos_v2' => $pagos,
            'gs_facturas_v1' => $facturas,
            'gs_despachos_v1' => $despachos,
            'gs_usuarios_v1' => $usrRows,
            'gs_tasa_bcv' => (string)$tasaValor,
            'gs_tasa_bcv_meta' => $tasaMeta,
        ];
    }

    /**
     * Sincroniza una clave operativa enviada desde el frontend hacia las tablas relacionales de MySQL.
     */
    public static function sincronizarClave(PDO $pdo, string $key, mixed $value): array {
        if ($key === 'gs_tasa_bcv') {
            $tasa = round((float)$value, 2);
            if ($tasa <= 0) return ['ok' => false, 'mensaje' => 'Tasa BCV inválida'];
            $hoy = date('Y-m-d');
            $st = $pdo->prepare(
                'INSERT INTO tasas_bcv (fecha_valor, tasa_usd_bs, tasa_exacta, fecha_bcv_texto, consultado_el, verificacion_dia, fuente)
                 VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE tasa_usd_bs = VALUES(tasa_usd_bs), tasa_exacta = VALUES(tasa_exacta),
                 consultado_el = VALUES(consultado_el), verificacion_dia = VALUES(verificacion_dia)'
            );
            $st->execute([$hoy, $tasa, $tasa, $hoy, date('c'), $hoy, 'https://www.bcv.org.ve/']);
            return ['ok' => true, 'key' => $key];
        }

        if ($key === 'gs_tasa_bcv_meta' && is_array($value)) {
            $tasa = round((float)($value['tasa'] ?? 0), 2);
            if ($tasa <= 0) return ['ok' => false, 'mensaje' => 'Metadatos BCV inválidos'];
            $exacta = (float)($value['tasaExacta'] ?? $tasa);
            $hoy = $value['verificacionDia'] ?? date('Y-m-d');
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$hoy)) $hoy = date('Y-m-d');
            $st = $pdo->prepare(
                'INSERT INTO tasas_bcv (fecha_valor, tasa_usd_bs, tasa_exacta, fecha_bcv_texto, consultado_el, verificacion_dia, fuente)
                 VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE tasa_usd_bs = VALUES(tasa_usd_bs), tasa_exacta = VALUES(tasa_exacta),
                 fecha_bcv_texto = VALUES(fecha_bcv_texto), consultado_el = VALUES(consultado_el),
                 verificacion_dia = VALUES(verificacion_dia), fuente = VALUES(fuente)'
            );
            $st->execute([
                $hoy,
                $tasa,
                $exacta,
                (string)($value['fechaBCV'] ?? $hoy),
                (string)($value['consultadoEl'] ?? date('c')),
                $hoy,
                (string)($value['fuente'] ?? 'https://www.bcv.org.ve/'),
            ]);
            return ['ok' => true, 'key' => $key];
        }

        if (!is_array($value)) {
            return ['ok' => false, 'mensaje' => 'Se esperaba un arreglo JSON para ' . $key];
        }

        $pdo->beginTransaction();
        try {
            switch ($key) {
                case 'gs_clientes_v1':
                    self::syncClientes($pdo, $value);
                    break;
                case 'gs_inventario_v1':
                    self::syncInventario($pdo, $value);
                    break;
                case 'gs_movimientos_inv_v1':
                    self::syncMovimientos($pdo, $value);
                    break;
                case 'gs_ventas_v2':
                    self::syncVentas($pdo, $value);
                    break;
                case 'gs_pagos_v2':
                    self::syncPagos($pdo, $value);
                    break;
                case 'gs_facturas_v1':
                    self::syncFacturas($pdo, $value);
                    break;
                case 'gs_despachos_v1':
                    self::syncDespachos($pdo, $value);
                    break;
                case 'gs_usuarios_v1':
                    self::syncUsuarios($pdo, $value);
                    break;
                default:
                    $pdo->rollBack();
                    return ['ok' => false, 'mensaje' => 'Clave no reconocida: ' . $key];
            }
            $pdo->commit();
            return ['ok' => true, 'key' => $key];
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            return ['ok' => false, 'mensaje' => $e->getMessage()];
        }
    }

    private static function syncClientes(PDO $pdo, array $clientes): void {
        self::asegurarEsquemaRutas($pdo);
        $stUpsert = $pdo->prepare(
            'INSERT INTO clientes (nombre, tipo_rif, rif, municipio_id, ruta, vendedor_id, contacto, telefono, email, direccion, activo)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               nombre = VALUES(nombre), tipo_rif = VALUES(tipo_rif), municipio_id = VALUES(municipio_id),
               ruta = VALUES(ruta), vendedor_id = VALUES(vendedor_id),
               contacto = VALUES(contacto), telefono = VALUES(telefono), email = VALUES(email),
               direccion = VALUES(direccion), activo = VALUES(activo)'
        );
        $stEnsureRuta = $pdo->prepare('INSERT IGNORE INTO rutas_vendedores (codigo, nombre, descripcion) VALUES (?, ?, ?)');
        foreach ($clientes as $c) {
            if (!is_array($c) || empty($c['nombre'])) continue;
            $rif = preg_replace('/[^VEJGP0-9]/', '', strtoupper((string)($c['rif'] ?? '')));
            if ($rif === '') continue;
            $tipo = preg_match('/^([VEJGP])/', $rif, $m) ? $m[1] : 'J';
            $munId = self::resolverMunicipioId($pdo, (string)($c['zona'] ?? 'Mariño'));
            $ruta = self::normalizarRuta((string)($c['ruta'] ?? ''), self::resolverRutaClienteDefault((string)$c['nombre']));
            $stEnsureRuta->execute([$ruta, $ruta, 'Cartera exclusiva del Vendedor ' . $ruta]);
            $vendId = self::resolverVendedorIdPorRuta($pdo, $ruta);
            $activoInt = (array_key_exists('activo', $c) && ($c['activo'] === false || $c['activo'] === 0 || $c['activo'] === '0')) ? 0 : 1;
            $stUpsert->execute([
                (string)$c['nombre'],
                $tipo,
                $rif,
                $munId,
                $ruta,
                $vendId,
                (string)($c['contacto'] ?? ''),
                (string)($c['telefono'] ?? ''),
                (string)($c['email'] ?? ''),
                (string)($c['direccion'] ?? ''),
                $activoInt,
            ]);
        }
    }

    private static function syncInventario(PDO $pdo, array $items): void {
        $stUpd = $pdo->prepare(
            'UPDATE productos_presentaciones
             SET stock_actual = ?, stock_minimo = ?, ubicacion_almacen = ?, precio_usd = ?
             WHERE codigo = ?'
        );
        foreach ($items as $it) {
            if (!is_array($it) || empty($it['id'])) continue;
            $stUpd->execute([
                (int)($it['stock'] ?? 0),
                (int)($it['stockMin'] ?? 0),
                (string)($it['ubicacion'] ?? ''),
                (float)($it['precio'] ?? 0),
                (string)$it['id'],
            ]);
        }
    }

    private static function syncMovimientos(PDO $pdo, array $movs): void {
        $stUp = $pdo->prepare(
            'INSERT INTO inventario_movimientos (codigo, fecha_movimiento, tipo, referencia, observacion)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               fecha_movimiento = VALUES(fecha_movimiento), tipo = VALUES(tipo),
               referencia = VALUES(referencia), observacion = VALUES(observacion)'
        );
        $stFind = $pdo->prepare('SELECT id FROM inventario_movimientos WHERE codigo = ? LIMIT 1');
        $stDelDet = $pdo->prepare('DELETE FROM inventario_movimiento_detalles WHERE movimiento_id = ?');
        $stInsDet = $pdo->prepare(
            'INSERT INTO inventario_movimiento_detalles (movimiento_id, presentacion_id, codigo_producto, nombre_producto, cantidad, contiene_unidades)
             VALUES (?, ?, ?, ?, ?, ?)'
        );

        foreach ($movs as $mv) {
            if (!is_array($mv) || empty($mv['id'])) continue;
            $tipo = in_array($mv['tipo'] ?? '', ['entrada', 'salida', 'ajuste', 'devolucion'], true) ? $mv['tipo'] : 'ajuste';
            $fecha = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($mv['fecha'] ?? '')) ? $mv['fecha'] : date('Y-m-d');
            $stUp->execute([
                (string)$mv['id'],
                $fecha,
                $tipo,
                (string)($mv['referencia'] ?? 'Movimiento de almacén'),
                (string)($mv['observacion'] ?? ''),
            ]);
            $stFind->execute([(string)$mv['id']]);
            $movId = (int)$stFind->fetchColumn();
            if ($movId <= 0) continue;

            $stDelDet->execute([$movId]);
            foreach ((array)($mv['items'] ?? []) as $it) {
                $codProd = (string)($it['id'] ?? '');
                $pres = self::resolverPresentacion($pdo, $codProd);
                $stInsDet->execute([
                    $movId,
                    $pres ? (int)$pres['id'] : null,
                    $codProd,
                    (string)($it['nombre'] ?? $codProd),
                    max(0, (int)($it['cantidad'] ?? 0)),
                    max(1, (int)($it['contiene'] ?? 1)),
                ]);
            }
        }
    }

    private static function syncVentas(PDO $pdo, array $ventas): void {
        self::asegurarEsquemaRutas($pdo);
        $stUp = $pdo->prepare(
            'INSERT INTO ventas
               (codigo, cliente_id, usuario_id, ruta, fecha_venta, plazo_credito, tasa_bcv_aplicada, total_usd, total_bs,
                estado, estado_despacho, stock_descontado, motivo_anulacion, fecha_anulacion)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               cliente_id = VALUES(cliente_id), usuario_id = VALUES(usuario_id), ruta = VALUES(ruta),
               fecha_venta = VALUES(fecha_venta), plazo_credito = VALUES(plazo_credito),
               tasa_bcv_aplicada = VALUES(tasa_bcv_aplicada), total_usd = VALUES(total_usd),
               total_bs = VALUES(total_bs), estado = VALUES(estado),
               estado_despacho = VALUES(estado_despacho), stock_descontado = VALUES(stock_descontado),
               motivo_anulacion = VALUES(motivo_anulacion), fecha_anulacion = VALUES(fecha_anulacion)'
        );
        $stRutaCli = $pdo->prepare('SELECT ruta FROM clientes WHERE id = ? LIMIT 1');
        $stFind = $pdo->prepare('SELECT id FROM ventas WHERE codigo = ? LIMIT 1');
        $stDelDet = $pdo->prepare('DELETE FROM venta_detalles WHERE venta_id = ?');
        $stInsDet = $pdo->prepare(
            'INSERT INTO venta_detalles (venta_id, presentacion_id, codigo_producto, nombre_producto, cantidad, contiene_unidades, precio_unitario_usd, subtotal_usd)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );

        foreach ($ventas as $v) {
            if (!is_array($v) || empty($v['id'])) continue;
            $rutaRaw = (string)($v['ruta'] ?? '');
            $cliId = self::resolverClienteId($pdo, (string)($v['cliente'] ?? 'Cliente'), '', 'Mariño', '', $rutaRaw !== '' ? $rutaRaw : null);
            $stRutaCli->execute([$cliId]);
            $rutaCliente = (string)($stRutaCli->fetchColumn() ?: 'Ruta 2');
            $rutaVenta = self::normalizarRuta($rutaRaw !== '' ? $rutaRaw : $rutaCliente, $rutaCliente);
            $usuarioId = self::resolverVendedorIdPorRuta($pdo, $rutaVenta);

            $fecha = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($v['fecha'] ?? '')) ? $v['fecha'] : date('Y-m-d');
            $tasa = (float)($v['tasaBcv'] ?? 60.50);
            if ($tasa <= 0) $tasa = 60.50;
            $totalUsd = (float)($v['total'] ?? 0);
            $estado = in_array($v['estado'] ?? '', ['Pendiente', 'Completada', 'Cancelada'], true) ? $v['estado'] : 'Pendiente';
            $anul = is_array($v['anulacion'] ?? null) ? $v['anulacion'] : null;
            $fechaAnul = $anul && preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($anul['fecha'] ?? '')) ? $anul['fecha'] : null;

            $stUp->execute([
                (string)$v['id'],
                $cliId,
                $usuarioId,
                $rutaVenta,
                $fecha,
                (string)($v['credito'] ?? '0'),
                $tasa,
                $totalUsd,
                round($totalUsd * $tasa, 2),
                $estado,
                (string)($v['estadoDespacho'] ?? ''),
                !empty($v['stockDescontado']) ? 1 : 0,
                $anul ? (string)($anul['motivo'] ?? '') : null,
                $fechaAnul,
            ]);

            $stFind->execute([(string)$v['id']]);
            $ventaId = (int)$stFind->fetchColumn();
            if ($ventaId <= 0) continue;

            $stDelDet->execute([$ventaId]);
            foreach ((array)($v['items'] ?? []) as $it) {
                $codProd = (string)($it['id'] ?? '');
                $pres = self::resolverPresentacion($pdo, $codProd);
                $cant = max(1, (int)($it['cantidad'] ?? 1));
                $precio = (float)($it['precio'] ?? 0);
                $stInsDet->execute([
                    $ventaId,
                    $pres ? (int)$pres['id'] : null,
                    $codProd,
                    (string)($it['nombre'] ?? $codProd),
                    $cant,
                    max(1, (int)($it['contiene'] ?? 1)),
                    $precio,
                    round($precio * $cant, 2),
                ]);
            }
        }
    }

    private static function syncPagos(PDO $pdo, array $pagos): void {
        $stFindVenta = $pdo->prepare('SELECT id, cliente_id FROM ventas WHERE codigo = ? LIMIT 1');
        $stUp = $pdo->prepare(
            'INSERT INTO pagos
               (codigo, venta_id, cliente_id, fecha_pago, metodo, banco_codigo, banco_nombre,
                referencia, monto_usd, monto_bs, tasa_bcv, estado, motivo_rechazo, fecha_verificacion)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               venta_id = VALUES(venta_id), cliente_id = VALUES(cliente_id), fecha_pago = VALUES(fecha_pago),
               metodo = VALUES(metodo), banco_codigo = VALUES(banco_codigo), banco_nombre = VALUES(banco_nombre),
               referencia = VALUES(referencia), monto_usd = VALUES(monto_usd), monto_bs = VALUES(monto_bs),
               tasa_bcv = VALUES(tasa_bcv), estado = VALUES(estado), motivo_rechazo = VALUES(motivo_rechazo),
               fecha_verificacion = VALUES(fecha_verificacion)'
        );

        foreach ($pagos as $p) {
            if (!is_array($p) || empty($p['id']) || empty($p['ventaId'])) continue;
            $stFindVenta->execute([(string)$p['ventaId']]);
            $vRow = $stFindVenta->fetch();
            if (!$vRow) continue;

            $cliId = !empty($p['cliente'])
                ? self::resolverClienteId($pdo, (string)$p['cliente'])
                : (int)$vRow['cliente_id'];
            $fecha = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($p['fecha'] ?? '')) ? $p['fecha'] : date('Y-m-d');
            $tasa = (float)($p['tasa'] ?? 60.50);
            if ($tasa <= 0) $tasa = 60.50;
            $montoUsd = (float)($p['monto'] ?? 0);
            $montoBs = isset($p['montoBs']) && (float)$p['montoBs'] > 0 ? (float)$p['montoBs'] : round($montoUsd * $tasa, 2);
            $bancoNombre = (string)($p['banco'] ?? '');
            $bancoCod = self::resolverBancoCodigo($pdo, $bancoNombre);
            $fechaVer = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($p['fechaVerificacion'] ?? '')) ? $p['fechaVerificacion'] : null;

            $stUp->execute([
                (string)$p['id'],
                (int)$vRow['id'],
                $cliId,
                $fecha,
                (string)($p['metodo'] ?? 'Efectivo ($)'),
                $bancoCod,
                $bancoNombre,
                (string)($p['referencia'] ?? ''),
                $montoUsd,
                $montoBs,
                $tasa,
                (string)($p['estado'] ?? 'Por Verificar'),
                !empty($p['motivoRechazo']) ? (string)$p['motivoRechazo'] : null,
                $fechaVer,
            ]);
        }
    }

    private static function syncFacturas(PDO $pdo, array $facturas): void {
        $stFindVenta = $pdo->prepare('SELECT id, cliente_id FROM ventas WHERE codigo = ? LIMIT 1');
        $stUp = $pdo->prepare(
            'INSERT INTO facturas
               (correlativo, numero_factura, numero_control, venta_id, cliente_id, direccion_fiscal,
                fecha_emision, plazo_credito, tasa_bcv, base_imponible_usd, iva_usd, total_usd, total_bs,
                estado, estado_despacho, motivo_anulacion, fecha_anulacion)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               numero_control = VALUES(numero_control), venta_id = VALUES(venta_id), cliente_id = VALUES(cliente_id),
               direccion_fiscal = VALUES(direccion_fiscal), fecha_emision = VALUES(fecha_emision),
               plazo_credito = VALUES(plazo_credito), tasa_bcv = VALUES(tasa_bcv),
               base_imponible_usd = VALUES(base_imponible_usd), iva_usd = VALUES(iva_usd),
               total_usd = VALUES(total_usd), total_bs = VALUES(total_bs), estado = VALUES(estado),
               estado_despacho = VALUES(estado_despacho), motivo_anulacion = VALUES(motivo_anulacion),
               fecha_anulacion = VALUES(fecha_anulacion)'
        );
        $stFindFac = $pdo->prepare('SELECT id FROM facturas WHERE numero_factura = ? LIMIT 1');
        $stDelDet = $pdo->prepare('DELETE FROM factura_detalles WHERE factura_id = ?');
        $stInsDet = $pdo->prepare(
            'INSERT INTO factura_detalles (factura_id, presentacion_id, codigo_producto, descripcion, cantidad, contiene_unidades, precio_unitario_usd, precio_unitario_sin_iva_usd, importe_sin_iva_usd)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        foreach ($facturas as $idx => $f) {
            if (!is_array($f) || empty($f['ventaId'])) continue;
            $stFindVenta->execute([(string)$f['ventaId']]);
            $vRow = $stFindVenta->fetch();
            if (!$vRow) continue;

            $corrBase = max(1, (int)($f['correlativo'] ?? ($idx + 1)));
            $numFAC = self::normalizarNumeroFAC((string)($f['numero'] ?? ''), $corrBase);
            $corr = self::extraerCorrelativoFAC($numFAC, $corrBase);
            $ctrl = self::normalizarNumeroControl((string)($f['control'] ?? ''), $corr);

            $cliId = self::resolverClienteId(
                $pdo,
                (string)($f['cliente'] ?? 'Cliente'),
                (string)($f['rif'] ?? ''),
                'Mariño',
                (string)($f['direccion'] ?? '')
            );
            $fecha = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($f['fecha'] ?? '')) ? $f['fecha'] : date('Y-m-d');
            $tasa = (float)($f['tasa'] ?? 60.50);
            if ($tasa <= 0) $tasa = 60.50;
            $totalUsd = (float)($f['total'] ?? 0);
            $baseUsd = isset($f['base']) ? (float)$f['base'] : round($totalUsd / 1.16, 2);
            $ivaUsd = isset($f['iva']) ? (float)$f['iva'] : round($totalUsd - $baseUsd, 2);
            $estado = ($f['estado'] ?? '') === 'Anulada' ? 'Anulada' : 'Emitida';
            $fechaAnul = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($f['fechaAnulacion'] ?? '')) ? $f['fechaAnulacion'] : null;

            $stUp->execute([
                $corr,
                $numFAC,
                $ctrl,
                (int)$vRow['id'],
                $cliId,
                (string)($f['direccion'] ?? ''),
                $fecha,
                (string)($f['credito'] ?? '0'),
                $tasa,
                $baseUsd,
                $ivaUsd,
                $totalUsd,
                round($totalUsd * $tasa, 2),
                $estado,
                (string)($f['estadoDespacho'] ?? ''),
                !empty($f['motivoAnulacion']) ? (string)$f['motivoAnulacion'] : null,
                $fechaAnul,
            ]);

            $stFindFac->execute([$numFAC]);
            $facId = (int)$stFindFac->fetchColumn();
            if ($facId <= 0) continue;

            $stDelDet->execute([$facId]);
            foreach ((array)($f['items'] ?? []) as $it) {
                $codProd = (string)($it['id'] ?? '');
                $pres = self::resolverPresentacion($pdo, $codProd);
                $cant = max(1, (int)($it['cantidad'] ?? 1));
                $precio = (float)($it['precio'] ?? 0);
                $puSinIva = round($precio / 1.16, 4);
                $stInsDet->execute([
                    $facId,
                    $pres ? (int)$pres['id'] : null,
                    $codProd,
                    (string)($it['nombre'] ?? $codProd),
                    $cant,
                    max(1, (int)($it['contiene'] ?? 1)),
                    $precio,
                    $puSinIva,
                    round($puSinIva * $cant, 2),
                ]);
            }
        }
    }

    private static function syncDespachos(PDO $pdo, array $despachos): void {
        $stFindFac = $pdo->prepare('SELECT id, venta_id FROM facturas WHERE numero_factura = ? LIMIT 1');
        $stFindVenta = $pdo->prepare('SELECT id FROM ventas WHERE codigo = ? LIMIT 1');
        $stUp = $pdo->prepare(
            'INSERT INTO despachos
               (codigo_guia, factura_id, numero_factura, venta_id, codigo_venta, cliente_id,
                municipio_id, conductor_id, fecha_guia, estado, observaciones_mercancia,
                lineas_inv_json, stock_descontado)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               factura_id = VALUES(factura_id), numero_factura = VALUES(numero_factura),
               venta_id = VALUES(venta_id), codigo_venta = VALUES(codigo_venta),
               cliente_id = VALUES(cliente_id), municipio_id = VALUES(municipio_id),
               conductor_id = VALUES(conductor_id), fecha_guia = VALUES(fecha_guia),
               estado = VALUES(estado), observaciones_mercancia = VALUES(observaciones_mercancia),
               lineas_inv_json = VALUES(lineas_inv_json), stock_descontado = VALUES(stock_descontado)'
        );
        $stFindDesp = $pdo->prepare('SELECT id FROM despachos WHERE codigo_guia = ? LIMIT 1');
        $stDelInc = $pdo->prepare('DELETE FROM despacho_incidencias WHERE despacho_id = ?');
        $stInsInc = $pdo->prepare(
            'INSERT INTO despacho_incidencias (despacho_id, tipo, motivo, descripcion, fecha_registro, resuelta)
             VALUES (?, ?, ?, ?, ?, ?)'
        );

        foreach ($despachos as $o) {
            if (!is_array($o) || empty($o['id'])) continue;
            $facNumRaw = trim((string)($o['facturaNumero'] ?? ''));
            $facNum = $facNumRaw !== '' ? self::normalizarNumeroFAC($facNumRaw, 1) : '';
            $facId = null;
            $ventaId = null;

            if ($facNum !== '') {
                $stFindFac->execute([$facNum]);
                if ($fr = $stFindFac->fetch()) {
                    $facId = (int)$fr['id'];
                    $ventaId = (int)$fr['venta_id'];
                }
            }
            $codVenta = trim((string)($o['ventaId'] ?? ''));
            if ($ventaId === null && $codVenta !== '') {
                $stFindVenta->execute([$codVenta]);
                if ($vr = $stFindVenta->fetch()) {
                    $ventaId = (int)$vr['id'];
                }
            }

            $zona = trim((string)($o['zona'] ?? 'Mariño'));
            $cliId = self::resolverClienteId($pdo, (string)($o['cliente'] ?? 'Cliente'), (string)($o['rif'] ?? ''), $zona);
            $munId = self::resolverMunicipioId($pdo, $zona);
            $condId = max(1, min(4, ((int)($o['cond'] ?? 0)) + 1));
            $fecha = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($o['fecha'] ?? '')) ? $o['fecha'] : date('Y-m-d');
            $est = in_array($o['estado'] ?? '', ['En Preparación', 'Completo', 'Con Incidencia'], true) ? $o['estado'] : 'En Preparación';
            $lineasJson = !empty($o['lineasInv']) ? json_encode($o['lineasInv'], JSON_UNESCAPED_UNICODE) : null;

            $stUp->execute([
                (string)$o['id'],
                $facId,
                $facNum !== '' ? $facNum : null,
                $ventaId,
                $codVenta !== '' ? $codVenta : null,
                $cliId,
                $munId,
                $condId,
                $fecha,
                $est,
                (string)($o['items'] ?? ''),
                $lineasJson,
                !empty($o['stockDescontado']) ? 1 : 0,
            ]);

            $stFindDesp->execute([(string)$o['id']]);
            $despId = (int)$stFindDesp->fetchColumn();
            if ($despId > 0) {
                $stDelInc->execute([$despId]);
                if (!empty($o['incidencia']) && is_array($o['incidencia'])) {
                    $inc = $o['incidencia'];
                    $tipoInc = ($inc['tipo'] ?? '') === 'transporte' ? 'transporte' : 'cliente';
                    $fechaInc = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($inc['fecha'] ?? '')) ? $inc['fecha'] : $fecha;
                    $stInsInc->execute([
                        $despId,
                        $tipoInc,
                        (string)($inc['motivo'] ?? 'Incidencia en entrega'),
                        (string)($inc['desc'] ?? ''),
                        $fechaInc,
                        !empty($inc['resuelta']) ? 1 : 0,
                    ]);
                }
            }
        }
    }

    private static function syncUsuarios(PDO $pdo, array $usuarios): void {
        $rolesMap = [];
        foreach ($pdo->query('SELECT id, nombre FROM roles')->fetchAll() as $r) {
            $rolesMap[mb_strtolower($r['nombre'])] = (int)$r['id'];
        }
        $stCheck = $pdo->prepare('SELECT id, password_hash, COALESCE(NULLIF(clave_visible, ""), "1234") AS clave_visible FROM usuarios WHERE codigo = ? LIMIT 1');
        $stUp = $pdo->prepare(
            'INSERT INTO usuarios (codigo, nombre_completo, username, email, telefono, password_hash, clave_visible, rol_id, ruta_asignada, estado)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               nombre_completo = VALUES(nombre_completo), username = VALUES(username),
               email = VALUES(email), telefono = VALUES(telefono), password_hash = VALUES(password_hash),
               clave_visible = VALUES(clave_visible), rol_id = VALUES(rol_id), ruta_asignada = VALUES(ruta_asignada), estado = VALUES(estado)'
        );

        $codigosActivos = [];
        foreach ($usuarios as $u) {
            if (!is_array($u) || empty($u['id']) || empty($u['username'])) continue;
            $cod = (string)$u['id'];
            $codigosActivos[] = $cod;
            $stCheck->execute([$cod]);
            $existente = $stCheck->fetch();

            $passVisible = $existente ? (string)$existente['clave_visible'] : '1234';
            $passHash = $existente ? (string)$existente['password_hash'] : password_hash('1234', PASSWORD_BCRYPT);
            if (!empty($u['password'])) {
                $passVisible = (string)$u['password'];
                $passHash = password_hash($passVisible, PASSWORD_BCRYPT);
            }

            $rolNombre = mb_strtolower(trim((string)($u['rol'] ?? 'Vendedor')));
            $rolId = $rolesMap[$rolNombre] ?? 3;
            $estado = ($u['estado'] ?? '') === 'Inactivo' ? 'Inactivo' : 'Activo';
            $rutaRaw = (string)($u['ruta'] ?? '');
            if ($rutaRaw === 'Almacén La Asunción') $rutaRaw = 'Almacén El Piache';
            $rutaUsr = $rolId === 3 ? self::normalizarRuta($rutaRaw) : $rutaRaw;

            $stUp->execute([
                $cod,
                (string)($u['nombre'] ?? $u['username']),
                (string)$u['username'],
                (string)($u['email'] ?? ($u['username'] . '@gentilsupply.com')),
                (string)($u['telefono'] ?? ''),
                $passHash,
                $passVisible,
                $rolId,
                $rutaUsr,
                $estado,
            ]);
        }

        // Eliminar usuarios removidos desde el panel de Superadmin
        if (count($codigosActivos) > 0) {
            $placeholders = implode(',', array_fill(0, count($codigosActivos), '?'));
            $stDel = $pdo->prepare("DELETE FROM usuarios WHERE codigo NOT IN ($placeholders)");
            $stDel->execute($codigosActivos);
        }
    }
}
