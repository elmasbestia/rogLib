// Manejador de Reportes

function mstMenu(stru,dom) {
    let _dom = objDom(dom) || this;
    let menu;

    function enlaza(fuente,opc) {
        if(fuente.clase) opc.classList.add(fuente.clase);
        if(fuente.reporte) {
            opc.classList.add("rogReporte");
            opc.reporte = fuente.reporte;
        } else if(fuente.modulo) {
            opc.classList.add("rogModulo");
            opc.modulo = modulos[fuente.modulo];
        } else if(fuente.reporte) {
            opc.classList.add("rogTabla");
            opc.tabla = fuente.tabla;     
        }
        opc.onclick = chxOpc;
    }

    if(_dom.classList.contains("rogMenuVrt")) menu = _dom;
    else {
        menu = document.createElement("UL");
        menu.className = "rogMenuVrt";
        _dom.parentNode.insertBefore(menu,_dom.nextSibling);
    }

    Object.keys(stru).forEach( nbOpc => {
      // 1er Nivel
      let opc = document.createElement("LI");
      opc.innerHTML = nbOpc;
      opc.className = "rogOpcVrt";

      enlaza(stru[nbOpc],opc);

      menu.appendChild(opc);

      if (stru[nbOpc] instanceof Array) {
          // 2do Nivel (Contenedor)
          let lista = document.createElement("div");
          lista.className = "rogSubVrt";
          menu.appendChild(lista)

          // 3er. Nivel (Opciones)
          stru[nbOpc].forEach(sub => {
            let _sub = document.createElement("LI");
            _sub.innerHTML = sub.nb || sub.texto;
            _sub.className = "rogOpcSubVrt"
            enlaza(sub,_sub)

            lista.appendChild(_sub);
          });
      }
    });
}

function iniMenuRepos() {
    let _mnu = document.querySelectorAll(".rogMenuRepos");
    _mnu.forEach(_dom => {
        if(reportes) mstMenu(reportes,_dom);
        else accede("GET","/lstReportes",armaRepos(_dom));
    });
}

// Debe desaparecer si se hace iniMenuRepos asíncrona
function armaRepos(dom) {
    // Callback para leer los reportes
    return (datos) => {
        reportes = datos;
        mstMenu(datos,dom);
    };
}

function chxOpc(e) {
    let opcion = e.target;
    rogActiva(opcion);
    e.stopPropagation();
    if(opcion.classList.contains("rogModulo")) opcion.modulo();
    else if(opcion.classList.contains("rogReporte")) chxReporte(opcion.reporte);
        else if(opcion.classList.contains("rogTabla")) leeBsq("tabla",opcion.textContent);
}

function chxTabla(nbTabla) {
    leeBsq("tabla",rogPrm(nbTabla));
}

/*
.nav
	label for="toggle">/#9776;
	input type="checkbox" id="toggle"
	.menu

.nav 
	border-bottom: 1px solid #EAEAE8;
	
	text-align: right
	height:  70px;
	line-height: 70px;
	
.menu
	margin: 030px 0 0;
	
.menu a
	clear: right
	text-decoration: none
	color: gray
	margin: 0 10px
	line-height: 70px
	
span
	color: 54D17A
	
label
	margin: 0 40px 0 0
	font-size: 26px;
	line-height: 70px;
	display: none;
	width: 26px
	float: right
	
#toggle
	display: none;

@media only screen and (max-width: 500px)
	label {
		display: block
		cursor: pointer
	}
	menu {
		text-align: center
		width: 100%
		display: none
	}
	
	menu a
		display: block
		border-bottom: 1px solid #EAEAE8;
		margin: 0
	
	#toggle:checked .menu {
		display: block;
	}
*/