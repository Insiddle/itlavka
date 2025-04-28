<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.example.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'your_email@example.com';
    $mail->Password = 'your_password';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('your_email@example.com', 'Ваш сайт');
    $mail->addAddress('recipient@example.com', 'Получатель');

    $mail->isHTML(true);
    $mail->Subject = 'Тестовое письмо';
    $mail->Body = 'Это тестовое письмо, отправленное через PHPMailer.';

    $mail->send();
    echo 'Письмо успешно отправлено!';
} catch (Exception $e) {
    echo "Ошибка отправки письма: {$mail->ErrorInfo}";
}
?>