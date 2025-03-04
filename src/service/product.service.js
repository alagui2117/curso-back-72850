
const pathProducts = "./src/data/productos.json"
const fs = require('fs');

const {Product} = require("../model/productModel")
const mongoose = require("mongoose");

function initProducts(){
    let productAux = JSON.parse(fs.readFileSync(pathProducts))
    if (!productAux){
        productos = []
        return
    }
    productos = productAux
}
async function getProductsWithParameters(limit, page, query,sort){

    const response ={
        status: "success",
        payload: [],
        totalPages : 0,
        prevPage : 0,
        nextPage : 0,
        hasPrevPage : false,
        hasNextPage : false,
        prevLink : null,
        nextLink : null
    }

    try {
        if (sort){
            if (sort === "asc"){
                sort ={price: 1}
            }
            if(sort === "desc"){
                sort = {price: -1}
            }
        }

        const filter = query ? {"category": query} : {}

        const totalProducts = await Product.countDocuments(filter)
        const totalPages = Math.ceil(totalProducts / limit)
        const numberPage = parseInt(page);
        response.totalPages = totalPages
        const prevPage = numberPage > 1 && totalPages !== 0 ? numberPage - 1 : null
        const nextPage = numberPage < response.totalPages ? numberPage + 1 : null
        response.prevPage = prevPage
        response.nextPage = nextPage
        response.hasPrevPage = !!prevPage
        response.hasNextPage = !!nextPage
        response.prevLink = prevPage ? `http://localhost:3000/api/products?limit=${limit}&page=${prevPage}` : null
        response.nextLink = nextPage ? `http://localhost:3000/api/products?limit=${limit}&page=${nextPage}` : null
        response.payload = await Product.find(filter).limit(limit).skip((page - 1) * limit).sort(sort).exec()
        return response;
    }catch (error) {
        console.log(error)
        response.status = "error";
        return response
    }



}
function getProducts(limit){
    if (!limit)
        return productos;
    return  productos.slice(0, limit)
}
async function getProductsById(id){
    return await Product.findById(new mongoose.Types.ObjectId(id)).exec();
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
    deleteProduct,
    getProductsWithParameters
}