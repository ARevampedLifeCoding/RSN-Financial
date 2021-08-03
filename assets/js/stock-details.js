const stockReference = document.querySelector("#stock-reference")
const lastPrice = document.querySelector("#last-price")
const fiftyAverage = document.querySelector("#fifty-ave")
const twoHundredAve = document.querySelector("#two-hun-ave")
const priceChanges = document.querySelector("#price-changes")
const dayHi = document.querySelector("#day-hi")
const dayLo = document.querySelector("#day-lo")
const yearHi = document.querySelector("#year-hi")
const yearLo = document.querySelector("#year-lo")
const eps = document.querySelector("#eps")
const peRatio = document.querySelector("#pe")
const marketCap = document.querySelector("#market-cap")

const baseStockUrl = "https://financialmodelingprep.com/api/v3/"
const financialModelAPIKey = "?apikey=6404b2cc55178671f57f48fc947b5f75"

function init(){
//    let ticker = JSON.parse(localStorage.getItem("ticker"));
//    let stockName = JSON.parse(localStorage.getItem("stockName")) - need to set item on main script as well
//    console.log(ticker, stockName);
//  stockReference.innerHTML = stockName + " / " + ticker;
    fetch(baseStockUrl + "quote/" + "AAPL" + financialModelAPIKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (data) {
                    renderData(data[0]);
                }
                else {
                    console.log("invalid data returned");
                }
            });
        } else {
            console.log("Error" + response.statusText);
        }
    })
    .catch(function (error) {
        console.log("unable to connect to financial model");
    });
};

function renderData(data) {
    console.log(data);
    stockReference.innerHTML = data.name + " / " + data.symbol;



}

init();