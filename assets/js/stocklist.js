var storckPriceListEl = $('#stockprice-list');
var errorMessageEl = $('#error-message');
var loaderEl = $('.loader');

// API endpoint URL to fetch price of all (1100+) stocks in one call
const endpointURL= "https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2022-04-14?adjusted=true&apiKey=GC9ROGPfIcOolOpnKpoEyjmILLnT5xPv";



// Create Table
var tableEl = $('<table id="table-data">');
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
tableColumnEl.text('High');
tableRowEl.append(tableColumnEl);   

var tableColumnEl = $('<th>');
tableColumnEl.text('Low');
tableRowEl.append(tableColumnEl);   

var tableColumnEl = $('<th>');
tableColumnEl.text('Close');
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
        var totalRecords = data.results.length;
        loaderEl.show();
        for(let i = 0; i < totalRecords; i++)
        {               
             // Create Table Row
                var tableRowEl = $('<tr>');
                // Create Table Column
                var tableColumnEl = $('<td>');
                tableColumnEl.text(data.results[i].T);
                tableRowEl.append(tableColumnEl);   

                var tableColumnEl = $('<td>');                
                tableColumnEl.text('$' + Intl.NumberFormat().format(data.results[i].o));
                tableRowEl.append(tableColumnEl);   
                
                var tableColumnEl = $('<td>');
                tableColumnEl.text('$' + Intl.NumberFormat().format(data.results[i].h));
                tableRowEl.append(tableColumnEl);   

                var tableColumnEl = $('<td>');
                tableColumnEl.text('$' + Intl.NumberFormat().format(data.results[i].l));
                tableRowEl.append(tableColumnEl);   

                var tableColumnEl = $('<td>');
                tableColumnEl.text('$' + Intl.NumberFormat().format(data.results[i].c));
                tableRowEl.append(tableColumnEl);                   

                var tableColumnEl = $('<td>');
                var unixFormat = moment.unix(data.results[i].t).format("MMM Do, YYYY, LT");                              
                tableColumnEl.text(unixFormat);
                tableRowEl.append(tableColumnEl);   


                tableBodyEl.append(tableRowEl);           
            
        }
        loaderEl.hide();
        tableEl.append(tableBodyEl);
        
        storckPriceListEl.append(tableEl);
        $('#table-data').DataTable();


    });
  } else {
    errorMessageEl.text("There was an error occurred while connecting to REST API. Please try again!");
  }
})
.catch(function (error) {
    errorMessageEl.text("There was an error occurred while connecting to REST API. Please try again!");
});


