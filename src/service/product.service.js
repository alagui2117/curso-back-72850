
const pathProducts = "./src/data/productos.json"
const fs = require('fs');
let productos = JSON.parse(fs.readFileSync(pathProducts)) || []


function initProducts(){
    let productAux = JSON.parse(fs.readFileSync(pathProducts))
    if (!productAux){
        productos = []
        return
    }
    productos = productAux
}
function getProducts(limit){
    if (!limit)
        return productos;
    return  productos.slice(0, limit)
}
function getProductsById(id){
    const product = productos.find(item => item.id == pid)
    return product;
}
function addProduct(data){
    if (!data.status){
        data.status = true
    }
    const id = generateId()
    data.id = id

    productos.push(data)
    saveFile(pathProducts, productos)
    return id;
   
}

function saveFile(pathProducts, productos){
    fs.writeFileSync(pathProducts, JSON.stringify(productos, null, 2))
}

function generateId(){
    console.log(productos)
    const productosOrdenados = productos.sort((a,b) => b.id - a.id)
    if (!productosOrdenados[0]){
        return 1
    }
    return productosOrdenados[0].id + 1 
}
function deleteProduct(id){
    const product = productos.find(item => item.id == id)
    if (!product){
        return null
    }
    productos = productos.filter(item => item.id != id)
    saveFile(pathProducts, productos)
    return product

}
module.exports = {
    getProducts,
    getProductsById,
    addProduct,
    deleteProduct
}