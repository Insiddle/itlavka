<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

require_once 'db.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->prepare("
            SELECT o.order_id, o.user_id, o.order_date, o.total_amount, o.status
            FROM orders o
            WHERE o.user_id = ?
        ");
        $stmt->execute([$_SESSION['user_id']]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($orders) {
            echo json_encode(['success' => true, 'data' => $orders]);
        } else {
            echo json_encode(['success' => true, 'data' => []]);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $stmt = $pdo->prepare("SELECT address_id FROM addresses WHERE user_id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $address = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$address) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Address not found']);
            exit;
        }

        $address_id = $address['address_id'];

        $stmt = $pdo->prepare("
            SELECT product_id, quantity, price
            FROM cart
            WHERE user_id = ?
        ");
        $stmt->execute([$_SESSION['user_id']]);
        $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($cartItems)) {
            throw new Exception('Корзина пуста');
        }

        $totalAmount = 0;
        foreach ($cartItems as $item) {
            $totalAmount += $item['price'] * $item['quantity'];
        }

        $stmt = $pdo->prepare("
            INSERT INTO orders (user_id, address_id, order_date, total_amount, status)
            VALUES (?, ?, NOW(), ?, 'В пути')
        ");
        $stmt->execute([$_SESSION['user_id'], $address_id, $totalAmount]);
        $orderId = $pdo->lastInsertId();

        $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
        $stmt->execute([$_SESSION['user_id']]);

        echo json_encode(['success' => true, 'order_id' => $orderId]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}