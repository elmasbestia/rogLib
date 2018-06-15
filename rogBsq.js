// Objeto Buscador
// 

function rogBsq(dom, opciones, fn) {
	const bsq = document.createElement("DIV");
		
	const btnBsq = creaBtn();
	const valBsq = creaVal();
	const opcBsq = creaOpc(opciones);
	
	function llamaBsq() {
		fn(this.que(), this.valor())
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
		retorno.class = "rogBtn";
		retorno.onclick= llamaBsq;
		retorno.innerHTML = "<i class='fa fa-search'></i>";
		retorno.onmouseover = () => { bsq.style.display = "block"; }
		//retorno.style = "width: 50px; height: 50px; border: none; color: #fff"; 
		retorno.style = "font-size: 10pt; padding-left: 35px";
		retorno.style = "-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px"; 
/*
					["-webkit-transition", "width .55s ease"], 
					["-moz-transition", "width .55s ease"], 
					["-ms-transition", "width .55s ease"], 
					["-o-transition", "width .55s ease"], 
					["transition", "width .55s ease"]
*/
		return retorno;
	}
	
	function creaDom(dom) {
		bsq.appendChild(opcBsq);
		bsq.appendChild(valBsq);
		//bsq.style.display = "none";
		
		let cnt = document.createElement("DIV");
		cnt.appendChild(bsq);
		cnt.appendChild(btnBsq);
		cnt.style = "width: 300px; height: 30px; display: flex; alignItems: flex-end";
		cnt.class = "rogBtn";
		
		let vnt = objDom(dom);
		vnt.appendChild(cnt);
		vnt.style = "width: 400px; height: 50px";
	}

	this.query = () => ({ que: this.que(), valor: this.valor() });
	this.que = () => opcBsq.value;
	this.valor = () => valBsq.value;
	
	creaDom(dom);
}
