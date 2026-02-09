<?php
class Rooms {
    private PDO $pdo;
    private string $table = "rooms";
    public int $id;
    public string $name;
    public int $capacity;
    public string $type;
    public bool $active;
    public string $created_at;
    public string $updated_at;
    public function __construct(PDO $db) {
        $this->pdo = $db;
    }
    public function find(int $id): ?array {
        $sql = "SELECT * FROM rooms  WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }
    public function create(): bool {
        $sql = "INSERT INTO rooms 
                (name, capacity, type, active)
                VALUES
                (:name, :capacity, :type, :active)";
        $stmt = $this->pdo->prepare($sql);
        $executed = $stmt->execute([
            'name' => $this->name,
            'capacity' => $this->capacity,
            'type' => $this->type,
            'active' => $this->active
        ]);
        return $executed;
    }    public function readAll(): array {
        $sql = "SELECT * FROM rooms  ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function update(): bool {
        $sql = "UPDATE rooms  SET
                name = :name,
                capacity = :capacity,
                type = :type,
                active = :active
                WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $executed = $stmt->execute([
                'id' => $this->id,
                'name' => $this->name,
                'capacity' => $this->capacity,
                'type' => $this->type,
                'active' => $this->active
        ]);
        return $executed;
    }
    public function delete(): bool {
        $sql = "DELETE FROM rooms  WHERE id = :id"; 
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute(['id' => $this->id]);
    }
}
