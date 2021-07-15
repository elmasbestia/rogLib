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
//    private contenido;
//    private padre = null;
  
    constructor (nb,campo) {
        this._nb = nb;
        this._titulo = campo.titulo || nb;
        this._tipo = typeof campo === "string" ? campo : campo instanceof Array ? "combo" : campo.tipo || campo.type || "text";
        this._original  = campo.original;
        this._contenido = "";
        this._obligatorio = campo.obligatorio || campo.required;
        this._match = campo instanceof Array ? campo : campo.match;
        this._validador = campo.validador;
        this._Err = "";
    }

    valida(valor) {
        let _err = "";
        if (empty(valor)) {
            if (this.obligatorio) {
                _err = (this.tipo === "combo" ? "Escoja un valor de la lista" : "Este campo es requerido");
            }
        } else {
            // Chequea el formato de los datos
            if (this.match) {
                if (gettype(this.match) != "array") {
                    // Filtros posibles de implementar: http://php.net/manual/es/filter.filters.validate.php
                    switch (this.match) {
                        case "correo":
                            if (!filter_var(valor, FILTER_VALIDATE_EMAIL)) { _err = "Formato de correo inválido"; }
                            break;
                        case "url":
                            if (!filter_var(valor, FILTER_VALIDATE_URL)) { _err = "Dirección inválida"; }
                            break;
                        default:
                            if (!preg_match(this.match,valor)) { _err = "VALOR INVÁLIDO";}
                    }
                }
            }
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
        original = this.contenido;
        if (valor !== null) {
            if (!this.valida(valor)) {
                this.contenido = original;
                msj = `No es posible asignar el valor valor a ${this.titulo} <br/>(${this._Err})`;
                alert(msj);
            }
        }
        return this.contenido;
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

function rogReValidador(campos) {
    
}
