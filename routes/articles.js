//Aca van todas las rutas referidas al articulo.

const express = require('express')
const Article = require('../models/article')
const router = express.Router()

//Obtenemos Nuevo Articulo
router.get('/new', (req, res)=>{
    res.render('articles/new', {article: new Article()})
})

//obtenemos el articulo a editar
router.get('/edit/:id', async(req, res)=>{
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article})
})

//obtener el articulo x Slug
router.get('/:slug', async(req, res)=>{
    const article = await Article.findOne({slug: req.params.slug})
    if(article == null)res.redirect('/')
    res.render('articles/show', {article: article})
})

//crear nuevo articulo
router.post('/', async(req, res, next)=>{
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

//editar articulo x id
router.put('/:id', async(req, res, next)=>{
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

//eliminar articulo x id
router.delete('/:id', async(req, res)=>{
    await Article.findByIdAndDelete(req.params.id)
    //res.send('Articulo Eliminado')
    res.redirect('/')
})

//guardar articulo y redireccionar
function saveArticleAndRedirect(path){
    return async(req, res)=>{
        let article = req.article
        article.title = req.body.title
        article.author = req.body.author
        article.description = req.body.description
        article.markdown = req.body.markdown
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }catch (e){
            res.render(`articles/${path}`, {article: article})
        }
    }
}

module.exports = router;