-- =============================================================================
-- BASE DE DATOS MYSQL - SISTEMA GENTIL SUPPLY (Distribuidora Gentil Supply, C.A.)
-- Estado Nueva Esparta, Venezuela
-- Adaptada al 100% a todos los módulos del frontend:
--   1. Superadmin y Usuarios (roles, usuarios)
--   2. API BCV (tasas_bcv - verificación diaria a medianoche)
--   3. Ventas (municipios, clientes, ventas, venta_detalles, bancos_venezuela, pagos)
--   4. Facturación y Cobranzas (facturas [formato FAC-XXXXXX], factura_detalles, anulaciones)
--   5. Despacho, Estado de Despacho e Inventario (conductores, despachos,
--      despacho_incidencias, marcas, productos_base, productos_presentaciones,
--      inventario_movimientos, inventario_movimiento_detalles)
--   6. Gerente / Reportes (Vistas SQL para KPIs, rastreo por municipios y ranking)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `gentil_supply`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `gentil_supply`;

SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================================
-- 1. SEGURIDAD, ROLES Y USUARIOS (Módulo de Superadmin)
-- =============================================================================

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(30) NOT NULL,
  `nombre` VARCHAR(60) NOT NULL,
  `descripcion` VARCHAR(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_roles_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(15) NOT NULL COMMENT 'Ej: USR-001',
  `nombre_completo` VARCHAR(120) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `telefono` VARCHAR(25) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `clave_visible` VARCHAR(100) NOT NULL DEFAULT '1234',
  `rol_id` TINYINT UNSIGNED NOT NULL,
  `ruta_asignada` VARCHAR(100) DEFAULT NULL COMMENT 'Ej: Ruta 2, Gerencia General, Almacén',
  `estado` ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
  `ultimo_acceso` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuarios_codigo` (`codigo`),
  UNIQUE KEY `uk_usuarios_username` (`username`),
  KEY `idx_usuarios_rol` (`rol_id`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 2. TASA OFICIAL DEL BCV (Sincronización diaria a medianoche)
-- =============================================================================

DROP TABLE IF EXISTS `tasas_bcv`;
CREATE TABLE `tasas_bcv` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha_valor` DATE NOT NULL COMMENT 'Día calendario verificado a medianoche (00:00)',
  `tasa_usd_bs` DECIMAL(12, 2) NOT NULL COMMENT 'Tasa redondeada a 2 decimales usada en cálculos',
  `tasa_exacta` DECIMAL(14, 4) NOT NULL COMMENT 'Valor exacto publicado por el BCV',
  `fecha_bcv_texto` VARCHAR(40) DEFAULT NULL,
  `consultado_el` VARCHAR(50) DEFAULT NULL,
  `verificacion_dia` DATE DEFAULT NULL,
  `fuente` VARCHAR(150) NOT NULL DEFAULT 'https://www.bcv.org.ve/',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tasas_bcv_fecha` (`fecha_valor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 3. GEOGRAFÍA (MUNICIPIOS DE NUEVA ESPARTA) Y CLIENTES
-- =============================================================================

DROP TABLE IF EXISTS `municipios`;
CREATE TABLE `municipios` (
  `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_municipios_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `rutas_vendedores`;
CREATE TABLE `rutas_vendedores` (
  `codigo` VARCHAR(30) NOT NULL COMMENT 'Identificativo único de ruta comercial: Ruta 2, Ruta 3, Ruta 4, Ruta 5, Ruta 9',
  `nombre` VARCHAR(80) NOT NULL,
  `descripcion` VARCHAR(160) DEFAULT NULL,
  `activa` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(150) NOT NULL,
  `tipo_rif` ENUM('V', 'E', 'J', 'G', 'P') NOT NULL DEFAULT 'J',
  `rif` VARCHAR(20) NOT NULL COMMENT 'Formato sin guiones: Ej J301122334, V12345678',
  `municipio_id` TINYINT UNSIGNED NOT NULL,
  `ruta` VARCHAR(30) NOT NULL DEFAULT 'Ruta 2' COMMENT 'Cartera exclusiva del vendedor: Ruta 2, Ruta 3, Ruta 4, Ruta 5 o Ruta 9',
  `vendedor_id` INT UNSIGNED DEFAULT NULL COMMENT 'Usuario vendedor dueño de este cliente',
  `contacto` VARCHAR(100) DEFAULT NULL,
  `telefono` VARCHAR(25) DEFAULT NULL COMMENT 'Prefijos móviles válidos: 0412, 0422, 0416, 0426, 0414, 0424',
  `email` VARCHAR(120) DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_clientes_rif` (`rif`),
  KEY `idx_clientes_municipio` (`municipio_id`),
  KEY `idx_clientes_ruta` (`ruta`),
  KEY `idx_clientes_vendedor` (`vendedor_id`),
  KEY `idx_clientes_nombre` (`nombre`),
  CONSTRAINT `fk_clientes_municipio` FOREIGN KEY (`municipio_id`) REFERENCES `municipios` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_clientes_ruta` FOREIGN KEY (`ruta`) REFERENCES `rutas_vendedores` (`codigo`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_clientes_vendedor` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 4. CATÁLOGO DE PRODUCTOS E INVENTARIO DE ALMACÉN
-- =============================================================================

DROP TABLE IF EXISTS `marcas`;
CREATE TABLE `marcas` (
  `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `clave` VARCHAR(30) NOT NULL COMMENT 'muchy, puig, fisa',
  `nombre` VARCHAR(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_marcas_clave` (`clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `productos_base`;
CREATE TABLE `productos_base` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo_base` VARCHAR(40) NOT NULL,
  `marca_id` TINYINT UNSIGNED NOT NULL,
  `nombre_base` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_productos_base_codigo` (`codigo_base`),
  KEY `idx_productos_base_marca` (`marca_id`),
  CONSTRAINT `fk_productos_base_marca` FOREIGN KEY (`marca_id`) REFERENCES `marcas` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `productos_presentaciones`;
CREATE TABLE `productos_presentaciones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(50) NOT NULL COMMENT 'Ej: muchy-caja-med, puig-caja-katy',
  `producto_base_id` INT UNSIGNED NOT NULL,
  `marca_id` TINYINT UNSIGNED NOT NULL,
  `pres_key` VARCHAR(30) NOT NULL DEFAULT 'unidad',
  `pres_nombre` VARCHAR(60) NOT NULL DEFAULT 'Unidades Individuales',
  `tipo_empaque` ENUM('Unidad', 'Caja', 'Display', 'Manga', 'Ristra', 'Sobre') NOT NULL,
  `plural` VARCHAR(30) NOT NULL DEFAULT 'unidades',
  `nombre` VARCHAR(150) NOT NULL,
  `contiene_unidades` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `precio_usd` DECIMAL(10, 2) NOT NULL COMMENT 'Precio final con IVA (16%) incluido',
  `stock_actual` INT NOT NULL DEFAULT 0,
  `stock_minimo` INT NOT NULL DEFAULT 0,
  `ubicacion_almacen` VARCHAR(80) DEFAULT NULL COMMENT 'Ej: Pasillo A · Estante 3',
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_presentaciones_codigo` (`codigo`),
  KEY `idx_presentaciones_base` (`producto_base_id`),
  KEY `idx_presentaciones_marca` (`marca_id`),
  CONSTRAINT `fk_presentaciones_base` FOREIGN KEY (`producto_base_id`) REFERENCES `productos_base` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_presentaciones_marca` FOREIGN KEY (`marca_id`) REFERENCES `marcas` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 5. VENTAS Y PEDIDOS (Módulo de Ventas)
-- =============================================================================

DROP TABLE IF EXISTS `ventas`;
CREATE TABLE `ventas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(20) NOT NULL COMMENT 'Ej: V-001',
  `cliente_id` INT UNSIGNED NOT NULL,
  `usuario_id` INT UNSIGNED DEFAULT NULL COMMENT 'Vendedor / Ruta que registró el pedido',
  `ruta` VARCHAR(30) NOT NULL DEFAULT 'Ruta 2' COMMENT 'Ruta comercial asociada a la venta',
  `fecha_venta` DATE NOT NULL,
  `plazo_credito` VARCHAR(20) NOT NULL DEFAULT '0' COMMENT '0, 7, 15, 21+ (días)',
  `tasa_bcv_aplicada` DECIMAL(12, 2) NOT NULL,
  `total_usd` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_bs` DECIMAL(16, 2) NOT NULL DEFAULT 0.00,
  `estado` ENUM('Pendiente', 'Completada', 'Cancelada') NOT NULL DEFAULT 'Pendiente',
  `estado_despacho` VARCHAR(30) NOT NULL DEFAULT '',
  `stock_descontado` TINYINT(1) NOT NULL DEFAULT 0,
  `motivo_anulacion` TEXT DEFAULT NULL,
  `fecha_anulacion` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ventas_codigo` (`codigo`),
  KEY `idx_ventas_cliente` (`cliente_id`),
  KEY `idx_ventas_ruta` (`ruta`),
  KEY `idx_ventas_fecha` (`fecha_venta`),
  KEY `idx_ventas_estado` (`estado`),
  CONSTRAINT `fk_ventas_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_ventas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `venta_detalles`;
CREATE TABLE `venta_detalles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `venta_id` INT UNSIGNED NOT NULL,
  `presentacion_id` INT UNSIGNED DEFAULT NULL,
  `codigo_producto` VARCHAR(50) NOT NULL,
  `nombre_producto` VARCHAR(160) NOT NULL,
  `cantidad` INT UNSIGNED NOT NULL,
  `contiene_unidades` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `unidades_totales` INT UNSIGNED GENERATED ALWAYS AS (`cantidad` * `contiene_unidades`) STORED,
  `precio_unitario_usd` DECIMAL(10, 2) NOT NULL,
  `subtotal_usd` DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_vdet_venta` (`venta_id`),
  KEY `idx_vdet_presentacion` (`presentacion_id`),
  CONSTRAINT `fk_vdet_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_vdet_presentacion` FOREIGN KEY (`presentacion_id`) REFERENCES `productos_presentaciones` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 6. BANCOS DE VENEZUELA Y REGISTRO DE PAGOS / COBRANZAS
-- =============================================================================

DROP TABLE IF EXISTS `bancos_venezuela`;
CREATE TABLE `bancos_venezuela` (
  `codigo` CHAR(4) NOT NULL COMMENT 'Ej: 0102, 0134',
  `nombre` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `pagos`;
CREATE TABLE `pagos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(20) NOT NULL COMMENT 'Ej: P-001',
  `venta_id` INT UNSIGNED NOT NULL,
  `cliente_id` INT UNSIGNED NOT NULL,
  `usuario_registro_id` INT UNSIGNED DEFAULT NULL,
  `fecha_pago` DATE NOT NULL,
  `metodo` VARCHAR(40) NOT NULL,
  `banco_codigo` CHAR(4) DEFAULT NULL,
  `banco_nombre` VARCHAR(120) NOT NULL DEFAULT '',
  `referencia` VARCHAR(40) DEFAULT NULL COMMENT 'Referencia para Pago Móvil y Transferencia',
  `monto_usd` DECIMAL(12, 2) NOT NULL,
  `monto_bs` DECIMAL(16, 2) NOT NULL,
  `tasa_bcv` DECIMAL(12, 2) NOT NULL,
  `estado` VARCHAR(25) NOT NULL DEFAULT 'Por Verificar',
  `usuario_verificacion_id` INT UNSIGNED DEFAULT NULL,
  `motivo_rechazo` TEXT DEFAULT NULL,
  `fecha_verificacion` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pagos_codigo` (`codigo`),
  KEY `idx_pagos_venta` (`venta_id`),
  KEY `idx_pagos_cliente` (`cliente_id`),
  KEY `idx_pagos_estado` (`estado`),
  KEY `idx_pagos_referencia` (`referencia`),
  CONSTRAINT `fk_pagos_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_pagos_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_pagos_banco` FOREIGN KEY (`banco_codigo`) REFERENCES `bancos_venezuela` (`codigo`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_pagos_usr_reg` FOREIGN KEY (`usuario_registro_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_pagos_usr_ver` FOREIGN KEY (`usuario_verificacion_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 7. FACTURACIÓN FISCAL Y ANULACIONES (TODAS CON FORMATO FAC-XXXXXX)
-- =============================================================================

DROP TABLE IF EXISTS `facturas`;
CREATE TABLE `facturas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `correlativo` INT UNSIGNED NOT NULL,
  `numero_factura` VARCHAR(20) NOT NULL COMMENT 'Formato único obligatorio: FAC-000001',
  `numero_control` VARCHAR(20) NOT NULL COMMENT 'Ej: 00-000001',
  `venta_id` INT UNSIGNED NOT NULL,
  `cliente_id` INT UNSIGNED NOT NULL,
  `direccion_fiscal` VARCHAR(255) DEFAULT NULL,
  `usuario_emision_id` INT UNSIGNED DEFAULT NULL,
  `fecha_emision` DATE NOT NULL,
  `plazo_credito` VARCHAR(20) NOT NULL DEFAULT '0',
  `tasa_bcv` DECIMAL(12, 2) NOT NULL,
  `base_imponible_usd` DECIMAL(12, 2) NOT NULL,
  `iva_usd` DECIMAL(12, 2) NOT NULL,
  `total_usd` DECIMAL(12, 2) NOT NULL,
  `total_bs` DECIMAL(16, 2) NOT NULL,
  `estado` ENUM('Emitida', 'Anulada') NOT NULL DEFAULT 'Emitida',
  `estado_despacho` VARCHAR(30) NOT NULL DEFAULT '',
  `motivo_anulacion` TEXT DEFAULT NULL,
  `fecha_anulacion` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_facturas_numero` (`numero_factura`),
  UNIQUE KEY `uk_facturas_control` (`numero_control`),
  KEY `idx_facturas_venta` (`venta_id`),
  KEY `idx_facturas_cliente` (`cliente_id`),
  KEY `idx_facturas_fecha` (`fecha_emision`),
  CONSTRAINT `fk_facturas_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_facturas_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_facturas_usuario` FOREIGN KEY (`usuario_emision_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `factura_detalles`;
CREATE TABLE `factura_detalles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `factura_id` INT UNSIGNED NOT NULL,
  `presentacion_id` INT UNSIGNED DEFAULT NULL,
  `codigo_producto` VARCHAR(50) NOT NULL,
  `descripcion` VARCHAR(160) NOT NULL,
  `cantidad` INT UNSIGNED NOT NULL,
  `contiene_unidades` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `precio_unitario_usd` DECIMAL(10, 2) NOT NULL COMMENT 'Precio con IVA incluido igual que el pedido',
  `precio_unitario_sin_iva_usd` DECIMAL(10, 4) NOT NULL,
  `importe_sin_iva_usd` DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_fdet_factura` (`factura_id`),
  CONSTRAINT `fk_fdet_factura` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_fdet_presentacion` FOREIGN KEY (`presentacion_id`) REFERENCES `productos_presentaciones` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 8. DESPACHO, GUÍAS DE CARGA Y ESTADO DE DESPACHO
-- =============================================================================

DROP TABLE IF EXISTS `conductores`;
CREATE TABLE `conductores` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `vehiculo` VARCHAR(100) NOT NULL,
  `placa` VARCHAR(20) NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_conductores_placa` (`placa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `despachos`;
CREATE TABLE `despachos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo_guia` VARCHAR(20) NOT NULL COMMENT 'Ej: GS-00101',
  `factura_id` INT UNSIGNED DEFAULT NULL,
  `numero_factura` VARCHAR(20) DEFAULT NULL COMMENT 'Formato FAC-XXXXXX',
  `venta_id` INT UNSIGNED DEFAULT NULL,
  `codigo_venta` VARCHAR(20) DEFAULT NULL,
  `cliente_id` INT UNSIGNED NOT NULL,
  `municipio_id` TINYINT UNSIGNED NOT NULL,
  `conductor_id` SMALLINT UNSIGNED NOT NULL,
  `fecha_guia` DATE NOT NULL,
  `estado` ENUM('En Preparación', 'Completo', 'Con Incidencia') NOT NULL DEFAULT 'En Preparación',
  `observaciones_mercancia` TEXT DEFAULT NULL,
  `lineas_inv_json` LONGTEXT DEFAULT NULL,
  `stock_descontado` TINYINT(1) NOT NULL DEFAULT 0,
  `fecha_completado` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_despachos_guia` (`codigo_guia`),
  KEY `idx_despachos_factura` (`factura_id`),
  KEY `idx_despachos_estado` (`estado`),
  KEY `idx_despachos_municipio` (`municipio_id`),
  CONSTRAINT `fk_despachos_factura` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_despachos_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_despachos_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_despachos_municipio` FOREIGN KEY (`municipio_id`) REFERENCES `municipios` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_despachos_conductor` FOREIGN KEY (`conductor_id`) REFERENCES `conductores` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `despacho_incidencias`;
CREATE TABLE `despacho_incidencias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `despacho_id` INT UNSIGNED NOT NULL,
  `tipo` ENUM('cliente', 'transporte') NOT NULL,
  `motivo` VARCHAR(150) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `fecha_registro` DATE NOT NULL,
  `resuelta` TINYINT(1) NOT NULL DEFAULT 0,
  `fecha_resolucion` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inc_despacho` (`despacho_id`),
  CONSTRAINT `fk_inc_despacho` FOREIGN KEY (`despacho_id`) REFERENCES `despachos` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 9. MOVIMIENTOS DE INVENTARIO / KARDEX
-- =============================================================================

DROP TABLE IF EXISTS `inventario_movimientos`;
CREATE TABLE `inventario_movimientos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(20) NOT NULL COMMENT 'Ej: MOV-001',
  `fecha_movimiento` DATE NOT NULL,
  `tipo` ENUM('entrada', 'salida', 'ajuste', 'devolucion') NOT NULL,
  `referencia` VARCHAR(160) NOT NULL,
  `observacion` TEXT DEFAULT NULL,
  `usuario_id` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_inv_mov_codigo` (`codigo`),
  KEY `idx_inv_mov_fecha` (`fecha_movimiento`),
  CONSTRAINT `fk_inv_mov_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `inventario_movimiento_detalles`;
CREATE TABLE `inventario_movimiento_detalles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `movimiento_id` INT UNSIGNED NOT NULL,
  `presentacion_id` INT UNSIGNED DEFAULT NULL,
  `codigo_producto` VARCHAR(50) NOT NULL,
  `nombre_producto` VARCHAR(160) NOT NULL,
  `cantidad` INT UNSIGNED NOT NULL,
  `contiene_unidades` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `unidades_totales` INT UNSIGNED GENERATED ALWAYS AS (`cantidad` * `contiene_unidades`) STORED,
  PRIMARY KEY (`id`),
  KEY `idx_inv_mdet_mov` (`movimiento_id`),
  CONSTRAINT `fk_inv_mdet_mov` FOREIGN KEY (`movimiento_id`) REFERENCES `inventario_movimientos` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_inv_mdet_pres` FOREIGN KEY (`presentacion_id`) REFERENCES `productos_presentaciones` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- 10. VISTAS SQL PARA DASHBOARDS, COBRANZAS, RASTREO Y REPORTES GERENCIALES
-- =============================================================================

CREATE OR REPLACE VIEW `vw_cuentas_por_cobrar` AS
SELECT
  v.id AS venta_id,
  v.codigo AS pedido,
  v.fecha_venta,
  c.nombre AS cliente,
  c.rif,
  c.ruta AS ruta_comercial,
  f.numero_factura,
  v.total_usd,
  COALESCE(SUM(CASE WHEN p.estado IN ('Verificado', 'Completado') THEN p.monto_usd ELSE 0 END), 0) AS pagado_verificado_usd,
  COALESCE(SUM(CASE WHEN p.estado = 'Por Verificar' THEN p.monto_usd ELSE 0 END), 0) AS en_verificacion_usd,
  GREATEST(0, v.total_usd - COALESCE(SUM(CASE WHEN p.estado IN ('Verificado', 'Completado') THEN p.monto_usd ELSE 0 END), 0)) AS saldo_pendiente_usd,
  v.estado AS estado_venta
FROM ventas v
INNER JOIN clientes c ON c.id = v.cliente_id
LEFT JOIN facturas f ON f.venta_id = v.id AND f.estado = 'Emitida'
LEFT JOIN pagos p ON p.venta_id = v.id
WHERE v.estado <> 'Cancelada'
GROUP BY v.id, v.codigo, v.fecha_venta, c.nombre, c.rif, c.ruta, f.numero_factura, v.total_usd, v.estado;

CREATE OR REPLACE VIEW `vw_rastreo_facturas_municipios` AS
SELECT
  f.id AS factura_id,
  f.numero_factura,
  f.numero_control,
  f.fecha_emision,
  f.total_usd,
  f.total_bs,
  f.estado AS estado_factura,
  v.codigo AS codigo_venta,
  v.estado AS estado_venta,
  c.nombre AS cliente,
  c.rif,
  c.ruta AS ruta_comercial,
  m.nombre AS municipio,
  d.codigo_guia,
  d.estado AS estado_despacho
FROM facturas f
INNER JOIN ventas v ON v.id = f.venta_id
INNER JOIN clientes c ON c.id = f.cliente_id
INNER JOIN municipios m ON m.id = c.municipio_id
LEFT JOIN despachos d ON d.factura_id = f.id;

CREATE OR REPLACE VIEW `vw_ranking_productos_unidades` AS
SELECT
  pb.codigo_base,
  pb.nombre_base AS producto,
  ma.nombre AS marca,
  SUM(vd.unidades_totales) AS total_unidades_vendidas,
  SUM(vd.subtotal_usd) AS ingresos_usd
FROM venta_detalles vd
INNER JOIN ventas v ON v.id = vd.venta_id AND v.estado <> 'Cancelada'
INNER JOIN productos_presentaciones pp ON pp.id = vd.presentacion_id
INNER JOIN productos_base pb ON pb.id = pp.producto_base_id
INNER JOIN marcas ma ON ma.id = pb.marca_id
GROUP BY pb.codigo_base, pb.nombre_base, ma.nombre
ORDER BY total_unidades_vendidas DESC;

-- =============================================================================
-- 11. DATOS COMPLETOS INICIALES (SINCRONIZADOS CON TODOS LOS MÓDULOS)
-- =============================================================================

INSERT INTO `roles` (`codigo`, `nombre`, `descripcion`) VALUES
('superadmin', 'Superadmin', 'Control total del sistema y gestión de usuarios'),
('gerente', 'Gerente', 'Supervisión gerencial, rastreo por municipios y reportes categorizados'),
('vendedor', 'Vendedor', 'Generación de pedidos, registro de pagos y gestión de clientes'),
('facturacion', 'Facturación', 'Emisión fiscal de facturas, cobranzas, anulaciones y libro fiscal'),
('despacho', 'Operador de Despacho', 'Guías de carga, estado de despacho e inventario de almacén');

INSERT INTO `rutas_vendedores` (`codigo`, `nombre`, `descripcion`) VALUES
('Ruta 2', 'Ruta 2', 'Cartera exclusiva del Vendedor Ruta 2'),
('Ruta 3', 'Ruta 3', 'Cartera exclusiva del Vendedor Ruta 3'),
('Ruta 4', 'Ruta 4', 'Cartera exclusiva del Vendedor Ruta 4'),
('Ruta 5', 'Ruta 5', 'Cartera exclusiva del Vendedor Ruta 5'),
('Ruta 9', 'Ruta 9', 'Cartera exclusiva del Vendedor Ruta 9');

INSERT INTO `usuarios` (`id`, `codigo`, `nombre_completo`, `username`, `email`, `telefono`, `password_hash`, `clave_visible`, `rol_id`, `ruta_asignada`, `estado`) VALUES
(1, 'USR-001', 'Administrador Maestro', 'superadmin', 'superadmin@gentilsupply.com', '0414-7900001', '$2y$12$4V4qNvMP2ilaJECv1cAFWOWq9FrDqWJpzYLowCpDTzuaTsYAYqJCO', '1234', 1, 'Dirección General', 'Activo'),
(2, 'USR-002', 'Carlos Eduardo Gentil', 'gerente', 'gerencia@gentilsupply.com', '0414-7900002', '$2y$12$4V4qNvMP2ilaJECv1cAFWOWq9FrDqWJpzYLowCpDTzuaTsYAYqJCO', '1234', 2, 'Gerencia General', 'Activo'),
(3, 'USR-003', 'Vendedor Ruta 2', 'ruta2', 'ruta2@gentilsupply.com', '0412-3548810', '$2y$12$4V4qNvMP2ilaJECv1cAFWOWq9FrDqWJpzYLowCpDTzuaTsYAYqJCO', '1234', 3, 'Ruta 2', 'Activo'),
(4, 'USR-004', 'Mariana Salazar', 'facturacion', 'facturacion@gentilsupply.com', '0424-8812200', '$2y$12$4V4qNvMP2ilaJECv1cAFWOWq9FrDqWJpzYLowCpDTzuaTsYAYqJCO', '1234', 4, 'Facturación y Cobranzas', 'Activo'),
(5, 'USR-005', 'José Rodríguez', 'despacho', 'despacho@gentilsupply.com', '0416-6950099', '$2y$12$4V4qNvMP2ilaJECv1cAFWOWq9FrDqWJpzYLowCpDTzuaTsYAYqJCO', '1234', 5, 'Almacén El Piache', 'Activo'),
(6, 'USR-006', 'Vendedor Ruta 3', 'ruta3', 'ruta3@gentilsupply.com', '0412-3548813', '$2y$12$4V4qNvMP2ilaJECv1cAFWOWq9FrDqWJpzYLowCpDTzuaTsYAYqJCO', '1234', 3, 'Ruta 3', 'Activo'),
(7, 'USR-007', 'Vendedor Ruta 4', 'ruta4', 'ruta4@gentilsupply.com', '0414-3548814', '$2y$12$4V4qNvMP2ilaJECv1cAFWOWq9FrDqWJpzYLowCpDTzuaTsYAYqJCO', '1234', 3, 'Ruta 4', 'Activo'),
(8, 'USR-008', 'Vendedor Ruta 5', 'ruta5', 'ruta5@gentilsupply.com', '0416-3548815', '$2y$12$4V4qNvMP2ilaJECv1cAFWOWq9FrDqWJpzYLowCpDTzuaTsYAYqJCO', '1234', 3, 'Ruta 5', 'Activo'),
(9, 'USR-009', 'Vendedor Ruta 9', 'ruta9', 'ruta9@gentilsupply.com', '0424-3548819', '$2y$12$4V4qNvMP2ilaJECv1cAFWOWq9FrDqWJpzYLowCpDTzuaTsYAYqJCO', '1234', 3, 'Ruta 9', 'Activo');

INSERT INTO `tasas_bcv` (`fecha_valor`, `tasa_usd_bs`, `tasa_exacta`, `fecha_bcv_texto`, `consultado_el`, `verificacion_dia`, `fuente`) VALUES
(CURDATE(), 60.50, 60.5000, DATE_FORMAT(CURDATE(), '%Y-%m-%d'), NOW(), CURDATE(), 'https://www.bcv.org.ve/');

INSERT INTO `municipios` (`nombre`) VALUES
('Antolín del Campo'),
('Arismendi'),
('Díaz'),
('García'),
('Gómez'),
('Maneiro'),
('Marcano'),
('Mariño'),
('Península de Macanao'),
('Tubores'),
('Villalba');

INSERT INTO `bancos_venezuela` (`codigo`, `nombre`) VALUES
('0102', 'Banco de Venezuela'),
('0104', 'Banco Venezolano de Crédito'),
('0105', 'Banco Mercantil'),
('0108', 'BBVA Provincial'),
('0114', 'Bancaribe'),
('0115', 'Banco Exterior'),
('0128', 'Banco Caroní'),
('0134', 'Banesco'),
('0137', 'Banco Sofitasa'),
('0138', 'Banco Plaza'),
('0151', 'BFC Banco Fondo Común'),
('0156', '100% Banco'),
('0157', 'DelSur Banco Universal'),
('0163', 'Banco del Tesoro'),
('0168', 'Bancrecer'),
('0169', 'R4 Banco Microfinanciero'),
('0171', 'Banco Activo'),
('0172', 'Bancamiga'),
('0174', 'Banplus'),
('0175', 'Banco Bicentenario'),
('0177', 'BANFANB'),
('0191', 'Banco Nacional de Crédito (BNC)');

INSERT INTO `marcas` (`clave`, `nombre`) VALUES
('muchy', 'Muchy'),
('puig', 'Galleterías PUIG'),
('fisa', 'Fisa');

INSERT INTO `productos_base` (`codigo_base`, `marca_id`, `nombre_base`) VALUES
('muchy-med', 1, 'Muchy Mediano'),
('muchy-xl', 1, 'Muchy XL'),
('muchy-peq', 1, 'Muchy Pequeño'),
('puig-maria', 2, 'Galletas María Delicia'),
('puig-katy', 2, 'Galletas Katy'),
('fisa-crema-20', 3, 'Crema para el Cuerpo 20 ml'),
('fisa-crema-365', 3, 'Crema para el Cuerpo 365 ml'),
('fisa-crema-800', 3, 'Crema para el Cuerpo 800 ml'),
('fisa-jabon', 3, 'Jabón de Baño Every Night'),
('fisa-deo-60', 3, 'Desodorante Every Night 60 g'),
('fisa-deo-90', 3, 'Desodorante Every Night 90 g'),
('fisa-deo-sachet', 3, 'Desodorante Every Night Sachet');

INSERT INTO `productos_presentaciones`
  (`codigo`, `producto_base_id`, `marca_id`, `pres_key`, `pres_nombre`, `tipo_empaque`, `plural`, `nombre`, `contiene_unidades`, `precio_usd`, `stock_actual`, `stock_minimo`, `ubicacion_almacen`)
VALUES
('muchy-u-med', 1, 1, 'unidad', 'Unidades Individuales', 'Unidad', 'unidades', 'Muchy Mediano (Unidad)', 1, 0.60, 120, 30, 'Pasillo A · Estante 1'),
('muchy-caja-med', 1, 1, 'caja', 'Cajas', 'Caja', 'cajas', 'Caja Muchy Mediano', 20, 11.00, 60, 15, 'Pasillo A · Estante 3'),
('muchy-u-xl', 2, 1, 'unidad', 'Unidades Individuales', 'Unidad', 'unidades', 'Muchy XL (Unidad)', 1, 1.00, 95, 25, 'Pasillo A · Estante 1'),
('muchy-caja-xl', 2, 1, 'caja', 'Cajas', 'Caja', 'cajas', 'Caja Muchy XL', 10, 9.00, 38, 10, 'Pasillo A · Estante 3'),
('muchy-manga-peq', 3, 1, 'manga', 'Mangas', 'Manga', 'mangas', 'Manga Muchy Pequeño', 12, 5.00, 45, 12, 'Pasillo A · Estante 2'),
('puig-u-maria', 4, 2, 'unidad', 'Unidades Individuales', 'Unidad', 'unidades', 'María Delicia (Unidad)', 1, 0.50, 150, 40, 'Pasillo B · Estante 1'),
('puig-caja-maria', 4, 2, 'caja', 'Cajas', 'Caja', 'cajas', 'Caja María Delicia', 24, 11.00, 52, 15, 'Pasillo B · Estante 2'),
('puig-disp-maria', 4, 2, 'display', 'Displays', 'Display', 'displays', 'Display María Delicia (pequeño)', 18, 8.50, 28, 10, 'Pasillo B · Estante 3'),
('puig-u-katy', 5, 2, 'unidad', 'Unidades Individuales', 'Unidad', 'unidades', 'Katy (Unidad)', 1, 0.80, 110, 30, 'Pasillo B · Estante 1'),
('puig-caja-katy', 5, 2, 'caja', 'Cajas', 'Caja', 'cajas', 'Caja Katy', 24, 18.00, 40, 12, 'Pasillo B · Estante 2'),
('puig-disp-katy', 5, 2, 'display', 'Displays', 'Display', 'displays', 'Display Katy (grande)', 24, 18.00, 8, 10, 'Pasillo B · Estante 3'),
('fisa-u-crema-20', 6, 3, 'unidad', 'Unidades Individuales', 'Unidad', 'unidades', 'Crema para el Cuerpo 20 ml (Unidad)', 1, 0.80, 85, 20, 'Pasillo C · Estante 1'),
('fisa-caja-crema-20', 6, 3, 'caja', 'Cajas', 'Caja', 'cajas', 'Caja Crema para el Cuerpo 20 ml (12 und)', 12, 9.00, 30, 8, 'Pasillo C · Estante 4'),
('fisa-u-crema-365', 7, 3, 'unidad', 'Unidades Individuales', 'Unidad', 'unidades', 'Crema para el Cuerpo 365 ml (Unidad)', 1, 3.50, 42, 12, 'Pasillo C · Estante 1'),
('fisa-caja-crema-365', 7, 3, 'caja', 'Cajas', 'Caja', 'cajas', 'Caja Crema para el Cuerpo 365 ml (12 und)', 12, 40.00, 18, 6, 'Pasillo C · Estante 4'),
('fisa-u-crema-800', 8, 3, 'unidad', 'Unidades Individuales', 'Unidad', 'unidades', 'Crema para el Cuerpo 800 ml (Unidad)', 1, 6.50, 25, 8, 'Pasillo C · Estante 1'),
('fisa-caja-crema-800', 8, 3, 'caja', 'Cajas', 'Caja', 'cajas', 'Caja Crema para el Cuerpo 800 ml (12 und)', 12, 75.00, 4, 5, 'Pasillo C · Estante 4'),
('fisa-u-jabon', 9, 3, 'unidad', 'Unidades Individuales', 'Unidad', 'unidades', 'Jabón de Baño Every Night (Unidad)', 1, 1.00, 140, 36, 'Pasillo C · Estante 2'),
('fisa-caja-jabon', 9, 3, 'caja', 'Cajas', 'Caja', 'cajas', 'Caja Jabón de Baño Every Night (36 und)', 36, 32.00, 26, 8, 'Pasillo C · Estante 5'),
('fisa-u-deo-60', 10, 3, 'unidad', 'Unidades Individuales', 'Unidad', 'unidades', 'Desodorante Every Night 60 g (Unidad)', 1, 2.00, 64, 18, 'Pasillo C · Estante 2'),
('fisa-caja-deo-60', 10, 3, 'caja', 'Cajas', 'Caja', 'cajas', 'Caja Desodorante Every Night 60 g (12 und)', 12, 22.00, 22, 6, 'Pasillo C · Estante 5'),
('fisa-u-deo-90', 11, 3, 'unidad', 'Unidades Individuales', 'Unidad', 'unidades', 'Desodorante Every Night 90 g (Unidad)', 1, 2.80, 50, 15, 'Pasillo C · Estante 2'),
('fisa-caja-deo-90', 11, 3, 'caja', 'Cajas', 'Caja', 'cajas', 'Caja Desodorante Every Night 90 g (12 und)', 12, 31.00, 7, 8, 'Pasillo C · Estante 5'),
('fisa-u-deo-sachet', 12, 3, 'sachet', 'Ristras y Sobres', 'Sobre', 'sobres', 'Desodorante Every Night Sachet (Sobre)', 1, 0.30, 180, 48, 'Pasillo C · Estante 3'),
('fisa-ristra-deo', 12, 3, 'sachet', 'Ristras y Sobres', 'Ristra', 'ristras', 'Ristra Desodorante Every Night Sachet', 12, 3.20, 55, 15, 'Pasillo C · Estante 3');

INSERT INTO `conductores` (`nombre`, `vehiculo`, `placa`) VALUES
('José Rodríguez', 'Camión NPR', 'AB123CD'),
('Luis Marcano', 'Camión 350', 'AC456EF'),
('Carlos Salazar', 'Furgón Kia', 'AD789GH'),
('Pedro Millán', 'Pickup Hilux', 'AE012IJ');

INSERT INTO `clientes` (`id`, `nombre`, `tipo_rif`, `rif`, `municipio_id`, `ruta`, `vendedor_id`, `contacto`, `telefono`, `email`, `direccion`) VALUES
(1, 'Supermercado Central', 'J', 'J301122334', 8, 'Ruta 2', 3, 'Carlos Mendoza', '0412-555-1234', 'compras@supercentral.com', 'Av. 4 de Mayo, Porlamar, Mpio. Mariño'),
(2, 'Tienda El Ahorro', 'J', 'J294455667', 2, 'Ruta 2', 3, 'María Brito', '0414-998-2211', 'admin@elahorro.com', 'Calle Independencia, La Asunción, Mpio. Arismendi'),
(3, 'Minimarket Express', 'J', 'J317788990', 6, 'Ruta 3', 6, 'Luis Gómez', '0424-881-3300', 'ventas@miniexpress.com', 'Av. Aldonza Manrique, Pampatar, Mpio. Maneiro'),
(4, 'Bodega San José', 'J', 'J289900112', 3, 'Ruta 4', 7, 'José Marín', '0416-772-4410', 'bodegasanjose@correo.com', 'Sector El Espinal, San Juan Bautista, Mpio. Díaz'),
(5, 'Comercial López', 'V', 'V12345678', 7, 'Ruta 5', 8, 'Pedro López', '0414-334-5590', 'comerciallopez@correo.com', 'Calle La Marina, Juan Griego, Mpio. Marcano'),
(6, 'Abastos La Asunción', 'J', 'J298712345', 2, 'Ruta 9', 9, 'Ana Rojas', '0412-660-1188', 'abastosasuncion@correo.com', 'Frente a la Plaza Bolívar, La Asunción, Mpio. Arismendi'),
(7, 'Bodegón Los Pescadores C.A.', 'J', 'J304567123', 8, 'Ruta 2', 3, 'Ramón Díaz', '0424-559-0077', 'lospescadores@correo.com', 'Calle Igualdad, Porlamar, Mpio. Mariño'),
(8, 'Panadería Santa Ana', 'J', 'J123456789', 5, 'Ruta 9', 9, 'Elena Salazar', '0416-220-9944', 'panaderiasantaana@correo.com', 'Calle Principal, Santa Ana, Mpio. Gómez'),
(9, 'Restaurant El Faro', 'J', 'J401258770', 6, 'Ruta 3', 6, 'Marco Antonini', '0414-792-8810', 'gerencia@elfaro.ve', 'Sector La Caranta, Pampatar, Mpio. Maneiro'),
(10, 'Supermercado Juan Griego', 'J', 'J315500981', 7, 'Ruta 5', 8, 'Roberto Marín', '0412-699-4411', 'compras@superjuangriego.com', 'Av. Jesús Rafael Leandro, Juan Griego, Mpio. Marcano'),
(11, 'Abastos San Juan Bautista', 'J', 'J308911245', 3, 'Ruta 4', 7, 'Carmen Velásquez', '0426-890-3321', 'abastossanjuan@correo.com', 'Calle Real, San Juan Bautista, Mpio. Díaz');

INSERT INTO `ventas`
  (`id`, `codigo`, `cliente_id`, `usuario_id`, `ruta`, `fecha_venta`, `plazo_credito`, `tasa_bcv_aplicada`, `total_usd`, `total_bs`, `estado`, `estado_despacho`, `stock_descontado`, `motivo_anulacion`, `fecha_anulacion`)
VALUES
(1, 'V-001', 1, 3, 'Ruta 2', '2026-04-10', '0', 60.50, 960.00, 58080.00, 'Completada', 'Sin estado', 1, NULL, NULL),
(2, 'V-002', 2, 3, 'Ruta 2', '2026-04-09', '15', 60.50, 415.00, 25107.50, 'Pendiente', '', 1, NULL, NULL),
(3, 'V-003', 3, 6, 'Ruta 3', '2026-04-08', '0', 60.50, 488.00, 29524.00, 'Completada', 'En Preparación', 1, NULL, NULL),
(4, 'V-004', 4, 7, 'Ruta 4', '2026-04-08', '21+', 60.50, 357.00, 21598.50, 'Completada', 'Completo', 1, NULL, NULL),
(5, 'V-005', 5, 8, 'Ruta 5', '2026-04-07', '15', 60.50, 490.00, 29645.00, 'Cancelada', '', 0, 'El cliente canceló el pedido antes del despacho.', '2026-04-07'),
(6, 'V-006', 9, 6, 'Ruta 3', '2026-04-08', '0', 60.50, 362.50, 21931.25, 'Completada', 'Completo', 1, NULL, NULL),
(7, 'V-007', 10, 8, 'Ruta 5', '2026-04-08', '7', 60.50, 289.00, 17484.50, 'Completada', 'Con Incidencia', 1, NULL, NULL);

INSERT INTO `venta_detalles` (`venta_id`, `presentacion_id`, `codigo_producto`, `nombre_producto`, `cantidad`, `contiene_unidades`, `precio_unitario_usd`, `subtotal_usd`) VALUES
(1, 2, 'muchy-caja-med', 'Caja Muchy Mediano', 40, 20, 11.00, 440.00),
(1, 10, 'puig-caja-katy', 'Caja Katy', 20, 24, 18.00, 360.00),
(1, 19, 'fisa-caja-jabon', 'Caja Jabón de Baño Every Night (36 und)', 5, 36, 32.00, 160.00),
(2, 8, 'puig-disp-maria', 'Display María Delicia (pequeño)', 30, 18, 8.50, 255.00),
(2, 15, 'fisa-caja-crema-365', 'Caja Crema para el Cuerpo 365 ml (12 und)', 4, 12, 40.00, 160.00),
(3, 5, 'muchy-manga-peq', 'Manga Muchy Pequeño', 50, 12, 5.00, 250.00),
(3, 25, 'fisa-ristra-deo', 'Ristra Desodorante Every Night Sachet', 40, 12, 3.20, 128.00),
(3, 7, 'puig-caja-maria', 'Caja María Delicia', 10, 24, 11.00, 110.00),
(4, 4, 'muchy-caja-xl', 'Caja Muchy XL', 25, 10, 9.00, 225.00),
(4, 21, 'fisa-caja-deo-60', 'Caja Desodorante Every Night 60 g (12 und)', 6, 12, 22.00, 132.00),
(5, 10, 'puig-caja-katy', 'Caja Katy', 15, 24, 18.00, 270.00),
(5, 2, 'muchy-caja-med', 'Caja Muchy Mediano', 20, 20, 11.00, 220.00),
(6, 19, 'fisa-caja-jabon', 'Caja Jabón de Baño Every Night (36 und)', 10, 36, 32.00, 320.00),
(6, 8, 'puig-disp-maria', 'Display María Delicia (pequeño)', 5, 18, 8.50, 42.50),
(7, 4, 'muchy-caja-xl', 'Caja Muchy XL', 25, 10, 9.00, 225.00),
(7, 25, 'fisa-ristra-deo', 'Ristra Desodorante Every Night Sachet', 20, 12, 3.20, 64.00);

INSERT INTO `pagos`
  (`codigo`, `venta_id`, `cliente_id`, `usuario_registro_id`, `fecha_pago`, `metodo`, `banco_codigo`, `banco_nombre`, `referencia`, `monto_usd`, `monto_bs`, `tasa_bcv`, `estado`)
VALUES
('P-001', 1, 1, 3, '2026-04-10', 'Transferencia', '0134', '0134-Banesco', '884213', 960.00, 58080.00, 60.50, 'Completado'),
('P-002', 3, 3, 6, '2026-04-08', 'Pago Móvil', '0102', '0102-Banco de Venezuela', '550931', 488.00, 29524.00, 60.50, 'Completado'),
('P-003', 4, 4, 7, '2026-04-08', 'Efectivo ($)', NULL, '', '', 357.00, 21598.50, 60.50, 'Completado'),
('P-004', 2, 2, 3, '2026-04-09', 'Pago Móvil', '0105', '0105-Banco Mercantil', '771234', 50.00, 3025.00, 60.50, 'Por Verificar'),
('P-005', 6, 9, 6, '2026-04-08', 'Efectivo ($)', NULL, '', '', 362.50, 21931.25, 60.50, 'Completado'),
('P-006', 7, 10, 8, '2026-04-08', 'Transferencia', '0134', '0134-Banesco', '912045', 289.00, 17484.50, 60.50, 'Completado');

INSERT INTO `facturas`
  (`id`, `correlativo`, `numero_factura`, `numero_control`, `venta_id`, `cliente_id`, `direccion_fiscal`, `usuario_emision_id`, `fecha_emision`, `plazo_credito`, `tasa_bcv`, `base_imponible_usd`, `iva_usd`, `total_usd`, `total_bs`, `estado`, `estado_despacho`)
VALUES
(1, 1, 'FAC-000001', '00-000001', 1, 1, 'Av. 4 de Mayo, Porlamar, Mpio. Mariño', 4, '2026-04-10', '0', 60.50, 827.59, 132.41, 960.00, 58080.00, 'Emitida', ''),
(2, 2, 'FAC-000002', '00-000002', 3, 3, 'Av. Aldonza Manrique, Pampatar, Mpio. Maneiro', 4, '2026-04-08', '0', 60.50, 420.69, 67.31, 488.00, 29524.00, 'Emitida', 'En Preparación'),
(3, 3, 'FAC-000003', '00-000003', 4, 4, 'Sector El Espinal, San Juan Bautista, Mpio. Díaz', 4, '2026-04-08', '21+', 60.50, 307.76, 49.24, 357.00, 21598.50, 'Emitida', 'Completo'),
(4, 4, 'FAC-000004', '00-000004', 6, 9, 'Sector La Caranta, Pampatar, Mpio. Maneiro', 4, '2026-04-08', '0', 60.50, 312.50, 50.00, 362.50, 21931.25, 'Emitida', 'Completo'),
(5, 5, 'FAC-000005', '00-000005', 7, 10, 'Av. Jesús Rafael Leandro, Juan Griego, Mpio. Marcano', 4, '2026-04-08', '7', 60.50, 249.14, 39.86, 289.00, 17484.50, 'Emitida', 'Con Incidencia');

INSERT INTO `factura_detalles` (`factura_id`, `presentacion_id`, `codigo_producto`, `descripcion`, `cantidad`, `contiene_unidades`, `precio_unitario_usd`, `precio_unitario_sin_iva_usd`, `importe_sin_iva_usd`) VALUES
(1, 2, 'muchy-caja-med', 'Caja Muchy Mediano', 40, 20, 11.00, 9.4828, 379.31),
(1, 10, 'puig-caja-katy', 'Caja Katy', 20, 24, 18.00, 15.5172, 310.34),
(1, 19, 'fisa-caja-jabon', 'Caja Jabón de Baño Every Night (36 und)', 5, 36, 32.00, 27.5862, 137.93),
(2, 5, 'muchy-manga-peq', 'Manga Muchy Pequeño', 50, 12, 5.00, 4.3103, 215.52),
(2, 25, 'fisa-ristra-deo', 'Ristra Desodorante Every Night Sachet', 40, 12, 3.20, 2.7586, 110.34),
(2, 7, 'puig-caja-maria', 'Caja María Delicia', 10, 24, 11.00, 9.4828, 94.83),
(3, 4, 'muchy-caja-xl', 'Caja Muchy XL', 25, 10, 9.00, 7.7586, 193.97),
(3, 21, 'fisa-caja-deo-60', 'Caja Desodorante Every Night 60 g (12 und)', 6, 12, 22.00, 18.9655, 113.79),
(4, 19, 'fisa-caja-jabon', 'Caja Jabón de Baño Every Night (36 und)', 10, 36, 32.00, 27.5862, 275.86),
(4, 8, 'puig-disp-maria', 'Display María Delicia (pequeño)', 5, 18, 8.50, 7.3276, 36.64),
(5, 4, 'muchy-caja-xl', 'Caja Muchy XL', 25, 10, 9.00, 7.7586, 193.97),
(5, 25, 'fisa-ristra-deo', 'Ristra Desodorante Every Night Sachet', 20, 12, 3.20, 2.7586, 55.17);

INSERT INTO `despachos`
  (`id`, `codigo_guia`, `factura_id`, `numero_factura`, `venta_id`, `codigo_venta`, `cliente_id`, `municipio_id`, `conductor_id`, `fecha_guia`, `estado`, `observaciones_mercancia`, `lineas_inv_json`, `stock_descontado`)
VALUES
(1, 'GS-00101', 2, 'FAC-000002', 3, 'V-003', 3, 6, 1, CURDATE(), 'En Preparación', '50 Manga Muchy Pequeño (600 uds), 40 Ristra Desodorante Every Night Sachet (480 uds), 10 Caja María Delicia (240 uds)', '[{"id":"muchy-manga-peq","nombre":"Manga Muchy Pequeño","cantidad":50,"contiene":12},{"id":"fisa-ristra-deo","nombre":"Ristra Desodorante Every Night Sachet","cantidad":40,"contiene":12},{"id":"puig-caja-maria","nombre":"Caja María Delicia","cantidad":10,"contiene":24}]', 0),
(2, 'GS-00102', 3, 'FAC-000003', 4, 'V-004', 4, 3, 2, CURDATE(), 'Completo', '25 Caja Muchy XL (250 uds), 6 Caja Desodorante Every Night 60 g (72 uds)', '[{"id":"muchy-caja-xl","nombre":"Caja Muchy XL","cantidad":25,"contiene":10},{"id":"fisa-caja-deo-60","nombre":"Caja Desodorante Every Night 60 g (12 und)","cantidad":6,"contiene":12}]', 1),
(3, 'GS-00103', 4, 'FAC-000004', 6, 'V-006', 9, 6, 3, CURDATE(), 'Completo', '10 Caja Jabón de Baño Every Night (360 uds), 5 Display María Delicia (90 uds)', '[{"id":"fisa-caja-jabon","nombre":"Caja Jabón de Baño Every Night (36 und)","cantidad":10,"contiene":36},{"id":"puig-disp-maria","nombre":"Display María Delicia (pequeño)","cantidad":5,"contiene":18}]', 1),
(4, 'GS-00104', 5, 'FAC-000005', 7, 'V-007', 10, 7, 4, CURDATE(), 'Con Incidencia', '25 Caja Muchy XL (250 uds), 20 Ristra Desodorante Every Night Sachet (240 uds)', '[{"id":"muchy-caja-xl","nombre":"Caja Muchy XL","cantidad":25,"contiene":10},{"id":"fisa-ristra-deo","nombre":"Ristra Desodorante Every Night Sachet","cantidad":20,"contiene":12}]', 0);

INSERT INTO `despacho_incidencias` (`despacho_id`, `tipo`, `motivo`, `descripcion`, `fecha_registro`, `resuelta`) VALUES
(4, 'transporte', 'Avería del vehículo', 'Falla de caja en la vía a Juan Griego.', CURDATE(), 0);

INSERT INTO `inventario_movimientos` (`id`, `codigo`, `fecha_movimiento`, `tipo`, `referencia`, `observacion`, `usuario_id`) VALUES
(1, 'MOV-001', CURDATE(), 'entrada', 'Recepción Planta #401', 'Abastecimiento inicial de almacén central (Muchy y PUIG)', 5),
(2, 'MOV-002', CURDATE(), 'salida', 'Guía GS-00103 · Restaurant El Faro', 'Salida autorizada a ruta Pampatar', 5),
(3, 'MOV-003', CURDATE(), 'entrada', 'Recepción Fisa #119', 'Ingreso de línea de cuidado personal Every Night', 5);

INSERT INTO `inventario_movimiento_detalles` (`movimiento_id`, `presentacion_id`, `codigo_producto`, `nombre_producto`, `cantidad`, `contiene_unidades`) VALUES
(1, 2, 'muchy-caja-med', 'Caja Muchy Mediano', 40, 20),
(1, 7, 'puig-caja-maria', 'Caja María Delicia', 30, 24),
(2, 19, 'fisa-caja-jabon', 'Caja Jabón de Baño Every Night (36 und)', 10, 36),
(2, 8, 'puig-disp-maria', 'Display María Delicia (pequeño)', 5, 18),
(3, 25, 'fisa-ristra-deo', 'Ristra Desodorante Every Night Sachet', 35, 12),
(3, 15, 'fisa-caja-crema-365', 'Caja Crema para el Cuerpo 365 ml (12 und)', 12, 12);
