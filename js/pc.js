d3.select("#submit").on("click", wrapperFunction);

function processCategory(data, category){
  var arr = [];
  for (var i = 0; i < 500; i++){
    arr.push(data.data[i][category]);
  }
  return arr;
}

function createArrayOfAttributes(arr1, arr2, arr3, arr4, arr5, arr6, arr7, arr8, arr9, arr10) {
  var arr = [];
  for (var i = 0; i < arr1.length; i++) {
    arr.push([arr1[i], arr2[i], arr3[i], arr4[i], arr5[i], arr6[i], arr7[i], arr8[i], arr9[i], arr10[i]])
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

  var labels = ["gross_sqft",
      "land_sqft",
      "total_units",
      "residential_units",
      "sale_price",
      "commercial_units",
      "year_built",
      "NumFloors",
      "zip_code",
      "year_of_sale"]

  var arr1 = processCategory(data, "gross_sqft");
  var arr2 = processCategory(data, "land_sqft");
  var arr3 = processCategory(data, "total_units");
  var arr4 = processCategory(data, "residential_units");
  var arr5 = processCategory(data, "sale_price");
  var arr6 = processCategory(data, "commercial_units");
  var arr7 = processCategory(data, "year_built");
  var arr8 = processCategory(data, "NumFloors");
  var arr9 = processCategory(data, "zip_code");
  var arr10 = processCategory(data, "year_of_sale");
//5,4,3,1,9,2,6,7,0,8

  // Get x-axis label dictionary
  var dict = processXAxisDict();

  var arr = createArrayOfAttributes(arr1, arr2, arr3, arr4, arr5, arr6, arr7, arr8, arr9, arr10);

  // Set graph dimensions and margins
  var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width], 1),
    y = {},
    dragging = {};

var line = d3.line(),
    axis = d3.axisLeft(),
    background,
    foreground;

  // create svg
  var svg = d3.select("#chart").append("svg")
      .attr("width", width + 2*margin.left + margin.right)
      .attr("height", height + 2*margin.top + 2*margin.bottom)
      .style('background', '#fafafa')
    .append("g")
    .attr("transform", 
        "translate(" + 2*margin.left + "," + margin.top + ")");

  // Extract the list of dimensions and create a scale for each.
  x.domain(labels)
  labels.forEach(function(attribute) {
    y[attribute] = d3.scaleLinear()
    .domain(d3.extent(processCategory(data, attribute)))
    .range([height, 0]);
  });

  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(arr)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(arr)
    .enter().append("path")
      .attr("d", path);

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(labels)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      // .call(d3.behavior.drag()
      //   .origin(function(d) { return {x: x(d)}; })
      //   .on("dragstart", function(d) {
      //     dragging[d] = x(d);
      //     background.attr("visibility", "hidden");
      //   })
      //   .on("drag", function(d) {
      //     dragging[d] = Math.min(width, Math.max(0, d3.event.x));
      //     foreground.attr("d", path);
      //     labels.sort(function(a, b) { return position(a) - position(b); });
      //     x.domain(labels);
      //     g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
      //   })
      //   .on("dragend", function(d) {
      //     delete dragging[d];
      //     transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
      //     transition(foreground).attr("d", path);
      //     background
      //         .attr("d", path)
      //       .transition()
      //         .delay(500)
      //         .duration(0)
      //         .attr("visibility", null);
      //   }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return dict[d]; });

  // // Add and store a brush for each axis.
  // g.append("g")
  //     .attr("class", "brush")
  //     .each(function(d) {
  //       d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
  //     })
  //   .selectAll("rect")
  //     .attr("x", -8)
  //     .attr("width", 16);

  function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
  }

  function transition(g) {
    return g.transition().duration(500);
  }

  // Returns the path for a given data point.
  function path(d) {
    return line(labels.map(function(p) { return [position(p), y[p](d[labels.indexOf(p)])]; }));
  }

  // function brushstart() {
  //   d3.event.sourceEvent.stopPropagation();
  // }

  // // Handles a brush event, toggling the display of foreground lines.
  // function brush() {
  //   var actives = labels.filter(function(p) { return !y[p].brush.empty(); }),
  //       extents = actives.map(function(p) { return y[p].brush.extent(); });
  //   foreground.style("display", function(d) {
  //     return actives.every(function(p, i) {
  //       return extents[i][0] <= d[p] && d[p] <= extents[i][1];
  //     }) ? null : "none";
  //   });
  // }
}

// wrapper function to kick off whole process
function wrapperFunction(){
  document.getElementById("chart").innerHTML = "";
  processData(data);  
}

