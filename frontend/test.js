const axios = require('axios');
const fetch = require('fetch');

const url = "https://www.iban.com/exchange-rates";
fetch(url).then(res => {
  console.log(res);
});
