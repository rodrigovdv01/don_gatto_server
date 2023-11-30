import { Sequelize } from "sequelize";

//Se conecta la base de datos 'ipopcafe' usando Sequelize, con los parámetros de esta.
// "Nombre base de datos", "usuario", "contraseña"
// Estamos conectados a un servidor local MAMP, esto se debe cambiar por un host en línea
const db = new Sequelize('dongatto', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;