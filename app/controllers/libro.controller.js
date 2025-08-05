const db = require("../models");
const Libro = db.Libro;
const Op = db.Sequelize.Op;

// Crear y guardar un nuevo libro
exports.create = (req, res) => {
  // Validar solicitud
  if (!req.body.titulo || !req.body.autor || !req.body.anioPublicacion || !req.body.genero) {
    res.status(400).send({
      message: "Todos los campos son requeridos (titulo, autor, anioPublicacion, genero)!"
    });
    return;
  }

  // Crear libro
  const libro = {
    titulo: req.body.titulo,
    autor: req.body.autor,
    anioPublicacion: req.body.anioPublicacion,
    genero: req.body.genero,
    disponible: req.body.disponible !== undefined ? req.body.disponible : true
  };

  // Guardar libro en la base de datos
  Libro.create(libro)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el libro."
      });
    });
};

// Obtener todos los libros
exports.findAll = (req, res) => {
  const titulo = req.query.titulo;
  const condition = titulo ? { titulo: { [Op.iLike]: `%${titulo}%` } : null;

  Libro.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los libros."
      });
    });
};

// Obtener un libro por id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Libro.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se encontró el libro con id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error al recuperar el libro con id=" + id
      });
    });
};

// Actualizar un libro por id
exports.update = (req, res) => {
  const id = req.params.id;

  Libro.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Libro actualizado correctamente."
        });
      } else {
        res.send({
          message: `No se pudo actualizar el libro con id=${id}. Quizás no se encontró el libro o el cuerpo de la solicitud está vacío.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error al actualizar el libro con id=" + id
      });
    });
};

// Eliminar un libro por id
exports.delete = (req, res) => {
  const id = req.params.id;

  Libro.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Libro eliminado correctamente!"
        });
      } else {
        res.send({
          message: `No se pudo eliminar el libro con id=${id}. Quizás no se encontró el libro.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No se pudo eliminar el libro con id=" + id
      });
    });
};