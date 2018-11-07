d3.select("#submit1").on("click", wrapperFunction1);
d3.select("#submit2").on("click", wrapperFunction2);

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

  // Get x-axis label dictionary
  var dict = processXAxisDict();

  var data_arr1 = createArray(data.x);
  var data_arr2 = createArray(data.y);
  var data_arr = formatData(data_arr1, data_arr2);

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
    .text("PC 1");

  // add y axis label
  svg.append("text")
    .style("font", "14px arial")
    .attr("text-anchor", "middle") 
      .attr("transform", "translate("+ (-margin.left) +","+(height/2)+")rotate(-90)") 
    .text("PC 2");

  // Make a title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("PCA Plot");
 
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
      return "<strong>Data point:</strong> <span style='color:#47ffb5'>" + i + "</span>";
  })

  circles.on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  svg.call(tip);
}

function getScreePlot() {
  // SCREE PLOT DATA
  var scree_plot_arr = [0.99996243, 0.00003583, 0.00000173, 0.        , 0.        ,
       0.        , 0.        , 0.        , 0.        , 0.        ]

  // Get x-axis label dictionary
  var dict = processXAxisDict();

  // Set graph dimensions and margins
  var margin = {top: 40, right: 20, bottom: 40, left: 40},
    height = 500,
    width = 700;

  // Set ranges
  var x = d3.scaleLinear()
      .domain([0,9])
      .range([0, width]);
  var y = d3.scaleLinear()
    .domain([Math.min(...scree_plot_arr), Math.max(...scree_plot_arr)])
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
    .text("Number of Components");

  // add y axis label
  svg.append("text")
    .style("font", "14px arial")
    .attr("text-anchor", "middle") 
      .attr("transform", "translate("+ (-margin.left) +","+(height/2)+")rotate(-90)") 
    .text("Cumulative Explained Variance");

  // Make a title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Scree Plot");
 
  // Add the data points
  var circles = svg.selectAll("circle")
    .data(scree_plot_arr)
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
      .attr("cx", (d, i)=> {return x(i);})
      .attr("cy", (d, i)=> {return y(d);})

  var line = d3.line()
    .x(function(d, i){return x(i);})
    .y(function(d, i){return y(d);})

  lines = svg.append("path")
    .attr("d", function(d) { return line(scree_plot_arr)})
    .attr("transform", "translate(0,0)")
    .style("stroke-width", 2)
        .style("stroke", "steelblue")
        .style("fill", "none")
        .style("opacity", 0);

  lines.transition()
      .duration(700)
      .delay(500)
      .ease(d3.easeLinear)
      .style("opacity", 1);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d, i) {
      return "<strong>Cumulative Explained Variance:</strong> <span style='color:#47ffb5'>" + d + "</span>";
  })

  circles.on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  svg.call(tip);
}

// wrapper function to kick off whole process
function wrapperFunction1(){
  document.getElementById("chart").innerHTML = "";
  processData(pca_data);  
}

function wrapperFunction2(){
  document.getElementById("chart").innerHTML = "";
  getScreePlot();  
}


