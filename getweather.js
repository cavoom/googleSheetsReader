// Call to AWS Lambda API to get data based on theSearch
// and campaignNumber coming from Google Action
// Next step is to see if we can call this from the Google Action
// Send it the campaignNumber and theSearch

var needle = require('needle');
// fastDecode replaces the URI codes with spaces
// const fastDecode = require('fast-decode-uri-component')

const campaignNumber = 1;
const theSearch = "the dogs are in the dog house, and it's dogs dogs dogs up in here.";
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