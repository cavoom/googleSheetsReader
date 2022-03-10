const PublicGoogleSheetsParser = require('public-google-sheets-parser')
const spreadsheetId = '1aH5dtvYAYwxPML8keeznPeWSAdcT9kgzwlK6bRKWUsI';
var testerArray = [];

const parser = new PublicGoogleSheetsParser(spreadsheetId)
parser.parse().then((items) => {
    //console.log(items);
    testerArray.push(items);
  if(!testerArray[0][7].order){
    console.log('nothing is here')} else {console.log('something is here')}
  

})