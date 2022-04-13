// Selectors to use for My Portfolios - List Page
var formCreatePortfolio = $('#form-create-portfolio');
var namePortfolioEl = $('#portfolio-name');
var investmentAmountEl = $('#investment-amount');
var errorMessageEl = $('#error-message');
var errorMessageEl = $('#error-message');
var showPortFolioListEl = $('#show-portfolio-list');
var modelCreatePortfolioEl = $('#modal-create-portfolio');

// Selectors to use for My Porfolios - Individual Portfolio Page
var buttonCreatePortfolioEl = $('#btn-create-protfolio');
var buttonAddSymbolEl = $('#btn-add-symbol');
var h1El = $('h1');
var userId = 1; // change from session object later

// LocalStorage dbuserportfolio will hold userid, portfolioname, and investmentamount

// Following are functions/calls for My Portfolios - List Page
// Flow:
// 1. function init() will call displayPortfolio
// 2. displayPortfolio() will render portfolio list from localStorage + API
// 3. Add new portfolio form will call savePortfolio to fetch user input and save to localStorage
// 4. deletePortfolio will listen for user request to delete exisiting portfolio

// Render portfolio from localStorage in table format
function displayPortfolio()
{
  showPortFolioListEl.text(''); 
  var dbuserportfolio = JSON.parse(localStorage.getItem("dbuserportfolio"));         
   // Create Table
   var tableEl = $('<table>');
   tableEl.attr('class', 'table table is-fullwidth');

   // Create Table Head
   var tableHeadEl = $('<thead>');
   tableEl.append(tableHeadEl);

   // Create Table Row
   var tableRowEl = $('<tr>');
   tableHeadEl.append(tableRowEl);

   // Create Table Column
   var tableColumnEl = $('<th>');
   tableColumnEl.text('Portfolio Name');
   tableRowEl.append(tableColumnEl);   
   var tableColumnEl = $('<th>');
   tableColumnEl.text('Symbols');
   tableRowEl.append(tableColumnEl);   
   var tableColumnEl = $('<th>');
   tableColumnEl.text('Investments');
   tableRowEl.append(tableColumnEl);   
   var tableColumnEl = $('<th>');
   tableColumnEl.text('Market Value');
   tableRowEl.append(tableColumnEl);   
   var tableColumnEl = $('<th>');
   tableColumnEl.text('Total Gain/ Loss');
   tableRowEl.append(tableColumnEl);   
   var tableColumnEl = $('<th>');
   tableColumnEl.text('');
   tableRowEl.append(tableColumnEl);   
   tableEl.append(tableEl);
    // Create Table Body
  var tableBodyEl = $('<tbody>');

  // to format number to amount    
  let dollarUSLocale = Intl.NumberFormat('en-US');

  for(var i=0; i<dbuserportfolio.length; i++)
  {        

   var tableRowEl = $('<tr>');
   tableBodyEl.append(tableRowEl);

   // Create Table Column
   // 1st column showing portfolio name
   var tableColumnEl = $('<td>');
   tableColumnEl.text(dbuserportfolio[i].portfolioname);     
   tableColumnEl.css('text-decoration', 'underline');
   tableColumnEl.css('cursor', 'pointer');
   tableColumnEl.css('color', 'blue');
   tableColumnEl.attr('class', 'portfoliolink');
   tableBodyEl.append(tableColumnEl);   
   
   // 2nd column showing total symbols portfolio have
   var tableColumnEl = $('<td>');
   tableColumnEl.text();  //  add total symbols from other object
   tableBodyEl.append(tableColumnEl);   

   // 3rd column showing total investments
   var tableColumnEl = $('<td>');
   tableColumnEl.text("$" + dollarUSLocale.format(dbuserportfolio[i].investmentamount));
   tableBodyEl.append(tableColumnEl);   

   // 4th column calculate current market value for total investment
   var tableColumnEl = $('<td>');
   tableColumnEl.text();
   tableBodyEl.append(tableColumnEl);   
   
   // 5th column calculate profit/loss from diffrence between current market value and total investment
   var tableColumnEl = $('<td>');
   tableColumnEl.text('');
   tableBodyEl.append(tableColumnEl);        

    // 6th column Delete icon
    var tableColumnEl = $('<td>');
    var faIconEl = "<i id=" + i +" class='fa fa-remove fa-hand-pointer fa-2xl'></i>";      
    tableColumnEl.html(faIconEl);
    //tableColumnEl.append(faIconEl);  
    
    tableBodyEl.append(tableColumnEl);  
  }
  tableEl.append(tableBodyEl);
  showPortFolioListEl.append(tableEl);
}

// fetch user input and save new portfolio to local storage
var savePortfolio = function (event) {
    event.preventDefault();
    var namePortfolio = namePortfolioEl.val();
    var investmentAmount = investmentAmountEl.val();
  
    if (!namePortfolio || !investmentAmount) {
      errorMessageEl.text("Please enter required fields!")        
      return;
    }
  
    var portfolioObject = {
        userid: userId,
        portfolioname: namePortfolio,
        investmentamount: investmentAmount
    };

    dbuserportfolio = JSON.parse(localStorage.getItem("dbuserportfolio") || "[]");
    dbuserportfolio.push(portfolioObject);
    localStorage.setItem("dbuserportfolio", JSON.stringify(dbuserportfolio));
    
    // resets form
    namePortfolioEl.val('');
    investmentAmountEl.val('');
    modelCreatePortfolioEl.removeClass('is-active');
    displayPortfolio();
  };

  // Event listener to add new portfolio
  formCreatePortfolio.on('submit', savePortfolio);
  
  // remove portfolio if user request  
  function deletePortfolio(id)
  {
    var dbuserportfolio = JSON.parse(localStorage.getItem("dbuserportfolio"));         
    var newLocalStorage = [];
    for(var i=0; i<dbuserportfolio.length; i++)
    {
        if(id != i)  
        {
            newLocalStorage.push(dbuserportfolio[i]);
        }        
    }
    localStorage.setItem("dbuserportfolio", JSON.stringify(newLocalStorage));
    displayPortfolio();
  }

  //event delegation use to remove portfolio
  showPortFolioListEl.on('click', '.fa-remove', function (event) {
    var ans = confirm("Are you sure want to delete selected portfolio?")
    if(ans == true)
    {
       deletePortfolio($(this).attr('id'));
    }    
  });
   
 // Following are functions/calls for My Portfolios - Individual Page
// Flow:
// 1. displaySinglePortfolio() will render portfolio details from localStorage + API

// show single portfolio when clicked
  function displaySinglePortfolio(portfolioName)
  {
    h1El.html("<a href='portfolio.html'>My Portfolios</a> / " + portfolioName);
    buttonCreatePortfolioEl.hide();
    buttonAddSymbolEl.show();

  }
  

  //event delegation user click portfolio
  showPortFolioListEl.on('click', '.portfoliolink', function (event) {
    displaySinglePortfolio($(this).text());      
    
  });

  function init()
  {
    displayPortfolio();
    buttonAddSymbolEl.hide();
  }

  init();