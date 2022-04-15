var holidaysListEl = $('#holidays-list');
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const endpointURL= "https://api.polygon.io/v1/marketstatus/upcoming?apiKey=GC9ROGPfIcOolOpnKpoEyjmILLnT5xPv";


// Create Table
var tableEl = $('<table>');
tableEl.attr('class', 'table table is-fullwidth');

// Create Table Head
var tableHeadEl = $('<thead>');

// Create Table Row
var tableRowEl = $('<tr>');

// Create Table Column
var tableColumnEl = $('<th>');
tableColumnEl.text('Date');
tableRowEl.append(tableColumnEl);   

var tableColumnEl = $('<th>');
tableColumnEl.text('Holiday');
tableRowEl.append(tableColumnEl);   

var tableColumnEl = $('<th>');
tableColumnEl.text('NYSE');
tableRowEl.append(tableColumnEl);   

var tableColumnEl = $('<th>');
tableColumnEl.text('NASDAQ');
tableRowEl.append(tableColumnEl);   

tableHeadEl.append(tableRowEl);   

tableEl.append(tableHeadEl);   

var tableBodyEl = $('<tbody>');

fetch(endpointURL)
.then(function (response) {        
  if (response.ok) {
      response.json().then(function (data) {
          console.log(data);
        for(let i = 0; i < data.length; i++)
        {   
             if(i == 0 || data[i].date != prevdate)
             {
            
             // Create Table Row
                var tableRowEl = $('<tr>');
                // Create Table Column
                var tableColumnEl = $('<td>');
                var holidayDate = new Date(data[i].date.split('-'));
                tableColumnEl.text(days[holidayDate.getDay()] + ', ' + 
                months[holidayDate.getMonth()] + ' ' + holidayDate.getDate());
                

                tableRowEl.append(tableColumnEl);   
                var tableColumnEl = $('<td>');
                tableColumnEl.text(data[i].name);
                tableRowEl.append(tableColumnEl); 
                var tableColumnEl = $('<td>');
  
                // NYSE Data
                if(data[i].exchange == 'NYSE')
                {

                    if(data[i].status == 'early-close')
                    {
                        var earlyCloseHours = new Date(data[i].close);
                        var ampm = (earlyCloseHours >= 12) ? "p.m." : "a.m.";
            
                        tableColumnEl.text(data[i].status + " at " + earlyCloseHours.getHours() + " " + ampm);
                    }
                    else
                    tableColumnEl.text(data[i].status);

                }  
                else
                {
                    for(let j = 0; j < data.length; j++)
                    {                    
                        if(data[j].exchange == 'NYSE' && data[i].date == data[j].date)
                        {
                        if(data[j].status == 'early-close')
                        {
                            var earlyCloseHours = new Date(data[j].close);
                            var ampm = (earlyCloseHours >= 12) ? "p.m." : "a.m.";
                
                            tableColumnEl.text(data[i].status + " at " + earlyCloseHours.getHours() + " " + ampm);
                        }
                        else
                        tableColumnEl.text(data[i].status);
                        }    
                    } 
                }
                tableRowEl.append(tableColumnEl);   
                var tableColumnEl = $('<td>');

                // NASDAQ Data
                for(let j = 0; j < data.length; j++)
                {                    
                    if(data[j].exchange == 'NASDAQ' && data[i].date == data[j].date)
                    {
                    if(data[j].status == 'early-close')
                    {
                        var earlyCloseHours = new Date(data[j].close);
                        var ampm = (earlyCloseHours >= 12) ? "p.m." : "a.m.";
            
                        tableColumnEl.text(data[i].status + " at " + earlyCloseHours.getHours() + " " + ampm);
                    }
                    else
                    tableColumnEl.text(data[i].status);
                    }    
                }
                tableRowEl.append(tableColumnEl);   

                tableBodyEl.append(tableRowEl);
            }
            var prevdate = data[i].date;
            
        }
        tableEl.append(tableBodyEl);
        
        holidaysListEl.append(tableEl);
        

    });
  } else {
      newsListEl.textContent = "There was an error retrieving data: " + response.statusText;        
  }
})
.catch(function (error) {
      newsListEl.textContent = "There was an error connecting API";        
});


