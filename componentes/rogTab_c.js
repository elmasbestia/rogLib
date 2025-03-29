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
		<script src="../rogLib/PDO/xlsx.full.min.js"></script>

*/

const _rogTab = {
    /**
     * Al hacer "click" sobre la tabla, reconocer la lìnea sobre la que se hizo
     * y disparar el evento correspondiente
     */
    chxTR: (e) => {
        const fila = e.target.closest("TR");
        if(fila && fila.dataset.hasOwnProperty("fila")) {
          const obj = e.currentTarget.getRootNode().host
          obj.dispatchEvent(new CustomEvent("escogeFila",{detail: {fila, datos: obj.datos[fila.dataset.fila], que: e.target}}));
        }
    },

    imprime: (contenido, titulo, css) => {
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
    },
      
    nbCol: (nb) => "col_" + nb,

    asigna: (tabla, btns) => {
      Object.entries(btns).forEach(([btn, fn]) => {
        let _btn = tabla.querySelector("." +btn)
        if(_btn) _btn.onclick = fn
      })
    },

    extraeFn: (txt) => window[txt.split("(")[0]]
}

class rogTab extends HTMLElement {
    #datos = [];
    #cols  = [];
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });    
    }

    get titulo() {
        return this.getAttribute("titulo") || "Registros";
    }

    set titulo(valor) {
        this.setAttribute("titulo",valor);
    }

    get tabla() {
        return this.shadowRoot.querySelector("TABLE");
    }

    set carga(valor) {
        if(typeof valor === "string") this.setAttribute("carga", valor);
        else this.datos = valor();
    }
    
    get carga() {
        return this.hasAttribute("carga") ? _rogTab.extraeFn(this.getAttribute("carga")) : null; 
    }
    
    set datos(valor) {
      if(valor) {
        this.#datos = valor ? [... valor] : [];
      } else {
        this.#datos.splice(0,this.#datos.length);
      }
      if(!this.hayCampos) this.campos = (this.datos[0] || {});
      this.render();
    }

    get datos() {
      return this.#datos || [];
      /*
        let retorno = this.getAttribute("datos");
        if(!retorno) if (this.carga) retorno = this.carga();
        return retorno || [];
        */
    }

    set campos(valor) {
        this.#cols = Array.isArray(valor) ?
            valor.map((nb) => new rogCampo(nb)) :
            Object.entries(valor).map(([nb,campo]) => new rogCampo(nb,campo));
    }

    get campos() {
        return this.#cols || [];
    }

    get hayCampos() {
      return this.#cols.length > 0;
    }

    set fmt(valor) {
      this.setAttribute("fmt", valor);
    }
  
    get fmt() {
      return this.hasAttribute("fmt") ? _rogTab.extraeFn(this.getAttribute("fmt")) : null;
    }

    agrega(datos) {
        if (Array.isArray(datos)) datos.forEach(this.agrega);
        else {
            this.datos.push(datos);
            this.render();
        }
    }

    mstLinea(linea, clsLinea = "") {
        const { _clase, _atributo } = isNaN(clsLinea)
          ? { _clase: clsLinea }
          : { _atributo: { "data-fila": clsLinea } };
  
        return domTxt(
          this.fmt ? 
            domTxt(this.fmt(linea), "TD") :
            this.campos.map(campo => {
              let _valor = def(linea[campo._nb]);
              let _txt = _valor ? campo.fmt(_valor) : _valor;
              return domTxt(_txt,
                "TD",
                `${(_rogTab.nbCol(campo._nb) +def(campo.clase)).trim()}` //,
                //_valor === _txt ? "" : `data-valor="${_valor}"`
              )
            }).join(""),
          "tr",
          _clase,
          _atributo
        );
    }
  
  get titulos() {
    return this.fmt ? "" :
      this.hayCampos ?
        domTxt(this.campos.map(x => domTxt(x.titulo,"th")).join(""), "tr")
        : ""
  }

  get lineas() {
    return this.datos.map(this.mstLinea.bind(this)).join("")
    //else return this.datos.forEach(.bind(this));
  }
  
  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = tmpCSSrogTab(this);

    this.shadowRoot.innerHTML += tmprogTab(this);
    this.tabla.addEventListener("click", _rogTab.chxTR);
    _rogTab.asigna(this.tabla, {
        btnXl: this.xl.bind(this),
        btnImp: this.imp.bind(this)
      });
  }

  imp() {
    // Esconde los botones
    const btns = this.shadowRoot.querySelector(".rogTabBtns");
    btns.style.display = "none";    
    
    _rogTab.imprime(this.tabla.outerHTML, this.titulo, this.css)
    
    btns.style.display = "unset";
  }

  xl() {
    let wb = XLSX.utils.table_to_book(this.tabla);

    XLSX.writeFile(wb, nbSerial(this.nb) + ".xlsx", {compression: true})
  }
}

customElements.define("rog-tab", rogTab);

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

function tmprogTab(obj) {
    return `<table>
        <caption>
          ${
            obj.datos.length ?
            `<h3 class="titTab">${obj.titulo}<sup><span class="badge">${obj.datos.length}</span></sup>
                <span class="rogTabBtns">
                    <span class="rogBtn btnXl" title="pasar a MS Excel">
                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 384 512"><path fill="currentColor" d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm212-240h-28.8c-4.4 0-8.4 2.4-10.5 6.3-18 33.1-22.2 42.4-28.6 57.7-13.9-29.1-6.9-17.3-28.6-57.7-2.1-3.9-6.2-6.3-10.6-6.3H124c-9.3 0-15 10-10.4 18l46.3 78-46.3 78c-4.7 8 1.1 18 10.4 18h28.9c4.4 0 8.4-2.4 10.5-6.3 21.7-40 23-45 28.6-57.7 14.9 30.2 5.9 15.9 28.6 57.7 2.1 3.9 6.2 6.3 10.6 6.3H260c9.3 0 15-10 10.4-18L224 320c.7-1.1 30.3-50.5 46.3-78 4.7-8-1.1-18-10.3-18z"></path></svg>
                    </span>
                    <span class="rogBtn btnImp" title="imprimir">
                        <svg class="svg-inline--fa fa-print fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="print" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M448 192V77.25c0-8.49-3.37-16.62-9.37-22.63L393.37 9.37c-6-6-14.14-9.37-22.63-9.37H96C78.33 0 64 14.33 64 32v160c-35.35 0-64 28.65-64 64v112c0 8.84 7.16 16 16 16h48v96c0 17.67 14.33 32 32 32h320c17.67 0 32-14.33 32-32v-96h48c8.84 0 16-7.16 16-16V256c0-35.35-28.65-64-64-64zm-64 256H128v-96h256v96zm0-224H128V64h192v48c0 8.84 7.16 16 16 16h48v96zm48 72c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"></path></svg>
                    </span>  
                </span>
            </h3>`
            : `No hay ${obj.titulo}`
          }
        </caption>
        <thead>
            ${obj.titulos}
        </thead>
        <tbody>
            ${obj.lineas}
        </tbody>
    </table>`;
}

function tmpCSSrogTab(obj) {
    return `<style>
    	table {
	    	border-collapse: collapse;
		    width: 100%;
	    }

	    thead {
		    background-color: var(--clrFndObj, black);
		    color: var(--clrTxtObj, white);
	    }

	    th, td {
		    padding: .35em;
        border-right: 1px solid currentcolor;
	    }

    	tr:nth-child(even){background-color: var(--clrPar, #f2f2f2)}

      .trGrupo {
          font-size: 125%;
          vertical-align: bottom;
          background-color: var(--clrFndObj);
          color: var(--clrTxtObj);
          opacity: .75;
          cursor: row-resize;
      }

      svg {
        height: .75em;
      }

      .badge {
        vertical-align: super;
        border-radius: 100%;
        font-size: 75%;
        padding: .3em;
        color: var(--clrTxtObj);
        background-color: var(--clrFndObj);
        border: 1px solid var(--clrTxtObj);
      }
      
      ${obj.campos.reduce((txt, campo) => {
        if(Object.keys(campo.css).length > 0) {
          txt += `.${_rogTab.nbCol(campo.nb)} {`;
          Object.entries(campo.css).map(([que, valor]) => txt += que +":" +valor);
          txt += "}"
        };
        return txt;
      }, "")}
    </style>`;
}
