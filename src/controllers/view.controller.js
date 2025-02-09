


const express =require("express")
const router = express.Router()
const fs = require('fs');
const socketIo = require('socket.io');

const hbs = require('hbs');
const app = express();
const server = require('http').createServer(app);
const productService = require("../service/product.service")
app.set('view engine', 'hbs'); // Establece el motor de plantillas a 'hbs'
app.set('views', "./src/views"); // Establece la ruta de las vistas
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Permite este origen
    methods: ['GET', 'POST']
  }
})



router.get("/", (req,res) => {
  const productos = productService.getProducts(0)
  return res.render("realtime", {productos})
})
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('add-product', (data) => {
    
      productService.addProduct(data)
      io.emit("get-product",productService.getProducts(0))
    });
    socket.on('delete-product', (data) => {

      productService.deleteProduct(data.id)
      io.emit("get-product",productService.getProducts(0))
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  
});
  
server.listen(3001, () =>{
  console.log("inicio del socket io")
})
  

module.exports = router