/**
* Librería para manejo de fechas
* 
*/  

    const hoy = () => new Date();
    var _TF = {};            // Tabla de días feriados
  
function rogFecha(ano, mes, dia) {
    // Objeto Fecha, mejorado
    // Se puede crear a partir de otro objeto fecha
    // o pasar los números de día, mes y año o año y mes
    // o una cadena de caracteres con la fecha aaaa/mm/dd o aaa-mm (Atención al guión)
    var fecha = creaFecha(ano, mes, dia);
    var laFecha = this
    
    this.fmt = (fmt) => fFmt(fmt, fecha)
    this.ano = () =>    fecha.getFullYear()
    this.mes = () =>    parseInt(fecha.getMonth()) +1
    this.dia = () =>       fecha.getDate()
    this.getFullYear = () => fecha.getFullYear()
    this.getMonth = () =>fecha.getMonth()
    this.getDate = () =>fecha.getDate()
    this.getDay = () => fecha.getDay()
    this.fecha =        fecha
    this.futuro = () => (fecha > hoy())
    this.esUltimo = () => fSuma(1,fecha).getMonth() !== fecha.getMonth()
    this.getDiaSemana = (corto) => getDiaSemana(corto,fecha)
    this.getNbMes = (corto) => nbMes(corto,fecha)
    this.igual = (...otraF) => igual(fecha,...otraF);
    this.eshoy = () => igual(fecha,hoy());
    this.esAyer = () => igual(fecha,ayer())
    this.manana = () => fSuma(1, hoy())
    this.esManana = () => igual(this.manana())
    this.suma =  (n) => fSuma(n,fecha)
    this.resta = (n) => fResta(n,fecha)
    this.esLaboral = () => esFechaLaboral(fecha),
    this.lapsoLaboral = (hasta,traza) => lapsoLaboral(fecha,hasta,traza)
    this.Calendario = (dom, acciones, llenaDia) => new rogCalendario(fecha, dom, acciones, llenaDia)
    this.nro = () => nro(fecha)

    this.clase = () => {
        var retorno = "";
        
        if (laFecha.eshoy()) { retorno = " hoy futuro"}
        else {
            if (laFecha.esManana()) { retorno = " Manana futuro"}
            else {
                if (laFecha.futuro()) { retorno = " futuro"}
            }
        }
        if(!laFecha.esLaboral()) { retorno += " noLaboral"}
        return retorno;
    }

    this.toString = () => fFmt("amd", fecha)

    //  ESTOS MÉTODOS MODIFICAN EL VALOR DEL OBJETO
    this.siguiente = () => {
        fecha = fSuma(1, fecha);
        return fecha;
    },
    this.anterior = () => {
        fecha = fResta(1, fecha)
        return fecha
    }
}

    function fFmt(tipo,f) {
        return rogFmtFecha(f)[tipo || "dma"]();
    }

    function ultimo(ano, mes) {
        let _ano = ano
        let _mes = mes
        if (typeof ano === "object") {
            _ano = ano.getFullYear()
            _mes = ano.getMonth()
        }
          
        return new Date(_ano, _mes +1, 0);
    }

    function primero(fecha) {
        return new Date(fecha.getFullYear(),fecha.getMonth(),1)
    }

    function nro(f) {
        // Nro. del día f en el año
        const mss = 24*3600*1000 // milisegundos en un día
        let primero = new Date(f.getFullYear(),0,1)
        return Math.floor((f -primero) / mss)
    }
    
    function ayer () { return fResta(1, hoy()) }
    
    function getDiaSemana(corto = false,f) {
        return rogFmtFecha(f)[corto ? "ddd" : "dddd"]
    }

    /**
     * 
     * @param {boolean} corto indica si se devuelve el nombre completo o abreviado
     * @param {date | number} f puede ser una fecha o un número relativo al mes de "fecha", por defecto, es "fecha"
     */
    function nbMes(corto = false,f) {
        var retorno;
        if (f && (typeof f === "number")) f = new Date(fecha.getFullYear(), fecha.getMonth() +f, fecha.getDate());
        return rogFmtFecha(f).mmmm(corto);
    }

    function sacaAno(wf) {
        switch(typeof wf) {
            case "string":
                switch(wf.length) {
                    case 2: return "20"+wf
                    case 4: return wf
                    default:
                        return wf.slice(0,4)
                }
                break
            case "object":
                return wf.getFullYear()
                break
            default:
                return wf
        }
    }
  
    function fSuma(nDias = 1, f) {
        // Devuelve una fecha a partir de la actual más  @param nDias
        return new Date(f.getFullYear(),f.getMonth(),f.getDate() +nDias);
    }

    function fResta(nDias =1, f) { return fSuma(-nDias,f) }
    function igual(f,...otraF) {
        return fFmt(null,f) === fFmt(null,creaFecha(...otraF))
    }

    /**
     * Calcula  el nro de días laborales entre dos fechas o
     *         la primera fecha laboral después de una fecha según @param hasta
     * @param {date} desde Fecha de inicio del lapso
     * @param {date | number} hasta fecha de fin del lapso o número de días laborales
     * @param {boolean} traza Para fines de auditoría, muestra los valoresque se van calculando
     * @returns fecha de fin del lapso o número de días
     */
    function lapsoLaboral(desde,hasta, traza) {
        // Devuelve una fecha o un entero según:
        // Si "hasta" es una fecha: devuelve el número de días hábiles desde la fecha actual hasta "hasta"
        // Si "hasta" es un número: devuelve la fecha hábil "hasta" días hábiles después de la fecha actual
        // Si traza es verdadero, deja en la cónsola las fechas evaluadas
        let cant = 0;
        let retorno = new Date(desde.getTime());
        
        if (typeof(hasta) === "number") {
            while (cant < hasta) {
                if (esFechaLaboral(retorno)) {
                    ++cant;
                    if(traza){ console.log(cant +". "+retorno)}
                }
                retorno = fSuma(1,retorno);
            }
            while (!esFechaLaboral(retorno)) { retorno = fSuma(1,retorno) }
            return retorno;
        } else {
            do {
                retorno = fSuma(1,retorno);
                if (esFechaLaboral(retorno)) {
                    ++cant;
                    if(traza) console.log(cant +". " +retorno);
                }
            } while (retorno <= hasta);
            return cant
        }
    }

    // Feriados

    /**
     * Tabla de días Feriados del Año
     * @param {number | date} ano 
     * @returns {array} de Fechas "aaaa-mm-dd"
     */
    function TF(ano = new Date()) {
        let _ano = sacaAno(ano)

        if(!_TF[_ano]) _TF[_ano] = [...fiestasFijas(), ...Carnaval(_ano),...SemanaSanta(_ano)].sort()
        return _TF[_ano];
    }

    /**
     * Fecha del Viernes Santo para un año
     * @param {number | date} ano 
     * @returns Fecha
     */
    function vsDelAno(ano = (new Date()).getFullYear()) {
        // Compara la fecha con la Tabla de Efemérides
		const _viernes = SanViernes(sacaAno(ano))
        return _viernes ? creaFecha(ano +_viernes) : _viernes;
    }

    /**
     * Lista de fechas de los Feriados Fijos para un año en particular
     * @param {number | date} ano 
     * @returns {array} de Fechas "aaaa-mm-dd"
     */
    function fiestasFijas(ano = (new Date).getFullYear()) {
        return [ '-01-01', '-04-19', '-05-01', '-06-24', '-07-05', '-07-24', '-10-12', '-12-24', '-12-25', '-12-31' ].map(x => ano+x)
    }

    /**
     * Fechas del Carnaval para un año en particular
     * Se calculan en relación al Viernes Santo
     * @param {number | date} ano 
     * @returns {array} de Fechas "aaaa-mm-dd" de Lunes y Martes de Carnaval
     */
    function Carnaval(ano = (new Date).getFullYear()) {
        let VS = vsDelAno(ano);
        return VS ? [-46, -45].map(x => fFmt("amd",fSuma(x, VS))) : [];
    }

    /**
     * Fechas de la Semana Santa para un año
     * Se calculan según el registro en @function SanViernes
     * @param {number | date} ano 
     * @returns {array} de Fechas "aaaa-mm-dd" de Jueves y Viernes Santos
     */
    function SemanaSanta(ano = (new Date).getFullYear()) {
        let VS = vsDelAno(ano);
        // Jue y Vie Santos con relación al Viernes Santo
        return VS ? [fSuma(-1, VS), VS].map(x => fFmt("amd",x)) : [];
    }

    /**
     * Determina si una fecha existe dentro de la Tabla de Días Feriados (TF)
     * @param {date} f 
     * @returns {boolean}
     */
    function esFechaLaboral(f = new Date()) {
        if((f.getDay() === 0) || (f.getDay() === 6)) return false // Fin de Semana
        return !TF(sacaAno(f)).includes(fFmt("amd",f))
    }

    /**
    * Efemérides de los Viernes Santos desde el año 2000 hasta el 2050
    * @returns {Object} año: "/mm/dd"
    */
    function SanViernes(ano) {
		if((ano > 1999)&&(ano < 2051)) return {
            2000: "/04/21",
            2001: "/04/13",
            2002: "/03/29",
            2003: "/04/18",
            2004: "/04/09",
            2005: "/03/25",
            2006: "/04/14",
            2007: "/04/06",
            2008: "/03/21",
            2009: "/04/10",
            2010: "/04/02",
            2011: "/04/22",
            2012: "/04/06",
            2013: "/03/29",
            2014: "/04/18",
            2015: "/04/03",
            2016: "/03/25",
            2017: "/04/14",
            2018: "/03/30",
            2019: "/04/19",
            2020: "/04/10",
            2021: "/04/02",
            2022: "/04/15",
            2023: "/04/07",
            2024: "/03/29",
            2025: "/04/18",
            2026: "/04/03",
            2027: "/03/26",
            2028: "/04/14",
            2029: "/03/30",
            2030: "/04/19",
            2031: "/04/11",
            2032: "/03/26",
            2033: "/04/15",
            2034: "/04/07",
            2035: "/03/23",
            2036: "/04/11",
            2037: "/04/03",
            2038: "/04/23",
            2039: "/04/08",
            2040: "/03/30",
            2041: "/04/19",
            2042: "/04/04",
            2043: "/03/27",
            2044: "/04/15",
            2045: "/04/07",
            2046: "/03/23",
            2047: "/04/12",
            2048: "/04/03",
            2049: "/04/16",
            2050: "/04/08"
        } [ano];
    }
