<?php
require_once 'config/database.php';
$database = new Database();
$pdo = $database->getConnection();
echo "✅ Connexion OK !";
