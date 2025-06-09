//  Variables that point to the Project and Sector files 
const projectData = require("../data/projectData");  
const sectorData  = require("../data/sectorData");   

// Project data + Sector data
let projects = [];

//  Function 1: initialize()
function initialize() {
  return new Promise((resolve, reject) => { 
    try {
      //  For easier trouble shooting
      if (!Array.isArray(projectData) || projectData.length === 0) {
        return reject("Error: projectData is causing issues. Recheck file.");
      }
      if (!Array.isArray(sectorData) || sectorData.length === 0) {
        return reject("Error: sectorData is causing issues. Recheck file.");
      }

      projects = []; 

      projectData.forEach(Project => {
        const sectorRecord = sectorData.find(record => record.id === Project.sector_id);
        projects.push({
          ...Project,
          sector: sectorRecord ? sectorRecord.sector_name : "Unknown"
        });
      });
      
      console.log("===========================================");
      console.log(`\n✅ Initialized ${projects.length} projects\n`);
      resolve();  
    } 
    catch (error) {
      reject("Error: Unable to initialize projects: " + error);
    }
  });
}

//  Function 2: getAllProjects() — now accepts an optional `sector` filter
function getAllProjects(sector) {
  return new Promise((resolve, reject) => {
    if (projects.length === 0) {
      return reject("Error: No Projects Found");
    }

    // if a sector query string was provided, filter down
    if (sector) {
      const filtered = projects.filter(p =>
        p.sector.toLowerCase().includes(sector.toLowerCase())
      );
      return filtered.length > 0
        ? resolve(filtered)
        : reject("Error: No Projects Found: " + sector);
    }

    // otherwise return everything
    resolve(projects);
  });
}

//  Function 3: getProjectById ()
function getProjectById(id) {
  return new Promise((resolve, reject) => {
    const found = projects.find(p => p.id === id);
    found
      ? resolve(found)
      : reject("Error: No Projects Found: " + id);
  });
}

//  Function 4: getProjectsBySector ()
function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    const filtered = projects.filter(p =>
      p.sector.toLowerCase().includes(sector.toLowerCase())
    );
    filtered.length > 0
      ? resolve(filtered)
      : reject("Error: No Projects Found: " + sector);
  });
}

//  Module exports
module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector
};
