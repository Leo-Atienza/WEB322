/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Leo Atienza    Student ID: 121941249    Date: 2025-06-08
*  Published URL: [Your Vercel URL]
********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects");
const path = require("path");

const app = express();

//  For automatic pretty-print 
app.set('json spaces', 2);

const HTTP_PORT = process.env.PORT || 8080;

// Serve static files from "public"
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

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// About page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Projects endpoint (with optional sector filter)
app.get("/solutions/projects", (req, res) => {
  const { sector } = req.query;
  projectData.getAllProjects(sector)
    .then(projects => res.json(projects))
    .catch(err => res.status(404).send(err));
});

// Single project by ID
app.get("/solutions/projects/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  projectData.getProjectById(id)
    .then(project => res.json(project))
    .catch(err => res.status(404).send(err));
});

// 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
