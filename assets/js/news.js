var newsListEl = $('#news-list');

const endpointURL= "https://api.polygon.io/v2/reference/news?ticker=AAPL&apiKey=GC9ROGPfIcOolOpnKpoEyjmILLnT5xPv";

fetch(endpointURL)
.then(function (response) {        
  if (response.ok) {
      response.json().then(function (data) {
        
        for(let i = 0; i < data.results.length; i++)
        {       
            var headerEl = $('<p class=subtitle>');
            headerEl.text(data.results[i].title);
            newsListEl.append(headerEl);

            var pEl = $('<p>');
            pEl.text("Published: " + data.results[i].published_utc);
            newsListEl.append(pEl);
            
            var pEl = $('<p>');
            pEl.text("Author: " + data.results[i].author);
            newsListEl.append(pEl);

            var aEl = $('<a>');
            aEl.text("See more..");
            aEl.attr("href", data.results[i].article_url);
            aEl.attr("target", "_blank");
            newsListEl.append(aEl);

            var hrEl = $('<hr>');
            newsListEl.append(hrEl);
        }

    });
  } else {
      newsListEl.textContent = "There was an error retrieving data: " + response.statusText;        
  }
})
.catch(function (error) {
      newsListEl.textContent = "There was an error connecting API";        
});


