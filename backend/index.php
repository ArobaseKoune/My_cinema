<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once 'config/database.php';
require_once 'models/Movie.php';
require_once 'models/Room.php';
require_once 'models/Screening.php';
require_once 'controllers/MovieController.php';
require_once 'controllers/RoomController.php';
require_once 'controllers/ScreeningController.php';
try {
    $database = new Database();
    $pdo = $database->getConnection();
    $resource = $_GET['resource'] ?? null;
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $method = $_SERVER['REQUEST_METHOD'];
    switch ($resource) {
        case 'movies':
            $controller = new MovieController($pdo);
            switch ($method) {
                case 'GET':
                    if ($id) {
                        $controller->show($id);
                    } else {
                        $controller->index();
                    }
                    break;
                case 'POST':
                    $controller->store();
                    break;
                case 'PUT':
                    if (!$id) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID manquant']);
                        break;
                    }
                    $controller->update($id);
                    break;
                case 'DELETE':
                    if (!$id) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID manquant']);
                        break;
                    }
                    $controller->destroy($id);
                    break;
                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Méthode non autorisée']);
            }
            break;
        case 'rooms':
            $controller = new RoomController($pdo);
            switch ($method) {
                case 'GET':
                    if ($id) {
                        $controller->show($id);
                    } else {
                        $controller->index();
                    }
                    break;
                case 'POST':
                    $controller->store();
                    break;
                case 'PUT':
                    if (!$id) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID manquant']);
                        break;
                    }
                    $controller->update($id);
                    break;
                case 'DELETE':
                    if (!$id) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID manquant']);
                        break;
                    }
                    $controller->destroy($id);
                    break;
                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Méthode non autorisée']);
            }
            break;
        case 'screenings':
            $controller = new ScreeningController($pdo);
            switch ($method) {
                case 'GET':
                    if ($id) {
                        $controller->show($id);
                    } else {
                        $controller->index();
                    }
                    break;
                case 'POST':
                    $controller->store();
                    break;
                case 'PUT':
                    if (!$id) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID manquant']);
                        break;
                    }
                    $controller->update($id);
                    break;
                case 'DELETE':
                    if (!$id) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID manquant']);
                        break;
                    }
                    $controller->destroy($id);
                    break;
                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Méthode non autorisée']);
            }
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Ressource inconnue']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
}
