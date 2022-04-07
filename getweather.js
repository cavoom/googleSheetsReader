// pull data from api

var needle = require('needle');
const campaignNumber = 1;
const theSearch = "the dogs are in the house";
const theUrl = 'https://hrfjqqj48i.execute-api.us-east-1.amazonaws.com/default/googlyGoodness?'+campaignNumber+"&"+theSearch;

// Simple GET
needle.get(theUrl, function(error, response) {
  if (!error && response.statusCode == 200)
    console.log(response.body);
});

// Simple POST
// var options = {
//   headers: { 'X-Custom-Header': 'Bumbaway atuna' }
// }
// var testData = {
//   "source" : "some good text is here in the body",
//   "stuff" : "a good dog is wonderful life."
// }

// needle.post(theUrl, 'foobar', options, function(err, resp) {
//   // you can pass params as a string or as an object.
//     if (!err && resp.statusCode == 200)
//     console.log(resp.body);
// });