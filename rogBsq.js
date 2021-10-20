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
            fn:    Una función que retorne una lista de valores para la opción
            
    @param fn es la función que se ejecuta para buscar. Recibe los argumentos "que" y "valor"
    
    Además permite mostrar un mensaje a través del método "Espera" (Normalmente de un proceso en ejecución)
*/

function rogBsq(dom, opciones, fn) {
	const bsq = {
        dom: document.createElement("DIV"),
		btn: creaBtn(llamaBsq),
	    val: creaVal(),
        opc: creaOpc(opciones),
        fn:  () => fn(...analValor(bsq.que, bsq.valor)),

        que: "",
        valor: "",
    }
    bsq.cmb = creaCmb()

    function llenaCmb(lista = "") {
        bsq.cmb.style.display = lista ? "block" : "none";
        bsq.cmb.innerHTML = lista;
    }

	function llamaBsq() {
        bsq.que   = bsq.opc.value;
        bsq.valor = bsq.val.value;
        bsq.fn();
	}

    function chxOpc(e) {
        bsq.cmb.style.display = "none";
		bsq.val.style.display = "block";
        let opcion = e.target.selectedOptions[0];
        if(opcion.fn) {
            bsq.cmb.innerHTML = creaOpcValor(opcion.fn(opcion.value));
            bsq.cmb.style.display = "block";
			bsq.val.style.display = "none";
        } else if(opcion.sinValBsq) bsq.btn.click();
    }

    function creaOpc(opciones) {
        let texto = "";
        let cmb = opciones.reduce((cmb, x) => {
            let opcion = document.createElement("OPTION");
    
            if (typeof x === "string") {
                opcion.value = x;
                texto = x;
            } else {
                opcion.value = x.valor || x.txt;
                texto = x.txt;
                opcion.sinValBsq = x.sinValBsq;
                if(x.fn) opcion.fn = x.fn
            }
            opcion.appendChild(document.createTextNode(texto));
            
            cmb.appendChild(opcion);
            return cmb;
        }, document.createElement("SELECT"));
        
        cmb.onchange = chxOpc
        return cmb
    }

    function creaDom(dom) {
        bsq.dom.appendChild(bsq.opc);
        bsq.dom.appendChild(bsq.val);
        bsq.dom.appendChild(bsq.cmb);
    
        bsq.dom.style.display = "none";
        bsq.dom.className = "rogBtn";
        
        let cnt = document.createElement("DIV");
        cnt.appendChild(bsq.dom);
        cnt.appendChild(bsq.btn);
        cnt.style = "display: flex; alignItems: stretch";
    
        let vnt = objDom(dom);

        //    this.fn = fn || (que,valor) => window.find(valor);
        
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

    function creaBtn(fn) {
        let retorno = document.createElement("BUTTON");
        retorno.id="btnBsq";
        retorno.className = "rogBtn";
        retorno.onclick= fn;
        retorno.innerHTML = "<i class='fa fa-search'></i>";
        retorno.onmouseover = () => { bsq.dom.style.display = "flex"; };
        return retorno;
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

    function creaCmb() {
        let retorno = document.createElement("SELECT")
        retorno.oninput = () => {
            bsq.val.value = bsq.cmb.value;
            bsq.btn.click();
        }
        //retorno.onchange = () => bsq.btn.click
        retorno.style.display = "none";
        return retorno
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

    creaDom(dom);
	btnDefault(bsq.val,bsq.btn);
}

function creaOpcValor(valores) {
    return valores.reduce((txt, x) => txt += `<option>${x}</option>`,"") // "<datalist id='valOpcion'>") +"</datalist>"
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

function creaVal() {
    let retorno = document.createElement("INPUT");
    retorno.id="valBsq";
    return retorno;
}
