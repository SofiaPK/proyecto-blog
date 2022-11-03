const mongoose = require('mongoose');
const { marked } = require('marked');

//*SLUG = Lo que viene desp de nuestro dominio, por ej: https://midominio.com/SLUG y se refiere a una pagina o publicacion especifica
const slugify = require('slugify');

//dompurify sirve para desinfectar un fragmento de html, eliminando cargas utiles XSS (cross site scripting)
const creatDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');
//dompurify es una herramienta que nos permite recrear un DOM en un servidor/entorno en el cual no contamos con un navegador/DOM
const dompurify = creatDOMPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        author: {
            type: String,
            require: true
        },
        description: {
            type: String
        },
        markdown: {
            type: String,
            require: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        slug: {
            type: String,
            require: true,
            // unique construye indices unicos pero no es una validacion
            unique: true
        },
        //para cuidar nuestro HTML de codigo malicioso
        sanitizedhtml: {
            type: String,
            require: true
        }
    },
    { versionKey: false}
)

//aca ponemos un middleware, el cual en mongoose se escribre asi .pre()
articleSchema.pre('validate', function(next){
    if(this.title){
        //con lower lo convertimos en minuscula, con strict eliminamos los caracteres especiales
        this.slug = slugify(this.title, {lower: true, strict: true})
    }
    if(this.markdown){
        //lo que hacemos es convertir nuestro documento HTML y luego limpiar ese documento que le pasamos y se deshace de cualquier codigo malicioso
        this.sanitizedhtml = dompurify.sanitize(marked(this.markdown))
    }
    //next para que no bloquee
    next();
});

module.exports = mongoose.model("Article", articleSchema)