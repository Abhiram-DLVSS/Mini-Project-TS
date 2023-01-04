//Synchronous Programming - order is maintained, blocks execution flow
console.log("Synchronous")
console.log("First")

function sleep(ms) {
    let startTime = new Date().getTime();
    while (new Date().getTime() < startTime + ms);
    console.log("Second");
}

sleep(1000);
console.log("Third")

//Asynchronous Programming - order is not maintained, doesn't block execution flow
console.log("Asynchronous")
console.log("First")

setTimeout(() => { console.log("Second") }, 1000)

console.log("Third")


//Callbacks

function test() {
    //do something
}
function cbf(arg) {
    console.log(arg)
}

test()
cbf("Callbackex tested")



function cbf(arg) {
    console.log(arg)
}
function test() {
    //do something
    cbf("Callbackex tested")
}
test()


//Promises
const promise = new Promise((resolve, reject) => {
    if (true) {//some condition
        resolve();
    }
    else {
        reject();
    }
})

promise.then(() => { console.log("Test1") }, () => { console.log("Test2") })
.catch(()=>{console.log("If something goes wrong")})
.finally(()=>{console.log("Finally")})