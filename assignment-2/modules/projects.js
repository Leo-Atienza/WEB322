// modules/projects.js

// ─── Load environment & Sequelize ───────────────────────────
require('dotenv').config();
const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  }
);

// ─── Define Models & Association ────────────────────────────
const Sector = sequelize.define('Sector', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sector_name: { type: DataTypes.STRING,  allowNull: false }
}, {
  freezeTableName: true,
  timestamps:      false
});

const Project = sequelize.define('Project', {
  id:                  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:               { type: DataTypes.STRING,  allowNull: false },
  feature_img_url:     { type: DataTypes.STRING,  allowNull: false },
  summary_short:       { type: DataTypes.TEXT,    allowNull: false },
  intro_short:         { type: DataTypes.TEXT,    allowNull: false },
  impact:              { type: DataTypes.TEXT,    allowNull: false },
  original_source_url: { type: DataTypes.STRING,  allowNull: false },
  sector_id:           { type: DataTypes.INTEGER, allowNull: false }
}, {
  freezeTableName: true,
  timestamps:      false
});

Project.belongsTo(Sector, { foreignKey: 'sector_id' });

// ─── Data‐access functions ──────────────────────────────────

/**
 * Initialize the database (creates tables if they don't exist)
 */
function initialize() {
  return sequelize.sync();
}

/**
 * Get all projects, optionally filtered by sector name substring
 */
function getAllProjects(sector) {
  return Project.findAll({ include: [ Sector ] })
    .then(results => {
      if (!sector) return results;
      const filtered = results.filter(p =>
        p.Sector.sector_name.toLowerCase().includes(sector.toLowerCase())
      );
      if (filtered.length) return filtered;
      throw new Error("Unable to find requested projects");
    });
}

/**
 * Get one project by its ID
 */
function getProjectById(id) {
  return Project.findAll({
    where: { id },
    include: [ Sector ]
  })
  .then(rows => {
    if (rows.length) return rows[0];
    throw new Error("Unable to find requested project");
  });
}

/**
 * Get projects whose sector_name contains the given substring
 */
function getProjectsBySector(sector) {
  return Project.findAll({
    include: [ Sector ],
    where: {
      '$Sector.sector_name$': {
        [Op.iLike]: `%${sector}%`
      }
    }
  })
  .then(rows => {
    if (rows.length) return rows;
    throw new Error("Unable to find requested projects");
  });
}

/**
 * Return all sectors (for populating the Add/Edit form)
 */
function getAllSectors() {
  return Sector.findAll();
}

/**
 * Add a new project
 * Resolves with no data on success, or rejects with the first validation error message.
 */
function addProject(projectData) {
  return Project.create(projectData)
    .then(() => {})
    .catch(err => {
      if (err.errors && err.errors.length) {
        return Promise.reject(err.errors[0].message);
      }
      return Promise.reject(err.message);
    });
}

/**
 * Edit an existing project
 * Resolves with no data on success, or rejects with the first validation error message.
 */
function editProject(id, projectData) {
  return Project.update(projectData, { where: { id } })
    .then(([rowsUpdated]) => {
      if (rowsUpdated) return;
      throw new Error("Unable to update project");
    })
    .catch(err => {
      if (err.errors && err.errors.length) {
        return Promise.reject(err.errors[0].message);
      }
      return Promise.reject(err.message);
    });
}

/**
 * Delete a project by ID
 * Resolves with no data on success, or rejects with an error message.
 */
function deleteProject(id) {
  return Project.destroy({ where: { id } })
    .then(rowsDeleted => {
      if (rowsDeleted) return;
      throw new Error("Unable to delete project");
    })
    .catch(err => {
      return Promise.reject(err.message);
    });
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  getAllSectors,
  addProject,
  editProject,
  deleteProject
};
