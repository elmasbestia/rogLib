/*
 Objeto que manipula Ventanas
    PROPIEDADES:
    titulo
    dimensiones
    coordenadas
    tipo: lista, objeto, libre
    contenido
    clase
    modal: booleano
    chacumbele: se destruye al cerrarse
    boton: elemento DOM que sirve de "suiche" de la ventana

    CLASES:
    rogVnt: DOM contenedor de la ventana
    rogVntTit: título de la ventana
 */

class rogVnt extends HTMLElement {
  #contenido = "";
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"});
  }

  set titulo(valor) {
    this.setAttribute("titulo", valor);
  }

  get titulo() {
    return this.getAttribute("titulo") || "? ? ?";
  }

  get dlg() {
    return this.shadowRoot.querySelector("dialog");
  }

  get vnt() {
    return this.shadowRoot.querySelector("main");
  }

  get hdr() {
    return this.shadowRoot.querySelector("header");
  }

  get clase() {
    return `rogVnt${this.modal ? " modal" : ""}`
  }

  set tipo(valor) {
    this.setAttribute("tipo", valor);
  }

  get tipo() {
    return this.getAttribute("tipo") || "libre";
  }

  set contenido(valor) {
    this.#contenido = valor;
    if(this.vnt) this.vnt.innerHTML = valor;
  }

  get contenido() {
    return this.vnt ? this.vnt.innerHTML : this.#contenido;
  }

  set modal(valor) {
    this.setAttribute("modal", valor);
  }

  get modal() {
    return (this.hasAttribute("modal") && this.getAttribute("modal")!== "false");
  }

  set visible(valor) {
    this.setAttribute("visible", valor);
  }

  get visible() {
    return (this.hasAttribute("visible") && this.getAttribute("visible")!== "false");
  }
  
  get cierraVnt() {
    return this.shadowRoot.querySelector(".cierraVnt");
  }

  set chacumbele(valor) {
    this.setAttribute("chacumbele", valor);
  }

  get chacumbele() {
    return (this.hasAttribute("chacumbele") && this.getAttribute("chacumbele") !== "false");
  }

  // D I M E N S I O N E S
  set height(valor) {
    this.setAttribute("height", valor);
  }

  get height() {
    return this.getAttribute("height") || "fit-content";
  }

  set width(valor) {
    this.setAttribute("width", valor);
  }

  get width() {
    return this.getAttribute("width") || "fit-content";
  }

  // C O O R D E N A D A S
  set coordenadas(valor) {
    Object.entries(valor).forEach(([que,valor]) => this[que] = valor);
    if(this.dlg) Object.entries(valor).forEach(([que,valor]) => this.dlg.style[que] = valor);
  }

  set top(valor) {
    this.setAttribute("top", valor);
  }

  get top() {
    let nro = document.querySelectorAll("rog-vnt").length +1;
    return this.getAttribute("top") || `${scrollY +(30*nro)}px`;
  }

  set left(valor) {
    this.setAttribute("left", valor);
  }

  get left() {
    let nro = document.querySelectorAll("rog-vnt").length +1;
    return this.getAttribute("left") || `${scrollX +(15*nro)}px`;
  }

  mst(mst = !this.visible) {
    if(this.dlg) {
      if(mst) this.dlg[this.modal ? "showModal" : "show"]();
      else if (this.chacumbele) this.remove();
           else this.dlg.close();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = tmprogVnt(this);
    this.cierraVnt.onclick = e => {
      e.target.getRootNode().host.mst(false);
    }
    if(!this.modal) rogDonna(this.hdr);
    if(this.visible !== this.dlg.open) this.mst();
  }
  
  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(att, viejo, nuevo) {
    this.mst(nuevo === "true");
  }
}

customElements.define("rog-vnt", rogVnt);

function tmprogVnt(obj) {
  return `<style>
        dialog {
          padding: 0;
          height: ${obj.height};
          width:  ${obj.width};
          /*
          top:    ${obj.top};
          left:   ${obj.left};
          */
        }

        .modal::before {
          content: "";
          position: absolute;
          inset: 0 0 100% 100%;
          color: red;
        }

        header {
            position: relative;
            background-color: var(--clrFndObj);
            color: var(--clrTxtObj);
            text-align: center;
            padding: 2px;              
        }

        main {
            padding: 0.5rem;
            overflow: auto;
        }  

        .cierraVnt {
            position: absolute;
            top: 0.5px;
            right: 0.75px;
      
            color: white;
            background-color: #000;
            text-align: right;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.85s ease-in-out;
        }
      
        .cierraVnt:hover {
            opacity: 1;
        }
    </style>
    <dialog class="${obj.clase}">
        <header>
            <h3>${obj.titulo}</h3>
            <span class="cierraVnt">✘</span>
        </header>
        <main>
          ${obj.contenido}
        </main>
    </dialog>`;
}

function creaLista(lista) {
  return desarma(lista)
    .map((x) => domTxt(x, "LI"))
    .join("");
}

function eMovile(vnt) {
  let inicio = { x: 0, y: 0 };
  let traza = []

  vnt.draggable = true;
  vnt.addEventListener("dragstart", (e) => {
    inicio.x = e.target.style.left;
    inicio.y = e.target.style.top;
  });
  vnt.addEventListener("dragend", (e) => {
    console.log(e)
    e.target.style.top = e.y +"px";
    e.target.style.left = e.x +"px";
    console.log(e.target)
  });
}

function rogDonna(hdr) {
  let inicio = { x: 0, y: 0 };
  let traza = [];

  hdr.style.cursor = "grab";
  hdr.onmousedown = cogelo;

  const vnt = hdr.parentElement

  function cogelo(e) {
    e.preventDefault();
    // Posición inicial
    inicio.x = e.clientX;
    inicio.y = e.clientY;
    traza.push(inicio);
    document.onmouseup = sueltalo;
    document.onmousemove = muevelo;
  }

  function muevelo(e) {
    e.preventDefault();

    let posx = inicio.x - e.clientX;
    let posy = inicio.y - e.clientY;
    inicio.x = e.clientX;
    inicio.y = e.clientY;

    vnt.style.top  = (vnt.offsetTop - posy) + "px";
    vnt.style.left = (vnt.offsetLeft - posx) + "px";

    traza.push({
		  inicio,
		  client: {
			  x: e.clientX,
			  y: e.clientY,
		  },
		  pos: {
			  x: posx,
			  y: posy
		  },
      vntX: vnt.style.left,
      vntY: vnt.style.top
    });
  }

  function sueltalo() {
    document.onmouseup = null;
    document.onmousemove = null;
    console.log(traza);
  }
}

class rogVntEspera extends rogVnt {
  constructor(props = {}) {
    super({
      titulo: props.titulo || `Espera`,
      clase: "rogVntEspera",
      contenido: `<div class='texto'>${
        props.texto || (typeof props === "string" ? props : "")
      }</div>
      <i class='fa fa-spinner fa-spin' style='font-size: 5rem'></i>`,
      modal: true,
      chacumbele: true,
      visible: true
    });
  }
}

customElements.define("rog-vnt-espera", rogVntEspera);

class rogVntTab extends rogVnt {
  constructor(Vnt, Tab) {
    super();
    
    Object.entries(Vnt).forEach(([que,valor]) => this[que] = valor);
    if (Vnt.visible === undefined) this.visible = true;
    this.tabla = document.createElement("rog-tab");
    this.vnt.appendChild(tabla);
    Object.entries(Tab).forEach(([que,valor]) => this.tabla[que] = valor);
  }

  set datos(datos) {
    this.tabla.datos = datos;
  }

  get datos() {
    return this.tabla.datos;
  }
}

customElements.define("rog-vnt-tab", rogVntTab);

class rogVntCuadro extends rogVnt {
  constructor(datVnt, datCuadro) {
    super(datVnt);

    if (datVnt.visible === undefined) this.visible = true;
    datCuadro.dom = this.vnt;
    this.cuadro = new rogCuadro(datCuadro);
  }
}

customElements.define("rog-vnt-cuadro", rogVntCuadro);

class rogVntBlq extends rogVnt {
  constructor(vnt, blq) {
    super(vnt);

    if (vnt.visible === undefined) this.visible = true;
    this.blq = new rogBlq({ dom: this.vnt, ...blq });

    this.datos = this.blq.datos;
    this.frm = this.blq.detalle.frm;

    this.agrega = this.blq.agrega.bind(this.blq);
  }
}

customElements.define("rog-vnt-blq", rogVntBlq);

class rogVntFrm extends rogVnt {
  constructor(vnt, frm) {
    super(vnt);

    if (vnt.visible === undefined) this.visible = true;

    this.frm = new rogForm(this.vnt, frm.stru, this.opcsConEsc(frm.opcs));
  }

  opcsConEsc(frm = {}) {
    let retorno = Object.assign(frm);

    if(frm.opcs) {
      if(!frm.opcs.escapa) retorno.opcs.escapa = this.escapa;
    } else retorno.opcs = { escapa: this.escapa.bind(this)};

    return retorno;
  }

  escapa(e) {
    if(e.key === "Escape") this.mst();
  }
}

customElements.define("rog-vnt-frm", rogVntFrm);
