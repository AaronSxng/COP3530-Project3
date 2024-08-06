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

async function fetchWikipediaLinks(pageName, depth = 2) {
    const fetchLinks = async (page) => {
        var url = "https://en.wikipedia.org/w/api.php";
        
        var params = {
            action: "query",
            format: "json",
            titles: page,
            prop: "links",
            pllimit: "max"
        };
        
        url = url + "?origin=*";
        Object.keys(params).forEach(function(key) { url += "&" + key + "=" + encodeURIComponent(params[key]); });

        try {
            let response = await fetch(url);
            let data = await response.json();
            let pages = data.query.pages;
            let links = [];
            for (var p in pages) {
                if (pages[p].links) {
                    for (var l of pages[p].links) {
                        links.push(l.title);
                    }
                }
            }
            return links;
        } catch (error) {
            console.error(`Error fetching links: ${error}`);
            return [];
        }
    };

    let allLinks = await fetchLinks(pageName);
    if (depth > 1) {
        for (let link of allLinks) {
            let subLinks = await fetchWikipediaLinks(link, depth - 1);
            allLinks = [...new Set([...allLinks, ...subLinks])]; // Merge and remove duplicates
        }
    }
    return allLinks;
}

export { checkPage, fetchWikipediaLinks };
