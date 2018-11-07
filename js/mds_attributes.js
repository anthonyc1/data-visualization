d3.select("#submit").on("click", wrapperFunction);

function formatData(arr1, arr2) {
  var arr = [];
  for (var i = 0; i < arr1.length; i++) {
    arr.push([arr1[i], arr2[i]])
  }
  return arr;
}

function createArray(dict) {
  var arr = [];
  var len = Object.keys(dict).length;
  for (var i = 0; i < len; i++) {
    arr.push(dict[i]);
  }
  return arr;
}

function processXAxisDict() {
  var dict = {};

  dict[0] = "ZIP Code"
  dict[1] = "Residential Units"
  dict[2] = "Commercial Units"
  dict[3] = "Total Units"
  dict[4] = "Land Square Footage"
  dict[5] = "Gross Square Footage"
  dict[6] = "Year Built"
  dict[7] = "Number of Floors"
  dict[8] = "Year of Sale"
  dict[9] = "Sale Price"

  return dict;
}

// main function to display bar chart
function processData(data){

  // Get x-axis label dictionary
  var dict = processXAxisDict();

  var data_arr1 = createArray(data.x);
  var data_arr2 = createArray(data.y);
  var data_arr = formatData(data_arr1, data_arr2);

  console.log(Object.keys(data.x).length)

  // Set graph dimensions and margins
  var margin = {top: 40, right: 20, bottom: 40, left: 40},
    height = 500,
    width = 700;

  // Set ranges
  var x = d3.scaleLinear()
      .domain([Math.min(...data_arr1), Math.max(...data_arr1)])
      .range([0, width]);
  var y = d3.scaleLinear()
    .domain([Math.min(...data_arr2), Math.max(...data_arr2)])
    .range([height,0]);

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
    .text("Coordinate 1");

  // add y axis label
  svg.append("text")
    .style("font", "14px arial")
    .attr("text-anchor", "middle") 
      .attr("transform", "translate("+ (-margin.left) +","+(height/2)+")rotate(-90)") 
    .text("Coordinate 2");

  // Make a title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("MDS Plot For Data");
 
  // Add the data points
  var circles = svg.selectAll("circle")
    .data(data_arr)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function(d) {
        return 0;
      })
      .attr("cy", function(d) {
        return height;
      })
      .attr("r", 4);

  circles.transition()
      .duration(700)
      .delay(100)
      .attr("cx", (d)=> {return x(d[0]);})
      .attr("cy", (d)=> {return y(d[1]);})

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d, i) {
      return "<strong>Data point:</strong> <span style='color:#47ffb5'>" + dict[i] + "</span><br>" + 
        "<strong>Coord. 1:</strong> <span style='color:#47ffb5'>" + d[0] + "</span><br>" + 
        "<strong>Coord. 2:</strong> <span style='color:#47ffb5'>" + d[1] + "</span>";
  })

  circles.on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  svg.call(tip);
}

// wrapper function to kick off whole process
function wrapperFunction(){
  document.getElementById("chart").innerHTML = "";
  processData(mds_data);  
}

