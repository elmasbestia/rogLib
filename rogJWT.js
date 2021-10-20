/*

	Uso:
	En un servidor Express:

	1. Declaración:
		const autentica = require(roglib/rogJWT)
	2. Uso:
		app.xxx(ruta, autentica, funcion)
*/

const jwt = require("jsonwebtoken");

function auth(req,res,next) {
	const token = req.header('auth-token');

	if(!token) return res.status(401).send('Access denied');

	try {
		const verificado = jwt.verify(token,process.env.secreto);
		req.user = verificado;
		next();
	} catch (err) {
		res.status(400).send("Identificación Inválida");
	} 
}

function conectarse(usr,pwd) {}

