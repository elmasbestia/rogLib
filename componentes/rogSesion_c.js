
const _rogSesion = {
  observados: ["estado", "opciones"],

  cambia: {
    opciones: (obj, viejo, nuevo) => {
      obj.opciones = nuevo;
    }
  },

  chxOpc: e => {
    e.currentTarget.closest("DIV").querySelector("#mnuSuiche").checked = false
  },

  chxMnuUsr: (e) => {
    e.target.obj.dispatchEvent(new Event(e.target.dataset.opc))
  },

  chgUsr: (e) => {
    e.target.getRootNode().host.dispatchEvent(new CustomEvent("change",{detail: e.detail}));    
  },

  enlazaLee: (obj) => {
    obj.login.addEventListener("lee", e => {
      obj.dispatchEvent(new CustomEvent("lee", { detail: e.detail }))
    })
  },

  enlazaOpciones: (obj) => {
    obj.shadow.querySelectorAll(".mnuOpcion").forEach(x => x.obj = obj);
  }
};

class rogSesion extends HTMLElement {
  #opciones = [];
  #usr = {};
  #estado = "cerrada";
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  get name() {
    return this.getAttribute("name");
  }

  set opciones(opcs) {
    this.#opciones = Array.isArray(opcs) ? opcs : opcs.split(", ");
    this.render();
  }

  get opciones() {
    return this.#opciones;
  }

  set usr(valor) {
    this.#usr = valor;
  }

  get usr() {
    return this.#usr;
  }

  get USR() {
    return this.shadow.querySelector("rog-usr");
  }

  get login() {
    return this.shadow.querySelector("rog-login");
  }

  set error(msj) {
    this.login.error = msj;
  }

  set estado(valor) {
    this.#estado = valor;
    if(this.login) this.login.estado = valor;
  }

  get estado() {
    return this.#estado
  }

  set proveedores(valor) {
    this.setAttribute("proveedores",valor)
  }

  get proveedores() {
    return (this.hasAttribute("proveedores") && (this.getAttribute("proveedores") !== "false"));
  }

  abre(infoUsr) {
    if (this.estado === "cerrada") {
      this.usr = infoUsr;
      if(this.USR) this.USR.value = infoUsr;
      this.estado = "abierta";
    } else if (this.estado === "bloqueada") {
      if(infoUsr.correo === this.usr.correo) {
        this.usr = infoUsr;
        this.estado = "abierta";
      } else {
        alert("¡Debe cerrar primero la sesión actual!")
      }
    } else {
      alert("¡Debe cerrar primero la sesión actual!")
    }
  }

  cierra() {
    this.estado = "cerrada";
    this.value = {};
  }

  bloquea() {
    this.estado = "bloqueada";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = tmprogSesion(this);

    /**
    * PIRATERIA!!!
    * Ya que me sabotean los svg, hacemos esta conversion chimba:
    */
    this.shadowRoot.querySelectorAll(".icono").forEach(x => {
      if(x.textContent) x.innerHTML = x.textContent
    });

    this.USR.value = this.usr;

    _rogSesion.enlazaLee(this);
    _rogSesion.enlazaOpciones(this);
  }

  static get observedAttributes() {
    return _rogSesion.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    if (_rogSesion.cambia[att]) _rogSesion.cambia[att](this, viejo, nuevo);
    this.render();
  }
}

customElements.define("rog-sesion", rogSesion);

function tmprogSesion(obj) {
  function tmpOpciones(obj) {
    return obj.opciones.map(
      (opcion) => `<a class="mnuOpc" 
        href="${opcion.url || "#"}" 
        target="${opcion.target || "_self"}" 
        rel="noopener noreferrer">
          ${typeof opcion === "string" ?
            opcion :
            opcion.icono
            ? `<span title="${opcion.txt}"><i class="icono">${opcion.icono}</i></span>`
            : opcion.txt
          }
        </a>`
    ).join("");
  }

  return `<style>
      ${tmpCSSrogSesion()}
    </style>
    <nav class="mnuPpal">
      <div class="opciones">
        <label for="mnuSuiche" id="mnuCtl">&#9776;</label>
        <input type="checkbox" name="mnuSuiche" id="mnuSuiche">
        <menu class="menu mnuPpalOpciones" onclick="_rogSesion.chxOpc(event)">
          ${tmpOpciones(obj)}
        </menu>
        <menu class="menu mnuSecundario">
          <slot></slot>
        </menu>
      </div>
      <div id="idUsr">
        <rog-usr onchange="_rogSesion.chgUsr(event)">
          ${obj.minificha ? obj.minificha(obj.usr) : ""}
          <li class="mnuOpcion" data-opc="bloquear" icono="🚫 " onclick="_rogSesion.chxMnuUsr(event)">Bloquear</li>
          <li class="mnuOpcion" data-opc="cerrar" icono="✘ " onclick="_rogSesion.chxMnuUsr(event)">Cerrar Sesión</li>
        </rog-usr>
      </div>
      <rog-login estado="${obj.estado}" ${obj.proveedores ? "proveedores" : ""}></rog-login>
    </nav>`;
}

function tmpCSSrogSesion(obj) {
  return `.mnuPpal {
    position: relative;

    padding: .25em;
    border-radius: 5px;
    background-color: var(--clrObjFnd);
    color: var(--clrObjTxt);

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
    
  #idUsr {
    height: 100%;
    margin-left: auto;
    position: relative;
  }

  [data-opc]::before {
    text-shadow: 1px 1px 3px var(--clrTxt);
    content: attr(icono);
  }
    
  /* Menúes */
    
  #mnuSuiche {
    display: none;
  }
    
  #mnuCtl {
    all: unset;
    display: none;
  }
    
  .menu {
    color: var(--clrObjTxt);
    background-color: var(--clrObjFnd);
    padding-inline-start: 0;
  }

  .opciones {
    display: flex;
    justify-content: space-between;
    align-items: center;
	flex-grow: 1;
  }

  /*
  .mnuPpalOpciones {
    all: unset;
    display: flex;
    transition: height 0.5s;
  }
    */
  .mnuPpalOpciones .mnuOpc {
    display: inline-block;
    padding: 0.1em 0.5em;
    font-size: var(--szOpcion, 1em);
    height: 1em;
    margin: .75em;
  }

  .mnuOpc svg,
  .mnuOpc img {
    height: 100%;
  }

  .mnuOpcion:hover {
    box-shadow: var(--sombra);
  }
    
  .menu .mnuOpc:hover {
    color: var(--clrTxtChx);
    background-color: var(--clrFndChx);
  }

  .menu.mnuSecundario {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2em;
  }
    
  @media screen and (max-width: 600px) {
    .mnuPpalOpciones {
      height: 0;
      position: absolute;
      top: 3em;
      flex-direction: column;
      overflow: hidden;
      box-shadow: var(--sombra);
    }
    
    #mnuSuiche:checked + .mnuPpalOpciones {
      background-color: var(--clrObjFnd);
      color: var(--clrObjTxt);
      height: max-content;
    }
    
    .menu .mnuOpc {
      padding: 0.5em 1em;
    }
  
    #mnuCtl {
      display: block;
    }
  }`;
}
