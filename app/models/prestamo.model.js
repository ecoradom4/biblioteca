module.exports = (sequelize, DataTypes) => {
  const Prestamo = sequelize.define('Prestamo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    libroId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'libros',
        key: 'id'
      }
    },
    estudianteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'estudiantes',
        key: 'id'
      }
    },
    fechaPrestamo: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    fechaDevolucion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'prestamos',
    timestamps: false
  });

  return Prestamo;
};