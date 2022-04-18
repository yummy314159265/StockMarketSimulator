const api ="6SvIn0fus9qTZENF39DKiWYPpDbxbFy5";

// fetch("https://api.polygon.io/v3/reference/tickers?active=true&sort=ticker&order=asc&limit=10&apiKey=6SvIn0fus9qTZENF39DKiWYPpDbxbFy5").then(
//     function (response){
//         return response.json();
//     }
// )

var searchterm="GOOGL"
var symbol = $('#symbol-name')
var select = $('#trade-action');
//  var option = select[0].options[select[0].selectedIndex].value
var quant = $('#stock-qty')
var submit = $('#form-create-symbol')
var costbasis;
var lastprice;
var lastopen;
// var quantity=quant[0].value;
var today;
var total;
var currvalue;
var currentuser=JSON.parse(sessionStorage.getItem("userid"));

// var currentportfolio=JSON.parse(sessionStorage.getItem("portfolioid") || "");
//  var currentportfolio=JSON.parse(sessionStorage.getItem("portfolioid") || "");
console.log(select[0].options[select[0].selectedIndex].value)

const getPortfolio = () => JSON.parse(sessionStorage.getItem("portfolio") || "");
const getBuySellHistory = () => JSON.parse(localStorage.getItem("buysellhistory")|| "[]");
const getHoldings = () => JSON.parse(localStorage.getItem("holdings") || "[]");
const getDBPortfolio = () => JSON.parse(localStorage.getItem("dbuserportfolio") || "[]");

const setPortfolio = (portfolio) => sessionStorage.setItem("portfolio", JSON.stringify(portfolio));
const setBuySellHistory = (history) => localStorage.setItem("buysellhistory", JSON.stringify(history));
const setHoldings = (holdings) => localStorage.setItem("holdings", JSON.stringify(holdings));
const setDBPortfolio = (portfoliodb) => localStorage.setItem("dbuserportfolio", JSON.stringify(portfoliodb));

const getHoldingsTableEl = () => $('#holdings-table');
const getSymbolTableRowsEl = () => $('.symbols');

const updatePortfolio = (amt) => {

    const currentportfolio = getPortfolio();
    const holdings = getHoldings();
    const dbportfolio = getDBPortfolio();

    currentportfolio.previousamount = currentportfolio.amount;
    currentportfolio.amount -= amt;

    for (let i = 0; i < holdings.length; i++){
        if(holdings[i].portfolioid === currentportfolio.id) {
            holdings[i].portfoliopreviousamt = currentportfolio.previousamount;
            holdings[i].portfolioamt = currentportfolio.amount;
        }
    }

    dbportfolio[currentportfolio.id].liquid = currentportfolio.amount;

    setPortfolio(currentportfolio);
    setDBPortfolio(dbportfolio);
    setHoldings(holdings);
}

function storeTrade(){
    const currentportfolio = getPortfolio();
    const buysellhistory = getBuySellHistory();
    const holdings = getHoldings();

    $('#trade-error-message').text(' ')

    var holdingsobj = {
        holdingsid: holdings.length,
        userId: currentuser,
        symbol: symbol.val(),
        costbasis: costbasis,
        lastprice: lastprice,
        lastopen: lastopen,
        quantity: quantity,
        currvalue: currvalue, 
        purchasedate: moment().format('MM/DD/YYYY'),
        issold: false, 
        soldfor: null,
        portfolioid: currentportfolio.id,
        portfolioamt: currentportfolio.amount,
        portfoliopreviousamt: currentportfolio.previousamount,
        portfoliooriginalinvestment: currentportfolio.originalinvestment
    };

    var historyobj={
        userId: currentuser, 
        symbol : symbol.val(),
        costbasis: costbasis, 
        lastprice: lastprice,
        quantity:quantity,
        currvalue:currvalue, 
        soldfor: null,
        historyid: buysellhistory.length,
        portfolioid: currentportfolio.id,
        portfolioamt: currentportfolio.amount,
        portfoliopreviousamt: currentportfolio.previousamount,
        portfoliooriginalinvestment: currentportfolio.originalinvestment
    }
    //update buysellhistory
    historyobj.type="Buy"
    buysellhistory.push(historyobj);
    localStorage.setItem("buysellhistory", JSON.stringify(buysellhistory));
    
  
    //update holdings
    for(let i=0; i<holdings.length;i++){
        if(symbol.val()===holdings[i].symbol && currentportfolio.id === holdings[i].portfolioid){
            holdings[i].quantity=parseInt(holdings[i].quantity)+parseInt(quantity);
            holdings[i].lastprice=lastprice;
            holdings[i].costbasis=parseInt((holdings[i].costbasis)+costbasis)/2
            holdings[i].currvalue=parseInt(holdings[i].lastprice)*parseInt(holdings[i].quantity);
            localStorage.setItem("holdings", JSON.stringify(holdings));
            return;
        }
    }
    holdings.push(holdingsobj);
    localStorage.setItem("holdings", JSON.stringify(holdings));
}

submit.on('submit',function(event){
    event.preventDefault();   
    $('#trade-error-message').text(' ')
    const currentportfolio = getPortfolio();
    const holdingsTableEl= getHoldingsTableEl();
    const symbolTableRowsEl = getSymbolTableRowsEl();

    option = select[0].options[select[0].selectedIndex].value
    fetch("https://api.polygon.io/v2/aggs/ticker/" + symbol.val() + "/prev?adjusted=true&apiKey=6SvIn0fus9qTZENF39DKiWYPpDbxbFy5")
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(data){
                        if (data.resultsCount === 0) {
                            $('#trade-error-message').text('Cannot find symbol')
                        } else {
                            if(option==="Buy"){
                                        console.log("buy")
                                costbasis= data.results[0].c*quant[0].value
                                lastprice=data.results[0].c
                                today=data.results[0].c-data.results[0].o;
                                lastopen=data.results[0].o
                                total=costbasis-lastprice;
                                quantity=quant[0].value;
                                currvalue=lastprice*quantity;
                                    console.log(lastprice,today,total,currvalue,quantity,costbasis);
                                    if (currvalue > currentportfolio.amount){
                                        $('#trade-error-message').text('You do not have enough to buy this amount.')
                                        return
                                    } else {
                                        updatePortfolio(currvalue);
                                        storeTrade();
                                    }
                            }

                            else if(option==="Sell"){
                                console.log("sell")
                                costbasis= data.results[0].c
                                lastprice=data.results[0].c
                                today=data.results[0].c-data.results[0].o;
                                total=costbasis-lastprice;
                                quantity=quant[0].value;
                                currvalue=lastprice*quantity;
                                console.log(lastprice,today,total,currvalue,quantity,costbasis);
                                sell(symbol.val(),quantity);
                            }
                        }

                        symbolTableRowsEl.remove();
                        createHoldingsTableEl(holdingsTableEl, currentportfolio.id)
                        $('#modal-trade').removeClass('is-active');
                        $('html').removeClass('is-clipped');

                    })
            } else {
                $('#trade-error-message').text("Error " + response.status + ' - Try again later');
            }
        })
        .catch((error) => {
            $('#trade-error-message').text(error + ' - Try again later');
        })      
})



function sell(symbol,amt){

$('#trade-error-message').text(' ')

const buysellhistory = getBuySellHistory();
const currentportfolio = getPortfolio();
const holdings = getHoldings();

for(let i=0;i<holdings.length;i++){
    if (currentportfolio.id === holdings[i].portfolioid) {
        if(holdings[i].symbol===symbol){
            
            if(parseInt(holdings[i].quantity)===parseInt(amt)){
                console.log("logic 1")
                holdings[i].issold=true;
                console.log(holdings[i])
                holdings[i].soldfor=holdings[i].currvalue;
                holdings[i].type="Sell"
                holdings[i].historyid=buysellhistory.length
                buysellhistory.push(holdings[i])
                holdings.splice(i,1)
                localStorage.setItem("holdings",JSON.stringify(holdings));
                localStorage.setItem('buysellhistory', JSON.stringify(buysellhistory));
                updatePortfolio(-currvalue);
                return;
            }
            else if(parseInt(holdings[i].quantity)>amt){
                console.log("logic 2")
                    var historyobj=Object.assign({},holdings[i])
                    historyobj.quantity=amt;
                    historyobj.issold=true;
                    historyobj.currvalue=amt*parseInt(historyobj.lastprice);
                    historyobj.type="Sell"
                    historyobj.historyid=buysellhistory.length
                    buysellhistory.push(historyobj);
                    localStorage.setItem("buysellhistory",JSON.stringify(buysellhistory))
                    holdings[i].quantity=parseInt(holdings[i].quantity)-amt;
                    console.log(holdings[i].quantity)
                    holdings[i].currvalue=parseInt(holdings[i].quantity)*parseInt(holdings[i].lastprice);
                    localStorage.setItem("holdings",JSON.stringify(holdings))
                    updatePortfolio(-currvalue);
                    return;
            }
            else{
                $('#trade-error-message').text("You cannot sell more than you have")
                return;
            }
        }

    }

}

$('#trade-error-message').text("You do not have any to trade")
}




// function pagerefresh(){
// for(let i=0; i<holdings.length;i++){
//     holdings[i]
// }
// }
// pagerefresh();





