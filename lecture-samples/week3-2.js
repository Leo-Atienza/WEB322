// output "A" after a random time between 0 & 3 seconds
function outputA(firstCallback, secondCallback) {
  let randomTime = Math.floor(Math.random() * 3000) + 1;

  setTimeout(() => {
    console.log('A');
    firstCallback(secondCallback);
  }, randomTime);
}

// output "B" after a random time between 0 & 3 seconds
function outputB(lastCallback) {
  let randomTime = Math.floor(Math.random() * 3000) + 1;

  setTimeout(() => {
    console.log('B');
    lastCallback();
  }, randomTime);
}

// output "C" after a random time between 0 & 3 seconds
function outputC() {
  let randomTime = Math.floor(Math.random() * 3000) + 1;

  setTimeout(() => {
    console.log('C');
  }, randomTime);
}

// invoke the functions in order

outputA(outputB, outputC);

