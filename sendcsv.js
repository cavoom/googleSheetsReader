// This script converts json to csv
// Sends to S3 bucket

const { Parser } = require('json2csv');
const fields = ['name', 'phone', 'email'];
const opts = { fields };

var myData = {
    "name" :  "Dave",
    "phone" : "252-305-3884",
    "email" : "haasdp@gmail.com"
}

try {
  const parser = new Parser(opts);
  const csv = parser.parse(myData);
  console.log(csv);
} catch (err) {
  console.error(err);
}

// Now send csv to an S3 bucket or web page
function sendToS3(csv,callback){
var s3 = new AWS.S3();
var params = {
    Bucket: bucketName,
    Key: filePath,
    Body: csvFileContent,
    ContentType: 'application/octet-stream',
    ContentDisposition: contentDisposition(filePath, {
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