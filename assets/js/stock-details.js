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

const baseExchangeUrl = "https://api.exchangeratesapi.io/v1/latest?";
const exchangeAPIKey ="93316d725ce60b2d7c05753bfda8175e";

var currency;
var currencyMultiplier;
var finData;

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
    finData = data;
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
    // console.log (prefCurrency.value);
    currency = prefCurrency.value;
    var exchangeQueryUrl = baseExchangeUrl+'access_key='+exchangeAPIKey+'&base=USD';
    // console.log(exchangeQueryUrl);
    //fetch("http://api.exchangeratesapi.io/v1/latest?access_key=93316d725ce60b2d7c05753bfda8175e&base=USD")
    fetch(exchangeQueryUrl)
    .then(function(ExchangeResponse){
    console.log(ExchangeResponse);
    return ExchangeResponse.json();
    })

    .then(function(ExchangeData){
    console.log(ExchangeData);
    
    switch (currency) {
        case 'CAD':
            currencyMultiplier = ExchangeData.rates.CAD;
            break;

        case 'USD':
            
            currencyMultiplier = ExchangeData.rates.USD
            break;
        
        case 'JPY': 
            currencyMultiplier = ExchangeData.rates.JPY
            
            break;   
        case 'EUR':
            currencyMultiplier = ExchangeData.rates.EUR;
            
    }
    exchangeRate.textContent = "1 USD = " + currencyMultiplier +" " +currency;  
    applyNewCurrency(); //updates the Stock info in the grid with chosen currency
    })
})

function applyNewCurrency(){
    lastPrice.textContent = "Last Price:   " + (finData.price.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2) ;
    fiftyAverage.innerHTML = "50 Day Avg:   " + (finData.priceAvg50.toFixed(2)* currencyMultiplier.toFixed(2)).toFixed(2) ;
    twoHundredAve.innerHTML = "200 Day Avg:   " + (finData.priceAvg200.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2) ;
    dayHi.innerHTML = "Day High:   " + (finData.dayHigh.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
    dayLo.innerHTML = "Day Low:   " + (finData.dayLow.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
    yearHi.innerHTML = "Year High:   " + (finData.yearHigh.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
    yearLo.innerHTML = "Year Low:   " + (finData.yearLow.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
}

document.querySelector("#return-home").addEventListener("click", function(event){
    document.location.replace("./index.html");
})

init();