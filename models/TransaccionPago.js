import { DataTypes } from "sequelize";
import db from "../database/db.js";

const TransaccionPago = db.define(
  "transacciones_pago",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_transaccion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metodo_pago: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monto_transaccion: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    estado_transaccion: {
      type: DataTypes.ENUM('Pendiente', 'Pagado', 'Rechazada'),
      allowNull: true,
    },
  },
  {
    tableName: "transacciones_pago", // Name of the table in the database
  }
);

export default TransaccionPago;
