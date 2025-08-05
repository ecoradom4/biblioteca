const db = require("../models");
const Estudiante = db.Estudiante;
const Op = db.Sequelize.Op;

// Crear y guardar un nuevo estudiante
exports.create = (req, res) => {
  // Validar solicitud
  if (!req.body.nombre || !req.body.carnet || !req.body.correo) {
    res.status(400).send({
      message: "Todos los campos son requeridos (nombre, carnet, correo)!"
    });
    return;
  }

  // Crear estudiante
  const estudiante = {
    nombre: req.body.nombre,
    carnet: req.body.carnet,
    correo: req.body.correo
  };

  // Guardar estudiante en la base de datos
  Estudiante.create(estudiante)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el estudiante."
      });
    });
};

// Obtener todos los estudiantes
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  const condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } }: null;

  Estudiante.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los estudiantes."
      });
    });
};

// Obtener un estudiante por id con sus préstamos
exports.findOne = (req, res) => {
  const id = req.params.id;

  Estudiante.findByPk(id, {
    include: [{
      model: db.Libro,
      as: 'libros',
      through: {
        attributes: ['fechaPrestamo', 'fechaDevolucion']
      }
    }]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se encontró el estudiante con id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error al recuperar el estudiante con id=" + id
      });
    });
};

// Actualizar un estudiante por id
exports.update = (req, res) => {
  const id = req.params.id;

  Estudiante.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Estudiante actualizado correctamente."
        });
      } else {
        res.send({
          message: `No se pudo actualizar el estudiante con id=${id}. Quizás no se encontró el estudiante o el cuerpo de la solicitud está vacío.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error al actualizar el estudiante con id=" + id
      });
    });
};

// Eliminar un estudiante por id
exports.delete = (req, res) => {
  const id = req.params.id;

  Estudiante.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Estudiante eliminado correctamente!"
        });
      } else {
        res.send({
          message: `No se pudo eliminar el estudiante con id=${id}. Quizás no se encontró el estudiante.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No se pudo eliminar el estudiante con id=" + id
      });
    });
};