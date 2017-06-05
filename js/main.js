var digiByte = {};
var response;

digiByte.renderCoin = function(response) {

  var coinRank = response[0].rank;
  var $showRank = $('#coin-rank');
  var htmlRank = '<span>' + coinRank + '</span>';

  //percentage change - adding if/else statement for green if positive, red if negative
  var percentChange = response[0].percent_change_24h;
  var $showPerChange = $('#percent-change');
    if (percentChange >= 0) {
    var htmlPerChange = '<span class="green">+' + percentChange + '% in last 24h</span>';
  } else {
    var htmlPerChange = '<span class="red">' + percentChange + '% in last 24h</span>';
  };

  $showPerChange.empty().hide().append(htmlPerChange).fadeIn(1000);
  $showRank.empty().hide().append(htmlRank).fadeIn(1000);

}

digiByte.renderPolo = function(response) {

  //need to convert lowest price on Poloniex from BTC to USD
  var lowestPrice = (response.BTC_DGB.low24hr) * (response.USDT_BTC.last);
  var $lowestPrice = $('#low-price');
  var htmlLowPrice = '<span>$' + lowestPrice.toFixed(6) + '</span>';

  var highestPrice = (response.BTC_DGB.high24hr) * (response.USDT_BTC.last);
  var $highestPrice = $('#high-price');
  var htmlHighPrice = '<span>$' + highestPrice.toFixed(6) + '<span>';

  $lowestPrice.empty().hide().append(htmlLowPrice).fadeIn(1000);
  $highestPrice.empty().hide().append(htmlHighPrice).fadeIn(1000);



  var currentPrice = (response.BTC_DGB.last) * (response.USDT_BTC.last);
  var $showPrice = $('#dollar');
  var htmlPrice = '<span>$' + currentPrice.toFixed(7) + '</span>';
  $showPrice.empty().append(htmlPrice);

}

//chart.js implementation
function drawLineChart(response) {

  // Add a helper to format timestamp data
  Date.prototype.formatMMDDYYYY = function() {
      return (this.getMonth() + 1) +
      "/" +  this.getDate() +
      "/" +  this.getFullYear();
  }

  var jsonData = $.ajax({
    url: 'https://poloniex.com/public?command=returnChartData&currencyPair=BTC_DGB&start=1405699200&end=9999999999&period=14400',
    dataType: 'json',
  }).done(function (results) {
    // Split timestamp and data into separate arrays
    var labels = [], data=[];

    for (var labelCount=0; labelCount<35; labelCount++) {
      labels.push(results[labelCount].date)
    }
    for (var dataCount=0; dataCount<35; dataCount++) {
      data.push(((results[dataCount].open)+(results[dataCount].close)/2)*(response.USDT_BTC.last))
    }

    // Create the chart.js data structure using 'labels' and 'data'
    var tempData = {
      labels : labels,
      datasets : [{
          backgroundColor : "#f4d35e",
          label: 'Average DGB price in USD',
          strokeColor : "rgba(151,187,205,1)",
          pointColor : "rgba(151,187,205,1)",
          pointBackgroundColor : "#99a1aa",
          pointHighlightFill : "#fff",
          pointRadius : 6.75,
          data : data
      }]
    };

    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("myLineChart").getContext("2d");

    // Instantiate a new chart
    var myNewChart = new Chart(ctx , {
    type: "line",
    data: tempData,
    });
  });
}

//get data from coinmarketcap
var getCoin = function() {
  $.ajax({
    url: 'https://api.coinmarketcap.com/v1/ticker/digibyte/?convert=USD',
    dataType: 'json',
    success: function(response) {
      digiByte.renderCoin(response);
    }
  })
};

//get data from poloniex
var getPolo = function() {
  $.ajax({
    url: 'https://poloniex.com/public?command=returnTicker',
    dataType: 'json',
    success: function(response) {
      digiByte.renderPolo(response);
      drawLineChart(response);
    }
  })
};

//$(document).ready(getCoin);
$(document).ready(getPolo);
$(window).load(drawLineChart);

//refresh data every 60 seconds
//setInterval(getCoin, 60000);
//setInterval(getPolo, 60000);
//setInterval(drawLineChart, 60000);
