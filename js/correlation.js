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

function obtainLabelsForAxes(labels, dict) {
  var arr = [];
  for (var i = 0; i < labels.length; i++) {
    arr.push(dict[labels[i]]);
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

  var labels = ["zip_code",
      "residential_units",
      "commercial_units",
      "total_units",
      "land_sqft",
      "gross_sqft",
      "year_built",
      "NumFloors",
      "year_of_sale",
      "sale_price"]

  // Obtained using pandas corr() function
  var correlationMatrix = [[ 1.        , -0.00024573, -0.07122781, -0.02025315,  0.05680514,
        -0.02396415,  0.1249459 , -0.16525502,  0.09577801,  0.04555292],
       [-0.00024573,  1.        , -0.04556397,  0.95979669,  0.33803452,
         0.50282871, -0.07227988, -0.03940958, -0.01779978, -0.03138718],
       [-0.07122781, -0.04556397,  1.        ,  0.23667245,  0.24817925,
         0.32724441, -0.00481586,  0.04542434, -0.04433635,  0.01160653],
       [-0.02025315,  0.95979669,  0.23667245,  1.        ,  0.39850762,
         0.58100275, -0.07165258, -0.02556605, -0.02977004, -0.02726587],
       [ 0.05680514,  0.33803452,  0.24817925,  0.39850762,  1.        ,
         0.776541  ,  0.10520003, -0.17061449, -0.00921252,  0.55098165],
       [-0.02396415,  0.50282871,  0.32724441,  0.58100275,  0.776541  ,
         1.        ,  0.11839306,  0.01528578, -0.0287455 ,  0.48923348],
       [ 0.1249459 , -0.07227988, -0.00481586, -0.07165258,  0.10520003,
         0.11839306,  1.        ,  0.10646345,  0.02504216,  0.07355435],
       [-0.16525502, -0.03940958,  0.04542434, -0.02556605, -0.17061449,
         0.01528578,  0.10646345,  1.        ,  0.04859554,  0.0370884 ],
       [ 0.09577801, -0.01779978, -0.04433635, -0.02977004, -0.00921252,
        -0.0287455 ,  0.02504216,  0.04859554,  1.        ,  0.13736336],
       [ 0.04555292, -0.03138718,  0.01160653, -0.02726587,  0.55098165,
         0.48923348,  0.07355435,  0.0370884 ,  0.13736336,  1.        ]];

  var startColor = "blue";
  var endColor = "red";
  var data = data.data;

  // Get x-axis label dictionary
  var dict = processXAxisDict();

  // Set graph dimensions and margins
  var margin = {top: 40, right: 20, bottom: 40, left: 60},
    height = 500,
    width = 700,
    barWidth = 30,
    barOffset = 15;

  var axesLabels = obtainLabelsForAxes(labels, dict);

  // Set ranges
  var x = d3.scaleBand()
      .domain(axesLabels)
      .rangeRound([0, width]);
  var y = d3.scaleBand()
    .domain(axesLabels)
    .rangeRound([height,0]);

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
    .call(d3.axisBottom(x)
      )
      .selectAll("text")
      .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

  // add y axis to chart
  svg.append("g")
    .call(d3.axisLeft(y)
      );

  // Make a title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Correlation Matrix");

  var colorMap = d3.scaleLinear()
      .domain([-1,0,1])
      .range([startColor,"white", endColor]);

  var row = svg.selectAll(".row")
      .data(correlationMatrix)
      .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + y(axesLabels[i]) + ")"; });

  var cell = row.selectAll(".cell")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("class", "cell")
      .attr("height", (height)/10)
      .attr("width", (width)/10)
      .attr("transform", function(d, i) { return "translate(" + x(axesLabels[i]) + ", 0)"; })
      .on('mouseover', function() {
        d3.select(this)
            .style('stroke', '#0F0')
            .style('stroke-width', 2);
       })
       .on('mouseout', function() {
          d3.select(this)
              .style('stroke', colorMap);
       });

  row.selectAll(".cell")
      .data(function(d, i) { return correlationMatrix[i]; })
      .style("fill", colorMap);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d, i) {
      return "<strong>Correlation:</strong> <span style='color:#47ffb5'>" + d + "</span>";
  })

  cell.on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  svg.call(tip);
}

// wrapper function to kick off whole process
function wrapperFunction(){
  document.getElementById("chart").innerHTML = "";
  processData(data);  
}

