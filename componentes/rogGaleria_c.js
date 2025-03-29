/**
 * Galería de fotos
 * Componente
 */

const _rogGaleria = {
  observados: ["galeria","cols","tipo","controles"],

  cambia: {
    galeria: (obj, viejo, nuevo) => {
      const imagenes = new rogNbArchs(nuevo);
      obj.imagenes = imagenes.imagenes;
    }
  },
    
  leeControles: (e) => {
      const nb = e.target.name;
      const valor = nb === "controles" ? e.target.checked : e.target.value;

      e.target.getRootNode().host[nb] = valor;
  },

  chxImg: e => {
    e.target.getRootNode().host.dispatchEvent(new CustomEvent("chxImg", {detail: e.target}))
  },

  ristra: (e) => e.currentTarget.querySelector(".img-ristra"),

  mstGalerias: obj => {
    const galerias = obj.shadowRoot.querySelector("[name=galeria]")
    if(galerias) galerias.innerHTML = obj.galerias.map(nb => `<option value="${nb}">${nb}</option>`).join("")

  },

  onmousedown: (e) => (_rogGaleria.ristra(e).dataset.debut = e.clientX),

  onmousemove: (e) => {
    const ristra = _rogGaleria.ristra(e);

    if (ristra.dataset.debut === "0") return;
  
    const mouseDelta = parseFloat(ristra.dataset.debut) - e.clientX;
    const maxDelta = window.innerWidth / 2;
    const porc = (mouseDelta / maxDelta) * -100;
    let previo = ristra.dataset.previo;
    let prox = parseFloat(ristra.dataset.previo) + porc;
  
    prox = Math.min(prox, 0);
    prox = Math.max(prox, -100);
  
    ristra.dataset.porc = prox;
  
    ristra.animate(
      { transform: `translate(${prox}%, -50%)` },
      { duration: 2000, fill: "forwards" }
    );
  
    for (let image of ristra.getElementsByTagName("img")) {
      image.animate(
        { objectPosition: `${+prox + 100}% center` },
        { duration: 2000, fill: "forwards" }
      );
    }
  },
  
  onmouseup: (e) => {
    const ristra = _rogGaleria.ristra(e);
    ristra.dataset.debut = "0";
    ristra.dataset.previo = ristra.dataset.porc || "0";
  }
};

class rogGaleria extends HTMLElement {
  #imagenes; #galerias;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  set imagenes(lista) {
    this.#imagenes = lista;
    this.render();
  }

  get imagenes() {
    return this.#imagenes || [];
  }

  set galeria(valor) {
    this.setAttribute("galeria", valor);
  }

  get galeria() {
    return this.getAttribute("galeria");
  }

  set galerias(valor) {
    this.#galerias = desarma(valor);
    _rogGaleria.mstGalerias(this)
  }

  get galerias() {
    return this.#galerias || [this.galeria]
  }

  set tipo(valor) {
    this.setAttribute("tipo",valor);
  }

  get tipo() {
    return this.getAttribute("tipo") || "H";
  }

  set cols(valor) {
    this.setAttribute("cols",valor);
  }

  get cols() {
    return this.getAttribute("cols") || 2;
  }

  set controles(valor) {
    this.setAttribute("controles",valor);
  }

  get controles () {
    return this.hasAttribute("controles") && (this.getAttribute("controles") != "false");
  }
  
  render() {
    this.shadow.innerHTML = tmpROGGaleria(this);
    
    if(this.tipo === "H") {
        let marco = this.shadow.querySelector("main")
        marco.onmousedown = _rogGaleria.onmousedown;
        marco.onmousemove = _rogGaleria.onmousemove;
        marco.onmouseup   = _rogGaleria.onmouseup;
    }
  }

  static get observedAttributes() {
    return _rogGaleria.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    if(_rogGaleria.cambia[att]) _rogGaleria.cambia[att](this, viejo, nuevo);
    this.render();
  }
}

customElements.define("rog-galeria", rogGaleria);

function tmpImgROGGaleria(x) {
  return `<img src="${x}" draggable="false" onclick="_rogGaleria.chxImg(event)">`;
}

function tmpROGGaleria(obj) {
    function tmpControles(obj) {
        return `<nav>
                <ul id="controles" oninput="_rogGaleria.leeControles(event)">
                    <li>
                    <label>galeria</label>
                    <select name="galeria" value="${obj.galeria}">
                        ${obj.galerias.map(nb => `<option value="${nb}">${nb}</option>`).join("")}
                    </select>
                    </li>
                    <li>
                    <label>Columnas</label>
                    <input type="text" name="cols" size="2" value="${obj.cols}">
                    </li>
                    <li>
                    <label>tipo</label>
                    <select name="tipo" value="${obj.tipo}">
                        <option value="H">┉</option>
                        <option value="V">┊</option>
                        <option value="A">…</option>
                    </select>
                    </li>
                    <li><input type="checkbox" name="controles" ${obj.controles ? "checked" : ""}>controles</li>
                </ul>
            </nav>`
    }
    return `<style>
            :host {
                display: block;
            }

            main {
                height: 100%;
                position: relative;
                overflow: hidden;
            }

            nav {
                position: absolute;
                max-width: fit-content;
                z-index: 100;
            }

            nav:before {
                content: "☰";
                display: inline-block;
                background-image: linear-gradient(
                    to right-bottom,
                    transparent 50%,
                    hsl(var(--base) 50% 50% / 0.3)
                );
            }

            nav ul {
                display: none;
                list-style-type: none;
                gap: 1em;
                color: hsl(var(--base) 50% 90%);
                background-color: hsl(var(--base) 50% 50%);
                border: 2px solid currentcolor;
                border-radius: 5px;
                padding: 0.75em;
                box-shadow: 0 5px 8px currentcolor;
                font-size: small;
                font-weight: bold;
            }

            nav:hover ul {
                display: inline-flex;
            }

            nav:hover:before {
                display: none;
            }

            ${tmpcssROGGaleria(obj)}
        </style>
        <main ${obj.hasAttribute("style") ? `style="${obj.getAttribute("style")}"` : ""}>
            ${obj.controles ? tmpControles(obj) : ""}
            <div class="img-ristra" 
                data-debut="0" data-previo="0"
            >
                ${obj.imagenes.map(tmpImgROGGaleria).join("")}
            </div>
        </main>`
}

function tmpcssROGGaleria(obj) {
    return {
	    H: `img {
                height: 96%;
                aspect-ratio: 8/10;
                object-fit: contain;
                object-position: 80% 50%;
            }

            .img-ristra {
                display: flex;
                align-items: center;
                gap: 3px;
                position: absolute;
                left: 50%;
                top: 50%;
                height: 100%;
                transform: translate(0%, -50%);
            }`,
		V: `main {
                overflow-y: scroll;
            }

            .img-ristra {
                columns: ${obj.cols};
                padding: 16px 32px;
                column-gap: 32px;
            }
            
            img {
                border-radius: 4px;
                width: 100%;
                height: auto;
                margin-bottom: 32px;
                
                animation: reveal linear both;
                animation-timeline: view();
                animation-range: entry 20% cover 50%;
            }
            
            @keyframes reveal {
                from {
                    opacity: 0;
                    translate: 0 100px;
                    scale: .5;
                } to {
                    opacity: 1;
                    translate: 0 0;
                    scale: 1;
                }                
            }`,
		A: `.img-ristra {
                --nAvatar: ${obj.imagenes.length};
                --szFoto: var(--szAvatar, 70%);
                --szCol: calc(var(--szFoto) / 2);
                
                height: 100%;

                background-color: var(--clrObjFnd);

                display: grid;
                grid-template-columns: repeat(var(--nAvatar), var(--szCol));
				align-items: center;
	
            	transition: grid-template-columns 500ms;
	            transition-delay: 500ms;
	
	            overflow-x: auto;
            }

            .img-ristra:hover,
            .img-ristra:focus-within {
	            --szCol: calc(var(--szFoto) * 1.5);	
                /* grid-template-columns: repeat(var(--nAvatar), var(--szCol));*/
            }

            img {
	            height: var(--szFoto);
                aspect-ratio: 1;
                object-fit: cover;
                border-radius: 100%;
                border: 5px solid white;
                box-shadow: .25rem .25rem .5rem hsl(0 0% 0% / .2);
	
                z-index: 2;

	            transition: scale 500ms;
	            transition-delay: 0ms;
            }

            img:hover,
            img:focus {
            	scale: 2;
	            z-index: 2;
            }

            img:hover + img,
            img:has( + img:hover) {
            	scale: 1.5;
            }`
    } [obj.tipo]
}
