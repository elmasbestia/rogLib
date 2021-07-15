/*
	Objeto que permite controlar el recorrido de un arreglo
	
	@param a		Arreglo a ser recorrido
	@param fn		Función a ejecutar para el elemento seleccionado
	@param alAzar	Si el primer elemento se muestra al azar
	@param aBsq		Arreglo de propiedades para la búsqueda
*/
const template = document.createElement("template");

template.innerHTML = `
	<style>
        .rogReco {
            background-color: var(--clrMnuFnd);
            color: var(--clrMnuTxt);
            padding: 5px;
        }
      
        .btnReco {
            background-color: var(--clrMnuTxt);
            color: var(--clrMnuFnd);
            cursor: pointer;
            padding: 6px 15px;
            margin: 5px;
            line-height: 200%;
            
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
        }
      
        .antReco {
            background-image: url("../Imagenes/flcIzqClara.png");
            border-radius: 25px 0 0 25px;
        }
      
        .sigReco {
            background-image: url("../Imagenes/flcDerClara.png");
            border-radius: 0 25px 25px 0;
        }
      
        .bsqReco {
            background-image: url("../Imagenes/icnBsqClara.png");
        }
      
        .numReco {
            text-align: center;
        }
    </style>
	
    <template>
        <nav class="rogReco">
            <span class="btnReco antReco"></span>
            <span class="spnReco">nro.</span>
            <input type="text" name="actReco" class="numReco">
            <span class="spnReco">de</span>
            <input type="text" name="numReco" class="numReco" readonly>
            <span class="btnReco sigReco"></span>
            <span class="btnReco bsqReco" title="Buscar un texto"></span>
            <input type="text" name="txtReco">
        </nav>
        <div class="lstReco"></div>
    </template>
`

class rogReco extends HTMLElement {
	constructor (a, fn, alAzar, aBsq) {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template,content.cloneNode(true));

        let _reco = {};
        let _aBsq = desarma(aBsq);
          
        setX(alAzar ? azar() : 1);
    }
	
	connectedCallback() {
		this.shadowRoot.querySelector(".alert").addEventListener("click", () => this.tooltip(true));
		//cancel false
        if(this.getAttribute(x)) this.shadowRoot.querySelector(".notify-container").chepacua = this.getAttribute(x)
		      
        ["sig", "ant", "bsq"].forEach(
            x => (_reco[x] = this.shadowRoot.querySelector("." + x + "Reco"))
        );
        ["act", "num", "txt"].forEach(
            x => (_reco[x] = this.shadowRoot.querySelector("[name=" + x + "Reco]"))
        );
      
        _reco.sig.onclick = sig;
        _reco.ant.onclick = ant;
        _reco.bsq.onclick = bsq;
          
        _reco.act.oninput = irA;
        _reco.act.size = 6;
          
        _reco.num.value = a.length;
        _reco.num.size = 6;
          
        btnDefault(_reco.txt, _reco.bsq);
	}
      
    irA() {
        let _x = _reco.act.value;
        mst(_x);
    }
    
    bsq() {
        let _exp = new RegExp(limpiaPlb(_reco.txt.value), "i");
    
        let _x = toda(a, _reco.x).findIndex((x) =>
        o(
            _aBsq.map((e) => x[e]),
            _exp
        )
        );
        if (_x === -1) alert("Sejo!");
        else mst(_x + _reco.x + 1);
    }
      
    azar() {
        return Math.ceil(Math.random() * a.length);
    }
      
    setX(valor) {
        let _convi = parseInt(valor);
        mst(_convi < 0 ? a.length + _convi + 1 : _convi);
    }
      
    toda(a, x) {
        return a.slice(x).concat(a.slice(0, x));
    }
      
    o(a, exp) {
        return a.reduce((si, x) => (si = si || exp.test(limpiaPlb(x))), false);
    }
      
    mst(x) {
        if (x === 0) x = a.length;
        else if (x > a.length) x -= a.length;
        _reco.act.value = _reco.x = x;
        fn(a[_reco.x - 1]);
    }
      
    sig() {
        setX(_reco.x + 1);
    }
      
    ant() {
        setX(_reco.x - 1);
    }
}

window.customElements.define('rogReco, rogReco)')

/* 
        U S O
        a, fn, alAzar, aBsq
<rogReco arreglo="Llena_Frase()", fn="mstFrase", alAzar="true", aBsq="Frase, Autor"
*/
