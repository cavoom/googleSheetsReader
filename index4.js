// PULLS THE 4TH UPDATED TAB

// Pull the worksheet to update
// Then get the proper worksheet
// Then send 25 at a time
// On git branch = 'working' not 'main'

// Have a delay to deal with waiting for batch write
// Delay won't work on local testing / but will on lambda

// This is one of 5 scripts designed to update the 1st, 2nd 3rd 4th or 5th active sheet

// Setup for the Chunker
//var stuffToSave = require('./stuffToSaveFile.json');
var startWith = 0;
var endWith = 0;
var remainderStart = 0;
var remainderEnd = 0;
var theChunk = 24; // This sends 25 objects at a time
let theRemainder = 0; // returns remainder left over from chunking
var theLength = 0;
var y=0;

// Tab to update
//const tabToUpdate = 34567;


// Time and Date
var newTime = new Date();
//var timeId = newTime.getTime();
//var theRandom = String(Math.floor((Math.random() * 9999)));
//var uniqueId = timeId + theRandom;
var theDate = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
// let nz_date_string = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
//theDate = theDate.toString();

// Setup for Google Sheet Reader
const PublicGoogleSheetsParser = require('public-google-sheets-parser')
var spreadsheetId = '1aH5dtvYAYwxPML8keeznPeWSAdcT9kgzwlK6bRKWUsI'; // Pulls from the Google Sheet: admrCMS
var tabId = 'Master';

//const spreadsheetId = '1L6nyjS7H3GNXhoS8yr7BgxD-mscso1joUC4zjJ3q2ig' // ADMR Templates file

// Setup for DYNAMO
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var params = [];
var uniqueParams = [];
var remainderParams = {};

//var params = [];
var numRecords = 0;
var theBigArray = [];
var tempObject = {};

// MasterScan function updater
var arrayOfTabs = [];
// This one gets the second one to update!
const tabToUpdate = 3; // Tab to process - value can be 0 to 4 (5 processes setup) 

exports.handler = (event, context, callback) => {

// STEP 0: Go grab the workbook / sheet to update
// STEP 1: Go grab the object from the Google Sheet to update
var parser = new PublicGoogleSheetsParser(spreadsheetId);
parser.parse(spreadsheetId, tabId).then((items) => {
    masterScan(items,(arrayOfTabs)=>{
      console.log('arrayOfTabs:', arrayOfTabs);
        //if(Object.keys(tempObject).length === 0){
          //if(arrayOfTabs.length == 0){
            if(arrayOfTabs.length < tabToUpdate+1){
          //console.log('NOTHING FOUND TO UPDATE!');
          context.succeed('Nothing to Convert!')
        }
        // This process always grabs the first sheet to update
        // Other processes will grab the other ones
        // Each process designed for one update
        spreadsheetId = arrayOfTabs[tabToUpdate].sheet_name;
        tabId = arrayOfTabs[tabToUpdate].tab_name;
        console.log('spreadsheet: ',spreadsheetId);
        console.log('tab name: ',tabId);

// STEP 1: Go grab the object from the Google Sheet to update
//var parser = new PublicGoogleSheetsParser(spreadsheetId);
// Pass the name of the "Sheet" to get
//parser.parse(spreadsheetId, 'Sheet2').then((items) => {
parser.parse(spreadsheetId, tabId).then((items) => {
//parser.parse().then((items) => {
//Now that we have the items, call buildIt function to put them into an array
  buildIt(items,(theBigArray)=>{

//STEP 2: Build the object to send

    //console.log('full item 27: ', theBigArray[27].PutRequest.Item);

        // STEP Chunk it out and send it
        theLength = theBigArray.length;
        let theRemainder = theLength % theChunk; // returns remainder
       
       
       // CASE 1: If theLength < theChunk to send then just send the whole thing
        if(theLength <= theChunk){
            startWith = 0;
            endWith = theLength-1;
            //console.log('we are at CASE 1');

            params[0] = {
                RequestItems: {
                  "admr_questions" : theBigArray
                          } // endRequestItems
                      } // end params
            uniqueParams = params[0];
            
            analytics(uniqueParams,()=>{
            //printOut(startWith,endWith,()=>{ // call templates.js as a mod export here
                console.log ('started: ',startWith);
                console.log('ended: ',endWith);
                context.succeed('All done - Case 1')
            })
        }
        
        // CASE 2: Send in Chunks
        if(theLength > theChunk){
            startWith = 0;
            endWith = theChunk;

            var theRounds = parseInt(theLength/theChunk);

            //console.log('we are at case 2');

        for(var x=0;x<theRounds;x++){
          //console.log('x=',x);
          if(x>0){ // don't add theChunk until after the first pass
              startWith = startWith+theChunk;
              endWith = endWith+theChunk};

            params[x] = {
                RequestItems: {
                  "admr_questions" : theBigArray.slice(startWith,endWith)
                          } // endRequestItems
                      } // end params

                uniqueParams = params[x];
                
                analytics(uniqueParams,()=>{
                //printOut(startWith,endWith,()=>{
                //printOut(startWith,endWith-1,()=>{
                    //startWith = startWith+theChunk;
                    //endWith = endWith+theChunk;

                }) // end printOut
            } // end for

            // Set a delay and wait for analytics to come back
            // May need to adjust this delay as the dynamo write grows
            console.log('start waiting');
            setTimeout(()=>{
              console.log('all done waiting for the update to write to batch Dynamo');
              context.succeed('Finished waiting and ending lambda')
          }, 3000);

            } // end if theRemainder
        
        // CASE 3: Send the remainder
        if(theLength > theChunk && theRemainder > 0){

            remainderStart = theLength-theRemainder;
            remainderEnd = theLength+1;

            remainderParams = {
                RequestItems: {
                  "admr_questions" : theBigArray.slice(remainderStart,remainderEnd)
                          } // endRequestItems
                      } // end params

                      remainderAnalytics(remainderParams,()=>{
                      //printOut(remainderStart,remainderEnd,()=>{
                console.log('remainder items:',remainderStart,remainderEnd);
            }) // end printOut
        }
    }) // end buildIt
})  // end MasterCan
}) // end google sheet parser
}) // end first parser

} // End Handler

// ********** SEND to DYNAMO BATCH WRITE ****************
function analytics(uniqueParams, callback){
ddb.batchWriteItem(uniqueParams, function(err, data) {
  if (err) {
    console.log("Error", err);
    callback(err);
  } else {
    console.log("Success", data);
    callback(data)
    }
  })
} // end fn


// ********** SEND to DYNAMO BATCH WRITE ****************
function remainderAnalytics(remainderParams, callback){

//setTimeout(() => {
console.log('writing remainder');
ddb.batchWriteItem(remainderParams, function(err, data) {
  if (err) {
    console.log("Error", err);
    callback(err);
  } else {
    console.log("REMAINDER Success", data);
    callback(data)
    }
  })
//callback(data)
//}, 2000); // end time out
//callback('all done')

} // end fn

// ********* FIND THE SHEET TO PULL FROM MASTER *********
function masterScan(items,callback){
    var i = 0;
    numRecords = items.length;
    //console.log('at masterScan with numRecords=',numRecords);
    
    for(i=0;i<numRecords;i++){
        if(items[i]){
        //if(items[i].update_sheet == "On" && items[i].tab_name == tabToUpdate){ // This would only create tempObject for a specific sheet
        if(items[i].update_sheet == "On"){
            arrayOfTabs.push(items[i]);
        }
    } // end if
    }
    callback(arrayOfTabs)
}
// ********* BUILD THE OBJECT TO SEND TO DYNAMO *********
function buildIt(items, callback){
var i = 0;
var tempObject = {};
numRecords = items.length;
//console.log('function buildIt: ', numRecords);

for(i=0;i<numRecords;i++){

  if(!items[i].uniqueID){
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
        "theDate" : {S : theDate},
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
