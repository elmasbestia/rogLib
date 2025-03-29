/**
 * Histograma
 * Componente
 */

const _rogHisto = {
    observados: ["tipo", "apilado", "prc", "label", "carga", "abscisa", "ordenada", "valor"],
  
    cambia: {},
  
    colores: ["red", "orange", "yellow", "lightgreen", "lightblue", "pink"],

    componente: (ele) => ele.getRootNode().host,

    clic: (e) => {
      e.stopPropagation();
      const blanco = e.target;
      if (blanco.matches(".pai")) _rogHisto.mstLeyenda(e);
      else if (blanco.matches(".etiqueta")) {
        _rogHisto.componente(blanco).dispatchEvent(
          new CustomEvent("click", {
            detail: { serie: blanco.textContent }
          })
        );
      } else _rogHisto.cierra(e);
    },
  
    Prc: new Intl.NumberFormat("VES", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format,

    extraeFn: (valor) => (valor ? window[valor.split("(").shift()] : valor),

    mst: obj => {
        Highcharts.chart(obj.cuadro, {
            lang: {
                downloadCSV:"Descarga CSV Imagen Vector",  
                downloadJPEG:"Descargar JPEG",
                downloadPDF:"Descargar Documento PDF",
                downloadPNG:"Descargar Imagen PNG",
                downloadSVG:"Descargar SVG",
                downloadXLS:"Descargar XLS",
                printChart:"Imprimir Gráfico",
                viewData:"Ver Tabla de Datos",
                viewFullscreen:"Ver en Pantalla Completa",
                drillUpText:"◁ Regresar a {series.name}"
            },

            chart: {
                type: obj.tipo
            },

            title: {
                text: obj.label,
            },

            xAxis: {
                categories: obj.abscisas
            },

            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: obj.ordenadas
                }
            },

            tooltip: {
                format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
                    'Total: {point.stackTotal}'
            },

            plotOptions: {
                column: {
                    stacking: obj.apilado
                }
            },

            series: obj.series
        })
    },

    creaSeries: obj => {
        const abscisa = obj.abscisa;
        const ordenada = obj.ordenada;
        const valor = obj.valor;
        const total = 0;

        const ciclo = {
            con: (series, x) => {
                if(series[x[ordenada]]) {
                    if(series[x[ordenada]][x[abscisa]]) series[x[ordenada]][x[abscisa]] += x[valor]
                    else series[x[ordenada]][x[abscisa]] = x[valor]
                } else {
                    series[x[ordenada]] = {}
                    series[x[ordenada]][x[abscisa]] = x[valor]
                }
    
                return series
            },
            sin: (series, x) => {
                for(let campo in x) {
                    if(campo !== abscisa) {
                        if(series[campo]) {
                            if(series[campo][x[abscisa]]) series[campo][x[abscisa]] += x[campo]
                            else series[campo][x[abscisa]] = x[campo]
                        } else {
                            series[campo] = {}
                            series[campo][x[abscisa]] = x[campo]
                        }
                    }
                }
    
                return series
            }
        }

        const previo = obj.datos.reduce(ordenada ? ciclo.con : ciclo.sin, {})

        const abscisas = Array.from(new Set(Object.entries(previo).reduce((series, [name, valores]) => {
            series = series.concat(Object.keys(valores))
            return series
        }, [])));

        const series = Object.entries(previo).reduce((series, [name, valores]) => {
            let _valores = abscisas.map(x => valores[x], 0)
            series.push({name, data: _valores})
            return series
        }, [])

        obj.series = {series, total, abscisas};
    } 
}

class rogHisto extends HTMLElement {
    #series;
    #datos;
    #carga;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
  
    get name() {
      return this.getAttribute("name");
    }

    set tipo(valor) {
        this.setAttribute("tipo",valor);
    }

    get tipo() {
        return this.getAttribute("tipo") || "bar";
    }

    set datos(datos) {
      this.#datos = datos;
      this.render();
    }
  
    get datos() {
      let retorno = this.#datos;
      if(!retorno) if (this.carga) retorno = this.carga();
      return retorno || [];
    }
  
    set carga(valor) {
      if(typeof valor === "string") this.setAttribute("carga", valor);
      else this.datos = valor();
    }
  
    get carga() {
        return this.hasAttribute("carga") ? _rogHisto.extraeFn(this.getAttribute("carga")) : null; 
    }
  
    set series(valor) {
        this.#series = valor;
    }

    get series() {
        return this.#series.series;
    }

    get total() {
        return this.#series.total;
    }

    set label(valor) {
        this.setAttribute("label", valor);
    }

    get label() {
        return this.getAttribute("label");
    }

    set abscisa(valor) {
        this.setAttribute("abscisa", valor);
    }

    get abscisa() {
        return this.getAttribute("abscisa");
    }

    get abscisas() {
        return this.#series.abscisas
    }

    set ordenada(valor) {
        this.setAttribute("ordenada", valor);
    }

    get ordenada() {
        return this.getAttribute("ordenada");
    }

    set valor(valor) {
        this.setAttribute("valor", valor);
    }

    get valor() {
        return this.getAttribute("valor");
    }

    get cuadro() {
        return this.shadowRoot.querySelector("div");
    }

    set apilado(valor) {
        this.setAttribute("apilado", valor);
    }

    get apilado() {
        return this.getAttribute("apilado") || "normal";
    }

    toString() {
        return this.series.map((x) => x.toString());
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallBack() {}

    render() {
        this.shadow.innerHTML = `<div></div>`;
        _rogHisto.creaSeries(this);
        _rogHisto.mst(this)
    }

    static get observedAttributes() {
        return _rogHisto.observados;
    }

    attributeChangedCallback(att, viejo, nuevo) {
        if (_rogHisto.cambia[att]) _rogHisto.cambia[att](this, viejo, nuevo);
        this.render();
    }
}

customElements.define("rog-histo", rogHisto);
