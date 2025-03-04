const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser'); 
const productoController = require("./controllers/producto.controller")
const cartController = require("./controllers/cart.controller")
const viewController = require("./controllers/view.controller")
const productService = require("./service/product.service")
const mongoose = require("mongoose");
const {Cart} = require("./model/cartModel");
const hbs = require('hbs');
const port = 3000
const app = express();

hbs.registerHelper("json", function (context) {
    return JSON.stringify(context);
})


app.set("view engine", "hbs")
app.set("views","./src/views")




app.use(express.json());
app.use(cors());
app.use("/api/products",productoController)
app.use("/api/carts",cartController)
app.use("/realtimeproducts",viewController)
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router()



router.get("/", async (req,res) =>{

  const limit = req.query.limit  ? req.query.limit : 10
  const page = req.query.page ? req.query.page : 1
  const query = req.query.query ? req.query.query : null
  const sort =  req.query.sort ? req.query.sort : {}
  const productLimit = await productService.getProductsWithParameters(limit, page, query, sort)
  return res.render("home", {data: productLimit})
})

router.get("/products/:pid", async (req,res) =>{

  const pid = req.params.pid.trim();
  if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.json({"error": "producto_no_encontrado"})
  }
  const productLimit = await productService.getProductsById(pid)
  return res.render("detail", {data: productLimit})
})
router.get("/carts/:pid", async (req,res) =>{

  const pid = req.params.pid.trim();
  console.log(pid)
  if(!pid) {
    return res.json({"error": "Carrito no encontrado"})

  }
  const cart = await getCartById(pid)
  if (!cart) {
    return res.json({"error": "Carrito no encontrado"})
  }
  //const productLimit = await productService.getProductsById(pid)
  return res.render("cart", {data: cart.products})
})
app.use(router)
app.get('/favicon.ico', (req, res) => res.status(204).end());
try {
  mongoose.connect(
      "mongodb+srv://devsis2330:WO4mKu9JatyUcuqm@coder.tyfjv.mongodb.net/coder?retryWrites=true&w=majority"
  ).then(() => {
    console.log("conectado a mongo")
    app.listen(port, () => {

      console.log(`Inventarios app listening on port ${port}`)
    })
  })

}catch (err){
  console.error(err)
  process.exit(1)
}


async function getCartById(id) {

  return await Cart.findOne({id: parseInt(id)}).populate('products.product').exec();
}