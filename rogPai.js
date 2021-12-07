class rogPai {
  constructor(dom, datos = []) {
    this.w = {};
    this.dom = objDom(dom);
    this.datos = datos;
    this.series = series;

    this.tamano = "10px";
    this.borde = "red";

    this.dom.style.borderRadius = "50%";

    this.dom.onclick = () => this.mstDatos();
  }

  set datos(_datos) {
    this.w.datos = _datos;
    this.mst();
  }

  get datos() {
    return this.w.datos;  
  }

  set tamano(tam) {
    this.dom.style.padding = tam;
  }

  set borde(color) {
    this.dom.style.border = `1px solid ${color}`;
  }

  get valores() {
    let ultimo = this.colores().length - 1;

    return this.datos.map(x => x.cant)
      .map((valor, i, valores) => {
        return i < ultimo
          ? valor
          : i === ultimo
          ? valores.slice(i).reduce((total, valor) => (total += valor), 0)
          : undefined;
      })
      .filter((x) => x !== undefined);
  }

  colores() {
    return ["red", "orange", "yellow", "green", "blue", "purple"];
  }

  mst() {
    this.dom.style.background = `conic-gradient(${this.lstCategorias()})`;
  }

  mstDatos() {
    new rogVntTab({
      clase:   "rogVntDatos",
      visible: true,
      chacumbele: true
    },
    {datos: this.datos});
  }

  leyenda() {
    retorno = this.datos.map((valor, i) => {
      return { serie: this.w.etiquetas[i], valor: valor };
    });
  }

  mstLeyenda() {
    new rogVnt();
  }

  lstCategorias() {
    const fmt = (valor) => valor.toFixed(2) + "%";
    const uno = (valor, i) => {
      act = ant + valor;
      let retorno = `${this.colores()[i]} ${fmt(ant)} ${fmt(act)}`;
      ant = act;
      return retorno;
    };
    let ant = 0;
    let act = 0;
    return this.porcentajes(this.valores).map(uno).join();
  }

  porcentajes(valores) {
    const total = valores.reduce((total, valor) => (total += valor), 0);
    return valores.map((x) => (x * 100) / total);
  }
}
