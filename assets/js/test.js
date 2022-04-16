const api ="6SvIn0fus9qTZENF39DKiWYPpDbxbFy5";

// fetch("https://api.polygon.io/v3/reference/tickers?active=true&sort=ticker&order=asc&limit=10&apiKey=6SvIn0fus9qTZENF39DKiWYPpDbxbFy5").then(
//     function (response){
//         return response.json();
//     }
// )

var searchterm="GOOGL"
var symbol = $('#symbol-name')
var select = $('#trade-action');
 var option = select[0].options[select[0].selectedIndex].value
var quant = $('#stock-qty')
var submit = $('#form-create-symbol')


var costbasis;
var lastprice;
var quantity=quant[0].value;
var Today;
var total;
var currvalue;
var holdings = JSON.parse(localStorage.getItem("holdings") || "[]");
var currentuser=JSON.parse(sessionStorage.getItem("userid") || "");
// var currentportfolio=JSON.parse(sessionStorage.getItem("portfolioid") || "");
var buysellhistory = JSON.parse(localStorage.getItem("buysellhistory")|| "[]");
localStorage.setItem("portfolioid", JSON.stringify(0));
//  var currentportfolio=JSON.parse(sessionStorage.getItem("portfolioid") || "");
console.log(select[0].options[select[0].selectedIndex].value)
function storeTrade(){
    var holdingsobj = {holdingsid: holdings.length, userId: currentuser,   symbol: symbol.val(), costbasis: costbasis, lastprice: lastprice, quantity: quantity, currvalue: currvalue, issold: false, soldfor: null};
    var historyobj={userId: currentuser, symbol : symbol.val(),costbasis:costbasis, lastprice: lastprice,quantity:quantity,currvalue:currvalue, soldfor: null}
    //update buysellhistory
    historyobj.type="buy"
    buysellhistory.push(historyobj);
    localStorage.setItem("buysellhistory", JSON.stringify(buysellhistory));
    
  
    //update holdings
    for(let i=0; i<holdings.length;i++){
        if(symbol.val()===holdings[i].symbol){
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

submit.on('submit',function(){
    event.preventDefault();   
    option = select[0].options[select[0].selectedIndex].value
    fetch("https://api.polygon.io/v2/aggs/ticker/" + symbol.val() + "/prev?adjusted=true&apiKey=6SvIn0fus9qTZENF39DKiWYPpDbxbFy5").then(
    function(response){
        response.json().then(function(data){
            if(option==="Buy"){
                console.log("buy")
           costbasis= data.results[0].c
           lastprice=data.results[0].c
           today=data.results[0].c-data.results[0].o;
           total=costbasis-lastprice;
           quantity=quant[0].value;
           currvalue=lastprice*quantity;
            console.log(lastprice,today,total,currvalue,quantity,costbasis);
            storeTrade();
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
             sell(symbol.val(),quantity)
        }
        });
    }
)
  
})



function sell(symbol,amt){
for(let i=0;i<holdings.length;i++){
    if(holdings[i].symbol===symbol){
        if(holdings[i].quantity===amt){
            console.log("logic 1")
            holdings[i].issold=true;
            holdings[i].soldfor=holdings[i].currvalue;
            holdings[i].type="sell"
            buysellhistory.push(holdings[i])
            holdings.splice(i,1)
            localStorage.setItem("holdings",JSON.stringify(holdings))

            return;
        }
        else if(parseInt(holdings[i].quantity)>amt){
            console.log("logic 2")
                var historyobj=Object.assign({},holdings[i])
                historyobj.quantity=amt;
                historyobj.issold=true;
                historyobj.currvalue=amt*parseInt(historyobj.lastprice);
                historyobj.type="sell"
                buysellhistory.push(historyobj);
                localStorage.setItem("buysellhistory",JSON.stringify(buysellhistory))
                holdings[i].quantity=parseInt(holdings[i].quantity)-amt;
                console.log(holdings[i].quantity)
                holdings[i].currvalue=parseInt(holdings[i].quantity)*parseInt(holdings[i].lastprice);
                localStorage.setItem("holdings",JSON.stringify(holdings))
                return;
        }
        else{
            console.log("you cannot sell more than you have")
            return;
        }
    }
}
console.log("Stock not found in our db");
}


// function pagerefresh(){
// for(let i=0; i<holdings.length;i++){
//     holdings[i]
// }
// }
// pagerefresh();





