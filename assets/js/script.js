const searchForm = document.querySelector("#search-form");
const resultsTable = document.querySelector("#results-table");
const watchList = document.querySelector("#watch-list");
const gainers = document.querySelector("#gainers");
const losers = document.querySelector("#losers");

$(document).foundation();

let watchListArray = [];
let searchResults = [];

const baseStockUrl = "https://financialmodelingprep.com/api/v3/"
const financialModelAPIKey = "&apikey=6404b2cc55178671f57f48fc947b5f75"


/**
 * Renders the results from the search and adds event listeners to the buttons created
 * @author Nate Irvin <irv0735@gmail.com>
 * @param {array} matchingResults - array of ojects containing the results to be rendered
 */
function renderResults(matchingResults){
    resultsTable.innerHTML= ""
    if (matchingResults) {
        document.querySelector("#clear-space").innerHTML = ""
        let clearBtn = document.createElement("button")
        clearBtn.setAttribute("class", "button warning custom-button")
        clearBtn.setAttribute("id", "clear-results")
        clearBtn.innerText = "Clear Results"
        document.querySelector("#clear-space").appendChild(clearBtn)
    }
    matchingResults.forEach(element => {
        let newTr = document.createElement("tr");
        newTr.setAttribute("class", "search-result");
        
        let tdName = document.createElement("td");
        tdName.textContent = element.name;
        newTr.appendChild(tdName);
        let tdSymbol = document.createElement("td");
        tdSymbol.textContent = element.symbol;
        newTr.appendChild(tdSymbol);
        let tdCurrency = document.createElement("td");
        tdCurrency.setAttribute("class", "small-delete");
        tdCurrency.textContent = element.currency;
        newTr.appendChild(tdCurrency);
        let tdExchange = document.createElement("td");
        tdExchange.setAttribute("class", "small-delete");
        tdExchange.textContent = element.exchangeShortName;
        newTr.appendChild(tdExchange);

        let tdAdd = document.createElement("td");
        tdAdd.setAttribute("class", "add-line");
        let addBtn = document.createElement("button");
        addBtn.setAttribute("class", "button primary custom-button");
        addBtn.setAttribute("id", "add-btn");
        addBtn.innerHTML = "ADD";
        tdAdd.appendChild(addBtn);
        newTr.appendChild(tdAdd);

        let tdMore = document.createElement("td");
        tdMore.setAttribute("class", "more-line");
        let moreBtn = document.createElement("button");
        moreBtn.setAttribute("class", "button secondary custom-button");
        moreBtn.setAttribute("id", "more-btn");
        moreBtn.innerHTML = "More Info";
        tdMore.appendChild(moreBtn);
        newTr.appendChild(tdMore);

        resultsTable.appendChild(newTr);   
    });

    $(".add-line").on("click", "button", function(event){
    let selectedName = $(this).closest("tr").children().first().text();
    let selectedSymbol = $(this).closest("tr").children().eq(1).text();
    addToYourList(selectedName, selectedSymbol)
    });
    $(".more-line").on("click", "button", function(event){
    let selectedSymbol = $(this).closest("tr").children().eq(1).text();
    detailedInfo(selectedSymbol);
    });
    $("#clear-space").on("click", function(){
        document.querySelector("#clear-space").innerHTML = ""
        searchResults = [];
        sessionStorage.setItem("searchResults", JSON.stringify(searchResults))
        renderResults(searchResults);
    }) 
}

/**
 * Renders the list of stocks that have been added to the user's watch list (pulled from local storage)
 * @author Nate Irvin <irv0735@gmail.com>
 */
function renderYourList() {
    watchList.innerHTML = ""
    watchListArray = JSON.parse(localStorage.getItem("yourList"));
    
    watchListArray.forEach(element => {
        let tr = document.createElement("tr")
        let tdName = document.createElement("td")
        let tdSymbol = document.createElement("td")
        let tdMore = document.createElement("td");
        tdMore.setAttribute("class", "more-info");
        let moreBtn = document.createElement("button");
        moreBtn.setAttribute("class", "button secondary custom-button");
        moreBtn.setAttribute("id", "more-btn");
        moreBtn.innerHTML = "More Info";
        tdMore.appendChild(moreBtn);
        let tdRemove = document.createElement("td")
        tdRemove.setAttribute("class", "remove-btn")
        let deleteBtn = document.createElement("button")
        deleteBtn.setAttribute("class", "button alert custom-button")
        deleteBtn.innerHTML = "REMOVE"
        tdRemove.appendChild(deleteBtn)
        tdName.innerHTML= element.name
        tdSymbol.innerHTML= element.symbol
        tr.appendChild(tdName)
        tr.appendChild(tdSymbol)
        tr.appendChild(tdMore)
        tr.appendChild(tdRemove)
        watchList.appendChild(tr)    
    });
    $(".more-info").on("click", "button", function(event){
        let selectedSymbol = $(this).closest("tr").children().eq(1).text();
        detailedInfo(selectedSymbol);
        });
    $(".remove-btn").on("click", "button", function(event){
        let selectedRowSymbol = $(this).closest("tr").children().eq(1).text();
        watchListArray = JSON.parse(localStorage.getItem("yourList"));
        for (i=0; i<watchListArray.length; i++) {
            if (selectedRowSymbol == watchListArray[i].symbol) {
                watchListArray.splice(i, 1);
                localStorage.setItem("yourList", JSON.stringify(watchListArray));
                renderYourList()
            }
        }
    })
}

/**
 * Takes an array passed from an API call fetch and appends the row to the appropriate location
 * @author Nate Irvin <irv0735@gmail.com>
 * @param {Array} gainerArray 
 */
function renderGainers(gainerArray) {
    gainerArray.forEach(element => {
        let tr = renderMover(element);
        gainers.appendChild(tr);
    });
}

/**
 * Takes an array passed from an API call fetch and appends the row to the appropriate location
 * @author Nate Irvin <irv0735@gmail.com>
 * @param {Array} loserArray 
 */
function renderLosers(loserArray) {
    loserArray.forEach(element => {
        let tr = renderMover(element);
        losers.appendChild(tr);
       
    });  
}

/**
 * Takes an object and creates a table row populated with the data from the object
 * @author Nate Irvin <irv0735@gmail.com>
 * @param {object} itemToAdd 
 * @returns HTML Element <tr> to be appended to the appropriate loction in the dom
 */
function renderMover(itemToAdd) {
    let tr = document.createElement("tr")
    let tdtick = document.createElement("td")
    let aTick = document.createElement("a")
    aTick.innerHTML = itemToAdd.ticker
    tdtick.appendChild(aTick);
    tr.appendChild(tdtick);
    aTick.addEventListener("click", function() {
        detailedInfo(itemToAdd.ticker);
    }, false);

    let tdprice = document.createElement("td")
    tdprice.innerHTML = itemToAdd.price
    tr.appendChild(tdprice)

    let tdchange = document.createElement("td")
    tdchange.innerHTML = itemToAdd.changes
    tr.appendChild(tdchange)

    let tdpercent = document.createElement("td")
    tdpercent.innerHTML = itemToAdd.changesPercentage
    tr.appendChild(tdpercent)
    return tr;
}

/**
 * API call to fetch stocks based on search terms
 * @author Nate Irvin <irv0735@gmail.com>
 * @param {string} searchTerm   company name or ticker to be searched
 * @param {string} exchangeChoice  filter if they are looking for a stock on a specific exchange
 */
function stockSearch(searchTerm, exchangeChoice) {
    if (exchangeChoice !== "all") {
        fetch(baseStockUrl + "search?query=" + searchTerm + "&limit=10&exchange=" + exchangeChoice + financialModelAPIKey)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function (data) {
                    sessionStorage.setItem("searchResults", JSON.stringify(data))
                    renderResults(data);
                });
            } else {
                console.log("Error" + response.statusText);
            }
        })
        .catch(function (error) {
            console.log("unable to connect to financial model");
        });
    } else {
        fetch(baseStockUrl + "search?query=" + searchTerm + "&limit=10" + financialModelAPIKey)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function (data) {
                sessionStorage.setItem("searchResults", JSON.stringify(data))
                renderResults(data);
                });
            } else {
                console.log("Error" + response.statusText);
            }
        })
        .catch(function (error) {
            console.log("unable to connect to financial model");
        });
    } 
};

/**
 * Gets the Market Movers using an API call and then passes the data to functions to be rendered on the page
 * @author Nate Irvin <irv0735@gmail.com>
 */
function getMarketMovers(){
    fetch(baseStockUrl + "gainers?" + financialModelAPIKey)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function (data) {
                    renderGainers(data.splice(0,3))
                });
            } else {
                console.log("Error" + response.statusText);
            }
        })
        .catch(function (error) {
            console.log("unable to connect to financial model");
        });  
    fetch(baseStockUrl + "losers?" + financialModelAPIKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
                renderLosers(data.splice(0,3))
            });
        } else {
            console.log("Error" + response.statusText);
        }
    })
    .catch(function (error) {
        console.log("unable to connect to financial model");
    });  
}

/**
 * Adds selected stock to local storage, if it is not already present and then calls function to render
 * @author Randy Langston 
 * @param {string} companyName 
 * @param {string} stockSymbol 
 */
function addToYourList(companyName, stockSymbol){
    let match = false;
    watchListArray = JSON.parse(localStorage.getItem("yourList"));
    watchListArray.forEach(element => {
        if (stockSymbol == element.symbol) {
            $("#already-exists").foundation('open');
            $('#already-exists').on("click", "button", function(event) {
                document.location = "./index.html"
            })
            match = true;
            return;
        } 
    });
    if (!match) {
        let stockObject = {"name": companyName, "symbol": stockSymbol};
        watchListArray.push(stockObject);
        localStorage.setItem("yourList", JSON.stringify(watchListArray));
        renderYourList()
    } 
}

/**
 * Saves the selected ticker in local storage and loads the stock_details page
 * @author Nate Irvin <irv0735@gmail.com>
 */
function detailedInfo(ticker) {
    localStorage.setItem("ticker", ticker);
    document.location.replace("./stock_details.html");
}

/**
 * Called when the page loads, renders the previous search results and user's watchlist
 * @author Nate Irvin <irv0735@gmail.com>
 */
function init() {
    searchResults = JSON.parse(sessionStorage.getItem("searchResults"));
    if (searchResults) {
        renderResults(searchResults)
    }
    watchListArray = JSON.parse(localStorage.getItem("yourList"));
    if (!watchListArray) {
        watchListArray = [];
        localStorage.setItem("yourList", JSON.stringify(watchListArray));
    }
    renderYourList();
    getMarketMovers();
}

/**
 * Event listener for the search button
 */
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    let searchText = document.querySelector("#search-text").value
    let exchangeSelect = document.querySelector("#exchange-select").value

    if (searchText) {
        stockSearch(searchText, exchangeSelect);
    }
    else {
        $("#blank-search").foundation("open")
        $("#blank-search").on("click", "button", function(event){
            document.location = "./index.html"
        })
    }  
})

/**
 * Adjust classes based on window size for responsive adjustments
 */
$(document).ready(function($) {
    let alterClass = function() {
        let ww = document.body.clientWidth;
        if (ww < 960) {
            $("#results-box").removeClass("shrink medium-8 medium-order-1");
            $("#results-box").addClass("medium-12 medium-order-2");
            $("#search-box").removeClass("auto medium-order-2");
            $("#search-box").addClass("medium-order-1");
            $("#your-list").addClass("medium-12");
            $("#market-movers").addClass("medium-12")
        } else if (ww >= 960) {
            $("#results-box").addClass("shrink medium-8 medium-order-1");
            $("#results-box").removeClass("medium-12 medium-order-2");
            $("#search-box").addClass("auto medium-order-2");
            $("#search-box").removeClass("medium-order-1");
            $("#your-list").removeClass("medium-12");
            $("#market-movers").removeClass("medium-12")
        };
    };
    $(window).resize(function() {
        alterClass();
    });
    alterClass();
});


init()

