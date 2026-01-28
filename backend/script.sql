CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    -- genre VARCHAR(100),
    -- release_year INT NOT NULL (j'met en com ici parce que j'suis pas sur de les faire)
);

CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE screenings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    room_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(id), -- <- Les Foreign keys recup l'info du tableau en haut pour l'avoir ici (c pas chatgpt le com c'est AMIN mdrr)
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);