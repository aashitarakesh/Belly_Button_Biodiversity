// Initializes the page with a default plot
function init(){
    var selector = d3.select("#selDataset");

    d3.json("./data/samples.json").then((importedData) =>{
        var data = importedData;
    
        var subjectID = data.names;
        subjectID.forEach((ID) => {
            selector
            .append('option')
            .text(ID)
            .property('value', ID);
        });
    var initialValue = subjectID[0];
    charts(initialValue);
    metadata(initialValue);
    });
}
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs 
function charts(sample) { 
 // Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument   
    d3.json("./data/samples.json").then((importedData) => {
    var samples = importedData.samples;
    var filteredData = samples.filter(row => row.id == sample);
    var result = filteredData[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;   

    var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(d => `OTU ${d}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        name: "Greek",
        type: "bar",
        orientation: "h"
    };
    var chartData = [trace1];
    var layout = {
        title: "Top Ten OTUs for Test Subject ID " +sample,
        margin: {l: 100, r: 100, t: 100, b: 100},
    };
    Plotly.newPlot("bar", chartData, layout, {responsive: true});  

    // Create a bubble chart that displays each sample
    var trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"YlGnBu"
        }
    };
    var chartData = [trace2];
    var layout = {
        title: 'Microbial Species per Sample',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"OTU ID " +sample},
    };
    Plotly.newPlot('bubble', chartData, layout,{responsive: true}); 
});
}

// Display individual's demographic information
function metadata(sample) {  
// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument   
    d3.json("./data/samples.json").then((importedData) => {
        var metadata = importedData.metadata;
        var filteredData = metadata.filter(row => row.id == parseInt(sample));
        var result = filteredData[0];
        var panelData = d3.select("#sample-metadata");
        //Clear out existing metadata panel data
        panelData.html("");
        // Add each key and value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
            panelData.append("h6").text(`${key}: ${value}`)
        });
    //  Calculate Needle point
    function gaugePointer(value){

        if(result.wfreq === null){
            result.wfreq = 0;
        }
       var degree = parseInt(result.wfreq) * (180/10);
	   var degrees = 180 - degree,
	   radius = .5;
       var radians = degrees * Math.PI / 180;
       var x = radius * Math.cos(radians);
       var y = radius * Math.sin(radians);

// Path
      var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
	  pathX = String(x),
	  space = ' ',
	  pathY = String(y),
	  pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);
	
	  return path;
    }
    //  Gauage Chart to plot the weekly washing frequency of the individual
       var chartData = [{ 
           type: 'scatter',
           x: [0], y: [0] ,
	       marker: {size: 20, color:'850000'},
	       showlegend: false,
	       name: 'Wash Frequency',
	       text: result.wfreq,
	       hoverinfo: 'text+name'},
          { values:  [1, 1, 1, 1, 1, 1, 1, 1, 1,9],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
            textinfo: 'text',
            textposition:'inside',	  
            marker: {colors:['rgba(14, 127, 0, .5)','rgba(43, 130, 0, .5)','rgba(60, 132, 12, .5)','rgba(110, 154, 22, .5)', 'rgba(166, 182, 73, .5)',
						 'rgba(202, 209, 95, .5))', 'rgba(210, 206, 145, .5))','rgba(232, 226, 202, .5)', 'rgba(240, 232, 219, .5)','rgba(255, 255, 255, 0)']},
            labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
            hoverinfo: 'text',
            hole: .5,
            type: 'pie',
            showlegend: false
        }];

        var layout = {
            shapes:[{
            type: 'path',
            path: gaugePointer(120),
            fillcolor: '850000',
            line: {
            color: '850000'
            }
           }],
           title: '<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week',
           autosize:true,
           xaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
           yaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
        };
          
    Plotly.newPlot("gauge", chartData, layout, {responsive: true});

    });
}
//Update the chart whenever a new sample is selected
function optionChanged(newSample) {
    metadata(newSample);
    charts(newSample);
  }
// Initialize the dashboard
init();
