// Selectors to use for My Portfolios - List Page
var formCreatePortfolio = $('#form-create-portfolio');
var namePortfolioEl = $('#portfolio-name');
var investmentAmountEl = $('#investment-amount');
var errorMessageEl = $('#error-message');
var showPortFolioListEl = $('#show-portfolio-list');
var modelCreatePortfolioEl = $('#modal-create-portfolio');

// Selectors to use for My Porfolios - Individual Portfolio Page
var buttonCreatePortfolioEl = $('#btn-create-protfolio');
var buttonAddSymbolEl = $('#btn-add-symbol');
var h1El = $('h1');
const userId = JSON.parse(sessionStorage.getItem('loggedin')).user || '';
// LocalStorage dbuserportfolio will hold userid, portfolioname, and investmentamount

// Following are functions/calls for My Portfolios - List Page
// Flow:
// 1. function init() will call displayPortfolio
// 2. displayPortfolio() will render portfolio list from localStorage + API
// 3. Add new portfolio form will call savePortfolio to fetch user input and save to localStorage
// 4. deletePortfolio will listen for user request to delete exisiting portfolio

// Render portfolio from localStorage in table format
function displayPortfolio() {  
  showPortFolioListEl.text(''); 
  var dbuserportfolio = JSON.parse(localStorage.getItem("dbuserportfolio")) || [];  
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

  if(!userId){
    $('#modal-please-log-in').addClass('is-active');
    $('html').addClass('is-clipped');
    return;
  }

  for(var i=0; i<dbuserportfolio.length; i++) {      
    if(dbuserportfolio[i].userid === userId) {
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
  }  

  tableEl.append(tableBodyEl);
  showPortFolioListEl.append(tableEl);
  
}

// fetch user input and save new portfolio to local storage
var savePortfolio = function (event) {
  event.preventDefault();
  var namePortfolio = namePortfolioEl.val().trim();
  var investmentAmount = investmentAmountEl.val();
  var dbuserportfolio = JSON.parse(localStorage.getItem("dbuserportfolio") || "[]");

  for (let i = 0; i < dbuserportfolio.length; i++) {
    if (dbuserportfolio[i].portfolioname === namePortfolio && dbuserportfolio[i].userid === userId) {
      errorMessageEl.text("Please use a unique name for your portfolio");
      return;
    }
  }

  var portfolioObject = {
      userid: userId,
      portfolioname: namePortfolio,
      investmentamount: investmentAmount
  };

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

buttonCreatePortfolioEl.on('click', () => {
  errorMessageEl.text(' ');
})

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

      var tableColumnEl = $('<th id=daily-gain-loss-total></th>');
      tableColumnEl.text(""); // Show Today's Gain/Loss here
      tableRowEl.append(tableColumnEl);   

      var tableColumnEl = $('<th id=total-gain-loss-total></th>');
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

      createHoldingsTableEl(tableEl, userId, $(this).text());
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
      soldDate: '04/14/2022',
      close: 300 ,
      open: 200
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
      soldDate: '03/20/2022',
      close: 1000,
      open: 900
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
      soldDate: '',
      close: 300,
      open: 200
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
      soldDate: '04/14/2022',
      close: 400,
      open: 100
    },

    {
      userID: 'rodin',
      portfolioID: 'stuff',
      holdingID: 'GME-3',
      symbol: 'GME',
      purchasePrice: 900,
      QTY: 100,
      purchaseDate: '04/14/2022',
      isSold: false,
      salePrice: 0,
      soldDate: '',
      close: 300,
      open: 200
    },

    {
      userID: 'rodin',
      portfolioID: 'stuff',
      holdingID: 'APPL-1',
      symbol: 'APPL',
      purchasePrice: 700,
      QTY: 400,
      purchaseDate: '04/14/2022',
      isSold: false,
      salePrice: 0,
      soldDate: '',
      close: 300,
      open: 200
    }
  ];

  let myHoldings = []

  for (let i = 0; i < allHoldings.length; i++) {
    if (allHoldings[i].userID === myId && allHoldings[i].portfolioId === myPortfolio) {
      myHoldings.push(allHoldings[i]);
    }
  }

  return myHoldings;
}

const numToTwoDec = (num) => Math.round(num * 100)/100

const formatNumbers = (numArr) => {
  const num = numToTwoDec(numArr[0]);
  const percentage = numToTwoDec(numArr[1]);
  let formattedNum = '';
  let formattedPercentage = percentage.toLocaleString() + '%';

  if (numArr[0] >= 0) {
    formattedNum = '+$' + num.toLocaleString();
    formattedPercentage = '+' + formattedPercentage;
  } else {
    formattedNum = '-$' + (Math.abs(num)).toLocaleString();
  }

  return [formattedNum, formattedPercentage];
}

const calculateGainsLosses = (previousPrice, currentPrice, qty) => {
  let gainsLosses = (qty*currentPrice)-(qty*previousPrice);
  let percentage = gainsLosses/(qty*previousPrice) * 100;
  return [gainsLosses, percentage];
}

const getAverageValues = (allHoldings) => {
  
  const allSymbols = [];
  const averageBySymbol = [];
  const sortedBySymbols = [];

  allHoldings.forEach((holding) => {
    if (!allSymbols.includes(holding.symbol)) {
      allSymbols.push(holding.symbol);
    }
  });

  
  allSymbols.forEach((symbol) => {
    sortedBySymbols.push(allHoldings.filter(holding => holding.symbol === symbol));
  });

  sortedBySymbols.forEach((holdings) => {

    let averages = {
      symbol: holdings[0].symbol,
      close: holdings[0].close,
      open: holdings[0].open,
      dailyGL: [0, 0],
      totalGL: [0, 0],
      costBasisAvg: 0,
      currentValueTotal: 0,
      quantityTotal: 0,
    }

    holdings.forEach((holding) => {

      const dailyGLArr = calculateGainsLosses(holding.open, holding.close, holding.QTY);
      averages.dailyGL = [averages.dailyGL[0] + dailyGLArr[0], averages.dailyGL[1] + dailyGLArr[1]];

      const totalGLArr = calculateGainsLosses(holding.purchasePrice, holding.close, holding.QTY);
      averages.totalGL = [averages.totalGL[0] + totalGLArr[0], averages.totalGL[1] + totalGLArr[1]];

      averages.costBasisAvg += holding.purchasePrice * holding.QTY;
      averages.currentValueTotal += holding.close * holding.QTY;
      averages.quantityTotal = averages.quantityTotal + holding.QTY;
    });

    averages.dailyGL = [averages.dailyGL[0]/holdings.length, averages.dailyGL[1]/holdings.length];
    averages.totalGL = [averages.totalGL[0]/holdings.length, averages.totalGL[1]/holdings.length];
    averages.costBasisAvg /= holdings.length;
    averageBySymbol.push(averages);
  });

  return averageBySymbol;  
}

const createSymbolEl = (holding) => $(`<td id=sym-${holding.symbol}>${holding.symbol}</td>`);

const createLastPriceEl = (holding, lastPrice) => $(`<td id=last-price-${holding.symbol}>$${lastPrice}</td>`);

const createDailyGainLossEl = (holding, dailyGainsArray) => $(`<td id=daily-gain-loss-${holding.symbol}><div>${dailyGainsArray[0]}</div><div>${dailyGainsArray[1]}</div></td>`);

const createTotalGainLossEl = (holding, totalGainsArray) => $(`<td id=total-gain-loss-${holding.symbol}><div>${totalGainsArray[0]}</div><div>${totalGainsArray[1]}</div></td>`);

const createCurrentValueEl = (holding, currentValue) => $(`<td id=current-value-${holding.symbol}>${currentValue}</td>`);

const createQuantityEl = (holding) => $(`<td id=qty-${holding.symbol}>${holding.quantityTotal} share(s)</td>`)

const createCostBasisEl = (holding, cb) => (`<td id=cost-basis-${holding.symbol}>${cb}</td>`);

const createNewTableRow = (holding, tblEl) => $(tblEl).append(`<tr id=tr-${holding.symbol}><tr>`);

const createHoldingsTableEl = (table, userId, portfolioId) => {
  const holdings = getHoldings(userId, portfolioId);
  const averagedHoldings = getAverageValues(holdings);

  let accountTotals = {
    dailyGainLoss: 0,
    dailyGainLossP: 0,
    totalGainLoss: 0,
    totalGainLossP: 0,
    currentValue: 0
  }

  for (let i=0; i < averagedHoldings.length; i++) {
    createNewTableRow(averagedHoldings[i], table);
    const dailyGainLoss = averagedHoldings[i].dailyGL;
    const totalGainLoss = averagedHoldings[i].totalGL;
    const currentValue = averagedHoldings[i].currentValueTotal;
    const costBasis = averagedHoldings[i].costBasisAvg;

    const fDailyGainLoss = formatNumbers(dailyGainLoss);
    const fTotalGainLoss = formatNumbers(totalGainLoss);
    const fCurrentValue = '$' + (numToTwoDec(currentValue)).toLocaleString();
    const fCostBasis = '$' + (numToTwoDec(costBasis)).toLocaleString();
    
    $(table).children(`#tr-${averagedHoldings[i].symbol}`).append(createSymbolEl(averagedHoldings[i]));
    $(table).children(`#tr-${averagedHoldings[i].symbol}`).append(createLastPriceEl(averagedHoldings[i], averagedHoldings[i].close));
    $(table).children(`#tr-${averagedHoldings[i].symbol}`).append(createDailyGainLossEl(averagedHoldings[i], fDailyGainLoss));
    $(table).children(`#tr-${averagedHoldings[i].symbol}`).append(createTotalGainLossEl(averagedHoldings[i], fTotalGainLoss));
    $(table).children(`#tr-${averagedHoldings[i].symbol}`).append(createCurrentValueEl(averagedHoldings[i], fCurrentValue));
    $(table).children(`#tr-${averagedHoldings[i].symbol}`).append(createQuantityEl(averagedHoldings[i]));
    $(table).children(`#tr-${averagedHoldings[i].symbol}`).append(createCostBasisEl(averagedHoldings[i], fCostBasis));
    
    console.log(`Holding: ${averagedHoldings[i].symbol} Current Price: $${averagedHoldings[i].close} Previous Price: $${averagedHoldings[i].open} QTY: ${averagedHoldings[i].quantityTotal} Cost Basis Avg: $${averagedHoldings[i].costBasisAvg}`);
    
    accountTotals.dailyGainLoss += dailyGainLoss[0];
    accountTotals.dailyGainLossP += dailyGainLoss[1];
    accountTotals.totalGainLoss += totalGainLoss[0];
    accountTotals.totalGainLossP += totalGainLoss[1];
    accountTotals.currentValue += currentValue;
  }

  const fAccTotalsDGL = formatNumbers([accountTotals.dailyGainLoss, accountTotals.dailyGainLossP]); 
  const fAccTotalsTGL = formatNumbers([accountTotals.totalGainLoss, accountTotals.totalGainLossP]);
  accountTotals.currentValue = numToTwoDec(accountTotals.currentValue);

  $(`#daily-gain-loss-total`).text(`${fAccTotalsDGL[0]} (${fAccTotalsDGL[1]})`);
  $(`#total-gain-loss-total`).text(`${fAccTotalsTGL[0]} (${fAccTotalsTGL[1]})`);
  $(`#current-value-total`).text(`$${accountTotals.currentValue.toLocaleString()}`);
}


// end of Rodin's code -------------------------------------------->

function init_portfolio() {    
  displayPortfolio();
  buttonAddSymbolEl.hide();
}

init_portfolio()