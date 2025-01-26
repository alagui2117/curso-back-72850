
const express = require('express')
const cors = require('cors');
const app = express();
const productoController = require("./controllers/producto.controller")
const cartController = require("./controllers/cart.controller")
const port = 3000

app.use(express.json());
app.use(cors());
app.use("/api/products",productoController)
app.use("/api/carts",cartController)




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})