// getLinks.js
//https://www.mediawiki.org/wiki/API:Links#Response

/*//event listener
document.getElementById('fetchButton').addEventListener('click', async () => {
    // Reset data
    document.getElementById('timeTaken').textContent = '';
    document.getElementById('shortestPath').textContent = '';
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

    //creates the map
    createMap(input1, input2);
});*/

//checks if page exists
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

//gets all the links in pageName
async function fetchWikipediaLinks(pageName) {
    let url = "https://en.wikipedia.org/w/api.php";
    let params = {
        action: "query",
        format: "json",
        titles: pageName,
        prop: "links",
        pllimit: "max"
    };

    url += "?origin=*";
    Object.keys(params).forEach(key => url += "&" + key + "=" + params[key]);
    
    let linksArray = [];

    async function fetchLinks(url, continueParams = {}) {
        if (Object.keys(continueParams).length > 0) {
            Object.keys(continueParams).forEach(key => url += "&" + key + "=" + continueParams[key]);
        }

        try {
            let response = await fetch(url);
            let data = await response.json();
            let pages = data.query.pages;

            for (let pageId in pages) {
                let links = pages[pageId].links || [];
                links.forEach(link => linksArray.push(link.title));
            }

            if (data.continue) {
                await fetchLinks(url, data.continue);
            }
        } catch (error) {
            console.error("Error fetching links:", error);
        }
    }

    await fetchLinks(url);
    return linksArray;
}

async function createMap(input1, input2) {
    var queue = [input1];
    let wikiMap = new Map();
    let found = false;

    while(!found) {
        let tempPage = queue.shift();
        if (wikiMap.has(tempPage)) continue;

        let tempArray = await fetchWikipediaLinks(tempPage);
        wikiMap.set(tempPage, tempArray);
        for (const pages of tempArray) {
            if(pages.toLowerCase() === input2.toLowerCase()) {
                found = true;
                continue;
            }
            queue.push(pages);
        }
    }
    return wikiMap;
}

export { checkPage, fetchWikipediaLinks, createMap };