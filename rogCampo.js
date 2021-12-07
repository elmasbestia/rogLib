/*
 Objeto para definir elementos de datos
	Atributos:
	nb		Nombre del Campo, 
	titulo		Etiqueta del Campo, 
	tipo		Tipo de Dato del Campo, 
	obligatorio	Si el Campo es requerido o no (required), 
	match		Patrón o conjunto de Datos válidos para el Campo, 
	original	Valor inicial del Campo, 
	validador	función para validar el valor del Campo,
	Err		Mensaje de Error al validar el Valor del Campo
*/
class rogCampo {
    constructor (nb,campo = {}) {
      if(typeof nb !== "string") {
        if(Object.keys(nb).length === 1) {
          [nb, campo] = Object.entries(nb)[0];
        } else {
          campo = nb;
          nb = nb.nb;
     /*
 Objeto para definir elementos de datos
	Atributos:
	nb		Nombre del Campo, 
	titulo		Etiqueta del Campo, 
	tipo		Tipo de Dato del Campo, 
	obligatorio	Si el Campo es requerido o no (required), 
	match		Patrón o conjunto de Datos válidos para el Campo, 
	original	Valor inicial del Campo, 
	validador	función para validar el valor del Campo,
	Err		Mensaje de Error al validar el Valor del Campo
*/
class rogCampo {
    constructor (nb,campo = {}) {
      if(typeof nb !== "string") {
        if(Object.keys(nb).length === 1) {
          [nb, campo] = Object.entries(nb)[0];
        } else {
          campo = nb;
          nb = nb.nb;
        }
      }
      
        this._nb = nb;
        this._titulo = campo.titulo || nb;
        this.tipo = campo;
        this._original  = campo.original;
        this._contenido = "";
        this._obligatorio = campo.obligatorio || campo.required;
        this._match = campo instanceof Array ? campo : campo.match;
        this._validador = campo.validador;
        this.valor = campo.valor;
        this.f = campo.f;
        this._Err = "";
    }

    set tipo(campo) {
        this._tipo = typeof campo === "string" ? 
            campo : campo instanceof Array ? 
                "combo" : 
                campo.tipo || campo.type || "text";
    }
    
    get tipo() {
        return this._tipo;
    }
    
    valida(valor) {
        let _err = "";
        if (valor == undefined) {
            if (this.obligatorio) {
                _err = (this.tipo === "combo" ? "Escoja un valor de la lista" : "Este campo es requerido");
            }
        } else {
            // Chequea el formato de los datos
            if (this.match) _err = evaluaMatch(this.match,valor)
        }
        if (!_err) { // Fechas (CASO ESPECIAL ya que HTML las trata como texto)
            if (this.tipo === "date") {
                fecha = new Date(valor);
                if (fecha) {
                    valor = fecha;
                } else {
                    _err = "¡Revise la fecha, por favor!";
                }
            }
        }
        if (!_err) { // Función validadora
            if(this.validador) {
                validador = this.validador;
                _err = validador(valor);
            }
        }
        this._Err = _err;
        this.contenido = valor;
        return !_err;
    }
  
    set valor(valor = null) {
        if (valor != null) {
          if (this.valida(valor)) this._contenido = valor;
          else {
                msj = `No es posible asignar el valor valor a ${this.titulo} <br/>(${this._Err})`;
                alert(msj);
            }
        }
    }
    
    get valor () { return this._contenido; }
    
    get inicial () { return this._original || xOmision(this._tipo)}
  
    get nb () { return this._nb }
    get titulo () { return this._titulo; }
    get tipo () { return this._tipo;}
    get obligatorio ()  { return this._obligatorio;}
    get match () { return this._match;}
    get validador () { return this._validador;}
    get Err () { return this._Err }

    toString() { return this._titulo +": " +this._contenido; }
}

function xOmision(tipo) {
	let retorno = "";
    
    switch (tipo) {
        case "checkbox": 
            retorno = false;
            break;
        case "number":
            retorno = 0;
            break;
        case "date":
            retorno = new Date();
    }
	return retorno;
}

function regVacio(Stru) {
	let retorno = {};
	Stru.forEach(x => {
		retorno[x.nb] = x.inicial;
	});
	return retorno;
}

function rogValores(val) {
    let retorno = val;
    if(val instanceof Array) retorno = val.reduce((v,x) => {
        v[x.nb] = x.valor;
        return v
    } ,{})
    return retorno;
}

function evaluaMatch(match,valor) {
    if(this.match instanceof Function) if(!this.match(valor)) _err = "Valor inválido";
    else if ((this.match instanceof Array)) {
        if (!this.match.includes(valor)) _err = "Valor no contemplado"
    } else {
        // Filtros posibles de implementar: http://php.net/manual/es/filter.filters.validate.php
        switch (this.match) {
            case "correo":
                if (!filter_var(valor, FILTER_VALIDATE_EMAIL)) _err = "Formato de correo inválido";
                break;
            case "url":
                if (!filter_var(valor, FILTER_VALIDATE_URL)) _err = "Dirección inválida";
                break;
            default:
                if(!(new RegExp('\\w+')).test(valor)) _err = "Formato inválido"; 
        }
    }
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
   }
      }
      
        this._nb = nb;
        this._titulo = campo.titulo || nb;
        this.tipo = campo;
        this._original  = campo.original;
        this._contenido = "";
        this._obligatorio = campo.obligatorio || campo.required;
        this._match = campo instanceof Array ? campo : campo.match;
        this._validador = campo.validador;
        this.valor = campo.valor;
        this.f = campo.f;
        this._Err = "";
    }

    set tipo(campo) {
        this._tipo = typeof campo === "string" ? 
            campo : campo instanceof Array ? 
                "combo" : 
                campo.tipo || campo.type || "text";
    }
    
    get tipo() {
        return this._tipo;
    }
    
    valida(valor) {
        let _err = "";
        if (valor == undefined) {
            if (this.obligatorio) {
                _err = (this.tipo === "combo" ? "Escoja un valor de la lista" : "Este campo es requerido");
            }
        } else {
            // Chequea el formato de los datos
            if (this.match) _err = evaluaMatch(this.match,valor)
        }
        if (!_err) { // Fechas (CASO ESPECIAL ya que HTML las trata como texto)
            if (this.tipo === "date") {
                fecha = new Date(valor);
                if (fecha) {
                    valor = fecha;
                } else {
                    _err = "¡Revise la fecha, por favor!";
                }
            }
        }
        if (!_err) { // Función validadora
            if(this.validador) {
                validador = this.validador;
                _err = validador(valor);
            }
        }
        this._Err = _err;
        this.contenido = valor;
        return !_err;
    }
  
    set valor(valor = null) {
        if (valor != null) {
          if (this.valida(valor)) this._contenido = valor;
          else {
                msj = `No es posible asignar el valor valor a ${this.titulo} <br/>(${this._Err})`;
                alert(msj);
            }
        }
    }
    
    get valor () { return this._contenido; }
    
    get inicial () { return this._original || xOmision(this._tipo)}
  
    get nb () { return this._nb }
    get titulo () { return this._titulo; }
    get tipo () { return this._tipo;}
    get obligatorio ()  { return this._obligatorio;}
    get match () { return this._match;}
    get validador () { return this._validador;}
    get Err () { return this._Err }

    toString() { return this._titulo +": " +this._contenido; }
}

function xOmision(tipo) {
	let retorno = "";
    
    switch (tipo) {
        case "checkbox": 
            retorno = false;
            break;
        case "number":
            retorno = 0;
            break;
        case "date":
            retorno = new Date();
    }
	return retorno;
}

function regVacio(Stru) {
	let retorno = {};
	Stru.forEach(x => {
		retorno[x.nb] = x.inicial;
	});
	return retorno;
}

function rogValores(val) {
    let retorno = val;
    if(val instanceof Array) retorno = val.reduce((v,x) => {
        v[x.nb] = x.valor;
        return v
    } ,{})
    return retorno;
}

function evaluaMatch(match,valor) {
    if(this.match instanceof Function) if(!this.match(valor)) _err = "Valor inválido";
    else if ((this.match instanceof Array)) {
        if (!this.match.includes(valor)) _err = "Valor no contemplado"
    } else {
        // Filtros posibles de implementar: http://php.net/manual/es/filter.filters.validate.php
        switch (this.match) {
            case "correo":
                if (!filter_var(valor, FILTER_VALIDATE_EMAIL)) _err = "Formato de correo inválido";
                break;
            case "url":
                if (!filter_var(valor, FILTER_VALIDATE_URL)) _err = "Dirección inválida";
                break;
            default:
                if(!(new RegExp('\\w+')).test(valor)) _err = "Formato inválido"; 
        }
    }
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

