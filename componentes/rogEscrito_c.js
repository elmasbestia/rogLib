const _rogEscrito = {
    observados: ["value","divisas"],

    cambia: {},

    mntEscrito: valor => {
        if(!valor) return "";

        const cadena = typeof valor === "string" ?
            valor : valor.toString();
        
        const [entero, centimos] = cadena.split(".");

        const trios = entero.slice(-3);

        let retorno = cadena;
        return retorno;
    },

    magnitudes: [
        [
            ["cero","uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince"],
            "diec",
            "veint",
            "treint",
            "cuarent",
            "cincuent",
            "sesent",
            "ochent",
            "novent"
        ],
        [
            "cien",
            "doscien",
            "trescien",
            "cuatrocien",
            "quinien",
            "seiscien",
            "setecien",
            "ochocien",
            "novecien"
        ],
        [
            "mil",
            "millones"
        ]
    ]
        
}

class rogEscrito extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });  
    }

    get name() {
        return this.getAttribute("name");
    }

    set value(valor) {
        this.setAttribute("value",valor)
    }
    get value() {
        return this.getAttribute("value");
    }

    set divisas(valor) {
        if(valor) this.setAttribute("divisas",valor);
        else this.removeAttribute("divisas");
    }

    get divisas() {
        return this.getAttribute("divisas")
    }

    escrito(valor = this.value,divisas = this.divisas) {
        return NumeroALetras(valor, divisas);
//        return _rogEscrito.mntEscrito(valor);
    }

    connectedCallback() {
        this.render();
    }
  
    render() {
        this.shadow.innerHTML = tmpROGEscrito(this);
    }
    
    static get observedAttributes() {
        return _rogEscrito.observados;
    }
    
    attributeChangedCallback(att, viejo, nuevo) {
        if (_rogEscrito.cambia[att]) _rogEscrito.cambia[att](this, viejo, nuevo);
        this.render();
    }
}
  
customElements.define("rog-escrito", rogEscrito);

function tmpROGEscrito(obj) {
    return `<style>
            .mntEscrito {
                font-weight: bolder;
            }
        </style>
        <span class="mntEscrito">${obj.escrito()}</span>`;
}

// divisas

/*************************************************************/
// NumeroALetras
// The MIT License (MIT)
// 
// Copyright (c) 2015 Luis Alfredo Chee 
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 
// @author Rodolfo Carmona
// @contributor Jean (jpbadoino@gmail.com)
/*************************************************************/
function Unidades(num){

    return [
        "",
        "UN",
        "DOS",
        "TRES",
        "CUATRO",
        "CINCO",
        "SEIS",
        "SIETE",
        "OCHO",
        "NUEVE",
    ][num]
}//Unidades()

function Decenas(num){

    const decena = Math.floor(num/10);
    const unidad = num - (decena * 10);

    switch(decena)
    {
        case 1:
            switch(unidad)
            {
                case 0: return "DIEZ";
                case 1: return "ONCE";
                case 2: return "DOCE";
                case 3: return "TRECE";
                case 4: return "CATORCE";
                case 5: return "QUINCE";
                default: return "DIECI" + Unidades(unidad);
            }
        case 2:
            switch(unidad)
            {
                case 0: return "VEINTE";
                default: return "VEINTI" + Unidades(unidad);
            }
        case 3: return DecenasY("TREINTA", unidad);
        case 4: return DecenasY("CUARENTA", unidad);
        case 5: return DecenasY("CINCUENTA", unidad);
        case 6: return DecenasY("SESENTA", unidad);
        case 7: return DecenasY("SETENTA", unidad);
        case 8: return DecenasY("OCHENTA", unidad);
        case 9: return DecenasY("NOVENTA", unidad);
        case 0: return Unidades(unidad);
    }
}//Unidades()

function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
    return strSin + " Y " + Unidades(numUnidades)

    return strSin;
}//DecenasY()

function Centenas(num) {
    const centenas = Math.floor(num / 100);
    const decenas = num - (centenas * 100);

    switch(centenas)
    {
        case 1:
            if (decenas > 0)
                return "CIENTO " + Decenas(decenas);
            return "CIEN";
        case 2: return "DOSCIENTOS " + Decenas(decenas);
        case 3: return "TRESCIENTOS " + Decenas(decenas);
        case 4: return "CUATROCIENTOS " + Decenas(decenas);
        case 5: return "QUINIENTOS " + Decenas(decenas);
        case 6: return "SEISCIENTOS " + Decenas(decenas);
        case 7: return "SETECIENTOS " + Decenas(decenas);
        case 8: return "OCHOCIENTOS " + Decenas(decenas);
        case 9: return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
}//Centenas()

function Seccion(num, divisor, strSingular, strPlural) {
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    letras = "";

    if (cientos > 0)
        if (cientos > 1)
            letras = Centenas(cientos) + " " + strPlural;
        else
            letras = strSingular;

    if (resto > 0)
        letras += "";

    return letras;
}//Seccion()

function Miles(num) {
    divisor = 1000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMiles = Seccion(num, divisor, "UN MIL", "MIL");
    strCentenas = Centenas(resto);

    if(strMiles == "")
        return strCentenas;

    return strMiles + " " + strCentenas;
}//Miles()

function Millones(num) {
    divisor = 1000000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
    strMiles = Miles(resto);

    if(strMillones == "")
        return strMiles;

    return strMillones + " " + strMiles;
}//Millones()

function NumeroALetras(num,divisa) {
    var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: "",
        letrasMonedaPlural: divisa ? 'US$' : 'Bolivares',
        letrasMonedaSingular: divisa ? 'US$' : 'Bolivar',

        letrasMonedaCentavoPlural: "Centimos",
        letrasMonedaCentavoSingular: "Centimo"
    };

    if (data.centavos > 0) {
        data.letrasCentavos = "CON " + (function (){
            if (data.centavos == 1)
                return Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
            else
                return Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
            })();
    };

    if(data.enteros == 0)
        return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
        return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
    else
        return Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
}//NumeroALetras()