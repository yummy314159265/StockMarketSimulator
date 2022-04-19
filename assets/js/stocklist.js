var stockPriceListEl = $('#stockprice-list');
var errorMessageEl = $('#error-message');
var loaderEl = $('.loader');
const showMoreResultsEl = $('#show-more-results');
const html = $('html');
const modalLoaderEl = $('#modal-loader')

// API endpoint URL to fetch price of all (1100+) stocks in one call
const endpointURL= "https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2022-04-14?adjusted=true&apiKey=GC9ROGPfIcOolOpnKpoEyjmILLnT5xPv";

let page_load_count = 0;
let resultsListLength = 0;
const pgIncrement = 250;

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

const createTable = () => {
  let tableRowEl = $('<tr>');
  let tableColumnEl1 = $('<td>');
  tableRowEl.append(tableColumnEl1);  

  let tableColumnEl2 = $('<td>'); 
  tableRowEl.append(tableColumnEl2);  
}

html.addClass('is-clipped');

fetch(endpointURL)
.then(function (response) {        
  if (response.ok) {
      response.json().then(function (data) {
        let sortedRecords = data.results.sort()
        resultsListLength = data.results.length
        page_load_count = 500;

        for(let i = 0; i < 500; i++)
        {               
             // Create Table Row
                var tableRowEl = $('<tr>');
                // Create Table Column
                var tableColumnEl = $('<td>');
                tableColumnEl.text(sortedRecords[i].T);
                tableRowEl.append(tableColumnEl);   

                var tableColumnEl = $('<td>');                
                tableColumnEl.text('$' + Intl.NumberFormat().format(sortedRecords[i].o));
                tableRowEl.append(tableColumnEl);   
                
                var tableColumnEl = $('<td>');
                tableColumnEl.text('$' + Intl.NumberFormat().format(sortedRecords[i].h));
                tableRowEl.append(tableColumnEl);   

                var tableColumnEl = $('<td>');
                tableColumnEl.text('$' + Intl.NumberFormat().format(sortedRecords[i].l));
                tableRowEl.append(tableColumnEl);   

                var tableColumnEl = $('<td>');
                tableColumnEl.text('$' + Intl.NumberFormat().format(sortedRecords[i].c));
                tableRowEl.append(tableColumnEl);                   

                var tableColumnEl = $('<td>');
                var lastUpdatedTimeStamp = new Date(sortedRecords[i].t);
                var unixFormat = moment(lastUpdatedTimeStamp).format("MMM Do, YYYY, LT");                              
                tableColumnEl.text(unixFormat);
                tableRowEl.append(tableColumnEl);   


                tableBodyEl.append(tableRowEl);           
            
        }

        modalLoaderEl.removeClass('is-active');
        html.removeClass('is-clipped');
        tableEl.append(tableBodyEl);

        localStorage.setItem('stockList', JSON.stringify(sortedRecords))
        
        stockPriceListEl.append(tableEl);
        $('#table-data').DataTable();
    });
  } else {
    errorMessageEl.text("There was an error occurred while connecting to REST API. Please try again!");
  }
})
.catch(function (error) {
    errorMessageEl.text("There was an error occurred while connecting to REST API. Please try again!");
});

function doAfterLoader(){
  return new Promise(resolve => {
    modalLoaderEl.addClass('is-active');
    html.addClass('is-clipped');
    setTimeout(() => {
      resolve();
    }, 100);
  });
}

showMoreResultsEl.on('click', async (event) => {

  page_load_count += pgIncrement;

  await doAfterLoader();

  if (page_load_count >= resultsListLength - pgIncrement) {
    page_load_count = resultsListLength - pgIncrement;
  }

  let table = $('#table-data').DataTable();
  let totalRecords = JSON.parse(localStorage.getItem('stockList'));

  for(let i = page_load_count; i < page_load_count + pgIncrement; i++) {          
    let rowData = [];     
    // Create Table Row
    // var tableRowEl = $('<tr>');
    // // Create Table Column
    // var tableColumnEl = $('<td>');
    // tableColumnEl.text(totalRecords[i].T);
    // tableRowEl.append(tableColumnEl);
    
    rowData.push(totalRecords[i].T)

    // var tableColumnEl = $('<td>');                
    // tableColumnEl.text('$' + Intl.NumberFormat().format(totalRecords[i].o));
    // tableRowEl.append(tableColumnEl);   
    
    rowData.push('$' + Intl.NumberFormat().format(totalRecords[i].o))

    // var tableColumnEl = $('<td>');
    // tableColumnEl.text('$' + Intl.NumberFormat().format(totalRecords[i].h));
    // tableRowEl.append(tableColumnEl);   

    rowData.push('$' + Intl.NumberFormat().format(totalRecords[i].h))

    // var tableColumnEl = $('<td>');
    // tableColumnEl.text('$' + Intl.NumberFormat().format(totalRecords[i].l));
    // tableRowEl.append(tableColumnEl);   

    rowData.push('$' + Intl.NumberFormat().format(totalRecords[i].l))

    // var tableColumnEl = $('<td>');
    // tableColumnEl.text('$' + Intl.NumberFormat().format(totalRecords[i].c));
    // tableRowEl.append(tableColumnEl);                   

    rowData.push('$' + Intl.NumberFormat().format(totalRecords[i].c))

    // var tableColumnEl = $('<td>');
    var lastUpdatedTimeStamp = new Date(totalRecords[i].t);
    var unixFormat = moment(lastUpdatedTimeStamp).format("MMM Do, YYYY, LT");                              
    // tableColumnEl.text(unixFormat);
    // tableRowEl.append(tableColumnEl); 

    rowData.push(unixFormat)
    // tableBodyEl.append(tableRowEl);   
    table.row.add(rowData).draw(false);  
    if (i===resultsListLength-1) {
      showMoreResultsEl.hide();
    }   
  }
  modalLoaderEl.removeClass('is-active')
  html.removeClass('is-clipped');
})