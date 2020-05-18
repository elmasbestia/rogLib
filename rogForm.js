// Crea un Formulario a parte de una estructura dada

var _frm, _stru, _url, _metodo;

var _cancela = () => moveCorresponding(_stru, _frm);
var _agrega  = () => moveCorresponding(regVacio(_stru), _frm);

var _fn = (datos) => console.log("Lectura perdida:", datos);

class rogForm {
    constructor (dom, Stru) {
        _stru = Stru;

        _frm = document.createElement("FORM");
        _frm.className = "rogForm";
        
        objDom(dom).appendChild(_frm);
  
        _frm.addEventListener('submit', event => {
            // submit event detected
            event.preventDefault();
            this.lee();
        })
    
        _frm.innerHTML = _stru.reduce((form,x) => form += rogInput(x),"");
            
        _frm.appendChild(creaBtns(_frm))
        
        //btnDefault(_frm,"btnLee")
    }
    
    set datos(buffer) {
        moveCorresponding(buffer,_frm);
    }
    
    get datos() {
        let buffer = {};
        let elementos = _frm.elements;
        let leido =  _stru instanceof Array ?
            (x) => elementos[x._nb] :
            (x) => elementos[x];
        desarma(_stru).forEach(x => {
            let _campo = leido(x);
            if(_campo) buffer[_campo.name] = _campo.value;
        });

        return buffer;
    }
    
    get elements() {
        return _frm.elements
    }
    
    set validador({metodo, url}) {
        _url = url;
        _metodo = metodo;
    }
    
    get validador() {
        return { metodo: _metodo, url: _url }
    }
    
    set alLeer(fn) {
        _fn = fn;
    }
    
    get alLeer() {
        return _fn;
    }
    
    lee () { procede(this.datos,this) }

    get cancela () { return _cancela };
    
    set cancela(fn) { _cancela = fn };
    
    get agrega() { return _agrega }
    
    set agrega (fn) { _agrega = fn };
    
    get errores () {
        let _e = {};
        Array.from(_frm.elements).forEach(x => {
            if(x.className === "error") _e[x.for] = x;
        });
        return _e;
    }
}

function rogInput(Stru) {
    /*
    Retorna el innerHTML de un elemento de tipo rogCampo
    */

    txt = `<label for='${Stru.nb}'>${Stru.titulo} :</label>`;
    switch (Stru.tipo) {
        case "radio":
            txt += radioBtn(Stru.match,Stru.nb,Stru.valor);
            break;
        case "memo":
            txt += `<textarea name='${Stru.titulo}' rows='5' cols='40'>${Stru.valor}</textarea>`;
            break;
        case "combo":
            txt += Combo(Stru.nb,Stru.match);
            break;
        case "tabla":
            txt += tabla(Stru.match);
            break;
        case "date":
//            txt += `<input type='date' name='${Stru.nb}' value='${date("Y-m-d",Stru.valor)}'`  +(Stru.obligatorio ? " required" : "") +"/>";
            txt += `<input type='date' name='${Stru.nb}' value='${Stru.valor}'`  +(Stru.obligatorio ? " required" : "") +"/>";
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
            txt += `<input type='number' name='${Stru.nb}' value='${Stru.valor}'` +(Stru.obligatorio ? " required" : "") +"/>";            
            break;
        default:
            txt += `<input type='${Stru.tipo || "text"}' name='${Stru.nb}' value='${Stru.valor}'` +(Stru.obligatorio ? " required" : "") +"/>";
    }

    txt += `<span for='${Stru.nb}' class='error'>` +(Stru.obligatorio ? "*" : "") +` ${Stru.Err || ""}</span>`;
    txt += "<br><br>";
    return txt;
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

function moveCorresponding(de,a) {
    /*
    Mueve elementos de un FORM a un obbjeto o viceversa
    @param de y @param a son el objeto y el formulario o su id
    */
    let elementos = objDom(a) && objDom(a).elements;
    
    if(elementos) {         // De datos a form
        let valores = rogValores(de);
        let n = elementos.length;
        for (let i = 0; i < n ;i++) {
            let campo = elementos[i]
            let nbCampo = campo.name;
            if (nbCampo) {
                if(campo.type === "radio") campo.checked = (campo.value === valores[nbCampo]);
                else if(elementos[i].type === "checkbox") {
                        elementos[i].checked = valores[nbCampo];
                     } else elementos[i].value = valores[nbCampo];
            }
        }
    } else {                // De form a datos
        elementos = objDom(de).elements;
        valores = rogValores(a);
        
        let n = elementos.length;
        for (let i = 0; i < n ;i++) {
            let nbCampo = elementos[i].name;
            if (nbCampo) {
                if(elementos[i].type === "radio") {
                    if(elementos[i].checked ) valores[nbCampo] = elementos[i].value;
                } else if(elementos[i].type === "checkbox") {
                    valores[nbCampo] = elementos[i].checked;
                } else valores[nbCampo] = elementos[i].value;
            }
        };
    }
}

function creaBtns(frm) {
    /*
    Crea los botones básicos de la planilla:
    lee, cancela y agrega
    */
    let _botones  = document.createElement("NAV");
  
    _botones.appendChild(creaSubmit("✔"))
    _botones.appendChild(creaBtn("✘","rogBtn",_cancela));
    _botones.appendChild(creaBtn("&#x2795","rogBtn",_agrega));
    
    return _botones;
}

function creaBtn(etq,clase,atribs,txt) {
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
    _btn.className=clase;

    if(atribs instanceof Function) _btn.onclick = atribs;
    else for(let atrib in atribs) _btn[atrib] = atribs[atrib];
    
    return txt ? _btn.outerHTML : _btn;
}

function creaSubmit(txt = "Dale!", url) {
    _btn = document.createElement("INPUT");
    _btn.type = "SUBMIT";
    _btn.value = txt;
    _btn.formAction = url;
    return _btn;
}

// Procesos

function creaFormulario(dom, Stru, opcs) {
    let _frm = new rogForm(dom,Stru);
    
    for(opc in opcs) _frm[opc] = opcs[opc];
    
    return _frm;
}

function validaFormulario(formulario) {
    return Object.array(objDom(formulario).elements).reduce((fino,x) => fino && Stru[x.name].valida(), true)
}
        
function procede(datos,frm) {
    if(frm.validador.url) accede(
        frm.validador.metodo,frm.validador.url,
        datos => respuestaValidacion(datos,frm),
        datos
    );
    else frm.alLeer(datos);
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