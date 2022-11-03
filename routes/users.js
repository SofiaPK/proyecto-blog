const express = require('express')
const User = require('../models/user')
const router = express.Router()

// aca definimos la URL que se accede en el navegador.
router.get('/new', (req, res)=>{ //Podemos usar lo que querramos, siempre y cuando escribamos lo mismo en el navegador. NO tiene nada que ver con los templates/html/etc
    res.render('users/new-user') // render = mostrar. aca definimos la ruta del HTML. O sea, la ruta de la vista (views). SE DEBE LLAMAR IGUAL
})//users/new-user es un html, es una direccion a mis views

//defino la URL /login
router.get('/login', (req, res)=>{
    res.render('users/login')
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

/*obtener los datos (email y contraseña) del usuario para mantenerlo activo en la sesion,
validarlos: buscar al usuario por el email y la contraseña que me da y verificar si existe
si no existe: devuelvo un error.

si sí existe: 
guardo al usuario en req.user y redirecciono a la home

*/
router.post('/login', async (req, res, next)=>{
    const user = await User.findOne({email: req.body.email, password: req.body.password})
    if (!user){
       res.redirect('login')
    }else{
        req.session.user = user //aca utilizo express-session para guardar la sesion del usuario
        res.render('users/profile', {user : user})
    }
    next()
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