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
class rogVnt {
  constructor(opcs) {
    this.h = {}; // Hasta que a FF le de la gana
    this.dom = tmpVnt();
    this.titulo = opcs.titulo || "";
    this.dimensiones = opcs.dimensiones;
    this.coordenadas = opcs.coordenadas;

    this.tipo = opcs.tipo;
    this.contenido = opcs?.contenido;

    this.clase = opcs.clase;

    this.modal = Boolean(opcs.modal);

    this.boton = opcs.boton;

    this.agrDom(opcs.visible);

    this.chacumbele = opcs.chacumbele;
  }

  set dom(tmp) {
    this.h.dom = document.createElement("DIV");
    this.h.dom.innerHTML = tmp;
    this.h.dom.className = "rogVnt";
  }

  get dom() {
    return this.h.dom;
  }

  set titulo(valor = "T í t u l o") {
    this.dom.querySelector(".rogVntTit").innerHTML = valor;
  }

  get titulo() {
    return this.dom.querySelector(".rogVntTit").innerText;
  }

  get tipos() {
    return {
      lista: (valor) => domTxt(creaLista(valor), "UL"),
      objeto: (valor) => valor.innerHTML,
      libre: (valor) => valor
    };
  }

  set tipo(valor = "") {
    let retorno = valor.toLowerCase();
    this.h.tipo = desarma(this.tipos).includes(retorno) ? retorno : "libre";
  }

  get tipo() {
    return this.h.tipo;
  }

  set contenido(valor = "") {
    this.vnt.innerHTML = valor ? this.tipos[this.tipo](valor) : valor;
  }

  get contenido() {
    this.vnt.innerHTML;
  }

  set dimensiones(valor = { width: "content", height: "content" }) {
    for (let que in valor) this.dom.style[que] = valor[que];
  }

  get dimensiones() {
    return { width: this.dom.style.width, height: this.dom.style.height };
  }

  set coordenadas(valor = {top: `${scrollY +30}px`, left: "3em"}) {
    for (let que in valor) this.dom.style[que] = valor[que];
  }

  get coordenadas() {
    return { top: this.dom.style.top, left: this.dom.style.left };
  }

  set visible(valor) {
    this.h.visible = Boolean(valor);
    this.h.domModal.classList[this.visible ? "add" : "remove"]("activa");
    if (this.boton) this.boton.dataset.estado = this.visible;
    if (!this.visible && this.chacumbele) this.cierra();
  }

  get visible() {
    return this.h.visible;
  }

  set clase(valor = "") {
    if (valor) this.dom.classList.add(valor);
  }

  get clase() {
    return this.dom.classList;
  }

  set boton(btn) {
    if (btn) {
      this.h.boton = objDom(btn);
      this.boton.addEventListener("click", this.mst.bind(this));
    }
  }

  get boton() {
    return this.h.boton;
  }

  get vnt() {
    return this.dom.querySelector("main");
  }

  mst() {
    this.visible = !this.visible;
  }

  cierra() {
    cierraVnt(this)
  }

  agrDom(visible) {
    this.h.domModal = this.dom;
    if (this.modal) {
      this.h.domModal = document.createElement("DIV");
      this.h.domModal.className = "rogModal";
      this.h.domModal.appendChild(this.dom);
    } else rogDonna(this.dom);
    this.dom.querySelector(".cierraVnt").onclick = this.cierra.bind(this);
    document.body.appendChild(this.h.domModal);
    this.visible = visible;
  }

  lay() {
    this.contenido = desarma(this)
      .map((x) => x + ": " + this[x])
      .join("<br>");
  }
}

function tmpVnt() {
  return `<header>
      <h3 class="rogVntTit"></h3>
      <span class="cierraVnt">✘</span>
    </header>
    <main>
    </main>`;
}

function cierraVnt(vnt) {
  if (vnt.tiempo) clearTimeout(vnt.tiempo);

  if(vnt.chacumbele) {
    vnt.h.domModal.remove();
    vnt = null;
  } else vnt.visible = false;
}

function creaLista(lista) {
  return desarma(lista)
    .map((x) => domTxt(x, "LI"))
    .join("");
}

function eMovile(vnt) {
  let inicio = { x: 0, y: 0 };

  vnt.draggable = true;
  vnt.addEventListener("dragstart", (event) => {
    inicio.x = event.clientX;
    inicio.y = event.clientY;
  });
  vnt.addEventListener("dragend", (event) => {
    vnt.style.top = vnt.offsetTop - inicio.y - event.clientY + "px";
    vnt.style.left = vnt.offsetLeft - inicio.x - event.clientX + "px";
  });
}

function rogDonna(vnt) {
  let inicio = { x: 0, y: 0 };
  let traza = [];
  const encabezado = vnt.querySelector("header");

  encabezado.style.cursor = "grab";
  encabezado.onmousedown = cogelo;

  function cogelo(e) {
    e = e || window.event;
    e.preventDefault();
    // Posición inicial
    inicio.x = e.clientX;
    inicio.y = e.clientY;
    traza.push(inicio);
    document.onmouseup = sueltalo;
    document.onmousemove = muevelo;
  }

  function muevelo(e) {
    e = e || window.event;
    e.preventDefault();

    let posx = inicio.x - e.clientX;
    let posy = inicio.y - e.clientY;
    inicio.x = e.clientX;
    inicio.y = e.clientY;

    vnt.style.top = vnt.offsetTop - posy + "px";
    vnt.style.left = vnt.offsetLeft - posx + "px";

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

class rogVntTab extends rogVnt {
  constructor(Vnt, Tab) {
    super(Vnt);

    if (Vnt.visible === undefined) this.visible = true;
    this.tabla = new rogTab(Tab.datos, this.vnt, Tab.titulo, Tab.campos, Tab.Fn);
  }

  set datos(datos) {
    this.tabla.datos = datos;
  }

  get datos() {
    return this.tabla.datos;
  }
}

class rogVntCuadro extends rogVnt {
  constructor(datVnt, datCuadro) {
    super(datVnt);

    if (datVnt.visible === undefined) this.visible = true;
    datCuadro.dom = this.vnt;
    this.cuadro = new rogCuadro(datCuadro);
  }
}

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
