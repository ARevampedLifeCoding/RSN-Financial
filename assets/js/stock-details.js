console.log("connected to stock-detail.js");
const stockReference = document.querySelector("#stock-reference")

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
                renderData(data[0]);
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
}

init();