const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager.class');

// La función exportada toma el objeto 'io' y retorna el router configurado
module.exports = function(io) {

  const productManager = new ProductManager('../products.json');


  // Ruta raíz GET /api/products/
  router.get('/', async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.render('home', { products }); // Renderizar la vista con Handlebars
    } catch (err) {
      res.status(500).render('error', { error: 'Error al obtener productos' });
    }
  });

  // Ruta GET /api/products/:pid para obtener un producto por su id
  router.get('/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const product = await productManager.getProductById(productId);
      res.render('productDetail', { product }); // Suponiendo que tienes una vista de detalles del producto
    } catch (err) {
      res.status(404).render('error', { error: 'Producto no encontrado' });
    }
  });

  // Ruta raíz POST /api/products/ para agregar un nuevo producto
  router.post('/', async (req, res) => {
    try {
      const newProduct = await productManager.addProduct(req.body);
      io.emit('productAdded', newProduct); // Emitir el evento a todos los clientes conectados
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).json({ error: 'Error al agregar el producto' });
    }
  });

  // Ruta PUT /api/products/:pid para actualizar un producto
  router.put('/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const updatedProduct = await productManager.updateProduct(productId, req.body);
      io.emit('productUpdated', updatedProduct); // Emitir el evento de producto actualizado
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  });

  // Ruta DELETE /api/products/:pid para eliminar un producto
  router.delete('/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      await productManager.deleteProduct(productId);
      io.emit('productDeleted', productId); // Emitir el evento de producto eliminado
      res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  });

  router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (err) {
        res.status(500).send('Error al obtener productos');
    }
});

  return router;
  

};


