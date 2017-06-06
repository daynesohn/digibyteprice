var digiByte = {};
var response;

//getting current date and date 21 days ago for use in chart.js
const dateTime = Date.now();
const currentDate = Math.floor(dateTime / 1000);
const startDate = currentDate - 1814400;

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

  var curBitcoin = response.USDT_BTC.last;

  var jsonData = $.ajax({
    url: 'https://poloniex.com/public?command=returnChartData&currencyPair=BTC_DGB&start=' + startDate + '&end=' + currentDate + '&period=86400',
    dataType: 'json',
  }).done(function (results) {
    // split timestamp and data into separate arrays
    var labels = [], data=[];

    //if screen size under 900px, show 14 days data
    if((screen.innerWidth < 900 && screen.innerWidth > 800) || (window.innerWidth < 900 && window.innerWidth > 800)) {
      var $chartTitle = $('.chart-title'),
          htmlChartTitle = '<span class="chart-title">DigiByte price in USD over the last 14 days</span>';
      $chartTitle.empty().append(htmlChartTitle);
      results.reverse()
      for (var labelCount=0; labelCount<14; labelCount++) {
        var calDate = moment.unix(results[labelCount].date);
        var calDateRead = calDate.format("MMM Do YYYY");
        labels.push(calDateRead);
      } labels.reverse();
      for (var dataCount=0; dataCount<14; dataCount++) {
        var digiOpen = results[dataCount].open,
            digiClose = results[dataCount].close;
            data.push(((digiOpen + digiClose)/2) * curBitcoin);
      } data.reverse();
    } else if((screen.innerWidth <= 800 && screen.innerWidth > 600) || (window.innerWidth <= 800 && window.innerWidth > 600) || (window.width <= 800 && window.width > 600)) {
      var $chartTitle = $('.chart-title'),
          htmlChartTitle = '<span class="chart-title">DigiByte price in USD over the last 7 days</span>';
      $chartTitle.empty().append(htmlChartTitle);
      results.reverse()
      for (var labelCount=0; labelCount<7; labelCount++) {
        var calDate = moment.unix(results[labelCount].date);
        var calDateRead = calDate.format("MMM Do YYYY");
        labels.push(calDateRead);
      } labels.reverse();
      for (var dataCount=0; dataCount<7; dataCount++) {
        var digiOpen = results[dataCount].open,
            digiClose = results[dataCount].close;
            data.push(((digiOpen + digiClose)/2) * curBitcoin);
      } data.reverse();
    } else if(screen.innerWidth <= 600 || window.innerWidth <= 600) {
      var $chartTitle = $('.chart-title'),
          htmlChartTitle = '<span class="chart-title">DigiByte price in USD over the last 5 days</span>';
      $chartTitle.empty().append(htmlChartTitle);
      results.reverse()
      for (var labelCount=0; labelCount<5; labelCount++) {
        var calDate = moment.unix(results[labelCount].date);
        var calDateRead = calDate.format("MMM Do YYYY");
        labels.push(calDateRead);
      } labels.reverse();
      for (var dataCount=0; dataCount<5; dataCount++) {
        var digiOpen = results[dataCount].open,
            digiClose = results[dataCount].close;
            data.push(((digiOpen + digiClose)/2) * curBitcoin);
      } data.reverse();
    } else {
      for (var labelCount=0; labelCount<21; labelCount++) {
        var calDate = moment.unix(results[labelCount].date);
        var calDateRead = calDate.format("MMM Do YYYY");
        labels.push(calDateRead);
      }
      for (var dataCount=0; dataCount<21; dataCount++) {
        var digiOpen = results[dataCount].open,
            digiClose = results[dataCount].close;
            data.push(((digiOpen + digiClose)/2) * curBitcoin)
      }
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
          pointHoverRadius: 8,
          data : data
      }]
    };

    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("myLineChart").getContext("2d");

    // Instantiate a new chart
    var myNewChart = new Chart(ctx , {
    type: "line",
    data: tempData,
    options : {
      legend: {
        labels: {
          fontColor: 'white'
        }
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Price in USD',
            fontColor: 'white',
            paddingTop: 20
          },
          ticks: {
            fontColor: 'white',
            fixedStepSize: 0.01
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Date',
            fontColor: 'white'
          },
          ticks: {
            fontColor: 'white'
          }
        }]
      }
    }
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

$(document).ready(function() {
  getCoin();
  getPolo();
  //refresh data every 60 seconds
  setInterval(function() {
    getCoin();
    getPolo();
  }, 60000);
});
