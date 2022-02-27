const PublicGoogleSheetsParser = require('public-google-sheets-parser')
const spreadsheetId = '1aH5dtvYAYwxPML8keeznPeWSAdcT9kgzwlK6bRKWUsI';
var testerArray = [];

// 1. You can pass spreadsheetId when parser instantiation
const parser = new PublicGoogleSheetsParser(spreadsheetId)
parser.parse().then((items) => {
    //console.log(items);
    testerArray.push(items);
  console.log(testerArray[0]);
  // items should be [{"a":1,"b":2,"c":3},{"a":4,"b":5,"c":6},{"a":7,"b":8,"c":9}]
})