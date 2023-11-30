import Producto from "../models/Producto.js";

// Mostrar todos los registros
export const getAllProducts = async (req, res) => {
    try {
        const products = await Producto.findAll();
        res.json(products);
    } catch (error) {
        res.json({ message: error.message });
    }
};

// Mostrar un registro
export const getProduct = async (req, res) => {
    try {
        const product = await Producto.findAll({
            where: { producto_id: req.params.id }
        });
        res.json(product[0]);
    } catch (error) {
        res.json({ message: error.message });
    }
};

// Crear un registro
export const createProduct = async (req, res) => {
    try {
        await Producto.create(req.body);
        res.json({
            message: 'Registro creado'
        });
    } catch (error) {
        res.json({ message: error.message });
    }
};

// Actualizar registro
export const updateProducts = async (req, res) => {
    try {
        await Producto.update(req.body, {
            where: { producto_id: req.params.id }
        });
        res.json({
            message: 'Registro actualizado'
        });
    } catch (error) {
        res.json({ message: error.message });
    }
};

// Eliminar registro
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProductCount = await Producto.destroy({
            where: { producto_id: productId },
        });

        if (deletedProductCount > 0) {
            res.json({
                message: 'Registro borrado'
            });
        } else {
            res.status(404).json({
                message: 'No se encontró el registro con el ID especificado'
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reservar o no reservar productos por medio de un click al carrito
export const bookProduct = async (req, res) => {
    try {
        res.status(400).json('Bad request');
    } catch (error) {
        res.json({ message: error.message });
    }
};

// Se actualiza el contenido de la base de datos
const updateContent = async (product, quantity) => {
    // Implementa la lógica para actualizar el contenido del producto aquí
};

// Se compran los productos y se usa updatecontent para actualizar el contenido de cada uno
export const buyProducts = async (req, res) => {
    try {
        console.log(typeof (req.body));
        Object.keys(req.body).forEach(product => updateContent(product, req.body[product]));
        res.json("Compra exitosa");
    } catch (error) {
        res.json(error.message);
    }
};
