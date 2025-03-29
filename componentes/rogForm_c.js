// Crea un Formulario a partir de una estructura dada

const moveCorr = moveCorresponding;

class rogForm {
  constructor (dom, Stru, opcs = {}) {
    this.w = {
      cambios: 0,
    };

    this.dom = dom;
    this.stru = Stru;

    this.frm = this.stru;

    this.lee = (datos,boton) => {
      alert("Lectura perdida");
      console.log("Lectura perdida:");
      console.log(datos);
      return true;
    };

    if(!this.dom.querySelector(".rogBotonera")) this.frm.appendChild(creaBtns(this.frm))

    // Prepara el formulario
    this.frm.addEventListener('submit', event => {
      event.preventDefault();
      this.frm.btn.disabled = true;
      limpiaTextAreas(this.frm);

      const boton = event.submitter;

      if(boton.es("reset") || boton.type === "reset") this.resetea;
      else if(boton.es("cancela")) this.cancela;
          else if(boton.es("submite") || boton.type === "submit") {
            if(this.frm.checkValidity() && validaFormulario(this.frm)) {
              if (this.lee(this.datos,boton)) {
                this.cambia();
                if(this.autoCierra) cierraModal(this)
              }
            } else {
              debugger;
            }
          }
    });

    this.frm.btn = this.frm.querySelector("[type=submit]");
    this.frm.btn.disabled = true;

    this.frm.addEventListener("change", (event) => {
      this.evaluaFs()
      this.frm.btn.disabled = this.noHayErrores;
    });

    if(opcs) for(let opc in opcs) this[opc] = opcs[opc];

    this.dom.frm = this.frm;
  }

  set stru(stru) {
    this.w.stru = Array.isArray(stru) ?
      stru.map(x => new rogCampo(x)) :
      Object.entries(stru)
        .map(([x,prms]) => new rogCampo(x,prms));
  }
  
  get stru() {
    return this.w.stru;
  }
  
	set lee(fn) {
		this.frm.lee = fn;
	}

	get lee() {
		return this.frm.lee
	}

  cambia() {
    this.w.cambios++;
  }

  get cambioo() {
    return this.w.cambios > 0;
  }

  get cambios() {
    return this.w.cambios;
  }

  get resetea() {
    this.frm.reset();
  }

  set cancela(fn) {
    this.w.cancela = fn;
    this.escapa = fn;   // Asocia la función a la tecla [esc]
  }

  get cancela() {
    this.w.cancela();
  }

  /**
   * Agrega una función para la tecla Esc
   * @param {function} fn
   */
  set escapa(fn) {
    this.frm.addEventListener("keydown", e => { if(e.key === "Escape") fn(); });
  }

  set dom(valor) {
    this.w.dom = objDom(valor) || document.createElement("DIV")
  }

  get dom() {
    return this.w.dom
  }

  set frm(stru) {
    if(this.dom.matches(".rogForm")) {
      this.w.frm = this.dom;
    } else {
      this.w.frm = document.createElement("FORM");
      this.w.frm.className = "rogForm";
      this.dom.appendChild(this.w.frm);

      this.frm.innerHTML = stru.map(txtInput).join("");
    }

    stru.forEach(x => this.frm.querySelector(`[name=${x._nb}]`).campo = x);
    enlazaErrores(this.frm);
  }

  get frm() {
    return this.w.frm;
  }

  set datos(buffer) {
    lmpErrores(this.frm);
    moveCorresponding(buffer,this.frm);
  }

  get datos() {
    let buffer = {};
    debugger
    moveCorresponding(this.frm,buffer)
    return buffer;
  }
    
    set autoCierra (valor) {
      this.w.cerrar = valor
    }

    get autoCierra () {
      return this.w.cerrar;
    }

    get cadena() {
      return cadenita(this.datos)
    }
    
    get formulas () {
      return this.w.stru.filter(x => x.f);
    }
  
    campo(nb) {
      return this.frm[nb];
    }
  
    evaluaFs() {
      let datos = this.datos;
      this.formulas.forEach(x => {
        let retorno = def(x.f(datos));
        if(retorno instanceof Promise) retorno.then(valor => this.campo(x._nb).value = valor);
        else this.campo(x._nb).value = retorno;
      });
    }
}

function txtInput(Stru) {
  /*
  Retorna el innerHTML de un elemento de tipo rogCampo
  */

  function tmpInput(Stru) {
    return `<label for='${Stru.nb}'>${Stru.titulo} :</label>
      ${tmpCampo(Stru)}
      <br><br>`;      
  }

  function lista(Stru) {
      return Stru.tipo === "list" ? `list='lst${Stru.nb}'` : "";    
  }
  
  function tmpCampo(Stru) {
    let txt = "";
    switch (Stru.tipo) {
      case "radio":
        txt += radioBtn(Stru.cuadra,Stru.nb,Stru.valor);
        break;
      case "memo":
        txt += `<textarea name='${Stru.nb}' rows='5' cols='40'></textarea> ${opciones(Stru)}`;
        break;
      case "combo":
        txt += Combo(Stru.nb,Stru.cuadra);
        break;
      case "tabla":
        txt += tabla(Stru.cuadra);
        break;
      case "date":
      case "fecha":
        txt += domTxt("","rog-input", "", {name: Stru.nb, value: Stru.valor, tipo: "fecha"});
        break;
      case "checkbox":
        txt += `<input type='checkbox' name='${Stru.nb}' value='${Stru.valor}'>`;
        break;
      case "number":
        txt += domTxt("","rog-input", "", {name: Stru.nb, value: Stru.valor, tipo: Stru.tipo});
        break;
      case "genero":
        txt += domTxt("","rog-genero", "", {name: Stru.nb, value: Stru.valor});
        break;
      case "EdoCiv":
        txt += domTxt("","rog-multiple", "", {name: Stru.nb, value: Stru.valor, label: "Edo. Civil", opciones: "Solter@, Casad@, Unid@, Divorciad@, Viud@"});
        break;
      case "nacionalidad":
        txt += radioBtn(["V","E"],Stru.nb,Stru.valor);
        break;
      case "tlf":
        txt += domTxt("","rog-input", "", {name: Stru.nb, value: Stru.valor, tipo: "tlf"});
        break;
      case "list":
        txt += `<datalist id="lst${Stru.nb}">${Stru.cuadra()}</datalist>`;
        break;
      case "foto":
        txt += domTxt("","rog-foto", "", {src: Stru.src(Stru.value), name: Stru.nb});
        break;
      case "dpt":
        txt += domTxt("","rog-dpt", "", {foto: Stru.value, name: Stru.nb});
        break;
      case "pai":
        txt += domTxt("","rog-pai", "", {foto: Stru.value, name: Stru.nb, label: Stru.label, carga: Stru.carga});
        break;
      default:
        txt += `<input type='${Stru.tipo || "text"}' name='${Stru.nb}' ${lista(Stru)} ${opciones(Stru)} />`;
    }
    return txt;
  }

  return tmpInput(Stru);
}
    
function Combo (nb,cuadra) {
    /*
    Retorna el innerHTML de un elemento SELECT
    con todas sus opciones
    @param nb       nombre del elemento
    @param cuadra    opciones. Puede ser
        un arreglo con los valores de las opciones
        un objeto cuyos elementos son las opciones
    */
    return desarma(cuadra).reduce(
        (opcs,x) => opcs += domTxt(x,"option")
        , `<select name='${nb}'>`
    )+"</select>";
}

function radioBtn (cuadra,nb,valor) {
    /*
    Retorna el innerHTML de un elemento INPUT de tipo RADIO
    con todas sus opciones
    @param cuadra    opciones. Puede ser
        un arreglo con los valores de las opciones
        un objeto con elementos de tipo { etiqueta: e, valor: v} o {etq: e, valor: v}
    @param nb       nombre del elemento
    @param valor    valor escogido
    */
    let chq = (x,valor) => x === valor ? " checked " : "";
    let fn = opcion => typeof opcion === "string" ? 
        {etq: opcion, valor: opcion } : 
        {etq: opcion.etiqueta || opcion.etq, valor: opcion.valor};
    return desarma(cuadra).reduce((opcs,ele) => {
	   let x = fn(ele);
	   return opcs += "<input type='radio' name='" +nb +"' " +chq(x.valor,valor)  +"value='" +x.valor +"'/>"+x.etq;
	},"");
}

function opciones(Stru) {
  return (Stru.obligatorio ? " required" : "") + 
    (Stru.f ? ` readonly tabIndex="-1"` : "") +
    (Stru.tipo === "number" ? " style= 'textAlign: right'" : "") +
    (Stru.valor ? ` value = '${Stru.valor}'` : "");
}

/**
* Mueve elementos de un FORM a un objeto o viceversa
* @param de y @param a son el objeto y el formulario o su id
* @param {form | object} de 
* @param {form | object} a 
*/
function moveCorresponding(de,a) {
    let _formaA = objDom(a);
    let elementos = rogElementos(_formaA);
    
    if(elementos) {         // DATOS A FORM
      if(_formaA.reset) _formaA.reset();          // Pone los valores por defecto en la form
      let valores = rogValores(de);
      
      let n = elementos.length;
      for (let i = 0; i < n ;i++) {
        asignaValor(elementos[i],valores[elementos[i].name])
      }
    } else {                // FORM A DATOS
      elementos = rogElementos(de);
        
      if(objVacio(a)) {
        let n = elementos.length;
        for (let i = 0; i < n ;i++) asignaElemento(a,elementos[i].name,elementos[i]);
      } else {
        elementos = Array.from(elementos).filter(x => x.name);
        for(let nbCampo in a) {
          let e = elementos.find(x => x.name === nbCampo);
          if (e) asignaElemento(a,nbCampo,e)
        }
		}
  }
}

function valValido(valor) {
  return !(valor === undefined || valor === null); 
}

function asignaElemento(a,nbCampo,elemento) {
  if(nbCampo && valValido(elemento.value)) {
    switch (elemento.type) {
      case "radio":
            if(elemento.checked) a[nbCampo] = elemento.value;
            break;
        case "checkbox":
            a[nbCampo] = elemento.checked;
            break;
        case "date":
            a[nbCampo] = elemento.value //valueAsDate;
            break;
      case "number":
            a[nbCampo] = elemento.valueAsNumber;
          break;
        default:
            a[nbCampo] = elemento.value;
    }
  } else {
      /* 
          CASO ESPECIAL:
          Un campo "file" que se llenó en otra ocasión no muestra el valor correspondiente (Nombre del archivo a cargar)
          así que hay que mantenerlo con valor artificialmente para saber que en algún momento se cargó.
          Esto se complementa en la función "asignaValor" y en el objeto rogCargArch
      */
      if((elemento.type === "file") && elemento.classList.contains("listo")) a[nbCampo] = "listo";
  }
}

function asignaValor(campo,valor) {
  if(campo && valValido(valor)) {
    switch (campo.type) {
      case "radio":
        campo.checked = (campo.value === valor);
        break;
      case "checkbox":
        campo.checked = valor;
        break;
      case "date":
        campo.value = rogFmt.Fecha(valor).amd();
        break;
      case "file":
        campo.classList.add("listo")
        break;
      default:
        campo.value = valor;
    }
  }
}

/**
 * Crea la botonera del formulario
 * @param {form} frm 
 * @returns {element} nav con los botones
 */
function creaBtns(frm) {
  const btns = {
    "Acepta":  {etq: "✔", title: "Registra", atribs: {type: "submit", submite: true}},
    "Cancela": {etq: "✘", title: "Cancela", atribs:  {cancela: true} },
    "Resetea": {etq: "♻", title: "Limpia", atribs:   {reset: true} },
    "Duplica": {etq: "+", title: "Duplica", atribs:   {duplica: true, submite: true}},
    "Elimina": {etq: "🗑", title: "Elimina", atribs:   {elimina: true, submite: true}}
  }
  
  let _botones  = document.createElement("NAV");
  _botones.className = "rogBotonera";

  Object.values(btns).forEach((atribs) => _botones.appendChild(creaBtn(atribs)));
  
  return _botones;
}

/**
 * Retorna un botón con los atributos:
 * @property {string}   etq     Texto del botón
 * @property {string}   clase   clase del botón 
 * @property {function} fn      Función que se ejecuta al pulsar el botón
 * @property {string}   title   Texto de apoyo
 * @property {object}   atribs  Atributos del botón
 * @property {boolean}  txt     Si se retorna el innerHTML del botón en vez del Objeto
 * 
 * Atributos notables:
 * @property {boolean}  submite Si pasa a la @function lee
 * @property {boolean}  cancela Si cancela la operación al ser pulsada
 * @property {boolean}  resetea Si Limpia el formulario
 * @returns  {element | string}
*/
function creaBtn(atribs) {
    let _btn = document.createElement("button");
    _btn.value = atribs.etq;
    _btn.innerText = atribs.etq;
    _btn.title = def(atribs.title);
    _btn.className= ("rogBtn " +def(atribs.clase)).trim();

    if(atribs.fn) _btn.onclick = atribs.fn;
    if(atribs.atribs) Object.entries(atribs.atribs).forEach(([atrib,valor]) => _btn.setAttribute(atrib, valor));
    
    _btn.es = function (que) { return this.hasAttribute(que) && (this.getAttribute(que) !== "false")}

    return atribs.txt ? _btn.outerHTML : _btn;
}

function esBtn(quien,que) {
  return quien.hasAttribute(que) && (quien.getAttribute(que) !== "false");
}

// Procesos
function validaFormulario(formulario) {
  return rogElementos(formulario).reduce((fino,x) => {
      if(x.campo) fino &&= x.campo.valida(x.value)
      return fino;
    }
  , true);
}

// Evaluaciones especiales

function evalRadio(nb) {
  let retorno;

  Array.from(document.querySelectorAll("[name="+nb+"]"))
  .forEach(x => {
      if(x.checked) retorno = x.value;
  });
  return retorno;
}

function evalOpcRadio(opcion,valor) {
  if(opcion.checked) return opcion.value;
}
      
function cadenita(datos) {
  return "?"+desarma(datos).map(x => x +"="+ datos[x]).join("&")
}

function enlazaErrores(frm) {
  frm.querySelectorAll("[name]").forEach(x => {
    const msj = document.createElement("SPAN");
    msj.setAttribute("for", x.name);
    x.error = msj;
    x.parentNode.insertBefore(msj,x);
  });
}

function lmpErrores(frm) {
  rogElementos(frm).forEach(x => x.campo.Err = "");  
}

function rogElementos(frm) {
  try {
    return Array.from((frm instanceof rogForm ? frm.dom : objDom(frm)).querySelectorAll("[name]"));
  } catch (err) {
    /*
    console.dir(frm)
    console.log("No tiene elementos (O algo así)")
    console.error(err)
    */
  }
}
