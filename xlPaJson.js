/*
    Guarda Hojas XL en Json
*/

const nbLibro = process.argv[2]
const hoja    = process.argv[3]

if(nbLibro) {
    // Indicó el nombre del Libro XL

    const xl  = require("../rogLib/rogXL");
    const fs  = require("fs");
//    const ora = require("ora");

    function guardalo(hoja) {
        console.log("   ", hoja.nb)
       fs.writeFileSync (hoja.nb +".json", JSON.stringify(xl.lib.sheet_to_json(hoja.libro.wb.Sheets[hoja.nb])))
    }

    const libro = new xl.Libro(nbLibro)

//    const spinner = ora().start()
    try {

        if(hoja === undefined) {
            libro.recorre(guardalo)
        } else {
            guardalo(new Hoja(libro,hoja))
        }
    } catch(e) {
        console.error(e);
        console.log("sjlp");
    } finally {
        console.log("¡Listo el pollo!")
        // spinner.stop();
    }
} else {
    console.log("Tiene que indicar el nombre del Libro a convertir:");
    console.log("  xlPaJson << nbLibro >>");
}
