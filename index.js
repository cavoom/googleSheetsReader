const PublicGoogleSheetsParser = require('public-google-sheets-parser')
const spreadsheetId = '1aH5dtvYAYwxPML8keeznPeWSAdcT9kgzwlK6bRKWUsI';
//var testerArray = [];

// DYNAMO Setup
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

// Call a function to build params
// Define as an empty object here
// Then redefine
var params = {};
params = {
  TableName: 'admr_questions',
  Item: {
    'id' : {S: 'mikea56el'},
    'sport' : {S: 'bingoss'},
    'thing' : {N: '89'}
  }
};

// This is the lambda function
exports.handler = function(event, context, callback) {
  // 1. You can pass spreadsheetId when parser instantiation
const parser = new PublicGoogleSheetsParser(spreadsheetId)
parser.parse().then((items) => {
  console.log('length of items array:',items.length);
  console.log('camp name of 0:', items[0].campaignName);
  //testerArray.push(items);

  analytics(items, (stuff)=>{
    //console.log('all done analytics with:',stuff);
    callback(null, items);
        });

  // callback(null, items);
})


}

// DYNAMO
function analytics(items, callback){
ddb.putItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
    callback(err);
  } else {
    console.log("Success", data);
    callback(data)
  }
});


}
