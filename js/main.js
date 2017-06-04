var digiByte = {};

digiByte.renderCoin = function(response) {

  var currentPrice = response[0].price_usd;
  var $showPrice = $('#dollar');
  var htmlPrice = '<span>$' + currentPrice + '</span>';

  var coinRank = response[0].rank;
  var $showRank = $('#coin-rank');
  var htmlRank = '<span>Coin Rank: ' + coinRank + '</span>';

  //percentage change - adding if statement for green if positive, red if negative
  var percentChange = response[0].percent_change_24h;
  var $showPerChange = $('#percent-change');
    if (percentChange >= 0) {
    var htmlPerChange = '<span class="green">+' + percentChange + '% over 24h</span>';
  } else {
    var htmlPerChange = '<span class="red">' + percentChange + '% over 24h</span>';
  };

  $showPrice.empty().append(htmlPrice);
  $showPerChange.empty().append(htmlPerChange);
  $showRank.empty().append(htmlRank);
}

digiByte.renderPolo = function(response) {

  
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
//$(document).ready(getPolo)

/*setInterval(getPrices, 60000);*/
