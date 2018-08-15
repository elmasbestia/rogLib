// Librería de funciones para JS
// Autor: Rafa Gómez https://rafagomez.neocities.org

function objDom(dom) { return typeof dom === "string" ? document.getElementById(dom) : dom }

function objVacio(obj) { return obj.keys().length === 0 }

function valDom(nb) { return document.querySelector("[name="+nb+"]").value }

function rogUrlPrm() {
    var prms = {};
    var partes = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,que,valor) {
        prms[que] = valor;
    });
    return prms;
}

function strCompara(que,descendente){
    var menor = -1, mayor = 1;
    if (descendente) return (a,b) => (a[que] < b[que]) ? mayor : (a[que] > b[que]) ? menor : 0
    else return (a,b) => (a[que] < b[que]) ? menor : (a[que] > b[que]) ? mayor : 0
}

function Extension(nbArchivo){
    var retorno = "";
    var pos = nbArchivo.lastIndexOf(".");

    if (pos >= 0) { retorno = nbArchivo.slice(pos +1) }
    return retorno;
}

function evalRadio(nb) {
    let retorno;

    Array.from(document.querySelectorAll("[name="+nb+"]"))
    .map(x => {
        if(x.checked) retorno = x.value;
    });
    return retorno;
}

function otraVnt(url, ancho=600, alto=800) {
    if (typeof url === "object") url = url.target.url;
    window.open(url, "popup", 'width=' +ancho + 'px,height=' + alto + 'px,left=200,top=200');
    return false;
    // Uso: <a href="" target="popup" onClick="otraVnt(...)">
}

function rogAsigna(selector,evento,fn) {
    if(typeof selector === "string") {
        let arreglo = document.querySelectorAll(selector);
        for(let x = 0; x < arreglo.length;x++) {
            arreglo[x][evento] = fn;
        }
    } else selector[evento] = fn;
}

function rogPrm(prm) { return (typeof prm == "object") ? (prm.target.textContent ? prm.target.textContent : prm.target.value) : prm }

function btnDefault(dom,boton) {
	let btn = objDom(boton);
	let obj = objDom(dom);
	obj.oninput = (e) => { btn.disabled = !Boolean(e.target.value) };
	obj.onkeypress = (e) => { if(e.keyCode === 13) btn.click() };
}

function modCss(dom,reglas) {
	let css = objDom(dom).style;
	let asignaCss = x => { css[x[0]] = x[1]};
	for (let regla in reglas) {
		if(reglas[regla] instanceof Array ) {
			reglas[regla].forEach(asignaCss);
		} else {
			css[regla] = reglas[regla];
		}
		
	}
}

function clsAwesome() {
    // fa-li para elementos de lista
    return {
        espera:     'fa fa-spinner fa-spin',
        bsq:        'fa fa-search',
        guarda:     'fa fa-save',
        vb:         'fa fa-check',
        pdf:        'fa fa-file-pdf',
        video:      'fa fa-film',           // file-video
        imagen:     'fa fa-images',
        info:       'fa fa-info-circle',
        geo:        'fa fa-map-marker-alt',
        tlf:        'fa fa-phone',
        agrega:     'fa fa-plus-circle',
        modificar:  'fa fa-edit',
        eliminar:   'fa fa-minus-circle',
        boleto:     'fa fa-ticket',
        cerrar:     'fa fa-times-circle',
        agenda:     'fa fa-address-book',
        ficha:      'fa fa-address-card',
        prohibido:  'fa fa-ban',
        aviso:      'fa fa-bell',
        cumple:     'fa fa-birthday-cake',
        marca:      'fa fa-bookmark',
        calendario: 'fa fa-calendar-alt',
        fotos:      'fa fa-camera',
        anterior:   'fa fa-caret-left',
        siguiente:  'fa fa-caret-right',
        graf: {
            Barras: 'fa fa-chart-bar',
            Lineas: 'fa fa-chart-line',
            Torta:  'fa fa-char-pie'
        },
        chamo:      'fa fa-child',
        engranes:   'fa fa-cogs',
        comentario: 'fa fa-comment', // sticky-note
        disco:      'fa fa-compact-disk',
        dado: [
                    'fa fa-blank',
                    'fa fa-dice-one',
                    'fa fa-dice-two',
                    'fa fa-dice-three',
                    'fa fa-dice-four',
                    'fa fa-dice-five',
                    'fa fa-dice-six'
        ],
        puerta: {
            cerrada: 'fa fa-door-closed',
            abierta: 'fa fa-door-open',
        },
        correo:      'fa fa-envelope',
        exclamacion: 'fa fa-exclamation', //certificate (For favorite)
        carpeta: {
            cerrada: 'fa fa-folder',
            abierta: 'fa fa-folder-open'
        },
        chequear: {
            si: "fa fa-check-square",
            no: "fa fa-square"
        }
    }
}

function spanAwesome(que) {
    return "<span class='" +Awesome[que] +"'></span>";
}
		
function accede(accion,url,fn,datos) {
    var xobj = new XMLHttpRequest();

	function xmlEstado(estado) {
		switch (estado) {
			case 0: return "No inicializado";	// request not initialized
			case 1: return "Conectado"; 		// server connection established
			case 2: return "Recibido"; 			// request received
			case 3: return "Procesando";		// processing request
			case 4: return "Listo";				// request finished and response is ready
		}
	}
	
	function msjErrorXML(e) {
		alert("¡E R R O R!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")\n"+xobj.status);
	}
     
//			if (datos) datos = JSON.stringify(datos);
     
    xobj.overrideMimeType("application/json");
    xobj.withCredentials = true;
    xobj.open(accion, url, true);
    xobj.setRequestHeader('Content-type','application/json; charset=utf-8');
    xobj.onerror = msjErrorXML;
//            xobj.onprogress = (e) => { console.log("Progress: ", e) }
    xobj.onreadystatechange = () => { console.log(xobj.readyState, url, xmlEstado(xobj.readyState)," (", xobj.status,")") };
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

function leeJson(url,fn,fnDebut) {
    /*
        Lectura de un archivo json
        @param url      dirección del archivo a ser leído
        @param fn       función a ejecutarse con el contenido del archivo
        @param fnDebut  función a ejecutarse antes de iniciar la lectura
    */
    var xobj = new XMLHttpRequest();
    
    xobj.overrideMimeType("application/json");
    xobj.open("GET", url, true);
    xobj.onerror = (e) => {
		alert("Error del Navegador!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")");
	}
    xobj.onloadstart = fnDebut;
    xobj.onreadystatechange = () => {
        console.log("State:",xobj.readyState,"Status:", xobj.status);
        if (xobj.readyState == 4 && xobj.status == "200") {
            console.log("Leyó!")
        }
    };
    xobj.onload = () => { fn(JSON.parse(xobj.responseText)) };
    xobj.send();
}

function escribeJson(url,fn,fnDebut) {
    /*
        Lectura de un archivo json
        @param url      dirección del archivo a ser leído
        @param fn       función a ejecutarse con el contenido del archivo
        @param fnDebut  función a ejecutarse antes de iniciar la lectura
    */
    var xobj = new XMLHttpRequest();
    
    xobj.overrideMimeType("application/json");
    xobj.open("PUT", url, true);
    xobj.onerror = (e) => {
		alert("Error del Navegador!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")")
	}
    xobj.onloadstart = fnDebut;
    xobj.onprogress = (e) => {
		console.log("Progress: ")
	}
    xobj.onreadystatechange = () => {
        console.log("State:",xobj.readyState,"Status:", xobj.status)
        if (xobj.readyState == 4 && xobj.status == "200") {
            console.log("Escribió!")
        }
    };
    xobj.onload = () => { alert("¡Archivo actualizado!") };
    xobj.send();
}

function valPorOmision(campo) {
	let retorno = "";
	if(campo.inicial) {
		retorno = campo.inicial;
	} else {
		if(campo.tipo) {
			if(campo.tipo === "checkbox") retorno = false;
		}
	}
	return retorno;
}

function moveCorresponding(de,a,Stru) {
    var elementos = objDom(a).elements;
    if(elementos) {
        let valores = de;

        let n = elementos.length;
        for (let i = 0; i < n ;i++) {
            let campo = elementos[i]
            let nbCampo = campo.name;
            if (nbCampo) {
                if(campo.type === "radio") {
                    if(valores[nbCampo] !== undefined) {
                        if(campo.value === valores[nbCampo]) campo.checked = true;
                    } else {
                        if(Stru[nbCampo] !== undefined)
                            campo.value = valPorOmision(Stru[nbCampo])
                    }
                }
                else {
                    if(valores[nbCampo] !== undefined) campo.value = valores[nbCampo];
                    else if(Stru[nbCampo] !== undefined) if(campo.value === valPorOmision(Stru[nbCampo]))  campo.checked = true;
                }
            }
        }
    } else {
        elementos = objDom(de).elements;
        let n = elementos.length;
        let valores = a;
        for (let i = 0; i < n ;i++) {
            let nbCampo = elementos[i].name;
            if (nbCampo)
                if(valores[nbCampo] !== undefined) valores[nbCampo] = elementos[i].value;
        };
    }
}

function regVacio(Stru) {
	let retorno = {};
	for(x in Stru) {
		retorno[x] = valPorOmision(Stru[x]);
	}
	return retorno;
}

function mstModal(dom) {
    objDom(dom).style.display = "block";
}

function cierraModal(e) { this.parentElement.parentElement.style.display = "none" }

function creaFormulario(Formulario, Stru) {
	formulario.innerHTML = "";
    for(let x in Stru) {
		let nuevo = document.createElement("LABEL");
		nuevo.htmlFor = x;
		nuevo.textContent = x;
		nuevo.title = "";
		
		formulario.appendChild(nuevo);
		
		if(Stru[x].tipo === "combo") {
			nuevo = document.createElement("SELECT")
			nuevo.id = "cmb" +x
		} else {
			nuevo = document.createElement("INPUT");
			if(Stru[x].tipo) {
				if(Stru[x].tipo !== "auto") nuevo.type = Stru[x].tipo;
			}
		}
		nuevo.name = x;
        if(Stru[x].obligatorio) nuevo.required = true;
		
		formulario.appendChild(nuevo);
		formulario.appendChild(document.createElement("BR"));
	}
}

function tabTitulos(campos) {
    let retorno = "<thead><tr>";
    campos.forEach((x) => { retorno += "<th>"+x+"</th>"; })
    return retorno + "</tr></thead>"
}

function creaCombo(datos,dom,item) {
	let cmb = objDom(dom);
			
	datos.forEach(x => { cmb.appendChild(creaOpcion(item ? x[item] : x)) });
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

    if(datos) {
        let lista = document.createElement("OL");
        //lista.style.list-style-type = "none";
        donde.appendChild(lista);

        datos.forEach((e,i) => {
            let li = document.createElement("LI");
            li.className = clase;
            li.value = i;
            li.textContent = e;
            if(fn) {
                li.onclick = fn;
                li.style.cursor = "pointer";
            }
            lista.appendChild(li);
        });
    } else {
        donde.innerHTML = "<h3>No hay " +caption+ "</h3>"
    }
}

function mstTabla(datos,dom,caption = "",campos = null,Fn = null,nbId="") {
	let donde = objDom(dom);

	function celda(valor,nb) { return "<td"+ (nb === nbId ? " class='rogId'"	: "")+">" + (valor || "") +"</td>" }
    
    if(datos) {
        let tabla = "<table><caption><h3>" +caption+ "<sup><span class='badge'>"+datos.length+"</span></sup></h3></caption>";
        let titulos, linea;

        datos.forEach(e => {
            if (!titulos) {
                titulos = "<thead><tr>";
                if(campos) {
                    if (typeof campos === "string") campos = campos.split(",");
                } else {
                    campos = Object.keys(datos[0]);
                }
                campos.forEach((x) => {
                    titulos += "<th>"+x+"</th>";
                })
                linea = (x,campos) => {
                    campos.forEach((nbCampo) => {
                        tabla += celda(x[nbCampo],nbCampo)
                    })
                }

                titulos += "</tr></thead>";
                tabla += titulos+"<tbody>";
            }
            tabla +="<tr>";
            linea (e,campos);
            tabla +="</tr>";
        });
        tabla += "</tbody></table>";

        donde.innerHTML = tabla;
        if (Fn) {
            let i = 0;
            let rogIds = document.querySelectorAll("#"+donde.id+" .rogId");
            let nRogIds = rogIds.length;
            for(; i < nRogIds; i++ ) {
                rogIds[i].i = i;
                rogIds[i].onclick = Fn;
                rogIds[i].style.cursor = "pointer";
            }
        }
    } else {
        donde.innerHTML = "<h3>No hay " +caption+ "</h3>"
    }
}
