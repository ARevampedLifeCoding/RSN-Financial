const searchForm = document.querySelector("#search-form");
const resultsTable = document.querySelector("#results-table");
const watchList = document.querySelector("#watch-list");

$(document).foundation();

let watchListArray = [];
let searchResults = [];

const baseStockUrl = "https://financialmodelingprep.com/api/v3/"
const financialModelAPIKey = "&apikey=6404b2cc55178671f57f48fc947b5f75"



function renderResults(matchingResults){
    resultsTable.innerHTML= ""
    if (matchingResults) {
        document.querySelector("#clear-space").innerHTML = ""
        let clearBtn = document.createElement("button")
        clearBtn.setAttribute("class", "button warning")
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
        tdCurrency.textContent = element.currency;
        newTr.appendChild(tdCurrency);
        let tdExchange = document.createElement("td");
        tdExchange.textContent = element.exchangeShortName;
        newTr.appendChild(tdExchange);

        let tdAdd = document.createElement("td");
        tdAdd.setAttribute("class", "add-line");
        let addBtn = document.createElement("button");
        addBtn.setAttribute("class", "button primary");
        addBtn.setAttribute("id", "add-btn");
        addBtn.innerHTML = "ADD";
        tdAdd.appendChild(addBtn);
        newTr.appendChild(tdAdd);

        let tdMore = document.createElement("td");
        tdMore.setAttribute("class", "more-line");
        let moreBtn = document.createElement("button");
        moreBtn.setAttribute("class", "button secondary");
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

function renderYourList() {
    watchList.innerHTML = ""
    watchListArray = JSON.parse(localStorage.getItem("yourList"));
    
    watchListArray.forEach(element => {
        let tr = document.createElement("tr")
        let tdName = document.createElement("td")
        let tdSymbol = document.createElement("td")
        let tdRemove = document.createElement("td")
        tdRemove.setAttribute("class", "remove-btn")
        let deleteBtn = document.createElement("button")
        deleteBtn.setAttribute("class", "button warning")
        deleteBtn.innerHTML = "REMOVE"
        tdRemove.appendChild(deleteBtn)
        tdName.innerHTML= element.name
        tdSymbol.innerHTML= element.symbol
        tr.appendChild(tdName)
        tr.appendChild(tdSymbol)
        tr.appendChild(tdRemove)
        watchList.appendChild(tr)    
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

function detailedInfo(ticker) {
    localStorage.setItem("ticker", ticker);
    document.location.replace("./stock_details.html");
}


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
}


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

init()

