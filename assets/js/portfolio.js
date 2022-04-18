// Selectors to use for My Portfolios - List Page
var formCreatePortfolio = $('#form-create-portfolio');
var namePortfolioEl = $('#portfolio-name');
var investmentAmountEl = $('#investment-amount');
var errorMessageEl = $('#create-portfolio-error-message');
var tradeErrorMessageEl = $('#trade-error-message')
var showPortFolioListEl = $('#show-portfolio-list');
var modelCreatePortfolioEl = $('#modal-create-portfolio');
const mainEl = $('#main')
let dollarUSLocale = Intl.NumberFormat('en-US');


// Selectors to use for My Porfolios - Individual Portfolio Page
var buttonCreatePortfolioEl = $('#btn-create-protfolio');
var buttonAddSymbolEl = $('#btn-add-symbol');
var h1El = $('h1');
const modalDeleteEl = $('#modal-delete');
const deleteConfirmEl = $('#delete-confirm');
const deleteCancelEl = $('#delete-cancel');

var tradeSubmitButton = $('#form-create-symbol');

const userId = JSON.parse(sessionStorage.getItem('userid'));
const loggedin = JSON.parse(sessionStorage.getItem('loggedin'));
const getDBUserPortfolio = () => JSON.parse(localStorage.getItem('dbuserportfolio')) || [];
const setDBUserPortfolio = (portfolio) => localStorage.setItem('dbuserportfolio', JSON.stringify(portfolio));
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

  if(!loggedin){
    $('#modal-please-log-in').addClass('is-active');
    $('html').addClass('is-clipped');
    buttonCreatePortfolioEl.attr('data-target', 'modal-please-log-in');
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
      tableColumnEl.attr('data-id', dbuserportfolio[i].portfolioid)
      tableColumnEl.attr('data-amt', dbuserportfolio[i].liquid)
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
      tableColumnEl.text('$' + dollarUSLocale.format(dbuserportfolio[i].currentvalue));
      tableBodyEl.append(tableColumnEl);   
      
      // 5th column calculate profit/loss from diffrence between current market value and total investment
      var totalgainloss = dbuserportfolio[i].currentvalue-dbuserportfolio[i].investmentamount
      var tableColumnEl = $('<td>');
      tableColumnEl.text('$' + dollarUSLocale.format(totalgainloss));
      tableBodyEl.append(tableColumnEl);        

        // 6th column Delete icon
        var tableColumnEl = $('<td>');
        var faIconEl = "<i data-id=" + dbuserportfolio[i].portfolioid +" class='js-modal-trigger fa fa-remove fa-hand-pointer fa-2xl' data-target=modal-delete></i>";      
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
      portfolioid: dbuserportfolio.length,
      portfolioname: namePortfolio,
      investmentamount: investmentAmount,
      currentvalue: investmentAmount,
      liquid: investmentAmount
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
 
  // for(var i=0; i<dbuserportfolio.length; i++)
  // {
  //     if(id != i)  
  //     {
  //         newLocalStorage.push(dbuserportfolio[i]);
  //     }        
  // }
  const dbuserportfolio = JSON.parse(localStorage.getItem("dbuserportfolio")) || [];    
  const holdings = JSON.parse(localStorage.getItem("holdings")) || [];   
  const history = JSON.parse(localStorage.getItem("buysellhistory")) || [];

  const newDbUserPortfolio = dbuserportfolio.filter(portfolio => portfolio.portfolioid != id)
  const newHoldings = holdings.filter(holding => holding.portfolioid != id)
  const newHistory = history.filter(hist => hist.portfolioid != id)
  
  localStorage.setItem('dbuserportfolio', JSON.stringify(newDbUserPortfolio));
  localStorage.setItem('holdings',JSON.stringify(newHoldings));
  localStorage.setItem('buysellhistory',JSON.stringify(newHistory));
  location.reload();
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

function createPortfolioTable(event) {
  event.preventDefault();
  $('#history-table').remove();
  displaySinglePortfolio($(this).text());      
  const thisPortfolio = JSON.parse(localStorage.getItem("dbuserportfolio"))[$(this).attr('data-id')] || [];

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

      sessionStorage.setItem('portfolio', JSON.stringify({
        id: parseInt($(this).attr('data-id')),
        amount: parseInt($(this).attr('data-amt')),
        originalinvestment: parseInt(thisPortfolio.investmentamount)
      }));

      const showHistoryLinkEl = $(`<div class=transaction-history-div><a class=transaction-link id=show-history-link-${$(this).attr('data-id')} data-id=${$(this).attr('data-id')} data-amt=${$(this).attr('data-amt')} data-name=${$(this).text()}>Transaction History</a></div>`)

      mainEl.append(showHistoryLinkEl)

// start of Rodin's code -------------------------------------------->

      createHoldingsTableEl(tableEl, thisPortfolio.portfolioid);
};


// Event listener to add new portfolio
formCreatePortfolio.on('submit', savePortfolio); 

buttonCreatePortfolioEl.on('click', () => {
  errorMessageEl.text(' ');
})

// event delegation use to remove portfolio
showPortFolioListEl.on('click', '.fa-remove', function (event) {
  event.preventDefault();
  deleteConfirmEl.attr('data-id', $(this).attr('data-id'));
});

deleteConfirmEl.on('click', function (event) {
  event.preventDefault();
  modalDeleteEl.removeClass('is-active');
  $('html').removeClass('is-clipped');
  deletePortfolio($(this).attr('data-id'))
})

deleteCancelEl.on('click', (event) => {
  event.preventDefault();
  modalDeleteEl.removeClass('is-active');
  $('html').removeClass('is-clipped');
})

const getHistory = () => {
  const allHistory = JSON.parse(localStorage.getItem('buysellhistory'));
  const portfolio = JSON.parse(sessionStorage.getItem('portfolio'))
  const myHistory = [];

  for (let i = 0; i < allHistory.length; i++) {
    if (allHistory[i].portfolioid === portfolio.id) {
      myHistory.push(allHistory[i]);
    }
  }

  return myHistory;
}
const createNewHistoryTableRow = (history, table) => $(table).append(`<tr class=history id=tr-${history.historyid}></tr>`)

const createHistoryTableEl = (currentPortfolio) => {
  let historyTableEl = $('#history-table');
  let transactionHistory = getHistory(currentPortfolio);


  for (let i = 0; i < transactionHistory.length; i++) {
    createNewHistoryTableRow(transactionHistory[i], historyTableEl);
    const type = transactionHistory[i].type;
    const symbol = transactionHistory[i].symbol;
    const price = transactionHistory[i].lastprice;
    const quantity = transactionHistory[i].quantity;
    const totalGainLoss = calculateGainsLosses(price, transactionHistory[i].lastprice, quantity);
    const currentValue = dollarUSLocale.format(transactionHistory[i].currvalue);
    const costBasis = dollarUSLocale.format(transactionHistory[i].costbasis);
    const fTotalGainLoss = formatNumbers(totalGainLoss);

    
    //type
    historyTableEl.children(`#tr-${transactionHistory[i].historyid}`).append(`<td>${type}</td>`);
    //symbol
    historyTableEl.children(`#tr-${transactionHistory[i].historyid}`).append(`<td>${symbol}</td>`);
    //price
    historyTableEl.children(`#tr-${transactionHistory[i].historyid}`).append(`<td>${price}</td>`);
    //total gain/loss
    historyTableEl.children(`#tr-${transactionHistory[i].historyid}`).append(`<td><div>${fTotalGainLoss[0]}</div><div>${fTotalGainLoss[1]}</div></td>`);
    //currentvalue
    historyTableEl.children(`#tr-${transactionHistory[i].historyid}`).append(`<td>$${currentValue}</td>`);
    //quantity
    historyTableEl.children(`#tr-${transactionHistory[i].historyid}`).append(`<td>${quantity} share(s)</td>`);
    //cost basis
    historyTableEl.children(`#tr-${transactionHistory[i].historyid}`).append(`<td>$${costBasis}</td>`);
  }
}

mainEl.on('click', '.transaction-link', function (event) {
  event.preventDefault();
  $(this).remove();
  $('#holdings-table').remove();
  buttonAddSymbolEl.hide();
  h1El.html(`<a href='portfolio.html'>My Portfolios</a> / <a class=portfoliolink data-id=${$(this).attr('data-id')} data-amt=${$(this).attr('data-amt')}> ${$(this).attr('data-name')} </a> / transaction history`);
  let historyTableEl = $(`<table class='table is-fullwidth' id=history-table>`);
  let historyTableHeadEl = $(`<thead>
  <tr>
    <th>Type</th>
    <th>Symbol</th>
    <th>Price Bought/Sold</th>
    <th>Total Gain/Loss</th>
    <th>Current Value</th>
    <th>Quantity</th>
    <th>Cost Basis</th>
  </tr>
  </thead>
  `);
  historyTableEl.append(historyTableHeadEl);
  mainEl.append(historyTableEl);

  historyTableEl.append(createHistoryTableEl());
  
})

//event delegation user click portfolio
mainEl.on('click', '.portfoliolink', createPortfolioTable)

const getMyHoldings = (myPortfolio) => {
  let allHoldings = JSON.parse(localStorage.getItem('holdings') || '[]');
  let myHoldings = [];



  for (let i = 0; i < allHoldings.length; i++) {
    if (allHoldings[i].portfolioid === myPortfolio) {
      myHoldings.push(allHoldings[i]);
    }
  }

  return myHoldings;
}

const numToTwoDec = (num) => Math.round(num * 100)/100

const formatNumbers = (numArr) => {
  const percentage = numToTwoDec(numArr[1]) || 0;
  let formattedNum = '';
  let formattedPercentage = percentage.toLocaleString() + '%';

  if (numArr[0] >= 0) {
    formattedNum = '+$' + dollarUSLocale.format(numArr[0]);
    formattedPercentage = '+' + formattedPercentage;
  } else {
    formattedNum = '-$' + dollarUSLocale.format(Math.abs(numArr[0]));
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

const createQuantityEl = (holding) => $(`<td id=qty-${holding.symbol}>${holding.quantity} share(s)</td>`)

const createCostBasisEl = (holding, cb) => (`<td id=cost-basis-${holding.symbol}>${cb}</td>`);

const createNewTableRow = (holding, tblEl) => $(tblEl).append(`<tr class="symbols" id=tr-${holding.symbol}></tr>`);

const createHoldingsTableEl = (table, thisPortfolio) => {
  const holdings = getMyHoldings(thisPortfolio);
  const dbuserportfolio = getDBUserPortfolio();

  // const averagedHoldings = getAverageValues(holdings);

  let accountTotals = {
    dailyGainLoss: 0,
    dailyGainLossP: 0,
    totalGainLoss: 0,
    totalGainLossP: 0,
    currentValue: 0
  }

  for (let i=0; i < holdings.length; i++) {
    createNewTableRow(holdings[i], table);
    const symbol = holdings[i].symbol
    const closePrice = holdings[i].lastprice
    const openPrice = holdings[i].lastopen
    const quantity = holdings[i].quantity

    const costBasis = holdings[i].costbasis/quantity
    const dailyGainLoss = calculateGainsLosses(openPrice, closePrice, quantity);
    const totalGainLoss = calculateGainsLosses(costBasis, closePrice, quantity);
    const currentValue = holdings[i].currvalue
  
    // const dailyGainLoss = averagedHoldings[i].dailyGL;
    // const totalGainLoss = averagedHoldings[i].totalGL;
    // const currentValue = averagedHoldings[i].currentValueTotal;
    // const costBasis = averagedHoldings[i].costBasisAvg;

    let fDailyGainLoss;
    let fTotalGainLoss;
    let fCurrentValue;
    let fCostBasis;

    if (moment().format('MM/DD/YYYY') === holdings[i].purchasedate) {
      fDailyGainLoss = formatNumbers([0,0]);
      fTotalGainLoss = formatNumbers([0,0]);
      fCurrentValue = '$' + dollarUSLocale.format(currentValue);
      fCostBasis = '$' + dollarUSLocale.format(costBasis*quantity);
      accountTotals.dailyGainLoss = 0;
      accountTotals.totalGainLoss = 0;
    } else {
      fDailyGainLoss = formatNumbers(dailyGainLoss);
      fTotalGainLoss = formatNumbers(totalGainLoss);
      fCurrentValue = '$' + dollarUSLocale.format(currentValue);
      fCostBasis = '$' + dollarUSLocale.format(costBasis*quantity);
      accountTotals.dailyGainLoss += dailyGainLoss[0];
      accountTotals.totalGainLoss += totalGainLoss[0];
    }
    
    $(table).children(`#tr-${symbol}`).append(createSymbolEl(holdings[i]));
    $(table).children(`#tr-${symbol}`).append(createLastPriceEl(holdings[i], closePrice));
    $(table).children(`#tr-${symbol}`).append(createDailyGainLossEl(holdings[i], fDailyGainLoss));
    $(table).children(`#tr-${symbol}`).append(createTotalGainLossEl(holdings[i], fTotalGainLoss));
    $(table).children(`#tr-${symbol}`).append(createCurrentValueEl(holdings[i], fCurrentValue));
    $(table).children(`#tr-${symbol}`).append(createQuantityEl(holdings[i]));
    $(table).children(`#tr-${symbol}`).append(createCostBasisEl(holdings[i], fCostBasis));

    accountTotals.currentValue += currentValue;
  }

  accountTotals.dailyGainLossP += accountTotals.dailyGainLoss/accountTotals.currentValue*100;
  accountTotals.totalGainLossP += accountTotals.totalGainLoss/accountTotals.currentValue*100;

  const fAccTotalsDGL = formatNumbers([accountTotals.dailyGainLoss, accountTotals.dailyGainLossP]); 
  const fAccTotalsTGL = formatNumbers([accountTotals.totalGainLoss, accountTotals.totalGainLossP]);
  const fAccTotalsCV = `$${dollarUSLocale.format(accountTotals.currentValue)}`;

  $(`#daily-gain-loss-total`).text(`${fAccTotalsDGL[0]} (${fAccTotalsDGL[1]})`);
  $(`#total-gain-loss-total`).text(`${fAccTotalsTGL[0]} (${fAccTotalsTGL[1]})`);
  $(`#current-value-total`).text(fAccTotalsCV);
  dbuserportfolio.currentvalue = accountTotals.currentValue + dbuserportfolio.liquid;
  setDBUserPortfolio(dbuserportfolio);
}


// end of Rodin's code -------------------------------------------->

function init_portfolio() {    
  displayPortfolio();
  buttonAddSymbolEl.hide();
}

init_portfolio()