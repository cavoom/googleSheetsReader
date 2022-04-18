// This program tests to see if we can specify a specific sheet within
// google sheets to pull from

// Setup for Google Sheet Reader
const PublicGoogleSheetsParser = require('public-google-sheets-parser')
const spreadsheetId = '1aH5dtvYAYwxPML8keeznPeWSAdcT9kgzwlK6bRKWUsI'; // Pulls from the Google Sheet: admrCMS


// GRAB the data from the Google Sheet
const parser = new PublicGoogleSheetsParser(spreadsheetId);
// Pass the name of the "Sheet" to get
parser.parse(spreadsheetId, '150680').then((items) => {
//parser.parse().then((items) => {
// Now that we have the items, call buildIt function to put them into an array
    for(var x=0;x<3;x++){
        console.log('got an item: ',items[x])
        }
    })