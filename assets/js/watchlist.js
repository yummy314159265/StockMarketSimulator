var formCreateWatchlist = $('#form-create-watchlist');
var nameSymbolEl = $('#symbol-name');
var errorMessageEl = $('#error-message');
var errorMessageFormEl = $('#error-message-form');
var modelCreateWatchlistEl = $('#modal-watchlist');
var showWatchlistEl = $('#show-watchlist');

// API endpoint URL to fetch price of all (1100+) stocks in one call
const endpointURL= "https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2022-04-14?adjusted=true&apiKey=GC9ROGPfIcOolOpnKpoEyjmILLnT5xPv";

// fetch loggedin userid from sesssion = must change
var userId = 1;

var listOfAllStocks; // will hold API Data - global access to all stock price

var watchlistLocalStorageId = "user" + userId + "watchlist";

// fetch user input and save new symbol to local storage watchlist
var saveWatchlist = function (event) {    
    event.preventDefault();

    // Validation 1 - input from user
    var nameSymbol = nameSymbolEl.val();    
    if (!nameSymbol) {
      errorMessageFormEl.text("Please enter required fields!")        
      return false;
    }

    // Validation 2 - valid stock name using API data
    fetchStocksFromAPI(); // RUN API Call to get list of valid stocks
    if(!listOfAllStocks)
    {
        errorMessageFormEl.text("There was an error occurred while connecting to REST API. Please try again!");
        return false;
    }

    // check in stocklist if stock exists
    var foundStockSymbol = listOfAllStocks.results.find(item => item.T === nameSymbol);
    
    if(typeof foundStockSymbol == "undefined")    
    {
        errorMessageFormEl.text("Please enter valid symbol!")                
        return false;
    }    

    // all ok, store to local storage
    var watchlistObject = {
        symbol: nameSymbol
    };

    var watchlistLocalStorage = JSON.parse(localStorage.getItem(watchlistLocalStorageId) || "[]");
    watchlistLocalStorage.push(watchlistObject);
    localStorage.setItem(watchlistLocalStorageId, JSON.stringify(watchlistLocalStorage));

    // resets form
    nameSymbolEl.val('');
    // close model
    modelCreateWatchlistEl.removeClass('is-active');
    // reload watchlist
    displayWatchList();
  };

// Event listener to add new symbol to watchlist
formCreateWatchlist.on('submit', saveWatchlist);

// Display Watch List
function displayWatchList()
{           
   // on page load main or on save new data fetchStocksFromAPI will be called

   showWatchlistEl.text(''); // clear list holder   
   listOfAllStocks = JSON.parse(localStorage.getItem("listOfAllStocks"));

    // Create Table
   var tableEl = $('<table>');
   tableEl.attr('class', 'table table is-fullwidth');

   // Create Table Head
   var tableHeadEl = $('<thead>');

   // Create Table Row
   var tableRowEl = $('<tr>');

   // Create Table Column
   var tableColumnEl = $('<th>');
   tableColumnEl.text('Symbol');
   tableRowEl.append(tableColumnEl);   

   var tableColumnEl = $('<th>');
   tableColumnEl.text('Open');
   tableRowEl.append(tableColumnEl);   

   var tableColumnEl = $('<th>');
   tableColumnEl.text('Close');
   tableRowEl.append(tableColumnEl);   

   var tableColumnEl = $('<th>');
   tableColumnEl.text('High');
   tableRowEl.append(tableColumnEl);   

   var tableColumnEl = $('<th>');
   tableColumnEl.text('Low');
   tableRowEl.append(tableColumnEl);   

   // we may add marketcap later but will require call per stock
//    var tableColumnEl = $('<th>');
//    tableColumnEl.text('Market Cap');
//    tableRowEl.append(tableColumnEl);   
   // Apend row to thead
   tableHeadEl.append(tableRowEl);
   // Append thead to table
   tableEl.append(tableHeadEl);

    // Create Table Body
    var tableBodyEl = $('<tbody>');   
    
    var watchlistLocalStorage = JSON.parse(localStorage.getItem(watchlistLocalStorageId));         
    for(var i = 0; i < watchlistLocalStorage.length; i++)
    {        
        // Get price from API Data if available
        var stockOpenPrice  = '-';
        var stockClosePrice = '-';
        var stockHighPrice  = '-';
        var stockLowPrice   = '-';
        
        if(listOfAllStocks)
        {        
            var foundObject = listOfAllStocks.results.find(item => item.T === watchlistLocalStorage[i].symbol);
            if(foundObject)
            {
                stockOpenPrice  = foundObject.o;                
                stockClosePrice = foundObject.c;                
                stockHighPrice  = foundObject.h;                
                stockLowPrice   = foundObject.l;                
            }                
        }    
        
        // Create Table Row
        var tableRowEl = $('<tr>');

        // Create Table Column
        var tableColumnEl = $('<td>');
        tableColumnEl.text(watchlistLocalStorage[i].symbol);
        tableRowEl.append(tableColumnEl);   

        var tableColumnEl = $('<td>');
        tableColumnEl.text(stockOpenPrice);
        tableRowEl.append(tableColumnEl);   

        var tableColumnEl = $('<td>');
        tableColumnEl.text(stockClosePrice);
        tableRowEl.append(tableColumnEl);   

        var tableColumnEl = $('<td>');
        tableColumnEl.text(stockHighPrice);
        tableRowEl.append(tableColumnEl);   

        var tableColumnEl = $('<td>');
        tableColumnEl.text(stockLowPrice);
        tableRowEl.append(tableColumnEl);   

        // we may add marketcap later but will require call per stock
        // var tableColumnEl = $('<td>');
        // tableColumnEl.text('');
        // tableRowEl.append(tableColumnEl);   
        // Apend row to thead
        tableBodyEl.append(tableRowEl);       
        
    }   
    // Append tbody to table
    tableEl.append(tableBodyEl); 
    showWatchlistEl.append(tableEl); 
}

function fetchStocksFromAPI()
{
    // Get list of stock names first to validate when user enter symbol
    fetch(endpointURL)
    .then(function (response) {        
    if (response.ok) {           
    response.json().then(function (data) {     
    if(!data)
    {
        errorMessageEl.text("There was an error occurred while connecting to REST API. Please try again!");
        return false;
    } 
    else
    {
       listOfAllStocks = data; // assign to global variable for access in each function       
       // As global varibale not working with fetch, 2nd option store to localStorage
       localStorage.setItem("listOfAllStocks", JSON.stringify(listOfAllStocks));

    } 
    });

    } else {                
        errorMessageEl.text("There was an error occurred while connecting to REST API. Please try again!");
    }
    })
        .catch(function (error) {
        errorMessageEl.text("There was an error occurred while connecting to REST API. Please try again!");
    });
}
function init()
{   
    
    fetchStocksFromAPI();
    // to retrieve anywhere in script use following 
    // listOfAllStocks = JSON.parse(localStorage.getItem("listOfAllStocks"));
    
    // Display List from LocalStorage      
    displayWatchList();    
}

init();