const endpoint = 'https://api.coinmarketcap.com/v1/ticker/digibyte/?convert=USD';

const digiByte = [];
fetch(endpoint)
.then(blob => blob.json()
.then(data => digiByte.push(...data)));

function findPrice(digiByte) {
  return digiByte.match(number => {
    return number.price_usd.match('price_usd');
  });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}




//const currentPrice = digiByte[0].price_usd;

//document.querySelector('.dollar').innerHTML.replace(currentPrice);
