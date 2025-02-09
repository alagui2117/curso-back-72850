
const express = require('express')
const cors = require('cors');
const hbs = require("hbs");
const bodyParser = require('body-parser'); 
const productoController = require("./controllers/producto.controller")
const cartController = require("./controllers/cart.controller")
const viewController = require("./controllers/view.controller")
const productService = require("./service/product.service")
const port = 3000
const app = express();


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



router.get("/", (req,res) =>{
  const productos = productService.getProducts(0)
  return res.render("home", {productos})
})
app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})