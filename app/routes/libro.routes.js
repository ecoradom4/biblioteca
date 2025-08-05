module.exports = app => {
  const libros = require("../controllers/libro.controller.js");
  const router = require("express").Router();

  // Crear nuevo libro
  router.post("/", libros.create);
  
  // Obtener todos los libros
  router.get("/", libros.findAll);
  
  // Obtener un libro por id
  router.get("/:id", libros.findOne);
  
  // Actualizar un libro por id
  router.put("/:id", libros.update);
  
  // Eliminar un libro por id
  router.delete("/:id", libros.delete);

  app.use('/api/libros', router);
};