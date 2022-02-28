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

// For Test
// Moving this to buildIt fn
// params = {
//   TableName: 'admr_questions',
//   Item: {
//     'id' : {S: 'mikea56el'},
//     'sport' : {S: 'bingoss'},
//     'thing' : {N: '89'}
//   }
// };

// This is the lambda function
exports.handler = function(event, context, callback) {
  // 1. You can pass spreadsheetId when parser instantiation
const parser = new PublicGoogleSheetsParser(spreadsheetId)
parser.parse().then((items) => {
  //console.log('length of items array:',items.length);
  //console.log('camp name of 0:', items[0].campaignName);
  
  // Call function to build params here
  // then nest analytics call underneith
  buildIt(items,(theBigArray)=>{
    console.log('here is the array to build params',theBigArray.length);
    console.log('an item:', theBigArray[0].PutRequest.Item.id);
    console.log('full item', theBigArray[0].PutRequest.Item);

    callback(null, params);


  // analytics(items, (stuff)=>{
  //   //console.log('all done analytics with:',stuff);
  //   callback(null, items);
  //       });

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
}

function buildIt(items, callback){
  var i = 0;
  var tempObject = {};
  numRecords = items.length;
  //console.log('number of items: ', numRecords);
  
  // ********************** STOPPED HERE *****************************
  // we need to finish building theBigArray which will be added to the 
  // params object before being pushed to Dynamo
  // See "batchwrite.js in DynamoTables script"
  // maybe change "uniqueID" field in spreadsheet to "id" to make simple?
  // ********************** STOPPED HERE *****************************


  for(i=0;i<numRecords;i++){
    tempObject = {
      PutRequest: {
        Item: {
          "id": { "S": items[i].uniqueID},
            "order": { "N": items[i].order },
            "campaignName": { "S": items[i].campaignName},
            "questionFromAlexa" : {S : items[i].questionFromAlexa},
            "userResponse" : {S : items[i].userResponse},
            "answerFromAlexa" : {S : items[i].answerFromAlexa},
            "notes" : {S : items[i].notes}

        }
      }
    } // tempObject
    theBigArray.push(tempObject);
    } // for loop
    callback(theBigArray);
    //callback(params)
  }

  



