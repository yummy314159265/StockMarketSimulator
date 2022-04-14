const ApiKey = 'zt8qVTyLUMz2pDSklkSAJ4U1rp4YMxCr';
const searchResultsUlEl = $('#search-results-list');

const displaySearchResults = (ApiData) => {
    for (let i = 0; i < ApiData.results.length; i++) {
        const searchResultsLiEl = (
        `<li class='search-results column is-one-fourth' id=result-${i}>
            <div class="tradingview-widget-container">
            <div class="tradingview-widget-container__widget"></div>
            <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/${ApiData.results[i].ticker}/" rel="noopener" target="_blank"><span class="blue-text">${ApiData.results[i].ticker} Rates</span></a> by TradingView</div>
            <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js" async>
            {
                "symbol": "${ApiData.results[i].ticker}",
                "width": 350,
                "colorTheme": "light",
                "isTransparent": false,
                "locale": "en"
            }
            </script>
            </div>
        </li>`);
        searchResultsUlEl.append(searchResultsLiEl);
    }
}

const getApiSearchData = (search) => {
    const queryUrl = [
        `https://api.polygon.io/v3/reference/tickers?`,
        `search=${search}`,
        `&active=true`,
        `&sort=ticker`,
        `&order=asc`,
        `&limit=10`,
        `&apiKey=${ApiKey}`
    ].join('');
    
    fetch(queryUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        console.log(data);
                        displaySearchResults(data);
                    });
            } else {
                return ("Couldn't find location - " + response.statusText);
            }
        })
        .catch(function (error) {
            return ('Unable to connect to OpenWeatherMaps - ' + error);
        });
}

const submitSearchInput = (event) => {
    event.preventDefault();
    const target = $(event.target);
    let searchInputValue = target.find('.searchbar').val();
    console.log(searchInputValue)
    window.location.href = `search.html?=${searchInputValue}`;
}

const getSearchInput = () => {
    const searchQuery = location.search.slice(2, location.search.length);
    
    if (!searchQuery) {
        return;
    }

    getApiSearchData(searchQuery);
}

const init_search = () => {
    const searchFormEls = $('.search-forms');
    
    searchFormEls.each((i) => {
        $(searchFormEls[i]).on('submit', submitSearchInput);
    })

    getSearchInput();
} 

export { init_search }