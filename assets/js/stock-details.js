const stockReference = document.querySelector("#stock-reference")
const realTime = document.querySelector("#real-time-span")
const exchange = document.querySelector("#exchange")
const lastPrice = document.querySelector("#last-price")
const fiftyAverage = document.querySelector("#fifty-ave")
const twoHundredAve = document.querySelector("#two-hun-ave")
const priceChanges = document.querySelector("#price-changes")
const percentChanges = document.querySelector("#percent-changes")

const dayHi = document.querySelector("#day-hi")
const dayLo = document.querySelector("#day-lo")
const yearHi = document.querySelector("#year-hi")
const yearLo = document.querySelector("#year-lo")
const eps = document.querySelector("#eps")
const peRatio = document.querySelector("#pe")
const marketCap = document.querySelector("#market-cap")
const prefCurrency = document.querySelector("#currency");
const exchangeRate = document.querySelector("#exchange-rate");
const stockGrades = document.querySelector("#grade-data");

const baseStockUrl = "https://financialmodelingprep.com/api/v3/"
const financialModelAPIKey = "apikey=6404b2cc55178671f57f48fc947b5f75"

const baseExchangeUrl = "https://api.exchangeratesapi.io/v1/latest?";
const exchangeAPIKey ="93316d725ce60b2d7c05753bfda8175e";

var currency;
var currencyMultiplier;
var finData;

function init(){
    let ticker = localStorage.getItem("ticker");
    fetch(baseStockUrl + "quote/" + ticker + '?' +financialModelAPIKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (data) {
                    renderData(data[0]);
                    getRecentNews(ticker);
                    getStockGrades(ticker);
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
    lastPrice.innerHTML =  data.price.toFixed(2);
    fiftyAverage.innerHTML = data.priceAvg50.toFixed(2);
    twoHundredAve.innerHTML = data.priceAvg200.toFixed(2);
    priceChanges.innerHTML =  data.change.toFixed(2); 
    percentChanges.innerHTML = data.changesPercentage.toFixed(2);
    dayHi.innerHTML = data.dayHigh.toFixed(2);
    dayLo.innerHTML = data.dayLow.toFixed(2);
    yearHi.innerHTML = data.yearHigh.toFixed(2);
    yearLo.innerHTML = data.yearLow.toFixed(2);
    if (data.eps) {
        eps.innerHTML = data.eps.toFixed(2);
    }
    if (data.pe) {
        peRatio.innerHTML = data.pe.toFixed(2);
    }
    if (data.marketcap) {
        marketCap.innerHTML = (data.marketCap/1000000).toFixed(3) + " Million";
    }
}

function renderGrades(grades) {
    grades.forEach(element => {
        let tRow = document.createElement("tr")
        stockGrades.appendChild(tRow)
        let tdName = document.createElement("td")
        tdName.innerHTML = element.gradingCompany
        tRow.appendChild(tdName)
        let tdDate = document.createElement("td")
        tdDate.innerHTML = element.date
        tRow.appendChild(tdDate)
        let tdPrevious = document.createElement("td")
        tdPrevious.innerHTML = element.previousGrade
        tRow.appendChild(tdPrevious)
        let tdNew = document.createElement("td")
        tdNew.innerHTML = element.newGrade
        tRow.appendChild(tdNew)
    });
}

prefCurrency.addEventListener('change', function(){
    currency = prefCurrency.value;
    var exchangeQueryUrl = baseExchangeUrl+'access_key='+exchangeAPIKey+'&base=USD';
    // console.log(exchangeQueryUrl);
    //fetch("http://api.exchangeratesapi.io/v1/latest?access_key=93316d725ce60b2d7c05753bfda8175e&base=USD")
    fetch(exchangeQueryUrl)
    .then(function(ExchangeResponse){
    return ExchangeResponse.json();
    })

    .then(function(ExchangeData){
    
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
    lastPrice.textContent = (finData.price.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
    fiftyAverage.innerHTML = (finData.priceAvg50.toFixed(2)* currencyMultiplier.toFixed(2)).toFixed(2) ;
    twoHundredAve.innerHTML = (finData.priceAvg200.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2) ;
    dayHi.innerHTML = (finData.dayHigh.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
    dayLo.innerHTML = (finData.dayLow.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
    yearHi.innerHTML = (finData.yearHigh.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
    yearLo.innerHTML = (finData.yearLow.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
}

function getRecentNews(stockTicker) {
    
    const newsDiv = document.querySelector("#news-cell");
    var newsLi =[];
    var br =[];
    var a =[];

    fetch(baseStockUrl+"stock_news?tickers="+stockTicker+  "&limit=8&" +financialModelAPIKey)
    
    .then(function(newsResponse){
        if (newsResponse.ok){
            return newsResponse.json();
        }
    })
    .then(function(newsData){ 
        
        if (newsData !== null) {
            for (let index = 0; index < newsData.length; index++) {
                newsLi[index] =  document.createElement('li');
                a[index] =document.createElement('a');
                
                a[index].setAttribute("href",newsData[index].url);
                a[index].innerHTML = (newsData[index].text).substring(0,100)+'...';
                
                br[index] = document.createElement('br');
                newsLi[index].appendChild(a[index]);
                newsDiv.append(newsLi[index]);
                newsDiv.append(br[index]);
            }
        }
    
    })
}

function getStockGrades(ticker) {
    fetch(baseStockUrl + "grade/" + ticker + '?limit=3&' +financialModelAPIKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (data) {
                    renderGrades(data);
                }
                else {
                    console.log("invalid data returned");
                    document.querySelector("#grades-card").innerHTML = ""
                }
            });
        } else {
            console.log("Error" + response.statusText);
        }
    })
    .catch(function (error) {
        console.log("unable to connect to financial model" + error);
    });  
}

document.querySelector("#return-home").addEventListener("click", function(event){
    document.location.replace("./index.html");
})

init();
setInterval(function(){
    let newTicker = localStorage.getItem("ticker");
    fetch(baseStockUrl + "quote-short/" + newTicker + "?" + financialModelAPIKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (data) {
                    realTime.innerHTML = data[0].price.toFixed(2)
                } else {
                    console.log("invalid data returned");
                    realTime.innerHTML = "";
                }
            });
        } else {
            console.log("Error" + response.statusText);
        }
    })
    .catch(function (error) {
        console.log("Unable to connect to financial model" + error);
    });
},2000);