// This one reads from ADMR templates google sheet and saves to Dynamo
// This script reads a shared Google Sheet
// Stores the data into DynamoDB

const PublicGoogleSheetsParser = require('public-google-sheets-parser')
const spreadsheetId = '1L6nyjS7H3GNXhoS8yr7BgxD-mscso1joUC4zjJ3q2ig';
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
var numRecords = 0;
var theBigArray = [];


// This is the lambda function
exports.handler = function(event, context, callback) {
  // 1. You can pass spreadsheetId when parser instantiation


const parser = new PublicGoogleSheetsParser(spreadsheetId)
parser.parse().then((items) => {
  // Now that we have the items, call buildIt function to put them into an array
  // numRecords = items.length;
  //console.log('camp name of 0:', items[0].campaignName);
  
  // Call function to build params here
  // then nest analytics call underneith
  buildIt(items,(theBigArray)=>{
    //console.log('here is the array to build params',theBigArray.length);
    //console.log('an item:', theBigArray[0].PutRequest.Item.id);
    //console.log('full item', theBigArray[0].PutRequest.Item);
    //console.log('The Big Array ... ', theBigArray);

    // Now build params for DynamoDB Batch upload
    params = {
      RequestItems: {
        "admr_questions" : theBigArray
      }
    }

    // FOR TEST
    //console.log('PARAMS: ',params);
    // console.log('Record to find: ', params.RequestItems.admr_questions[0].PutRequest.Item.id.N);
    //callback(null, 'all done');

  // Now send to DynamoDB for save
  analytics(items, (stuff)=>{
    console.log('all done analytics with:',stuff);
    callback(null, stuff);
        });

  // FOR TEST
  // callback(null,'all done');

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

  for(i=0;i<numRecords;i++){
    // If null values
    if(!items[i].uniqueID){
      items[i].uniqueID = "no input"};
      
    if(!items[i].campaign){
      items[i].campaign = 'no input'};
        
    if(!items[i].user_response){
        items[i].user_response = "no input"};

    if(!items[i].assistant_response){
        items[i].assistant_response = "no input"};
    



    // If no null values
    tempObject = {
      PutRequest: {
        Item: {
          "id": { S: items[i].uniqueID.toString()},
            "campaign": { S: items[i].campaign.toString()},
            "user_response" : {S : items[i].user_response.toString()},
            "assistant_response" : {S : items[i].assistant_response.toString()}
        

        } // Item
      } // PutRequest
    } // tempObject


    theBigArray.push(tempObject);
    } // for loop
    callback(theBigArray);
    //callback(params)
  }