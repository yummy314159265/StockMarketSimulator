var cryptoCurrenciesListEl = $('#cryptocurrencies-list');
var errorMessageEl = $('#error-message');

// use of coingecko API = https://www.coingecko.com/en/api/documentation
const endpointURL= "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";


// Create Table
var tableEl = $('<table id="table-data">');
tableEl.attr('class', 'table table is-fullwidth');

// Create Table Head
var tableHeadEl = $('<thead>');

// Create Table Row
var tableRowEl = $('<tr>');

// Create Table Column
var tableColumnEl = $('<th>');
tableColumnEl.text('Rank');
tableRowEl.append(tableColumnEl);   

var tableColumnEl = $('<th>');
tableColumnEl.text('Name');
tableRowEl.append(tableColumnEl);   

var tableColumnEl = $('<th>');
tableColumnEl.text('Symbol');
tableRowEl.append(tableColumnEl);   

var tableColumnEl = $('<th>');
tableColumnEl.text('Current Price');
tableRowEl.append(tableColumnEl);   

var tableColumnEl = $('<th>');
tableColumnEl.text('Market Cap');
tableRowEl.append(tableColumnEl);   

var tableColumnEl = $('<th>');
tableColumnEl.text('Last Updated');
tableRowEl.append(tableColumnEl);   

tableHeadEl.append(tableRowEl);   

tableEl.append(tableHeadEl);   

var tableBodyEl = $('<tbody>');

fetch(endpointURL)
.then(function (response) {        
  if (response.ok) {
      response.json().then(function (data) {
                    
        for(let i = 0; i < data.length; i++)
        {               
             // Create Table Row
                var tableRowEl = $('<tr>');
                // Create Table Column
                var tableColumnEl = $('<td>');
                tableColumnEl.text(data[i].market_cap_rank);
                tableRowEl.append(tableColumnEl);   

                var tableColumnEl = $('<td>');
                tableColumnEl.html('<img src= ' + data[i].image + ' width="32" alt="' + 
                data[i].name + '"><br>' + data[i].name);
                tableRowEl.append(tableColumnEl);   

                var tableColumnEl = $('<td>');
                tableColumnEl.text(data[i].symbol);
                tableRowEl.append(tableColumnEl);   

                var tableColumnEl = $('<td>');                
                tableColumnEl.text('$' + Intl.NumberFormat().format(data[i].current_price));
                tableRowEl.append(tableColumnEl);   

                var tableColumnEl = $('<td>');
                tableColumnEl.text('$' + Intl.NumberFormat().format(data[i].market_cap));
                tableRowEl.append(tableColumnEl);   

                var tableColumnEl = $('<td>');
                var lastUpdatedDate = moment(data[i].last_updated).format("MMM Do, YYYY LT");
                tableColumnEl.text(lastUpdatedDate);
                tableRowEl.append(tableColumnEl);   


                tableBodyEl.append(tableRowEl);           
            
        }
        tableEl.append(tableBodyEl);
        
        cryptoCurrenciesListEl.append(tableEl);
        $('#table-data').DataTable();

    });
  } else {
    errorMessageEl.text("There was an error occurred while connecting to REST API. Please try again!");
  }
})
.catch(function (error) {
    errorMessageEl.text("There was an error occurred while connecting to REST API. Please try again!");
});



