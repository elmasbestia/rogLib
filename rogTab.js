/*
	Objeto que manipula Tablas
	
	parámetros:
	@param datos	Datos a mostrar
	@param dom		Elemento HTML donde mostrar la tabla
	@param titulo 	Identificador de los datos
	@param campos 	Lista de Campos
	@param Fn		Objeto con funciones a ser asignadas 
	
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
		<script src="../rogLib/PDO/FileSaver.min.js"></script>

*/

// import rogCSS  from "./rogCSS";

class rogTab {
  constructor(datos, dom, titulo = "", campos = null, Fn = {}) {
    this.w = {};
    this.dom = dom;
    this.titulo = titulo;
    this.css = new rogCSS();
    this.Fn = Fn;
    this.datos = datos;
    this.campos = campos;

    if (dom) this.mst();
  }

    set datos(valores) {
        this.w.datos =  valores || []
    }
    
    get datos() {
        return this.w.datos;
    }
    
    fila(x) {
        const xFila = isNaN(x) ?
            e.currentTarget.parentNode.dataset.fila :
            x;
        return this.datos[xFila];
    }
    
  set dom(dom) {
    this.donde = dom ? objDom(dom) : document.createElement("DIV");
  }

  get dom() {
    return this.donde;
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
      propiedades.atributos = {};
    } else {
      propiedades.tipo = campo.tipo;
      propiedades.titulo = campo.titulo;
      propiedades = Object.assign(
        propiedades,
        fnFmt(campo.nb, campo.tipo, campo.fmt)
      );
      propiedades.clase = campo.clase;
      propiedades.fn = campo.fn || fnFn(this.Fn,campo.nb);
      propiedades.atributos = campo.atributos || {};
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

  agrega(linea, clsLinea = "") {
    const { _clase, _atributo } = isNaN(clsLinea)
      ? { _clase: clsLinea }
      : { _atributo: { "data-fila": clsLinea } };

    this.tabla.querySelector("tbody").innerHTML += domTxt(
      this.nbCampos.reduce((txt, nbCampo, i) => {
        let col = this.campos[nbCampo];
        if (col) {
          txt += this.creaCelda(
            linea[nbCampo],
            nbCol(nbCampo) + " " + def(col.clase),
            col.atributos,
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

  creaCelda(valor, clase, atributos, fmt, fn) {
    let _valor = def(valor);
    let _txt = _valor ? fmt(_valor) : _valor;
    let limpia = (valor) => typeof valor === "string" ?
        valor.replace(/"/g,'\\"').replace(/'/g,"\\'") :
        valor; 
    //let atributos = {} // "data-valor": limpia(_valor) };

    if (fn) {
      atributos.onclick = fn + "(event)";
      atributos.cursor = "pointer";
    }
    return domTxt(_txt, "td", clase, atributos);
  }

  creaTitulos(tabla) {
      if(this.titulo) tabla.querySelector("#titTab").innerHTML = this.datos.length ?
        this.titulo + spanCant(this.datos.length) + tmpTabBtns() :
        "No hay " + this.titulo;

    if (this.hayCampos)
      tabla.querySelector("thead").outerHTML = tabTitulos(this.titCampos);
  }

  programaMnu(opciones) {
      for (let opcion in opciones) {
        let btn = this.tabla.querySelector("." + opcion)
        if(btn) btn.onclick = opciones[opcion];
    }
}

  mst() {
    this.tabla = document.createElement("TABLE");
    this.dom.innerHTML = "";
    this.tabla.innerHTML =
      "<caption><h3 id='titTab'></h3></caption><thead></thead><tbody></tbody>";

    this.dom.appendChild(this.tabla);

    this.creaTitulos(this.tabla);

    this.datos.forEach(this.agrega.bind(this));

    this.programaMnu({
      btnXl: this.xl.bind(this),
      btnImp: this.imp.bind(this),
    });
  }

  imp() {
      let btns = this.dom.querySelector(".rogTabBtns")
      if(btns) btns.style.display = "none";
      debugger
      Imprime(this);
      if(btns) btns.style.display = "";
  }

  xl() {
    grabaXL(this.tabla,this.titulo);
  }
}

function fnFn(fn,nb) {
    let retorno = fn;

    if (fn && fn[nb]) retorno = fn[nb];

    return retorno;
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
        _fmt = rogFmt.Ent;
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
          case "total":
          case "moneda":
            alinea = "right";
            _fmt = rogFmt.Moneda;
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
    <span class='btnXl'  title="Pasar a MS Excel"><i class='far fa-file-excel'></i></span>
    <span class='btnImp' title="Imprimir"><i class='fas fa-print'></i></span>
    </span>`;
}

/*
var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', 'css/my.css');
document.head.appendChild(link);
*/
        
function grabaXL(tabla,nbArch) {
    function s2ab(s) { 
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;    
    }

    try {
        bsq.Espera ("Guardando en XL");
    } catch(e) {
        console.log(e)
    }
    
    let wb = XLSX.utils.table_to_book(tabla);
    let wbOut = XLSX.write(wb, { 
        bookType: 'xlsx',
        bookSST:    true,
        type:     'binary'
    })

    saveAs(new Blob([s2ab(wbOut)],{type:"application/octet-stream"}), nbSerial(nbArch) +'.xlsx');

    try {
        bsq.Espera();
    } catch(e) {
        console.log(e)
    }
}

function Imprime(tabla) {
    var vnt = window.open("", "PRINT", "height=400,width=600");

    // C A B E C E R A
    vnt.document.write("<html><head><title>" + tabla.titulo + "</title>");
    vnt.document.write("<meta charset='utf-8'>");
    //vnt.document.styleSheets = window.document.styleSheets

    vnt.document.write("</head><body >");

    vnt.document.write("<h1>" + tabla.titulo + "</h1>");

    // C O N T E N I D O
    vnt.document.write(tabla.tabla.outerHTML);

    // P I E   D E   P Á G I N A

    // E S T I L O S
    vnt.document.write("<style src='./css/paleta.css'></style>");
    vnt.document.write("<style src='./css/rog.css'></style>");
    vnt.document.body.appendChild(tabla.css.css);

    // F I N A L E
    vnt.document.close(); // mrqr de IE >= 10
    vnt.focus(); // mrqr de IE >= 10*/

    vnt.print();
    vnt.close();
}