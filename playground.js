// This is the DynamoDB save fn
function waitforme(milisec) {
	return new Promise(resolve => {
		setTimeout(() => { resolve('') }, milisec);
	})
}

// This is the for loop that is delayed
async function printy() {
	for (let i = 0; i < 10; ++i) {
		await waitforme(400);
		console.log(i);
	}
	console.log("Loop execution finished!)");
}

printy();
