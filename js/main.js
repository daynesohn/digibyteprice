var digiByte = {};

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

var getCoin = function() {
  $.ajax({
    url: 'https://api.coinmarketcap.com/v1/ticker/digibyte/?convert=USD',
    dataType: 'json',
    success: function(response) {
      digiByte.renderCoin(response);
    }
  })
};

var getPolo = function() {
  $.ajax({
    url: 'https://poloniex.com/public?command=returnTicker',
    dataType: 'json',
    success: function(response) {
      digiByte.renderPolo(response);
    }
  })
};

$(document).ready(getCoin);
$(document).ready(getPolo)

//refresh data every 60 seconds
//setInterval(getCoin, 60000);
//setInterval(getPolo, 60000);
