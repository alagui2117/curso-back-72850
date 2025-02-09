
const express =require("express")
const router = express.Router()
const fs = require('fs');


const pathCarts = "./src/data/carritos.json"
let carts = JSON.parse(fs.readFileSync(pathCarts))
router.post("/:cid/product/:pid", (req, res ) => {

    const body = req.body
    const  listField = [
        "quantity",
    
    ]
    const error = validateFieldsInBody(body,listField)
    if (error) {
        res.json(error)
        return
    }
    const cid = req.params.cid
    const pid = req.params.pid
    if (!cid || !pid){
        return res.json({"error":"Faltan datos para reconocer el producto"})
    }
    const cart = carts.find(item => item.id == cid)
    if (!cart){
        return res.json({"error":"Carrito no existe"})
    }
    const productos = cart.products
    let product = productos.find(item => item.id == pid)
    if (!product){
        return res.json({"error":"Producto en el carrito no existe"})
    }
    
    if (product.quantity){
        product.quantity = product.quantity + body.quantity
    }else{
        product.quantity =  body.quantity
    }
    productos.forEach((item, i) => {
        if (item.id == pid){
            productos[i] = product;
            return;
        }
    })
    cart.products = productos
    saveFile(pathCarts, carts)
    res.json({cart: cart})
})
router.get("/:cid", (req, res ) => {
    
    const cid = req.params.cid
    

    res.json(carts.find(item => item.id == cid))
})

router.post("/", (req, res ) => {
    const body = req.body
    const  listField = []
    const error = validateFieldsInBody(body,listField)
    if (error) {
        res.json(error)
        return
    }

    const id = generateId()
    body.id = id

    carts.push(body)
    saveFile(pathCarts, carts)
    res.json({save: "OK", id: id})
})
function saveFile(pathCarts, carts){
    fs.writeFileSync(pathCarts, JSON.stringify(carts, null, 2))
}
function generateId(){
    const cartsOrdenados = carts.sort((a,b) => b.id - a.id)
    if (!cartsOrdenados[0]){
        return 1
    }
    return cartsOrdenados[0].id + 1 
}
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

module.exports = router