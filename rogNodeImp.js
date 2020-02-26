// Módulo de Impresión para Node

var   impr;
const rogLib     = require("./rogNodeLib");

async function imprime(texto) {
    let hora    = new Date();
    let nbRep   = rogLib.nbSerial("Asist_");
    let retorno = nbRep;

    if(!impr) {
       impr = require("./rogImpr.json");
       impr.pdf = require('html-pdf');
    }

/*  
        VERSIÓN CON AWAIT, QUE NO SIRVE
        (Callback is not a function)
    try {
        let objImpr = await impr.pdf.create(
            impr.cabecera+
            (typeof texto === "string" ? texto : texto.texto)+
            impr.pie,
            impr.prms
        ).toFile('./'+nbRep+'.pdf');
        retorno = salida.fileName;
    } catch (err) {
        console.log(err);
        retorno = { fallo: true, msj: err.message }
    } finally {
        console.log("1. Sale de Imprime")
        res.send(retorno)        
    }
*/
    
    impr.pdf.create(
        impr.cabecera+
        (typeof texto === "string" ? texto : texto.texto)+
        impr.pie,
        impr.prms
    ).toFile('./'+nbRep+'.pdf', (err, salida) => {
        if(err) retorno = { fallo: true, msj: err.message };

            /*
                res.download(salida.filename,nbRep,(err) => {
                    if(err) console.log(err);
                })
            */

        retorno = salida.filename;

            //rogLib.otraVnt(salida.fileName);
            //res.send({});
    })
    return retorno;
}

exports.imprime = imprime;