<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    if (!$data || !isset($data['first_name'], $data['last_name'], $data['email'], $data['password'], $data['phone_number'], $data['address'])) {
        echo json_encode(['success' => false, 'error' => 'Некорректные данные']);
        exit;
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO users (first_name, last_name, email, password, phone_number, registration_date)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        $data['first_name'],
        $data['last_name'],
        $data['email'],
        password_hash($data['password'], PASSWORD_DEFAULT),
        $data['phone_number']
    ]);

    $user_id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("
        INSERT INTO addresses (user_id, city, street, house_number, appartment_number, postal_code)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $user_id,
        $data['address']['city'],
        $data['address']['street'],
        $data['address']['house_number'],
        $data['address']['appartment_number'],
        $data['address']['postal_code']
    ]);

    $address_id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("
        UPDATE users
        SET address_id = ?
        WHERE user_id = ?
    ");
    $stmt->execute([$address_id, $user_id]);

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Регистрация успешна']);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'error' => 'Ошибка: ' . $e->getMessage()]);
}
?>