//  Wednesday meeting of week 2 

let sample = ['A', 'B', 'C'];

for (const element of sample) {
    console.log(element);
}

sample.forEach((element, index) => console.log(element + ' at index: ' + index));

let [a, b] = sample;

let product = { 
    id: '145be9',
    price: 1.35,
    onSale: false, 
};

let productWithStore = { ...product, store: '53'};

console.log(productWithStore);

const PI = 3.14159;

console.log('trying to change PI'); 

try {
    PI = 99;
} catch (ex) {
    console.log(`nah, error: ${ex.message}`); //Displaying IDE error 
} finally {
    console.log(`always execute code in this block`);
}

console.log(`cant, it remains: ${PI}`);

