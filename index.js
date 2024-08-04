var svg = d3.selectAll("svg");

var rect = svg
    .append('rect')
    .attr("height", 10)
    .attr("width", 10)
    .style("fill", "red");

d3  .select("rect")
    .style("fill", "green");