import express from 'express';
import routerProd from './routes/products.js'
import routerCart from './routes/cart.js'
import multer from 'multer'
import {engine} from 'express-handlebars'
import * as path from 'path'
//import {create} from 'express-handlebars' para trabajar con server más complejos.


//---------Path absolute---------
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
//--------------------------------

//------------multer ------------//
//const upload = multer({dest:'src/public/img'}) Esto es para imagenes sin formato 
const storage = multer.diskStorage ({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    }, 
    filename: (req, file, cb) => {
       
       cb(null, `${file.originalname}`)  
    }
}) 
const upload=multer({storage: storage})
//---------------------------------

const app = express();
const PORT = 8080;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.engine("handlebars", engine()) //esta linea configura handlebars
app.set("view engine", "handlebars") // esta define sobre que actua
app.set("views", path.resolve(__dirname, './views')) //o bien `${__dirname}/views`
// esta última app define la ruta dnd están los elementos.

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/product', routerProd)
app.use('/api/cart', routerCart)

app.get('/static', (req,res) => {
    res.render("home", {
        titulo: "Coder",
        mensaje: "Mundo"
    })
})

app.post('/upload', upload.single('product'), (req, res) =>{
    console.log(req.file)
    res.send("Imagen Cargada")
})

app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})
