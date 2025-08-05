module.exports = app => {
  const estudiantes = require("../controllers/estudiante.controller.js");
  const prestamos = require("../controllers/prestamo.controller.js");
  const router = require("express").Router();

  // Crear nuevo estudiante
  router.post("/", estudiantes.create);
  
  // Obtener todos los estudiantes
  router.get("/", estudiantes.findAll);
  
  // Obtener un estudiante por id
  router.get("/:id", estudiantes.findOne);
  
  // Actualizar un estudiante por id
  router.put("/:id", estudiantes.update);
  
  // Eliminar un estudiante por id
  router.delete("/:id", estudiantes.delete);
  
  // Obtener préstamos de un estudiante
  router.get("/:id/prestamos", prestamos.findByEstudiante);

  app.use('/api/estudiantes', router);
};