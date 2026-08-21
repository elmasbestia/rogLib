/**
* Permite consultas estadísticas sobre un archivo
*/

const colores = require("colors");

const nbArch = process.argv[2]

if(nbArch) {
    require("dotenv").config();
    const rogBD = require("./rogBD");

    const nbBD = process.argv[3]

    if(nbBD) {
        rogBD.abreBD(nbBD)
            .then(bd => {
                bd.lee(nbArch)
                    .then(mstArch)
                    .then(console.log)
            })
    } else {
        rogBD.carga(nbArch)
            .then(mstArch)
            .catch(err => {
                console.log("Gotcha".bgRed)
                console.error(err)
            })
    }
} else {
    console.log("Tiene que indicar el nombre del archivo a ser analizado:".bgRed);
    console.log("  QS << nbArchivo >> [<< bd >>]".bgWhite.black);
}

function mstArch(datos) {
    const QS = {};
    let cant = 0;
    let campos;

    datos.forEach(reg => {
        if(!cant) campos = Object.keys(reg);
        ++cant;

        campos.forEach(campo => {
            if(!QS[campo]) QS[campo] = {campo, vacios: 0, valores: {}};

            valor = reg[campo];
            if((valor) || (valor === 0)) {
                if(!QS[campo].valores[valor]) QS[campo].valores[valor] = 1;
                else QS[campo].valores[valor]++;
            } else QS[campo].vacios++;
        });
    });

    console.log(cant,"registros");

    mstQS(datos, nbArch, cant, QS);
}

function mstQS(datos, nbArch, cant, QS) {
    const express = require("express");
    const app     = express();
    const ejs     = require("ejs");

    // MIDLEWARE
    app.set("views",process.env.rogLib+"/vistas");
    app.set('view engine', 'ejs');

    
    app.use(".", express.static(process.cwd()));
    app.use("/lib/", express.static(process.env.rogLib));

    // RUTAS
    app.get("/", (req,res) => {
        res.render("mstQS", {cant, QS, titulo: nbArch});
    });

    app.get("/valores/:campo",(req,res) => {
        res.send(QS[req.params.campo]);
    });

    app.get("/valor", async (req,res) => {
        res.send(await filtrArch(datos,analFiltro(req.query)));
    });

    app.get("/archivos", (req,res) => {
        res.send()
    });

    app.get("/archivo/:arch", (req,res) => {

    });

    app.listen(3099, () => console.log(`Para ver las estadísticas, por favor ir a localhost:3099`));
}

function Extension(nbArchivo){
    var retorno = "";
    var pos = nbArchivo.lastIndexOf(".");

    if (pos >= 0) retorno = nbArchivo.slice(pos +1);
    if (retorno.startsWith("/")) retorno = "";

    return retorno.toLowerCase();
}

async function filtrArch(datos,filtro) {
    let retorno = [];
    try {
        retorno = datos.filter(filtro);        
    } catch (error) {
        retorno = {fallo: true, msj: error.message}
    } finally {
        return retorno;
    }
}

function analFiltro(query) {
    const que = Object.keys(query)[0];
    const valor = query[que];
    return reg => reg[que] == valor;
}
