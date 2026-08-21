// Librería de funciones para JS
// Autor: Rafa Gómez https://rafagomez.neocities.org

const difGMT = -240000; // Diferencia en minutos entre Caracas y Greenwich
  // (Para internacionalizar usar Date.prototype.getTimeZoneOffset * 1000)

/**
 * Formatos
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
        let _nro = nro.toString().padStart(13);
        return `${(_nro.slice(0,3)).trim()}(${_nro.slice(3,6)}) ${_nro.slice(6,9)}  ${_nro.slice(9)}`
    },
    dd: nro => nro.toString().padStart(2,"0"),
    Fecha: rogFmtFecha,
    Lapso: (desde = new Date(), hasta = new Date()) => `Desde el ${rogFmt.Fecha(desde).dma()} hasta el ${rogFmt.Fecha(hasta).dma()}`
}
//    return dicc.fmts[txt] ? dicc.fmts[txt]() : intp(txt);

/**
 * Formatos de Fecha
 * @param {date | string} f 
 * @returns {object}
 */
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
      "dd mmm": () => intp("dd mmm"),
      dma: (separador = "/") =>
        fmt("dd") + separador + fmt("mm") + separador + fmt("aaaa"),
      cool: () => intp("ddd dd de mmm aaaa"),
      coolfull: () => intp("ddd dd de mmm aaaa hh"),
      serial: () => intp("aa mm dd hhhh").replace(/[\s:]/g, ""),
      full: () => intp("aa mm dd hhhh"),
      serio: () => intp("dddd dd de mmmm de aaaa"),
      evento: () => intp("ddd dd hh"),
      intp: (x) => intp(x),
      nbMes: (corto = false) => intp(corto ? "mmm aa" : "mmmm de aaaa"),
      lstMeses: () => Object.values(dicc.mes),
      lstDias: () => Object.values(dicc.dia)
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
      Dec: "Diciembre"
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

  const indice = (valor, obj) => Object.keys(obj).findIndex((x) => x === valor);
  const fmt = (que) => (dicc.fmts[que] ? dicc.fmts[que]() : que);
  const trad = (que, valor) => dicc[que][valor];
  const intp = (cadena) => cadena.split(" ").map(fmt).join(" ");

  let efe = creaFecha(f)
  if(!efe) return 

  const elementos = parseFecha(efe) // new Date(efe +difGMT)); // Fecha aquí, no en Greenwich

  function parseFecha(f) {
    const cadenas = (f.toUTCString()).replace(",","").split(" ");
    return ["nbDia", "dia", "nbMes", "ano", "hora"].reduce((el, x, i) => {
      el[x] = cadenas[i];
      return el;
    }, {});
  }

  return dicc.fmts;
}

/**
 * Devuelve un objeto fecha
 * @param {number | string} ano 
 * @param {number} mes 
 * @param {number} dia 
 * @returns {date}
 */
function creaFecha(ano, mes, dia) {
    // Devuelve un objeto fecha a partir de los parámetros enviados
    // si no se envía nada, devuelve la fecha de hoy
    let fecha;
    
    if (mes === undefined) {
        if (ano) {
            if (typeof(ano) === "object") fecha = ano instanceof Date ? ano : ano.fecha
            else {fecha = new Date(ano) }
        } else {
            let hoy = new Date();
            if(dia === undefined) fecha = hoy;
            else fecha = new Date(hoy.getFullYear(), hoy.getMonth(), dia);
        }
    } else {
        if (ano === undefined) fecha = new Date(ano,mes);
        else fecha = new Date(ano, mes, dia || 1);
    }
    return fecha.toString() === "Invalid Date" ? undefined : fecha;
}

/**
 * Devuelve un elemento al azar de un arreglo o un numero entre 0 y a
 * @param {array || number} a 
 * @returns {any}
 */
function escogeUna(a) {
    return Array.isArray(a) ?
	    desarma(a)[Math.floor(Math.random() *a.length)] :
        Math.floor(Math.random() *a)
}

//              Funciones con DOM
/**
 * Devuelve un elemento identificado por su propiedad "id"
 * @param {elemento | string} dom 
 * @returns {elemento}
 */
function objDom(dom) { return typeof dom === "string" ? document.getElementById(dom) : dom }

/**
 * Si un elemento no contiene propiedades
 * @param {object} obj 
 * @returns {boolean}
 */
function objVacio(obj) { return !(obj && Object.entries(obj).length) }

/**
 * Devuelve la propiedad "value" de un elemento identificado por su propiedad "name"
 * @param {string} nb Nombre del elemento
 * @returns {any}
 */
function valDom(nb) { return document.querySelector("[name="+nb+"]").value }

/**
 * Crea un objeto con el @param valor en la propiedad @param que
 * @param {string | array} que 
 * @param {any | array} valor 
 * @returns {object}
 */
function jeto(que,valor) {
    let obj = {};
    if(que instanceof Array) que.forEach(x => obj[x] = valor[x]);
    else obj[que] = valor;
    return obj;
}

/**
 * recibe una propiedad y retorna su nombre y su valor
 * @param {object} jeto objeto
 * @returns {array} nombre de la propiedad, valor 
 */
function desJeto(jeto) {
    return Object.entries(jeto)[0];
}

/**
 * Devuelve una cadena sin acentos
 * @param {string} palabra 
 * @returns {string}
 */
function limpiaPlb(palabra = "") {
    let sinAcento = {
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
        "ü": "u",
        "ñ": "n",
        "Á": "A",
        "É": "E",
        "Í": "I",
        "Ó": "O",
        "Ú": "U",
        "Ü": "U",
        "Ñ": "N"
    };

    return palabra.replace(/[áéíóúñ]/ig, letra => sinAcento[letra])
}

/**
 * Devuelve una fecha sin separadores
 * @param {string} f Fecha con "/" y ":"
 * @returns {string} 
 */
function limpiaF(f) {
    // 
    return f.replace(/(\.|\:|[-A-Z])/gi,"")
}

/**
 * @param {string} texto a entrecomillar
 * @param {boolean} simples Si son comillas simples
 * @returns {string} Texto entre comillas
 */
function entreComillas(texto,simples) { return (simples ? "'" : '"') +texto +(simples ? "'" : '"')}

/**
 * @returns {object} Parámetros pasados a traves de la url
 */
function rogUrlPrm() {
    const prms = {};
    window.location.href.replace(
		/[?&]+([^=&]+)=([^&]*)/gi, 
		(m,que,valor) => 
			prms[que] = decodeURIComponent(valor)
    );
    return prms;
}

/**
 * Elemento tipo. Normalmente se usa para mostrar cantidad de registros
 * @param {any} cant 
 * @param {*} opcional 
 * @returns {string} codigo html
 */
function spanCant(cant,opcional) {
  return opcional && !cant ? "" : `<sup><span class='badge'>${cant}</span></sup>`;
}

/**
 * Contruye texto HTML de un elemento
 * @param {string} contenido "innerHTML" del elemento
 * @param {string} que tipo de elemento ("Tag")
 * @param {clase} clase atributo "clase" del elemento
 * @param {object} opcs atributos del elemento
 * @returns {string}
 */
const domTxt = (contenido,que,clase,opcs = {}) => `<${que} ${clase ? " class='" +clase+"'" : ""}${creaOpcs(opcs)}>${contenido}</${que}>`;

/**
 * Cadena de atributos
 * @param {object} opcs atributos
 * @returns {string}
 */
function creaOpcs(opcs) {
    const nbAtributo = (atrib) => atrib === "cursor" ? "style.cursor" : atrib;
    
    return Object.entries(opcs).map(([x,valor]) => ` ${nbAtributo(x)}= '${valor}'`).join(" ")
}

/**
 * Encuentra la clase "rog..." de un elemento dado
 * @param {element | string} dom 
 * @returns {string}
 */
function nivelDe(dom) {
    return Array.from(objDom(dom).classList).find(x => x.startsWith("rog"))
}

/**
 * La clase "activa" se utiliza para identificar elementos en particular
 * Se deselecciona el elemento "activo" del mismo "nivel" (Ver "nivelDe") y se "activa" el elemento dado
 * @param {element} opc Elemento a "activar"
 * @param {string} nivel Nivel de los elementos (Clase "rog...")
 * @param {boolean} toggle Si se alterna la clase
 * @param {string} activa clase a aplicar
 */
function rogActiva(opc, nivel = "."+nivelDe(opc),toggle=false,activa = "activa") {
  let actual = document.querySelector(`${nivel}.${activa}`);
  
  if(actual === opc) {
    if(toggle) actual.classList.toggle(activa);
    else actual.classList.add(activa);
  } else {
    if(actual) actual.classList.remove(activa);
    opc.classList.add(activa);
  }
}

/**
 * ¡OJO! No funciona, por ... de navegador
 * La idea es tenerlo para copiarlo e incorporarlo al fuente que lo necesite
 * Copia al Portapapeles
 * Puede ser una expresión o el contenido de un elemento
 * @param {string | element} elemento Texto o elemento
 */
function rogCopia(elemento) {
    const expresion = typeof elemento === "string" ?
        elemento :
        (() => {
            elemento.select();
            elemento.setSelectionRange(0, 99999); // requerido por los celulares
            return elemento.value;
        })();
    navigator.clipboard.writeText(elemento.value);
}
  
// Funciones 
/**
 * Valor de una expresion. Si es nula o indefinida, devuelve ""
 * @param {any} x Expresión
 * @returns {any}
 */
const def = x => x || "";

/**
 * Función de comparación para ser usada por "Array.sort"
 * @param {string | array} Nombres de los campos
 * @param {boolean} descendente Si el orden de la comparación es descendiente
 * @returns {function}
 */
function strCompara(campo,descendente){
    let menor = -1, mayor = 1;
    let que = campo;
    const comp1 = (a,b) => (def(a[que]) < def(b[que])) ? menor : (def(a[que]) > def(b[que])) ? mayor : 0;
    let _campos = desarma(que);
    function comp(a,b) {
      let retorno;
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
 * Crea un arreglo
 * @param {string | object | } lista puede ser:
 *      1. Una lista de palabras separada por coma y un espacio en una cadena de caracteres: "A, B, C"
 *      2. Un objeto: { A: ..., B: ..., C: ... }
 *      3. Un arreglo ["A", "B", "C"]
 * @returns {array} en los tres casos devuelve ["A", "B", "C"]
 */
function desarma(lista) {
    let retorno = [];
    if(lista) {
        if(lista instanceof Array) retorno = lista;
        else if(typeof lista === "string") retorno = lista.split(", ");
        else retorno = Array.from(Object.keys(lista));
    }
    return retorno;
}

/**
 * Nombre único según la fecha
 * @param {string} prefijo del nombre
 * @returns El prefijo con la fecha en forma serial de sufijo
 */
const nbSerial = (prefijo = "") => prefijo +rogFmt.Fecha().serial();

/**
 * Extrae la extensión de un nombre de archivo
 * @param {string} nbArchivo 
 * @returns {string}
 */
function Extension(nbArchivo){
    const pos = nbArchivo.lastIndexOf(".");
    let retorno = pos >= 0 ? nbArchivo.slice(pos +1) : "";
    return retorno.startsWith("/") ? "" : retorno;
}
 
/**
 * Extrae el nombre de archivo
 * @param {string} txt 
 * @returns {string}
 */
function nbArchivo(txt) {
    let pos = txt.lastIndexOf(".");
    return txt.slice(0,pos);
}

/**
 * Indica si un elemento no contiene nada
 * @param {element | string} dom 
 * @returns {boolean}
 */
function domVacia(dom) {
    return !Boolean(objDom(dom).textContent);
}

/**
 * Especificaciones para una nueva ventana (window.open)
 * @param {object} cambios Parámetros a redefinir
 * @returns {object}
 */
function vntSpecs(cambios ={}) {
    const defecto = {
        fullscreen: 0, // Mostrar en pantalla completa
        height: 800, 
        width: 600,
        left: 200, 
        top: 200,
        location: 0, // Mostrar el campo de dirección (No)
        menubar: 0, // Mostrar la barra de menú (No)
        resizable: 1,
        scrollbars: 0,
        status: 1, // Mostrar la barra de estado (Si)
        titlebar: 1, // Mostrar la barra de título (Si)
        toolbar: 0 // Mostrar la barra de herramientas del navegador
    }

    const retorno = Object.assign(defecto,cambios);
    return Object.entries(retorno).map(x => `${x[0]}=${x[1]}`).join(", ")
}

/**
 * Abre una nueva ventana
 * @param {string | object} url de la nueva ventana (Si es un objeto se usa su propiedad "url")
 * @param {*} cambios Especificaciones de la nueva ventana
 */
function otraVnt(url, cambios) {
    if (typeof url === "object") url = url.target.url;
    window.open(url, "_blank", vntSpecs(cambios));
    return false;
}

/**
 * Abre una ventana en blanco. Si la ventana contiene una funcion "debut", esta es ejecutada
 * @param {string} contenido para mostrar en la ventana
 */
function neaVnt(contenido) {
    let vnt = window.open("");
    vnt.document.body.innerHTML = contenido;
    vnt.document.close();
    if(vnt.debut) vnt.debut();
}

/**
 * Asigna una "escucha"
 * @param {string | array} selector del (de los) elemento(s) a serles asignada la "escucha"
 * @param {string} evento evento a escuchar
 * @param {function} fn función de la "escuvha"
 */
function rogAsigna(selector,evento,fn) {
    let arreglo = selector;
    if(typeof selector === "string") arreglo = document.querySelectorAll(selector);
    else if(!selector.__proto__.hasOwnProperty("length")) arreglo = [selector];

    for(let x = 0; x < arreglo.length;x++) {
        arreglo[x].i = x;
        if(evento.startsWith("on")) arreglo[x][evento] = fn;
        else arreglo[x].addEventListener(evento,fn);
        arreglo[x].style.cursor = "pointer";
    }
}

/**
 * Extrae el valor de un argumento
 * Recibe: Un evento o un valor
 * Retorna:
 *  1. @param prm
 *  2. La propiedad value del evento
 *  3. La propiedad textContent del evento
 * 
 * @param {any} prm 
 * @returns {any}
 */
function rogPrm(prm) {
    return prm.target ?
        (prm.target.value === undefined ?
        prm.target.textContent : prm.target.value)
    : prm
}

/**
 * Asocia un boton con la lectura de un elemento
 * El botón se habilita con la evaluación de la función
 * Al pulsar [Enter] se ejecuta el "click" del botón
 * @param {element | string} dom
 * @param {element | string} boton
 * @param {function} fn
 */
function btnDefault(dom,boton,fn = Boolean) {
	let btn = objDom(boton);
    let obj = objDom(dom);

	obj.oninput = (e) => { btn.disabled = !fn(e.target.value) };
	obj.onkeypress = (e) => { if(e.keyCode === 13) btn.click() };
}

/**
 * Modifica la propiedad "style" de @param dom
 * con las reglas en el arreglo @param reglas
 * 
 * @param {element | string} dom 
 * @param {object} reglas 
 */
function modCss(dom,reglas) {
	let css = objDom(dom).style;
	let asignaCss = x => css[x[0]] = x[1];
	for (let regla in reglas) {
		if(reglas[regla] instanceof Array ) {
			reglas[regla].forEach(asignaCss);
		} else css[regla] = reglas[regla];
	}
}

/**
 * 
 * @param {*} dom 
 */
function mstModal(dom) {
    objDom(dom).classList.add("activa");
    rogAsigna(".rogCierraModal","onclick",cierraModal);
}

function cierraModal(e) {
    let vnt = rogAncetre(e.target,".rogModal")
    
    if(vnt.tiempo) clearTimeout(vnt.tiempo);
    
    vnt.classList.remove("activa");
}

/**
 * Devuelve el elemento superior de @param dom
 * que coincida con @param selectorPa
 *
 * @param {element | string} dom elemento
 * @param {string} selectorPa Selector
 * @returns {element | null}
 */
function rogAncetre(dom,selectorPa) {
    let pa = objDom(dom);
    while (!((pa.matches(selectorPa)) || pa.matches("BODY"))) { pa = pa.parentElement}
    return pa.matches("BODY") ? null : pa;
}

// Manejo de Errores

/**
 * Arma el objecto mensaje de error
 * @param {string} msj 
 * @param {element | string} campo 
 * @returns {object}
 */
function rogError(msj,campo) {
    return { fallo: true, msj, campo };
}

/**
 * Selecciona un campo según su propiedad "name"
 * @param {element | string} campo o nombre del campo
 * @returns {element}
 */
function campoError(campo) {
    return typeof campo === "string" ? 
        document.querySelector("[name=" +campo +"]") : 
        campo;
}

/**
 * Campo de error previsto para un campo dado
 * Según la estructura:
 * <input name="nombre">
 * <output for="nombre" class="error">
 * @param {element | string} campo 
 * @returns {element}
 */
function campoMsjError(campo){
    return typeof campo === "string" ? 
        document.querySelector(".msjError[for=" +campo +"]") : 
        campo;
}

/**
 * "Limpia" los campos con clase "error"
 */
function lmpErrores() {
    document.querySelectorAll(".msjError").forEach(x => x.innerHTML = "");
}

/**
 * Se muestra un mensaje de Error y se "activa" el campo correspondiente
 * @param {object | string} msj 
 */
function rogFallo(msj) {
    let campo;
    
    function mstMsj(msj) {
        if (typeof msj === "string") alert(msj || "¡No tengo conexión con la Base de Datos!");
        else {
            mstMsj(msj.msj);
            if(msj.campo) {
                const campo = campoMsjError(msj.campo)
                if(campo) campo.innerHTML = msj.msj;
            }
        }
    }
    
    if(Array.isArray(msj.msj)) {
        msj.msj.forEach(mstMsj);
        campo = campoError(msj.msj[0].campo);
    } else {
        mstMsj(msj);
        campo = campoError(msj.campo);
    };

    if(campo) rogFocaliza(campo);
}

/**
 * Focaliza un elemento
 * @param {element} elemento 
 */
function rogFocaliza(elemento) {
    elemento.focus();
    elemento.select();    
}

/**
 * Limpia los elementos "textarea" (Porque suelen tener espacios suplementarios)
 * @param {*} frm 
 */
function limpiaTextAreas(frm) {
    Array.from(frm.querySelectorAll("textarea")).forEach(x => x.value = x.value.trim());
}

// H T T P
/**
 * Analiza la respuesta recibida
 * @param {XMLHttpRequest} xobj
 * 
 * Asigna las propiedades
 * @property {string} tipoResultado y
 * @property {object} resultado
 */
function analizaxObj(xobj) {
    if(huboError(xobj)) xobj.tipoResultado = "error";
    else {
        xobj.tipoResultado = typeof xobj.responseText === "string" ?
            xobj.responseText.startsWith("<!") ?
                "página" : "respuesta" :
                "objeto";

        try {
            xobj.resultado = xobj.tipoResultado === "respuesta" ?
                JSON.parse(xobj.responseText) :
                xobj.responseText;            
        } catch (error) {
            xobj.tipoResultado = "error";
            xobj.resultado = {msj: error};
        }

        if (huboError(xobj)) xobj.tipoResultado = "error";
    }
}

/**
 * Evalúa si la respuesta indica un error
 * @param {XMLHttpRequest} xobj 
 * @returns {boolean}
 */
function huboError(xobj) {
    return ((xobj.status == 0) || (xobj.status >= 400)) || (xobj.resultado && xobj.resultado.fallo);
}

/**
 * Arma el mensaje de Error correspondiente
 * @param {XMLHttpRequest} xobj 
 * @returns {string}
 */
function msjError(xobj) {
    return (xobj.resultado && xobj.resultado.fallo) ?
        (xobj.resultado.msj instanceof Array ? xobj.resultado.msj.join("\n") : xobj.resultado.msj) :
        `${xobj.accion}\n${xobj.url}\n¡E R R O R!!!\nStatus: ${xobj.status} (${xobj.statusText})\n${xobj.status}`;
}

/**
 * Ejecuta @param {string} acción http sobre la dirección @param {string} url
 * Envía @param {object} datos como "body" de la acción
 * 
 * Según el retorno:
 *   Si hay un error o el retorno tiene la propiedad "fallo" en "true"
 *      Se muestra un mensaje (alert)
 *       
 *   Si no: Se llama @param {function} fn con el retorno como argumento
 *
 * @param {string} accion HTTP ("GET", "PUT", etc.)
 * @param {string} url 
 * @param {function} fn "callback function"
 * @param {object} datos a ser envíados
 */
function accede(accion,url,fn,datos) {
    const xobj = new XMLHttpRequest();
    const xmlEstado = ["No inicializado", "Conectado", "Recibido", "Procesando", "Listo"];
    const mstEstado = (xobj) => console.log(`${xobj.readyState} ${url}, ${xobj.accion.toUpperCase()} ${xmlEstado[xobj.readyState]} (${xobj.status})`);

    /**
     * Vuelve de la llamada AJAX
     * @param {XMLHttpRequest} xobj 
     */
	function retorno(xobj) {
        mstEstado(xobj);

        if(xobj.tipoResultado === "error") {
            //alert(msjError(xobj));
            rogFallo(objError(xobj));
            //if(typeof xobj.resultado === "string") neaVnt(xobj.responseText);
        } else {
            if(xobj.tipoResultado === "página") document.body.innerHTML = xobj.resultado;
            else {
                if(fn) fn(xobj.resultado);
                else alert(xobj.resultado);
            }
        }
    }

    /**
     * Objeto de Error
     * @param {XMLHttpRequest} xobj 
     * @returns {object}
     */
	function objError(xobj) {
        return (xobj.resultado && xobj.resultado.fallo) ?
		    xobj.resultado :
            { 
                fallo: true, 
                msj: xobj.statusText || "No puedo comunicarme con la B.D.", 
                status: (xobj.resultado && xobj.resultado.status) || xobj.status
            }
	}

    /**
     * Cuando hubo error durante la llamada
     * @param {Event} e 
     */
    function aborta(e) {
        retorno({tipoResultado: "error", ...e.target});
    }

    xobj.accion = accion;
    xobj.url    = url;

    xobj.overrideMimeType("application/json");
    //xobj.withCredentials = true;
    xobj.open(accion, url, true);
    xobj.setRequestHeader('Access-Control-Allow-Origin',"*");
    xobj.setRequestHeader('Content-type','application/json; charset=utf-8');
    xobj.onerror = aborta;
    //xobj.onreadystatechange = if(xobj.readyState == 4) mstEstado();
    xobj.onload = () => {
        analizaxObj(xobj);

        retorno(xobj);
	};

    xobj.send(JSON.stringify(datos));
}
