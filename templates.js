// This one reads from ADMR templates google sheet and saves to Dynamo
// This script reads a shared Google Sheet
// Stores the data into DynamoDB
// Go to line 98 to do 25 (max right now, at a time)

const PublicGoogleSheetsParser = require('public-google-sheets-parser')
const spreadsheetId = '1aH5dtvYAYwxPML8keeznPeWSAdcT9kgzwlK6bRKWUsI'; // Pulls from the Google Sheet: admrCMS
//const spreadsheetId = '1L6nyjS7H3GNXhoS8yr7BgxD-mscso1joUC4zjJ3q2ig' // ADMR Templates file
//var testerArray = [];
// https://docs.google.com/spreadsheets/d/1aH5dtvYAYwxPML8keeznPeWSAdcT9kgzwlK6bRKWUsI/edit?usp=sharing

// DYNAMO Setup
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var params = {};
var numRecords = 0;
var theBigArray = [];

// This is the lambda function
exports.handler = function(event, context, callback) {
  // 1. You can pass spreadsheetId when parser instantiation

const parser = new PublicGoogleSheetsParser(spreadsheetId)
parser.parse().then((items) => {
  // Now that we have the items, call buildIt function to put them into an array
  
  // Call function to build params here
  // then nest analytics call underneith
  buildIt(items,(theBigArray)=>{
    // console.log('full item', theBigArray[0].PutRequest.Item);
    // Now build params for DynamoDB Batch upload
    params = {
      RequestItems: {
        "admr_questions" : theBigArray
      }
    }

    // Now send to DynamoDB for save
    analytics(items, (stuff)=>{
      console.log('all done analytics with:',stuff);
      callback(null, stuff);
          }); // end analytics

})  // end builtIt
}) // end parser


}

// DYNAMO Batchwrite function
function analytics(items, callback){

ddb.batchWriteItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
    callback(err);
  } else {
    console.log("Success", data);
    callback(data)
    }
  })

//callback(data)
}

// Build the array
// REMEMBER: id is passed as a string even when N type
function buildIt(items, callback){
  var i = 0;
  var tempObject = {};
  numRecords = items.length;
  //console.log('number of items: ', numRecords);

  for(i=340;i<351;i++){


    if(!items[i].uniqueID){
         
    // Get a new timestamp and use that if no ID listed
      items[i].uniqueID = "no input"};
      
    if(!items[i].order){
      items[i].order = 'no input'};
        
    if(!items[i].campaignName){
        items[i].campaignName = "no input"};

    if(!items[i].questionFromAlexa){
        items[i].questionFromAlexa = "no input"};

    if(!items[i].userResponse){
        items[i].userResponse = "no input"};
    
    if(!items[i].answerFromAlexa){
      items[i].answerFromAlexa = "no input"};

    if(!items[i].campaignNumber){
      items[i].campaignNumber = "no input"};

      if(!items[i].notes){
        items[i].notes = "no input"};


    // If no null values
    tempObject = {
      PutRequest: {
        Item: {
          "id": { S: items[i].uniqueID.toString()},
            "order": { S: items[i].order.toString()},
            "campaignName": { S: items[i].campaignName.toString()},
            "questionFromAlexa" : {S : items[i].questionFromAlexa.toString()},
            "userResponse" : {S : items[i].userResponse.toString()},
            "campaignNumber" : {S : items[i].campaignNumber.toString()},
            "answerFromAlexa" : {S : items[i].answerFromAlexa.toString()},
            "notes" : {S : items[i].notes.toString()}
        

        } // Item
      } // PutRequest
    } // tempObject


    theBigArray.push(tempObject);
    } // for loop
    callback(theBigArray);
    //callback(params)
  }