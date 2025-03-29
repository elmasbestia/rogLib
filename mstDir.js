const logger       = require('morgan');
const fs = require("fs");
const path = require("path");
const colores = require("colors");

const nbDir = process.argv[2];
const hoy = new Date();
const msxdia = 1000 * 60 * 60 * 24

const lapsos = {
    hoy: 1,
    ayer: 2,
    "Esta semana": 7,
    "Este mes": 30,
    "Mas de un mes": 365
}

const calcLapso = (dias) => {
    let retorno = Object.entries(lapsos).find(([lapso, limite]) => dias < limite)
    return retorno ? retorno[0] : "Mas de un año";
}

const calcDias = (fecha) => {
    return Math.floor((hoy -fecha)/msxdia)
}

// fmt.format(calcDias(mtime), "days")

/*
nbsi = ".env"
nbno = "Qsy.txt"

console.log("Taima:".bgCyan.white)
console.log(nbsi.bgCyan.white)
console.log(existe(nbsi))
console.log(nbno.bgCyan.white)
console.log(existe(nbno))
*/

if(nbDir) {
    require("dotenv").config();

    // console.table(recorreDir(nbDir))
    mstLapsos(recorreDir(nbDir, fLapsos), nbDir);

} else {
    console.log("Tiene que indicar el nombre de la carpeta a ser analizada:".bgRed);
    console.log("  mstDir << nbCarpeta >>".bgWhite.black);
}

function recorreDir(nbDir, f) {
    nbCompleto = (a) => path.join(nbDir,a)
    const fmt = new Intl.RelativeTimeFormat()
    return fs.readdirSync(nbDir).reduce(f,[])
}

function fLapsos (retorno, a) {
    const nb = nbCompleto(a)
    const stat = fs.statSync(nb)
    const fecha = stat.mtime
    const dias = calcDias(fecha)
    if(stat.isDirectory()) {
        retorno = retorno.concat(recorreDir(nb,fLapsos))
    } else retorno.push({nbDir, a, fecha, dias, lapso: calcLapso(calcDias(fecha))})
    return retorno
}

function mstLapsos(datos,nbDir) {
    const express = require("express");
    const app     = express();
    const ejs     = require("ejs");

    // MIDLEWARE
    app.set("views",process.env.rogLib+"/vistas");
    app.set('view engine', 'ejs');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}))

    app.use("/lib/", express.static(process.env.rogLib));

    // RUTAS
    app.get("/", (req,res) => {
        res.render("mstDir", {datos, titulo: nbDir});
    });

    app.get("/lapso/:lapso", (req,res) => {
        const lapso = req.params.lapso;
        res.send(datos.filter(x => x.lapso === lapso));
    });

    app.get("/dir", (req,res) => {
        nbDir = req.query.dir
        datos = recorreDir(nbDir)
        res.send({datos,titulo})
    });

    app.listen(3099, () => console.log(`Para ver las estadísticas, por favor ir a localhost:3099`));
}
