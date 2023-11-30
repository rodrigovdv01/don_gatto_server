import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Updated import statement
import { jwtSecret } from "../config.js"; // Import the jwtSecret directly
import { serialize } from "cookie"; // Import the cookie library

export const getAllUsers = async (req, res) => {
  try {
    const Users = await User.findAll();
    res.json(Users);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // Check if there is a valid user session by inspecting the cookies
    const token = req.cookies.token;

    if (!token) {
      return res.json({ authenticated: false });
    }

    // Verify the token and decode user information
    const decodedToken = jwt.verify(token, jwtSecret);

    if (!decodedToken) {
      return res.json({ authenticated: false });
    }

    // If the token is valid, fetch the user details from your database
    const user = await User.findByPk(decodedToken.userId);

    if (!user) {
      return res.json({ authenticated: false });
    }

    // If everything checks out, return user data as authenticated
    return res.json({ authenticated: true, user: user });
  } catch (error) {
    console.error("Error checking authentication:", error);
    res.status(500).json({ authenticated: false });
  }
};

export const createUser = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, password, direccion, level } =
      req.body;

    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear el nuevo usuario en la base de datos
    const newUser = await User.create({
      nombre,
      apellido,
      email,
      telefono,
      password,
      direccion,
      level,
    });

    // Hashear la contraseña después de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hashSync(newUser.password, 10);
    newUser.password = hashedPassword;
    
    res.status(201).json({
      message: "Registro creado exitosamente",
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      newPassword, // Nueva contraseña (si se actualiza)
      nombre, // Nuevo nombre
      apellido, // Nuevo apellido
      email, // Nuevo email
      telefono, // Nuevo teléfono
      direccion, // Nueva dirección
      level, // Nuevo nivel
    } = req.body;

    // Crear un objeto con los campos que se van a actualizar
    const updatedFields = {};

    // Si se proporciona una nueva contraseña, hasheala y agrega al objeto
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updatedFields.password = hashedPassword;
    }

    // Agrega los demás campos si se proporcionan en la solicitud
    if (nombre) updatedFields.nombre = nombre;
    if (apellido) updatedFields.apellido = apellido;
    if (email) updatedFields.email = email;
    if (telefono) updatedFields.telefono = telefono;
    if (direccion) updatedFields.direccion = direccion;
    if (level) updatedFields.level = level;

    // Actualiza la base de datos con los campos proporcionados
    await User.update(updatedFields, { where: { id } });

    res.json({
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca el usuario por su ID y elimínalo de la base de datos
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findAll({
      where: { id: req.params.id },
    });
    res.json(user[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Correo no registrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "1h",
    });

    // Set the token as an HTTP-only cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use 'secure' in production
        sameSite: "strict", // Adjust as needed for your use case
        path: "/", // Adjust the path as needed
        maxAge: 3600, // Token expiration time in seconds
      })
    );

    res.json({ message: "Ingreso exitoso", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const signOut = async (req, res) => {
  // Clear the 'token' cookie to log the user out
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use 'secure' in production
      sameSite: "strict", // Adjust as needed for your use case
      path: "/", // Adjust the path as needed
      expires: new Date(0), // Set an expired date to clear the cookie
    })
  );
  res.json({ message: "Sesión cerrada exitosamente" });
};
