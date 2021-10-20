/*
    Objeto DPT

    Normaliza los códigos Político-Territoriales
*/

import DPT from "./DPTBD";

const xEdo = 0, xMun = 1, xPq = 2;
const nbNivel = ["Estado", "Municipio", "Parroquia"]

export default class DPT {
    constructor(onchange, valor) {
        this.w = {
            x: [0, 0, 0]
        }

        this.onchange = onchange;
        this.value    = valor;
    }

    get value() {
        return this.codigo;
    }

    set value(valor) {
        this.w.x = getIndices(valor);
        if(this.onchange) this.onchange()
    }

    get codigo() {
        return this.indices().map(fmt2).join("")
    }

    get Estados() {
        return DPT;
    }

    get Estado(codigo) {
        return DPT[indices(codigo)[xEdo]];
    }

    get lstEstados(abrev = false) {
        return this.lista(xEdo,null,abrev);
    }

    get Municipios(codigo) {
        return DPT[indices(codigo)[xEdo]].Municipios;
    }

    get lstMunicipios(codigo) {
        return this.lista(xMun,codigo);
    }

    get Parroquias(codigo) {
        let _indices = indices(codigo);
        return DPT[_indices[xEdo]].Municipios[_indices[xMun]].Parroquias;
    }

    get lstParroquias(codigo) {
        return this.lista(xPq,codigo);
    }

    indice(nivel) {
        return indices[nivel];
    }

    indices(codigo) {
        return codigo ? analCodigo(codigo) : this.w.x;
    }

    nb(codigo = this.value) {
        return analCodigo(codigo, (i,nivel) => fnNombre(nivel)(this.que[codigo,nivel]))
    }

    que(codigo = this.value, nivel,plural=false) {
        fns = plural ? 
        [this.Estados, this.Municipios, this.Parroquias] :
        [this.Estado, this.Municipio, this.Parroquia];
    
        return fns[nivel](codigo)
    }

    lista(nivel,codigo,abrev) {
        return this.que(codigo,nivel).map(fnNombre(nivel,abrev))
    }

    datos(codigo,nivel) {
        return this.que(codigo,nivel).map((x,i) => ({ codigo: getCodigo(codigo,nivel,i), nombre: fnNombre(nivel)}))
    }
}

const fmt2 = (num = 0) => num > 9 ? num.String() : "0" + num;

function getIndices(codigo) {
    return analCodigo(codigo);
}

function formatea(valor) {
    let retorno = valor.toString();
    while (retorno.length < 6) {
        if(retorno.length === 5) retorno = "0" +retorno;
        else retorno += "00";
    }
    return retorno;
}

function analCodigo(codigo,fn = x => x) {
    let retorno = [0, 0, 0]
    let _codigo = formatea(codigo);
    let _nivel = 0;
    for(let x = 0; x < 6; x += 2) {
        retorno[nivel] = fn(_codigo.slice(x,x+2),_nivel);
        _nivel++
    }
    return retorno;
}

function fnNombre(nivel,abrev) {
    let retorno = x => x.Parroquia;

    if(nivel == xEdo) retorno = abrev ? abreviado : x => x.EDO;
    else if(nivel == xMun) retorno = x => x.Municipio;

    return retorno;
}

function abreviado(estado) {
    return estado.ABREV || estado.EDO.slice(0,2)
}

function getCodigo(codigo,nivel,i) {
    let _indices = getIndices(codigo);
    _indices[nivel] = i;
    for(let x = i +1; x < 3; x++) _indices[x] = 0;
    return _indices.map(fmt2).join("")
}
