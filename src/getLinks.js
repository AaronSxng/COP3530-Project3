// getLinks.js
// This script interacts with the Wikipedia API to check if pages exist and fetch their links. 
// It then constructs a graph of links between two pages and sends it to the server for processing.
// https://www.mediawiki.org/wiki/API:Links#Response

// Function to check if a Wikipedia page exists
async function checkPage(pageName) {
    var url = "https://en.wikipedia.org/w/api.php";  // Base URL for Wikipedia API

    // Parameters for the API request
    var params = {
        action: "query",
        format: "json",
        titles: pageName,
        prop: "info",
    };
    url = url + "?origin=*";  // To allow cross-origin requests
    Object.keys(params).forEach(function(key) {
        url += "&" + key + "=" + encodeURIComponent(params[key]);  // Append parameters to the URL
    });

    try {
        let response = await fetch(url);  // Make API request
        let data = await response.json();  // Parse response as JSON
        let pages = data.query.pages;  // Get pages from the response

        // Check if the page exists
        for (let pageId in pages) {
            if (pageId === "-1" || pages[pageId].missing) {
                alert(`${pageName} does not exist`);  // Alert if page doesn't exist
                return false;  // Page does not exist
            } else {
                return true;  // Page exists
            }
        }
        return false;  // Fallback if no valid page is found
    } catch (error) {
        console.error(`Error checking page existence: ${error}`);  // Log error
        alert(`${pageName} does not exist`);  // Alert if an error occurs
        return false;  // Page does not exist due to error
    }
}

// Function to fetch links from a Wikipedia page
async function fetchLinks(pageName) {
    var url = "https://en.wikipedia.org/w/api.php";  // Base URL for Wikipedia API

    // Parameters for the API request
    var params = {
        action: "query",
        format: "json",
        titles: pageName,
        prop: "links",
        pllimit: "max"
    };

    url = url + "?origin=*";  // To allow cross-origin requests
    Object.keys(params).forEach(function(key) {
        url += "&" + key + "=" + params[key];  // Append parameters to the URL
    });

    try {
        let response = await fetch(url);  // Make API request
        let data = await response.json();  // Parse response as JSON
        let links = [];  // Initialize array to store links
        var pages = data.query.pages;  // Get pages from the response
        for (var p in pages) {
            for (var l of pages[p].links) {
                links.push(l.title);  // Add link titles to the array
            }
        }
        return links;  // Return array of links
    } catch (error) {
        console.error(`Error fetching links: ${error}`);  // Log error
        return [];  // Return empty array on error
    }
}

// Function to fetch and display the graph of links between two pages
async function fetchGraph() {
    const input1 = document.getElementById('input1').value;  // Get first page name from input
    const input2 = document.getElementById('input2').value;  // Get second page name from input
    if (input1 === "" || input2 === "") {
        alert("Page name is invalid");  // Alert if input is empty
        return;
    }
    // Check if both pages exist
    const [exists1, exists2] = await Promise.all([checkPage(input1), checkPage(input2)]);
    if (!exists1 || !exists2) {
        alert("One or both pages do not exist");  // Alert if any page doesn't exist
        return;
    }

    // Fetch links for both pages
    const [links1, links2] = await Promise.all([fetchLinks(input1), fetchLinks(input2)]);

    // Construct graph object
    const graph = {};
    graph[input1] = links1;
    graph[input2] = links2;

    console.log('Graph:', graph);  // Log graph to console

    // Send graph to the server
    fetch('/shortest-path', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ graph, start: input1, end: input2 }),  // Send graph and start/end pages
    })
    .then(response => response.json())  // Parse response as JSON
    .then(data => {
        console.log('Dijkstra:', data.dijkstra);  // Log Dijkstra's algorithm result
        console.log('DFS:', data.dfs);  // Log Depth-First Search result
        // Display results on the page
        document.getElementById('text').innerText = `Dijkstra: ${data.dijkstra.path} in ${data.dijkstra.time} seconds\nDFS: ${data.dfs.path} in ${data.dfs.time} seconds`;
    })
    .catch((error) => {
        console.error('Error:', error);  // Log error
    });
}

// Add event listener to the fetch button
document.getElementById('fetchButton').addEventListener('click', fetchGraph);
