/*
    Objeto "buscador"
    
    Presenta una lista con las opciones de búsqueda, un texto para especificar valores de búsqueda y el botón correspondiente
    
    @param dom es el elemento donde se inserta el objeto
    @param opciones es un arreglo de:
        Una cadena de caracteres que se muestra como opción y se envía a la función
        o
        Un objeto con:
            txt:   el texto de la opción
            valor: lo que se pasa a la función (Si se omite, se usa txt)
            sinValBsq: Si es verdadero, esta opción no necesita un valor de búsqueda.
            fn:    Una función que retorne una lista de valores para la opción
            
    @param fn es la función que se ejecuta para buscar. Recibe los argumentos "que" y "valor"
    
    Además permite mostrar un mensaje a través del método "Espera" (Normalmente de un proceso en ejecución)
*/

class rogBsq {
    #dom;
    #opciones;
    constructor (dom, opciones, fn) {
        this.opciones = opciones;
        this.dom = dom;
        this.fn = fn;

        this.iniEle();
    }

    set dom(dom) {
        this.#dom = objDom(dom);
        this.dom.classList.add("rogBsq");
        this.dom.innerHTML = tmpBsq(this);
    }

    get dom() {
        return this.#dom;
    }

    set que(valor) {
        this.opc.value = valor;
        this.iniOpc(valor);
    }

    get que() {
        return this.opc.value;
    }

    set valor(valor) {
        this.val.value = valor;
        this.btn.disabled = !Boolean(this.sinValor || this.valor);
    }

    get valor() {
        return this.val.value;
    }

    get sinValor() {
        return this.opcion.sinValBsq;
    }

    get query() {
        return jeto(this.que, this.valor);
    }

    /**
     * 1. Crea las propiedades
     *      1. @property {element} btn Botón 
     *      2. @property {element} val Valor de búsqueda
     *      3. @property {element} cmb Combo de opciones para Valor
     *      4. @property {element} opc Combo de opciones de búsqueda
     * 
     * 2. Prepara los "trigger" de la UI
     * 
     * 3. Inicializa los valores según el valor del combo de opciones
     */
    iniEle() {
        this.btn = this.dom.querySelector("#btnBsq");
        this.btn.onclick = this.click.bind(this);
        // this.btn.onmouseover = () => this.dom.classList.add("activa");
        
        const cmbs = this.dom.querySelectorAll("SELECT");

        this.opc = cmbs[0];
        this.opc.oninput = this.chxOpc.bind(this);
        
        this.cmb = cmbs[1];
        this.cmb.oninput = this.chxCmb.bind(this);

        this.val = this.dom.querySelector("INPUT");
        btnDefault(this.val,this.btn, this.actVal.bind(this));

        this.que = this.opc.value;
    }

    mstCmb(valor) {
        if(valor) {
            this.cmb.style.display = "block";
            this.val.style.display = "none";
            this.cmb.focus()
        } else {
            this.cmb.style.display = "none";
            this.val.style.display = "block";
            this.val.focus();
        }
    }

    set opciones(opciones) {
        this.#opciones = opciones.map(x => {
            const opcion = {};
    
            if (typeof x === "string") {
                opcion.valor = x;
                opcion.texto = x;
                opcion.tipo  = "text";
            } else {
                opcion.valor = x.valor || x.txt;
                opcion.texto = x.txt || x.valor;
                opcion.tipo  = x.tipo || "text";
                opcion.sinValBsq = x.sinValBsq;
                if(x.fn) opcion.fn = x.fn
            }
        
            return opcion;   
        });
    }

    get opciones() {
        return this.#opciones.map(x => `<option ${x.valor === x.texto ? "" : `value='${x.valor}'`}>${x.texto}</option>`).join(""); 
    }

    get opcion() {
        return this.#opciones.find(x => x.valor === this.que)
    }

    click() {
        if(!this.btn.disabled) this.fn(this.que, this.valor);
    }

    iniOpc (valor) {
        const opcion = this.opcion;
        this.val.type = opcion.tipo;
        if(opcion.fn) this.iniCmb(opcion.fn())
        this.mstCmb(opcion.fn)
        if(opcion.sinValBsq) {
            this.btn.disabled = false;
            this.click();
        } else this.btn.disabled = !Boolean(this.valor);

        return opcion;
    }

    chxOpc (e) {
        this.que = e.target.value;
    }

    iniCmb(valores) {
        this.cmb.innerHTML = valores.map(x => `<option>${x}</option>`,"").join("");
        this.valor = this.cmb.value;
    }

    chxCmb(event) {
        this.valor = this.cmb.value;
        this.click();
    }

    actVal() {
        return Boolean(this.valor);
    }
}

function tmpBsq(obj) {
	return `<div style="display: flex; justify-content: flex-end">
        <div class="rogBtn">
            <select>
                ${obj.opciones}
            </select>
            <input id="valBsq">
            <select></select>
        </div>

        <button id="btnBsq" class="rogBtn">
          <i class="fa fa-search"></i>
        </button>
    </div>`;
}

function f1Opciones() {
    return `
        Opciones de búsqueda:
        La Búsqueda funciona sobre la base de un tipo y un valor (Opcional)
        El tipo se muestra en un combo y el valor se tipea o escoge de un combo

        a. cadena de caracteres

        b. Objeto:
            1. valor     {string}   Identificador de la opción (Tipo)
            2. txt       {string}   Texto a mostrarse (Por defecto: valor)
            3. tipo      {string}   Tipo del Valor (Según @element INPUT)
            4. sinValBsq {Boolean}  Si la opción no necesita un Valor
            5. fn        {Function} Función que devuelve los valores válidos (Opcional)

        La función que se envía como argumento al Objeto rogBsq recibe el tipo y el valor.
        Esta función toma el mando a partir de la UI`;
}