<?php
class Screenings {
    private PDO $pdo;
    private string $table = "screenings";
    public int $id;
    public int $movie_id;
    public int $room_id;
    public string $start_time;
    public string $created_at;
    public function __construct(PDO $db) {
        $this->pdo = $db;
    }
    public function find(int $id): ?array {
        $sql = "SELECT * FROM screenings WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }
    public function create(): bool {
        $sql = "INSERT INTO screenings 
                (movie_id, room_id, start_time)
                VALUES
                (:movie_id, :room_id, :start_time)";
        $stmt = $this->pdo->prepare($sql);
        $executed = $stmt->execute([
            'movie_id' => $this->movie_id,
            'room_id' => $this->room_id,
            'start_time' => $this->start_time
        ]);
        return $executed;
    }
    public function readAll(): array {
        $sql = "SELECT * FROM screenings  ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function update(): bool {
        $sql ="UPDATE screenings  SET
                movie_id = :movie_id,
                room_id = :room_id,
                start_time = :start_time
                WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $executed = $stmt->execute([
                'movie_id' => $this->movie_id,
                'room_id' => $this->room_id,
                'start_time' => $this->start_time
        ]);
        return $executed;
    }
    public function delete(): bool {
        $sql = "DELETE FROM screenings WHERE id = :id"; 
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute(['id' => $this->id]);
    }
}
