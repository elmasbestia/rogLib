/**
  Librería de funciones para Node JS
 Autor: Rafa Gómez https://rafagomez.neocities.org
*/

/**
 * Para establecer comunicaciones por HTTP (@function Accede)
 */
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

/**
 * Si el valor es indefinido, devuelve una cadena vacía
 * @Uso Para evaluar una variable que puede estar indefinida
 * @param {any} x 
 * @returns {any}
 */
const def = x => x || "";

/**
 * Devuelve una fecha sin separadores 
 * @param {*} f Cadena de caracteres representando una fecha
 * @returns 
 */
function limpiaF(f) {
    return f.replace(/(\.|\:|[-A-Z])/gi,"");
}

/**
 * Formatos
 * @Uso rogFmt.tipo(valor a formatear)
 *      Para Fechas:
 *      rogFmt.Fecha(fecha).tipo()
 */
const rogFmt = {
    Moneda: new Intl.NumberFormat('VES', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format,
    Ent: new Intl.NumberFormat('VES', {
        style: 'decimal',
        maximumFractionDigits: 0
    }).format,
    Prc: new Intl.NumberFormat('VES', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format,
    Tlf: nro => {
        let _nro = nro.toString();
        return `(${_nro.slice(0,3)}) ${_nro.slice(3,6)}  ${_nro.slice(7)}`
    },
    dd: nro => nro.toString().padStart(2,"0"),
    Fecha: rogFmtFecha,
    Lapso: (desde = new Date(), hasta = new Date()) => `Desde el ${rogFmt.Fecha(desde).dma()} hasta el ${rogFmt.Fecha(hasta).dma()}`
}

function rogFmtFecha(f = new Date()) {
  const dicc = {
    fmts: {
        dd: () => rogFmt.dd(elementos.dia),
        ddd: () => trad("dia", elementos.nbDia).slice(0, 3),
        dddd: () => trad("dia", elementos.nbDia),
        mmmm: () => trad("mes", elementos.nbMes),
        mmm: () => trad("mes", elementos.nbMes).slice(0, 3),
        mm: () => rogFmt.dd(indice(elementos.nbMes, dicc.mes) + 1),
        aa: () => elementos.ano.slice(2),
        aaaa: () => elementos.ano,
        hh: () => elementos.hora.slice(0, 5),
        hhhh: () => elementos.hora,
        amd: (separador = "-") =>
            fmt("aaaa") + separador + fmt("mm") + separador + fmt("dd"),
        am: () => intp("aaaa / mm").replace(/[\s]/g, ""),
        dma: (separador = "/") =>
            fmt("dd") + separador + fmt("mm") + separador + fmt("aaaa"),
        cool: () => intp("ddd dd de mmm aaaa"),
        coolfull: () => intp("ddd dd de mmm aaaa hh"),
        serial: () => intp("aa mm dd hhhh").replace(/[\s:]/g, ""),
        full: () => intp("aa mm dd hhhh"),
        serio: () => intp("dddd dd de mmmm de aaaa"),
        evento: () => intp("ddd dd hh"),
        nbMes: (corto = false) => intp(corto ? "mmm aa" : "mmmm de aaaa"),
        lstMeses: () => Object.entries(dicc.mes).map(x => x[1]),
        lstDias: () => Object.entries(dicc.dia).map(x => x[1])
    },
    mes: {
      Jan: "Enero",
      Feb: "Febrero",
      Mar: "Marzo",
      Apr: "Abril",
      May: "Mayo",
      Jun: "Junio",
      Jul: "Julio",
      Aug: "Agosto",
      Sep: "Septiembre",
      Oct: "Octubre",
      Nov: "Noviembre",
      Dic: "Diciembre"
    },
    dia: {
      Sun: "Domingo",
      Mon: "Lunes",
      Tue: "Martes",
      Wed: "Miércoles",
      Thu: "Jueves",
      Fri: "Viernes",
      Sat: "Sábado"
    }
  };

  const dd = (n) => (n > 9 ? n : "0" + n);
  const indice = (valor, obj) => Object.keys(obj).findIndex((x) => x === valor);
  const fmt = (que) => (dicc.fmts[que] ? dicc.fmts[que]() : que);
  const trad = (que, valor) => dicc[que][valor];
  const intp = (cadena) => cadena.split(" ").map(fmt).join(" ");

  const elementos = parseFecha(creaFecha(f));

  function parseFecha(f) {
    const cadenas = f.toString().split(" ");
    return ["nbDia", "nbMes", "dia", "ano", "hora"].reduce((el, x, i) => {
      el[x] = cadenas[i];
      return el;
    }, {});
  }

  return dicc.fmts;
}

/**
 *  Devuelve un objeto fecha a partir de los parámetros enviados
 * 
 * @param {any} ano 
 * @param {any} mes 
 * @param {any} dia 
 * @returns {date} La fecha de hoy, por defecto
 */
function creaFecha(ano, mes, dia) {
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

/**
 * Devuelve un arreglo
 * @param {any} lista Puede ser:
 *              1. un arreglo, 
 *              2. una cadena de valores separadas por ", "
 *              3. Un objeto
 * @returns {array}
 *              1. El mismo arreglo
 *              2. un arreglo de los valores
 *              3. El arreglo de los nombres de las propiedades
 */
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

/**
 * Devuelve un arreglo con las propiedades de un objeto
 * @param {object} obj
 * @returns {array} {nombre de la propiedad: valor}
 */
function desarmaObj(obj) {
	return Object.entries(obj).map(x => jeto(x[0], x[1]));
}

/**
 * Si el Objecto está vacío
 * @param {object} obj 
 * @returns {boolean} 
 */
function objVacio(obj) { return Object.keys(obj).length === 0 }

/**
 * Función que compara dos objetos sobre la base de una o varias de sus propiedades
 * @Uso arreglo.sort(strCompara(propiedades))
 * @param {*} campo nombre(s) de las propiedades de los objetos a comparar
 * @param {boolean} descendente Si se desean los elementos en orden descendente
 * @returns {function}
 */
const strCompara = (campo,descendente) =>{
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

/**
 * Busca un valor en un arreglo como una expresión regular
 * @Ej rogBsqIn(srreglo,"nombre", "jesus") va a traer todos los registros con nombres como: "JESÚS", "Jesus" o "Jesusa"
 * @param {array} a Arreglo de datos
 * @param {string} que propiedad a escudriñar
 * @param {string} valor valor a buscar
 * @returns {array} elementos que cumplen la condición
 */
function rogBsqIn(a, que, valor) {
    let _exp = new RegExp(valor, "i");
    return a.filter(x => _exp.test(limpiaPlb(def(x[que]))));
}

/**
 * Busca una serie de valores
 * @param {array} Datos a filtrar 
 * @param {object} query propiedad: valor o función
 * @param {array | string} aCamposIn propiedades a escudriñar
 * @returns 
 */
function rogFiltra(a, query, aCamposIn) {
    let retorno = a instanceof Array ? a : desarmaObj(a);
    let aIn = desarma(aCamposIn);

    if(query) {
        if(query instanceof Function) retorno = a.filter(query);
        else {
            for(let [que,valor] of Object.entries(query)) {
                retorno = aIn.includes(que) ?
                rogBsqIn(retorno,que, valor) : 
                retorno.filter(x => x[que] == valor);
            }
        }
    }

    return retorno;
}

/**
 * "Depura" una cadena de caracteres de acentos, etc.
 * @Uso Sobre todo en búsquedas en datos no confiables gramaticalmente
 * @param {string} palabra 
 * @returns {string} palabra transformada
 * @Ej: "Tarántula de caña" devuelve "Tarantula de cana"
 */
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

/**
 * Comunicación HTTP
 * @param {string} accion Operación (GET, PUT, etc.)
 * @param {string} url Dirección a acceder
 * @param {function} fn cb que recibe la respuesta 
 * @param {object} datos a transmitir
 */
function accede(accion,url,fn,datos) {
    let xobj = new XMLHttpRequest();
    let xmlEstado = ["No inicializado", "Conectado", "Recibido", "Procesando", "Listo"];
	
	function msjErrorXML(e) {
		console.log(`${xobj.accion}\n${xobj.url}\n¡E R R O R!!!\nStatus: ${xobj.status} (${xobj.statusText})`);
        fn(objError(`Error: (${xobj.statusText})`, xobj.status, {url: xobj.url}));
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
		if (xobj.status < 400) fn(JSON.parse(xobj.responseText));
		else msjErrorXML();
	};
    xobj.send(JSON.stringify(datos));
}

/**
 * Comunicación HTTP sincronizada
 * @param {string} accion Operación (GET, PUT, etc.)
 * @param {string} url Dirección a acceder
 * @param {function} fn cb que recibe la respuesta 
 * @param {object} datos a transmitir
 */
function accedeSinc(accion,url,fn,datos) {
    let xobj = new XMLHttpRequest();
    let xmlEstado = ["No inicializado", "Conectado", "Recibido", "Procesando", "Listo"];
	let retorno = objError(`Error al acceder${url}`, 500);

    function huboError(xobj) {
        return (xobj.status === 0 || (xobj.status >= 400)) || xobj.responseText.fallo;
    }

	function mstError() {
		//console.log(msjError(xobj));
        retorno = xobj.responseText.fallo ? 
			xobj.responseText : 
			objError(
                xobj.statusText || "No puedo comunicarme con la B.D.",
                xobj.status,
                {respuesta: xobj.responseText}
            );

        return retorno;
	}

    xobj.accion = accion;
    xobj.url    = url;
     
    xobj.withCredentials = true;
    xobj.open(accion, url, false);
    xobj.setRequestHeader('Content-type','application/json; charset=utf-8');
    xobj.onerror = mstError;
    xobj.onreadystatechange = () => { console.log(xobj.readyState, url, xmlEstado[xobj.readyState]," (", xobj.status,")") };
    xobj.onload = () => {
		retorno = huboError(xobj) ? 
            mstError() :
            JSON.parse(xobj.responseText);
	};
    xobj.send(JSON.stringify(datos));

    if(fn) {
        if(retorno.fallo) rogFallo(retorno);
        fn(retorno);
    }

    return retorno;
}

/**
 * Abre un servicio con NodeJS y Express
 * @param {object} app de Express
 * @param {string} msj Mensaje de conexión para la cónsola
 * @param {*} puerto Puerto donde abrir la conexión
 * @returns 
 */
function conecta(app, msj, puerto) {
    const color        = require("colors");

    let _puerto = process.argv[2] ||  puerto || process.env.puerto;

    let svr = app.listen(_puerto, () => console.log(`${msj} en el puerto ${_puerto}.`.bgGreen.yellow));

    process.on('SIGTERM', () => {
      svr.close(() => {
        console.log(`${msj} terminado.`);
      });
    });

    return true;
}

/**
 * 
 * @param {*} statusText 
 * @param {*} status 
 * @param {*} altre 
 * @returns 
 */
function objError(statusText, status, altre = {}) {
    return { fallo: true, msj: statusText, status, ...altre }
}

/**
 * Arma una lista de valores con su frecuencia de aparición 
 * @param {*} datos Datos a analizar
 * @param {*} que propiedad a analizar
 * @returns {array} {valor: cantidad}
 */
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

/**
 * Extensión de un archivo
 * @param {string} nbArchivo Nombre completo del archivo 
 * @returns {string} extensión del archivo
 */
function Extension(nbArchivo){
    var retorno = "";
    var pos = nbArchivo.lastIndexOf(".");

    if (pos >= 0) { retorno = nbArchivo.slice(pos +1) }
    return retorno;
}

/**
 * Devuelve un elemento al azar
 * @param {array} a arreglo 
 * @returns {any} elemento escogido
 */
exports.escogeUna = function (a) {
	return a[Math.floor(Math.random() *a.length)]
}

/**
 * Construye una cadena basada en la hora actual
 * @param {string} prefijo de la cadena
 * @returns {string}
 */
exports.nbSerial = (prefijo) => prefijo +rogFmt.Fecha().serial();

/**
 * Construye un objeto
 * No se me ocurrió otra forma de hacerlo
 * @param {string} que Nombre de la propiedad
 * @param {any} valor de la propiedad
 * @returns {object} {que: valor}
 */
exports.jeto = (que, valor) => {
    let jeto = {};

    jeto[que] = valor;
    return jeto;
}

/*
    Constructor de mensajes
    Crea un objeto cuyos elementos pueden contener valores 
    o arreglos de valores
*/
exports.objMsj = (obj,id,msj) => {
    if(obj[id]) {
        if(obj[id] instanceof Array) obj[id].push(msj);
        else obj[id] = [obj[id], msj];
    } else obj[id] = msj;
}

exports.rogFmt     = rogFmt;
exports.desarma    = desarma;
exports.desarmaObj = desarmaObj;
exports.strCompara = strCompara;
exports.rogFiltra  = rogFiltra;
exports.accede     = accede;
exports.accedeSinc = accedeSinc;
exports.conecta    = conecta;
exports.rogLista   = rogLista;
exports.Extension  = Extension;
exports.creaFecha  = creaFecha;