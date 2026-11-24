<?php
// API de Conexión en Tiempo Real con el Banco Central de Venezuela (BCV)
// Ubicación: Sistema Gentil Supply 2/API's/tasa_bcv.php
//
// Consulta directamente la página oficial del BCV (https://www.bcv.org.ve/) para extraer
// el tipo de cambio oficial USD/VES (#dolar), con respaldo automático, reinicio diario
// automático a la medianoche (00:00 America/Caracas) y revalidación si la fecha valor
// aún corresponde al día anterior.

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

date_default_timezone_set('America/Caracas');
$cacheFile = __DIR__ . '/cache_tasa_bcv.json';
$diaActual = date('Y-m-d'); // Ciclo diario oficial en hora de Venezuela (UTC-4)
$forzar = isset($_GET['force']) && $_GET['force'] === '1';
$forzarReset = isset($_GET['reset']) && $_GET['reset'] === '1';
const TTL_REVALIDACION_MISMO_DIA_PENDIENTE = 900; // 15 min si aún no se publica la tasa del día

function leerCacheBCV($archivo) {
    if (!file_exists($archivo)) return null;
    $contenido = @file_get_contents($archivo);
    if (!$contenido) return null;
    $data = @json_decode($contenido, true);
    return (is_array($data) && isset($data['tasa']) && (float)$data['tasa'] > 1) ? $data : null;
}

function guardarCacheBCV($archivo, $datos) {
    @file_put_contents($archivo, json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function eliminarCacheBCV($archivo) {
    if (file_exists($archivo)) {
        @unlink($archivo);
    }
}

function normalizarNumeroBCV($raw) {
    $s = trim((string)$raw);
    $s = preg_replace('/[^0-9.,]/', '', $s);
    if ($s === '') return 0.0;
    if (strpos($s, ',') !== false && strpos($s, '.') !== false) {
        if (strrpos($s, ',') > strrpos($s, '.')) {
            $s = str_replace('.', '', $s);
            $s = str_replace(',', '.', $s);
        } else {
            $s = str_replace(',', '', $s);
        }
    } elseif (strpos($s, ',') !== false) {
        $s = str_replace(',', '.', $s);
    }
    return (float)$s;
}

function convertirFechaACaracasISO($fechaRaw, $fallback) {
    $s = trim((string)$fechaRaw);
    if ($s === '') return $fallback;
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $s)) {
        return $s;
    }
    try {
        $dt = new DateTime($s);
        $dt->setTimezone(new DateTimeZone('America/Caracas'));
        return $dt->format('Y-m-d');
    } catch (Exception $e) {
        if (preg_match('/(\d{4}-\d{2}-\d{2})/', $s, $m)) {
            return $m[1];
        }
        return $fallback;
    }
}

function calcularProximaMedianocheCaracas() {
    $tz = new DateTimeZone('America/Caracas');
    $ahora = new DateTime('now', $tz);
    $medianoche = new DateTime('tomorrow 00:00:00', $tz);
    $segundos = max(1, $medianoche->getTimestamp() - $ahora->getTimestamp());
    return [
        'iso' => $medianoche->format(DateTime::ATOM),
        'timestamp' => $medianoche->getTimestamp(),
        'segundosRestantes' => $segundos
    ];
}

function construirRespuestaBCV(array $base, string $diaActual, bool $desdeCache, bool $reiniciadoHoy = false, bool $offlineFallback = false): array {
    $prox = calcularProximaMedianocheCaracas();
    $fechaValor = convertirFechaACaracasISO($base['fechaValor'] ?? $base['fechaBCV'] ?? $diaActual, $diaActual);
    $diaVerificado = (string)($base['diaVerificado'] ?? $base['verificacionDia'] ?? $diaActual);
    $actualizado = (string)($base['actualizado'] ?? $base['consultadoEl'] ?? date('c'));
    $tasa = round((float)$base['tasa'], 2);
    $tasaExacta = (float)($base['tasaExacta'] ?? $tasa);
    $fuente = (string)($base['fuente'] ?? 'https://www.bcv.org.ve/');

    return [
        'ok'                      => (bool)($base['ok'] ?? true),
        'tasa'                    => $tasa,
        'tasaExacta'              => $tasaExacta,
        'fuente'                  => $fuente,
        'fechaValor'              => $fechaValor,
        'fechaBCV'                => $fechaValor,
        'diaVerificado'           => $diaVerificado,
        'verificacionDia'         => $diaVerificado,
        'diaServidor'             => $diaActual,
        'acordeAlDia'             => ($fechaValor >= $diaActual),
        'actualizado'             => $actualizado,
        'consultadoEl'            => $actualizado,
        'timestamp'               => (int)($base['timestamp'] ?? time()),
        'proximaMedianoche'       => $prox['iso'],
        'segundosHastaMedianoche' => $prox['segundosRestantes'],
        'desdeCache'              => $desdeCache,
        'reiniciadoHoy'           => $reiniciadoHoy,
        'offlineFallback'         => $offlineFallback
    ];
}

function peticionHttpBCV($url, $timeout = 7) {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS      => 4,
            CURLOPT_CONNECTTIMEOUT => $timeout,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            CURLOPT_HTTPHEADER     => [
                'Accept: text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
                'Accept-Language: es-VE,es;q=0.9',
                'Cache-Control: no-cache'
            ]
        ]);
        $resp = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($resp !== false && $code >= 200 && $code < 400) {
            return $resp;
        }
    }

    $ctx = stream_context_create([
        'http' => [
            'method'  => 'GET',
            'timeout' => $timeout,
            'header'  => "User-Agent: Mozilla/5.0 (X11; Linux x86_64)\r\nAccept-Language: es-VE,es;q=0.9\r\nCache-Control: no-cache\r\n"
        ],
        'ssl' => [
            'verify_peer'      => false,
            'verify_peer_name' => false
        ]
    ]);
    $resp = @file_get_contents($url, false, $ctx);
    return $resp !== false ? $resp : null;
}

// 1) Extraer directamente del portal oficial del BCV: https://www.bcv.org.ve/
function consultarPortalOficialBCV($diaActual) {
    $html = peticionHttpBCV('https://www.bcv.org.ve/', 7);
    if (!$html) return null;

    if (preg_match('/id=["\']dolar["\'][\s\S]{0,1500}?<strong>\s*([0-9.,\s]+)\s*<\/strong>/i', $html, $m)) {
        $exacta = normalizarNumeroBCV($m[1]);
        $tasa = round($exacta, 2);
        if ($tasa > 1) {
            $fechaValor = $diaActual;
            if (preg_match('/class=["\'][^"\']*date-display-single[^"\']*["\'][^>]*content=["\']([^"\']+)["\']/i', $html, $mf)) {
                $fechaValor = convertirFechaACaracasISO($mf[1], $diaActual);
            } elseif (preg_match('/property=["\']dc:date["\'][^>]*content=["\']([^"\']+)["\']/i', $html, $mf)) {
                $fechaValor = convertirFechaACaracasISO($mf[1], $diaActual);
            }
            return [
                'tasa'       => $tasa,
                'tasaExacta' => $exacta,
                'fuente'     => 'https://www.bcv.org.ve/',
                'fechaValor' => $fechaValor
            ];
        }
    }
    return null;
}

// 2) Respaldo oficial que replica la tasa BCV en caso de mantenimiento o bloqueo SSL del portal BCV
function consultarRespaldoOficialBCV($diaActual) {
    $jsonRaw = peticionHttpBCV('https://ve.dolarapi.com/v1/dolares/oficial', 5);
    if ($jsonRaw) {
        $data = @json_decode($jsonRaw, true);
        if (is_array($data) && isset($data['promedio']) && (float)$data['promedio'] > 1) {
            $exacta = (float)$data['promedio'];
            $fechaValor = isset($data['fechaActualizacion'])
                ? convertirFechaACaracasISO($data['fechaActualizacion'], $diaActual)
                : $diaActual;
            return [
                'tasa'       => round($exacta, 2),
                'tasaExacta' => $exacta,
                'fuente'     => 'BCV Oficial (dolarapi)',
                'fechaValor' => $fechaValor
            ];
        }
    }
    return null;
}

$cache = leerCacheBCV($cacheFile);
$cacheRespaldoOffline = $cache;
$diaCache = $cache ? (string)($cache['diaVerificado'] ?? $cache['verificacionDia'] ?? (isset($cache['actualizado']) ? substr($cache['actualizado'], 0, 10) : '')) : '';
$reiniciadoHoy = false;

// Reinicio automático al cambiar de día (00:00 America/Caracas) o si se solicitó ?reset=1
if ($forzarReset || ($cache && $diaCache !== $diaActual)) {
    eliminarCacheBCV($cacheFile);
    $cache = null;
    $reiniciadoHoy = true;
}

// Si hay caché verificado hoy y no se forzó consulta, validar si ya está acorde al día o dentro del TTL de revalidación
if (!$forzar && !$forzarReset && $cache && $diaCache === $diaActual) {
    $fechaValorCache = convertirFechaACaracasISO($cache['fechaValor'] ?? $cache['fechaBCV'] ?? '', '');
    $acordeAlDia = ($fechaValorCache !== '' && $fechaValorCache >= $diaActual);
    $edadSegundos = isset($cache['timestamp']) ? (time() - (int)$cache['timestamp']) : 999999;

    if ($acordeAlDia || $edadSegundos < TTL_REVALIDACION_MISMO_DIA_PENDIENTE) {
        echo json_encode(
            construirRespuestaBCV($cache, $diaActual, true, false, false),
            JSON_UNESCAPED_UNICODE
        );
        exit;
    }
}

$resultado = consultarPortalOficialBCV($diaActual);
if (!$resultado) {
    $resultado = consultarRespaldoOficialBCV($diaActual);
}

if ($resultado && $resultado['tasa'] > 1) {
    $payload = construirRespuestaBCV([
        'ok'            => true,
        'tasa'          => (float)$resultado['tasa'],
        'tasaExacta'    => (float)$resultado['tasaExacta'],
        'fuente'        => $resultado['fuente'],
        'fechaValor'    => $resultado['fechaValor'],
        'diaVerificado' => $diaActual,
        'actualizado'   => date('c'),
        'timestamp'     => time()
    ], $diaActual, false, $reiniciadoHoy, false);

    guardarCacheBCV($cacheFile, $payload);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

// Si falló la conexión externa pero había caché previo, se entrega como respaldo offline SIN marcar hoy como verificado
if ($cacheRespaldoOffline) {
    $respaldo = $cacheRespaldoOffline;
    $respaldo['fuente'] = preg_replace('/\s*\(caché local\)$/u', '', (string)($respaldo['fuente'] ?? 'https://www.bcv.org.ve/')) . ' (caché local)';
    echo json_encode(
        construirRespuestaBCV($respaldo, $diaActual, true, $reiniciadoHoy, true),
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

// Valor inicial de contingencia si el servidor no tiene salida a internet y no existe caché previo
echo json_encode(
    construirRespuestaBCV([
        'ok'            => false,
        'tasa'          => 60.50,
        'tasaExacta'    => 60.50,
        'fuente'        => 'Contingencia local (sin conexión externa)',
        'fechaValor'    => '',
        'diaVerificado' => '',
        'actualizado'   => date('c')
    ], $diaActual, false, $reiniciadoHoy, true),
    JSON_UNESCAPED_UNICODE
);
