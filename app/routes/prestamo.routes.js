module.exports = app => {
  const prestamos = require("../controllers/prestamo.controller.js");
  const router = require("express").Router();

  // Asignar libro a estudiante
  router.post("/", prestamos.create);
  
  // Marcar libro como devuelto
  router.put("/:id", prestamos.update);

  app.use('/api/prestamos', router);
};