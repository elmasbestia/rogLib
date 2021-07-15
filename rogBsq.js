/*
    Objeto "buscador"
    
    Presenta una lista con las opciones de búsqueda, un texto para especificar valores de búsqueda y el botón correspondiente
    
    @param dom es el elemento donde se inserta el objeto
    @param opciones es un arreglo de:
        Una cadena de caracteres que se muestra como opción y se envía a la función
        o
        Un objeto con:
            txt:   el texto de la opción
            valor: lo que se pasa a la función (Si se omite, se usa txt)
            sinValBsq: Si es verdadero, esta opción no necesita un valor de búsqueda.
            
    @param fn es la función que se ejecuta para buscar. Recibe los argumentos "que" y "valor"
    
    Además permite mostrar un mensaje a través del método "Espera" (Normalmente de un proceso en ejecución)
*/

function rogBsq(dom, opciones, fn) {
	const bsq = {
        dom: document.createElement("DIV"),
		btn: creaBtn(),
	    val: creaVal(),
        opc: creaOpc(opciones),
        fn:  () => fn(...analValor(bsq.que, bsq.valor)),

        que: "",
        valor: "",
    }
	
	function llamaBsq() {
        bsq.que   = bsq.opc.value;
        bsq.valor = bsq.val.value;
        bsq.fn();
	}
    
    function bsqObj(obj) {
        bsq.que = Object.keys(obj)[0];
        bsq.valor = obj[bsq.que]
        bsq.fn();
    }
    
    function analValor(parm,texto) {
        if(texto.includes("=")) {
            return texto.split("=").map(x => x.trim())
        } else return [parm,texto];
    }

    function creaLstEspera() {
        retorno = document.createElement("DIV");
        retorno.id ="lstEspera";
        return retorno;
    }

    function creaEspera(msj) {
        retorno = document.createElement("DIV");
        retorno.innerHTML = "<i class='fa fa-spinner fa-spin'></i>";
        retorno.innerHTML += "<span id='txtEspera'>"+msj+"</span>";

        retorno.className ="espera";
        modCss(retorno, {
            border: "solid 1px black",
            padding: "15px",
            display: "inline"
        });
        return retorno;
    }
	
	function creaOpc(opciones) {
		let texto = "";
		
		return opciones.reduce((cmb, x) => {
			let opcion = document.createElement("OPTION");

			if (typeof x === "string") {
				opcion.value = x;
				texto = x;
			} else {
				opcion.value = x.valor ? x.valor : x.txt;
				texto = x.txt;
				if(x.sinValBsq) {
					opcion.class = "sinValBsq";
					opcion.onclick = llamaBsq;
				}	
			}
			opcion.appendChild(document.createTextNode(texto));
			
			cmb.appendChild(opcion);
			return cmb;
		}, document.createElement("SELECT"));
	}

	function creaVal() {
		let retorno = document.createElement("INPUT");
		retorno.id="valBsq";
		return retorno;
	}
	
	function creaBtn() {
		let retorno = document.createElement("BUTTON");
		retorno.id="btnBsq";
		retorno.className = "rogBtn";
		retorno.onclick= llamaBsq;
		retorno.innerHTML = "<i class='fa fa-search'></i>";
		retorno.onmouseover = () => { bsq.dom.style.display = "flex"; };
		return retorno;
	}
	
	function creaDom(dom) {
		bsq.dom.appendChild(bsq.opc);
		bsq.dom.appendChild(bsq.val);

		bsq.dom.style.display = "none";
		bsq.dom.className = "rogBtn";
		
		let cnt = document.createElement("DIV");
		cnt.appendChild(bsq.dom);
		cnt.appendChild(bsq.btn);
		cnt.style = "display: flex; alignItems: stretch";

		let vnt = objDom(dom);
        
        bsq.dom.lstEspera = creaLstEspera();
	    vnt.appendChild(bsq.dom.lstEspera);   // Para mensajes de Espera
		vnt.appendChild(cnt);
		modCss(vnt,
		    { display: "flex", // height: "50px", 
		    otros: [
		        ["justify-content", "flex-end"], ["align-items", "stretch"]
		    ]}
		);
	}

	this.query = () => ({ que: this.que, valor: this.valor });
	this.que = (nbCampo) => nbCampo ? bsq.que = nbCampo : bsq.que;
	this.valor = (valor) => valor ? bsq.valor = valor : bsq.valor;
	this.Espera = (msj) => {
        let retorno;
        if(msj) {
            if(typeof msj === "string") {
                retorno = creaEspera(msj);
                bsq.dom.lstEspera.appendChild(retorno);
            } else {
                msj.remove();
            }
        }  else {
            bsq.dom.lstEspera.children[bsq.dom.lstEspera.children.length -1].remove();
        }
        return retorno;
	};
    this.bsq = bsqObj;
//    this.fn = fn || (que,valor) => window.find(valor);

	creaDom(dom);
	btnDefault(bsq.val,bsq.btn);
}
