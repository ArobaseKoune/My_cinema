const API_URL = 'http://localhost:8000';
let currentEditId = null;
let currentEditType = null;

function switchTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.style.display = 'none';
    });
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    const tab = document.getElementById(tabName + '-tab');
    if (tab) {
        tab.style.display = 'block';
    }
    event.target.classList.add('active');
    if (tabName === 'movies') {
        fetchMovies();
    } else if (tabName === 'rooms') {
        fetchRooms();
    } else if (tabName === 'screenings') {
        fetchScreenings();
    }
}

async function fetchMovies() {
    try {
        showSpinner('moviesSpinner');
        const response = await fetch(`${API_URL}?resource=movies`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des films');
        }
        const data = await response.json();
        renderMoviesTable(data);
        hideSpinner('moviesSpinner');
    } catch (error) {
        console.error('Erreur:', error);
        hideSpinner('moviesSpinner');
    }
}

async function fetchRooms() {
    try {
        showSpinner('roomsSpinner');
        const response = await fetch(`${API_URL}?resource=rooms`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des salles');
        }
        const data = await response.json();
        renderRoomsTable(data);
        hideSpinner('roomsSpinner');
    } catch (error) {
        console.error('Erreur:', error);
        hideSpinner('roomsSpinner');
    }
}

async function fetchScreenings() {
    try {
        showSpinner('screeningsSpinner');
        const response = await fetch(`${API_URL}?resource=screenings`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des séances');
        }
        const data = await response.json();
        renderScreeningsTable(data);
        await populateScreeningSelects();
        hideSpinner('screeningsSpinner');
    } catch (error) {
        console.error('Erreur:', error);
        hideSpinner('screeningsSpinner');
    }
}

function renderMoviesTable(movies) {
    const tbody = document.querySelector('#moviesTable tbody');
    tbody.innerHTML = '';
    if (!movies || movies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Aucun film trouvé</td></tr>';
        return;
    }
    movies.forEach(movie => {
        const row = `
            <tr>
                <td>${movie.id}</td>
                <td>${movie.title}</td>
                <td>${movie.genre}</td>
                <td>${movie.duration} min</td>
                <td>${movie.release_year}</td>
                <td>${movie.director}</td>
                <td>${new Date(movie.created_at).toLocaleDateString()}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-warning btn-sm" onclick="editMovie(${movie.id})">Modifier</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteMovie(${movie.id})">Supprimer</button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function renderRoomsTable(rooms) {
    const tbody = document.querySelector('#roomsTable tbody');
    tbody.innerHTML = '';
    if (!rooms || rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Aucune salle trouvée</td></tr>';
        return;
    }
    rooms.forEach(room => {
        const statusBadge = room.active == 1 ? '<span class="badge bg-success">Actif</span>' : '<span class="badge bg-secondary">Inactif</span>';
        const row = `
            <tr>
                <td>${room.id}</td>
                <td>${room.name}</td>
                <td>${room.type}</td>
                <td>${room.capacity}</td>
                <td>${statusBadge}</td>
                <td>${new Date(room.created_at).toLocaleDateString()}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-warning btn-sm" onclick="editRoom(${room.id})">Modifier</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteRoom(${room.id})">Supprimer</button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function renderScreeningsTable(screenings) {
    const tbody = document.querySelector('#screeningsTable tbody');
    tbody.innerHTML = '';
    if (!screenings || screenings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Aucune séance trouvée</td></tr>';
        return;
    }
    screenings.forEach(screening => {
        const row = `
            <tr>
                <td>${screening.id}</td>
                <td>${screening.movie_title}</td>
                <td>${screening.room_name}</td>
                <td>${new Date(screening.start_time).toLocaleString()}</td>
                <td>${new Date(screening.created_at).toLocaleDateString()}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-warning btn-sm" onclick="editScreening(${screening.id})">Modifier</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteScreening(${screening.id})">Supprimer</button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function populateScreeningSelects() {
    try {
        const moviesResponse = await fetch(`${API_URL}?resource=movies`);
        const roomsResponse = await fetch(`${API_URL}?resource=rooms`);
        if (!moviesResponse.ok || !roomsResponse.ok) {
            throw new Error('Erreur lors du chargement des données');
        }
        const movies = await moviesResponse.json();
        const rooms = await roomsResponse.json();
        const movieSelect = document.getElementById('screeningMovie');
        movieSelect.innerHTML = '<option value="">Sélectionner un film...</option>';
        movies.forEach(movie => {
            const option = document.createElement('option');
            option.value = movie.id;
            option.textContent = movie.title;
            movieSelect.appendChild(option);
        });
        const roomSelect = document.getElementById('screeningRoom');
        roomSelect.innerHTML = '<option value="">Sélectionner une salle...</option>';
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = room.name;
            roomSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function showMovieForm() {
    currentEditId = null;
    currentEditType = 'movie';
    resetForm('movieForm');
    document.getElementById('movieFormTitle').textContent = 'Ajouter un film';
    openModal('movieModal');
}

function showRoomForm() {
    currentEditId = null;
    currentEditType = 'room';
    resetForm('roomForm');
    document.getElementById('roomFormTitle').textContent = 'Ajouter une salle';
    openModal('roomModal');
}

function showScreeningForm() {
    currentEditId = null;
    currentEditType = 'screening';
    resetForm('screeningForm');
    document.getElementById('screeningFormTitle').textContent = 'Ajouter une séance';
    populateScreeningSelects();
    openModal('screeningModal');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function closeMovieModal() {
    closeModal('movieModal');
}

function closeRoomModal() {
    closeModal('roomModal');
}

function closeScreeningModal() {
    closeModal('screeningModal');
}

async function editMovie(id) {
    try {
        const response = await fetch(`${API_URL}?resource=movies&id=${id}`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement du film');
        }
        const movie = await response.json();
        currentEditId = id;
        currentEditType = 'movie';
        document.getElementById('movieId').value = movie.id;
        document.getElementById('movieTitle').value = movie.title;
        document.getElementById('movieDescription').value = movie.description;
        document.getElementById('movieDuration').value = movie.duration;
        document.getElementById('movieReleaseYear').value = movie.release_year;
        document.getElementById('movieGenre').value = movie.genre;
        document.getElementById('movieDirector').value = movie.director;
        document.getElementById('movieFormTitle').textContent = 'Modifier le film';
        openModal('movieModal');
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('moviesAlert', 'Erreur lors du chargement du film', 'danger');
    }
}

async function editRoom(id) {
    try {
        const response = await fetch(`${API_URL}?resource=rooms&id=${id}`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement de la salle');
        }
        const room = await response.json();
        currentEditId = id;
        currentEditType = 'room';
        document.getElementById('roomId').value = room.id;
        document.getElementById('roomName').value = room.name;
        document.getElementById('roomType').value = room.type;
        document.getElementById('roomCapacity').value = room.capacity;
        document.getElementById('roomActive').checked = room.active == 1;
        document.getElementById('roomFormTitle').textContent = 'Modifier la salle';
        openModal('roomModal');
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('roomsAlert', 'Erreur lors du chargement de la salle', 'danger');
    }
}

async function editScreening(id) {
    try {
        const response = await fetch(`${API_URL}?resource=screenings&id=${id}`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement de la séance');
        }
        const screening = await response.json();
        currentEditId = id;
        currentEditType = 'screening';
        document.getElementById('screeningId').value = screening.id;
        document.getElementById('screeningMovie').value = screening.movie_id;
        document.getElementById('screeningRoom').value = screening.room_id;
        document.getElementById('screeningStartTime').value = screening.start_time.replace(' ', 'T');
        document.getElementById('screeningFormTitle').textContent = 'Modifier la séance';
        openModal('screeningModal');
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('screeningsAlert', 'Erreur lors du chargement de la séance', 'danger');
    }
}

async function saveMovie(event) {
    event.preventDefault();
    const title = document.getElementById('movieTitle').value.trim();
    const description = document.getElementById('movieDescription').value.trim();
    const duration = parseInt(document.getElementById('movieDuration').value);
    const year = parseInt(document.getElementById('movieReleaseYear').value);
    const genre = document.getElementById('movieGenre').value.trim();
    const director = document.getElementById('movieDirector').value.trim();
    if (!title || !description || !duration || !year || !genre || !director) {
        showAlert('moviesAlert', 'Tous les champs sont obligatoires', 'danger');
        return;
    }
    if (duration <= 0) {
        showAlert('moviesAlert', 'La durée doit être positive', 'danger');
        return;
    }
    if (year < 1900 || year > new Date().getFullYear()) {
        showAlert('moviesAlert', 'L\'année doit être entre 1900 et ' + new Date().getFullYear(), 'danger');
        return;
    }
    const data = { title, description, duration, release_year: year, genre, director };
    try {
        let response;
        if (currentEditId) {
            response = await fetch(`${API_URL}?resource=movies&id=${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_URL}?resource=movies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la sauvegarde');
        }
        closeModal('movieModal');
        showAlert('moviesAlert', currentEditId ? 'Film modifié avec succès' : 'Film ajouté avec succès', 'success');
        fetchMovies();
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('moviesAlert', error.message, 'danger');
    }
}

async function saveRoom(event) {
    event.preventDefault();
    const name = document.getElementById('roomName').value.trim();
    const type = document.getElementById('roomType').value.trim();
    const capacity = parseInt(document.getElementById('roomCapacity').value);
    const active = document.getElementById('roomActive').checked ? 1 : 0;
    if (!name || !type || !capacity) {
        showAlert('roomsAlert', 'Tous les champs obligatoires doivent être remplis', 'danger');
        return;
    }
    if (capacity <= 0) {
        showAlert('roomsAlert', 'La capacité doit être positive', 'danger');
        return;
    }
    const data = { name, type, capacity, active };
    try {
        let response;
        if (currentEditId) {
            response = await fetch(`${API_URL}?resource=rooms&id=${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_URL}?resource=rooms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la sauvegarde');
        }
        closeModal('roomModal');
        showAlert('roomsAlert', currentEditId ? 'Salle modifiée avec succès' : 'Salle ajoutée avec succès', 'success');
        fetchRooms();
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('roomsAlert', error.message, 'danger');
    }
}

async function saveScreening(event) {
    event.preventDefault();
    const movie_id = parseInt(document.getElementById('screeningMovie').value);
    const room_id = parseInt(document.getElementById('screeningRoom').value);
    const startTimeInput = document.getElementById('screeningStartTime').value;
    const start_time = startTimeInput.replace('T', ' ') + ':00';
    if (!movie_id || !room_id || !startTimeInput) {
        showAlert('screeningsAlert', 'Tous les champs sont obligatoires', 'danger');
        return;
    }
    const data = { movie_id, room_id, start_time };
    try {
        let response;
        if (currentEditId) {
            response = await fetch(`${API_URL}?resource=screenings&id=${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_URL}?resource=screenings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la sauvegarde');
        }
        closeModal('screeningModal');
        showAlert('screeningsAlert', currentEditId ? 'Séance modifiée avec succès' : 'Séance ajoutée avec succès', 'success');
        fetchScreenings();
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('screeningsAlert', error.message, 'danger');
    }
}

async function deleteMovie(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce film?')) return;
    try {
        const response = await fetch(`${API_URL}?resource=movies&id=${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la suppression');
        }
        showAlert('moviesAlert', 'Film supprimé avec succès', 'success');
        fetchMovies();
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('moviesAlert', error.message, 'danger');
    }
}

async function deleteRoom(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette salle?')) return;
    try {
        const response = await fetch(`${API_URL}?resource=rooms&id=${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la suppression');
        }
        showAlert('roomsAlert', 'Salle supprimée avec succès', 'success');
        fetchRooms();
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('roomsAlert', error.message, 'danger');
    }
}

async function deleteScreening(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette séance?')) return;
    try {
        const response = await fetch(`${API_URL}?resource=screenings&id=${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la suppression');
        }
        showAlert('screeningsAlert', 'Séance supprimée avec succès', 'success');
        fetchScreenings();
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('screeningsAlert', error.message, 'danger');
    }
}

function resetForm(formId) {
    document.getElementById(formId).reset();
    document.getElementById(formId + 'Id').value = '';
}

function showAlert(alertId, message, type) {
    const alertDiv = document.getElementById(alertId);
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}

function showSpinner(spinnerId) {
    const spinner = document.getElementById(spinnerId);
    if (spinner) spinner.style.display = 'block';
}

function hideSpinner(spinnerId) {
    const spinner = document.getElementById(spinnerId);
    if (spinner) spinner.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    fetchMovies();
});
