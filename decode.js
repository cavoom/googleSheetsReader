// const fastDecode = require('fast-decode-uri-component');
 
// console.log(fastDecode('test')) // 'test'
// console.log(fastDecode('%25')) // '%'
// console.log(fastDecode('/test/hel%2Flo')) // '/test/hel/lo'
 
// console.log(fastDecode('/test/hel%"Flo')) // null
// console.log(fastDecode('%7B%ab%7C%de%7D')) // null
// console.log(fastDecode('%ab')) // null

// console.log(fastDecode('1&the%20dogs%20are%20in%20the%20house'));
//

console.log(decodeURI('1&the%20dogs%20are%20in%20the%20house'));