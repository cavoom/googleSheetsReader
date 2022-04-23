// Promise Chainging example

new Promise(function(resolve, reject) {

  setTimeout(() => {
      //console.log('delay is up on 1');
      //console.log('now resolving ... ');
      resolve(10)}, 
      1000);


}).then(function(result) {

  console.log(result); // 1

  return new Promise((resolve, reject) => { // (*)
    setTimeout(() => resolve(result * 2), 1000);
  });
//
}).then(function(result) { // (**)

  console.log(result); // 2

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function(result) {

  console.log(result); // 4

});

function doStuff(resolve){
  setTimeout(() => {
      console.log('delay complete');
      return(resolve)}, 
      2000);
}

