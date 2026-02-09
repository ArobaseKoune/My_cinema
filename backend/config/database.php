<?php
class Database {
    private string $host = 'localhost';
    private string $db = 'cinema';
    private string $user = 'root';
    private string $password = '';
    private ?PDO $pdo = null;
    public function getConnection(): PDO {
        if ($this->pdo === null) {
            try {
                $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db . ";charset=utf8mb4";
                $this->pdo = new PDO($dsn, $this->user, $this->password);
                $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Erreur de connexion à la base de données: ' . $e->getMessage()]);
                exit;
            }
        }
        return $this->pdo;
    }
}
