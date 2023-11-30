import { DataTypes } from "sequelize";
import db from "../database/db.js";

const TransaccionPago = db.define(
  "transacciones_pago",
  {
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: "pedidos", // This should match the actual table name for orders
      //   key: "id", // This should match the actual primary key field in the orders table
      // },
    },
    fecha_transaccion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metodo_pago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion_facturacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monto_transaccion: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    estado_transaccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "transacciones_pago", // Name of the table in the database
  }
);

export default TransaccionPago;
