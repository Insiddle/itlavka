<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$response = [
    'success' => false,
    'isAuthenticated' => false
];

if (isset($_SESSION['user_id'])) {
    $response = [
        'success' => true,
        'isAuthenticated' => true,
        'user' => [
            'id' => $_SESSION['user_id']
        ]
    ];
}

echo json_encode($response);
?>