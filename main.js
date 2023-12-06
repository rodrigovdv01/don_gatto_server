import express from "express";
import db from "./database/db.js";

import dotenv from "dotenv";
//Routes
import UserRoutes from "./routes/UserRoutes.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import PedidoRoutes from "./routes/PedidoRoutes.js";
//Models
import User from "./models/User.js";
import Producto from "./models/Producto.js";
import Pedido from "./models/Pedido.js";
import DetallePedido from "./models/DetallePedido.js";
import TransaccionesPago from "./models/TransaccionPago.js";
//otros
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();
const port = process.env.PORT || 3001;

dotenv.config();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./archivos",
  })
);

const corsOptions = {
  origin: [
    "https://dongattovapestore.netlify.app",
    "http://localhost:3000",
    "http://localhost:3002",
  ],
  credentials: true, // Permite el uso de credencial es (cookies)
};
// Handle preflight requests
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Nombres de cookies:", Object.keys(req.cookies).join(", "));
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the root endpoint!");
});

app.use("/products", ProductRoutes); // Ejemplo de ruta protegida
app.use("/users", UserRoutes);
app.use("/pedidos", PedidoRoutes);

app.use("/transacciones_pago", TransaccionesPago);

Pedido.associate = (models) => {
  Pedido.hasMany(models.DetallePedido, { foreignKey: "pedido_id" });
};

DetallePedido.associate = (models) => {
  DetallePedido.belongsTo(models.Pedido, { foreignKey: "pedido_id" });
};

// Ruta para verificar la autenticación
app.use("/verify-auth", async (req, res, next) => {
  // Obtén el token de la cookie
  const authToken = req.cookies.authTokenServer;

  if (!authToken) {
    // Si no hay token, el usuario no ha iniciado sesión
    return res.json({ isAuthenticated: false, message: "User not logged in" });
  }

  try {
    // Verifica el token JWT
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

    // El token es válido, busca al usuario en la base de datos (si es necesario)
    const user = await User.findOne({ where: { id: decodedToken.userId } });

    if (!user) {
      // Si el usuario no se encuentra en la base de datos, el token es inválido
      return res.status(401).json({ isAuthenticated: false });
    }

    // El usuario está autenticado y puedes devolver su información
    res.json({ isAuthenticated: true, user });
  } catch (error) {
    // Si ocurre un error al verificar el token, se considera inválido
    console.error("Error al verificar el token:", error);
    res.status(401).json({ isAuthenticated: false });
  }
});

// Ruta de inicio de sesión
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      const errorMessage = "Correo no registrado";
      console.error(errorMessage);
      return res.status(401).json({ message: errorMessage });
    }

    const isPasswordValid = await bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      const errorMessage = "Contraseña incorrecta";
      console.error(errorMessage);
      return res.status(401).json({ message: errorMessage });
    }

    // Crear un token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Configurar el token en una cookie HTTP-only
    res.cookie("authTokenServer", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production if using HTTPS
      sameSite: "None", // Required for cross-site cookies
      path: "/",
      maxAge: 3600000,
    });
    res.json({ user, Login: true });
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    res
      .status(500)
      .json({ Login: false, message: "Error interno del servidor" });
  }
});

// Ruta de cierre de sesión
// Ruta de cierre de sesión
app.get("/logout", (req, res) => {
  try {
    // Utiliza cookieParser para eliminar las cookies
    res.clearCookie("authToken"); // Clear the "authToken" cookie
    res.clearCookie("authTokenServer"); // Clear the "authTokenServer" cookie

    const successMessage = "Sesión cerrada exitosamente";
    console.log(successMessage);
    res.json({ message: successMessage });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Sincroniza los modelos con la base de datos y escucha en el puerto especificado
db.sync()
  .then(() => {
    console.log("Modelos sincronizados con la base de datos");
    app.listen(port, () => {
      console.log(`Servidor en funcionamiento en el puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar modelos:", error);
  });
