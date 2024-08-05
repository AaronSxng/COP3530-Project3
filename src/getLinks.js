// getLinks.js
//https://www.mediawiki.org/wiki/API:Links#Response

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
                alert(`${pageName} does not exist`);
                return false;  
            } else {
                return true;   
            }
        }
        return false; 
    } catch (error) {
        console.error(`Error checking page existence: ${error}`);
        alert(`${pageName} does not exist`);
        return false; 
    }
}

async  function fetchWikipediaLinks() {
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

    var url = "https://en.wikipedia.org/w/api.php";
    
    var params = {
        action: "query",
        format: "json",
        titles: input1,
        prop: "links",
        pllimit: "max"
    };
    
    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    fetch(url)
        .then(function(response){return response.json();})
        .then(function(response) {
            var pages = response.query.pages;
            for (var p in pages) {
                for (var l of pages[p].links) {
                    console.log(l.title);
                }
            }
        })
        .catch(function(error){console.log(error);});
}

//event listener
document.getElementById('fetchButton').addEventListener('click', fetchWikipediaLinks);
