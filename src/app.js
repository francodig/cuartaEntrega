const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

app.use(express.static('public'));

// Configuro handlebars como motor de plantillas
const { engine } = require('express-handlebars');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//Configuro soket io
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
});


// Importo el router después de configurar socket.io
const productsRouter = require('./routes/products')(io);
const cartsRouter = require('./routes/carts'); 

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


// Iniciar el servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
