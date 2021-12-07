// Librería de funciones para JS
// Autor: Rafa Gómez https://rafagomez.neocities.org

// Formatos
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
    Pc: new Intl.NumberFormat('VES', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format,
    Tlf: nro => {
        let _nro = nro.toString();
        return `(${_nro.slice(0,3)}) ${_nro.slice(3,6)}  ${_nro.slice(7)}`
    },
    dd: nro => (nro > 9 ? "" : "0") + nro,
    Fecha: rogFmtFecha,
    Lapso: (desde = new Date(), hasta = new Date()) => `Desde el ${rogFmt.Fecha(desde).dma()} hasta el ${rogFmt.Fecha(hasta).dma()}`
}

function rogFmtFecha (f = new Date()) {
    /*
        toString          : Tue Dec 15 2020 13:08:12 GMT-0400 (hora de Venezuela)
        toDateString      : Tue Dec 15 2020
        toISOString       : 2020-12-15T17:08:12.901Z
        toJSON            : 2020-12-15T17:08:12.901Z
        toLocaleDateString: 15/12/2020
        toLocaleString    : 15/12/2020 1:08:12 p. m.
        toUTCString       : Tue, 15 Dec 2020 17:08:12 GMT
    */
    f = creaFecha(f);
    return {
        amd: () => f.toJSON().slice(0,10),
        //f.getFullYear()+"-"+rogFmt.dd(f.getMonth() +1)+"-"+rogFmt.dd(f.getDate()),
        dma: () => f.toLocaleDateString(),
        //rogFmt.dd(f.getDate())+"/"+rogFmt.dd(f.getMonth() +1)+"/"+f.getFullYear(),
        am:  () => f.toJSON().slice(0,7),
        Hora: () => rogFmt.dd(f.getHours())+":"+rogFmt.dd(f.getMinutes()),
        fSerial: () => limpiaF(f.toJSON()),
        //f.getFullYear()+rogFmt.dd(f.getMonth()+1)+rogFmt.dd(f.getDate()) +rogFmt.dd(f.getHours())+rogFmt.dd(f.getMinutes()),
        a: () => f.getFullYear(),
		full: () => f.toJSON(),
        cool: () => getDiaSemana(true,f) + " " + f.getDate() +" de "+ nbMes(null,f),
        serio: () => getDiaSemana(null,f) + " " + f.getDate() +" de "+ nbMes(null,f) +" de "+ f.getFullYear()
    }
}

// Creación de fechas
function creaFecha(ano, mes, dia) {
        // Devuelve un objeto fecha a partir de los parámetros enviados
        // si no se envía nada, devuelve la fecha de hoy
        var fecha;
        
        if (mes === undefined) {
            if (ano === undefined) {
              let hoy = new Date();
              if(dia === undefined) fecha = hoy;
              else fecha = new Date(hoy.getFullYear(), hoy.getMonth(), dia);
            } else {
                if (typeof(ano) === "object") fecha = ano instanceof Date ? ano : ano.fecha()
                else {fecha = new Date(ano) }
            }
        } else {
            if (ano === undefined) fecha = new Date(ano,mes);
            else fecha = new Date(ano, mes, dia || 1);
        }
        return fecha;
}

function getDiaSemana(corto = false,f) {
  var retorno = "";
  retorno = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"][f.getDay()];
  return corto ? retorno.slice(0,3) : retorno;
}

function nbMes(corto = false,f) {
  // @param corto indica si se devuelve el nombre completo o en tres letras solamente
  // @param f puede ser una fecha o un número relativo al mes de "fecha", por defecto, es "fecha"
  var retorno;
  if (f) {
      if (typeof f === "number") { f = new Date(fecha.getFullYear(), fecha.getMonth() +f, fecha.getDate())}
  } else f = this.fecha();
  retorno = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][f.getMonth()];
  return corto ? retorno.slice(0,3) : retorno;
}

function escogeUna(a) {
	return a[Math.floor(Math.random() *a.length)]
}

//              Funciones con DOM
function objDom(dom) { return typeof dom === "string" ? document.getElementById(dom) : dom }

function objVacio(obj) { return !(obj && Object.entries(obj).length) }

function jeto(que,valor) {
    let obj = {};
    if(que instanceof Array) que.forEach(x => obj[x] = valor[x]);
    else obj[que] = valor;
    return obj;
}

function limpiaPlb(palabra = ""){
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

    return palabra.replace(/[áéíóúñ]/ig, letra => sinAcento[letra])
}

function limpiaF(f) {
    return f.replace(/(\.|\:|[-A-Z])/gi,"")
}

function entreComillas(texto,simples) { return (simples ? "'" : '"') +texto +(simples ? "'" : '"')}

function valDom(nb) { return document.querySelector("[name="+nb+"]").value }

function rogUrlPrm() {
    var prms = {};
    var partes = window.location.href.replace(
		/[?&]+([^=&]+)=([^&]*)/gi, 
		(m,que,valor) => 
			prms[que] = decodeURIComponent(valor)
    );
    return prms;
}

function spanCant(cant,opcional) {
  return opcional && !cant ? "" : "<sup><span class='badge'>"+cant+"</span></sup>"
}

const domTxt = (contenido,que,clase,opcs) => "<"+ que +(clase ? " class='" +clase+"'" : "")+creaOpcs(opcs)+">" +contenido +"</"+que+">";

function creaOpcs(opcs) {
    function nbAtributo(atrib) {
        return atrib === "cursor" ? "style.cursor" : atrib;
    }
    
    let retorno = "";
    for(let x in opcs) { retorno += ` ${nbAtributo(x)}= '${opcs[x]}'`}
    return retorno;
}

function nivelDe(dom) {
    return Array.from(objDom(dom).classList).find(x => x.startsWith("rog"))
}

function rogActiva(opc, nivel = "."+nivelDe(opc)) {
  let actual = document.querySelector(nivel+".activa");

  if(actual) actual.classList.remove("activa");
  if(actual !== opc) opc.classList.add("activa");
}

// Funciones 

const def = x => x || "";

function strCompara(campo,descendente){
    /*
        Función que compara dos objetos sobre la base de uno o varios de sus elementos
        @param campo      : es la lista de elementos a comparar
        @param descendente: si es verdadero, la comparación es descendente 

        Uso: para el método "sort" de un arreglo de objetos
    */
    
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

function desarma(lista) {
    // Crea un arreglo a partir de:
    // 1. Una lista de palabras separada por coma y un espacio en una cadena de caracteres: "A, B, C"
    // 2. Un objeto: { A: ..., B: ..., C: ... }
    // 3. Si @param valores es Un arreglo devuelve la referencia correspondiente

    let retorno = [];
    if(lista) {
        if(lista instanceof Array) retorno = lista;
        else if(typeof lista === "string") retorno = lista.split(", ");
        else retorno = Object.keys(lista);
    }
    return retorno;
}

function desarmaObj(obj) {
    // Crea un arreglo con los elementos de un Objeto
	return Object.keys(obj).map(x => obj[x])
}

const nbSerial = (prefijo = "") => prefijo +rogFmt.Fecha().fSerial();

function Extension(nbArchivo){
    var retorno = "";
    var pos = nbArchivo.lastIndexOf(".");

    if (pos >= 0) { retorno = nbArchivo.slice(pos +1) }
    return retorno;
}
        
function nbArchivo(txt) {
    let pos = txt.lastIndexOf(".");
    return txt.slice(0,pos);
}

function domVacia(dom) {
    return !Boolean(objDom(dom).textContent);
}

function otraVnt(url, ancho=600, alto=800) {
    if (typeof url === "object") url = url.target.url;
    window.open(url, "_blank", 'width=' +ancho + 'px,height=' + alto + 'px,left=200,top=200');
    return false;
}

function neaVnt(contenido) {
    var vnt = window.open("");
    vnt.document.write(contenido);
}
  
function rogAsigna(selector,evento,fn) {
    let arreglo = selector;
    if(typeof selector === "string") {
        arreglo = document.querySelectorAll(selector);
    } else {
        if(!selector.__proto__.hasOwnProperty("length")) arreglo = [selector];
    }
    for(let x = 0; x < arreglo.length;x++) {
        arreglo[x].i = x;
        arreglo[x][evento] = fn;
        arreglo[x].style.cursor = "pointer";
    }
}

function rogPrm(prm) {
    return prm.target ?
        (prm.target.value === undefined ?
        prm.target.textContent : prm.target.value)
    : prm
}

function btnDefault(dom,boton,fn) {
	let btn = objDom(boton);
    let obj = objDom(dom);
    if(!fn) fn = Boolean;
	obj.oninput = (e) => { btn.disabled = !fn(e.target.value) };
	obj.onkeypress = (e) => { if(e.keyCode === 13) btn.click() };
}

function modCss(dom,reglas) {
	let css = objDom(dom).style;
	let asignaCss = x => { css[x[0]] = x[1] };
	for (let regla in reglas) {
		if(reglas[regla] instanceof Array ) {
			reglas[regla].forEach(asignaCss);
		} else {
			css[regla] = reglas[regla];
		}
	}
}

function accede(accion,url,fn,datos) {
    let xobj = new XMLHttpRequest();
    let xmlEstado = ["No inicializado", "Conectado", "Recibido", "Procesando", "Listo"];
	
	function retorno(resultado) {
        if(fn) {
            fn(typeof resultado === "string" ? 
                JSON.parse(resultado) : 
                resultado
            );
        } else if(!resultado.fallo) neaVnt(resultado);
    }
	
    function respuestaError({statusText, status}) {
        return { 
			fallo: true, 
			msj: statusText || "No puedo comunicarme con la B.D.", 
			status 
		}
    }
    
    function msjError(xobj) {
        return xobj.responseText.fallo ?
            (xobj.responseText.msj instanceof Array ? xobj.responseText.msj.join("\n") : xobj.responseText.msj) :
            xobj.accion+"\n"+xobj.url+"\n¡E R R O R!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")\n"+xobj.status;
    }

	function mstError(e) {
		alert(msjError(xobj));
        retorno(xobj.responseText.fallo ? 
			xobj.responseText : 
			respuestaError(xobj)
		);
	}

    function huboError(xobj) {
        return (!xobj.status || (xobj.status >= 400)) || xobj.responseText.fallo;
    }
     
    xobj.accion = accion;
    xobj.url    = url;

    xobj.overrideMimeType("application/json");
    xobj.withCredentials = true;
    xobj.open(accion, url, true);
    xobj.setRequestHeader('Content-type','application/json; charset=utf-8');
    xobj.onerror = mstError;
    xobj.onreadystatechange = () => { console.log(xobj.readyState, url, xmlEstado[xobj.readyState]," (", xobj.status,")") };
    xobj.onload = () => {
		if (huboError(xobj)) mstError()
        else retorno(xobj.responseText);
	};
    xobj.send(JSON.stringify(datos));
}

function regVacio(Stru) {
	let retorno = {};
	for(let x in Stru) {
		retorno[x] = valPorOmision(Stru[x]);
	}
	return retorno;
}

function mstModal(dom) {
    objDom(dom).classList.add("activa");
    rogAsigna(".rogCierraModal","onclick",cierraModal);
}

function rogAncetre(dom,clasePa) {
    // target.matches()
    let pa = objDom(dom);
    while (!pa.classList.contains(clasePa)) { pa = pa.parentElement}
    return pa;
}

function cierraModal(e) {
    let vnt = rogAncetre(e.target,"rogModal")
    
    if(vnt.tiempo) clearTimeout(vnt.tiempo);
    
    vnt.classList.remove("activa");
}

function domImg(src,caption,imgProps,figProps) {
    function txtProps(props) {
        let retorno = "";
        if(props) {
            for(let x in props) {
                retorno += " " +x +"= '" +props[x] +"'";
            }
        }
        return retorno;
    }
    
    let retorno = "<figure";
    retorno += txtProps(figProps);
    retorno += "><img src='Imagenes/" +src +(Extension(src) ? "" : ".jpg");
    retorno += txtProps(imgProps);
    retorno += "><figcaption>"+caption+"</figcaption></figure>";
    return retorno;
}

function tabTitulos(campos) {
    return domTxt(
        domTxt(
            campos.reduce((linea,valor) => linea += domTxt(valor,"th"),""),
            "tr"
        ),
        "thead"
    );
}

function creaCmb(datos,dom,item) {
    // Crea el dom de un combo cargado con @param datos en el @param dom
    // Si se omite @param dom se devuelve el codigo HTML correspondiente
    // @param item puede ser:
    // 1. el nombre de un elemento en datos
    // 2. un Objeto { valor: texto } o {valor: nb del valor, texto: nb del texto} con el nombre de los elementos a usar
    // 3. Si se omite, es el valor del elemento en datos

    let valor = (x,i) => i;
    let texto = x => x;
    if(item) {
        if(typeof item === "string") {
            valor = x => x[item];
            texto = x => x[item];
        } else {
            valor = (x,i) => x[item.valor] || i;
            texto = x => x[item.texto]; 
        }
    }
    
    let _combo = datos.reduce((combo,x,i)=> combo +="<option value='"+valor(x,i)+"'>"+texto(x)+"</option>","<select>")+"</select>";
//+spanCant(x.cant,true)
    if(dom) {
        let _dom = objDom(dom);
        _dom.innerHTML = _combo;
    } else return _combo;

}

function creaOpcion(item) {
	var opcion = document.createElement("OPTION");

	if (typeof item === "string") {
		opcion.value = item;
		opcion.appendChild(document.createTextNode(item));
	} else {
		opcion.value = item.valor;
		opcion.appendChild(document.createTextNode(item.texto));
	}
	return opcion;
}
          
function domLinea (valores,clsLinea,clsCelda,fmts) {
    return domTxt(valores.reduce((linea,valor, i) => linea += domCelda(valor,clsCelda === i ? 'rogId': null),""), "tr",clsLinea);
}

function agrLinea(dom, valores,clsLinea,clsCelda,fmts) {
    objDom(dom).innerHTML += domLinea(valores,clsLinea,clsCelda,fmts);
}

function clsComp(valor,cls) {
    let _valor = def(valor);
    let _cls = _valor && _valor.clase || "";
    if(cls) {
        return cls +" "+_cls;
    } else {
        return _cls;
    }
}

function domCelda(valor,clase = "") { 
    let _valor = def(valor);
    return domTxt(
        (typeof _valor === "object" ? _valor.valor : _valor) || "",
        "td", clsComp(_valor,clase)
    );  
}

function mstTabla(datos,dom,caption = "",campos = null,Fn = null,nbId="") {
	let donde = dom ? objDom(dom) : document.createElement("DIV");
    
    if(datos.length) {
        let tabla = "<table><caption><h3>" +caption+ "<sup><span class='badge'>"+datos.length+"</span></sup></h3></caption>";
        let titulos;
        let _campos = desarma(campos || datos[0]);
        let fnId = _campos.indexOf(nbId);

        datos.forEach(e => {
            if (!titulos) {
                titulos = tabTitulos(_campos)
                tabla += titulos+"<tbody>";
            }
            tabla += domLinea(_campos.map(x => e[x]),null,fnId);
        });
        tabla += "</tbody></table>";

        donde.innerHTML = tabla;
        if (Fn) rogAsigna("#"+donde.id+" .rogId","onclick",Fn);
    } else {
        donde.innerHTML = "<h3>No hay " +caption+ "</h3>"
    }
    if(!dom) return donde.innerHTML;
}

// Manejo de Errores

function rogError(msj,campo) {
    return { fallo: true, msj, campo };
}

function campoError(campo) {
    return typeof campo === "string" ? 
        document.querySelector("[name=" +campo +"]") : 
        campo;
}

function rogFallo(msj) {
    let campo;
    
    function mstMsj(msj) {
        if (typeof msj === "string") alert(msj || "¡No tengo conexión con la Base de Datos!");
        else {
            mstMsj(msj.msj);
            if(msj.campo) campoError(msj.campo).setCustomValidity( msj.msj);
        }
    }
    
    if(msj.msjs) {
        msj.msjs.forEach(mstMsj);
        campo = campoError(msj.msjs[0].campo);
    } else {
        mstMsj(msj);
        campo = campoError(msj.campo);
    };

    if(campo) rogFocaliza(campo);
}

function rogFocaliza(elemento) {
    elemento.focus();
    elemento.select();    
}

function limpiaTextAreas(frm) {
    Array.from(frm.querySelectorAll("textarea")).forEach(x => x.value = x.value.trim());
}
