<?php
// API de Conexión en Tiempo Real con el Banco Central de Venezuela (BCV)
// Ubicación: Sistema Gentil Supply 2/API's/tasa_bcv.php
//
// Consulta directamente la página oficial del BCV (https://www.bcv.org.ve/) para extraer
// el tipo de cambio oficial USD/VES (#dolar), con respaldo automático y caché local para
// mantener todo el sistema Gentil Supply actualizado con la tasa oficial vigente del BCV.

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

date_default_timezone_set('America/Caracas');
$cacheFile = __DIR__ . '/cache_tasa_bcv.json';
$diaActual = date('Y-m-d'); // Se renueva automáticamente cada medianoche (00:00)
$forzar = isset($_GET['force']) && $_GET['force'] === '1';

function leerCacheBCV($archivo) {
    if (!file_exists($archivo)) return null;
    $contenido = @file_get_contents($archivo);
    if (!$contenido) return null;
    $data = @json_decode($contenido, true);
    return (is_array($data) && isset($data['tasa']) && $data['tasa'] > 0) ? $data : null;
}

function guardarCacheBCV($archivo, $datos) {
    @file_put_contents($archivo, json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
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
                'Accept-Language: es-VE,es;q=0.9'
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
            'header'  => "User-Agent: Mozilla/5.0 (X11; Linux x86_64)\r\nAccept-Language: es-VE,es;q=0.9\r\n"
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
function consultarPortalOficialBCV() {
    $html = peticionHttpBCV('https://www.bcv.org.ve/', 7);
    if (!$html) return null;

    // Buscar el bloque id="dolar" que contiene el valor oficial del USD en bcv.org.ve
    if (preg_match('/id=["\']dolar["\'][\s\S]{0,600}?<strong>\s*([0-9]+(?:[.,][0-9]+)?)\s*<\/strong>/i', $html, $m)) {
        $normalizado = str_replace(',', '.', trim($m[1]));
        $tasa = round((float)$normalizado, 2);
        if ($tasa > 1) {
            $fechaValor = date('Y-m-d');
            if (preg_match('/property=["\']dc:date["\'][^>]*content=["\']([0-9]{4}-[0-9]{2}-[0-9]{2})/i', $html, $mf)) {
                $fechaValor = $mf[1];
            }
            return [
                'tasa'       => $tasa,
                'tasaExacta' => (float)$normalizado,
                'fuente'     => 'https://www.bcv.org.ve/',
                'fechaValor' => $fechaValor
            ];
        }
    }
    return null;
}

// 2) Respaldo oficial que replica la tasa BCV en caso de mantenimiento o bloqueo SSL del portal BCV
function consultarRespaldoOficialBCV() {
    $jsonRaw = peticionHttpBCV('https://ve.dolarapi.com/v1/dolares/oficial', 5);
    if ($jsonRaw) {
        $data = @json_decode($jsonRaw, true);
        if (is_array($data) && isset($data['promedio']) && (float)$data['promedio'] > 1) {
            $exacta = (float)$data['promedio'];
            return [
                'tasa'       => round($exacta, 2),
                'tasaExacta' => $exacta,
                'fuente'     => 'BCV Oficial (dolarapi)',
                'fechaValor' => isset($data['fechaActualizacion']) ? substr($data['fechaActualizacion'], 0, 10) : date('Y-m-d')
            ];
        }
    }
    return null;
}

$cache = leerCacheBCV($cacheFile);
$diaCache = $cache['diaVerificado'] ?? (isset($cache['actualizado']) ? substr($cache['actualizado'], 0, 10) : '');
if (!$forzar && $cache && $diaCache === $diaActual) {
    echo json_encode([
        'ok'            => true,
        'tasa'          => (float)$cache['tasa'],
        'tasaExacta'    => (float)($cache['tasaExacta'] ?? $cache['tasa']),
        'fuente'        => $cache['fuente'] ?? 'https://www.bcv.org.ve/',
        'fechaValor'    => $cache['fechaValor'] ?? $diaActual,
        'diaVerificado' => $diaActual,
        'actualizado'   => $cache['actualizado'] ?? date('c'),
        'desdeCache'    => true
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$resultado = consultarPortalOficialBCV();
if (!$resultado) {
    $resultado = consultarRespaldoOficialBCV();
}

if ($resultado && $resultado['tasa'] > 1) {
    $payload = [
        'ok'            => true,
        'tasa'          => (float)$resultado['tasa'],
        'tasaExacta'    => (float)$resultado['tasaExacta'],
        'fuente'        => $resultado['fuente'],
        'fechaValor'    => $resultado['fechaValor'],
        'diaVerificado' => $diaActual,
        'actualizado'   => date('c'),
        'timestamp'     => time(),
        'desdeCache'    => false
    ];
    guardarCacheBCV($cacheFile, $payload);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($cache) {
    echo json_encode([
        'ok'          => true,
        'tasa'        => (float)$cache['tasa'],
        'tasaExacta'  => (float)($cache['tasaExacta'] ?? $cache['tasa']),
        'fuente'      => ($cache['fuente'] ?? 'https://www.bcv.org.ve/') . ' (caché local)',
        'fechaValor'  => $cache['fechaValor'] ?? date('Y-m-d'),
        'actualizado' => $cache['actualizado'] ?? date('c'),
        'desdeCache'  => true
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Valor inicial de contingencia si el servidor no tiene salida a internet en el momento
echo json_encode([
    'ok'          => false,
    'tasa'        => 60.50,
    'tasaExacta'  => 60.50,
    'fuente'      => 'Contingencia local (sin conexión externa)',
    'fechaValor'  => date('Y-m-d'),
    'actualizado' => date('c')
], JSON_UNESCAPED_UNICODE);

