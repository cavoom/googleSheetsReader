// This script converts json to csv
// Sends to an S3 bucket

const { Parser } = require('json2csv');
const fields = ['name', 'phone', 'email'];
const opts = { fields };

var myData = {
    "name" :  "Dave",
    "phone" : "252-305-3884",
    "email" : "haasdp@gmail.com"
}

// Convert the json file to a csv
converter(myData,(csv)=>{
    console.log(csv);
    
    // Send to S3 Bucket
    sendToS3(csv,(stuffs)=>{
        console.log(stuffs)
    })

    })

// convert to CSV function
function converter(myData,callback){
    try {
        const parser = new Parser(opts);
        const csv = parser.parse(myData);
        // console.log(csv);
        callback(csv)
      } catch (err) {
        console.error(err);
      }

}

// Now send csv to an S3 bucket or web page
function sendToS3(csv,callback){
var s3 = new AWS.S3();
var params = {
    Bucket: 'admr',
    Key: 'https://admr.s3.amazonaws.com/testfile+-+Sheet1.csv',
    Body: csv,
    ContentType: 'application/octet-stream',
    ContentDisposition: contentDisposition('https://admr.s3.amazonaws.com/testfile+-+Sheet1.csv', {
        type: 'inline'
    }),
    CacheControl: 'public, max-age=86400'
}
s3.putObject(params, function(err, data) {
    if (err) {
        console.log("Error at uploadCSVFileOnS3Bucket function", err);
        next(err);
    } else {
        console.log("File uploaded Successfully");
        next(null, filePath);
    }
})

}