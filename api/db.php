<?php
$host = 'sql212.infinityfree.com';
$dbname = 'if0_38960974_itlavka';
$username = 'if0_38960974';
$password = 'ia5uGxx6RRAysJ';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    error_log('DB Connection Failed: ' . $e->getMessage());
    throw new Exception('Не удалось подключиться к базе данных');
}