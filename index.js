 //initilize svg or grab svg
 var svg = d3.select("svg");
 var width = svg.attr("width");
 var height = svg.attr("height");

 var graphData = {
   nodes: [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }],
   links: [
     { source: "A", target: "B"},
     { source: "A", target: "C"},
     { source: "A", target: "D"},
     //{ source: "B", target: "C" },
     //{ source: "D", target: "C" }
   ]
 };

 var simulation = d3
   .forceSimulation(graphData.nodes)
   .force("charge", d3.forceManyBody().strength(-30))
   .force("center", d3.forceCenter(width / 2, height / 2))
   .force("link", d3.forceLink(graphData.links).id(d => d.name))
   .on("tick", ticked);

 var links = svg
   .append("g")
   .selectAll("line")
   .data(graphData.links)
   .enter()
   .append("line")
   .attr("stroke-width", 3)
   .style("stroke", "orange");

 links.append("text").text(d => d.name);

 var nodes = svg
   .append("g")
   .selectAll("circle")
   .data(graphData.nodes)
   .enter()
   .append("circle")
   .attr("r", 10)
   .attr("fill", "red");

 var drag = d3
   .drag()
   .on("start", dragstarted)
   .on("drag", dragged)
   .on("end", dragended);

 nodes.call(drag);

 function ticked() {
   //updating the position
   nodes
     .attr("cx", function(d) {
       return d.x;
     })
     .attr("cy", function(d) {
       return d.y;
     });

   links
     .attr("x1", function(d) {
       return d.source.x;
     })
     .attr("y1", function(d) {
       return d.source.y;
     })
     .attr("x2", function(d) {
       return d.target.x;
     })
     .attr("y2", function(d) {
       return d.target.y;
     });
   console.log(simulation.alpha());
 }

 function dragstarted(d) {
   //your alpha hit 0 it stops! make it run again
   simulation.alphaTarget(0.3).restart();
   d.fx = d3.event.x;
   d.fy = d3.event.y;
 }
 function dragged(d) {
   d.fx = d3.event.x;
   d.fy = d3.event.y;
 }

 function dragended(d) {
   // alpha min is 0, head there
   simulation.alphaTarget(0);
   d.fx = null;
   d.fy = null;
 }