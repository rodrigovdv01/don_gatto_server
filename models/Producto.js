import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Producto = db.define(
  "productos",
  {
    producto_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.00,
      unique: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Puedes establecer el valor predeterminado según tus necesidades
    },
  },
  {
    tableName: "productos", // Nombre de la tabla en la base de datos
  }
);

export default Producto;
