import { DataTypes } from "sequelize";
import db from "../database/db.js";

// Modelo de DetallePedido con la relación a Usuario
const DetallePedido = db.define(
  "detalles_pedidos",
  {
    user_id: {
      type: DataTypes.INTEGER, // ID del producto
      allowNull: true,
      references: {
        model: "usuarios", // This should match the actual table name for orders
        key: "id", // This should match the actual primary key field in the orders table
      },
    },
    pedido_id: {
      type: DataTypes.INTEGER, // ID del producto
      allowNull: true,
      references: {
        model: "pedidos", // This should match the actual table name for orders
        key: "id", // This should match the actual primary key field in the orders table
      },
    },

    producto_id: {
      type: DataTypes.INTEGER, // ID del producto
      allowNull: true,
      references: {
        model: "productos", // This should match the actual table name for orders
        key: "producto_id", // This should match the actual primary key field in the orders table
      },
    },

    cantidad: {
      type: DataTypes.INTEGER, // Cantidad del producto en el pedido
      allowNull: true,
    },
    precio_unitario: {
      type: DataTypes.FLOAT, // Total del pedido
      allowNull: true,
    },
  },
  {
    tableName: "detalles_pedidos",
  }
);


export default DetallePedido;
