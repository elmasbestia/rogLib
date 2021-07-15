// Utilitario de Busqueda de texto en un arreglo

function rogBsqIn(a, que, valor) {
    let _exp = new RegExp(valor, "i");
    return a.filter(x => _exp.test(limpiaPlb(x[que])));
}

function rogFiltra(a, query, aCamposIn) {
    let retorno = a instanceof Array ? a : desarmaObj(a);
    let aIn = desarma(aCamposIn);

    for(let [que,valor] of Object.entries(query)) {
        retorno = aIn.includes(que) ?
            rogBsqIn(retorno,que, valor) : 
            retorno.filter(x => x[que] == valor);
    }

    return retorno;
}

function limpiaPlb(palabra){
    let sinAcento = {
        á: "a",
        é: "e",
        í: "i",
        ó: "o",
        ú: "u",
        ü: "u",
        ñ: "n",
        Á: "A",
        É: "E",
        Í: "I",
        Ó: "O",
        Ú: "U",
        Ü: "U",
        Ñ: "N"
    };
    let reg = regExpLimpia = /[áéíóúñ]/ig;

    return palabra.replace(reg, letra => sinAcento[letra])
}

exports.rogFiltra = rogFiltra;