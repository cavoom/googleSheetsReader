// index.js with chained promises to make things work synchronously
// This program sends chunks of the google sheet array, 25 at a time,
// to dynamoDB batch save (batches of 24 or fewer can be sent)
// NEXT UP: Create this with export.handler so that we can run as a lambda!!

// Setup for the Chunker
//var stuffToSave = require('./stuffToSaveFile.json');
var startWith = 0;
var endWith = 0;
var remainderStart = 0;
var remainderEnd = 0;
var theChunk = 24; // This sends 25 objects at a time
var theRemainder = 0; // returns remainder left over from chunking
var theLength = 0;
var y =0;
var numberPasses = 0;
//
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
new Promise(function(resolve,reject){
    const parser = new PublicGoogleSheetsParser(spreadsheetId)
    parser.parse().then((items) => {
    // Now that we have the items, call buildIt function to put them into an array
    console.log('# of items: ',items.length);
    resolve(items)
    }); // end parser

    // STEP 2 BUID IT
}).then(function(result){
    console.log('have the parsed result ... ');
    return new Promise((resolve,reject)=>{
        resolve(buildIt(result)) 
        })
      
    }).then(function(result){
        console.log('have buildIt with length: ',result.length);
        return new Promise((resolve,reject)=>{
            //analytics(result)
            
            }) // new Promise end
    
        }).then(function(result){
            console.log('in final .then after analytics ');
            return new Promise((resolve,reject)=>{
              setTimeout(() => resolve('all done'), 1000);
                resolve(result)
                
                }) // new Promise end
        })

  
//     console.log(result); // 2
  
//     return new Promise((resolve, reject) => {
//       setTimeout(() => resolve(result * 2), 1000);
//     });
  
//   }).then(function(result) {
  
//     console.log(result); // 4
  
//   });

function analytics(uniqueParams){
    console.log('in analytics');
    console.log('uniqueParams Length: ', uniqueParams.length);
    setTimeout(() => {resolve(uniqueParams.length+500)}, 3000);
    //return(uniqueParams.length)
}

function buildIt(items){
    var i = 0;
    var tempObject = {};
    numRecords = items.length;
    
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
      console.log('all done with big array in buildIt');
      return(theBigArray);
      //callback(params)
    }