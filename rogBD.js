// Rafa Gómez
// Librería para manipular Bases de Datos

const MUESTRA = false;  // Si "false" muestra mensajes de nivel "normal"
const DEEPER  = true;   // Si "false" muestra mensajes más detallados
console.assert(MUESTRA,"rogBD:", "Se muestran mensajes")

const rogFiltra = require("./rogNodeLib").rogFiltra;
const path      = require("path");

let ObjectID;

function nbSql(txt) {
    return txt.split(" ").length === 1 ?
        txt = "SELECT * FROM " +txt :
        txt
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
        else retorno = resultado[0].cant;

        return retorno;
    }

    async lee(txtSql) {
        if(txtSql.split(" ").length === 1) {
            txtSql = "SELECT * FROM " +txtSql;
        }
        let retorno = await pgSql(this.bd,txtSql);
        return retorno.fallo ? retorno : retorno.rows;
    }
    
    async agrega(txtSql) {
        return pgSql(this.bd,txtSql)
    }

    async carga(tabla,datos) {
        let resultados = [];
        let cant = 0;

        const n = datos.length;
        console.group(`Vamos a Grabar ${n} registros en ${tabla}`)

        console.log(`Comenzamos con ${await this.cuentaRegs(tabla)}`);

        // const campos = lstCampos(datos[0]); Cada reg. puede ser distinto
        try {
            let x = 0;
            for(; x < n; x++) {
                let resultado = await pgSql(this.bd,sqlInsert(tabla,datos[x],lstCampos(datos[x])));
                if (resultado.fallo) {
                    resultados.push(resultado);
                    console.dir(resultado)
                } else cant++;
                console.assert(MUESTRA,x, cant)
            };
        } catch (e) {
            console.log(e);
        } finally {
            console.groupEnd(`Terminamos con ${await this.cuentaRegs(this.bd,tabla)}`);

            return { fallo: ((cant != resultados.length) || resultados.some(x => x.fallo)), 
                msj: cant ? `grabó ${cant}` : "No grabó ningún registro",
                cant, 
                total: datos.length, 
                resultados 
            };
        }
    }

    async modifica(txtSql) {
        return pgSql(this.bd,txtSql)
    }
    
    async elimina(txtSql) {
        return pgSql(this.bd,txtSql)
    }
    
    async ejecuta(txtSql) {
        return pgSql(this.bd,txtSql)
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
    let _dir = prms.dir ? 
        (prms.dir +(prms.dir.endsWith('/') ? "" : "/")) : 
        "./";

    function objeta(arr) {
        return arr.reduce((obj,x) => {
            obj[x.alias] = x;
            return obj;
        }, {});
    }

    return new Promise((resolve,reject) => {
        try {
            if(prms.nb) {
                if(prms.nb instanceof Array) _datos = prms.nb.map(x => cargaTabla(x,_dir));
                else if (typeof prms.nb === "string") _datos = [cargaTabla(prms.nb,_dir)];
                else _datos = Object.keys(prms.nb).map (x => cargaTabla(x,_dir))
            }
                
            resolve({dir: _dir, Datos: objeta(_datos)});
        } catch (e) {
            reject(e);
        }
    })
}

function abreMongo(prms) {
    const { MongoClient: cliente, ObjectID: _ObjectID } = require('mongodb');

    ObjectID = _ObjectID;
    
    return new Promise((resolve,reject) =>
        cliente.connect(
            prms.url,
            {
                useNewUrlParser: true, useUnifiedTopology: true
            }
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
        return await this.acomoda(this.tab(tabla).find(opciones),fn);
    }
    
    async agr(tabla,condiciones,fn) {
        return await this.acomoda(this.tab(tabla).aggregate(this.opcAgg(condiciones)),fn);
    }
    
    async agrega(tabla,buffer,fn) {
        console.log("Buffer:")
        console.log(buffer)
        
        let retorno = await this.tab(tabla).insertOne(buffer);
        console.log("Volvió de mongo agregar")
        retorno = retorno.insertedCount === 1 ? buffer : { fallo: true, registrado: insertedCount}
        console.log(retorno)
        return retorno;
    }
    
    async modifica(tabla,buffer) {
        let bofe = Object.assign(buffer)
        let id = bofe._id
        delete bofe._id
        
        return await this.tab(tabla).findOneAndReplace(
            {id: id},
            bofe
        );
    }
    
    async elimina(tabla,id) {
        if(this.eliminar[tabla]) this.eliminar[tabla](query);
        else this(tabla).deleteMany(query);
    }
    
    async carga(tabla,datos,fn) {
        console.log(datos.length,"registros");
        
        let retorno = await this.tab(tabla).insertMany(datos);
        console.log("Volvió de mongo cargar")
        retorno = retorno.result.n === datos.length ? retorno.result : { fallo: true, cant: datos.length, registrado: retorno.result.n}
        return retorno;
    }
        
    async cierra() {
    }

    async acomoda(bson,fn) {
        let retorno;
        try {
            retorno = await bson.toArray();
            if(fn) retorno = await Promise.all(retorno.map(fn));
        } catch (e) {
            console.error(e);
            retorno = {fallo: true, msj: e.message};
        } finally {
            return retorno;
        }    
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
            agr: this.agr,
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
        console.assert(MUESTRA,"Devuelve:",datos.lenght,"regs.");
        console.assert(DEEPER,"Devuelve:",datos);
		retorno = datos;

        cnx.release();
	} catch (e) {
		retorno = { fallo: true, msj: e.message, sql: txtSql };
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
                console.log(x.datos.txt)
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
            .then(bd => resolve(new rogBD(bd,bdDat)))
            .catch(reject)
    });
}

function cierraBD(bds) {
    for(x in bds) {
        console.log(`cierra ${x}`)
        bds[x].cierra();
    }
}

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
    return {
        alias,
        nb,
        regs: require(path.join(__dirname,dir,nb+".json"))
    }
}

function leeXl(nbLibro,nbHoja) {
    const xl  = require(dirLib+"rogXL");

    const libro = new xl.Libro(nbLibro);

    function hoja(nbHoja) {
        return xl.lib.sheet_to_json(libro.wb.Sheets[nbHoja]);
    }

    if(nbHoja) {
        return hoja(isNaN(nbHoja) ? nbHoja : libro.ws.SheetNames[hoja]);
    } else {
        return libro.ws.SheetNames.map(hoja);
    }
}

function guarda(datos,nb) {
/*
    Guarda los datos (@param datos) 
    en el archivo de nombre (@param nb)
*/
    fs = require('fs');
    fs.writeFileSync(nb, JSON.stringify(datos));
}

function lstCampos(bofe) {
    return Object.keys(bofe).join();
}

function lstValores(datos) {
    return Object.keys(datos).map(x => entreComillas(datos[x])).join();
}

function lstMod(datos) {
    return Object.keys(datos).map(nbCampo => entreComillas(nbCampo) +" = " + entreComillas(datos[nbCampo]))
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

exports.abreBD   = abreBD;
exports.abreBDs  = abreBDs;
exports.cierraBD = cierraBD;
exports.guarda   = guarda;
