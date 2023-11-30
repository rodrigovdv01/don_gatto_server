import express from "express";
import { createPedido, getMisPedidos, getDetalles, createDetallePedido, getAllPedidos, getPedidoById, updatePedidoById, deletePedidoById } from "../controllers/PedidoControllers.js";

const router = express.Router();

// Rutas para pedidos
router.get('/', getAllPedidos); // Obtener todos los pedidos
router.get('/mis-pedidos', getMisPedidos); // Obtener todos los pedidos
router.get('/:id/detalles', getDetalles); // Obtener todos los pedidos
router.get('/:id', getPedidoById); // Obtener un pedido por ID
router.post('/crear-pedido', createPedido); // Crear un nuevo pedido
router.post('/detalles-de-pedido', createDetallePedido); // 
router.put('/:id', updatePedidoById); // Actualizar un pedido por ID
router.delete('/:id', deletePedidoById); // Eliminar un pedido por ID

export default router;
