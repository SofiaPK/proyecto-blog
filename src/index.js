//Express nos permite crear el servidor
const express = require('express')
//Mongoose nos sirve para la database
const mongoose = require('mongoose')
require('dotenv').config()
const Article = require('../models/article')
const methodOverride = require('method-override')
const app = express()
const articleRouter = require('../routes/articles')
const userRouter = require('../routes/users')
const port = process.env.PORT || 3000

//todas nuestras views van a ser escritas en ejs, view engine convierte el codigo ejs en HTML
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
//todo lo que es override se utiliza con el nombre como '_method'

//Ruta Principal Home
// la '/' es nuestra main-route 
app.get('/', async(req, res)=>{
//    res.send('Proyecto')
    const articles = await Article.find().sort({
        createdAt: "desc"
    });
    //render accede a la carpeta views/articles, se le pasa la ruta que queremos (en este caso es index)
    res.render('articles/index', {articles: articles})
})

// MongoDB Collection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch((err) => console.error(err));


// definicion base de rutas
app.use('/articles', articleRouter) //por cada /articles va una ruta
app.use('/users', userRouter) //por cada /users va otra ruta

// configuracion que permite leer todo lo que está en la carpeta /public
app.use(express.static("public"));

app.listen(port, 
    ()=> console.log(`Server escuchando en puerto ${port}`)
);
