function rogBsq(dom, opciones, fn) {
	const bsq = document.createElement("DIV");
		
	const btnBsq = creaBtn();
	const valBsq = creaVal();
	const opcBsq = creaOpc(opciones);
	
	function llamaBsq() {
		fn(...analValor(slfBsq.que(), slfBsq.valor()));
	}
    
    function analValor(parm,texto) {
        let pos = texto.indexOf("=");
        if(pos > -1) {
            let que = texto.slice(0,pos).trim();
            let valor = texto.slice(pos+1).trim();

            return [que,valor];
        } else return [parm,texto];
    }

           function divEspera() {
        retorno = document.createElement("DIV");
        retorno.innerHTML = "<i class='fa fa-spinner fa-spin'></i>";
        retorno.innerHTML += "<span id='txtEspera'></span>";

        retorno.id ="divEspera";
        modCss(retorno, {
            border: "solid 1px black",
            padding: "15px",
            display: "none"
        });
        return retorno;
    }
	
	function creaOpc(opciones) {
		let texto = "", opcion = {};
		let combo = document.createElement("SELECT");
		
		opciones.forEach(x => {
			opcion = document.createElement("OPTION");

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
			combo.appendChild(opcion);
		});

		return combo;
	}

	function creaVal() {
		let retorno = document.createElement("INPUT");
		retorno.id="valBsq";
		btnDefault(retorno,btnBsq);
		return retorno;
	}
	
	function creaBtn() {
		let retorno = document.createElement("BUTTON");
		retorno.id="btnBsq";
		retorno.className = "rogBtn";
		retorno.onclick= llamaBsq;
		retorno.innerHTML = "<i class='fa fa-search'></i>";
		retorno.onmouseover = () => { bsq.style.display = "flex"; };
		return retorno;
	}
	
	function creaDom(dom) {
		bsq.appendChild(opcBsq);
		bsq.appendChild(valBsq);

		bsq.style.display = "none";
		bsq.className = "rogBtn";
		
		let cnt = document.createElement("DIV");
		cnt.appendChild(bsq);
		cnt.appendChild(btnBsq);
		cnt.style = "display: flex; alignItems: stretch";

		let vnt = objDom(dom);
	    vnt.appendChild(divEspera());   // Para mensajes de Espera
		vnt.appendChild(cnt);
		modCss(vnt,
		    { display: "flex", // height: "50px", 
		    otros: [
		        ["justify-content", "flex-end"], ["align-items", "stretch"]
		    ]}
		);
	}

	this.query = () => ({ que: this.que(), valor: this.valor() });
	this.que = (nbCampo) => nbCampo ? opcBsq.value = nbCampo : opcBsq.value;
	this.valor = (valor) => valor ? valBsq.value = valor : valBsq.value;
	this.Espera = (msj) => {
        let div = document.getElementById("divEspera");
        if(msj) {
            document.getElementById("txtEspera").textContent = msj;
            div.style.display = "inline";
        }  else {
            div.style.display = "none";
        }
	};

	creaDom(dom);

	var slfBsq = this;
}
