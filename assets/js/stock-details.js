const stockReference = document.querySelector("#stock-reference")
const exchange = document.querySelector("#exchange")
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
const prefCurrency = document.querySelector("#currency");
const exchangeRate = document.querySelector("#exchange-rate");

const baseStockUrl = "https://financialmodelingprep.com/api/v3/"
const financialModelAPIKey = "?apikey=6404b2cc55178671f57f48fc947b5f75"
var currency;


function init(){
    let ticker = localStorage.getItem("ticker");
    fetch(baseStockUrl + "quote/" + ticker + financialModelAPIKey)
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
    stockReference.innerHTML = data.name + " / " + data.symbol;
    exchange.innerHTML = data.exchange;
    lastPrice.innerHTML = "Last Price:   " + data.price.toFixed(2);
    fiftyAverage.innerHTML = "50 Day Avg:   " + data.priceAvg50.toFixed(2);
    twoHundredAve.innerHTML = "200 Day Avg:   " + data.priceAvg200.toFixed(2);
    priceChanges.innerHTML = "Change/Change%:   " + data.change.toFixed(2) + "  /  " + data.changesPercentage.toFixed(2); + "%";
    dayHi.innerHTML = "Day High:   " + data.dayHigh.toFixed(2);
    dayLo.innerHTML = "Day Low:   " + data.dayLow.toFixed(2);
    yearHi.innerHTML = "Year High:   " + data.yearHigh.toFixed(2);
    yearLo.innerHTML = "Year Low:   " + data.yearLow.toFixed(2);
    if (data.eps) {
        eps.innerHTML = "EPS:   " + data.eps.toFixed(2);
    }
    if (data.pe) {
        peRatio.innerHTML = "P/E:   " + data.pe.toFixed(2);
    }
    if (data.marketcap) {
        marketCap.innerHTML = "Market Cap:   " + (data.marketCap/1000000).toFixed(3) + " Million";
    }
}



prefCurrency.addEventListener('change', function(){
    console.log (prefCurrency.value);
    currency = prefCurrency.value;

    fetch("http://api.exchangeratesapi.io/v1/latest?access_key=93316d725ce60b2d7c05753bfda8175e&cbase=USD")

    .then(function(response){
    console.log(response);
    return response.json();
    })

    .then(function(data){
    console.log(data);
    
    switch (currency) {
        case 'CAD':
            exchangeRate.textContent = data.rates.CAD; 
            break;

        case 'USD':
            exchangeRate.textContent = data.rates.USD; 
            break;
        
        case 'JPY': 
            exchangeRate.textContent = data.rates.JPY; 
            break;   
        case 'EUR':
            exchangeRate.textContent = data.rates.EUR; 
    }
    
    })
})

init();