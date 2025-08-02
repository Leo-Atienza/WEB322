/********************************************************************************
 *  WEB322 – Assignment 06
 * 
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 * 
 *  Name: Leo Atienza    Student ID: 121941249    Date: 2025-08-02
 *  Published URL: https://vercel.com/leo-atienzas-projects/web-322
 ********************************************************************************/

const express        = require("express");
const projectData    = require("./modules/projects");
const path           = require("path");
const fs             = require("fs");
const clientSessions = require("client-sessions");
const helmet         = require("helmet");
const authData       = require("./modules/auth-service");

const sectors        = JSON.parse(fs.readFileSync(path.join(__dirname, "data/sectorData.json"), "utf8"));

const app = express();
app.set('json spaces', 2);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// --- Assignment 6: Security & Sessions Setup ---
app.use(helmet());
app.use(clientSessions({
  cookieName:    'session',
  secret:        process.env.SESSION_SECRET,
  duration:      24 * 60 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
function ensureLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// Home Route
app.get("/", (req, res) => {
  projectData.getAllProjects()
    .then(allProjects => {
      const sorted   = allProjects.sort((a, b) => a.id - b.id);
      const featured = sorted.slice(0, 3);
      res.render("home", {
        page:     "/",
        projects: featured
      });
    })
    .catch(err => {
      res.status(500).render("500", { message: "Error loading home: " + err });
    });
});

// About page
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// List all projects
app.get("/solutions/projects", (req, res) => {
  const { sector } = req.query;
  projectData.getAllProjects(sector)
    .then(projects => {
      res.render("projects", { projects, sector, page: "/solutions/projects" });
    })
    .catch(err => {
      res.status(404).render("404", { message: err, page: "/solutions/projects" });
    });
});

// Single project by ID
app.get("/solutions/projects/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  projectData.getProjectById(id)
    .then(project => {
      res.render("project", { project, page: `/solutions/projects/${id}` });
    })
    .catch(err => {
      res.status(404).render("404", { message: err, page: `/solutions/projects/${id}` });
    });
});

// --- Add Project (GET/POST) ---
app.get("/solutions/addProject", ensureLogin, (req, res) => {
  res.render("addProject", { page: "/solutions/addProject", sectors });
});
app.post("/solutions/addProject", ensureLogin, (req, res) => {
  projectData.addProject(req.body)
    .then(() => res.redirect("/solutions/projects"))
    .catch(err => res.status(400).render("addProject", { error: err, page: "/solutions/addProject", sectors }));
});

// --- Edit Project (GET/POST) ---
app.get("/solutions/editProject/:id", ensureLogin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  projectData.getProjectById(id)
    .then(project => res.render("editProject", { project, page: "/solutions/editProject", sectors }))
    .catch(err => res.status(404).render("404", { message: err, page: "/solutions/editProject" }));
});
app.post("/solutions/editProject", ensureLogin, (req, res) => {
  const id = parseInt(req.body.id, 10);
  projectData.editProject(id, req.body)
    .then(() => res.redirect("/solutions/projects"))
    .catch(err => res.status(400).render("editProject", { error: err, project: req.body, page: "/solutions/editProject", sectors }));
});

// --- Delete Project ---
app.get("/solutions/deleteProject/:id", ensureLogin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  projectData.deleteProject(id)
    .then(() => res.redirect("/solutions/projects"))
    .catch(err => res.status(400).render("404", { message: err, page: "/solutions/projects" }));
});

// --- Sector pages ---
app.get("/land-sinks", (req, res) => res.render("land-sinks", { page: "/land-sinks" }));
app.get("/industry",   (req, res) => res.render("industry",   { page: "/industry"   }));
app.get("/transport",  (req, res) => res.render("transport",  { page: "/transport"  }));

// --- Authentication routes ---
app.get("/login",    (req, res) => res.render("login",    { errorMessage: "", userName: "" }));
app.post("/login",   (req, res) => {
  req.body.userAgent = req.get('User-Agent');
  authData.checkUser(req.body)
    .then(user => {
      req.session.user = {
        userName:     user.userName,
        email:        user.email,
        loginHistory: user.loginHistory
      };
      res.redirect("/solutions/projects");
    })
    .catch(err => {
      res.render("login", { errorMessage: err, userName: req.body.userName });
    });
});
app.get("/register", (req, res) => res.render("register", { errorMessage: "", successMessage: "", userName: "" }));
app.post("/register",(req, res) => {
  authData.registerUser(req.body)
    .then(() => res.render("register", { errorMessage: "", successMessage: "User created", userName: "" }))
    .catch(err => res.render("register", { errorMessage: err, successMessage: "", userName: req.body.userName }));
});
app.get("/logout",    (req, res) => { req.session.reset(); res.redirect("/"); });
app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory", {
    userName:     req.session.user.userName,
    loginHistory: req.session.user.loginHistory
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found", page: req.path });
});

// Initialize projects + auth then start server
const HTTP_PORT = process.env.PORT || 8080;
projectData.initialize()
  .then(authData.initialize)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("===========================================");
      console.log(`\nServer listening on port ${HTTP_PORT}\n`);
      console.log("===========================================");
    });
  })
  .catch(err => console.error("Initialization failed: " + err));
