// authMiddleware.js

import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authToken = req.cookies.authToken;

  if (!authToken) {
    // Si no hay token, el usuario no está autenticado
    return res.status(401).json({ message: "No estás autenticado" });
  }

  try {
    const decodedToken = jwt.verify(authToken, "1ewe9920"); // Reemplaza "tu_clave_secreta" con tu clave secreta

    // Asegúrate de que decodedToken.userId sea el campo correcto en tu token JWT que contiene el user_id
    req.user_id = decodedToken.userId; // Agrega user_id al objeto de solicitud
    next(); // Continúa con la siguiente función en la cadena de middleware
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ message: "Token inválido" });
  }
};

export default authenticate;