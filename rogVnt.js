// Objeto que manipula Ventanas

class rogVnt {
  constructor(datos) {
      this.h = {}; // Hasta que a FF le de la gana
    this.dom = tmpVnt();
    this.titulo = datos.titulo;
    this.dimensiones = datos.dimensiones;
    this.coordenadas = datos.coordenadas;

    this.contenido = datos.contenido;
    this.texto = datos.texto;

    this.clase = datos.clase;

    this.modal = Boolean(datos.modal);

    this.agrDom(datos.visible);
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

  set contenido(valor = "") {
    let retorno = valor.toLowerCase();
    if (retorno !== "tabla") if (retorno !== "lista") retorno = "libre";
    this.h.contenido = retorno;
  }

  get contenido() {
    return this.h.contenido;
  }

  set texto(valor = "") {
    let _valor = valor;
    console.log("Texto");
    if (_valor) {
      switch (this.contenido) {
        case "tabla":
          _valor = mstTabla(...valor);
          break;
        case "lista":
          _valor = domTxt(creaLista(valor), "UL");
        // mstLista(...valor)
      }
    }
    this.vnt.innerHTML = _valor;
  }

  get texto() {
    this.vnt.innerHTML;
  }

  set dimensiones(valor = { width: "30vw", height: "40vh" }) {
    for (let que in valor) this.dom.style[que] = valor[que];
  }

  get dimensiones() {
    return { width: this.dom.style.width, height: this.dom.style.height };
  }

  set coordenadas(valor) {
      if(valor) {
          
      } else for (let que in valor) this.dom.style[que] = valor[que];
  }

  get coordenadas() {
    return { top: this.dom.style.top, left: this.dom.style.left };
  }

  set visible(valor) {
    this.h.visible = Boolean(valor);
    this.h.domModal.classList[this.visible ? "add" : "remove"]("activa");
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
    objDom(btn).onclick = this.mst.bind(this);
  }

  get vnt() {
    return this.dom.querySelector("main");
  }

  mst() {
    this.visible = !this.visible;
  }

  cierra() {
    document.body.remove(this.h.domModal);
    delete this;
  }

  agrDom(visible) {
    this.h.domModal = this.dom;
    if (this.modal) {
      this.h.domModal = document.createElement("DIV");
      this.h.domModal.className = "rogModal";
      this.h.domModal.appendChild(this.dom);
    } else rogDonna(this.dom);
    this.dom.querySelector(".cierraVnt").onclick = cierraVnt(this);
    document.body.appendChild(this.h.domModal);
    this.visible = visible;
  }

  lay() {
    this.texto = desarma(this)
      .map((x) => x + ": " + this[x])
      .join("<br>");
  }
}

function tmpVnt() {
  return `<header>
    <h3 class="rogVntTit"></h3>
    <span class="cierraVnt"><i class="fas fa-window-close"></i></span>
  </header>
  <main>
  </main>`;
}

function cierraVnt(vnt) {
  return (e) => {
    if (vnt.tiempo) clearTimeout(vnt.tiempo);

    vnt.visible = false;
  };
}

function creaLista(lista) {
  return desarma(lista)
    .map((x) => domTxt(x, "LI"))
    .join("");
}
