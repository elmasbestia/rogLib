/*
	Utilitario para carga de archivos en el servidor

Uso:
Creación de la función de carga:
	const carga   = require("../rogLib/rogSvrCarga").carga((req,file,name) =>  nombre del archivo a ser cargado));
Llamada:
	app.post("/arch/:dir",carga);

Parámetros de la función de Carga:
	file:
	Objeto File {
	  _events: [Object: null prototype] {},
	  _eventsCount: 0,
	  _maxListeners: undefined,
	  size: 0,
	  path: '/tmp/upload_68225cdb18bdac3a03b28c63ccc0a7a1',
	  name: 'toolBelt.jpg',
	  type: 'image/jpeg',
	  hash: null,
	  lastModifiedDate: null,
	  _writeStream: null,
	  [Symbol(kCapture)]: false
	}
	name:
	nombre del campo en la planilla a ser cargada

*/

const ext = require("./rogNodeLib").Extension;
const path = require("path");

exports.carga = (renombre) => function(req,res) {
    let cargados = {};

    var forma = new require("formidable").IncomingForm();

    forma.parse(req, (err, fields, files) => {
        if(err) {
            console.log("¡ERROR!");
            console.dir({err, fields,files});
            objMsj(cargados,"Error",err);    
        } else console.dir(files);
    }).on('fileBegin', (name, file) => {
        file.path = renombre(req,file,name);
    }).on('file', (name, file) => {
        objMsj(cargados,name,file);
    }).on("error", err => {
        console.log("¡Error!");
        console.log(err);
        objMsj(cargados,"error",err);
    }).on('end', () => {
        res.send(cargados);
    });
}

function objMsj(obj,id,msj) {
    /*
        Constructor de mensajes
        Crea un objeto cuyos elementos pueden contener valores 
        o arreglos de valores
    */
    if(obj[id]) {
        if(obj[id] instanceof Array) obj[id].push(msj);
        else obj[id] = [obj[id], msj];
    } else obj[id] = msj;
}

/*
    var fields = {}, files = {};
    this
      .on('field', function(name, value) {
        fields[name] = value;
      })
      .on('file', function(name, file) {
        files[name] = file;
      })
      .on('error', function(err) {
        cb(err, fields, files);
      })
      .on('end', function() {
        cb(null, fields, files);
      });

*/