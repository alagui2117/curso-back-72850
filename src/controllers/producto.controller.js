
const express =require("express")
const router = express.Router()
const fs = require('fs');

const pathProducts = "./src/data/productos.json"
let productos = JSON.parse(fs.readFileSync(pathProducts))
router.get("/", (req, res ) => {

    const limit = req.query.limit ? req.query.limit : productos.length
    const arregloLimitado = productos.slice(0, limit)

    res.json(arregloLimitado)
})
router.get("/:pid", (req, res ) => {
    
    const pid = req.params.pid
    productos.find(item => item.id == pid)

    res.json(productos.find(item => item.id == pid))
})

router.post("/", (req, res ) => {
    const body = req.body
    const  listField = [
        "title",
        "code",
        "price",
        "stock",
        "category"
    ]
    const error = validateFieldsInBody(body,listField)
    if (error) {
        res.json(error)
        return
    }
    if (!body.status){
        body.status = true
    }
    const id = generateId()
    body.id = id

    productos.push(body)
    saveFile(pathProducts, productos)
    res.json({save: "OK", id: id})
})

router.put("/:pid", (req, res ) => {
    
    const pid = req.params.pid
    const body = req.body   
    if (!pid){
        res.json({"error":"id necesario para actualizar"})
    }
    const  listField = [
        "title",
        "code",
        "price",
        "stock",
        "category"
    ]
    const error = validateFieldsInBody(body,listField)
    if (error) {
        res.json(error)
        return
    }
    if (!body.status){
        body.status = true
    }

    let product = productos.find(item => item.id == pid)
    if (!product){
        res.json({"error":"producto inexistente"})
        return;
    }
    product = body
    product.id = parseInt(pid)
    productos.forEach((item, i) => {
        if (item.id == pid){
            productos[i] = product;
            return;
        }
    })
    saveFile(pathProducts, productos)
    res.json({"update":"OK"})
})

router.delete("/:pid", (req, res ) => {
    
    const pid = req.params.pid

    if (!pid){
        res.json({"error":"id necesario para actualizar"})
    }
    const product = productos.find(item => item.id == pid)
    if (!product){
        res.json({"error":"producto inexistente"})
        return;
    }
    productos = productos.filter(item => item.id != pid)
    saveFile(pathProducts, productos)
    res.json({"delete":"OK", producto: product})
})

function saveFile(pathProducts, productos){
    fs.writeFileSync(pathProducts, JSON.stringify(productos, null, 2))
}

function generateId(){
    const productosOrdenados = productos.sort((a,b) => b.id - a.id)
    if (!productosOrdenados[0]){
        return 1
    }
    return productosOrdenados[0].id + 1 
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