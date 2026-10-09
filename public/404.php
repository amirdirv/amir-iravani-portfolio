<?php
// The host's server config overrides `ErrorDocument` in .htaccess and answers
// every missing URL with a bare "404 Not Found". .htaccess therefore routes
// missing paths here: send the prerendered 404 page with a real 404 status.
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache');
header('X-Robots-Tag: noindex');
readfile(__DIR__ . '/404.html');
