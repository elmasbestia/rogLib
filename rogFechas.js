
function muestra() {
    let f = new rogFecha()
    
    const propiedades = []
    
    for(x in f) {
      if(x === "Calendario") continue
      //console.log(x)
      propiedades.push({x, valor: f[x] instanceof Function ? f[x]() : f[x]})
    }
    
    mstTabla(propiedades,"muestra")
  }
  
  // Librería para manejo de fechas
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
      this.esHoy = () => igual(fecha,hoy());
      this.esAyer = () => igual(fecha,ayer())
      this.manana = () => fSuma(1, hoy())
      this.esManana = () => igual(this.manana())
      this.suma =  (n) => fSuma(n,fecha)
      this.resta = (n) => fResta(n,fecha)
      this.esLaboral = () => esFechaLaboral(fecha),
      this.lapsoLaboral = (hasta,traza) => lapsoLaboral(fecha,hasta,traza)
      this.Calendario = (ref, acciones, llenaDia) => new rogCalendario(fecha, ref, acciones, llenaDia)
  
      this.clase = () => {
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
  
      this.toString = () => fFmt("rev", fecha)
  
      //            ESTOS MÉTODOS MODIFICAN EL VALOR DEL OBJETO
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
                  retorno =  f.getFullYear()+"-"+ fmt2((f.getMonth() +1)) +"-"+ fmt2(f.getDate());
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
          let retorno = 32, prueba = {};
          let _ano = ano
          let _mes = mes
          if (typeof ano === "object") {
              _ano = ano.getFullYear()
              _mes = ano.getMonth()
          }
          
          return new Date(_ano, _mes, 0);
      }
      function primero(fecha) {
          return new Date(fecha.getFullYear(),fecha.getMonth(),1)
      }
      function ayer () { return fResta(1, hoy()) }
      function getDiaSemana(corto = false,f) {
          var retorno = "";
          retorno = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"][f.getDay()];
          return corto ? retorno.slice(0,3) : retorno;
      }
      function nbMes(corto = false,f) {
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
          return fFmt("",f) === fFmt("",creaFecha(...otraF))
      }
  
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
          }
          else {
              do {
                  retorno = fSuma(1,retorno);
                  if (esFechaLaboral(retorno)) {
                      ++cant;
                      if(traza) { console.log(cant +". " +retorno)}
                  }
              } while (retorno <= hasta);
              return cant
          }
      }
  
      // Feriados
  
      function TF(ano = new Date()) {
          let _ano = sacaAno(ano)
  
          if(!_TF[_ano]) _TF[_ano] = creaTF(_ano)
          return _TF[_ano];
      }
  
      function vsDelAno(ano = (new Date()).getFullYear()) {
          // Compara la fecha con la Tabla de Efemérides
          return creaFecha(ano +SanViernes()[sacaAno(ano)]);
      }
  
      function creaTF(ano = new Date()) {
          let _ano = sacaAno(ano)
  
          return [...fiestasFijas(), ...Carnaval(_ano),...SemanaSanta(_ano)].sort()
      }
  
      function fiestasFijas(ano = (new Date).getFullYear()) {
          return [ '-01-01', '-04-19', '-05-01', '-06-24', '-07-05', '-07-24', '-10-12', '-12-24', '-12-25', '-12-31' ].map(x => ano+x)
      }
  
      function Carnaval(ano = (new Date).getFullYear()) {
          let VS = vsDelAno(ano);
          // Lun y Mar de Carnaval, con relación al Viernes Santo
          return [-46, -45].map(x => fFmt("rev",fSuma(x, VS)))
      }
  
      function SemanaSanta(ano = (new Date).getFullYear()) {
          let VS = vsDelAno(ano);
          // Jue y Vie Santos con relación al Viernes Santo
          return [-1, 0].map(x => fFmt("rev",fSuma(x, VS)))
      }
  
      function esFechaLaboral(f = new Date()) {
          // Booleana: Determina si una fecha existe dentro de la Tabla de Días Feriados (TF)      
          if((f.getDay() === 0) || (f.getDay() === 6)) return false // Fin de Semana
          return !TF(sacaAno(f)).includes(fFmt("rev",f))
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
  
  function rogMes(fecha) {
      return new rogLapso(fecha)
  }
  
  function creaDiasLapso(desde,hasta) {
      let retorno = [];
      let xFecha = new Date(desde);
  
      while (xFecha <= hasta) {
          retorno.push(xFecha)
          xFecha = fSuma(1,xFecha);
      }
  
      return retorno;
  }
  
  function rogLapso(desde,hasta) {
      let _x = 0, _n = 0
      
      this.desde = creaFecha(desde);
      this.hasta = hasta ? creaFecha(hasta) : ultimo(desde);
      this.dias = creaDiasLapso(this.desde, this.hasta);
      _n = this.dias.length
      
      this.esMes = ((igual(this.dias[0], primero(this.desde))) && (igual(this.hasta,ultimo(this.desde))))
      
      this.siguiente = () => {
          if(_x === _n) return null
          else return new rogFecha(this.dias[_x++])
      }
  }
  
  rogLapso.prototype.Calendario = (ref, acciones, llenaDia) => new rogCalendario(this, ref, acciones, llenaDia);
  
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
          /*
           Pinta el calendario del mes correspondiente a una fecha (@param mes)
           en el DOM identificado por @param ref
           y le asigna a cada "día" los eventos indicados en "acciones"
           @param Acciones es un arreglo de objetos { accion: funcion } que se envían como parámetros de EventListener de cada día
           @param llenaDia es la función que se usa para dar valor a cada día (Por defecto se pone el número del día y la propiedad "fecha" con la fecha del día)
           El primer elemento se aplica al elemento previo al día 1
           Para efectos de CSS, se preveen las siguientes clases:
               1. calMes    contenedor del Calendario
               2. calSem    Cada línea de siete días
               3. calDia    Cada Día del Mes
               4. calNoMes  Elementos al inicio y al final del Mes que corresponden a los días de ambas semanas que no pertenecen al mes
               5. calNbMes  espacio donde se muestra el nombre del mes
               6. calMesSig indicador del Mes Siguiente
               7. calMesAnt indicador del Mes Anterior
               8. noLaboral Días no laborales
          */
  
          function defLapso(desde,hasta) {
              /* Define el lapso a ser impreso
                  Puede ser un Mes o un lapso de fechas definido por _desde y _hasta
                  Opciones:
                  Desde
                  1. Desde está vacío:    desde la fecha actual hasta el fin del mes actual
                  2. Desde es
                      a. rogLapso:        ya está definido (Se ignora el @param hasta)
                      b. número:          _desde es el primero de ese mes para el año actual
                      b. fecha:           _desde es esa fecha
                  Hasta
                  1. Hasta está vacío:    Último del Mes definido por Desde
                  2. Hasta es:
                      a. fecha:           _hasta es esa fecha
              */
  
              if(desde instanceof rogLapso) return desde
  
              return new rogLapso(desde,hasta);
          }
  
          function defLlenaDia(dia, fecha) {
              // Contenido por defecto de un día del calendario (elemento DOM)
              // Se muestra el número del día y se crea la propiedad "fecha" con la fecha correspondiente
              dia.innerHTML = fecha.fmt("dd");
          }
  
          function agregaSemana() {
              semana.className="calSem";
              ref.appendChild(semana);
          }
  
          function calNbMes() {
              var retorno = document.createElement("SECTION");
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
  
          function calNbLapso(desde,hasta) {
              var retorno = document.createElement("SECTION");
              let _txt = "Desde " + desde.toString() + " hasta " + hasta.toString()
  
              retorno.className = "calNbMes";
              retorno.appendChild(document.createTextNode(_txt));
  
              return retorno;
          }
          
          function noMes(nDias) {
              let dia = document.createElement("DIV");
              dia.style.flexGrow = nDias;
              dia.className = "calNoMes";
              if (acciones && acciones[0]) { dia.addEventListener(acciones[0].accion,acciones[0].funcion) }
              semana.appendChild(dia);
          }
  
          var _lapso = defLapso(mes)
          var dia = {};
          var xFecha = _lapso.siguiente();
          var xDiaSem = xFecha.getDay();
          var semana = document.createElement("DIV");
  
          llenaDia = llenaDia || defLlenaDia;
  
          ref.innerHTML = "";
  
          ref.appendChild(calNbMes());
  
          if (xDiaSem) noMes(xDiaSem) // Primera Semana (Días del mes anterior)
  
          while (xFecha) {
              let x = {};
              dia = document.createElement("DIV");
              dia.className = "calDia" +xFecha.clase();
              dia.fecha = xFecha.fmt("rev");
            
              if (acciones && acciones[1]) for(x in acciones[1])    dia.addEventListener(x,acciones[1][x])
              llenaDia (dia,xFecha, defLlenaDia);
              semana.appendChild(dia);
  
              if (++xDiaSem === 7) {
                  agregaSemana();
                  xDiaSem = 0;
                  semana = document.createElement("DIV");
              }
  
              xFecha = _lapso.siguiente()
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
  