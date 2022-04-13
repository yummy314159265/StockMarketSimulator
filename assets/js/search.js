const APIkey = 'c9bfsi2ad3i8r0u3vvh0';
const searchInputEl = $('#search-input');
const searchResultsLiEl = $('#search-results');
const searchFormEl = $('#search-form');

const getSearchInput = (event) => {
    event.preventDefault();
    
    if (!window.location.pathname.includes('search.html')) {
        window.location.href = 'search.html'
    }

    console.log('hi')
    searchInputEl.val('')
    return searchInputEl.val();
}

searchFormEl.on('submit', getSearchInput);