const stockReference = document.querySelector("#stock-reference")
const realTime = document.querySelector("#real-time-span")
const exchange = document.querySelector("#exchange")
const lastPrice = document.querySelector("#last-price")
const fiftyAverage = document.querySelector("#fifty-ave")
const twoHundredAve = document.querySelector("#two-hun-ave")
const priceChanges = document.querySelector("#price-changes")
const percentChanges = document.querySelector("#percent-changes")
const addToList = document.querySelector("#add-to-list")
const tickerTextEl = document.querySelector(".ticker-item");
const openEl = document.querySelector("#open")
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
const companyDescription = document.querySelector("#company-details");
const freeCashFlow = document.querySelector("#freecashflow");
const grossProfitMargin = document.querySelector("#grossprofitmargin");
const cashPerShare = document.querySelector("#cashpershare");


$(document).foundation();

const baseStockUrl = "https://financialmodelingprep.com/api/v3/"
const financialModelAPIKey = "apikey=6404b2cc55178671f57f48fc947b5f75"

const baseExchangeUrl = "https://api.exchangeratesapi.io/v1/latest?";
const exchangeAPIKey ="93316d725ce60b2d7c05753bfda8175e";

let companyName = "";
var currency;
var currencyMultiplier;
var finData;


/**
 * Called when the page is loaded to make an API call, make additional API calls and pass the data to be rendered to
 * additional functions
 * @author Nate Irvin <irv0735@gmail.com>
 */
function init(){
    let ticker = localStorage.getItem("ticker");
    fetch(baseStockUrl + "quote/" + ticker + '?' +financialModelAPIKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (data) {
                    companyName = data[0].name;
                    renderData(data[0]);
                    getRecentNews(ticker);
                    getStockGrades(ticker);
                    showHorizontalScoll();
                    getFinancialRatios(ticker);
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
    fetch(baseStockUrl + "profile/" + ticker + "?" + financialModelAPIKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (data.length != 0) {
                    companyDescription.innerHTML = data[0].description
                } else {
                    companyDescription.innerHTML = "No description available for this selection."
                }
            });
        } else {
            console.log("Error" + response.statusText);
        }
    });
};

/**
 * Renders the data returned from the main API call
 * @author Nate Irvin <irv0735@gmail.com>
 * @param {Array} data basic stock information 
 */
function renderData(data) {
    finData = data;
    stockReference.innerHTML = data.name + " / " + data.symbol;
    exchange.innerHTML = data.exchange;
    lastPrice.innerHTML =  data.price.toFixed(2);
    fiftyAverage.innerHTML = data.priceAvg50.toFixed(2);
    twoHundredAve.innerHTML = data.priceAvg200.toFixed(2);
    priceChanges.innerHTML =  data.change.toFixed(2); 
    if (data.change.toFixed(2) > 0)
    {
        lastPrice.setAttribute("class","green");
    }
    else
    {
        lastPrice.setAttribute("class","red");
    }
    percentChanges.innerHTML = data.changesPercentage.toFixed(2);
    openEl.innerHTML = data.open.toFixed(2);
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
    if (data.marketCap) {
        marketCap.innerHTML = (data.marketCap/1000000).toFixed(3) + " Million";
    }
}

/**
 * Renders the 3 most recent stock grades/changes
 * @author Nate Irvin <irv0735@gmail.com>
 * @param {Array} grades obtained and passed in from an API call
 */
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

/**
 * 
 * @author Satish Iyer
 */
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

/**
 * 
 * @author Satish Iyer
 */
function applyNewCurrency(){
    if (finData.exchange == "FOREX" || finData.exchange == "CRYPTO") {
        document.querySelector("#exchange-rate").innerHTML = "Exchange Rate not applicaple for FOREX or CRYPTO"
        return
    } else {
        lastPrice.textContent = (finData.price.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
        lastPrice.setAttribute("data-currency",currency);
        fiftyAverage.innerHTML = (finData.priceAvg50.toFixed(2)* currencyMultiplier.toFixed(2)).toFixed(2) ;
        twoHundredAve.innerHTML = (finData.priceAvg200.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2) ;
        dayHi.innerHTML = (finData.dayHigh.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
        dayLo.innerHTML = (finData.dayLow.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
        yearHi.innerHTML = (finData.yearHigh.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
        yearLo.innerHTML = (finData.yearLow.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
        priceChanges.innerHTML = (finData.change.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
        priceChanges.setAttribute("data-currency",currency);
        eps.innerHTML = (finData.eps.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
        marketCap.innerHTML = (finData.eps.toFixed(2) * currencyMultiplier.toFixed(2)).toFixed(2);
    }
}

/**
 * 
 * @author Satish Iyer
 * @param {*} stockTicker 
 */
function getRecentNews(stockTicker) {
    
    const newsDiv = document.querySelector("#news-cell-card");
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
        if (newsData.length !== 0) {
            for (let index = 0; index < 6; index++) {
                newsLi[index] =  document.createElement('li');
                a[index] =document.createElement('a');
                
                a[index].setAttribute("href",newsData[index].url);
                a[index].setAttribute("target", "_blank");
                a[index].innerHTML = (newsData[index].text).substring(0,100)+'...';
                
                br[index] = document.createElement('br');
                newsLi[index].appendChild(a[index]);
                newsDiv.append(newsLi[index]);
                newsDiv.append(br[index]);
            }
        } else {
            newsDiv.innerHTML = "No news available for this selection."
        }
    
    })
}

/**
 * API call to get the recent stock grades and pass to a render function
 * @author Nate Irvin <irv0735@gmail.com>
 * @param {String} ticker The ticker from local storage that the page was loaded based on 
 */
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

// Event listener for the return to main screen button
document.querySelector("#return-home").addEventListener("click", function(event){
    document.location.replace("./index.html");
})

// Event listener to add the stock to your list
document.querySelector("#add-to-list").addEventListener("click", function(event){
    let stockSymbol = localStorage.getItem("ticker");
    let match = false;
    watchListArray = JSON.parse(localStorage.getItem("yourList"));
    watchListArray.forEach(element => {
        if (stockSymbol == element.symbol) {
            match = true;
        } 
    });
    if (!match) {
        let stockObject = {"name": companyName, "symbol": stockSymbol};
        watchListArray.push(stockObject);
        localStorage.setItem("yourList", JSON.stringify(watchListArray));
    } 
    $("#in-list").foundation('open');
    $('#in-list').on("click", "button", function(event) {
        document.location = "./stock_details.html"
    })
})


init();

/**
 * Interval function to make an API call for a short "real-time" quote that updates 
 * every 2 seconds.
 * @author Nate Irvin <irv0735@gmail.com>
 */
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


async function showHorizontalScoll()
{
    var newTicker = JSON.parse(localStorage.getItem("yourList"));
    var tickerPriceAray =[];
    var tickerText ="Real time price of stocks in your list: ";

    for (let index = 0; index < newTicker.length; index++) {
          tickerPriceAray[index] = await fetchLatestPrice(newTicker[index].symbol);
        tickerText += newTicker[index].symbol + ": " + tickerPriceAray[index] + " "
    }
    tickerTextEl.textContent = tickerText;
    
}

function fetchLatestPrice(stockTicker){
var shortQuote = "";

 return fetch(baseStockUrl + "quote-short/" + stockTicker + "?" + financialModelAPIKey)
    .then(function(quoteResponse) {
        if (quoteResponse.ok) 
        return quoteResponse.json();
        
    })
    .then(function (quoteData) {
        if (quoteData) {
        shortQuote = quoteData[0].price.toFixed(2);
        return shortQuote;
        }
    })
}

function getFinancialRatios(stockTicker){
    
    fetch(baseStockUrl + "ratios-ttm/" + stockTicker + "?" + financialModelAPIKey)
    .then(function(ratioResponse) {
        if (ratioResponse.ok) 
        return ratioResponse.json();
        
    })
    .then(function (ratioData) {
                if (ratioData) {
                    if (ratioData[0].freeCashFlowPerShareTTM) {
                        freeCashFlow.innerHTML = (ratioData[0].freeCashFlowPerShareTTM).toFixed(2);
                    }
                    if (ratioData[0].grossProfitMarginTTM) {
                        grossProfitMargin.innerHTML = (ratioData[0].grossProfitMarginTTM).toFixed(2);
                    }
                    if (ratioData[0].cashPerShareTTM) {
                        cashPerShare.innerHTML = (ratioData[0].cashPerShareTTM).toFixed(2);
                    }
                }
            })
}