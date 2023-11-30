import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Pedido = db.define(
  "pedidos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: "usuarios", // Asegúrate de que coincida con el nombre real de la tabla de usuarios
      //   key: "id", // Asegúrate de que coincida con el nombre real del campo clave primaria en la tabla de usuarios
      // },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion_envio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING
    },
    monto_total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    estado_pedido: {
      type: DataTypes.ENUM('Recibido', 'Aprobado', 'En preparación', 'En camino', 'Entregado'),
      allowNull: false,
    },
    
  },
  {
    tableName: "pedidos", // Nombre real de la tabla en la base de datos
  }
);

export default Pedido;
