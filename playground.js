var someTestData = [

	{
		"first": "dave",
		"last": "haas",
		"social": 6
	},
	{
		"first": "brett",
		"last": "haas",
		"social": 7
	},
	{
		"first": "steve and joy",
		"last": "haas",
		"social": 3
	}
	
];

// var theLength = someTestData.length;
// console.log('the Length: ', theLength);
// var theChunk = 10;
// console.log('the Chunk: ',theChunk);
// var passes = 0;
// var theRemainder = theLength % theChunk; // returns remainder
// console.log('raw remainder: ', theRemainder);
// if(theLength < theChunk){
// 	theRemainder = 0;
// 	console.log('the remainder: ', theRemainder);
// } else {
// 	console.log('the remainder: ', theLength % theChunk)
// }
// 	console.log('L/C: ',parseInt(theLength/theChunk));


// Example function passing values
// var a = 'aadfa';
// var b = 'badfa';
// var c = 'cafadf';
// var d = 0;
// var e = 0;
// var f = 0;

// testFn(a,b,c,(stuff)=>{
// 	console.log(stuff)
// });

// function testFn(d,e,f,callback){
// 	var stuff = d+e+f;
// 	callback(stuff)
// 	}

// ********* SIMULATE SEND TO DYNAMO FUNCTION *********
function printOut(startWith,endWith,callback){
	setTimeout(() => {
		console.log('** printout fn: ',startWith,endWith);
		}, 800);
		callback() 
	}

// This is the DynamoDB save fn
function waitforme(milisec) {
	return new Promise(resolve => {
		setTimeout(() => { resolve(console.log('... ')) }, milisec);

		// dynamo save fn here
	})
}

// This is the for loop that is delayed
async function printy() {
	for(var x=0;x<3;x++){
		await waitforme(400);
		console.log(someTestData[x].first);
	}
	console.log(" ... finish ... ");
}

printy();

// if(theLength<=theChunk){
// 	passes = 1;
// 	printy(passes);

// }

// if(theLength>theChunk){
// 	passes = parseInt(theLength/theChunk);
// 	printy(passes);
		
// 	// iterate for loop
// }

// if(theRemainder > 0){
// 	// run the remainder
// }
