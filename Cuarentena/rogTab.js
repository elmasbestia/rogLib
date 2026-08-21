/*
	Objeto que manipula Tablas
	
	parámetros:
	@param datos	  Datos a mostrar
	@param dom		  Elemento HTML donde mostrar la tabla
	@param titulo 	Identificador de los datos
	@param campos 	Lista de Campos
	@param Fn	    	Objeto con funciones a ser asignadas 
  @param fmt      Formato alterno (En vez de una columna por campo)
	
	campos:
	La estructura del parámetro campos puede ser:
	1. Nombre del Campo
	o
	2. Objeto:
		nb		Nombre del Campo
		tipo	tipo del campo
		titulo	nombre formal del campo
		fmt		Formato del campo (Ver "formatos")
		clase	Clase (dom) del campo 
		fn		Función a ser llamada al pulsar en el campo
		grupo	Si la información se agrupa por este campo
		suma	Si se muestra la suma del campo

	tipos:
		Texto
		
	formatos
	
	Parámetro Fn
		Cada elemento es el nombre de un campo, asociado a una función
		La función se asociará al evento "click" de ese campo	
	
	declaración y dependencias:
		<script src="../rogLib/rogTab.js"></script>
		<script src="../rogLib/rogCSS.js"></script>
		<script src="../rogLib/PDO/xlsx.full.min.js"></script>

*/

class rogTab {
  constructor(datos, dom, titulo = "", campos = null, Fn = {}) {
    this.w = {
      datos: datos || []
    };

    this.dom = dom;
    this.titulo = titulo || "registros";
    this.css = new rogCSS();
    this.Fn = Fn;
    this.campos = campos;

    if (dom) this.mst();
  }

  set dom(dom) {
    this.donde = dom ? objDom(dom) : document.createElement("DIV");
  }

  get dom() {
    return this.donde;
  }

  set datos(valor) {
    this.w.datos = [... valor];
    this.mst();
  }

  get datos() {
    return this.w.datos;
  }

  set campos(lista) {
    this.cols = {};
    desarma(lista || this.datos[0]).forEach(this.creaCampo.bind(this));
  }

  get hayCampos() {
    return Object.keys(this.cols).length > 0;
  }

  get campos() {
    return this.cols;
  }

  get nbCampos() {
    return Object.keys(this.cols);
  }

  get titCampos() {
    return Array.from(Object.keys(this.cols)).map(
      (x) => this.cols[x].titulo || x
    );
  }

  creaCampo(campo) {
    let propiedades = {};
    if (typeof campo === "string") {
      propiedades = Object.assign(propiedades, fnFmt(campo));
      propiedades.fn = this.Fn && this.Fn[campo];
    } else {
      propiedades.tipo = campo.tipo;
      propiedades.titulo = campo.titulo;
      propiedades = Object.assign(
        propiedades,
        fnFmt(campo.nb, campo.tipo, campo.fmt)
      );
      propiedades.clase = campo.clase;
      propiedades.fn = (this.Fn && this.Fn[campo.nb]) || campo.fn;
    }
    this.setCampo(campo.nb || campo, propiedades);
  }

  setCampo(nb, atributos) {
    desarma(nb).forEach((y) => {
      if (!this.cols[y]) this.cols[y] = {};
      for (let x in atributos) this.cols[y][x] = atributos[x];

      if (!objVacio(this.cols[y].css))
        this.css.agrega("." + nbCol(nb), this.cols[y].css);
    });
  }

  asignaFn(fn) {
    let retorno = {};
    for (x in fn) retorno[x] = fn;
    return retorno;
  }

  agrega(datos) {
    if (Array.isArray(datos)) datos.forEach(agrega);
    else {
      this.datos.push(datos);
      this.mst();
    }
  }

  mstLinea(linea, clsLinea = "") {
    if (Array.isArray(linea)) linea.forEach((x) => this.mstLinea(x, clsLinea));
    else {
      const { _clase, _atributo } = isNaN(clsLinea)
        ? { _clase: clsLinea }
        : { _atributo: { "data-fila": clsLinea } };

      this.tabla.querySelector("tbody").innerHTML += domTxt(
        this.nbCampos.reduce((txt, nbCampo, i) => {
          let col = this.campos[nbCampo];
          if (col) {
            txt += this.creaCelda(
              linea[nbCampo],
              (nbCol(nbCampo) + " " + def(col.clase)).trim(),
              col.fmt,
              col.fn
            );
          }
          return txt;
        }, ""),
        "tr",
        _clase,
        _atributo
      );
    }
  }

  creaCelda(valor, clase, fmt, fn) {
    let _valor = def(valor);
    let _txt = _valor ? fmt(_valor) : _valor;
    let atributos = _valor === _txt ? {} : { "data-valor": _valor };

    if (fn) {
      atributos.onclick = fn + "(event)";
      atributos.cursor = "pointer";
    }
    return domTxt(_txt, "td", clase, atributos);
  }

  creaTitulos(tabla) {
    tabla.querySelector(".titTab").innerHTML = this.datos.length
      ? this.titulo + spanCant(this.datos.length) + tmpTabBtns()
      : "No hay " + this.titulo;

    this.programaMnu({
      btnXl: this.xl.bind(this),
      btnImp: this.imp.bind(this)
    });

    if (this.hayCampos)
      tabla.querySelector("thead").outerHTML = tabTitulos(this.titCampos);
  }

  programaMnu(opciones) {
    for (let opcion in opciones) {
      let btn = this.tabla.querySelector("." + opcion);
      if (btn) btn.onclick = opciones[opcion];
    }
  }

  mst() {
    this.tabla = document.createElement("TABLE");

    this.dom.innerHTML = "";
    this.tabla.innerHTML =
      "<caption><h3 class='titTab'></h3></caption><thead></thead><tbody></tbody>";

    this.tabla.addEventListener("click", chxTR);

    this.dom.appendChild(this.tabla);

    this.creaTitulos(this.tabla);

    this.datos.forEach(this.mstLinea.bind(this));

    this.tabla.obj = this;
  }

  imp() {
    // Esconde los botones
    const btns = this.dom.querySelector(".rogTabBtns");
    btns.style.display = "none";    
    
    imprime(this.tabla.outerHTML, this.titulo, this.css)
    
    btns.style.display = "unset";
  }

  xl() {
    //<script src="/lib/xlsx.full.min.js"></script>
 
    const espera = new rogVntEspera("Guardando en XL");

    let wb = XLSX.utils.table_to_book(this.tabla);

    XLSX.writeFile(wb, nbSerial(this.nb) + ".xlsx", {compression: true})

    espera.cierra();
  }
}

/**
 * Al hacer "click" sobre la tabla, reconocer la lìnea sobre la que se hizo
 * y disparar el evento correspondiente
 */
function chxTR(e) {
  const fila = rogAncetre(e.target,"TR");
  if(fila && fila.dataset.hasOwnProperty("fila")) {
    e.currentTarget.obj.dom.dispatchEvent(new CustomEvent("escogeFila",{detail: {fila, datos: e.currentTarget.obj.datos[fila.dataset.fila], que: e.target}}));
  }
}

function imprime(contenido, titulo, css) {
  var vnt = window.open("", "PRINT", "height=400,width=600");

  // C A B E C E R A
  vnt.document.write(`<html><head>
    <title>${titulo}</title>
    <style src='/lib/css/rog.css'></style>
    </head><body>`);

  // E S T I L O S
  //vnt.document.append(css);

  vnt.document.write(`<h1>${titulo}</h1>`);

  // C O N T E N I D O
  vnt.document.write(contenido);

  // P I E   D E   P Á G I N A

  vnt.document.write("</body></html>");

  vnt.document.close(); // necessary for IE >= 10
  vnt.focus(); // necessary for IE >= 10*/

  vnt.print();
  vnt.close();
}

function tabTitulos(campos) {
  return domTxt(
      domTxt(campos.map(x => domTxt(x,"th")).join(""), "tr"),
      "thead"
  );
}

function fnFmt(nb, tipo = "", fmt) {
  let _fmt = fmt || ((x) => x);
  let _css = {};
  let _nb = nb.toLowerCase();
  let alinea = "";

  if (fmt) {
    if (typeof fmt === "string") {
      if (fmt.slice(0, 2) === "f.") {
        alinea = "center";
        _fmt = (x) => rogFmt.Fecha(x)[fmt.slice(2)]();
      } else _fmt = rogFmt[fmt];
    }
  } else {
    switch (_nb) {
      case "cedula":
        alinea = "right";
        _fmt = rogFmt.Ent;
        break;
      case "monto":
      case "precio":
      case "total":
        alinea = "right";
        _fmt = rogFmt.Moneda;
        break;
      case "fecha":
        alinea = "center";
        _fmt = (x) => rogFmt.Fecha(x).dma();
        break;
      case "nro":
      case "cant":
      case "cantidad":
        alinea = "right";
        _fmt = rogFmt.Moneda;
        break;
      case "%":
      case "porc":
        alinea = "center";
        _fmt = rogFmt.Prc;
        break;
      default:
        switch (tipo) {
          case "date":
            alinea = "center";
            _fmt = (x) => rogFmt.Fecha(x).dma();
            break;
          case "number":
            alinea = "right";
            _fmt = rogFmt.Ent;
            break;
          case "monto":
          case "precio":
          case "total":
          case "moneda":
            alinea = "right";
            _fmt = rogFmt.Moneda;
            break;
          case "porc":
              alinea = "center";
              _fmt = rogFmt.Prc;
        }
    }
  }

  if (alinea) _css["text-align"] = alinea;
  return { fmt: _fmt, css: _css };
}

function nbCol(nb) {
  return "col_" + nb;
}

function tmpTabBtns() {
  return `<span class='rogTabBtns'>
    <span class='rogBtn btnXl'  title="pasar a MS Excel"><i class='far fa-file-excel'></i></span>
    <span class='rogBtn btnImp' title="imprimir"><i class='fas fa-print'></i></span>
    </span>`;
}
