console.log(__dirname);

const count = 5;

console.log('count: %d', count);

console.log('count: ', count);

setTimeout(function() {
    console.log('Hello after 1 second');
}, 1000);



let count1 = 1; 
let maxcount = 5; 

let mycountinterval = setInterval(function () {
    console.log('hello after ' + count1++ + ' seconds'); checkMaximumcount();
}, 1000);

let checkMaximumcount = function () {
    if (count1 > maxcount) {
        clearInterval(mycountinterval);
    }
}

//let myURL = new URL('https://myProductInventory.com/')

const EventEmitter = require('events');
const myEmitter = new EventEmitter();

myEmitter.on('event', function() {
    console.log('an event occurred');
});

myEmitter.emit('event');

const fs = require('fs');

fs.readFile('names.cvs', function (err, fileData) {
    if (err) console.log(err);
    else {
        namesArray = fileData.toString().split(',');
        console.log(namesArray);
    }
});

const path = require('path');

console.log('Absolute path to about.html');

console.log(path.join(__dirname, '/about.html'));
console.log(path.join(__dirname, '//about.html'));
console.log(path.join(__dirname, '\about.html'));
console.log(path.join(__dirname, 'a\bout.html')); 

