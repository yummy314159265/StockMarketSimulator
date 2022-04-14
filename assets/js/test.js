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

console.log(option)

var costbasis;
var lastprice;
var quantity=quant[0].value;
var Today;
var total;
var currvalue;


var holdings = JSON.parse(localStorage.getItem("holdings") || "[]");
function storeTrade(){
    holdings.push({id: holdings.length, symbol: symbol.val(), costbasis: costbasis, lastprice: lastprice, quantity: quantity, currvalue: currvalue, });
    localStorage.setItem("holdings", JSON.stringify(holdings));
}

submit.on('submit',function(){
    event.preventDefault();   
    fetch("https://api.polygon.io/v2/aggs/ticker/" + symbol.val() + "/prev?adjusted=true&apiKey=6SvIn0fus9qTZENF39DKiWYPpDbxbFy5").then(
    function(response){
        response.json().then(function(data){
           costbasis= data.results[0].c
           lastprice=data.results[0].c
           today=data.results[0].c-data.results[0].o;
           total=costbasis-lastprice;
           quantity=quant[0].value;
           currvalue=lastprice*quantity;
            console.log(lastprice,today,total,currvalue,quantity,costbasis);
            storeTrade();
        });
    }
)
  
})

// function pagerefresh(){
// for(let i=0; i<holdings.length;i++){
//     if(holdings[i].symbol===)
// }
// }

// pagerefresh();

