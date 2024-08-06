import { dijkstra, dfs_shortest_path } from './src/algorithms.js';
import { checkPage, createMap, fetchWikipediaLinks } from './src/getLinks.js';

let loadingInterval;

function startLoadingAnimation(element, baseText) {
    let dotCount = 0;
    loadingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        element.textContent = baseText + '.'.repeat(dotCount);
    }, 500);
}

function stopLoadingAnimation(element, finalText) {
    clearInterval(loadingInterval);
    element.textContent = finalText;
}

document.getElementById('fetchButton').addEventListener('click', async () => {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    if (input1 === "" || input2 === "") {
        alert("Page name is invalid");
        return;
    }

    const timeTakenElement = document.getElementById('timeTaken');
    const shortestPathElement = document.getElementById('shortestPath');

    startLoadingAnimation(timeTakenElement, "Nodes being collected");
    shortestPathElement.textContent = "";

    const [exists1, exists2] = await Promise.all([checkPage(input1), checkPage(input2)]);
    if (!exists1 || !exists2) {
        stopLoadingAnimation(timeTakenElement, "Error: One or both pages do not exist");
        return;
    }

    const startCollectionTime = performance.now();
    const links1 = await fetchWikipediaLinks(input1);
    const links2 = await fetchWikipediaLinks(input2);
    const endCollectionTime = performance.now();

    const collectionTime = (endCollectionTime - startCollectionTime) / 1000;
    stopLoadingAnimation(timeTakenElement, `Nodes collected in ${collectionTime}s`);

    if (links1.length === 0 && links2.length === 0) {
        alert("No links found for both pages");
        return;
    }

    if (links1.length === 0) {
        alert(`No links found for ${input1}`);
        return;
    }

    if (links2.length === 0) {
        alert(`No links found for ${input2}`);
        return;
    }

    console.log('Links from page 1:', links1);
    console.log('Links from page 2:', links2);

    //const graph = buildGraph(links1, links2, input1, input2);
    const graph = await createMap(input1, input2);
    console.log(graph);

    startLoadingAnimation(shortestPathElement, "Searching for shortest path using Dijkstra's Algorithm");
    const [dijkstraTime, dijkstraPath] = dijkstra(graph, input1, input2);
    stopLoadingAnimation(shortestPathElement, `Dijkstra's Algorithm completed in ${dijkstraTime}s`);

    startLoadingAnimation(shortestPathElement, "Searching for shortest path using DFS");
    const [dfsTime, dfsPath] = dfs_shortest_path(graph, input1, input2);
    stopLoadingAnimation(shortestPathElement, `DFS completed in ${dfsTime}s`);

    timeTakenElement.textContent += `\n\nDijkstra's Algorithm Time: ${dijkstraTime}s\nDFS Time: ${dfsTime}s`;
    shortestPathElement.textContent = `\nDijkstra's Path: ${dijkstraPath.length > 0 ? dijkstraPath.join(' -> ') : 'No path found'}\nDFS Path: ${dfsPath.length > 0 ? dfsPath.join(' -> ') : 'No path found'}`;

    // Visualize both shortest paths
    visualizePaths(dijkstraPath, dfsPath);
});

function buildGraph(links1, links2, startPage, endPage) {
    let graph = {};

    graph[startPage] = links1.length > 0 ? links1 : [];
    graph[endPage] = links2.length > 0 ? links2 : [];

    links1.forEach(link => {
        if (!graph[link]) {
            graph[link] = [];
        }
        graph[link].push(startPage);
    });

    links2.forEach(link => {
        if (!graph[link]) {
            graph[link] = [];
        }
        graph[link].push(endPage);
    });

    return graph;
}

function visualizePaths(dijkstraPath, dfsPath) {
    // Clear previous SVG elements before drawing new ones
    d3.select("svg").selectAll("*").remove();

    const nodes = [...new Set([...dijkstraPath, ...dfsPath])].map(name => ({ name }));
    const dijkstraLinks = [];
    for (let i = 0; i < dijkstraPath.length - 1; i++) {
        dijkstraLinks.push({ source: dijkstraPath[i], target: dijkstraPath[i + 1] });
    }
    const dfsLinks = [];
    for (let i = 0; i < dfsPath.length - 1; i++) {
        dfsLinks.push({ source: dfsPath[i], target: dfsPath[i + 1] });
    }

    var svg = d3.select("svg")
        .attr("width", 100)
        .attr("height", 100);

    var width = +svg.attr("width");
    var height = +svg.attr("height");

    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(dijkstraLinks.concat(dfsLinks)).id(d => d.name))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    var dijkstraLink = svg.append("g")
        .attr("class", "dijkstraLinks")
        .selectAll("line")
        .data(dijkstraLinks)
        .enter().append("line")
        .attr("stroke-width", 2)
        .style("stroke", "orange");

    var dfsLink = svg.append("g")
        .attr("class", "dfsLinks")
        .selectAll("line")
        .data(dfsLinks)
        .enter().append("line")
        .attr("stroke-width", 2)
        .style("stroke", "blue");

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 10)
        .attr("fill", "red")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(d => d.name);

    function ticked() {
        dijkstraLink
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        dfsLink
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}


/*
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
*/