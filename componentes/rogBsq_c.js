const _rogBsq = {
  cambia: {
    sinvalor: (obj, viejo, nuevo) => {
      if(nuevo === "true") obj.bsq();
    }
  },
  blanco: (e) => {
    return e.target.closest(".opcBsq") || e.target.closest("rog-opcBsq");
  },
  tratamientos: {
    select: (obj, e) => obj.valor = e.target.value,
    option: (obj, e) => obj.bsq(),
    input:  (obj, e) => {}
  },
  leeValor: e => {
    e.target.getRootNode().host.valor = e.target.value;
  },
  chx: (e) => {
    e.stopPropagation();
    const opcion = _rogBsq.blanco(e);
    if (opcion) {
      const obj = rogAncetre(opcion,"rog-bsq") // opcion.getRootNode().host;
  
      const tratamiento = _rogBsq.tratamientos[e.target.tagName]
      if(tratamiento) tratamiento(obj,e);
      else {
        obj.txt  = opcion.label || opcion.textContent;
        obj.que  = opcion.value || opcion.textContent;
        obj.type = opcion.getAttribute("TYPE"); 
        obj.sinvalor = (opcion.hasAttribute("SINVALOR") && (opcion.getAttribute("SINVALOR") !== "false"));
      }
    }
  },
  abre: e => {
    e.target.getRootNode().host.estado = "";
  },
  quita: e => {
    e.target.getRootNode().host.estado = "espera";
  }, 
  click: (e) => {
      e.stopPropagation();
      e.target.getRootNode().host.bsq();
  },
  chqEnter: (e) => {
    if (e.key === "Enter") e.target.getRootNode().host.bsq();
  }
};

class rogBsq extends HTMLElement {
  #opciones = [];
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  get que() {
    return this.getAttribute("que") || "";
  }

  set que(valor) {
    this.setAttribute("que", valor);
  }

  get valor() {
    return this.getAttribute("valor") || "";
  }

  set valor(valor) {
    this.setAttribute("valor", valor);
  }

  get type() {
    return this.getAttribute("type") || "text";
  }

  set type(valor) {
    this.setAttribute("type", valor);
  } 

  get sinvalor() {
    return (this.hasAttribute("sinvalor") && (this.getAttribute("sinvalor") !== "false"));
  }

  set sinvalor(valor) {
    this.setAttribute("sinvalor", valor);
  }

  set txt(valor) {
    this.setAttribute("txt", valor);
  }

  get txt() {
    return this.getAttribute("txt") || "";
  }

  set estado(valor) {
    this.setAttribute("estado",valor);
    if(this.marco) this.marco.setAttribute("estado",valor)
  }

  get estado() {
    return this.getAttribute("estado");
  }

  get marco() {
    return this.shadow.querySelector(".marco")
  }

  set opciones(lista) {
    this.#opciones = lista;
    this.render();
  }

  get opciones() {
    return this.#opciones;
  }

  get btn() {
    return this.shadow.querySelector("button");
  }

  get value() {
    return {
      que: this.que,
      valor: this.valor
    };
  }

  toString() {
    return `${this.que} => '${this.valor}'`
  }

  bsq(que, valor) {
    if(que) this.que = que
    if(valor) this.valor = valor
    this.estado = "espera";
    if(this.hasAttribute("busca")) window[this.getAttribute("busca").split("(")[0]](this.value)
    this.dispatchEvent(new CustomEvent("busca", { detail: this.value }));
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallBack() {}

  render() {
    if(this.estado === null) this.estado = "espera"
    this.shadow.innerHTML = tmprogBsq(this);
    /*
    this.addEventListener("keyup", 
    });
    */
  }

  static get observedAttributes() {
    return ["type","sinvalor"]; // ,"txt","que","bsq"
  }

  attributeChangedCallback(att, viejo, nuevo) {
    if(_rogBsq.cambia[att]) _rogBsq.cambia[att](this, viejo, nuevo);
    this.render();
  }
}

customElements.define("rog-bsq", rogBsq);

function tmprogBsq(obj) {
  return `${tmpCSSrogBsq(obj)}
    <div class="marco" estado="${obj.estado}" onblur="_rogBsq.quita(event)">
      <section class="elementos">
        <div class="combo">
          <input type="text" class="txt" value="${obj.txt}" readonly>
          <div class="lista" onclick="_rogBsq.chx(event)">
            <slot></slot>
          </div>
        </div>
        ${obj.sinvalor ?
          "" :
          `<input type="${obj.type}" value="${obj.valor}" class="valor" 
            oninput="_rogBsq.leeValor(event)" 
            onkeyup="_rogBsq.chqEnter(event)">`
        }
      </section>
      <button onclick="_rogBsq.click(event)" onmouseover="_rogBsq.abre(event)">⌕</button>
      <span class="cierraVnt" onclick="_rogBsq.quita(event)">✘</span>
    </div>`;
}

class rogOpcBsq extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  get value() {
    return (
      this.getAttribute("value") ||
      this.getAttribute("label") ||
      this.textContent
    );
  }

  get label() {
    return (
      this.getAttribute("label") ||
      this.getAttribute("value") ||
      this.textContent
    );
  }

  get type() {
    return this.getAttribute("type") || "text";
  }

  set type(valor) {
    this.setAttribute("type",valor);
  }

  toString() {
    return this.valor;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallBack() {}

  render() {
    this.shadow.innerHTML = tmprogOpcBsq(this);
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(att, viejo, nuevo) {
    if (_rogOpc.cambia[att]) _rogOpc.cambia[att](this, viejo, nuevo);
    this.render();
  }
}

customElements.define("rog-opcbsq", rogOpcBsq);

function tmprogOpcBsq(opc) {
  return `<style>
        .opcBsq:hover {
            box-shadow: var(--sombra);
        }
    </style>
    <div class="opcBsq">
        <span>${opc.label}<slot></slot></span>
    </div>`
}

function tmpCSSrogBsq(obj) {
  return `<style>
  :host {
    --fondo: linear-gradient(#dbdae1, #a3baaa);

    --clrTxt: teal;
    --clrFndObj: teal;
    --clrTxtObj: white;

    position: absolute;
    top: 0; 
    right: 0;
  }

  .combo {
    position: relative;
    padding: 0.25em 0.5em;
  }

  .lista {
    position: absolute;
    top: .75em;

    background: var(--fondo);
    color: var(--clrTxt);
    padding: 1em;

    z-index: 10;

    scale: 0;
    transition: scale .5s;
    transform-origin: top;
  }

  .opcBsq:hover {
    box-shadow: var(--sombra);
  }

  [estado=espera] .elementos {
    display: none;
  }

  .txt:focus + .lista,
  .lista:hover {
    scale: 1;
  }

  .marco {
    padding: 2px 3px;
    border-radius: 5px;

    /* overflow-x: hidden; */

    width: max-content;

    display: flex;
    gap: 0.75em;
    justify-content: flex-end;
    align-items: center;

    background: var(--fondo);
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1), 15px 15px 15px rgba(0, 0, 0, 0.1),
      20px 20px 20px rgba(0, 0, 0, 0.1), 30px 30px 30px rgba(0, 0, 0, 0.1),
      inset 1px 1px 2px #fff;
  }

  .elementos {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  /*
  .marco:hover .elementos {
    display: flex;
  }
  */

  button {
    font-size: 1.2em;
  }

  .cierraVnt {
    position: absolute;
    top: -0.5px;
    right: 0.5px;
      
    color: white;
    background-color: #000;
    text-align: right;
    cursor: pointer;
    opacity: 0.3;
    transition: opacity 0.85s ease-in-out;
  }

  [estado=espera] .cierraVnt {
    opacity: 0;
  }

  .cierraVnt:hover {
    opacity: 1;
  }
  </style>`;
}

function tmpF1Bsq() {
  return `<dialog class="f1" open>
        <h3>Opciones de búsqueda:</h3>
        <p>
      La Búsqueda funciona sobre la base de un tipo y un valor (Opcional)
      El tipo se muestra en un combo y el valor se tipea o escoge de un combo
        </p>

        <ol style="list-style-type: lower-alpha">
            <li>cadena de caracteres</li>

            <li>Objeto:
                <ol>
                    <li>valor     {string}   Identificador de la opción (Tipo)</li>
                    <li>txt       {string}   Texto a mostrarse (Por defecto: valor)</li>
                    <li>tipo      {string}   Tipo del Valor (Según @element INPUT)</li>
                    <li>sinValBsq {Boolean}  Si la opción no necesita un Valor</li>
                    <li>fn        {Function} Función que devuelve los valores válidos (Opcional)</li>
                </ol>
            </li>
        </ol>
        
        <p>
      La función que se envía como argumento al Objeto rogBsq recibe el tipo y el valor.
      Esta función toma el mando a partir de la UI.
        </p>
      </dialog>`;
}

function mstBsq(e) {
  alert(`Busca ${e.que}: '${e.valor}'`)
}
