<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

session_start();
error_log('PHPSESSID in logout.php: ' . (session_id() ?: 'Not set'));

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    session_unset();
    session_destroy();
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Logout successful']);
} catch (Exception $e) {
    error_log('Logout Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
?>