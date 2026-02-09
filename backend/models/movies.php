<?php
class Movie {
    private PDO $pdo;
    private string $table = "movies";
    public int $id;
    public string $title;
    public ?string $description;
    public int $duration;
    public int $release_year;
    public string $genre;
    public string $director;
    public string $created_at;
    public string $updated_at;
    public function __construct(PDO $db) {
        $this->pdo = $db;
    }
    public function find(int $id): ?array {
        $sql = "SELECT * FROM movies WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }
    public function create(): bool {
        $sql = "INSERT INTO movies 
                (title, description, duration, release_year, genre, director)
                VALUES
                (:title, :description, :duration, :release_year, :genre, :director)";
        $stmt = $this->pdo->prepare($sql);
        $executed = $stmt->execute([
            'title' => $this->title,
            'description' => $this->description,
            'duration' => $this->duration,
            'release_year' => $this->release_year,
            'genre' => $this->genre,
            'director' => $this->director
        ]);
        return $executed;
    }
    public function readAll(): array {
        $sql = "SELECT * FROM movies ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function update(): bool {
        $sql = "UPDATE movies SET
                title = :title,
                description = :description,
                duration = :duration,
                release_year = :release_year,
                genre = :genre,
                director = :director
                WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $executed = $stmt->execute([
                'id' => $this->id,
                'title' => $this->title,
                'description' => $this->description,
                'duration' => $this->duration,
                'release_year' => $this->release_year,
                'genre' => $this->genre,
                'director' => $this->director
        ]);
        return $executed;
    }
    public function delete(): bool {
        $sql = "DELETE FROM movies WHERE id = :id"; 
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute(['id' => $this->id]);
    }
}
