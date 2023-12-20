import { DataTypes } from "sequelize";
import db from "../database/db.js";
import bcrypt from "bcryptjs"; // Updated import statement

const User = db.define(
  "usuarios",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    telefono: {
      type: DataTypes.STRING, // Cambiado a STRING para permitir formato personalizado
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion_envio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion_facturacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    distrito: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM("user", "admin"), // Utilizando ENUM para valores específicos
      allowNull: false,
      defaultValue: "user",
    },
    // Otros campos del usuario, si es necesario
  },
  {
    tableName: "usuarios", // Nombre de la tabla personalizado
  }
);

// Antes de crear un nuevo usuario, hashear la contraseña
User.beforeCreate(async (user, options) => {
  const saltRounds = 10; // Número de rondas de sal
  const hashedPassword = await bcrypt.hashSync(user.password, saltRounds); // Updated method
  user.password = hashedPassword;
});

export default User;
