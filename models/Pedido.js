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
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion_envio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    distrito: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    costo_envio: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
      type: DataTypes.ENUM('Activo','Confirmado', 'En camino', 'Finalizado'),
      allowNull: false,
    },
    trackId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "pedidos", // Nombre real de la tabla en la base de datos
  }
);

export default Pedido;
