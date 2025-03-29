const fs = require('fs');

if(process.argv[2] && process.argv[3]) {
    fs.readdir(process.argv[2], function (err, archivos) {
        if (err) {
            console.error(err);
        } else {
            console.log(archivos.length, "archivos")
            fs.writeFile( nbArch(process.argv[3]), lista(process.argv[2],archivos),err => console.log(err))
        }
    });
} else {
    console.log("directorio, nb archivo")
}

function nbArch(nb) {
    return nb +".json";
}

function lista(directorio, archs) {
    return JSON.stringify({
        directorio,
        fotos: archs.map(x => ({imagen: x}))
    })
}