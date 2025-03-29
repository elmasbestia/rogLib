/**
 * Etiquetas: {label, }
 */
class rogChart extends HTMLElement {
    #datos = [];
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    get titulo() {
        return this.getAttribute("titulo") || "";
    }

    set titulo(valor) {
        this.setAttribute("titulo", valor);
    }

    get subtitulo() {
        return this.getAttribute("titulo") || "";
    }

    set subtitulo(valor) {
        this.setAttribute("titulo", valor);
    }

    get label() {
        return this.getAttribute("label") || "Valores";
    }

    set label(valor) {
        this.setAttribute("label",valor);
    }

    get campo() {
        return this.getAttribute("campo");
    }

    set campo(valor) {
        this.setAttribute("campo",valor);
    }

    get nbY() {
        return this.getAttribute("nbY") || "Cantidad";
    }

    set nbY(valor) {
        this.setAttribute("nbY",valor);
    }

    get sufijo() {
        return this.getAttribute("sufijo") || "Series";
    }

    set sufijo(valor) {
        this.setAttribute("sufijo",valor);
    }

    get type() {
        return this.getAttribute("type") || 'bar';
    }

    set type(valor) {
        this.setAttribute("type", valor);
    }

    get datos() {
        return (this.datos instanceof Function ? this.#datos() : this.#datos)
        .map(x => {
            let retorno = {}
            if(this.valor) retorno[this.valor] = x[this.valor];
            else {
                let [que, valor] = Object.entries(x)[0];
                retorno[que] = valor;
            }
            return retorno;
        });
    }

    set datos(f) {
        this.#datos = f;
    }

    connectedCallback() {
        this.render();
    }
    
    disconnectedCallBack() {}
    
    render() {
        this.etiquetas = new rogEtiquetas(this.label,this.campo,this.datos)
        this.shadow.innerHTML = `<div class="card">
            <div id="container"></div>
        </div>`;

        creaChart(this);

        if(this.url) {
            obj.shadowRoot.querySelectorAll(".highcharts-xaxis-labels text")
            .forEach(x => {
                x.onclick= (e) => {
                    let query = {};
                    query[this.campo] = e.target.textContent;
                    window.open(this.url(query));
                };
            });
        }
    }
    
    static get observedAttributes() {
        return ["datos", "url"];
    }
    
    attributeChangedCallback(att, viejo, nuevo) {
        this.render();
    }
}
    
customElements.define("rog-chart", rogChart);

class rogEtiquetas {
    #etqs = [];
    constructor(prms) {
        this.label = prms.label;
        this.campo = prms.campo;
        this.datos = prms.datos || [];
    }

    set datos(datos) {
        datos.forEach(x => this.#etqs.push(x[this.campo]));
    }

    get etqs() {
        return this.#etqs;
    }
}

        function creaChart(obj) {
    $('#container').highcharts({
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
        //backgroundImage:{
            //type: 'url("./Imagenes/login.png")''
        //}, 
        chart: {
            type: obj.type
        },
        title: {
            text: obj.titulo
        },
        subtitle: {
            text: obj.subtitulo
        },
                xAxis: {
                    categories: obj.etiquetas.etqs,
                    title: {
                        text: obj.etiquetas.label
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: obj.nbY,
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: obj.sufijo
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || ''),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: obj.label,
                    colorByPoint: true,
                    data: obj.datos
                }],
            });
        }

        function urlConsulta(id,query) {
            let campo = "", valor = "", sql="";
            if(query) {
                let [campo, valor] = Object.entries(query)[0];
                sql = `?${campo}=${valor}`;
            }

            return `consulta${id}.php${sql}`;
        }
