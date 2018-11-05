d3.select("#submit").on("click", wrapperFunction);

// process the user selected option
function processCategory(data, category){
  var arr = [];
  for (var i = 0; i < 500; i++){
    arr.push(data.data[i][category]);
  }
  return arr;
}

function obtainLabelsForAxes(labels, dict) {
  var arr = [];
  for (var i = 0; i < labels.length; i++) {
    arr.push(dict[labels[i]]);
  }
  return arr;
}

function createArrayOfAttributes(arr1, arr2, arr3, arr4, arr5) {
  var arr = [];
  for (var i = 0; i < arr1.length; i++) {
    arr.push([arr1[i], arr2[i], arr3[i], arr4[i], arr5[i]])
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

  var labels = [
      "residential_units",
      "total_units",
      "land_sqft",
      "gross_sqft",
      "sale_price"]

  var arr1 = processCategory(data, "residential_units");
  var arr2 = processCategory(data, "total_units");
  var arr3 = processCategory(data, "land_sqft");
  var arr4 = processCategory(data, "gross_sqft");
  var arr5 = processCategory(data, "sale_price");

  var arr = createArrayOfAttributes(arr1,arr2,arr3,arr4,arr5);

  // var arr = [arr1,arr2,arr3,arr4,arr5];

  // Get x-axis label dictionary
  var dict = processXAxisDict();

  // Set graph dimensions and margins
  var margin = {top: 40, right: 20, bottom: 100, left: 40},
    size = 180,
    padding = 20,
    width = 1000;

  var axesLabels = obtainLabelsForAxes(labels, dict);

  // Set ranges
  var x = d3.scaleLinear()
      .range([padding, size - padding/2]);
  var y = d3.scaleLinear()
      .range([size - padding/2,padding]);

  var xAxis = d3.axisBottom(x)
  var yAxis = d3.axisLeft(y)

  var domainByAttribute = {},
      n = labels.length;

  labels.forEach(function(attribute) {
    domainByAttribute[attribute] = d3.extent(processCategory(data, attribute));
  });

  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  // create svg
  var svg = d3.select("#chart").append("svg")
      .attr("width", size*n + 5*padding)
      .attr("height", size*n + 5*padding)
      .style('background', '#fafafa')
    .append("g")
    .attr("transform", 
        "translate(" + 3*padding + "," + 2*padding + ")");

    // add x axis to chart
  svg.selectAll(".x.axis")
    .data(labels)
    .enter().append("g")
    .attr("class", "x axis")
    .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
    .each(function(d) { 
      x.domain(domainByAttribute[d]); 
      d3.select(this)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
   })
      
  // add y axis to chart
  svg.selectAll(".y.axis")
    .data(labels)
    .enter().append("g")
    .attr("class", "y axis")
    .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
    .each(function(d) { 
      y.domain(domainByAttribute[d]); 
      d3.select(this)
        .call(yAxis);
   })

  var cell = svg.selectAll(".cell")
      .data(cross(labels, labels))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

  // Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; })
    .append("text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(function(d) { return dict[d.x]});

  // Make a title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Scatterplot Matrix");

  function plot(p) {
    var cell = d3.select(this);

    x.domain(domainByAttribute[p.x]);
    y.domain(domainByAttribute[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.selectAll("circle")
        .data(arr)
      .enter().append("circle")
        .attr("cx", function(d) { return x(d[p.i]); })
        .attr("cy", function(d) { return y(d[p.j]); })
        .attr("r", 4)
        .style("fill", "black");
  }

  function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) 
      for (j = -1; ++j < m;) 
        c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
  }
}

// wrapper function to kick off whole process
function wrapperFunction(){
  document.getElementById("chart").innerHTML = "";
  processData(data);  
}

