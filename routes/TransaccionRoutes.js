import express from "express";
import {
  createTransaccion,
  getTransaccionesByUsuario,
  getTransaccionByPedidoId,
  editTransaccionByPedidoId,
} from "../controllers/TransaccionControllers.js";

const router = express.Router();

// Ruta para crear una nueva transacción de pago
router.post("/", createTransaccion);

// Ruta para obtener todas las transacciones de un usuario por su ID
router.get("/usuario/:userId", getTransaccionesByUsuario);

// Ruta para obtener todas las transacciones de un pedido por su ID
router.get("/:pedidoId", getTransaccionByPedidoId);

// Ruta para editar las transacciones de un pedido por su ID
router.put("/:pedidoId", editTransaccionByPedidoId);



export default router;
