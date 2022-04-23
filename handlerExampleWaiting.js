exports.handler = (event, context,callback) => {

const sleep = (milliseconds) => {
    console.log('at sleep');
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
};

for (let index = 0; index < 5; index++) {
    console.log(index);
    sleep(1000);
    if(index == 4){
        context.succeed('all done!',index)
    }
}
//
}