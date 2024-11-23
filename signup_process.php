<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST["email"];
    $username = $_POST["username"];
    $password = $_POST["password"];
    $captchaAnswer = $_POST["captchaAnswer"];

    // E-posta doğrulama
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Geçersiz e-posta adresi.");
    }

    // Şifreyi güvenli şekilde hashleme
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Veritabanına kaydetme işlemi (örnek)
    // Not: Veritabanı bağlantınızı ayarlayın
    $conn = new mysqli("localhost", "username", "password", "database");
    if ($conn->connect_error) {
        die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $username, $hashedPassword);
    if ($stmt->execute()) {
        header("Location: Ana.html");
    } else {
        die("Kayıt başarısız: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
}
?>
