/**
* Analiza la estructura de un archivo
*/

const colores = require("colors");

const tipoArch = process.argv[2]
const nbArch   = process.argv[3]

if(nbArch) {
    require("dotenv").config();
    const { abreBD } = require("./rogBD");

    mstArch(nbArch);

} else {
    console.log("Tiene que indicar el nombre del archivo a ser analizado:".bgRed);
    console.log("  QS << nbArchivo >>".bgWhite.black);
}

function mstArch(nbArch) {
    abreArch(nbArch)
    .then(datos => {

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

        mstQS(nbArch, cant, QS);

    }).catch(err => {
        console.log("Gotcha".bgRed)
        console.error(err)
    })
}

function mstQS(nbArch, cant, QS) {
    const express = require("express");
    const app     = express();
    const ejs     = require("ejs");

    // MIDLEWARE
    app.set("views",process.env.rogLib+"/vistas");
    app.set('view engine', 'ejs');

    
    app.use("/corr/", express.static(process.cwd()));
    app.use("/lib/", express.static(process.env.rogLib));

    // RUTAS
    app.get("/", (req,res) => {
        res.render("mstQS", {cant, QS, titulo: nbArch});
    });

    app.get("/valores/:campo",(req,res) => {
        res.send(QS[req.params.campo]);
    });

    app.get("/valor", async (req,res) => {
        res.send(await filtrArch(nbArch,analFiltro(req.query)));
    });

    app.get("/archivos", (req,res) => {
        res.send()
    });

    app.get("/archivo/:arch", (req,res) => {

    });

    app.listen(3099, () => console.log(`Para ver las estadísticas, por favor ir a localhost:3099`));
}

async function abreArch(nbArch) {
    const path = require("path");
    const ext = Extension(nbArch);

    if((!ext) || ext === "csv") {
        const parsero = require("./parsero");
        return parsero(path.join(process.cwd(), nbArch));
    } else if(ext === "json")
        return require(path.join(process.cwd(), nbArch));
    else if(ext.startsWith("xls"))
        return abreXL(path.join(process.cwd(), nbArch));
    else throw new Error(`No sé cómo trabajar con archivos de tipo "${ext}"`)
}

function Extension(nbArchivo){
    var retorno = "";
    var pos = nbArchivo.lastIndexOf(".");

    if (pos >= 0) retorno = nbArchivo.slice(pos +1);
    if (retorno.startsWith("/")) retorno = "";

    return retorno.toLowerCase();
}

async function filtrArch(nbArch,filtro) {
    let retorno = [];
    try {
        let datos = await abreArch(nbArch);
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

function abreXL(nbArch) {
    const XL = require("js-xlsx");
    const libro = XL.readFile(nbArch);

    hoja = XL.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]])

    return hoja
}