// https://www.todojs.com/12-pasos-para-construir-un-componente-web/
/*
   1. Diseno de interaccion 
   
   a. Calendario de un lapso
   a. Al pulsar un dia, dispara el evento chxDia
   b. Tiene como ir al mes anterior y al posterior
   c. Puede tener una imagen como fondo
   
*/
/*
   2. Nombre del componente
   
   rog-calendario
*/
/* 

   3. Cargar el componente

    import '.../rogLib/componentes/todojs-multiselect.js';

    <script src=".../rogLib/componentes/todojs-multiselect.js"></script>

*/
/*
	4. Definir el API
	
	Atributos:
	
	Propiedades
    a. Lapso Lapso de tiempo a ser dibujado
	
	Metodos
	a. mst    Muestra el calendario y/o los meses anterior/siguiente
    b. cmbDia Cambia los atributos de un dia en especial
	
	Eventos
	a. chxMes
	b. chxDia
    c. mst
*/
/*
	5. DOM y gestiÃ³n de estado	
*/
/*
	6. Cambios en el light
*/
const MOSTRANDO = Symbol();

/**
 * Objetos complementarios
 */

/**
 * Objeto Lapso entre dos fechas
 * @param {date} desde 
 * @param {date} hasta 
 */
class rogLapso {
    constructor (desde,hasta) {
        const prm = _rogCal.interpretaLapso(desde, hasta)
        this.desde = creaFecha(prm.desde);
        this.hasta = prm.hasta ? creaFecha(prm.hasta) : ultimo(this.desde);
        this.dias = this.creaDiasLapso(this.desde, this.hasta);
        this.x = 0;
        this.n = this.dias.length
    }

    get esMes () {
        let retorno = false;
        if (this.desde.getDate() === 1) {
            const mes = this.hasta.getMonth()
            retorno = (this.desde.getMonth() === mes) && ((new rogFecha(this.hasta)).esUltimo());
        }
        return retorno;
    }

    get siguiente () {
        if(this.x === this.n) return null
        else return new rogFecha(this.dias[this.x++]);
    }

    ciclo (fn) {
        this.dias.forEach(dia => {
            fn(new rogFecha(dia));
        });
    }

    toString () {
        if(this.esMes) return rogFmtFecha(this.desde)[this.esteAno() ? 'mmmm' : 'nbMes']();
        
        return `Desde ${rogFmtFecha(this.desde).dma()} hasta ${rogFmtFecha(this.hasta).dma()}`;
    }

    esteAno (ano = (new Date()).getFullYear()) {
        return this.getFullYear() === ano;
    }

    /**
     * Días en un lapso de tiempo
     * @param {date} desde fecha inicial del Lapso
     * @param {date} hasta fecha final del lapso
     * @returns {array} Fechas
     */
    creaDiasLapso(desde,hasta) {
        let retorno = [];
  
        for(let xFecha = new Date(desde);
            xFecha <= hasta;
            xFecha = fSuma(1,xFecha)
        ) retorno.push(xFecha);
  
        return retorno;
    }

    getFullYear = function () { return this.desde.getFullYear()}
    getMonth = function () { return this.desde.getMonth()}
    getDate = function () { return this.desde.getDate()};
    getDay = function () { return this.desde.getDay()};
}    

/**
 * Funciones
 */

const _rogCal = {
    cambia: {
        fecha: (obj, viejo, nuevo) => {
            obj.setFecha(new rogFecha(nuevo));
        },

        llenaDia: (obj, viejo, nuevo) => {
            obj.cadaDia = window[nuevo.split("(")[0]]
        }
    },

    mstFrmLapso: (e) => {
        const cal = e.target.closest(".calMes");
        const di = cal.querySelector("dialog")
        di.open = !di.open;
    },

    tmpDias: (obj) => {
        const primero = obj.lapso.desde.getDay();
        const dias = obj.shadowRoot.querySelector(".calDias");

        debugger
        for (xdia = 0; xdia < primero; xdia++) dias.appendChild(_rogCal.tmpDia());
        obj.lapso.dias.forEach(f => {
            let dia = _rogCal.tmpDia(f)
            dias.appendChild(dia);
            obj.cadaDia(dia);
        });
        for (xdia = obj.lapso.hasta.getDate(); xdia < 7; xdia++) dias.appendChild(_rogCal.tmpDia());
        
        dias.obj = obj;
    },

    tmpDia: (fecha) => {
        const retorno = document.createElement("rog-diacalendario");
        if(fecha) {
            retorno.fecha = fecha;
        }
        return retorno;
    },

    chxDia: (e) => {
        e.stopPropagation();
        const que = e.target.closest("rog-diacalendario");
        if(que) e.currentTarget.obj.dispatchEvent(new CustomEvent("click", {detail: {dia: que}}))
    },

    mesAnt: (e) => {
        e.stopPropagation();
        const cal = e.target.closest(".calMes");
        cal.obj.mesAnt()
    },

    mesSig: (e) => {
        e.stopPropagation();
        const cal = e.target.closest(".calMes");
        cal.obj.mesSig()
    },

    /**
     * Devuelve el texto de un @element time para una fecha dada
     * @param {date} fecha 
     * @param {string} fmtFecha Formato de la fecha según @function rogFmtFecha
     * @returns {string}
     */    
    domFecha: (fecha, fmt) => {
        return `<time datetime='${fecha}'>${rogFmtFecha(fecha)[fmt]()}</time>`;
    },

    /**
     * Selecciona el nombre del Día que tiene el foco en el encabezado
     * @param {event} e 
     */
    chxTit: (e) => {
        e.stopPropagation();

        const dia = e.target.closest("rog-diacalendario");
        if(dia) {
            _rogCal.outTit(e);
            e.currentTarget.querySelectorAll(".nbDia")[dia.fecha.getDay()].classList.add("chxTit");
        }
    },

    /**
     * Deselecciona el nombre del día que pierde el foco
     */
    outTit: (e) => {
        let dias = e.target.closest(".calDias")
        let tit = dias.querySelector(".chxTit") 
        if (tit) tit.classList.remove("chxTit");
    },

    preparaFrm(obj) {
        const frm = obj.frm.querySelector("form")
        frm.onsubmit = e => {
            e.preventDefault()

            _rogCal.mstFrmLapso(e);

            if (!e.submitter.hasAttribute("cancela")) {
                obj.desde = Array.from(frm.querySelectorAll("input")).map(x => x.value).join(" > ")
            }
        }
    },

    interpretaLapso: (desde, hasta) => {
        let _desde, _hasta;
    
        if(desde) {
            if(typeof desde === "string") {
                [_desde, _hasta] = desde.split(" > ");
                if(((!_hasta) && hasta)) _hasta = hasta;
            } else {
                if (desde.hasOwnProperty("desde")) {
                    _desde = desde.desde
                    _hasta = desde.hasta
                } else {
                    _desde = desde;
                    _hasta = hasta;
                }
            }
        }
        return {desde: _desde, hasta: _hasta}
    }    
}

class rogDiaCal extends HTMLElement {
    #fecha;
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    get fecha() {
        return this.#fecha;
    }

    set fecha(f) {
        this.setAttribute("fecha",f)
    }

    setFecha(f) {
        this.#fecha = f;
    }

    set txt(valor) {
        this.setAttribute("txt", valor);
    }

    get txt() {
        return this.getAttribute("txt");
    }

    get clase() {
        return this.fecha?.clase();
    }

    connectedCallback() {
        this.render();
    }
    
    disconnectedCallBack() {}
    
    render() {
        this.shadowRoot.innerHTML = tmprogCSSCalDia(this) +
            (this.fecha ? 
            `<div class="celDia calDia ${this.clase}" ${this.txt ? `data-txt="${this.txt}"` : ""}>
            ${_rogCal.domFecha(this.fecha,"dd")}
			<main>
				<slot></slot>
			</main>
            </div>`
            : "<div class='celDia'></div>");
    }

    static get observedAttributes() {
        return ["fecha", "txt"];
    }

    attributeChangedCallback(att, viejo, nuevo) {
        if (_rogCal.cambia[att]) _rogCal.cambia[att](this, viejo, nuevo);
        this.render();
    }
}
    
customElements.define("rog-diacalendario", rogDiaCal);

class rogCalendario extends HTMLElement {
    constructor() {
        super();

        this[MOSTRANDO] = false; // Para evitar "loops"
        this.cadaDia = () => {};

        this.attachShadow({ mode: "open" });
    }

    /**
     * Lapso puede ser un mes, una fecha, dos fechas o un @object rogLapso
     */
    set desde(valor) {
        this.setAttribute("desde",valor);
    }

    get desde() {
        return this.getAttribute("desde");
    }
    
    set llenaDia(valor) {
        this.setAttribute("llenaDia",valor);
    }

    get llenaDia() {
        return this.getAttribute("llenaDia");
    }

    get dias() {
        return Array.from(this.shadowRoot.querySelectorAll("rog-diacalendario")).filter(x => x.fecha);
    }
	
	set foto(urlFoto) {
        this.setAttribute("foto", urlFoto)
	}

    get foto() {
        return this.getAttribute("foto")
    }

    /**
     * Muestra el Mes siguiente
     */
    mesSig() {
        this.desde = new Date(this.lapso.getFullYear(), this.lapso.getMonth() +1);
    }

    /**
     * Muestra el Mes anterior
     */
    mesAnt() {
        this.desde = new Date(this.lapso.getFullYear(), this.lapso.getMonth() -1);
    }

    connectedCallback() {
        this.render();
    }
    
    disconnectedCallBack() {}
    
    render() {
        if (!this[MOSTRANDO]) {
            this[MOSTRANDO] = true;

            this.dispatchEvent(new Event("antesDeMostrar"))

            this.lapso = new rogLapso(this.desde);

            this.shadowRoot.innerHTML = tmpROGCalendario(this);

            /**
             * P I R A T E R I A:
             * Mientras averiguo porque no quiere disparar el cambio de atributo para "llenaDia"
             */
            if(this.hasAttribute("llenaDia")) _rogCal.cambia.llenaDia(this, null, this.llenaDia);

            /** */

            _rogCal.tmpDias(this);

            this.shadowRoot.querySelector(".calMes").obj = this;
            this.frm = this.shadowRoot.querySelector("dialog");
            _rogCal.preparaFrm(this);

            this.dispatchEvent(new Event("despuesDeMostrar"))
            this[MOSTRANDO] = false;
        }
    }

    static get observedAttributes() {
        return ["desde", "llenaDia", "foto"];
    }

    attributeChangedCallback(att, viejo, nuevo) {
        if (_rogCal.cambia[att]) _rogCal.cambia[att](this, viejo, nuevo);
        this.render();
    }
}
    
    customElements.define("rog-calendario", rogCalendario);

    function tmpROGCalendario(obj) {
        return `${tmpROGCSSCal(obj)}
            <div class="calMes" onclick="_rogCal.chxDia(event)">
                ${tmpROGCalTit(obj.lapso)}
                <section class="calDias" onmouseover = "_rogCal.chxTit(event)">
                ${rogFmt.Fecha().lstDias().map(x => `<div class="nbDia">${x}</div>`).join("")}
            </section></div>`;
    }

    function tmpROGCalTit(lapso) {
        return `<header> 
            <dialog>
                <form>
                    <label for="desde">Desde</label>
                    <input type="date" name="desde">
                    <label for="hasta">Hasta</label>
                    <input type="date" name="hasta">
                    <nav class="botonera">
                        <input type="submit" class="rogBtn" value="✔">
                        <button class="rogBtn" cancela>✘</button>
                    </nav>
                </form>
            </dialog>

            <h3 class="calNbMes">
            <span class="calBtn calMesAnt" onclick="_rogCal.mesAnt(event)">◀</span>
            <span onclick="_rogCal.mstFrmLapso(event)">${lapso.toString()}</span>
            <span class="calBtn calMesSig" onclick="_rogCal.mesSig(event)">▶</span>
            </h3>
            <div class="calTitSem">
            </div></header>`
    }

    function tmpROGCSSCal(obj) {
        return `<style>
            .calMes {
                background-color: var(--clrFndObj);
                color: var(--clrTxtObj);
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                padding: 1.25em;
                ${obj.foto ? `background-image: url("${obj.foto}")` : ""};
                background-size: cover;
            }

            .calNbMes { /* Nombre del mes e indicadores de Próximo y Siguiente mes */
                text-align: center;
            }
        
            .chxTit {
                text-decoration: underline;
            }
        
            .calMesAnt { /* Indicador de Mes Anterior */
                font-size: .6em
            }
            .calMesAnt:hover {
                cursor: w-resize;
            }
            .calMesSig { /* Indicador de Mes Siguiente */
                font-size: .6em
            }
            .calMesSig:hover {
                cursor: e-resize;
            }
        
            .calDias {
                display: grid;
                grid-template-columns: repeat(7,1fr);
                gap: .25em;
            }

            dialog {
                background-color: var(--clrFndObj);
                color: var(--clrTxtObj);
                border-radius: 15px;
                outline: double 2px currentcolor;
            }
            .botonera {
                display: flex;
                justify-content: space-around;
                margin-top: .75em;
            }
        </style>`;
    }

    function tmprogCSSCalDia(obj) {
        return `<style>        
                .celDia {
                    flex-basis: 100%;
                    min-height: 3em;
                } 

                .calDia { /* Celda que muestra cada día */
                    position: relative;
            
                    border-radius: 5px;
                    background-color: var(--clrFndLI);
                    color: var(--clrTxtLI);
                    border: var(--sombra);
                }

                .calDia time {
                    position: absolute;
                    font-size: var(--szNroDia, 1.7em);
                    font-weight: var(--wgtNroDia, 300);
                }
            
                .calDia.hoy {
                    background-color: var(--clrTxtEnh);
                }
            
                .calDia::before {
                    position: absolute;
                    content: attr(data-txt);
            
                    bottom: var(--btmDiaTxt, 5px);
                    right:  var(--rgtDiaTxt, 5px);
                    
                    font-size: var(--szDiaTxt, .6rem);
                    text-align: right;
                }
            
                .calDia:hover {
                    background-color: var(--clrFndChx);
                    color: var(--clrTxtChx);
                }
            
                .noLaboral { /* Feriados y Fines de Semana */
                    background-color: var(--clrFndNoLab, white);
                    color: var(--clrTxtNoLab, red);
                    border: 2px solid currentColor;
                }
            </style>`
    }