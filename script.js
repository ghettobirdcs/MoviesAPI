const moviesWrapper = document.querySelector('.movies')

async function getMovies() {
	const id = localStorage.getItem('id')
	const response = await fetch(`http://www.omdbapi.com/?apikey=9c8a3160&s=${id}`)
	const data = await response.json()
	return data
}

// TODO: Display waiting page before the user has made a search (i.e. when local storage is empty)
// TODO: Add placeholder poster for 404 image sources
async function onSearchChange(event) {
	// We need to make sure the spinner stays during the loading state
	moviesWrapper.innerHTML = "<i class='fa-solid fa-spinner movies__loading--spinner'></i>"

	// Using local storage to save search term indefinitely
	if (event.target.value) {
		localStorage.setItem('id', event.target.value)
	}

	// Reset filter value
	document.getElementById('filter').value = 'RELEVANT'

	moviesWrapper.classList.add('movies__loading')
	setTimeout(() => {
		renderMovies()
		moviesWrapper.classList.remove('movies__loading')
	}, 1000)
}

async function renderMovies(filter, id) {
	const movies = await getMovies()

	// Variable to store filtered movie arrays
	let filtered_movies = {}

	if (filter === 'ALPHABETICAL') {
		filtered_movies = movies["Search"].sort((a, b) => a.Title.localeCompare(b.Title))
	}
	else if (filter === 'NEW_TO_OLD') {
		filtered_movies = movies["Search"].sort((a, b) => b.Year.localeCompare(a.Year))
	}
	else if (filter === 'OLD_TO_NEW') {
		filtered_movies = movies["Search"].sort((a, b) => a.Year.localeCompare(b.Year))
	}
	else {
		filtered_movies = movies["Search"]
	}

	// Get first SIX movies
	filtered_movies = filtered_movies.slice(0, 6)
	moviesWrapper.innerHTML = filtered_movies.map(movie => movieHTML(movie)).join('')
}

function movieHTML(movie) {
	return (
		`<div class="movie__container">
			<div class="movie__poster--wrapper">
			  <img class="movie__poster" src="${movie.Poster}">
			</div>
			<div class="movie__title">
			  ${movie.Title}
			</div>
			<div class="movie__date">
			  ${movie.Year}
			</div>
		</div>`
	)
}

function filterMovies(event) {
	// Render movies based on current sorting value
	renderMovies(event.target.value)
}

moviesWrapper.classList.add('movies__loading')
setTimeout(() => {
	renderMovies()
	moviesWrapper.classList.remove('movies__loading')
}, 1000)
