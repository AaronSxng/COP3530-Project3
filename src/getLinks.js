async function checkPage(pageName) {
    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
        action: "query",
        format: "json",
        titles: pageName,
        prop: "info",
    };
    url = url + "?origin=*";
    Object.keys(params).forEach(function(key) {
        url += "&" + key + "=" + encodeURIComponent(params[key]);
    });

    try {
        let response = await fetch(url);
        let data = await response.json();
        let pages = data.query.pages;

        for (let pageId in pages) {
            if (pageId === "-1" || pages[pageId].missing) {
                console.error(`Page ${pageName} does not exist.`);
                alert(`${pageName} does not exist`);
                return false;
            } else {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error(`Error checking page existence: ${error}`);
        alert(`Error checking page existence for ${pageName}`);
        return false;
    }
}

async function fetchWikipediaLinks(pageName) {
    var url = "https://en.wikipedia.org/w/api.php";
    
    var params = {
        action: "query",
        format: "json",
        titles: pageName,
        prop: "links",
        pllimit: "max"
    };
    
    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + encodeURIComponent(params[key]);});

    try {
        let response = await fetch(url);
        let data = await response.json();
        let pages = data.query.pages;
        let links = [];
        for (var p in pages) {
            console.log(`Processing page: ${p}`);
            if (pages[p].links) {
                for (var l of pages[p].links) {
                    links.push(l.title);
                }
            } else {
                console.error(`No links found for page: ${pageName}`);
            }
        }
        console.log(`Links for ${pageName}:`, links);
        return links;
    } catch (error) {
        console.error(`Error fetching links: ${error}`);
        alert(`Error fetching links for ${pageName}`);
        return [];
    }
}

document.getElementById('fetchButton').addEventListener('click', async () => {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    if (input1 === "" || input2 === "") {
        alert("Page name is invalid");
        return;
    }

    const [exists1, exists2] = await Promise.all([checkPage(input1), checkPage(input2)]);
    if (!exists1 || !exists2) {
        return;
    }

    const links1 = await fetchWikipediaLinks(input1);
    const links2 = await fetchWikipediaLinks(input2);

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

    var graphData = {
        nodes: [{ name: input1 }, { name: input2 }],
        links: links1.map(link => ({ source: input1, target: link })).concat(links2.map(link => ({ source: input2, target: link }))
    };

    console.log('Graph Data:', graphData);

    // Clear previous SVG elements before drawing new ones
    d3.select("svg").selectAll("*").remove();

    var svg = d3.select("svg");
    var width = +svg.attr("width") || 1000;  // Default width if not set
    var height = +svg.attr("height") || 1000;  // Default height if not set

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
});
