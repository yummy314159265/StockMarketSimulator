var marketStatusEl = $('#market-status');

const endpointURL= "https://api.polygon.io/v1/marketstatus/now?apiKey=GC9ROGPfIcOolOpnKpoEyjmILLnT5xPv";

fetch(endpointURL)
.then(function (response) {        
  if (response.ok) {
      response.json().then(function (data) {
        var marketStatusText = "Market Status: " + data.market.toUpperCase();        
        marketStatusEl.html(marketStatusText);

    });
  } else {
        // do nothing
  }
})
.catch(function (error) {
      // do nothing
});


