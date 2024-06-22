const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const modal = document.getElementById('myModal');
const modalContent = document.querySelector('.modal-content');
const closeModal = document.querySelector('.close');

// Funzione per ottenere i film più popolari da TMDb API
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Errore nella chiamata API');
        }
        const data = await response.json();
        return data.results; 
    } catch (error) {
        console.error('Errore durante il recupero dei film:', error);
        return []; 
    }
}

// Funzione per visualizzare i film nella pagina HTML
function displayMovies(movies) {
    const movieSlider = document.getElementById('movieSlider');
    movieSlider.innerHTML = ''; 

    movies.forEach(movie => {
        
        if (!movie.title) {
            return;
        }

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <div class="description">
                <div class="description__buttons-container">
                    <div class="description__button"><i class="fas fa-play"></i></div>
                    <div class="description__button"><i class="fas fa-plus"></i></div>
                    <div class="description__button"><i class="fas fa-thumbs-up"></i></div>
                    <div class="description__button"><i class="fas fa-thumbs-down"></i></div>
                    <div class="description__button"><i class="fas fa-chevron-down"></i></div>
                </div>
                <div class="movie-detail-rating">
                    ${generateStars(movie.vote_average)}
                </div>
                <div class="description__text-container">
                    <span class="description__rating">${movie.adult ? 'R' : 'PG-13'}</span>
                    <br><br>
                    <span>${movie.overview && movie.overview.length > 25 ? movie.overview.slice(0,25).trim()+ '...':movie.overview}</span>
                </div>
            </div>
        `;
        movieElement.addEventListener('click', () => {
            window.location.href = `movie_detail.html?id=${movie.id}`;
        });
        movieSlider.appendChild(movieElement);
    });
}

// Funzione per cercare film nel lato client
function searchMovies(query) {
    const movieSlider = document.getElementById('movieSlider');
    const movies = movieSlider.getElementsByClassName('movie');

    Array.from(movies).forEach(movie => {
        const title = movie.getElementsByTagName('img')[0].alt.toLowerCase();
        const displayStyle = title.includes(query.toLowerCase()) ? 'inline-block' : 'none';
        movie.style.display = displayStyle;
    });
}

// Inizializza la pagina con i film più popolari al caricamento
async function initialize() {
    const movies = await fetchPopularMovies();
    displayMovies(movies);

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => searchMovies(searchInput.value));
}

initialize();

// per la barra di ricerca tramite api 

async function searchMovies() {
    const query = document.getElementById('searchInput').value;
    if (!query) {
        alert('Inserisci una query di ricerca');
        return;
    }

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=it-IT&query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Errore nella ricerca dei film.');
        }
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error(error);
    }
}

function displaySearchResults(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = ''; 

    movies.forEach(movie => {
        if (movie.poster_path) {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie');
            movieCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="description">
                    <h3>${movie.title}</h3>
                    <p>Voto: ${movie.vote_average}</p>
                </div>
            `;
            movieCard.addEventListener('click', () => {
                window.location.href = `movie_detail.html?id=${movie.id}`;
            });
            movieList.appendChild(movieCard);
        }
    });
}

// Funzione per aprire la modale e visualizzare i dettagli del film
function openModal(movie) {
    const modalMovieDetails = document.getElementById('modalMovieDetails');
    modalMovieDetails.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <p>${movie.overview}</p>
        <p>Voto: ${movie.vote_average}</p>
    `;
    modal.style.display = 'block';
}

// Chiudi la modale cliccando sul pulsante di chiusura o fuori dalla modale stessa
closeModal.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Aggiungi un event listener a ogni card dei film per aprire la modale con i dettagli corrispondenti
const movieCards = document.querySelectorAll('.movie');
movieCards.forEach(movieCard => {
    movieCard.addEventListener('click', () => {
        const movieId = movieCard.dataset.movieId; 
        const selectedMovie = movies.find(movie => movie.id === parseInt(movieId));
        if (selectedMovie) {
            openModal(selectedMovie);
        }
    });
});


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
