// Importa el modelo de Pedido si aún no lo has hecho
import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const createDetallePedido = async (req, res) => {
  try {
    // Extrae los datos necesarios del cuerpo de la solicitud
    const {
      pedido_id,
      producto_id,
      cantidad,
      precio_unitario,
      user_id,
      selectedEntrada,
      selectedSegundo,
      selectedPostre,
      selectedBebida,
    } = req.body;
    // Crea un nuevo detalle de pedido en la base de datos
    const nuevoDetallePedido = await DetallePedido.create({
      user_id,
      pedido_id,
      producto_id,
      selectedEntrada,
      selectedSegundo,
      selectedPostre,
      selectedBebida,
      cantidad,
      precio_unitario,
    });

    res.status(201).json({
      message: "Detalle de pedido creado con éxito",
      detallePedido: nuevoDetallePedido,
    });
  } catch (error) {
    console.error("Error al crear el detalle de pedido:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const createPedido = async (req, res) => {
  try {
    // Extrae los datos del pedido del cuerpo de la solicitud
    const {
      monto_total,
      estado_pedido,
      nombre,
      direccion_envio,
      telefono,
      user_id,
      email,
    } = req.body;

    // Verifica que los campos obligatorios no sean nulos o indefinidos
    if (monto_total === null || monto_total === undefined) {
      return res
        .status(400)
        .json({ message: "El campo monto_total es requerido" });
    }

    // Crea un nuevo pedido en la base de datos con el user_id obtenido del middleware
    const nuevoPedido = await Pedido.create({
      direccion_envio,
      telefono,
      nombre,
      user_id,
      monto_total,
      email,
      estado_pedido: estado_pedido || "Recibido", // Establece un valor predeterminado si no se proporciona estado_pedido
    });

    res.status(201).json({
      message: "Pedido creado con éxito",
      pedido: nuevoPedido,
    });
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getMisPedidos = async (req, res) => {
  try {
    // Obtén el token de la cookie
    const authToken = req.cookies.authToken;

    if (!authToken) {
      return res.status(401).json({ message: "No estás autenticado" });
    }

    try {
      // Verifica el token JWT para obtener el ID del usuario autenticado
      const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET); // Verifica con tu clave secreta
      const userId = decodedToken.userId;

      // Consulta la base de datos para obtener los pedidos del usuario en sesión
      const pedidos = await Pedido.findAll({ where: { user_id: userId } });

      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Error al verificar el token:", error);
      res.status(401).json({ message: "Token inválido" });
    }
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para obtener todos los pedidos
const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    return res.status(200).json(pedidos);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los pedidos" });
  }
};

// Función para obtener los detalles de un pedido por su ID
const getDetalles = async (req, res) => {
  const { id } = req.params;
  try {
    // Primero, busca el pedido por su ID
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Luego, busca los detalles de pedido asociados a ese pedido
    const detalles = await DetallePedido.findAll({
      where: { pedido_id: id },
    });

    // Retorna los detalles de pedido junto con el pedido en la respuesta
    return res.status(200).json({ pedido, detalles });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al obtener los detalles del pedido" });
  }
};

// Función para obtener un pedido por su ID
const getPedidoById = async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    return res.status(200).json(pedido);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el pedido por ID" });
  }
};

// Función para actualizar un pedido por su ID
const updatePedidoById = async (req, res) => {
  const { id } = req.params;
  const { estado_pedido } = req.body; // Nuevo estado del pedido

  try {
    // Busca el pedido por su ID
    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Actualiza el estado del pedido con el nuevo estado proporcionado en el cuerpo de la solicitud
    pedido.estado_pedido = estado_pedido;

    // Guarda los cambios en la base de datos
    await pedido.save();

    return res
      .status(200)
      .json({ message: "Estado del pedido actualizado con éxito", pedido });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al actualizar el estado del pedido por ID" });
  }
};

// Función para eliminar un pedido por su ID
const deletePedidoById = async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    await pedido.destroy();
    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al eliminar el pedido por ID" });
  }
};

export {
  createPedido,
  createDetallePedido,
  getAllPedidos,
  getDetalles,
  getPedidoById,
  getMisPedidos,
  updatePedidoById,
  deletePedidoById,
};
