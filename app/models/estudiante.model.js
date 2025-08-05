module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo', 'suspendido'),
      defaultValue: 'activo'
    }
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  Usuario.associate = function(models) {
    Usuario.hasMany(models.Prestamo, {
      foreignKey: 'id_usuario',
      as: 'prestamos'
    });
  };

  return Usuario;
};