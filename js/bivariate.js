// dynamically load bar chart upon menu change
d3.select("#dropdown1").on("change", wrapperFunction);
d3.select("#dropdown2").on("change", wrapperFunction);

// process the user selected option
function processCategory(data, elementId){
  var category = document.getElementById(elementId).value;
  var arr = [];
  for (var i = 0; i < 500; i++){
    arr.push(data.data[i][category]);
  }
  return [arr, category];
}

function processXAxisDict() {
  var dict = {};

  dict["zip_code"] = "ZIP Code"
  dict["residential_units"] = "Residential Units"
  dict["commercial_units"] = "Commercial Units"
  dict["total_units"] = "Total Units"
  dict["land_sqft"] = "Land Square Footage"
  dict["gross_sqft"] = "Gross Square Footage"
  dict["year_built"] = "Year Build"
  dict["NumFloors"] = "Number of Floors"
  dict["year_of_sale"] = "Year of Sale"
  dict["sale_price"] = "Sale Price"

  return dict;
}

// main function to display bar chart
function processData(data){

  // Get data array for selected categories
  var obj1 = processCategory(data, "dropdown1");
  var obj2 = processCategory(data, "dropdown2");

  // Get x-axis label dictionary
  var dict = processXAxisDict();

  // Parse data arrays
  var data_arr = obj[0];
  var category = obj[1];

  // Set graph dimensions and margins
  var margin = {top: 40, right: 20, bottom: 40, left: 40},
    height = 500,
    width = 700,
    barWidth = 30,
    barOffset = 15;

  var bins = [];
  var binsMaxes = [];
  var arr = [];
  var binCount = 0;
  var max = Math.max(...data_arr);
  var min = Math.min(...data_arr);
  var range = max - min;
  var numOfBuckets = 20;
  var interval = Math.floor(range/numOfBuckets);
  if (category == 'year_of_sale') {
      max = 2018;
      min = 1998;
      range = max - min;
      interval = Math.floor(range/numOfBuckets);
  }

  // set up array bins and binsMaxes to use later
  for (var i = min; i <= max; i += interval){
    bins.push({
      binNum: binCount,
      minNum: i,
      maxNum: i + interval,
      count: 0
    });
    if (i == min){
      binsMaxes.push(i);
    }
    binsMaxes.push(i+interval);
  }

  // obtain the frequency for each bin
  for (var i = 0; i < data_arr.length; i++){
    var item = data_arr[i];
    for (var j = 0; j < bins.length; j++){
      var bin = bins[j];
      if(item >= bin.minNum && item < bin.maxNum){
        bin.count++;
      }
    }  
  }

  // create the array of bin frequency
  var maxFreq = 0;
  for (var j = 0; j < bins.length; j++){
    var val = bins[j].count;
    if (val > maxFreq)
      maxFreq = val;
    arr.push(val);
  }

  // Set ranges
  var x = d3.scaleBand()
      .range([0, width])
      .domain(binsMaxes.map((d) => d))
  var y = d3.scaleLinear()
    .domain([0,maxFreq])
    .range([height,0]);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Frequency:</strong> <span style='color:#47ffb5'>" + d + "</span>";
  })

  // create svg
  var svg = d3.select("#chart").append("svg")
              .attr("width", width + 2*margin.left + margin.right)
              .attr("height", height + 2*margin.top + 2*margin.bottom)
              .style('background', '#fafafa')
            .append("g")
            .attr("transform", 
                "translate(" + 2*margin.left + "," + margin.top + ")");
  
// add x axis to chart
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");;

  // add y axis to chart
  svg.append("g")
    .call(d3.axisLeft(y)
        .tickSize(-width)
      );

  // add x axis label
  svg.append("text")
    .style("font", "14px arial")
    .attr("text-anchor", "middle") 
      .attr("transform", "translate("+ (width/2) +","+(height+2*margin.top)+")") 
    .text(dict[category]);

  // add y axis label
  svg.append("text")
    .style("font", "14px arial")
    .attr("text-anchor", "middle") 
      .attr("transform", "translate("+ (-margin.left) +","+(height/2)+")rotate(-90)") 
    .text("Frequency");

  // // add values of each bar above bar in chart
  // var text = svg.selectAll(".text")
  //     .data(arr)
  //     .enter()
  //     .append("text")
  //     //.attr("visibility", "hidden")
  //     .attr("x", function (d,i ) { return i * x.bandwidth() + 15})
  //     .attr("y", (d) => y(d) - 5)
  //     .attr("text-anchor", "middle")
  //     .text(function(d) {
  //         return d;
  // });

  // create barchart and load data
  var bars = svg.selectAll("rect")
      .data(arr)
      .enter().append("rect")
          .attr("class", "bar")
            .attr("width",x.bandwidth())
            .attr("x", function (d,i ) { return i * x.bandwidth()})
            .attr("y", height)
            .on("mouseover", function(d,i) {
              d3.select(this)
                .attr("height", (d) => height - y(d)+10)
                .attr("width", x.bandwidth()*1.0)
                .attr("y", (d) => y(d) - 10);
              })
            .on("mouseout", function(d,i){
              d3.select(this)
                .attr("height", (d) => height - y(d))
                .attr("width", x.bandwidth())
                .attr("y", (d) => y(d));
            })

  bars.on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  bars.transition()
      .duration(700)
      .delay(100)
      .attr("height", (d)=> {return height - y(d);})
      .attr("y", (d)=> {return y(d);})

  svg.call(tip);
}

// wrapper function to kick off whole process
function wrapperFunction(){
  document.getElementById("chart").innerHTML = "";
  processData(data);  
}

