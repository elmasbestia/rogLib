// Librería de funciones para JS
// Autor: Rafa Gómez https://rafagomez.neocities.org

// Formatos numéricos    
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
    Fecha: (f = new Date()) => f.getFullYear()+"-"+rogFmt.dd(f.getMonth() +1)+"-"+rogFmt.dd(f.getDate()),
    Hora: (f = new Date()) => rogFmt.dd(f.getHours())+":"+rogFmt.dd(f.getMinutes()),
    dd: nro => (nro > 9 ? "" : "0") + nro,
    fSerial: (f = new Date()) => f.getFullYear()+rogFmt.dd(f.getMonth()+1)+rogFmt.dd(f.getDate()) +rogFmt.dd(f.getHours())+rogFmt.dd(f.getMinutes())
}

function escogeUna(a) {
	return a[Math.floor(Math.random() *a.length)]
}

//              Funciones con DOM
function objDom(dom) { return typeof dom === "string" ? document.getElementById(dom) : dom }

function objVacio(obj) { return Object.entries(obj).length === 0 }

function jeto(que,valor) {
    let obj = {};
    if(que instanceof Array) que.forEach(x => obj[x] = valor[x]);
    else obj[que] = valor;
    return obj;
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
    let retorno = "";
    for(let x in opcs) { retorno += ` ${x}='${opcs[x]}'`}
    return retorno;
}

function quitaClase(clase) {
    let x = document.querySelectorAll("."+clase);
    x.forEach(x => {x.classList.remove(clase)});
}

function nivelDe(dom) {
    let retorno;
    objDom(dom).classList.forEach(x => { if(x.slice(0,3) === "rog") retorno = x })
    return retorno;
}

function rogActiva(opc) {
  let _nivel = nivelDe(opc);

  let actual = document.querySelector("."+_nivel+".activa");

  if(actual) actual.classList.remove("activa");
  if(actual !== opc) opc.classList.add("activa");
}

function strCompara(campo,descendente){
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
    function def(x) { return x || "" }
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
    // 3. Si @param valores es Un arreglo, devuelve la referencia correspondiente

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

const nbSerial = (prefijo = "") => prefijo +rogFmt.fSerial();

function Extension(nbArchivo){
    var retorno = "";
    var pos = nbArchivo.lastIndexOf(".");

    if (pos >= 0) { retorno = nbArchivo.slice(pos +1) }
    return retorno;
}
        
function nbArch(nbArchivo) {
    let pos = nbArchivo.lastIndexOf(".");
    return nbArchivo.slice(0,pos);
}

function domVacia(dom) {
    return !Boolean(objDom(dom).textContent);
}

function otraVnt(url, ancho=600, alto=800) {
    if (typeof url === "object") url = url.target.url;
    window.open(url, "_blank", 'width=' +ancho + 'px,height=' + alto + 'px,left=200,top=200');
    return false;
}

function rogAsigna(selector,evento,fn) {
    if(typeof selector === "string") {
        let arreglo = document.querySelectorAll(selector);
        for(let x = 0; x < arreglo.length;x++) {
            arreglo[x].i = x;
            arreglo[x][evento] = fn;
            arreglo[x].style.cursor = "pointer";
        }
    } else selector[evento] = fn;
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
	
	function msjErrorXML(e) {
		alert(xobj.accion+"\n"+xobj.url+"\n¡E R R O R!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")\n"+xobj.status);
	}
     
    xobj.accion = accion;
    xobj.url    = url;
     
    xobj.overrideMimeType("application/json");
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

function regVacio(Stru) {
	let retorno = {};
	for(let x in Stru) {
		retorno[x] = valPorOmision(Stru[x]);
	}
	return retorno;
}

function mstModal(dom) {
    objDom(dom).style.display = "block";
    rogAsigna(".rogCierraModal","onclick",cierraModal);
}

function rogAncetre(dom,clasePa) {
    let pa = objDom(dom);
    while (!pa.classList.contains(clasePa)) { pa = pa.parentElement}
    return pa;
}

function cierraModal(e) {
    rogAncetre(e.target,"rogModal").style.display = "none";
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
    retorno += "><img src='Imagenes/" +src +(Extension(src) ? "" : ".jpg") 
    retorno += txtProps(imgProps);
    retorno += "><figcaption>"+caption+"</figcaption></figure>";
    return retorno;
}

function tabTitulos(campos) {
    return domTxt(
        domTxt(
            campos.reduce((linea,valor, i) => linea += domTxt(valor,"th"),""),
            "tr"
        ),
        "thead"
    );
}

function creaCombo(datos,dom,item) {
    // Crea el dom de un combo cargado con 
    // @param datos en el @param dom
    // Si se omite @param dom se devuelve el codigo HTML correspondiente
    // @param item puede ser:
    // 1. el nombre de un elemento en datos
    // 2. un Objeto { valor:, texto } con el nombre de los elementos a usar
    // 3. Si se omite, es el valor en datos

    let valor = x => x;
    let texto = x => x;
    if(item) {
        if(typeof item === "string") {
            valor = x => x[item];
            texto = x => x[item];
        } else {
            valor = x => x[item.valor];
            texto = x => x[item.texto]; 
        }
    }
    
    let _combo = datos.reduce((combo,x)=> combo +="<option value='"+valor(x)+"'>"+texto(x)+"</option>","<select>")+"</select>";
//+spanCant(x.cant,true)
    if(dom) {
        let _dom = objDom(dom);
        _dom.innerHTML = _combo;
    } else return _combo;

}

function creaOpcion(item) {
	var opcion = document.createElement("OPTION");

	if (typeof item === "string") {
		opcion.value = item
		opcion.appendChild(document.createTextNode(item))
	} else {
		opcion.value = item.valor
		opcion.appendChild(document.createTextNode(item.texto));
	}
	return opcion;
}
          
function domLinea (valores,clsLinea,clsCelda,fmts) {
    return domTxt(valores.reduce((linea,valor, i) => linea += domCelda(valor,clsCelda === i ? 'rogId': null),""), "tr",clsLinea);
}

function domCelda(valor,clase) { return domTxt(valor || "","td",clase)  }

function mstLista(datos,dom,caption = "", campos = null,fn = null,nbId="") {
	let donde = objDom(dom);
    let valor, titulo, clase;

/*
    if(campos) [valor,titulo, clase] = campos;
    else {
        [valor,titulo] = Object.keys(datos[0]);
        clase = "rogLi";
    }
*/

    if(datos.length) {
        let indice = campos ? (campos.valor ? (e,i) => e[campos.valor] : (e,i) => i) : (e,i) => i;
        let texto  = campos ? (campos.texto ? e => e[campos.texto] : e => e) :  (e => e);
        let title  = campos ? campos.title || null : null;
      
        donde.innerHTML = "";
        
        if(caption) {
            let tit = document.createElement("H3");
            tit.className = "rogTitLista";
            tit.innerHTML = caption+spanCant(datos.length);
            donde.appendChild(tit);
        }
                        
        let lista = document.createElement("OL");
        donde.appendChild(lista);

        datos.forEach((e,i) => {
            let li = document.createElement("LI");
            li.className = clase;
            li.value = indice(e,i);
            if(typeof e === "string") li.textContent = e;
            else {
                li.textContent = texto(e); 
                if(title) li.title = e[title];
            }
            if(fn) rogAsigna(li,"onclick",fn);
            lista.appendChild(li);
        });
    } else {
        donde.innerHTML = "<h3 class='rogTitLista'>No hay " +(caption || "datos")+ "</h3>"
    }
}

function mstTabla(datos,dom,caption = "",campos = null,Fn = null,nbId="") {
	let donde = objDom(dom);
    
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
}
