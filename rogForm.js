// Crea un Formulario a partir de una estructura dada


const moveCorr = moveCorresponding;

class rogForm {
  constructor (dom, Stru, opcs) {
        this.w = {};
        this.dom = dom;
      
        this.w.stru = (Stru instanceof Array ? Stru : desarma(Stru))
            .map(x => new rogCampo(x,Stru[x]));

        this.frm = this.w.stru.reduce((form,x) => form += rogInput(x),"")           
		
		    this.lee     = (datos) => console.log("Lectura perdida:", datos);
		    this.cancela = () => this.frm.reset();
		    this.agrega  = this.frm.lee;
        this.frm.appendChild(creaBtns(this.frm))
      
        // Prepara el formulario
        this.frm.addEventListener('submit', event => {
            event.preventDefault();
            limpiaTextAreas(this.frm);
            if(this.frm.checkValidity()) this.lee(this.datos);
			      if(this.autoCierra) cierraModal(this)
        });

        this.frm.btn = this.frm.querySelector("[type=submit]")
       
        this.frm.addEventListener("change", (event) => {
          this.evaluaFs()
          this.frm.btn.disabled = !this.frm.checkValidity();
        });
        
      if(opcs) for(let opc in opcs) this[opc] = opcs[opc];
      
      this.dom.frm = this.frm;
    }

	set lee(fn) {
		this.frm.lee = fn;
	}

	get lee() {
		return this.frm.lee
	}

	set cancela(fn) {
		this.frm.cancela = fn;	
	}
	
	get cancela() {
		return this.frm.cancela;	
	}

	set repite(fn) {
		return this.frm.repite;
	}
	
	get repite() {
		return this.frm.repite;	
	}

  set dom(valor) {
    this.w.dom = objDom(valor) || document.createElement("DIV")
  }

  get dom() {
    return this.w.dom
  }

  set frm(contenido) {
    this.w.frm = document.createElement("FORM");
    this.w.frm.className = "rogForm";

    this.dom.appendChild(this.w.frm);

    this.w.frm.innerHTML = contenido;
  }

  get frm() {
    return this.w.frm;
  }

  set datos(buffer) {
    moveCorresponding(buffer,this.frm);
  }

  get datos() {
    let buffer = {};
    moveCorr(this.frm,buffer)
    return buffer;
  }
	
    get elements() {
        return this.frm.elements
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
    
    get errores () {
        let _e = {};
        Array.from(this.frm.elements).forEach(x => {
            if(x.className === "error") _e[x.for] = x;
        });
        return _e;
    }

    get formulas () {
      return this.w.stru.filter(x => x.f);
    }
  
    campo(nb) {
      return this.frm[nb];
    }
  
    evaluaFs() {
      let datos = this.datos;
      this.formulas.forEach(x => this.campo(x._nb).value = x.f(datos));
      // asignaValor(this.campo[x._nb],x.f(datos))
    }
}

function rogInput(Stru) {
    /*
    Retorna el innerHTML de un elemento de tipo rogCampo
    */

    function tmpInput(Stru) {
      return `<label for='${Stru.nb}'>${Stru.titulo} :</label>
        ${txtInput(Stru)}
        <span for='${Stru.nb}' class='error'>
          ${Stru.obligatorio ? "*" : ""} 
          ${Stru.Err || ""}
        </span>
        <br><br>`;      
    }
  
    function lista(Stru) {
        return Stru.tipo === "list" ? `list='lst${Stru.nb}'` : "";    
    }
    
    function txtInput(Stru) {
      let txt = "";
      switch (Stru.tipo) {
          case "radio":
              txt += radioBtn(Stru.match,Stru.nb,Stru.valor);
              break;
          case "memo":
              txt += `<textarea name='${Stru.titulo}' rows='5' cols='40'></textarea> ${opciones(Stru)}`;
              break;
          case "combo":
              txt += Combo(Stru.nb,Stru.match);
              break;
          case "tabla":
              txt += tabla(Stru.match);
              break;
          case "date":
              txt += `<input type='date' name='${Stru.nb}' ${opciones(Stru)}/>`;
              break;
          case "checkbox":
              txt += `<input type='checkbox' name='${Stru.nb}' value='${Stru.valor}'>`;
              break;
          case "genero":
              txt += radioBtn({ 
                  Fem:  { valor: "Fem",  etiqueta: "♀" }, 
                  Masc: { valor: "Masc", etiqueta: "♂" }
              },Stru.nb,Stru.valor);
              break;
          case "EdoCiv":
              txt += radioBtn([
                  { etiqueta: "S", valor: "Soltero"}, 
                  { etiqueta: "C", valor: "Casado" },
                  { etiqueta: "U", valor: "Unido" }, 
                  { etiqueta: "D", valor: "Divorciado" },
                  { etiqueta: "V", valor: "Viudo" }
              ],Stru.nb,Stru.valor);
              break;
          case "nacionalidad":
              txt += radioBtn(["V","E"],Stru.nb,Stru.valor);
              break;
          case "tlf":
              txt += `<input type='number' name='${Stru.nb}' ${opciones(Stru)} />`;
              break;
          case "list":
              txt += `<datalist id="lst${Stru.nb}">${Stru.match()}</datalist>`
          default:
              txt += `<input type='${Stru.tipo || "text"}' name='${Stru.nb}' ${lista(Stru)} ${opciones(Stru)} />`;
      }
      return txt;
    }
  
    return tmpInput(Stru);
}
    
function Combo (nb,match) {
    /*
    Retorna el innerHTML de un elemento SELECT
    con todas sus opciones
    @param nb       nombre del elemento
    @param match    opciones. Puede ser
        un arreglo con los valores de las opciones
        un objeto cuyos elementos son las opciones
    */
    return desarma(match).reduce(
        (opcs,x) => opcs += domTxt(x,"option")
        , `<select name='${nb}'>`
    )+"</select>";
}

function radioBtn (match,nb,valor) {
    /*
    Retorna el innerHTML de un elemento INPUT de tipo RADIO
    con todas sus opciones
    @param match    opciones. Puede ser
        un arreglo con los valores de las opciones
        un objeto con elementos de tipo { etiqueta: e, valor: v} o {etq: e, valor: v}
    @param nb       nombre del elemento
    @param valor    valor escogido
    */
    let chq = (x,valor) => x === valor ? " checked " : "";
    let fn = opcion => typeof opcion === "string" ? 
        {etq: opcion, valor: opcion } : 
        {etq: opcion.etiqueta || opcion.etq, valor: opcion.valor};
    return desarma(match).reduce((opcs,ele) => {
	   let x = fn(ele);
	   return opcs += "<input type='radio' name='" +nb +"' " +chq(x.valor,valor)  +"value='" +x.valor +"'/>"+x.etq;
	},"");
}

function opciones(Stru) {
  return (Stru.obligatorio ? " required" : "") + 
    (Stru.f ? " readonly" : "") +
    (Stru.tipo === "number" ? " style= 'textAlign: right'" : "") +
    (Stru.valor ? ` value = '${Stru.valor}'` : "");
}

function moveCorresponding(de,a) {
    /*
        Mueve elementos de un FORM a un objeto o viceversa
        @param de y @param a son el objeto y el formulario o su id
    */
    let _formaA = objDom(a);
    let elementos = _formaA && _formaA.elements;
    
    if(elementos) {         // DATOS A FORM
        if(_formaA.reset) _formaA.reset();          // Pone los valores por defecto en la form
        let valores = rogValores(de);
        
        let n = elementos.length;
        for (let i = 0; i < n ;i++) {
            asignaValor(elementos[i],valores[elementos[i].name])
        }
    } else {                // FORM A DATOS
        elementos = objDom(de).elements;
        
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

function asignaElemento(a,nbCampo,elemento) {
    if(nbCampo && elemento.value) {
        switch (elemento.type) {
          case "radio":
                if(elemento.checked ) a[nbCampo] = elemento.value;
                break;
            case "checkbox":
                a[nbCampo] = elemento.checked;
                break;
            case "date":
                a[nbCampo] = elemento.valueAsDate;
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
    if(campo && valor) {
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

function creaBtns(frm) {
    /*
    Crea los botones básicos de la planilla:
    lee, cancela y agrega
    */
    let _botones  = document.createElement("NAV");
  
    _botones.appendChild(creaSubmit("✔"))
    _botones.appendChild(creaBtn("✘",null,frm.cancela));
    _botones.appendChild(creaBtn("&#x2795",null,frm.repite));
    
    return _botones;
}

function creaBtn(etq,clase = "",atribs,txt) {
    /* 
    Retorna un botón con los atributos:
        @param etq      Texto del botón
        @param clase    Clase del botón
        @param atribs   Atributos del botón:
        Si es una función se le asigna al "onclick" del botón
        Sino: cada elemento del objeto se asigna al atributo correspondiente del botón
        txt             Cierto: se retorna el innerHTML del botón
    */
    
    let _btn = document.createElement("SPAN");
    _btn.innerHTML = etq;
    _btn.className= ("rogBtn " +clase).trim();

    if(atribs instanceof Function) _btn.onclick = atribs;
    else for(let atrib in atribs) _btn[atrib] = atribs[atrib];
    
    return txt ? _btn.outerHTML : _btn;
}

function creaSubmit(txt = "Dale!") {
    _btn = document.createElement("INPUT");
    _btn.type = "SUBMIT";
    _btn.value = txt;
    _btn.className = "rogBtn"
    return _btn;
}

// Procesos
function validaFormulario(formulario) {
    return Object.array(objDom(formulario).elements).reduce((fino,x) => fino && Stru[x.name].valida(), true)
}
        
function respuestaValidacion(datos,frm) {
    console.log("Respuesta: ",datos);
    document.querySelectorAll(".error").forEach(x => x.textContent = "");
    if(datos.valid) {
        frm.alLeer(datos)
    } else {
        alert("!" +datos.errors.length +" Errores!");
        datos.errors.forEach(x => 
            document.querySelector("[for="+x.property+"].error").textContent = x.message
        );
    }
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

