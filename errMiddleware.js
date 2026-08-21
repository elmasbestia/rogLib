/*
    Manejo genérico de Errores
*/

module.exports = (err, req, res, next) => {
    res.status(err.status || res.statusCode || 500);

    console.log("WTF?")
    console.log(err)

    res.send({
        fallo: true,
        msj: typeof err === "string" ? err : err.message || err.msj,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}
