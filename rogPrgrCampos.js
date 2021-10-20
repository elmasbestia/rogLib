/*
    Progreso de llenado de planillas

    Muestra la cantidad de campos llenados de una forma

    @param frm          Elemento DOM a usar de base. 
                        Por defecto: la primera FORM que encuentre
    @param barra        Elemento DOM que muestra el avance. 
                        Por defecto: el primer elemento "PROGRESS" que encuentre
    @param onchange     

*/

class rogPrgrCampos {
  constructor(frm, barra, onchange) {
    this.dom = {};

    this.frm = frm;
    this.barra = barra;

    this.llenos = 0;

    this.fn = onchange;
  }

  set frm(frm) {
    this.dom.frm = objDom(frm) || document.querySelector("FORM");
  }

  get frm() {
    return this.dom.frm;
  }

  set barra(barra) {
    this.dom.barra = objDom(barra) || document.querySelector("progress");

    this.dom.barra.obj = this;
  }

  get barra() {
    return this.dom.barra;
  }

  get nbCampos() {
    return Array.from(
      new Set(
        Array.from(this.frm.elements)
          .filter((x) => x.name)
          .map((x) => x.name)
      )
    );
  }

  get campos() {
    return this.nbCampos.map(x => this.frm[x])
  }

    get valores() {
        return this.campos.map(x => jeto(x.name, x.value))
    }

  get cant() {
    return this.nbCampos.length;
  }

  set fn(fn = this.mstProgreso) {
    if (fn) this.frm.addEventListener("change", fn.bind(this));
  }

  cuentaLlenos() {
    return this.campos.reduce((cant, campo) => (cant += campo.value ? 1 : 0), 0);
  }

  mstProgreso() {
      function txt(cant,llenos) {
          return `Van ${llenos} de ${cant}. Faltan ${cant -llenos}`
      }

    this.llenos = this.cuentaLlenos();

    this.barra.max = this.cant;
    this.barra.value = this.llenos;
    this.barra.title = txt(this.cant,this.llenos)
  }
}
