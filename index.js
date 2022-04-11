// NEW: This program sends chunks of the google sheet array, 25 at a time,
// to dynamoDB batch save (batches of 24 or fewer can be sent)
// NEXT UP: Create this with export.handler so that we can run as a lambda!!

// Setup for the Chunker
//var stuffToSave = require('./stuffToSaveFile.json');
    var startWith = 0;
    var endWith = 0;
    var remainderStart = 0;
    var remainderEnd = 0;
    var theChunk = 24; // This sends 25 objects at a time
    let theRemainder = 0; // returns remainder left over from chunking
    var theLength = 0;
    var y =0;

// Time and Date
    var newTime = new Date();
    //var timeId = newTime.getTime();
    //var theRandom = String(Math.floor((Math.random() * 9999)));
    //var uniqueId = timeId + theRandom;
    var theDate = new Date();
    theDate = theDate.toString();

// Setup for Google Sheet Reader
const PublicGoogleSheetsParser = require('public-google-sheets-parser')
const spreadsheetId = '1aH5dtvYAYwxPML8keeznPeWSAdcT9kgzwlK6bRKWUsI'; // Pulls from the Google Sheet: admrCMS
//const spreadsheetId = '1L6nyjS7H3GNXhoS8yr7BgxD-mscso1joUC4zjJ3q2ig' // ADMR Templates file
//var testerArray = [];
// https://docs.google.com/spreadsheets/d/1aH5dtvYAYwxPML8keeznPeWSAdcT9kgzwlK6bRKWUsI/edit?usp=sharing

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


// STEP 1: Go grab the object from the Google Sheet
const parser = new PublicGoogleSheetsParser(spreadsheetId)
parser.parse().then((items) => {
  // Now that we have the items, call buildIt function to put them into an array

  // STEP 2: Build the object to send
  buildIt(items,(theBigArray)=>{
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
                    //console.log('all done')
                })
            }
            
            // CASE 2: Send in Chunks
            if(theLength > theChunk){
                startWith = 0;
                endWith = theChunk;

                //console.log('we are at case 2');

            for(var x=0;x<parseInt(theLength/theChunk);x++){
              if(x>0){
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
                    //console.log('all done remainder')
                }) // end printOut
            }
    })  // end builtIt
}) // end google sheet parser

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
        console.log("Success", data);
        callback(data)
        }
      })
    //callback(data)
  //}, 2000); // end time out
  //callback('all done')

} // end fn

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

// ********* SIMULATE SEND TO DYNAMO FUNCTION *********
function printOut(startWith,endWith,callback){
    setTimeout(() => {
        console.log('** printout fn: ',startWith,endWith);
        }, 800);
        callback() 
    }





    

    
    
    
    