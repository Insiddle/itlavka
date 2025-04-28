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
    $data = json_decode(file_get_contents('php://input'), true);

    $requiredFields = ['first_name', 'last_name', 'phone_number', 'address.city', 'address.street', 'address.house_number', 'address.postal_code'];
    foreach ($requiredFields as $field) {
        $value = null;
        if ($field === 'address.city') {
            $value = $data['address']['city'] ?? null;
        } elseif ($field === 'address.street') {
            $value = $data['address']['street'] ?? null;
        } elseif ($field === 'address.house_number') {
            $value = $data['address']['house_number'] ?? null;
        } elseif ($field === 'address.postal_code') {
            $value = $data['address']['postal_code'] ?? null;
        } else {
            $value = $data[$field] ?? null;
        }

        if (empty($value)) {
            http_response_code(400);
            echo json_encode(['error' => "Поле '$field' обязательно"]);
            exit;
        }
    }

    $stmt = $pdo->prepare("
        UPDATE users
        SET first_name = ?, last_name = ?, phone_number = ?
        WHERE user_id = ?
    ");
    $stmt->execute([
        $data['first_name'],
        $data['last_name'],
        $data['phone_number'],
        $user_id
    ]);

    $stmt = $pdo->prepare("
        UPDATE addresses
        SET city = ?, street = ?, house_number = ?, appartment_number = ?, postal_code = ?
        WHERE user_id = ?
    ");
    $stmt->execute([
        $data['address']['city'],
        $data['address']['street'],
        $data['address']['house_number'],
        $data['address']['appartment_number'],
        $data['address']['postal_code'],
        $user_id
    ]);

    echo json_encode(['success' => true, 'message' => 'Профиль успешно обновлен']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера: ' . $e->getMessage()]);
}
?>