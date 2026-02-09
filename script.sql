-- Création de la base de données My Cinema
CREATE DATABASE IF NOT EXISTS cinema;
USE cinema;

-- Table movies
CREATE TABLE IF NOT EXISTS movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    release_year INT NOT NULL,
    genre VARCHAR(100),
    director VARCHAR(150),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table rooms
CREATE TABLE IF NOT EXISTS rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    type VARCHAR(50),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table screenings
CREATE TABLE IF NOT EXISTS screenings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT NOT NULL,
    room_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour optimiser les requêtes
CREATE INDEX idx_screenings_movie_id ON screenings(movie_id);
CREATE INDEX idx_screenings_room_id ON screenings(room_id);
CREATE INDEX idx_screenings_start_time ON screenings(start_time);

-- Données de démo - Films
INSERT INTO movies (title, description, duration, release_year, genre, director) VALUES
('Inception', 'Un voleur qui vole les secrets des rêves d\'autres personnes', 148, 2010, 'Science-Fiction', 'Christopher Nolan'),
('Titanic', 'L\'histoire dramatique du naufrage du Titanic', 194, 1997, 'Drame/Romance', 'James Cameron'),
('Avatar', 'Sur la planète Pandora, un monde alien fascinant', 162, 2009, 'Science-Fiction', 'James Cameron');

-- Données de démo - Salles
INSERT INTO rooms (name, capacity, type, active) VALUES
('Salle 1 - Standard', 80, 'Standard', TRUE),
('Salle 2 - IMAX', 120, 'IMAX', TRUE);

-- Données de démo - Séances
INSERT INTO screenings (movie_id, room_id, start_time) VALUES
(1, 1, '2026-02-10 14:00:00'),
(2, 2, '2026-02-10 16:00:00'),
(3, 1, '2026-02-11 20:00:00');
