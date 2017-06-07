var digiByte = {},
    response;

//getting current date and date 21 days ago for use in chart.js
const dateTime = Date.now();
const currentDate = Math.floor(dateTime / 1000);
const startDate = currentDate - 1814400;

digiByte.renderCoin = function(response) {

  var coinRank = response[0].rank,
      $showRank = $('#coin-rank'),
      htmlRank = '<span>' + coinRank + '</span>';

  $showRank.empty().hide().append(htmlRank).fadeIn(1000);

}

digiByte.renderPercent = function(response) {
  var userTimeSelected = '24h',
      $showPerChange = $('#percent-change'),
      htmlPerChange = '',
      percentChange = response[0].percent_change_24h,
      $1hr = $('#1hr'),
      $24hr = $('#24hr'),
      $7d = $('#7d');

  $1hr.on('click', function() {
    percentChange = response[0].percent_change_1h;
    userTimeSelected = '1h';
    console.log(percentChange, userTimeSelected);
    if(percentChange >= 0) {
      var htmlPerChange = '<span class="green">' + percentChange + '% in last ' + userTimeSelected + '</span>';
    } else {
      var htmlPerChange = '<span class="red">' + percentChange + '% in last ' + userTimeSelected + '</span>';
    }

    $showPerChange.empty().hide().append(htmlPerChange).fadeIn(1000);
  })

  $24hr.on('click', function() {
    percentChange = response[0].percent_change_24h;
    userTimeSelected = '24h';
    console.log(percentChange, userTimeSelected);
    if(percentChange >= 0) {
      var htmlPerChange = '<span class="green">' + percentChange + '% in last ' + userTimeSelected + '</span>';
    } else {
      var htmlPerChange = '<span class="red">' + percentChange + '% in last ' + userTimeSelected + '</span>';
    }

    $showPerChange.empty().hide().append(htmlPerChange).fadeIn(1000);
  })

  $7d.on('click', function() {
    percentChange = response[0].percent_change_7d;
    userTimeSelected = '7d';
    console.log(percentChange, userTimeSelected);
    if(percentChange >= 0) {
      var htmlPerChange = '<span class="green">' + percentChange + '% in last ' + userTimeSelected + '</span>';
    } else {
      var htmlPerChange = '<span class="red">' + percentChange + '% in last ' + userTimeSelected + '</span>';
    }

    $showPerChange.empty().hide().append(htmlPerChange).fadeIn(1000);
  })

  //set default to display upon page load
  if(percentChange >= 0) {
    var htmlPerChange = '<span class="green">' + percentChange + '% in last 24hr</span>';
  } else {
    var htmlPerChange = '<span class="red">' + percentChange + '% in last 24hr</span>';
  }

  $showPerChange.empty().hide().append(htmlPerChange).fadeIn(1000);

}

digiByte.renderPolo = function(response) {

  //need to convert lowest price on Poloniex from BTC to USD
  var lowestPrice = (response.BTC_DGB.low24hr) * (response.USDT_BTC.last),
      $lowestPrice = $('#low-price'),
      htmlLowPrice = '<span>$' + lowestPrice.toFixed(6) + '</span>';

  var highestPrice = (response.BTC_DGB.high24hr) * (response.USDT_BTC.last),
      $highestPrice = $('#high-price'),
      htmlHighPrice = '<span>$' + highestPrice.toFixed(6) + '<span>';

  $lowestPrice.empty().hide().append(htmlLowPrice).fadeIn(1000);
  $highestPrice.empty().hide().append(htmlHighPrice).fadeIn(1000);

  var currentPrice = (response.BTC_DGB.last) * (response.USDT_BTC.last),
      $showPrice = $('#dollar'),
      htmlPrice = '<span>$' + currentPrice.toFixed(7) + '</span>';
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
    if((window.screen.width < 900 && window.screen.width > 800) || (window.innerWidth < 900 && window.innerWidth > 800)) {
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
    } else if((window.screen.width <= 800) || (window.innerWidth <=800)) {
      var $chartTitle = $('.chart-title'),
          htmlChartTitle = '<span class="chart-title">DigiByte price in USD over the last 7 days</span>';
      $chartTitle.empty().append(htmlChartTitle);
      results.reverse()
      for (var labelCount=0; labelCount<7; labelCount++) {
        var calDate = moment.unix(results[labelCount].date),
            calDateRead = calDate.format("MMM Do YYYY");
        labels.push(calDateRead);
      } labels.reverse();
      for (var dataCount=0; dataCount<7; dataCount++) {
        var digiOpen = results[dataCount].open,
            digiClose = results[dataCount].close;
            data.push(((digiOpen + digiClose)/2) * curBitcoin);
      } data.reverse();
    } else {
      for (var labelCount=0; labelCount<21; labelCount++) {
        var calDate = moment.unix(results[labelCount].date),
            calDateRead = calDate.format("MMM Do YYYY");
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
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        duration: 1000,
        easing: 'easeInExpo'
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
      digiByte.renderPercent(response);
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

var getViewport = function() {
  if((window.screen.width === 375) && (window.screen.height === 667)) {
    console.log('success');
    var $chartDiv = $('.chart-replace'),
        htmlChartDiv = '<canvas id="myLineChart"></canvas>';
    $chartDiv.empty().append(htmlChartDiv);
  }
  getPolo();
}

$(document).ready(function() {
  getCoin();
  getViewport();
  //refresh data every 60 seconds
  setInterval(function() {
    getCoin();
    getPolo();
  }, 60000);
});
