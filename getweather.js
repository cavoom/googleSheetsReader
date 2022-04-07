// pull data from api

var needle = require('needle');
const theUrl = 'https://hrfjqqj48i.execute-api.us-east-1.amazonaws.com/default/googlyGoodness';

needle.get(theUrl, function(error, response) {
  if (!error && response.statusCode == 200)
    console.log(response.body);
});