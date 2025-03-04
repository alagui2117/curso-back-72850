


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

    socket.on('add-product', (data) => {

        const  listField = [
            "title",
            "code",
            "price",
            "stock",
            "category"
        ]

        const error = validateFieldsInBody(data,listField)
        if (error) {
            io.emit("error-add-product", error)
            return
        }
      productService.addProduct(data)
      io.emit("get-product",productService.getProducts(0))
    });
    socket.on('delete-product', (data) => {

      productService.deleteProduct(data.id)
      io.emit("get-product",productService.getProducts(0))
    });
    socket.on('disconnect', () => {

    });
  
});

function validateFieldsInBody(body, listFields){

    let error;
    listFields.forEach(element => {

        if (!(element in body) || body[element] == ""){

            error =  {"error": `Falta el campo o no debe ser vacio ${element}`}
            return
        }

    });
    return error;
}
  
server.listen(3001, () =>{
})
  

module.exports = router