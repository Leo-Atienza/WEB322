/********************************************************************************
*  WEB322 – Assignment 02
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*    https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
*  Name:  Leo Atienza    Student ID:  121941249    Date: May 28, 2025 
********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects");
const path = require("path");

const app = express();               
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public")); 


projectData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("===========================================");
      console.log(`\nServer listening on port ${HTTP_PORT}\n`);  
      console.log("===========================================");
    });
  })
  .catch(err => {
    console.error("Initialization failed: " + err);
  });
  
//  GET "/"
app.get("/", (req, res) => {
  //res.send("Assignment 2: Leo Atienza - 121941249");
  res.sendFile(path.join(__dirname, "views/home.html"));  
});

app.get("about", (req, res) => {
  res.sendFile(path.join(__dirname, "views/about.html"));
})

//  GET "/solutions/projects"
app.get("/solutions/projects", (req, res) => {

  // projectData.getAllProjects()
  //   .then(data => res.json(data))              
  //   .catch(err => res.status(404).send(err));   

  const {sector} = req.query;
  projectData.getAllProjects(sector)
  .then(projects => res.json(projects))
  .catch(err => res.status(404).send(err));

});

//  GET "/solutions/projects/id-demo"
app.get("/solutions/projects/id-demo", (req, res) => {

  // projectData.getProjectById(1) 
  //   .then(data => res.json(data))
  //   .catch(err => res.status(404).send(err));

  const id = parseInt(req.params.id, 10);
  projectData.getProjectById(id)
  .then(project => res.json(project))
  .catch(err => res.status(404).send(err));

});

//  GET "/solutions/projects/sector-demo"
app.get("/solutions/projects/sector-demo", (req, res) => {
  projectData.getProjectsBySector("ind") 
    .then(data => res.json(data))
    .catch(err => res.status(404).send(err));
});

//  Error message 
app.use((req, res) => {
  //res.status(404).send("Route not found");
  res.status(404).sendFile(__dirname + '/views/404.html');
});
