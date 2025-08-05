const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.Libro = require('./libro.model.js')(sequelize, Sequelize);
db.Estudiante = require('./estudiante.model.js')(sequelize, Sequelize);
db.Prestamo = require('./prestamo.model.js')(sequelize, Sequelize);

// Definir relaciones
db.Libro.belongsToMany(db.Estudiante, {
  through: db.Prestamo,
  foreignKey: 'libroId',
  as: 'estudiantes'
});

db.Estudiante.belongsToMany(db.Libro, {
  through: db.Prestamo,
  foreignKey: 'estudianteId',
  as: 'libros'
});

db.Prestamo.belongsTo(db.Libro, {
  foreignKey: 'libroId',
  as: 'libro'
});

db.Prestamo.belongsTo(db.Estudiante, {
  foreignKey: 'estudianteId',
  as: 'estudiante'
});

module.exports = db;