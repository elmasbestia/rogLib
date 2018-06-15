// Librería de funciones para JS
// Autor: Rafa Gómez https://rafagomez.neocities.org

function objDom(dom) { return typeof dom === "string" ? document.getElementById(dom) : dom }

function objVacio(obj) {
    let retorno = true;
    for (let x in obj) { retorno = false }
    return retorno;
}

function Extension(nbArchivo){
    var retorno = "";
    var pos = nbArchivo.indexOf(".");

    if (pos >= 0) { retorno = nbArchivo.slice(pos +1) }
    return retorno;
}
    
function otraVnt(url, ancho=600, alto=800) {
    if (typeof url === "object") url = url.target.url;
    window.open(url, "popup", 'width=' +ancho + 'px,height=' + alto + 'px,left=200,top=200');
    return false;
    // Uso: <a href="" target="popup" onClick="otraVnt(...)">
}

function rogAsigna(selector,evento,fn) {
	let arreglo = document.querySelectorAll(selector);
	for(let x = 0; x < arreglo.length;x++) {
		arreglo[x][evento] = fn;
	}
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
	for (regla in reglas) {
		if(reglas[regla] instanceof Array ) {
			reglas[regla].forEach(x => { css[x[0]] = x[1]})
		} else {
			css[regla] = reglas[regla];
		}
		
	}
}

        function clsAwesome() {
            return {
                espera: 'fa-li fa fa-spinner fa-spin',
                bsq:    'fa fa-search',
                guarda: 'fa fa-save',
                vb:     'fa fa-check'
            }
        }
		
		function accede(accion,url,fn,datos) {
            var xobj = new XMLHttpRequest();

			function xmlEstado(estado) {
				switch (estado) {
					case 0: return "No inicializado";	// request not initialized
					case 1: return "Conectado"; 			// server connection established
					case 2: return "Recibido"; 			// request received
					case 3: return "Procesando";			// processing request
					case 4: return "Listo";				// request finished and response is ready
				}
			}
			
			function msjErrorXML(e) {
				alert("¡E R R O R!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")\n"+xobj.status);
			}
             
//			if (datos) datos = JSON.stringify(datos);
             
            xobj.overrideMimeType("application/json");
            xobj.open(accion, url, true);
            xobj.onerror = msjErrorXML;
//            xobj.onprogress = (e) => { console.log("Progress: ", e) }
            xobj.onreadystatechange = () => { console.log(xobj.readyState, url, xmlEstado(xobj.readyState)," (", xobj.status,")") };
            xobj.onload = () => {
				if (xobj.status < 400) {
					if(accion === "GET") {
						fn(JSON.parse(xobj.responseText));
					} else {
						fn(xobj.responseText);
					}
				} else {
					msjErrorXML();
				}
			};
            xobj.send(datos);
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
                    let campo = elementos[i].name;
                    if(valores[campo] !== undefined) elementos[i].value = valores[campo];
                    else if(Stru[campo] !== undefined) {elementos[i].value = valPorOmision(Stru[campo])}
                }
            } else {
                elementos = objDom(de).elements;
                let n = elementos.length;
                let valores = a;
                for (let i = 0; i < n ;i++) {
                    let campo = elementos[i].name;
                    if(valores[campo] !== undefined) valores[campo] = elementos[i].value;
/*
 *                 valores.forEach(x => {
                    let campo = x.name;
                    if(elementos[campo] !== undefined) x.value = elementos[campo].value;
*/
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
		
		formulario.appendChild(nuevo);
		formulario.appendChild(document.createElement("BR"));
	}
}

function tabTitulos(lista) {
    let retorno = "<thead><tr>";
    lista.forEach((x) => { retorno += "<th>"+x+"</th>"; })
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

function mstTabla(datos,dom,caption = "",lista = null,Fn = null,nbId="") {
	let donde = objDom(dom);

	function celda(valor,nb) { return "<td"+ (nb === nbId ? " class='rogId'"	: "")+">" + (valor || "") +"</td>" }
    
    if(datos) {
        let tabla = "<table><caption><h3>" +caption+ "<sup><span class='badge'>"+datos.length+"</span></sup></h3></caption>";
        let titulos, linea;

        datos.forEach(e => {
            if (!titulos) {
                titulos = "<thead><tr>";
                if(lista) {
                    if (typeof lista === "string") lista = lista.split(",");
                } else {
                    lista = [];
                    for(x in e) lista.push(x);
                }
                lista.forEach((x) => {
                        titulos += "<th>"+x+"</th>";
                })
                linea = (x,lista) => {
                    lista.forEach((nbCampo) => {
                        tabla += celda(x[nbCampo],nbCampo)
                    })
                }

                titulos += "</tr></thead>";
                tabla += titulos+"<tbody>";
            }
            tabla +="<tr>";
            linea (e,lista);
            tabla +="</tr>";
        });
        tabla += "</tbody></table>";

        donde.innerHTML = tabla;
        if (Fn) {
            let i = 0;
            let rogIds = document.getElementsByClassName("rogId");
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
