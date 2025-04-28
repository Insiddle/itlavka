<?php
session_start();

header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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
            SELECT c.cart_id, c.product_id, c.quantity, c.price, p.name 
            FROM cart c
            JOIN products p ON c.product_id = p.product_id
            WHERE c.user_id = ?
        ");
        $stmt->execute([$_SESSION['user_id']]);
        $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($cartItems) {
            echo json_encode(['success' => true, 'data' => $cartItems]);
        } else {
            echo json_encode(['success' => true, 'data' => []]);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['product_id'])) {
            $stmt = $pdo->prepare("SELECT price FROM products WHERE product_id = ?");
            $stmt->execute([$data['product_id']]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$product) {
                throw new Exception('Product not found');
            }

            $stmt = $pdo->prepare("
                INSERT INTO cart (user_id, product_id, quantity, price, added_at)
                VALUES (?, ?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
            ");
            $stmt->execute([
                $_SESSION['user_id'],
                $data['product_id'],
                $data['quantity'] ?? 1,
                $product['price']
            ]);

            echo json_encode(['success' => true]);
        } elseif (isset($data['cart_id']) && isset($data['quantity'])) {
            $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE cart_id = ?");
            $stmt->execute([$data['quantity'], $data['cart_id']]);
            echo json_encode(['success' => true]);
        } else {
            throw new Exception('Invalid request data');
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['cart_id'])) {
            $stmt = $pdo->prepare("DELETE FROM cart WHERE cart_id = ?");
            $stmt->execute([$data['cart_id']]);
            echo json_encode(['success' => true]);
        } else {
            throw new Exception('Invalid request data');
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>