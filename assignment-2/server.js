/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Leo Atienza    Student ID: 121941249    Date: 2025-07-18
*  Published URL: https://vercel.com/leo-atienzas-projects/web-322
********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects");
const path = require("path");

const app = express();

// For automatic pretty-print
app.set('json spaces', 2);

// EJS setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Parse URL-encoded form data (for POST submissions) 
app.use(express.urlencoded({ extended: true }));

// Initialize database and start server
const HTTP_PORT = process.env.PORT || 8080;
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

// Routes 

// Home page
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

// About page
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// List all projects (renders projects.ejs)
app.get("/solutions/projects", (req, res) => {
  const { sector } = req.query;
  projectData.getAllProjects(sector)
    .then(projects => {
      res.render("projects", { projects, sector, page: "/solutions/projects" });
    })
    .catch(err => {
      res.status(404).render("404", {
        message: err,
        page: "/solutions/projects"
      });
    });
});

// Single project by ID (renders project.ejs)
app.get("/solutions/projects/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  projectData.getProjectById(id)
    .then(project => {
      res.render("project", { project, page: `/solutions/projects/${id}` });
    })
    .catch(err => {
      res.status(404).render("404", {
        message: err,
        page: `/solutions/projects/${id}`
      });
    });
});

// Add Project 

// GET /solutions/addProject – render the form
app.get("/solutions/addProject", (req, res) => {
  projectData.getAllSectors()
    .then(sectors => {
      res.render("addProject", {
        sectors,
        page: "/solutions/addProject"
      });
    })
    .catch(err => {
      res.status(500).render("500", {
        message: `Unable to load form: ${err}`
      });
    });
});

// POST /solutions/addProject – process submission
app.post("/solutions/addProject", (req, res) => {
  projectData.addProject(req.body)
    .then(() => {
      res.redirect("/solutions/projects");
    })
    .catch(err => {
      res.render("500", {
        message: `Error adding project: ${err}`
      });
    });
});

// Edit Project

// GET /solutions/editProject/:id – render the edit form
app.get("/solutions/editProject/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  Promise.all([
    projectData.getProjectById(id),
    projectData.getAllSectors()
  ])
  .then(([project, sectors]) => {
    res.render("editProject", {
      project,
      sectors,
      page: ""
    });
  })
  .catch(err => {
    res.status(404).render("404", {
      message: err,
      page: `/solutions/editProject/${id}`
    });
  });
});

// process update
app.post("/solutions/editProject", (req, res) => {
  const id = parseInt(req.body.id, 10);
  projectData.editProject(id, req.body)
    .then(() => {
      res.redirect("/solutions/projects");
    })
    .catch(err => {
      res.render("500", {
        message: `Error updating project: ${err}`
      });
    });
});

// Delete Project 

// delete and redirect
app.get("/solutions/deleteProject/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  projectData.deleteProject(id)
    .then(() => {
      res.redirect("/solutions/projects");
    })
    .catch(err => {
      res.render("500", {
        message: `Error deleting project: ${err}`
      });
    });
});

// Sector pages
app.get("/land-sinks",  (req, res) => res.render("land-sinks",  { page: "/land-sinks" }));
app.get("/industry",    (req, res) => res.render("industry",    { page: "/industry"   }));
app.get("/transport",   (req, res) => res.render("transport",   { page: "/transport"  }));

// Projects overview 
app.get("/projects", (req, res) => {
  res.render("projects", { page: "/projects" });
});

// Project pages
app.get("/projects/:id", (req, res, next) => {
  const id = req.params.id;
  if (["1", "2", "3"].includes(id)) {
    return res.render(`project-${id}`, { page: `/projects/${id}` });
  }
  next();
});

// 404 
app.use((req, res) => {
  res.status(404).render("404", {
    message: "Page not found",
    page: req.path
  });
});
