import { dijkstra, dfs_shortest_path, bfs_shortest_path } from './src/algorithms.js';
import { checkPage, createMap } from './src/getLinks.js';

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
  // Reset data
  const timeTakenElement = document.getElementById('timeTaken');
  timeTakenElement.textContent = "";

  const dijkstraTimeElement = document.getElementById('dijkstraTime');
  dijkstraTimeElement.textContent = "";
  const DFSTimeElement = document.getElementById('DFSTime');
  DFSTimeElement.textContent = "";
  const BFSTimeElement = document.getElementById('BFSTime');
  BFSTimeElement.textContent = "";

  const dijkstraPathElement = document.getElementById('dijkstraPath');
  dijkstraPathElement.textContent = "";
  const DFSPathElement = document.getElementById('DFSPath');
  DFSPathElement.textContent = "";
  const BFSPathElement = document.getElementById('BFSPath');
  BFSPathElement.textContent = "";

  // Get the values from input fields
  const input1 = document.getElementById('input1').value;
  const input2 = document.getElementById('input2').value;
  if(input1 === "" || input2 === "") {
      alert("Page name is invalid");
      return;
  }
  //Checks if page exists
  const [exists1, exists2] = await Promise.all([checkPage(input1), checkPage(input2)]);
  if (!exists1) {
      console.log("Input 1 page does not exist");
      return;
  }
  if (!exists2) {
      console.log("Input 2 page does not exist");
      return;
  }

  // Call your function with the retrieved values
  console.log('First page:', input1);
  console.log('Second page:', input2);

  startLoadingAnimation(timeTakenElement, "Nodes being collected");

  const startCollectionTime = performance.now();
  //creates the map
  const graph = await createMap(input1, input2);
  console.log(graph);
  const endCollectionTime = performance.now();

  /*update elements on website*/

  //time
  const collectionTime = (endCollectionTime - startCollectionTime) / 1000;
  stopLoadingAnimation(timeTakenElement, `Nodes collected in ${collectionTime}s`);
  //dijkstra
  /*
  startLoadingAnimation(dijkstraPathElement, "Searching for shortest path using Dijkstra's Algorithm");
  const [dijkstraTime, dijkstraPath] = dijkstra(graph, input1, input2);
  stopLoadingAnimation(dijkstraPathElement, `Dijkstra's Algorithm completed in ${dijkstraTime}s`);
  */
  //dfs
  startLoadingAnimation(DFSTimeElement, "Searching for shortest path using DFS");
  const [dfsTime, dfsPath] = dfs_shortest_path(graph, input1, input2);
  stopLoadingAnimation(DFSTimeElement, `DFS completed in ${dfsTime}s`);
  //bfs
  startLoadingAnimation(BFSTimeElement, "Searching for shortest path using DFS");
  const [bfsTime, bfsPath] = bfs_shortest_path(graph, input1, input2);
  stopLoadingAnimation(BFSTimeElement, `DFS completed in ${bfsTime}s`);

  //time visual
  //dijkstraTimeElement.textContent = `Dijkstra's Algorithm Time: ${dijkstraTime}s`;
  DFSTimeElement.textContent = `DFS Time: ${dfsTime}s`;
  BFSTimeElement.textContent = `BFS Time: ${bfsTime}s`;

  dijkstraPathElement.textContent = `${dfsPath.length} Degrees of Seperation`;
  //dijkstraPathElement.textContent = `\nDijkstra's Path: ${dijkstraPath.length > 0 ? dijkstraPath.join(' -> ') : 'No path found'}`;
  DFSPathElement.textContent = `DFS Path: ${dfsPath.length > 0 ? dfsPath.join(' -> ') : 'No path found'}`;
  BFSPathElement.textContent = `BFS Path: ${bfsPath.length > 0 ? bfsPath.join(' -> ') : 'No path found'}`;

  // Visualize both shortest paths
  visualizePaths(bfsPath, dfsPath);
});

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