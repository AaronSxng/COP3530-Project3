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

export { checkPage, fetchWikipediaLinks };
