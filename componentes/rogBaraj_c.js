const _rogBrj = {
    palos: {
        "♠": "black",
        "♥": "red",
        "♣": "black",
        "♦": "red"
    },
  
    valores: () => {
      const retorno = [];
      for (let x = 0; x < 13; x++) retorno[x] = x;
      retorno[0] = "A";
      retorno[10] = "J";
      retorno[11] = "Q";
      retorno[12] = "K";
      return retorno;
    },

    valor: (obj) => _rogBrj.valores()[obj.valor],
    
    palo: (obj) => isNaN(obj.palo) ?  obj.palo : Object.keys(_rogBrj.palos)[obj.palo],

    color: (obj) => _rogBrj.palos[_rogBrj.palo(obj)],

    abreMazos: (n) => {
        const cant = n*4*13; // Cantidad de Cartas
        const retorno = [];
      
        for(x = 0; x < n; x++) {
          Object.keys(_rogBrj.palos).forEach(palo => {
            _rogBrj.valores().forEach((valor,i) => {
                let baraj = new rogBaraja()
                baraj.palo = palo
                baraj.valor = i
              _rogBrj.barajea(retorno, baraj, cant)
            })
          });
        }
        return retorno;
    },
      
    barajea: (mazo,baraja,cant) => {
        let pos =  Math.floor(Math.random()*cant)

        if(mazo[pos]) {
          pos = 0;
          while(mazo[pos]) pos++;
        } 
        mazo[pos] = baraja;
    },
}

class rogBaraja  extends HTMLElement {
    #valor = 0;
    #palo = 0;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    set foto(valor) {
        this.setAttribute("foto",valor);
    }

    get foto() {
        return this.getAttribute("foto")
    }

    set valor(valor) {
        this.setAttribute("valor",valor);
    }

    get valor() {
        return this.getAttribute("valor")
    }

    set palo(valor) {
        this.setAttribute("palo",valor);
    }

    get palo() {
        return this.getAttribute("palo")
    }

    get color() {
        return _rogBrj.color(this)
    }

    get clase() {
        return "baraja" +(this.volteada ? " volteada" : "") +(this.marcada ? " marcada" : "")
    }

    set marcada(valor) {
        this.setAttribute("marcada",valor);
    }

    get marcada() {
        return this.hasAttribute("marcada") && (this.getAttribute("marcada") !== "false")
    }
    
    set volteada(valor) {
        this.setAttribute("volteada",valor);
    }

    get volteada() {
        return this.hasAttribute("volteada") && (this.getAttribute("volteada") !== "false")
    }

    voltea(valor = !this.volteada) {
        this.volteada = valor
    }

    marca(valor = !this.marcada) {
        this.marcada = valor
    }
  
    connectedCallback() {
        this.render();
    }
    
    disconnectedCallBack() {}
    
    render() {
        this.shadow.innerHTML = tmprogBrj(this);
    }
    
    static get observedAttributes() {
        return ["volteada", "marcada"];
    }
    
    attributeChangedCallback(att, viejo, nuevo) {
        this.render();
    }
}

customElements.define("baraj-obama", rogBaraja);

class rogMazo {
  #xBaraja = 0;
  #fotos = [];
  constructor(mazos) {
    this.mazo = _rogBrj.abreMazos(mazos.cant);
    this.fotos = mazos.fotos;
  }

  set fotos (fotos) {
    const _fotos = new rogNbArchs(fotos);
    const cant = this.mazo.length;
    this.#fotos = _fotos.imagenes.reduce((retorno, x) => {
        _rogBrj.barajea(retorno, x, cant)
        return retorno
    }, []);
  }
  
  get foto() {
	return this.#fotos.shift()
  }

  dame() {
    let brj = this.mazo.length ? this.mazo.shift() : null;
	if(brj) brj.foto = this.foto;
    return brj
  }
}

function tmprogBrj(obj) {
    const palo = _rogBrj.palo(obj)
    const valor = _rogBrj.valor(obj)
  return `<style>
      ${tmpcssrogBrj(obj)}
    </style>
    <div class="${obj.clase}" 
    style="--clrPalo: ${obj.color}"
    >
      <div class="elLomo">
      </div>
      <div class="laCara">			
        ${tmpFoto(obj.foto)}
        <div class="contenido">${obj.contenido || ""}</div>
        <div class="esquina si">${valor}</div>  
        <div class="palo si">${palo}</div>
        <div class="palo id">${palo}</div>
        <div class="esquina id">${valor}</div>
      </div>
    </div>`;
}

function tmpFoto(foto) {
	return foto ?
        `<div class="foto">
            <img src="${foto}" alt="">
        </div>` :
		"";
}

function tmpcssrogBrj(obj) {
    return `.baraja {
        font-family: Century, serif;
        position: relative;
        top: 0;
        left: 0;
        width: 9em;
        height: 12em;
        border-radius: 10px;
        transform-style: preserve-3d;
        transition: all 0.8s ease;
    }
      
    .baraja .contenido {
        position: absolute;
        top: 100%;
        background-color: rgba(256, 256, 256, 0.3);
        z-index: 100;
        transition: top 0.8s ease;
    }
  
    .baraja.volteada:hover .contenido {
        top: 20%;
    }

    .baraja.marcada,
    .baraja.volteada {
      transform: rotateY(180deg);
    }

    .elLomo {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        backface-visibility: hidden;
        overflow: hidden;
        background-color: hsl(var(--clrClaro, 28 78% 68%));
        color: hsl(var(--clrOscuro, 20 51% 23%));
        background-image: url(https://rafagomez.neocities.org/Imagenes/rogLogo.svg);
        background-size: cover;
        background-position: center;
    }

    .laCara {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        border: 1px solid black;
        backface-visibility: hidden;
        overflow: hidden;
        background: #fafafa;
        text-align: center;
        transform: rotateY(180deg);
    }
    
    .laCara .foto {
        position: absolute;
        top: 15%;
        left: 5%;
        height: 70%;
        width: 90%;
        z-index: 0;
    }
    
    .laCara .foto img {
        width: 100%;
        height: 100%;
    }
    
    .si {
        position: absolute;
        left: 6px;
        top: 2px;
    }
    .id {
        position: absolute;
        right: 6px;
        bottom: 2px;
        rotate: -180deg;
    }
    
    .palo {
        color: var(--clrPalo);
        z-index: 10;
        font-size: 2em;
    }`;
}