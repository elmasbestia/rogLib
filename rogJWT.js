/*
	Uso:
	En un servidor Express:

	1. Declaración:
		const autentica = require(roglib/rogJWT)
    2. Datos de control:
	3. Uso:
		app.xxx(ruta, autentica, funcion)
*/

const PRUEBAS = process.env.jwtPRUEBAS;
const MUESTRA = process.env.jwtMUESTRA; // Si falso: muestra los mensajes

const FIJOS   = (req,res,next) => ({
    "GET/chequeo":        () => res.send(`${process.env.nbApi} escuchando fuerte y claro`),
    "GET/reset":          () => reset(req,res),
    "GET/identifica":     () => mstIdentifica(req,res),
    "POST/identifica":    () => procesaIdentifica(req,res),
    "GET/sesion/bloquea": () => res.clearCookie("token").send({fino: true}),
    "GET/sesion/cierra":  () => res.clearCookie("token").send({fino: true})
});

const jwt      = require("jsonwebtoken");
const abreAuth = require("./abreAuth").abreAuth;
const md5      = require("md5");
/**
 * Manejo de Usuarios
 */
const usrs = defUsrs(`${process.cwd()}/Apoyo/${process.env.aliasApi}.json`);

let bd;

abreAuth()
    .then(x => bd = x)
    .catch(console.error);

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports.autoriza = (req,res,next) => {
    console.log("AUTORIZA")
    console.log(`${req.method} ${req.url}`)

    const fijo = FIJOS(req,res,next)[req.method+req.url];
    if(fijo) fijo();
    else {
        console.log("Aquí se autentica to'el mundo");

        if(PRUEBAS) {
            req.usr = usrs.usr(5611943);
            return next();
        }
        
        autentica(req,res, next)
    }
}

const autentica = function (req,res,next) {
    console.assert(MUESTRA,"A U T E N T I C A")

    const token = req.cookies.token;
    if(token) {
        try {
            const verificado = jwt.verify(token,process.env.secreto);
            
            if(verificado) {
                req.usr = usrs.usr(verificado);
                debugger
                next();
            } else res.status(401).send(respuestaError(401,"Identificación Inválida"));
        } catch (err) {
            res.status(400).send(respuestaError(400,"Identificación Inválida"));
        }
    }  else mstIdentifica(req,res);
}

const identifica = async function (cedula,clave) {
    console.assert(MUESTRA,"I D E N T I F I C A")

    let retorno = respuestaError(400, "¿Qué pasó?")
    
    function llave(cedula) {
        return `SELECT * FROM sesion WHERE personales_cedula = '${cedula}' and nenabled = 1`
    }

    try {
        let datos = await bd.lee(llave(cedula));
        if(datos.fallo) retorno = datos; 
        else if(datos.length) {
            if (datos[0].clave === md5(clave)) {
                // Busca el usuario
                const usr = await bsqUsr(cedula)
                if(usr.fallo) {
                    retorno = usr;
                } else retorno = {
                    usr,
                    token: jwt.sign(cedula, process.env.secreto)
                }
            } else {
                retorno.campo = "clave";
                retorno.msj = "Por favor, revise la contraseña";
            }
        } else {
            retorno.msj = `¡No conozco la Cédula ${cedula}!`;
            retorno.campo = "cedula";
        }
    } catch (err) {
        console.error(err);
        retorno.fallo = true;
        retorno.msj = err.message;
    } finally {
        console.assert(MUESTRA,"retorno")
        console.assert(MUESTRA, retorno);

        return retorno;
    }
}

function respuestaError(status, msj = msjAuth(status), campo) {
    return { 
        fallo: true, 
        msj: msj, 
        status,
        campo 
    }
}

function msjsAuth(status) {
    return {
          0: "No puedo comunicarme con la B.D.",
        401: "¡Acceso denegado!",
        491: "¡No se ha identificado!",
        492: "Debe volver a identificarse",
        493: "¡No está autorizad@ a realizar esa acción!"
    }[status]
}

function bsqUsr(cedula) {
    let usr = usrs.usr(cedula)
    return usr ? usr : respuestaError(404, `Cédula ${cedula} no encontrada en el registro de Usuarios`,"cedula");
}

function esPreflight(req) {
	return req.method === "OPTIONS" &&
		req.headers("origin") &&
		req.headers("access-control-request-method");
}
    
function ip(req) {
    return req.header('x-forwarded-for') || req.connection.remoteAddress;
}
/**
 * Lee los datos de Usuarios y opciones de la API
 * @param {string} nbArchivo nombre del archivo que contiene los datos
 * @returns {object} controlador de Usuarios
 */
function defUsrs (nbArchivo) {
    const {opciones, usrs, iconos} = require(nbArchivo);

    if(iconos) Object.entries(iconos).forEach(([que, valor]) => opciones.find(x => x.opc === que).icono = valor)

    const Usrs = require(process.cwd()+"/"+process.env.trabajo+"modelos/Usrs")
    return new Usrs.Usrs(opciones,usrs)
}
/**
 * 
 * @param {object} usr Datos del Usuario
 * @returns url de la ruta "principal" de un usuario
 */
module.exports.opcionPpal = function(usr) {
    return `/${usrs.opcionPpal(usr)}`;
}; 

module.exports.manejaPreflight = (req,res,next) => {
    // Hay que frenar los orígenes raros
    if(esPreflight(req)) {
        console.log("Preflight", req._parsedUrl.url)
        res.set('Access-Control-Allow-Origin', req._parsedUrl.url);
        res.set('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE');
        res.status(204).end();
    } else next();
}

// Planilla de Identificación

const mstIdentifica = (req,res) => {
    res.render(process.cwd()+"/"+process.env.trabajo+"vistas/identifica",{error: req.retorno || {}, proximo: req.url === "/identifica" ? "/" : req.url})
}

async function procesaIdentifica (req,res,next) {
    let retorno = await identifica(req.body.cedula,req.body.clave);
    if(retorno.fallo) res.send(retorno);
    else {
        res.cookie("token",retorno.token, {sameSite: 'strict'}).send({usr: retorno.usr});
    }
}

function reset(req,res,next) {
    require('dotenv').config();
    res.send(`${process.env.nbApi} fue reseteado.`);
}

module.exports.autentica = autentica;
