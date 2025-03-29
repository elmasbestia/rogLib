// Rafa Gómez
// Librería para manipular Bases de Datos

const MUESTRA = false;  // Si "false" muestra mensajes de nivel "normal"
const DEEPER  = true;   // Si "false" muestra mensajes más detallados
console.assert(MUESTRA,"rogBD:", "Se muestran mensajes")

const rogFiltra = require("./rogNodeLib").rogFiltra;
const { assert } = require("console");
const path      = require("path");
const { desarma } = require("./rogNodeLib");

let ObjectID;

async function leeDatos(datos) {
    let retorno = datos;
    if(typeof datos === "string") retorno = await cargaArch(datos);

    return retorno;
}

function nbSql(txt) {
    return txt.split(" ").length === 1 ?
        txt = "SELECT * FROM " +txt :
        txt
}

function qrySQL(query) {
    function cadena(que, valor) {
      return desarma(que)
        .map((x) => `${x} LIKE '%${valor}%'`)
        .join(" OR ");
    }
  
    function operador(que) {
      let retorno = {
        gt: ">",
        gte: ">=",
        lte: "<=",
        lt: "<"
      }[que];
      return retorno || que + " = ";
    }
  
    const campos = Object.keys(query);
    let retorno = "";
  
    if (campos.length) {
      if (campos.length === 1) {
        retorno = `${operador(campos[0])}  ${entreComillas(
          query[campos[0]],
          true
        )}`;
      } else if (campos.length === 2) {
        if (campos[0] === "gte" && campos[1] === "lte")
          retorno = `BETWEEN ${entreComillas(
            query[campos[0]],
            true
          )} AND ${entreComillas(query[campos[1]], true)}`;
        else {
          if (campos[0] === "bsq")
            retorno = cadena(query[campos[0]], query[campos[1]]);
          else
            retorno = campos
              .map((x) => `${operador(x)} '%${query[x]}%'`)
              .join(" AND ");
        }
      } else retorno = "Ya va (+2)";
    }
    return retorno;
}
  
class pgBD {
    constructor(bd) {
        console.assert(DEEPER,"BD:",bd)
        this.bd = bd;    
    }

    async cuentaRegs(tabla) {
        let retorno = -1;
        const resultado = await pgSql(this.bd,`Select count(*) as cant from ${tabla}`);

        console.assert(DEEPER,resultado)

        if(resultado.fallo) console.error(resultado.msj);
        else retorno = resultado.rows.cant;

        return retorno;
    }

    async lee(txtSql,query = {}) {
        assert(MUESTRA,txtSql)
        assert(MUESTRA,query)
        
        let retorno = rogError("Se encabritó en lee");
        try {
            if(txtSql.split(" ").length === 1) {
                txtSql = "SELECT * FROM " +txtSql;
            }

            retorno = await pgSql(this.bd,agregaQuery(txtSql,query));

        } catch (e) {
            console.log("¡Error en lee!");
            console.error(e);
            retorno = rogError(e.message);
        } finally {
            return retorno.fallo ? retorno : retorno.rows;
        }
    }
    
    async agrega(txtSql) {
        return pgSql(this.bd,txtSql)
    }

    async carga(tabla,datos) {
        /*
            @param tabla    nombre de la tabla a recibir los datos
            @param datos    arreglo con los datos a cargar o nombre del archivo con los datos
        */
        let resultados = [];
        let cant = 0;
        let n = 0;

        try {
            const _datos = await leeDatos(datos);

            if(_datos.fallo) resultados.push(_datos);
            else {
                n = _datos.length;
                console.group(`Vamos a Grabar ${n} registros en ${tabla}`)

                console.log(`Comenzamos con ${await this.cuentaRegs(tabla)}`);

                // const campos = lstCampos(datos[0]); Cada reg. puede ser distinto
                for(let x = 0; x < n; x++) {
                    let resultado = await pgSql(this.bd,sqlInsert(tabla,_datos[x],lstCampos(_datos[x])));
                    if (resultado.fallo) {
                        resultados.push(resultado);
                        console.dir(resultado)
                    } else cant++;
                    console.assert(MUESTRA,x, cant)
                };
            }
        } catch (e) {
            console.log(e);
        } finally {
            console.groupEnd(`Terminamos con ${await this.cuentaRegs(tabla)}`);

            let retorno = { msj: `grabó ${cant}`, cant, total: n, resultados}

            if((cant != resultados.length) || resultados.some(x => x.fallo)) {
                retorno.msj = "No grabó ningún registro";
                retorno = rogError(retorno);
            }

            return retorno;
        }
    }

    async modifica(txtSql) {
        return pgSql(this.bd,txtSql)
    }
    
    async elimina(txtSql) {
        let retorno = await pgSql(this.bd,txtSql);
        if(!retorno.fallo) retorno = {eliminados: rowCount};

        return retorno;
    }
    
    async ejecuta(txtSql,tabla,campos) {
        return pgSql(this.bd,traduceSQL(txtSql,tabla,campos))
    }
    
    async cierra() {
        await this.bd.end();
    }

    get metodos() {
        return {
            lee: this.lee, 
            agrega: this.agrega,
            modifica: this.modifica,
            elimina: this.elimina,
            cierra: this.cierra,
            ejecuta: this.ejecuta,
            carga: this.carga
        }
    }
}

function abrePg (prms) {
    function txtConexion (prms) {
		return `postgressql://${prms.user}:${prms.password}@${prms.host}:${prms.port}/${prms.database}`;
	} 	

//    const cliente = new Cliente({connectionString: txtConexion(prms)});
/*
{
	  user:     prms.user,
	  host:     prms.host, 
	  database: prms.database,
	  password: prms.password,
	  port:     prms.port,
	}
*/

	const { Pool: Cliente } = require('pg')
	const cliente = new Cliente (prms)

    return new Promise((si, no) => si(cliente))
}

function abreJson(prms) {
    let _datos = [];

    function objeta(arr) {
        return arr.reduce((obj,x) => {
            obj[x.alias] = x;
            return obj;
        }, {});
    }

    return new Promise((resolve,reject) => {
        try {
            const _datos = prms.nb ?
                Array.isArray(prms.nb) ?
                    prms.nb.map(x => cargaTabla(x,prms.dir)) :
                    [cargaTabla(prms.nb,prms.dir)]
            : [];

            console.log(`Salió de cargaTabla con ${_datos.length} Tablas leídas`)

            resolve({dir: prms.dir, Datos: objeta(_datos)});
        } catch (e) {
            reject(e);
        }
    })
}

function abreMongo(prms) {
    const { MongoClient: cliente, ObjectId: _ObjectID } = require('mongodb');

    ObjectID = _ObjectID;
    /**
     * Deprecados, asegun:
            {
                useNewUrlParser: true, useUnifiedTopology: true
            }
     */
    return new Promise((resolve,reject) =>
        cliente.connect(
            prms.url
        ).then(cliente => resolve(cliente.db(prms.nb))
        ).catch(reject)
    )
}

function abreMySql(prms) {
    const mysql = require('mysql');

    const con = mysql.createConnection({
        host: prms.host,
        user: prms.user,
        password: prms.password
    });

    return con.connect();
}

class mongoBD {
    constructor(bd) {
        this.bd = bd;    
    }

    getClave(_id) {
        return ObjectID(_id);   
    }
    
    tab(tabla) {
        return this.bd.collection(tabla)
    }
    
    async lee(tabla,opciones,fn) {
        let retorno = "Un cazzo!"
        function getClave(opciones) {
            let retorno;
            ["id", "_id"].forEach(x => {
                if(opciones.hasOwnProperty(x)) retorno = x;
            });
            return retorno;
        }

        try {
            const _clave = getClave(opciones);
            const _query = _clave ? {_id: this.getClave(opciones[_clave])} : opciones;
            retorno = await this.tab(tabla).find(_query);
            retorno = await retorno.toArray();
        } catch(e) {
            console.error(e);
            retorno = rogError(e);
        } finally {
            return retorno;
        }

    }
    
    async aggr(tabla,condiciones,fn) {
        return await this.acomoda(this.tab(tabla).aggregate(this.opcAgg(condiciones)),fn);
    }
    
    async agrega(tabla,buffer,fn) {
        console.log("Agrega Buffer:")
        console.log(buffer)
        
        try {
            let retorno = await this.tab(tabla).insertOne(buffer);
            return retorno;
        } catch (error) {
            throw new Error(error);            
        }
    }
    
    async modifica(tabla,buffer) {
        let bofe = Object.assign(buffer)
        let id = bofe._id
        delete bofe._id
        
        let retorno = await this.tab(tabla).findOneAndReplace(
            {_id: id},
            bofe,
            {
                returnOriginal: false
            }
        );

        return retorno.value
    }
    
    async elimina(tabla,id) {
        if(this.eliminar[tabla]) this.eliminar[tabla](query);
        else this(tabla).deleteMany(query);
    }
    
    async carga(tabla,datos,fn) {
        console.log(datos.length,"registros");
        
        let retorno = await this.tab(tabla).insertMany(datos);
        retorno = retorno.result.n === datos.length ? retorno.result : rogError({cant: datos.length, registrado: retorno.result.n});
        return retorno;
    }

    async cierra() {
    }

    async acomoda(bson,fn) {
        return await bson.toArray();
    }

    opcAgg(opcs) {
        return (opcs instanceof Array) ?
            opcs :
            [{ $match: opcs }];
    }
 
    get metodos() {
        return {
            lee: this.lee, 
            agrega: this.agrega,
            modifica: this.modifica,
            elimina: this.elimina,
            cierra: this.cierra,
            tab: this.tab,
            aggr: this.aggr,
            carga: this.carga,
            getClave: this.getClave
        }
    }
}

class jsonBD {
    constructor(bd) {
        this.bd = bd;
        this.dir = bd.dir;
        this.guardar = {};
    }

    Tabla(nbTabla) {
        if(this.bd.Datos[nbTabla]) return this.bd.Datos[nbTabla]; 
        return this.bd.Datos[nbTabla] = cargaTabla(nbTabla,this.dir);
    }

	lee(tabla,query) {
		this.inicio();
		return this.Tabla(tabla).regs instanceof Array ? rogFiltra(this.Tabla(tabla).regs, query) : this.Tabla(tabla).regs;
	}
	
	agrega(tabla,registro) {
		this.inicio();
		this.Tabla(tabla).regs.push(registro);
        this.verifica(tabla);
        return registro;
	}

	modifica(tabla,query,reg) {
		this.inicio();
		let _reg = rogFiltra(this.Tabla(tabla).regs,query);
		_reg[0] = Object.assign(_reg[0],reg);
        this.verifica(tabla);
        return reg;
	}

	elimina(tabla,query) {
        // Meterle mano
		let _reg = rogFiltra(tabla,query);
        this.verifica(tabla);
        return {}
	}

    cierra() {}
    
    inicio() {}
    
    verifica(tabla) {
        if(this.guardar[tabla]) guarda(tabla);
    }
    
    guarda(tabla) {
        guarda(this.datos[tabla].regs,this.datos[tabla].nb);
    }
    
    guardaSiempre(tabla) {
        this.guardar[tabla] = true;
    }

    get metodos() {
        return {
            lee: this.lee, 
            agrega: this.agrega,
            modifica: this.modifica,
            elimina: this.elimina,
            cierra: this.cierra,
            guarda: this.guarda,
            verifica: this.verifica,
            guardaSiempre: this.guardaSiempre
        }
    }
}

class mysqlBD {
    constructor(bd) {
        this.bd = bd;    
    }
    
    async lee(txtSql) {
        return await mySql(this.bd,nbSql(txtSql));
    }
                           
    async ejecuta(txtSql) {
        return await mySql(this.bd,txtSql)            
    }
    
    get metodos() {
        return {
            lee: lee, 
            agrega: null,
            modifica: null,
            elimina: null,
            cierra: null,
            ejecuta: ejecuta
        }
    }
}

async function mySql(bd,txtSql) {
    let datos = await bd.query(txtSql);
    return datos;
}

async function pgSql(bd,txtSql) {
	let retorno = {};

    console.assert(MUESTRA,"sql:",txtSql);
	
	try {
        const cnx = await bd.connect();

        console.assert(DEEPER,"conexión:",cnx);

		let datos = await cnx.query(txtSql);
        console.assert(MUESTRA,"Devuelve:",datos.rowCount,"regs.");
        console.assert(DEEPER,"Devuelve:",datos);
		retorno = datos;

        cnx.release();
	} catch (e) {
		retorno = rogError({e, sql: txtSql});
	} finally {
        console.assert(DEEPER,"Resultado:",retorno);

        return retorno;
    }
}

const dbms = {
    pg: {
        abre: abrePg,
        bd:   pgBD
    },
    json:     {
        abre: abreJson,
        bd:   jsonBD
    },
    mongo:    {
        abre: abreMongo,
        bd:   mongoBD
    },
    mysql:    {
        abre: abreMySql,
        bd:   mysqlBD
    }
}

class rogBD {
    constructor (bd,datos) {
        console.log(datos.txt);
        
        this.nb       = datos.nb;
        this.datos    = datos;
        this.bd       = bd;
        this.tipo     = datos.dbms;
        this.eliminar = {};
        
        debugger
        this.core = new dbms[datos.dbms].bd(bd);

        for (let proc in this.core.metodos) this[proc] = this.core[proc].bind(this.core);
    }
    
    set error (valor) {
        this.error = valor;
    }
    
    get error () {
        return this.error;
    }
    
    get estado() {
        return {txt: this.datos.txt, error: this.error};
    }
    
    fnElimina(tabla,fn) {
		this.eliminar[tabla] = fn;
        
        this.elimina = (tabla,query) => {
            if(this.eliminar[tabla]) eliminar[tabla](query);
            else this.core.elimina(tabla,query)
        }
	}	
}

function getBDDat(x) {
    let bdDat = x
    if(typeof x === "string") {
        bdDat = JSON.parse(process.env["bd"+x]);

        if(!bdDat.nb) bdDat.nb = x;
    }
    return bdDat
}

function abreBDs() {
    return new Promise((resolve,reject) => {
        Promise.all(Array.from(arguments).map(abreBD)
        ).then(bds => {
            console.log("BDs abiertas")

            let bd = {};

            bds.forEach((x,i) => {
                bd[x.nb || "bd" +i] = x
            });

            resolve (bd);    
        }).catch(err => {
            console.error("Error al conectar con las BDs");
            reject(err);
        });
    })
}

function abreBD (x) {
    let bdDat = getBDDat(x)
    return new Promise((resolve,reject) => {
        dbms[bdDat.dbms].abre((bdDat.prms))
            .then(bd => {
                if(bd.fallo) reject(bd)
                else resolve(new rogBD(bd,bdDat))
            }).catch(reject)
    });
}

function cierraBD(bds) {
    for(x in bds) {
        console.log(`cierra ${x}`)
        bds[x].cierra();
    }
}

/**
 * Funciones con Archivos
 */

/**
 * Crea un Objeto Tabla para Json
 * @param {string} nb Nombre de la Tabla en el esquema
 * @param {string} dir Directorio donde residen los datos
 * @returns 
 */
function cargaTabla(nb,dir) {
    let _alias = nb;
    let _nb    = nb;

    if (typeof nb !== "string") {
        _alias = Object.keys(nb)[0];
        _nb    = Object.values(nb)[0];
    }
    
    return leeTabla(_alias,_nb,dir);
}

function leeTabla(alias,nb,dir) {
    const tabla = leeJson(dir, nb);
    console.log(`Leyo ${tabla.length} registros de ${nb}`)
    return {
        alias,
        nb,
        regs: tabla
    }
}

function Extension(nbArchivo){
    const pos = nbArchivo.lastIndexOf(".");
    let retorno = pos >= 0 ? nbArchivo.slice(pos +1) : "";
    return retorno.startsWith("/") ? "" : retorno;
}

function nbArch(ext,...partes) {
    let nb = path.join(process.cwd(),...partes);
    let _ext = Extension(nb)
    return nb +(_ext ? "" : ext)
}

function leeJson() {
    return require(nbArch(".json",...arguments));
}

async function cargaArch(nb) {
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

function guarda(datos,nb) {
/*
    Guarda los datos (@param datos) 
    en el archivo de nombre (@param nb)
*/
    fs = require('fs');
    fs.writeFileSync(nb, JSON.stringify(datos));
}

// Construye SQL

function lstCampos(bofe) {
    return Object.keys(bofe).join();
}

function lstValores(datos) {
    return Object.keys(datos).map(x => entreComillas(datos[x])).join();
}

function lstMod(datos) {
    return Object.keys(datos).map(nbCampo => `${entreComillas(nbCampo)} = ${entreComillas(datos[nbCampo])}`);
}

function sqlInsert(tabla,datos,campos = lstCampos(datos)) {
    return `INSERT INTO ${tabla} (${campos}) VALUES(${lstValores(datos)})`
}

function sqlMod(tabla,datos) {
    return `UPDATE ${tabla} SET ${lstMod(datos)} WHERE id = ${datos.id}` 
}

function entreComillas(texto,dobles) {
    const comillas = dobles ? '"' : "'"
    return comillas +texto +comillas;
}

/*
    Recibe un objeto y lo convierte en 
    una instrucción SQL
    INSERT o UPDATE según el valor de "ID"
*/
function traduceSQL(txtSQL,tabla,campos) {
    if(typeof txtSQL === "string") return txtSQL;
    else {
        return txtSQL.id ? sqlMod(tabla,txtSQL) : sqlInsert(tabla,txtSQL,campos);
    }
}

/*
    Funciones de transformación
    objeto Query a SQL
*/
function agregaQuery(txt,query) {
    let retorno = txt;

    if(Object.keys(query).length) retorno = txt +
        (txt.toLowerCase().includes("where") ? " AND (" : " WHERE (") +
        traduceQuery(query) +")";
    return retorno;
}

function traduceQuery(query) {
    que = Object.keys(query)[0];
    return que +" = " +entreComillas(query[que]);
}

exports.abreBD   = abreBD;
exports.abreBDs  = abreBDs;
exports.cierraBD = cierraBD;
exports.util     = {
    guarda,
    leeTabla,
    leeJson,
    carga: cargaArch,
    traduceSQL,
    traduceQuery,
};

/**
 * Crea un objeto de error reconocible por las App:
 * @property {boolean} fallo indica que es un mensaje de error
 * @property {number}  status es el código del Error (Http o creado por el usuario)
 * @property {string}  mensaje es el texto del error
 * Cualquier otra propiedad será copiada de un objeto enviado como parámetro
 * 
 * Los tipos de parámetros previstos son:
 * Un objeto: (Objetos Error incluídos) Se copian sus propiedades al resultado
 * Un número: Se usa como código del error del resultado
 * Un texto:  Se usa como mensaje del resultado
 * 
 * Un parámetro de otro tipo será enviado en la propiedad @property {any} wtf
 */
function rogError() {
    let retorno = {fallo: true, status: 666, msj: "Algo malo pasó"}

    Array.from(arguments).forEach(arg => {
        if(typeof arg === "object") retorno = Object.assign(retorno, arg);
        else if(typeof arg === "number") retorno.code = arg;
        else if(typeof arg === "string") retorno.msj = arg;
        else retorno.wtf = arg;
    });

    return retorno;
}

function abreXL(nbArch) {
    const XL = require("js-xlsx");
    const libro = XL.readFile(nbArch);

    hoja = XL.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]])

    return hoja
}