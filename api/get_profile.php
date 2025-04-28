<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once 'db.php';

try {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Пользователь не авторизован']);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    $stmt = $pdo->prepare("
        SELECT u.*, a.city, a.street, a.house_number, a.appartment_number, a.postal_code
        FROM users u
        LEFT JOIN addresses a ON u.user_id = a.user_id
        WHERE u.user_id = ?
    ");
    $stmt->execute([$user_id]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userData) {
        http_response_code(404);
        echo json_encode(['error' => 'Пользователь не найден']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'first_name' => $userData['first_name'],
            'last_name' => $userData['last_name'],
            'email' => $userData['email'],
            'phone_number' => $userData['phone_number'],
            'address' => [
                'city' => $userData['city'],
                'street' => $userData['street'],
                'house_number' => $userData['house_number'],
                'appartment_number' => $userData['appartment_number'],
                'postal_code' => $userData['postal_code']
            ]
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера: ' . $e->getMessage()]);
}
?>