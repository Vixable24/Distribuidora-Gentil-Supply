# Base de Datos MySQL — Sistema Gentil Supply

Carpeta con el esquema completo en **MySQL / MariaDB** y su capa de conexión directa vía **PHP PDO** para todo el sistema Gentil Supply (**Ventas**, **Facturación y Cobranzas**, **Despacho e Inventario**, **Administrador / Gerente**, **Superadmin** y **API BCV**).

## Archivos incluidos
- `gentil_supply.sql`: Script completo (`CREATE DATABASE gentil_supply`, 19 tablas relacionales, 3 vistas SQL y todos los datos iniciales con facturas estrictamente en formato `FAC-000001`).
- `conexion.php`: Clase `DatabaseGentilSupply::conectar()` en PHP PDO con inicialización automática si la base de datos aún no existe.
- `repositorio.php`: Mapeador relacional bidireccional MySQL ↔ módulos del sistema (incluyendo normalización automática `FAC-XXXXXX` en todas las facturas).
- `api.php`: Endpoint JSON (`GET ?action=estado`, `POST action=sync_key` y `sync_all`) conectado directamente a MySQL.
- `bootstrap_db.php`: Hidratación directa al cargar cualquier vista `.php` de los módulos.

## Cómo activarla en el servidor local (Apache / MariaDB / XAMPP)
1. Asegúrate de tener habilitada la extensión `pdo_mysql` en `php.ini` (`extension=pdo_mysql`).
2. Inicia el servidor MariaDB / MySQL (por ejemplo `sudo systemctl start mariadb`).
3. Importa `gentil_supply.sql` (o deja que `conexion.php` lo cree automáticamente al abrir cualquier módulo):
   ```bash
   mysql -u root -p < "Base de Datos/gentil_supply.sql"
   ```
4. Si tu servidor MySQL utiliza usuario, puerto o contraseña personalizados, ajusta `conexion.php` o define las variables de entorno `GS_DB_HOST`, `GS_DB_PORT`, `GS_DB_NAME`, `GS_DB_USER` y `GS_DB_PASS`.
