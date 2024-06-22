// Funzione per ottenere i dettagli di un film tramite API TMDb
async function fetchMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=it-IT`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Errore nel recupero dei dettagli del film.');
        }
        const movie = await response.json();
        return movie;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Funzione per visualizzare i dettagli del film
function displayMovieDetails(movie) {
    const movieDetailContainer = document.getElementById('movieDetailContainer');
    movieDetailContainer.innerHTML = `
        <div class="movie-detail">
            <div class="movie-detail-poster">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            </div>
            <div class="movie-detail-info">
                <h2>${movie.title}</h2>
                <p>${movie.overview}</p>
                <p><strong>Data di uscita:</strong> ${movie.release_date}</p>
                <p><strong>Durata:</strong> ${movie.runtime} minuti</p>
                <p><strong>Voto medio:</strong> ${movie.vote_average} / 10</p>
                <p><strong>Genere:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
                <div class="movie-detail-rating">
                    ${generateStars(movie.vote_average)}
                </div>
            </div>
        </div>
    `;
}

// Funzione per generare le stelle in base al voto medio
function generateStars(voteAverage) {
    const fullStars = Math.floor(voteAverage / 2);
    const halfStar = voteAverage % 2 >= 1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
    `;
}

// Inizializza la pagina con i dettagli del film al caricamento
async function initialize() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (movieId) {
        const movie = await fetchMovieDetails(movieId);
        if (movie) {
            displayMovieDetails(movie);
        } else {
            const movieDetailContainer = document.getElementById('movieDetailContainer');
            movieDetailContainer.innerHTML = '<p>Errore nel caricamento dei dettagli del film.</p>';
        }
    }
}

initialize();
