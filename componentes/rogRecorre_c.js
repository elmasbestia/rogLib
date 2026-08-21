/**
	Objeto que permite controlar el recorrido de un arreglo
	
	@property {array}    datos	  Arreglo a ser recorrido
	@attribute {function} fn	  Función a ejecutar para el elemento seleccionado
	@attribute {boolean | number} alAzar	Si el primer elemento se muestra al azar
	@attribute {array | string}   bsq Arreglo de propiedades para la búsqueda
    @attribute {string}           title   Titulo a mostrar (Opcional)
    @attribute {function}         tmp Plantilla del Objeto (Opcional)
*/

class rogReco extends HTMLElement {
    #reco = {};
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    set datos(datos) {
        this.a = datos;
        this.render();
    }

    get datos() {
        return this.a || [];
    }

    get aBsq() {
        return this.getAttribute("bsq").split(", ");
    }

    set alAzar(valor) {
        this.setAttribute("alazar", valor)
    }
    
    get alAzar() {
        return this.hasAttribute("alazar") && (this.getAttribute("alazar") !== "false");
    }

    get titulo() {
        return this.getAttribute("title") || "";
    }

    get tmp() {
        let tmp = this.getAttribute("tmp")
        if(tmp) tmp = windows[tmp.split("(")[0]];
        else tmp = tmprogReco;

        return tmp;
    }

    get fn() {
        let fn = this.getAttribute("fn")
        if(fn) fn = window[fn.split("(")[0]];
        return fn
    }

    mst (x) {
        x = parseInt(x)
        if (x === 0) x = this.datos.length;
        else if (x > this.datos.length) x -= this.datos.length;
        this.#reco.act.value = this.#reco.x = x;
        this.#reco.vnt.innerHTML = this.fn(this.datos[this.#reco.x - 1]);
        this.dispatchEvent(new Event("mst"))
    }

    irA () {
        this.mst(parseInt(this.#reco.act.value) || 0);
    }

    bsq (txt) {
        let _txt = txt instanceof Event ? this.txtBsq : txt;
        let  _x = this.bsqTxt(_txt);
      
        if (_x) this.mst(_x + this.#reco.x);
        else alert(`¡No hallé '${_txt}'!`);        
    }

    get txtBsq() {
        return this.#reco.txt.value || "";
    }

    tieneTxt(x) {
        if(!this.txtBsq) return false

        let _exp = new RegExp(limpiaPlb(this.txtBsq), "i");
        return this.o(
            this.aBsq.map((e) => limpiaPlb(x[e])),
            _exp)
    }

    bsqTxt(txt) {
        let _txt = rogPrm(txt) || this.#reco.txt.value

        let _x = this.toda(this.datos, this.#reco.x).findIndex(this.tieneTxt.bind(this)) + 1;
        return _x;
    }

    azar() {
        return Math.ceil(Math.random() * this.datos.length);
    }

    toda(a, x) {
        return a.slice(x).concat(a.slice(0, x));
    }

    marcaTxt(txt) {
        let bsq = this.txtBsq
        let retorno = txt
        const lf  = /\n/g

        if(bsq) {
            const exp = new RegExp(bsq,"ig");
            retorno = txt.replace(exp,`<mark>${bsq}</mark>`)
        } 
        return retorno.replace(lf,"<br/>");
    }

    o(a, exp) {
        return a.reduce((si, x) => si = (si || exp.test(x)), false);
    }

    sig() {
        this.mst(this.#reco.x + 1);
    }

    ant() {
        this.mst(this.#reco.x - 1);
    }

    primanocte() {
        let alazar = this.alAzar;
        return isNaN(alazar) ? bsqTxt(alazar) : (alazar === true ? this.azar() : parseInt(alazar) || 1)
    }

    inicializa() {
        ["sig", "ant", "bsq", "vnt"].forEach(
            (x) => (this.#reco[x] = this.shadow.querySelector("." + x + "Reco"))
        );
        ["act", "num", "txt"].forEach(
            (x) => (this.#reco[x] = this.shadow.querySelector("[name=" + x + "Reco]"))
        );

        this.#reco.sig.onclick = this.sig.bind(this);
        this.#reco.ant.onclick = this.ant.bind(this);
        this.#reco.bsq.onclick = this.bsq.bind(this);

        this.#reco.act.oninput = this.irA.bind(this);
        this.#reco.act.size = 4;

        this.#reco.num.value = this.datos.length;
        this.#reco.num.size = 4;

        btnDefault(this.#reco.txt, this.#reco.bsq);

        this.shadow.querySelector(".rogReco").addEventListener("keydown", e => {
            const tcls = {
                ArrowRight: "sig",
                ArrowLeft:  "ant",
            }
            
            if(tcls[e.key]) this.#reco[tcls[e.key]].click()
        } )

        this.mst(this.primanocte());
    }
          
    connectedCallback() {
        this.render();
    }
    
    disconnectedCallBack() {}
    
    render() {
        this.shadow.innerHTML = this.tmp(this);
        this.inicializa();
    }
    
    static get observedAttributes() {
        return [];
    }
    
    attributeChangedCallback(att, viejo, nuevo) {
        this.render();
    }  
}

function tmprogReco(obj) {
    return `<style>    
        .btnReco {
            position: relative;

            background-color: var(--clrFndObj);
            color: var(--clrTxtObj);
  
            font-size: small;
  
            border: none;
            border-right: silver;
            border-bottom: silver;
            padding: .5em 1em;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            margin: .3em .2em;
            cursor: pointer;
        }

        .btnReco::before {
            content: " ";
            position: absolute;
            opacity: 0;
            inset: 0;
            box-shadow: var(--sombra);
    
            transition: opacity 125ms ease-in-out;
        }

        .btnReco:hover::before {
            opacity: 1;
        }
  
        </style>
        <nav class="rogReco">
			<h3 class="titReco">${obj.titulo}</h3>
            <div class="controles">
  			    <span class="btnReco antReco"><rog-icn icono="flc.izq"></rog-icn></span>
			    <span class="spnReco">nro.</span>
			    <input type="text" name="actReco" class="numReco">
			    <span class="spnReco">de</span>
			    <input type="text" name="numReco" class="numReco" readonly>
			    <span class="btnReco sigReco"><rog-icn icono="flc.der"></rog-icn></span>
			    <input type="text" name="txtReco">
			    <span class="btnReco bsqReco" title="Buscar un texto"><rog-icn icono="bsq"></rog-icn></span>
            </div>
		</nav>
		<div class="vntReco"></div>`;
}
  
customElements.define("rog-recorre", rogReco);
