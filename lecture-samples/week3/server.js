const path = require('path');


const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"WEEK3/home.html")); //  Have to rechcek
});


// start the server on the port and output a confirmation to the console
// put at the end
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));