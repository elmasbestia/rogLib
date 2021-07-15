// Librería de funciones para Node JS
// Autor: Rafa Gómez https://rafagomez.neocities.org

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const def = x => x || "";

const rogFmt = {
    Moneda: new Intl.NumberFormat('VES', {
        style: 'decimal',
        minimumFractionDigits: 2
    }).format,
    Ent: new Intl.NumberFormat('VES', {
        style: 'decimal',
        minimumFractionDigits: 0
    }).format,
    Pc: new Intl.NumberFormat('VES', {
        style: 'percent',
        minimumFractionDigits: 2
    }).format,
    Tlf: nro => {
        let _nro = nro.toString();
        return "(" +_nro.slice(0,3)+") " +_nro.slice(3,6) +" " +_nro.slice(7)
    },
    dd: nro => (nro > 9 ? "" : "0") + nro,
    Fecha: (f = new Date()) => {
        f = creaFecha(f);
        return {
            amd: () => f.getFullYear()+"-"+rogFmt.dd(f.getMonth() +1)+"-"+rogFmt.dd(f.getDate()),
            dma: () => rogFmt.dd(f.getDate())+"/"+rogFmt.dd(f.getMonth() +1)+"/"+f.getFullYear(),
            Hora: () => rogFmt.dd(f.getHours())+":"+rogFmt.dd(f.getMinutes()),
            fSerial: () => f.getFullYear()+rogFmt.dd(f.getMonth()+1)+rogFmt.dd(f.getDate()) +rogFmt.dd(f.getHours())+rogFmt.dd(f.getMinutes()),
        }
    },
    Lapso: (desde = new Date(), hasta = new Date()) => `Desde el ${rogFmt.Fecha(desde).dma()} hasta el ${rogFmt.Fecha(hasta).dma()}`
}

function creaFecha(ano, mes, dia) {
        // Devuelve un objeto fecha a partir de los parámetros enviados
        // si no se envía nada, devuelve la fecha de hoy
        var fecha;
        
        if (mes === undefined) {
            if (ano === undefined) { fecha = hoy() }
            else {
                if (typeof(ano) === "object") fecha = ano instanceof Date ? ano : ano.fecha()
                else {fecha = new Date(ano) }
            }
        } else {
            if (ano === undefined) {fecha = new Date(ano,mes)} // (Año, mes)
            else { fecha = new Date(ano, mes, dia || 1) }
        }
        return fecha;
}

const desarma = (lista) => {
    // Crea un arreglo a partir de:
    // 1. Una lista de palabras separada por coma y un espacio en una cadena de caracteres: "A, B, C"
    // 2. Un objeto: { A: ..., B: ..., C: ... }
    // 3. Si @param lista es Un arreglo, devuelve la referencia correspondiente

    let retorno = [];
    if(lista) {
        if(lista instanceof Array) retorno = lista;
        else if(typeof lista === "string") retorno = lista.split(", ");
        else retorno = Object.keys(lista);
    }
    return retorno;
}

function desarmaObj(obj) {
	return Object.keys(obj).map(x => obj[x])
}

function objVacio(obj) { return Object.entries(obj).length === 0 }

const strCompara = (campo,descendente) =>{
    // Función que compara dos objetos sobre la base de uno o varios de sus elementos
    var menor = -1, mayor = 1;
    var que = campo;
    const comp1 = (a,b) => (def(a[que]) < def(b[que])) ? menor : (def(a[que]) > def(b[que])) ? mayor : 0;
    let _campos = desarma(que);
    function comp(a,b) {
      let i = 0;
      do {
        que = _campos[i];
        retorno = comp1(a,b);
      } while (++i < _campos.length && !retorno);
      return retorno;
    }
    if (descendente) {
        menor = 1;
        mayor = -1;
    }
    if (_campos.length === 1) return comp1;
    else return comp;
}

function rogBsqIn(a, que, valor) {
    let _exp = new RegExp(valor, "i");
    return a.filter(x => _exp.test(limpiaPlb(def(x[que]))));
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

function accede(accion,url,fn,datos) {
    let xobj = new XMLHttpRequest();
    let xmlEstado = ["No inicializado", "Conectado", "Recibido", "Procesando", "Listo"];
	
	function msjErrorXML(e) {
		console.log(xobj.accion+"\n"+xobj.url+"\n¡E R R O R!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")\n");
        fn({
            fallo: true, 
            msj: "Error: ("+xobj.statusText+")", 
            status: xobj.status, 
            url: xobj.url
        });
	}
     
    xobj.accion = accion;
    xobj.url    = url;
     
    xobj.withCredentials = true;
    xobj.open(accion, url, true);
    xobj.setRequestHeader('Content-type','application/json; charset=utf-8');
    xobj.onerror = msjErrorXML;
//            xobj.onprogress = (e) => { console.log("Progress: ", e) }
    xobj.onreadystatechange = () => { console.log(xobj.readyState, url, xmlEstado[xobj.readyState]," (", xobj.status,")") };
    xobj.onload = () => {
		if (xobj.status < 400) {
			if(accion === "GET") {
				fn(JSON.parse(xobj.responseText));
			} else {
				fn(JSON.parse(xobj.responseText));
			}
		} else {
			msjErrorXML();
		}
	};
    xobj.send(JSON.stringify(datos));
}

function conecta(app, msj, puerto) {
    let _puerto = process.argv[2] ||  puerto || process.env.puerto;

    app.listen(_puerto, () => console.log(`${msj} en el puerto ${_puerto}.`));
    
    return true;
}

function rogLista(datos,que) {
    const lista = [];
    let valor, cant = 0;
    
    datos.sort(strCompara(que)).forEach(x => {
        if (valor != x[que]) {
            lista.push({valor, cant});
            valor = x[que];
            cant = 0;
        }
        cant++;
    })
    lista.push({valor, cant});
    if(lista[0].cant === 0) lista.shift()
    else lista[0].valor = "(Indefinido)";
    
    return lista;
}

exports.otraVnt = (url, ancho=600, alto=800) => {
    if (typeof url === "object") url = url.target.url;
    window.open(url, "popup", 'width=' +ancho + 'px,height=' + alto + 'px,left=200,top=200');
    return false;
}

exports.nbSerial = (prefijo) => prefijo +rogFmt.fSerial();

exports.rogFmt     = rogFmt;
exports.desarma    = desarma;
exports.desarmaObj = desarmaObj;
exports.strCompara = strCompara;
exports.rogFiltra  = rogFiltra;
exports.accede     = accede;
exports.conecta    = conecta;
exports.rogLista   = rogLista;
