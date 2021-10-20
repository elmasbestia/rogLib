/*
    Carga masiva de Json a Mongo
*/

const json  = {
    nb: process.argv[2],
}

const mongo = {
    nb: process.argv[3],
    nbTabla: process.argv[4]
}

require('dotenv').config();

const rogBD = require("./rogBD");

if(json.nb) {
    json.datos = require(json.nb+".json");

    const ora = require("ora");
    const spinner = ora().start();

    rogBD.abreBD("Inv")
        .then(async bd => {
            resultado = await bd.carga(mongo.nbTabla || json.nb, json.datos);
            console.dir(resultado);
        }).catch(console.error);
} else {
    console.group("Tiene que indicar el nombre del archivo a cargar:");
    console.log("  mngCargaMasiva << nbJson >> << nb BD en .env >> << nb de la Tabla en Mongo >>");
    console.log("Por omisión, el nombre de la tabla es el mismo del json.");
}
