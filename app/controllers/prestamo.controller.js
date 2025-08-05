const db = require("../models");
const Prestamo = db.Prestamo;
const Libro = db.Libro;
const Estudiante = db.Estudiante;

// Asignar libro a estudiante
exports.create = async (req, res) => {
  // Validar solicitud
  if (!req.body.libroId || !req.body.estudianteId) {
    return res.status(400).send({
      message: "Los campos libroId y estudianteId son requeridos!"
    });
  }

  const t = await db.sequelize.transaction();

  try {
    // Verificar si el libro está disponible
    const libro = await Libro.findByPk(req.body.libroId, { transaction: t });
    if (!libro) {
      await t.rollback();
      return res.status(404).send({
        message: `Libro con id=${req.body.libroId} no encontrado.`
      });
    }

    if (!libro.disponible) {
      await t.rollback();
      return res.status(400).send({
        message: "El libro no está disponible para préstamo."
      });
    }

    // Verificar si el estudiante existe
    const estudiante = await Estudiante.findByPk(req.body.estudianteId, { transaction: t });
    if (!estudiante) {
      await t.rollback();
      return res.status(404).send({
        message: `Estudiante con id=${req.body.estudianteId} no encontrado.`
      });
    }

    // Crear el préstamo
    const prestamo = await Prestamo.create({
      libroId: req.body.libroId,
      estudianteId: req.body.estudianteId,
      fechaPrestamo: new Date()
    }, { transaction: t });

    // Actualizar disponibilidad del libro
    await Libro.update(
      { disponible: false },
      { where: { id: req.body.libroId }, transaction: t }
    );

    await t.commit();
    res.status(201).send(prestamo);
  } catch (err) {
    await t.rollback();
    res.status(500).send({
      message: err.message || "Ocurrió un error al asignar el libro."
    });
  }
};

// Marcar libro como devuelto
exports.update = async (req, res) => {
  const id = req.params.id;

  const t = await db.sequelize.transaction();

  try {
    // Encontrar el préstamo
    const prestamo = await Prestamo.findByPk(id, { transaction: t });
    if (!prestamo) {
      await t.rollback();
      return res.status(404).send({
        message: `Préstamo con id=${id} no encontrado.`
      });
    }

    // Verificar si ya fue devuelto
    if (prestamo.fechaDevolucion) {
      await t.rollback();
      return res.status(400).send({
        message: "El libro ya fue devuelto."
      });
    }

    // Actualizar préstamo con fecha de devolución
    await Prestamo.update(
      { fechaDevolucion: new Date() },
      { where: { id: id }, transaction: t }
    );

    // Actualizar disponibilidad del libro
    await Libro.update(
      { disponible: true },
      { where: { id: prestamo.libroId }, transaction: t }
    );

    await t.commit();
    res.send({
      message: "Libro marcado como devuelto correctamente."
    });
  } catch (err) {
    await t.rollback();
    res.status(500).send({
      message: "Error al actualizar el préstamo con id=" + id
    });
  }
};

// Obtener préstamos de un estudiante
exports.findByEstudiante = (req, res) => {
  const estudianteId = req.params.id;

  Prestamo.findAll({
    where: { estudianteId: estudianteId },
    include: [{
      model: db.Libro,
      as: 'libro'
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los préstamos."
      });
    });
};