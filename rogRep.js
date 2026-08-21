
function creaTabRep(donde,reporte,datos) {
    Espera("Creando el Reporte")

    let lineas = []; // buffer temporal para las líneas
    let _regActual = {};
            
    let _grupos  = desarma(reporte.grupo);
    let _totales = desarma(reporte.totaliza);

    // Control de grupos:
    let ctlGrupos = {};
    const _xgt = "rogTotal";
    ctlGrupos[_xgt] = { nivel: -1, nb: "Total", valor: "Total", toti: { cant: 0 } };
    let _xDetalle = ctlGrupos[_xgt];
    _grupos.forEach((x,i) => { 
        ctlGrupos[x] = {  nivel: i, nb: x, valor: undefined, toti: { cant: 0 }, super: _xDetalle};
        _xDetalle = ctlGrupos[x];
    });

    // Crear Totales
    _totales.forEach(campo => { desarma(ctlGrupos).forEach(nb => ctlGrupos[nb].toti[campo] = 0); });

    const _campos  = desarma(reporte.campos || datos[0]).reduce((campos, campo) => {
        if(!ctlGrupos[campo]) campos.push(campo);
        return campos
    }, []);

    let nbId  = reporte.nbId;
    let fnId = _campos.indexOf(nbId);

    const toto = (grupo) => _campos.reduce((totales,campo) => {
          totales.push(_totales.includes(campo) ? grupo.toti[campo] : "")
          return totales;              
    },[]);

    const hGrupo = grupo => {
          let totaux = toto(grupo);
          totaux[0] = (grupo.valor || "(indefinido)")+ spanCant( grupo.toti.cant);
          return domLinea(totaux,"trGrupo");           
    }

    const tGrupo = grupo => {
      let _grupo = _xDetalle;
      do {
        if(_grupo.toti.cant) {
          if(_grupo.nivel === -1) lineas.push(hGrupo(_grupo));
          else {
            lineas[_grupo.indice] = hGrupo(_grupo);
            desarma(_grupo.toti).forEach(campo => {
              _grupo.super.toti[campo] += _grupo.toti[campo];
              _grupo.toti[campo] = 0;
            })
          }
        }
        _grupo = _grupo.super;
      } while (_grupo && (_grupo.nivel >= grupo.nivel));
    };

    const nivelDeRuptura = () => {
      let retorno = -1;
      let xNivel = 0;
      let _grupo = ctlGrupos[_grupos[xNivel]];
      do {
        if(_grupo.valor != _regActual[_grupo.nb]) retorno = _grupo.nivel;

        _grupo = ctlGrupos[_grupos[++xNivel]];
      } while (retorno < 0 && _grupo);

      return retorno;
    }

    const ruptura = () => {
      if(!_grupos.length) return;

      let xNivel = nivelDeRuptura();

      if(xNivel >= 0) {
          for(let _grupo = ctlGrupos[_grupos[xNivel]]; 
                xNivel < _grupos.length; 
                _grupo = ctlGrupos[_grupos[++xNivel]]) {
            tGrupo(_grupo);
            _grupo.valor      = _regActual[_grupo.nb];
            _grupo.toti.cant  = 0;
            _grupo.indice     = lineas.push(_grupo.nb) -1;
          }
      }
    };

    // Crea líneas del reporte
    datos.forEach( x => {
        _regActual = x;
        ruptura();
        lineas.push(domLinea(_campos.map(x => _regActual[x]),null,fnId));
        _totales.forEach(campo => _xDetalle.toti[campo] += Number(_regActual[campo]));
        _xDetalle.toti.cant++;
    });

    // Crea Totales
    tGrupo(ctlGrupos[_xgt]);

  // Muestra el reporte
    let titulos = tabTitulos(_campos);

    let tabla = "<table><caption><h3>" +reporte.titulo+ spanCant(datos.length)+"</h3></caption>"+titulos+"<tbody>";
    while (lineas.length) tabla += lineas.shift();
    donde.innerHTML = tabla +"</tbody></table>";

    rogAsigna(".trGrupo","onclick",mstGrupo);

    if(fnId > -1) rogAsigna(".rogId","onclick",chxRogId(reporte.llama,nbId))

    Espera();
}

                        // Manejo del reporte mostrado
function mstDetalle(x) {
     x.style.display = x.style.display === "none" ? "" : "none";
}

function mstTodos() {
    Espera("Detalle")

    Array.from(document.querySelectorAll("tr")).slice(1).forEach(x => {
        if(esDetalle(x)) mstDetalle(x);
    });
    Espera();
}

function esDetalle(fila) {
  return !(fila.classList.contains("trGrupo") || fila.classList.contains("tabTit"));
}

function btnDetalleClick() {
  detallaReporte.click();
}

function mstGrupo() {
  let siguiente = this.nextElementSibling;
  while (siguiente && esDetalle(siguiente)){
    mstDetalle(siguiente);
    siguiente = siguiente.nextElementSibling;
  };
}

function chxRogId(reporte,rogId) {
    return (e) => chxReporte(reporte,rogId+"="+rogPrm(e));
}