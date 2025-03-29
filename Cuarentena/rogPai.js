class rogPai {
  constructor(dom, datos = [], titulo = "Datos") {
    this.w = {};
    this.titulo = titulo;
    this.dom = dom;
    this.datos = datos;

    this.tamano = "3rem";
    this.borde = "black";

    this.dom.style.borderRadius = "50%";

    this.dom.obj = this;

    this.css = new rogCSS({".etqSerie::before": {
      content: " ",
      height: "1em",
      width: "1em",
      "background-color": "attr(data-color)"
    }})
  }

  set dom(dom) {
    this.w.dom = objDom(dom);
    this.w.dom.classList.add("rogPai");
    this.dom.onclick = this.leyenda.bind(this);
    this.dom.title = this.titulo;
  }

  get dom() {
    return this.w.dom;
  }

  set datos(_datos) {
    this.w.series = creaSeries(_datos);

    this.w.total = this.datos.reduce((total, valor) => (total += valor), 0);

    this.mst();
  }

  get datos() {
    return this.w.series.map((x) => x.valor);
  }

  get series() {
    return this.w.series;
  }

  get total() {
    return this.w.total;
  }

  set tamano(tam) {
    this.dom.style.height = tam;
    this.dom.style.aspectRatio = 1;
  }

  set borde(color) {
    this.dom.style.border = `1px solid ${color}`;
  }

  pc(n) {
    return n / this.total;
  }

  mst() {
    this.dom.style.background = `conic-gradient(${this.gradiente()})`;
  }

  leyenda() {
    new rogVntTab(
      {
        titulo: this.titulo,
        clase: "rogVntDatos",
        visible: true,
        chacumbele: true
      },
      {
        titulo: "Series",
        datos: this.series.map((x, i) => ({
          indice: i,
          etiqueta: x.etiqueta,
          valor: x.valor,
          "%": this.pc(x.valor)
        }))
      }
    );
  }

  gradiente() {
    const fmt = (valor) => (valor *100).toFixed(2) + "%";
    let retorno = [];
    this.series.reduce((van, serie) => {
      let pc = van + this.pc(serie.valor);
      retorno.push(`${serie.color} ${fmt(van)} ${fmt(pc)}`);
      return (van = pc);
    }, 0);
    return retorno.join();
  }

  toString() {
    this.series.map(x => x.toString());
  }
}

class rogSerie {
  constructor(datos) {
    this.indice = datos.indice;
    this.color = colores()[this.indice];
    this.etiqueta = datos.etiqueta;
    this.valor = datos.valor;
  }

  toString() {
    return `<span class="etqSerie" data-color="${this.color}">${this.etiqueta}</span> ${this.valor}`;
  }
}

function colores() {
  return ["red", "orange", "yellow", "green", "blue", "purple"];
}

function creaSeries(datos) {
  /*
      Los datos pueden ser:
      1. Un arreglo de valores
      2. Un arreglo de objetos
      3. Un Objeto
    */
  const limite = colores().length;
  const etiquetas = datos instanceof Array ? 
    datos.map((x,i) => "Serie " + (i + 1)) :
    desarma(datos);

  let arreglo = (datos instanceof Array ? datos : Object.values(datos)).map(
    (valor,i) => ({ etiqueta: etiquetas[i], valor })
  );

  let retorno = arreglo.slice(0, limite).map((x, i) => {
    return new rogSerie({
      indice: i,
      color: colores()[i],
      etiqueta: x.etiqueta,
      valor: x.valor
    });
  });

  if (arreglo.length > limite) {
    let ultima = limite - 1;
    retorno.push(
      new rogSerie({
        indice: ultima,
        color: colores()[ultima],
        etiqueta: "Resto ...",
        valor: arreglo
          .slice(limite + 1)
          .reduce((resto, x) => (resto += x.valor || 0), 0)
      })
    );
  }

  return retorno;
}

function anadeDatoASerie() {}
