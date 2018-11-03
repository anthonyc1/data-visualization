d3.select("#submit").on("click", wrapperFunction);

// process the user selected option
function processCategory(data, elementId){
  var category = document.getElementById(elementId).value;
  var arr = [];
  for (var i = 0; i < 500; i++){
    arr.push(data.data[i][category]);
  }
  return [arr, category];
}

function createArrayOfCoordinates(arr1, arr2) {
  var arr = [];
  for (var i = 0; i < arr1.length; i++) {
    arr.push([arr1[i], arr2[i]])
  }
  return arr;
}

function processXAxisDict() {
  var dict = {};

  dict["zip_code"] = "ZIP Code"
  dict["residential_units"] = "Residential Units"
  dict["commercial_units"] = "Commercial Units"
  dict["total_units"] = "Total Units"
  dict["land_sqft"] = "Land Square Footage"
  dict["gross_sqft"] = "Gross Square Footage"
  dict["year_built"] = "Year Built"
  dict["NumFloors"] = "Number of Floors"
  dict["year_of_sale"] = "Year of Sale"
  dict["sale_price"] = "Sale Price"

  return dict;
}

// main function to display bar chart
function processData(data){

  var one = 0, two = 0;
  // Get data array for selected categories
  var obj1 = processCategory(data, "dropdown1");
  var obj2 = processCategory(data, "dropdown2");

  // Get x-axis label dictionary
  var dict = processXAxisDict();

  // Parse data arrays
  var data_arr1 = obj1[0];
  var category1 = obj1[1];
  var data_arr2 = obj2[0];
  var category2 = obj2[1];

  var data_arr = createArrayOfCoordinates(data_arr1, data_arr2);

  // Set graph dimensions and margins
  var margin = {top: 40, right: 20, bottom: 40, left: 40},
    height = 500,
    width = 700,
    barWidth = 30,
    barOffset = 15;

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
    .text(dict[category1]);

  // add y axis label
  svg.append("text")
    .style("font", "14px arial")
    .attr("text-anchor", "middle") 
      .attr("transform", "translate("+ (-margin.left) +","+(height/2)+")rotate(-90)") 
    .text(dict[category2]);

  // Make a title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Bivariate Scatterplot for "+ dict[category1] + " and " + dict[category2]);
 
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

  // var tip = d3.tip()
  //   .attr('class', 'd3-tip')
  //   .offset([-10, 0])
  //   .html(function(d) {
  //     return "<strong>"+dict[category1]+":</strong> <span style='color:#47ffb5'>" + x(d[0]) + "</span><br>" +
  //      "<strong>"+dict[category2]+":</strong> <span style='color:#47ffb5'>" + x(d[1]) + "</span>";
  // })

  // circles.on('mouseover', tip.show)
  //     .on('mouseout', tip.hide)
}

// wrapper function to kick off whole process
function wrapperFunction(){
  document.getElementById("chart").innerHTML = "";
  processData(data);  
}

