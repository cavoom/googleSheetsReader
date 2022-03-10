// This script reads a shared Google Sheet
// Stores the data into DynamoDB

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
var numRecords = 0;
var theBigArray = [];


// This is the lambda function
exports.handler = function(event, context, callback) {
  // 1. You can pass spreadsheetId when parser instantiation
const parser = new PublicGoogleSheetsParser(spreadsheetId)
parser.parse().then((items) => {
  // Now that we have the items, call buildIt function to put them into an array
  //console.log('length of items array:',items.length);
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
    // callback(null, 'all done');

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
      items[i].uniqueID == "no input"};
      
    if(!items[i].order){
        items[i].order == "no input"};
        
    if(!items[i].campaignName){
        items[i].campaignName == "no input"};

    if(!items[i].questionFromAlexa){
        items[i].questionFromAlexa == "no input"};

    if(!items[i].userResponse){
        items[i].userResponse == "no input"};
    
    if(!items[i].answerFromAlexa){
      items[i].answerFromAlexa == "no input"};

      if(!items[i].uniqueID){
        items[i].uniqueID == "no input"};




    // If no null values
    tempObject = {
      PutRequest: {
        Item: {
          "id": { S: items[i].uniqueID.toString()},
            "order": { S: items[i].order.toString() },
            "campaignName": { S: items[i].campaignName.toString()},
            "questionFromAlexa" : {S : items[i].questionFromAlexa.toString()},
            "userResponse" : {S : items[i].userResponse.toString()},
            "answerFromAlexa" : {S : items[i].answerFromAlexa.toString()},
            "notes" : {S : items[i].notes.toString()}

        }
      }
    } // tempObject
    //} // else

    theBigArray.push(tempObject);
    } // for loop
    callback(theBigArray);
    //callback(params)
  }

  



