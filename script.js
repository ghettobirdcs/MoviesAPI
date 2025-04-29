const moviesWrapper = document.querySelector('.movies')

function toggleModal() {
	const phoneNav = document.getElementById('phone-nav')

    if (phoneNav.classList.contains('open')) {
		phoneNav.classList.remove('open')
		phoneNav.classList.add('closed')
	}
    else {
		phoneNav.classList.remove('closed')
		phoneNav.classList.add('open')
	}
}

function searchMovies() {
	const button = document.querySelector('.search-btn')
	button.classList.remove('not-loading')
	button.classList.add('loading')
	button.innerHTML = `<i class="fa-solid fa-spinner fa-spinner--homepage">`

	setTimeout(() => {
		window.location.href = './search.html'
		// Setting value of the search term to whatever the user typed in the searchbar on the homepage
		localStorage.setItem('id', document.querySelector('.searchbar').value)
	}, 500)
}

async function getMovies() {
	if (!localStorage.getItem('id')) {
		moviesWrapper.innerHTML = `<h1 class='start-searching'>Start searching!</h1>`
		return null
	}
	
	const id = localStorage.getItem('id')
	const response = await fetch(`http://www.omdbapi.com/?apikey=9c8a3160&s=${id}`)
	const data = await response.json()
	return data
}

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

async function renderMovies(filter) {
	const movies = await getMovies()

    // Check if there are any search results
    if (!movies["Search"] || movies["Search"].length === 0) {
        moviesWrapper.innerHTML = `
            <div class="no-results">
                <h2>No results found</h2>
                <p>Try searching for a different title.</p>
            </div>
        `
        return
    }

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
	else { // filter = 'RELEVANT'
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
			  <img class="movie__poster" src="${movie.Poster}" onerror="this.onerror=null;this.src='./assets/placeholder.png';">
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
