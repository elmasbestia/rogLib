/*
    Manejador de sentencias SQL

    Permite construir instrucciones SQL
    (Debe poder adaptarse a todas las posibles sintaxis)
    Requiere:
    @param opcs: Objeto con las siguientes propiedades, todas opcionales:
    * tabla :   Nombre de la tabla a intervenir
    * accion:   Acción a ejecutar ("Select, Update, etc."). El defecto es "Select"
    * campos:   Puede ser una cadena con la lista de los campos o un objeto.
                Las propiedades del objeto se tomarán como los nombres de los campos 
                y sus valores constituirán la propiedad "datos"
    * datos :   Una lista de valores o 
*/

class rogSQL {
    constructor (opcs) {
        this.w = {};
        this.tabla  = opcs.tabla;
        this.accion = opcs.accion;
        this.campos = opcs.campos;
        this.datos  = opcs.datos;
        this.leng   = opcs.leng;
    }

    set accion(valor = "SELECT") {
        accion = accion.toUpperCase();
        this.w.accion = acciones.includes(accion) ? accion : "SELECT";
    }

    set campos(bofe) {
        this.w.campos = typeof bofe === "string" ? desarma(bofe) : Object.keys(bofe);
    }

    get campos() {
        return this.w.campos;
    }

    get lstCampos() {
        return this.w.campos.join();
    }

    get lstMod() {

    }

    set tabla(valor) {
        this.w.tabla = valor;
    }

    get tabla() {
        return this.w.tabla;
    }

    get txt() {
        let retorno = "";

        switch(this.accion) {
            case "SELECT":
                break;
            case "UPDATE":
                retorno = `UPDATE ${this.tabla} SET ${lstMod(this.datos)} WHERE id = ${datos.id}`;
                break;
            case "DELETE":
                retorno = "DELETE from ${this.tabla}";
                break;
            case "INSERT":
                retorno = `INSERT INTO ${this.tabla} (${this.lstCampos}) VALUES(${this.lstValores})`;
                break;
        }

        return retorno +this.filtro();
    }

    mst() {
        return `
        this.tabla  = opcs.tabla;
        this.accion = opcs.accion;
        this.campos = opcs.campos;
        this.datos  = opcs.datos;
        this.leng   = opcs.leng;
        `
    }
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
    return 
}

function entreComillas(texto,dobles) {
    const comillas = dobles ? '"' : "'"
    return comillas +texto +comillas;
}

const acciones = [
    "SELECT",
    "UPDATE",
    "DELETE",
    "INSERT"
]
