// Rafa Gómez
// Librería para manipular Bases de Datos

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
        this.bd = bd;    
    }
    
    async lee(txtSql) {
        if(txtSql.split(" ").length === 1) {
            txtSql = "SELECT * FROM " +txtSql;
        }
        return await pgSql(this.bd,txtSql)
    }
    
    async agrega(txtSql) {
        return await pgSql(this.bd,txtSql)
    }
    
    async modifica(txtSql) {
        return await pgSql(this.bd,txtSql)
    }
    
    async elimina(txtSql) {
        return await pgSql(this.bd,txtSql)
    }
    
    async ejecuta(txtSql) {
        return await pgSql(this.bd,txtSql)
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
            ejecuta: this.ejecuta
        }
    }
}

function abrePg (prms) {
    function txtConexion (prms) {
		return `postgressql://${prms.user}:${prms.password}@${prms.host}:${prms.port}/${prms.database}`;
	} 	

    const Cliente = require('pg').Client;
    const cliente = new Cliente({connectionString: txtConexion(prms)});

    return new Promise((resolve,reject) =>
        cliente.connect()
            .then(() => resolve(cliente))
            .catch(err => reject(err))
)}

function abreJson(prms) {
    let _datos = {};
    let _dir = prms.dir ? 
        (prms.dir +(prms.dir.endsWith('/') ? "" : "/")) : 
        "./";
	
	function cargaTabla(nb) {
		let _alias = nb;
		let _nb    = nb;
		if (typeof nb !== "string") {
			_alias = Object.keys(nb)[0];
			_nb    = Object.values(nb)[0];
		}
        
        _datos[_alias] = {};

		_datos[_alias].alias = _alias;
		_datos[_alias].nb    = _nb;
		_datos[_alias].regs = require(path.join(__dirname,_dir,_nb+".json"));
	}
    
    return new Promise((resolve,reject) => {
        try {
            if(prms.nb instanceof Array) prms.nb.forEach(x => cargaTabla(x));
            else if (typeof prms.nb === "string") cargaTabla(prms.nb);
            else for(x in prms.nb) cargaTabla({[x]: prms.nb[x]})

            resolve({Datos: _datos});
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
        ).catch(err => reject(err)
    ))
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
        return await this.acomoda(this.tab(tabla).aggregate(opcAgg(opciones)),fn);
    }
    
    async agrega(tabla,buffer,fn) {
        let retorno = await this.tab(tabla).insertOne(buffer);
        console.log("Volvió de mongo agregar")
        console.log()
        retorno = retorno.insertedCount === 1 ? buffer : { fallo: true, registrado: insertedCount}
        console.log(retorno)
        return retorno;
    }
    
    async modifica(tabla,buffer) {
        return await this.tab(tabla).findOneAndReplace(
            {id: buffer.id},
            buffer
        );
    }
    
    async elimina(tabla,id) {
        if(this.eliminar[tabla]) this.eliminar[tabla](query);
        else this(tabla).deleteMany(query);
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
            getClave: this.getClave
        }
    }
}

class jsonBD {
    constructor(bd) {
        this.bd = bd;    
        this.guardar = {};
    }

	lee(tabla,query) {
		this.inicio();
		return query ? 
			rogFiltra(this.bd.Datos[tabla].regs, query) : 
			this.bd.Datos[tabla].regs;
	}
	
	agrega(tabla,registro) {
		this.inicio();
		this.bd.Datos[tabla].regs.push(registro);
        verifica(tabla);
	}

	modifica(tabla,query,reg) {
		this.inicio();
		let _reg = rogFiltra(this.bd.Datos
		[tabla].regs,query);
		_reg[0] = Object.assign(_reg[0],reg);
        verifica(tabla);        
	}

	elimina(tabla,query) {
		let _reg = rogFiltra(tabla,query);
        verifica(tabla);
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
            guarda: this.guarda
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
    let datos = await bd.query(txtSql);
    return datos.rows;
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

function abreBDs() {
    return new Promise((resolve,reject) => {
        Promise.all(
            Array.from(arguments).map(x => {
            let bdDat = JSON.parse(process.env["bd"+x]);

            if(!bdDat.nb) bdDat.nb = x;

            return abreBD(bdDat);
        })).then(bds => {
            console.log("BDs abiertas")
            

            let bd = {};

            bds.forEach(x => {
                console.log(x.datos.txt)
                bd[x.nb] = x
            });

            resolve (bd);    
        }).catch(err => {
            console.log("Error al conectar con las BDs");
            reject(err);
        });
    })
}

function abreBD (bdDat) {
    return new Promise((resolve,reject) => {
        dbms[bdDat.dbms].abre((bdDat.prms))
            .then(bd => resolve(new rogBD(bd,bdDat)))
            .catch(err => reject(err))
    });
}

function cierraBD(bds) {
    for(x in bds) {
        console.log(`cierra ${x}`)
        bds[x].cierra();
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

exports.abreBD   = abreBD;
exports.abreBDs  = abreBDs;
exports.cierraBD = cierraBD;