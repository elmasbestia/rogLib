/*
    Objeto para manejar Facturas
*/

class rogFact {
    constructor(dom,fn,fnTotal) {
        this.w = {};
        this.dom = dom;

        this.vnt = new rogVntBlq ({
            clase: "factura",
            titulo: "Esta venta",
            boton: this.btn,
            visible: false
            },
            {
            tabla: true,
            nb: "Artículos",
            titulo: "Articulos",
            stru: "Cant, Descripcion, Precio",
            Fn: {Cant: incrementa},
            lee: this.leeArticulo
            }
        );
    }

    set dom (dom) {
        this.w.dom = dom ? objDom(dom) : document.createElement("DIV");
        this.dom.innerHTML = tmpFact();
        this.creaCtl();
        this.btn = this.dom.querySelector(".btnFact");
    }

    get dom () {
        return this.w.dom;
    }

    set datos(datos) {
        this.vnt.blq.datos = datos;
    }

    get datos() {
        return this.vnt.blq.datos;
    }

    get divisa() {
        return this.ctl.divisa.value;
    }

    leeCambio(e) { 
        this.cambio = this.ctl.cambio.value;
        calctotal();
    }

    agregaArticulo(art) {
        this.datos.push(art);
        this.leeArticulo();
    }

    leeArticulo(evento) {
        calctotal();
    }

    calcTotal() {
        this.total = this.datos.reduce((total, art) => total += (art.Cant*art.Precio),0);
        this.mstTotal();
    }

    mstTotal() {
        this.ctl.total.value = this.divisa === "lola" ? this.total : this.total *this.cambio;
    }

    creaCtl() {
        this.ctl = {
            cambio: this.dom.querySelector("[name=cambio]"),
            divisa: this.dom.querySelector("[name=divisa]"),

            total: this.dom.querySelector("#total"),
            totProducto: this.dom.querySelector("#totProducto"),
            totLola: this.dom.querySelector("#totLola")
        }
    }
}

function tmpFact() {
    return `<nav id="ctlFact">
        <button class="mnuOpc rogBtn"><i class="fas fa-cash-register"></i></button>
        <button class="btnFact mnuOpc rogBtn">
            <span><i class="fas fa-eye"></i></span>
            <span><i class="fas fa-eye-slash"></i></span>
        </button>
        <label for="cambio">Cambio:</label><br />
        <input type="text" id="cambio" oninput="leeCambio()" />
    </nav>
    <div class="divTotal">
        <select id="divisa">
            <option value="lola">$</option>
            <option value="bolos">Bs</option>
        </select>
        <input type="text" id="total" readonly tabindex="-1"/>
    </div>`
}

function creaCSS() {
    let reglas = {
        "#btnFact span" : {display: none},
        "#btnFact span.activa": {display: unset}
    }
}

function incrementa(e) {
    let valor = e.target.value;
    e.target.value= ++e.target.value;
}
