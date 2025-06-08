function connectToDatabase(queryFunction, query) {

  let randomTime = Math.floor(Math.random() * 2000) + 1;

  setTimeout(() => { console.log('Connection Established'); queryFunction(query); }, randomTime);

}

function queryData(query) {

  let randomTime = Math.floor(Math.random() * 1000) + 1;

  setTimeout(() => { console.log(query); }, randomTime);

}


connectToDatabase(queryData, 'select * from Employees');

/* Flow of the program: 

1. connectToDatabase(queryData, 'select * from Employees');

- queryData = queryFunction = queryData function 

- 'select * from Employees' = query 

2. function connectToDatabase(queryFunction, query) 

- 






*/