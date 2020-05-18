"use strict";
// Librería para manejo de fechas
    const hoy = () => new Date();
    var VSs = SanViernes(); // Tabla de Efemérides móviles

function rogFecha(ano, mes, dia) {
    // Objeto Fecha, mejorado
    // Se puede crear a partir de otro objeto fecha
    // o pasar los números de día, mes y año o año y mes
    // o una cadena de caracteres con la fecha aaaa/mm/dd o aaa-mm (Atención al guión)
    var fecha = {}
    var laFecha = this
    
    this.fmt = (fmt) => fFmt(fmt, fecha)
    this.ano = () => fecha.getFullYear()
    this.mes = () => parseInt(fecha.getMonth()) +1
    this.dia = () => fecha.getDate()
//    this.getFullYear = () => fecha.getFullYear()
    this.getMonth = () => fecha.getMonth()
    this.getDate = () => fecha.getDate()
    this.getDay = () => fecha.getDay()
    this.fecha = () => fecha
    this.futuro = () => (fecha > hoy())
    this.esUltimo = () => fSuma(1,fecha).getMonth() !== fecha.getMonth()
    this.getDiaSemana = getDiaSemana
    this.getNbMes = nbMes
    this.igual = (...otraF) => igual(fecha,...otraF);
    this.esHoy = () => igual(fecha,hoy())
    this.ayer = ayer
    this.esAyer = () => igual(fecha,ayer())
    this.manana = () => laFecha.suma(1, hoy())
    this.esManana = () => igual(laFecha.manana())
    this.suma =  (n) => fSuma(n,fecha)
    this.resta = (n) => fResta(n,fecha)

    this.clase = (f) => {
        var retorno = "";
        
        if (laFecha.esHoy()) { retorno = " Hoy futuro"}
        else {
            if (laFecha.esManana()) { retorno = " Manana futuro"}
            else {
                if (laFecha.futuro()) { retorno = " futuro"}
            }
        }
        if(!laFecha.esLaboral()) { retorno += " noLaboral"}
        return retorno;
    }

    this.toString = () => fFmt("", fecha)

    //            ESTOS MÉTODOS MODIFICAN EL VALOR DEL OBJETO
    this.siguiente = () => {
        fecha = fSuma(1, fecha);
        return fecha;
    },
    this.anterior = () => {
        fecha = fResta(1, fecha)
        return fecha
    }


    fecha = creaFecha(ano, mes, dia);
}

    function fFmt(tipo,f) {
        // Formateo de fechas
        var retorno = "";

        function fmtHora(h, m) {
            var hora = "", retorno = "", mitad = "";
		
            if (h > 12) {
                hora = h -12;
                mitad = " pm";
            }
            else {
                hora = h;
                mitad = " am";
            }
            return hora+":"+fmt2(m)+mitad;
        }

        function fmt2(x) { return (x > 9 ? "" : "0") + x }
        
        switch (tipo) {
            case "rev":
                retorno =  f.getFullYear()+"/"+ fmt2((f.getMonth() +1)) +"/"+ fmt2(f.getDate());
                break;
            case "cool":
                retorno = getDiaSemana(true,f) + " " + f.getDate() +" de "+ nbMes(null,f);
                break;
            case "Evento":
                retorno = getDiaSemana(true,f) +" "+f.getDate()+" "+fmtHora(f.getHours(),f.getMinutes());
                break;
            case "serio":
                retorno = getDiaSemana(null,f) + " " + f.getDate() +" de "+ nbMes(null,f) +" de "+ f.getFullYear();
                break;                
            case "nbMes":
                retorno = nbMes(null,f) +" de "+f.getFullYear();
                break;
            case "dd":
                retorno = fmt2(f.getDate())
                break;
            default:
                retorno = fmt2(f.getDate()) +"/"+ fmt2((f.getMonth() +1)) +"/"+ f.getFullYear();
        }
        return retorno;
    }
    function ultimo(ano, mes) {
        // Último día del mes
        var retorno = 32, prueba = {};
        
        do { prueba = new Date(ano, mes, --retorno) } while (prueba.getMonth() === mes);
        
        return retorno;
    }
    function ayer () { return fResta(1, hoy()) }
    function creaFecha(ano, mes, dia) {
        // Devuelve un objeto fecha a partir de los parámetros enviados
        // si no se envía nada, devuelve la fecha de hoy
        var fecha;
        
        if (mes === undefined) {
            if (ano === undefined) { fecha = hoy() }
            else {
                if (typeof(ano) === "object") { fecha = ano }
                else {fecha = new Date(ano) }
            }
        }
        else {
            if (ano === undefined) {fecha = new Date(ano,mes)} // (Año, mes)
            else { fecha = new Date(ano, mes, dia || 1) }
        }
        return fecha;
    }
    function getDiaSemana(corto,f) {
        var retorno = "";
        f = f || fecha;
        retorno = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"][f.getDay()];
        return corto ? retorno.slice(0,3) : retorno;
    }
    function nbMes(corto,f) {
        // @param corto indica si se devuelve el nombre completo o en tres letras solamente
        // @param f puede ser una fecha o un número relativo al mes de "fecha", por defecto, es "fecha"
        var retorno;
        if (f) {
            if (typeof f === "number") { f = new Date(fecha.getFullYear(), fecha.getMonth() +f, fecha.getDate())}
        }
        else {f = this.fecha()}
        retorno = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][f.getMonth()];
        return corto ? retorno.slice(0,3) : retorno;
    }
    function esFechaLaboral(f) {
        // Booleana: Determina si una fecha es Laboral o no
        function sacaAno(wf) {
          if (typeof wf === "string") {
            switch(wf.length) {
              case 2: return "20"+wf
              case 4: return wf
              default:
                return wf.slice(0,4)
            }
          } else return wf.getFullYear()
        }
      
        function esFiestaMovil(f) {
            // Revisa si la fecha cae en Carnaval o Semana Santa
            var wf = fFmt("rev",f);
            
            function vsDelAno(wf) {
                // Compara la fecha con la Tabla de Efemérides
                let ano = sacaAno(wf)
                return creaFecha(ano +VSs[ano]);
            }
        
            var VS = vsDelAno(wf);
            if (f.getFullYear() != VS.getFullYear()) { return false }  // Si la fecha es posterior al Viernes Santo de ese año
            
            var fechas = [-46, -45, -1, 0], xfecha = 0;  // Lun y Mar de Carnaval, Jue y Vie Santos con relación al Viernes Santo
            var busca = true;
            while (busca) {
                if (wf === fFmt("rev",fSuma(fechas[xfecha], VS))) { busca = false }
                else {
                    xfecha++;
                    busca = (xfecha < fechas.length);
                }
            }
            return xfecha < fechas.length;
        }
        
        f = f || this.fecha();
        var dia = f.getDay();
        var retorno = ((dia === 0) || (dia === 6)); // Fin de Semana
        if (!retorno) { // fiestas fijas en Vzla:
            retorno = ([ '1/0', '1/1', '19/3', '1/4', '24/5', '5/6', '24/6', '12/9', '24/11', '25/11', '31/11' ].indexOf(f.getDate() +"/" +f.getMonth()) >= 0);
         
            if (!retorno) { retorno = esFiestaMovil(f) }
        }
        return !retorno;
    }
    function fSuma(nDias = 1, f) {
        // Devuelve una fecha a partir de la actual más  @param nDias
        return new Date(f.getFullYear(),f.getMonth(),f.getDate() +nDias);
    }
    function fResta(nDias =1, f) { return fSuma(-nDias,f) }
    function igual(f,...otraF) {
        return fFmt("",f) === fFmt("",creaFecha(...otraF))
    }
    function lapsoLaboral(hasta, traza) {
        // Devuelve una fecha o un entero según:
        // Si "hasta" es una fecha: devuelve el número de días hábiles desde la fecha actual hasta "hasta"
        // Si "hasta" es un número: devuelve la fecha hábil "hasta" días hábiles después de la fecha actual
        // Si traza es verdadero, deja en la cónsola las fechas evaluadas
        var retorno;
        
        if (typeof(hasta) === "number") {
            let cuenta = 0;
            retorno = fecha;
            while (cuenta < hasta) {
                if (esFechaLaboral(retorno)) {
                    ++cuenta;
                    if(traza){ console.log(cuenta +". "+retorno)}
                }
                retorno = suma(1,retorno);
            }
            while (!esFechaLaboral(retorno)) { retorno = suma(1,retorno) }
        }
        else {
            let desde = fecha;
            let otraFecha = new Date(hasta);
            if (fecha > otraFecha) {
                desde = otraFecha;
                otraFecha = fecha;
            }
            retorno = 0;
            do {
                desde = suma(1,desde);
                if (esFechaLaboral(desde)) {
                    ++retorno;
                    if(traza) { console.log(retorno +". " +desde)}
                }
            } while (desde <= otraFecha);
        }
        return retorno;
    }

    rogFecha.prototype.getFullYear = () => fecha.getFullYear()
    rogFecha.prototype.esLaboral = esFechaLaboral,
    rogFecha.prototype.igual = (ano,mes,dia) => 
    rogFecha.prototype.lapsoLaboral = lapsoLaboral
    
    rogFecha.prototype.Calendario = function(ref, acciones, llenaDia) {
      var Calendario = new rogCalendario(this.fecha(), ref, acciones, llenaDia);
    }

function SanViernes() {
    // Viernes Santos desde el año 2000 hasta el 2050
    return {
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
    }
}

/*
    L A P S O S

    Manejo de Lapsos temporales:
    Puede ser un mes
    o el período definido por dos fechas

    Calendario va a "pintar" el lapso en el dom especificado

    defMes define el Mes correspondiente a una fecha dada

    Revisar creafecha para ver si se puede definir con Mes (mm o aa/mm)
*/

function defMes(fecha) {

}

function creaLapso(desde,hasta) {
    let retorno = [];
    let xFecha = new Date(desde);

    while (xFecha.getMonth() <= hasta) {
        retorno.push(xFecha)
        xFecha.siguiente();
    }

    return retorno;
}

function rogLapso(desde,hasta) {
    this.desde = creaFecha(desde);
    this.hasta = hasta ? creaFecha(hasta) : ultimo(desde);
    this.dias = creaLapso();

    this.mes = (mes) => {}
}

rogLapso.prototype.Calendario = function(ref, acciones, llenaDia) {
    var Calendario = new rogCalendario(this.fecha(), ref, acciones, llenaDia);
}

// CALENDARIO
function rogCalendario (mes = new Date(), ref = document.querySelector(".calMes"), acciones, llenaDia) {
    function mesSig() {
        mes = new Date(mes.getFullYear(), mes.getMonth() +1, mes.getDate());
        pinta();
    }
    function mesAnt() {
        mes = new Date(mes.getFullYear(), mes.getMonth() -1, mes.getDate());
        pinta();
    }
    function pinta() {
        // Pinta el calendario del mes correspondiente a una fecha (@param mes)
        // en el DOM identificado por @param ref
        // y le asigna a cada "día" los eventos indicados en "acciones"
        // @param Acciones es un arreglo de objetos { accion, funcion } que se envían como parámetros de EventListener de cada día
        // @param llenaDia es la función que se usa para dar valor a cada día (Por defecto se pone el número del día y la propiedad "fecha" con la fecha del día)
        // El primer elemento se aplica al elemento previo al día 1
        // Para efectos de CSS, se preveen las siguientes clases:
        // 1. calMes    contenedor del Calendario
        // 2. calSem    Cada línea de siete días
        // 3. calDia    Cada Día del Mes
        // 4. calNoMes  Elementos al inicio y al final del Mes que corresponden a los días de ambas semanas que no pertenecen al mes
        // 5. calNbMes  espacio donde se muestra el nombre del mes
        // 6. calMesSig indicador del Mes Siguiente
        // 7. calMesAnt indicador del Mes Anterior
        // 8. noLaboral Días no laborales

        function defLlenaDia(dia, fecha) {
            // Contenido por defecto de un día del calendario (elemento DOM)
            // Se muestra el número del día y se crea la propiedad "fecha" con la fecha correspondiente
            dia.innerHTML = fecha.fmt("dd");
            dia.fecha = new Date(fecha.fmt("rev"));
        }

        function agregaSemana() {
            semana.className="calSem";
            ref.appendChild(semana);
        }

        function calNbMes() {
            var retorno = document.createElement("DIV");
            var parte = document.createElement("SPAN");

            parte.className = "calMesAnt";
            parte.onclick = mesAnt;
            parte.appendChild(document.createTextNode("<<"))
            retorno.appendChild(parte);
            retorno.className = "calNbMes";
            retorno.appendChild(document.createTextNode(xFecha.fmt("nbMes")));
            parte = document.createElement("SPAN");
            parte.className = "calMesSig";
            parte.onclick = mesSig;
            parte.appendChild(document.createTextNode(">>"))
            retorno.appendChild(parte);

            return retorno;
        }
        
        function noMes(nDias) {
            let dia = document.createElement("DIV");
            dia.style.flexGrow = nDias;
            dia.className = "calNoMes";
            if (acciones && acciones[0]) { dia.addEventListener(acciones[0].accion,acciones[0].funcion) }
            semana.appendChild(dia);
        }

        var dia = {};
        var xMes = mes.getMonth();
        var xFecha = new rogFecha(mes.getFullYear(), xMes, 1);
        var xDiaSem = xFecha.getDay();
        var semana = document.createElement("DIV");

        llenaDia = llenaDia || defLlenaDia;

        ref.innerHTML = "";

        ref.appendChild(calNbMes());

        if (xDiaSem) noMes(xDiaSem) // Primera Semana (Días del mes anterior)

        while (xFecha.getMonth() == xMes) {
            let x = {};
            dia = document.createElement("DIV");
            dia.className = "calDia" +xFecha.clase();
            if (acciones && acciones[1]) for(x of acciones[1]) {dia.addEventListener(x.accion,x.funcion)}
            llenaDia (dia,xFecha, defLlenaDia);
            semana.appendChild(dia);

            if (++xDiaSem === 7) {
                agregaSemana();
                xDiaSem = 0;
                semana = document.createElement("DIV");
            }

            xFecha.siguiente();
        }

        if (xDiaSem) { // Última Semana
            noMes(7 -xDiaSem)
            agregaSemana();
        }
    }
 
    this.mesAnt = mesAnt,
    this.mesSig = mesSig,
    this.pinta = pinta

    this.pinta();
}
