/*
    Abre la BD de AUtenticación
*/

require('dotenv').config();

const rogBD      = require(process.env.rogLib+"/rogBD.js");

module.exports.abreAuth = async function () {
    let retorno = { fallo: true, msj: "No sé decirte qué pasó", }

    try {
        retorno = await rogBD.abreBD("Auth");
        if(retorno.fallo) throw retorno;        
    } catch (error) {
        retorno.msj = error.message;
    } finally {
        return retorno;
    }
}
//bdAuth  = "{"dbms": "pg", "txt": "BD de Autenticación",    "prms": {"host": "10.46.1.93", "database": "minpptrassi","port": 5432, "user": "postgres", "password": "postgres"}}"
