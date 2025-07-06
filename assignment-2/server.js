/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Leo Atienza    Student ID: 121941249    Date: 2025-07-03
*  Published URL: https://web-322-pearl.vercel.app/ or https://vercel.com/leo-atienzas-projects/web-322
********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects");
const path = require("path");

const app = express();

// For automatic pretty-print
app.set('json spaces', 2);

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const HTTP_PORT = process.env.PORT || 8080;

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

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
  res.render("home", { page: "/" });
});

// About page
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// Part 3: List all projects (renders projects.ejs)
app.get("/solutions/projects", (req, res) => {
  const { sector } = req.query;
  projectData.getAllProjects(sector)
    .then(projects => {
      res.render("projects", { projects, sector });
    })
    .catch(err => {
      res.status(404).render("404", {
        message: err,
        page: "/solutions/projects"
      });
    });
});

// Part 4: Single project by ID (renders project.ejs)
app.get("/solutions/projects/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  projectData.getProjectById(id)
    .then(project => {
      res.render("project", { project });
    })
    .catch(err => {
      res.status(404).render("404", {
        message: err,
        page: "/solutions/projects"
      });
    });
});

// Projects overview (static)
app.get("/projects", (req, res) => {
  //res.sendFile(path.join(__dirname, "views", "projects.html"));
  res.render("projects", { page: "/projects" });
});

// Sector pages (land-sinks, industry, transportation)
app.get("/projects/sector/:sector", (req, res, next) => {
  const fileMap = {
    "land-sinks":     "land-sinks",
    "industry":       "industry",
    "transportation": "transport"
  };
  const viewFile = fileMap[req.params.sector];
  if (viewFile) {
    //res.sendFile(path.join(__dirname, "views", `${viewFile}.html`));
    return res.render(viewFile, { page: `/projects/sector/${req.params.sector}` });
  }
  next(); // Will go to 404
});

// Individual static project pages
// Abandoned Farmland Restoration (1), Alternative Cement (2), Bicycle Infrastructure (3)
app.get("/projects/:id", (req, res, next) => {
  const id = req.params.id;
  if (["1", "2", "3"].includes(id)) {
    //return res.sendFile(path.join(__dirname, "views", `project-${id}.html`));
    return res.render(`project-${id}`, { page: `/projects/${id}` });
  }
  next(); // Will go to 404
});

// 404 handler for everything else
app.use((req, res) => {
  res.status(404).render("404", {
    message: "Page not found",
    page: req.path
  });
});
