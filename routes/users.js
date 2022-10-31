const express = require('express')
const User = require('../models/user')
const router = express.Router()

// aca definimos la URL que se accede en el navegador.
router.get('/new', (req, res)=>{ //Podemos usar lo que querramos, siempre y cuando escribamos lo mismo en el navegador. NO tiene nada que ver con los templates/html/etc
    res.render('users/new-user', {user: new User()}) // render = mostrar. aca definimos la ruta del HTML. O sea, la ruta de la vista (views). SE DEBE LLAMAR IGUAL
})

//creo un nuevo usuario
router.post('/', async(req, res, next)=>{
    req.user = new User() //usuario vacio
    next()
}, saveUserAndRedirect('new'))

//obtenemos el usuario nuevo
//esta ruta responde a un name dinamico
router.get('/:name', async(req, res)=>{
    const user = await User.findOne({name: req.params.name})
    if (user) {
        res.render('users/profile', {user : user})
    } else {
        res.render('users/error')
    }
})

//guardar usuario y redireccionar
function saveUserAndRedirect(path){
    return async(req, res)=>{
        let user = req.user //lleno el usuario vacio con todo esto
        user.name = req.body.name
        user.email = req.body.email
        user.password = req.body.password
        try{
            user = await user.save()
            res.redirect(`/users/${user.name}`)
        }catch (e){
            res.render(`users/${path}`)
        }
    }
}

module.exports = router;