import TransaccionPago from "../models/TransaccionPago.js";
import Pedido from "../models/Pedido.js";

// Controlador para crear una nueva transacción de pago
export const createTransaccion = async (req, res) => {
  try {
    const { user_id, pedido_id, fecha_transaccion, metodo_pago, monto_transaccion, estado_transaccion } = req.body;

    const nuevaTransaccion = await TransaccionPago.create({
      user_id,
      pedido_id,
      fecha_transaccion,
      metodo_pago,
      monto_transaccion,
      estado_transaccion,
    });

    res.status(201).json({ message: "Transacción creada exitosamente", transaccion: nuevaTransaccion });
  } catch (error) {
    console.error("Error al crear la transacción:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para obtener todas las transacciones de un usuario por su ID
export const getTransaccionesByUsuario = async (req, res) => {
  try {
    const userId = req.params.userId;

    const transacciones = await TransaccionPago.findAll({
      where: { user_id: userId },
    });

    res.json(transacciones);
  } catch (error) {
    console.error("Error al obtener las transacciones del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};





// Controlador para obtener la transacción por el ID del pedido
export const getTransaccionByPedidoId = async (req, res) => {
  try {
    const pedidoId = req.params.pedidoId;

    // Busca el pedido por su ID
    const pedido = await Pedido.findByPk(pedidoId);

    if (!pedido) {
      // Si no se encuentra el pedido, devuelve un mensaje de error
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    // Encuentra la transacción asociada al pedido
    const transaccion = await TransaccionPago.findOne({
      where: { pedido_id: pedidoId },
    });

    if (!transaccion) {
      // Si no se encuentra ninguna transacción, devuelve un mensaje de error
      return res.status(404).json({ message: "No se encontró ninguna transacción para el pedido especificado." });
    }

    // Si se encuentra la transacción, la devuelve en la respuesta
    res.json(transaccion);
  } catch (error) {
    console.error("Error al obtener la transacción del pedido:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para editar las transacciones de un pedido por su ID
export const editTransaccionByPedidoId = async (req, res) => {
  try {
    const pedidoId = req.params.pedidoId;

    // Verifica si la transacción existe
    const transaccionExistente = await TransaccionPago.findOne({
      where: { pedido_id: pedidoId },
    });

    if (!transaccionExistente) {
      return res.status(404).json({ message: "No se encontró ninguna transacción para el pedido especificado." });
    }

    // Actualiza la transacción con los nuevos datos del cuerpo de la solicitud
    const { fecha_transaccion, metodo_pago, monto_transaccion, estado_transaccion } = req.body;
    
    await TransaccionPago.update(
      {
        fecha_transaccion,
        metodo_pago,
        monto_transaccion,
        estado_transaccion,
      },
      {
        where: { pedido_id: pedidoId },
      }
    );

    // Obtiene la transacción actualizada
    const transaccionActualizada = await TransaccionPago.findOne({
      where: { pedido_id: pedidoId },
    });

    // Devuelve la transacción actualizada en la respuesta
    res.json(transaccionActualizada);
  } catch (error) {
    console.error("Error al editar la transacción del pedido:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

