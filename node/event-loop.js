// timers: this phase executes callbacks scheduled by setTimeout() and setInterval().
// pending callbacks: executes I/O callbacks deferred to the next loop iteration.
// idle, prepare: only used internally.
// poll: retrieve new I/O events; execute I/O related callbacks (almost all with the exception of close callbacks, the ones scheduled by timers, and setImmediate()); node will block here when appropriate.
// check: setImmediate() callbacks are invoked here.
// close callbacks: some close callbacks, e.g. socket.on('close', ...).

const fs = require("node:fs");
function someAsyncOperation(callback) {
  console.log("inside the someAsyncOperation function");
  // Assume this takes 95ms to complete
  fs.readFile("/path/to/file", callback);
}

const timeoutScheduled = Date.now();
console.log("timeoutScheduled at: ", timeoutScheduled);
setTimeout(() => {
  console.log("settime cb has started execution");
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);

// do someAsyncOperation which takes 95 ms to complete
someAsyncOperation(() => {
  console.log("executing the async opretaion cb");
  const startCallback = Date.now();
  // do something that will take 10ms...
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
});

setImmediate(() => {
  console.log("setImmediate is called");
});

Promise.resolve("Promise is resolved").then(console.log);

setTimeout(() => {
  console.log("Time function is called");
}, 0);

process.nextTick(() => {
  console.log("Process.nextTick");
});
