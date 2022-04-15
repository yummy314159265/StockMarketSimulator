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

  
// remove portfolio if user request  
function deletePortfolio(id) {
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
   
// Following are functions/calls for My Portfolios - Individual Page
// Flow:
// 1. displaySinglePortfolio() will render portfolio details from localStorage + API

// show single portfolio when clicked
function displaySinglePortfolio(portfolioName) {
  h1El.html("<a href='portfolio.html'>My Portfolios</a> / " + portfolioName);
  buttonCreatePortfolioEl.hide();
  buttonAddSymbolEl.show();
  showPortFolioListEl.html('');
}


// Event listener to add new portfolio
formCreatePortfolio.on('submit', savePortfolio); 

//event delegation use to remove portfolio
showPortFolioListEl.on('click', '.fa-remove', function (event) {
  var ans = confirm("Are you sure want to delete selected portfolio?")
  if(ans == true)
  {
      deletePortfolio($(this).attr('id'));
  }    
});

//event delegation user click portfolio
showPortFolioListEl.on('click', '.portfoliolink', function (event) {
  displaySinglePortfolio($(this).text());      
      // Create Table
    var tableEl = $('<table id=holdings-table>');
    tableEl.attr('class', 'table table is-fullwidth');

    // Create Table Head
    var tableHeadEl = $('<thead>');
    tableEl.append(tableHeadEl);

    // Create Table Row
    var tableRowEl = $('<tr>');
    tableHeadEl.append(tableRowEl);

    // Create Table Column
    var tableColumnEl = $('<th>');
    tableColumnEl.text('Symbol');
    tableRowEl.append(tableColumnEl);   
    var tableColumnEl = $('<th>');
    tableColumnEl.text('Last Price');
    tableRowEl.append(tableColumnEl);   
    var tableColumnEl = $('<th>');
    tableColumnEl.text("Today's Gain/Loss");
    tableRowEl.append(tableColumnEl);   
    var tableColumnEl = $('<th>');
    tableColumnEl.text('Total Gain/Loss');
    tableRowEl.append(tableColumnEl);   
    var tableColumnEl = $('<th>');
    tableColumnEl.text('Current Value');
    tableRowEl.append(tableColumnEl);   
    var tableColumnEl = $('<th>');
    tableColumnEl.text('Quantity');
    tableRowEl.append(tableColumnEl);   
    var tableColumnEl = $('<th>');
    tableColumnEl.text('Cost Basis');
    tableRowEl.append(tableColumnEl);   
    tableEl.append(tableEl);
    // Work pending to pull data from localStorage + API
    buttonCreatePortfolioEl.hide();
    buttonAddSymbolEl.show();
    showPortFolioListEl.html('');

    // table footer summary
      // Create Table Row
      var tableFooterEl = $('<tfoot>');

      var tableRowEl = $('<tr>');
      tableFooterEl.append(tableRowEl);

      // Create Table Column
      var tableColumnEl = $('<th>');
      tableColumnEl.text('Account Total');
      tableRowEl.append(tableColumnEl);

      var tableColumnEl = $('<th>');
      tableColumnEl.text('-'); // leave blank
      tableRowEl.append(tableColumnEl);   

      var tableColumnEl = $('<th id=daily-gain-loss-total>');
      tableColumnEl.text(""); // Show Today's Gain/Loss here
      tableRowEl.append(tableColumnEl);   

      var tableColumnEl = $('<th id=total-gain-loss-total>');
      tableColumnEl.text(''); // Show Total Gain/Loss here
      tableRowEl.append(tableColumnEl);   

      var tableColumnEl = $('<th id=current-value-total>');
      tableColumnEl.text(''); // Show current value here
      tableRowEl.append(tableColumnEl);   

      var tableColumnEl = $('<th>');
      tableColumnEl.text('-'); // leave blank
      tableRowEl.append(tableColumnEl);   

      var tableColumnEl = $('<th>');
      tableColumnEl.text('-'); // leave blank
      tableRowEl.append(tableColumnEl);   

      var tableColumnEl = $('<th>');
      tableColumnEl.text(''); // leave blank
      tableRowEl.append(tableColumnEl);   
      
      tableFooterEl.append(tableRowEl);
      tableEl.append(tableFooterEl);

      // Append complte table to Show
      showPortFolioListEl.append(tableEl);

// start of Rodin's code -------------------------------------------->

      // createHoldingsTableEl(tableEl, getCurrentUser(), getPortfolioId());
});



const getHoldings = (myId, myPortfolio) => {
  let allHoldings = JSON.parse(localStorage.getItem('holdings')) || [ //this array is for testing
    {
      userID: 'rodin',
      portfolioID: 'stuff',
      holdingID: 'GME-1',
      symbol: 'GME',
      purchasePrice: 200,
      QTY: 200,
      purchaseDate: '04/13/2022',
      isSold: true,
      salePrice: 4000,
      soldDate: '04/14/2022'
    },

    {
      userID: 'bitboy',
      portfolioID: 'lol',
      holdingID: '0',
      symbol: 'STD',
      purchasePrice: 100,
      QTY: 600,
      purchaseDate: '03/13/2022',
      isSold: true,
      salePrice: .50,
      soldDate: '03/20/2022'
    },

    {
      userID: 'rodin',
      portfolioID: 'stuff',
      holdingID: 'GME-2',
      symbol: 'GME',
      purchasePrice: 300,
      QTY: 400,
      purchaseDate: '04/14/2022',
      isSold: false,
      salePrice: 0,
      soldDate: ''
    },

    {
      userID: 'rodin',
      portfolioID: 'stuff',
      holdingID: 'APPL-1',
      symbol: 'APPL',
      purchasePrice: 1,
      QTY: 1000,
      purchaseDate: '10/13/1990',
      isSold: true,
      salePrice: 500,
      soldDate: '04/14/2022'
    }
  ];

  let myHoldings = []

  for (let i = 0; i < allHoldings.length; i++) {
    if (allHoldings[i].userID === myId && allHoldings[i].portfolioID === myPortfolio) {
      myHoldings.push(allHoldings[i]);
    }
  }

  return myHoldings;
}

const formatNumbers = (numArr) => {
  let formattedNum = '';
  let formattedPercentage = numArr[1].toLocaleString() + '%';

  if (numArr[0] >= 0) {
    formattedNum = '+$' + numArr[0].toLocaleString();
    formattedPercentage = '+' + formattedPercentage;
  } else {
    formattedNum = '-$' + (Math.abs(numArr[0])).toLocaleString();
  }

  return [formattedNum, formattedPercentage];
}

const calculateGainsLosses = (previousPrice, currentPrice, qty) => {
  let gainsLosses = (qty*currentPrice)-(qty*previousPrice);
  // calulating percentage to 2 decimal places
  let percentage = Math.round(gainsLosses/(qty*previousPrice) * 10000)/100;

  return [gainsLosses, percentage];
}

const createSymbolEl = (holding) => $(`<td id=sym-${holding.holdingID}>${holding.symbol}</td>`);

const createLastPriceEl = (holding, lastPrice) => $(`<td id=last-price-${holding.holdingID}>$${lastPrice}</td>`);

const createDailyGainLossEl = (holding, dailyGainsArray) => $(`<td id=daily-gain-loss-${holding.holdingID}><div>${dailyGainsArray[0]}</div><div>${dailyGainsArray[1]}</div></td>`);

const createTotalGainLossEl = (holding, totalGainsArray) => $(`<td id=total-gain-loss-${holding.holdingID}><div>${totalGainsArray[0]}</div><div>${totalGainsArray[1]}</div></td>`);

const createCurrentValueEl = (holding, currentValue) => $(`<td id=current-value-${holding.holdingID}>${currentValue}</td>`);

const createQuantityEl = (holding) => $(`<td id=qty-${holding.holdingID}>${holding.QTY} share(s)</td>`)

const createCostBasisEl = (holding, cb) => (`<td id=cost-basis-${holding.holdingID}>${cb}</td>`);

const createNewTableRow = (holding, tblEl) => $(tblEl).append(`<tr id=tr-${holding.holdingID}><tr>`);

const createHoldingsTableEl = (table, id, portfolio) => {
  let holdings = getHoldings(id, portfolio);
  let previousPrice = 199; // data comes from API
  let currentPrice = 200; // data comes from API
  let accountTotals = {
    dailyGainLoss: 0,
    totalGainLoss: 0,
    currentValue: 0
  }

  for (let i=0; i < holdings.length; i++) {
    createNewTableRow(holdings[i], table);

    const dailyGainLoss = calculateGainsLosses(previousPrice, currentPrice, holdings[i].QTY);
    const totalGainLoss = calculateGainsLosses(holdings[i].purchasePrice, currentPrice, holdings[i].QTY)
    const currentValue = currentPrice * holdings[i].QTY;
    const costBasis = holdings[i].QTY * holdings[i].purchasePrice;

    const fDailyGainLoss = formatNumbers(dailyGainLoss);
    const fTotalGainLoss = formatNumbers(totalGainLoss);
    const fCurrentValue = '$' + (currentValue).toLocaleString();
    const fCostBasis = '$' + (costBasis).toLocaleString();
    
    $(table).children(`#tr-${holdings[i].holdingID}`).append(createSymbolEl(holdings[i]));
    $(table).children(`#tr-${holdings[i].holdingID}`).append(createLastPriceEl(holdings[i], currentPrice));
    $(table).children(`#tr-${holdings[i].holdingID}`).append(createDailyGainLossEl(holdings[i], fDailyGainLoss));
    $(table).children(`#tr-${holdings[i].holdingID}`).append(createTotalGainLossEl(holdings[i], fTotalGainLoss));
    $(table).children(`#tr-${holdings[i].holdingID}`).append(createCurrentValueEl(holdings[i], fCurrentValue));
    $(table).children(`#tr-${holdings[i].holdingID}`).append(createQuantityEl(holdings[i]));
    $(table).children(`#tr-${holdings[i].holdingID}`).append(createCostBasisEl(holdings[i], fCostBasis));
    
    console.log(`Holding: ${holdings[i].holdingID} Current Price: $${currentPrice} Previous Price: $${previousPrice} QTY: ${holdings[i].QTY} Purchase Price: $${holdings[i].purchasePrice}`);
    
    accountTotals.dailyGainLoss += dailyGainLoss[0];
    accountTotals.totalGainLoss += totalGainLoss[0];
    accountTotals.currentValue += currentValue;
  }

  $(`#daily-gain-loss-total`).text(`$${accountTotals.dailyGainLoss.toLocaleString()}`);
  $(`#total-gain-loss-total`).text(`$${accountTotals.totalGainLoss.toLocaleString()}`);
  $(`#current-value-total`).text(`$${accountTotals.currentValue.toLocaleString()}`);
}


// end of Rodin's code -------------------------------------------->

function init() {    
  displayPortfolio();
  buttonAddSymbolEl.hide();
}

init();