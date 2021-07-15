'use strict'

module.exports = (nbColor) => new colorcito(nbColor);

const colores = {
        alicia:  {  colour: "aliceblue", rgb: [240, 248, 255]},
        blancoviejo:  {  colour: "antiquewhite", rgb: [250, 235, 215]},
        agua:  {  colour: "aqua", rgb: [0, 255, 255]},
        aguamarina:  {  colour: "aquamarine", rgb: [127, 255, 212]},
        azur:  {  colour: "azure", rgb: [240, 255, 255]},
        beige:  {  colour: "beige", rgb: [245, 245, 220]},
        bisque:  {  colour: "bisque", rgb: [255, 228, 196]},
        negro:  {  colour: "black", rgb: [0, 0, 0]},
        almendra:  {  colour: "blanchedalmond", rgb: [255, 235, 205]},
        azul:  {  colour: "blue", rgb: [0, 0, 255]},
        azulprofundo:  {  colour: "blueviolet", rgb: [138, 43, 226]},
        marron:  {  colour: "brown", rgb: [165, 42, 42]},
        madera:  {  colour: "burlywood", rgb: [222, 184, 135]},
        azulgris:  {  colour: "cadetblue", rgb: [95, 158, 160]},
        verdeelectrico:  {  colour: "chartreuse", rgb: [127, 255, 0]},
        chocolate:  {  colour: "chocolate", rgb: [210, 105, 30]},
        coral:  {  colour: "coral", rgb: [255, 127, 80]},
        azulmaiz:  {  colour: "cornflowerblue", rgb: [100, 149, 237]},
        seda:  {  colour: "cornsilk", rgb: [255, 248, 220]},
        carmesi:  {  colour: "crimson", rgb: [220, 20, 60]},
        cian:  {  colour: "cyan", rgb: [0, 255, 255]},
        azuloscuro:  {  colour: "darkblue", rgb: [0, 0, 139]},
        cianoscuro:  {  colour: "darkcyan", rgb: [0, 139, 139]},
        oroviejo:  {  colour: "darkgoldenrod", rgb: [184, 134, 11]},
        grisoscuro:  {  colour: "darkgray", rgb: [169, 169, 169]},
        verdeoscuro:  {  colour: "darkgreen", rgb: [0, 100, 0]},
        grisfuerte:  {  colour: "darkgrey", rgb: [169, 169, 169]},
        kakioscuro:  {  colour: "darkkhaki", rgb: [189, 183, 107]},
        magentaoscuro:  {  colour: "darkmagenta", rgb: [139, 0, 139]},
        olivaoscuro:  {  colour: "darkolivegreen", rgb: [85, 107, 47]},
        naranjaoscuro:  {  colour: "darkorange", rgb: [255, 140, 0]},
        orquideaoscuro:  {  colour: "darkorchid", rgb: [153, 50, 204]},
        rojooscuro:  {  colour: "darkred", rgb: [139, 0, 0]},
        salmonoscuro:  {  colour: "darksalmon", rgb: [233, 150, 122]},
        verdemaroscuro:  {  colour: "darkseagreen", rgb: [143, 188, 143]},
        azulpizarraoscuro:  {  colour: "darkslateblue", rgb: [72, 61, 139]},
        pizarraoscuro:  {  colour: "darkslategray", rgb: [47, 79, 79]},
        pizarraoscura:  {  colour: "darkslategrey", rgb: [47, 79, 79]},
        turquesaoscuro:  {  colour: "darkturquoise", rgb: [0, 206, 209]},
        violetaoscuro:  {  colour: "darkviolet", rgb: [148, 0, 211]},
        rosadooscuro:  {  colour: "deeppink", rgb: [255, 20, 147]},
        azulcielooscuro:  {  colour: "deepskyblue", rgb: [0, 191, 255]},
        gristenue:  {  colour: "dimgray", rgb: [105, 105, 105]},
        grisclaro:  {  colour: "dimgrey", rgb: [105, 105, 105]},
        azulelectrico:  {  colour: "dodgerblue", rgb: [30, 144, 255]},
        ladrillo:  {  colour: "firebrick", rgb: [178, 34, 34]},
        blancoflor:  {  colour: "floralwhite", rgb: [255, 250, 240]},
        bosque:  {  colour: "forestgreen", rgb: [34, 139, 34]},
        fucsia:  {  colour: "fuchsia", rgb: [255, 0, 255]},
        blancogainsboro:  {  colour: "gainsboro", rgb: [220, 220, 220]},
        fantasma:  {  colour: "ghostwhite", rgb: [248, 248, 255]},
        dorado:  {  colour: "gold", rgb: [255, 215, 0]},
        oro:  {  colour: "goldenrod", rgb: [218, 165, 32]},
        gris:  {  colour: "gray", rgb: [128, 128, 128]},
        verde:  {  colour: "green", rgb: [0, 128, 0]},
        verdoso:  {  colour: "greenyellow", rgb: [173, 255, 47]},
        grisaceo:  {  colour: "grey", rgb: [128, 128, 128]},
        miel:  {  colour: "honeydew", rgb: [240, 255, 240]},
        rosa:  {  colour: "hotpink", rgb: [255, 105, 180]},
        apache:  {  colour: "indianred", rgb: [205, 92, 92]},
        indigo:  {  colour: "indigo", rgb: [75, 0, 130]},
        marfil:  {  colour: "ivory", rgb: [255, 255, 240]},
        kaki:  {  colour: "khaki", rgb: [240, 230, 140]},
        lavanda:  {  colour: "lavender", rgb: [230, 230, 250]},
        lavanda2:  {  colour: "lavenderblush", rgb: [255, 240, 245]},
        verdegrama:  {  colour: "lawngreen", rgb: [124, 252, 0]},
        limon:  {  colour: "lemonchiffon", rgb: [255, 250, 205]},
        azulclaro:  {  colour: "lightblue", rgb: [173, 216, 230]},
        coralclaro:  {  colour: "lightcoral", rgb: [240, 128, 128]},
        cianclaro:  {  colour: "lightcyan", rgb: [224, 255, 255]},
        oroclaro:  {  colour: "lightgoldenrodyellow", rgb: [250, 250, 210]},
        gristenue:  {  colour: "lightgray", rgb: [211, 211, 211]},
        verdeclaro:  {  colour: "lightgreen", rgb: [144, 238, 144]},
        grisclaro:  {  colour: "lightgrey", rgb: [211, 211, 211]},
        rosadoclaro:  {  colour: "lightpink", rgb: [255, 182, 193]},
        salmonclaro:  {  colour: "lightsalmon", rgb: [255, 160, 122]},
        verdemarclaro:  {  colour: "lightseagreen", rgb: [32, 178, 170]},
        celesteclaro:  {  colour: "lightskyblue", rgb: [135, 206, 250]},
        pizarraclaro:  {  colour: "lightslategray", rgb: [119, 136, 153]},
        pizarraclara:  {  colour: "lightslategrey", rgb: [119, 136, 153]},
        aceroclaro:  {  colour: "lightsteelblue", rgb: [176, 196, 222]},
        amarilloclaro:  {  colour: "lightyellow", rgb: [255, 255, 224]},
        lima:  {  colour: "lime", rgb: [0, 255, 0]},
        verdelima:  {  colour: "limegreen", rgb: [50, 205, 50]},
        lino:  {  colour: "linen", rgb: [250, 240, 230]},
        magenta:  {  colour: "magenta", rgb: [255, 0, 255]},
        marron2:  {  colour: "maroon", rgb: [128, 0, 0]},
        aguamarinamedio:  {  colour: "mediumaquamarine", rgb: [102, 205, 170]},
        azulmedio:  {  colour: "mediumblue", rgb: [0, 0, 205]},
        orquideamedio:  {  colour: "mediumorchid", rgb: [186, 85, 211]},
        purpuramedio:  {  colour: "mediumpurple", rgb: [147, 112, 219]},
        verdemarmedio:  {  colour: "mediumseagreen", rgb: [60, 179, 113]},
        azulpizarramedio:  {  colour: "mediumslateblue", rgb: [123, 104, 238]},
        verdeprimavera:  {  colour: "mediumspringgreen", rgb: [0, 250, 154]},
        turquesamedio:  {  colour: "mediumturquoise", rgb: [72, 209, 204]},
        violetamedio:  {  colour: "mediumvioletred", rgb: [199, 21, 133]},
        medianoche:  {  colour: "midnightblue", rgb: [25, 25, 112]},
        cremadementa:  {  colour: "mintcream", rgb: [245, 255, 250]},
        rosaviejo:  {  colour: "mistyrose", rgb: [255, 228, 225]},
        mocasin:  {  colour: "moccasin", rgb: [255, 228, 181]},
        navajo:  {  colour: "navajowhite", rgb: [255, 222, 173]},
        azulmarino:  {  colour: "navy", rgb: [0, 0, 128]},
        palido:  {  colour: "oldlace", rgb: [253, 245, 230]},
        oliva:  {  colour: "olive", rgb: [128, 128, 0]},
        oliva1:  {  colour: "olivedrab", rgb: [107, 142, 35]},
        naranja:  {  colour: "orange", rgb: [255, 165, 0]},
        anaranjado:  {  colour: "orangered", rgb: [255, 69, 0]},
        orquidea:  {  colour: "orchid", rgb: [218, 112, 214]},
        oropalido:  {  colour: "palegoldenrod", rgb: [238, 232, 170]},
        verdepalido:  {  colour: "palegreen", rgb: [152, 251, 152]},
        turquesapalido:  {  colour: "paleturquoise", rgb: [175, 238, 238]},
        violetapalido:  {  colour: "palevioletred", rgb: [219, 112, 147]},
        papaya:  {  colour: "papayawhip", rgb: [255, 239, 213]},
        durazno:  {  colour: "peachpuff", rgb: [255, 218, 185]},
        peru:  {  colour: "peru", rgb: [205, 133, 63]},
        rosado:  {  colour: "pink", rgb: [255, 192, 203]},
        ciruela:  {  colour: "plum", rgb: [221, 160, 221]},
        azulpalido:  {  colour: "powderblue", rgb: [176, 224, 230]},
        purpura:  {  colour: "purple", rgb: [128, 0, 128]},
        rebeca:  {  colour: "rebeccapurple", rgb: [102, 51, 153]},
        rojo:  {  colour: "red", rgb: [255, 0, 0]},
        rosaceo:  {  colour: "rosybrown", rgb: [188, 143, 143]},
        azulreal:  {  colour: "royalblue", rgb: [65, 105, 225]},
        marron3:  {  colour: "saddlebrown", rgb: [139, 69, 19]},
        salmon:  {  colour: "salmon", rgb: [250, 128, 114]},
        arena:  {  colour: "sandybrown", rgb: [244, 164, 96]},
        verdemar:  {  colour: "seagreen", rgb: [46, 139, 87]},
        concha:  {  colour: "seashell", rgb: [255, 245, 238]},
        siena:  {  colour: "sienna", rgb: [160, 82, 45]},
        plata:  {  colour: "silver", rgb: [192, 192, 192]},
        celeste:  {  colour: "skyblue", rgb: [135, 206, 235]},
        azulpizarra:  {  colour: "slateblue", rgb: [106, 90, 205]},
        pizarra:  {  colour: "slategray", rgb: [112, 128, 144]},
        grispizarra:  {  colour: "slategrey", rgb: [112, 128, 144]},
        nieve:  {  colour: "snow", rgb: [255, 250, 250]},
        verdeprimavera:  {  colour: "springgreen", rgb: [0, 255, 127]},
        acero:  {  colour: "steelblue", rgb: [70, 130, 180]},
        tostado:  {  colour: "tan", rgb: [210, 180, 140]},
        tilo:  {  colour: "teal", rgb: [0, 128, 128]},
        cardo:  {  colour: "thistle", rgb: [216, 191, 216]},
        tomate:  {  colour: "tomato", rgb: [255, 99, 71]},
        turquesa:  {  colour: "turquoise", rgb: [64, 224, 208]},
        violeta:  {  colour: "violet", rgb: [238, 130, 238]},
        trigo:  {  colour: "wheat", rgb: [245, 222, 179]},
        blanco:  {  colour: "white", rgb: [255, 255, 255]},
        blancohumo:  {  colour: "whitesmoke", rgb: [245, 245, 245]},
        amarillo:  {  colour: "yellow", rgb: [255, 255, 0]},
        amarilloverdoso:  {  colour: "yellowgreen", rgb: [154, 205, 50]}
};

function separa(etiqueta) {
    let _etiquetas = [etiqueta]
    let separadores = ["/",","]

    separadores.forEach(separador => {
        if(etiqueta.indexOf(separador) > 0) _etiquetas = _etiquetas[0].split(separador);
    })
    
    return _etiquetas;
}

const dd = (num) => (num > 15 ? "" : "0") +num.toString(16);

class colorcito {
    constructor(etiqueta) {
        this.colores = separa(etiqueta).map(x =>{
            let _trad = this.tradColor(x);
            return {
                nombre: x,
                colour: _trad.colour,
                hexa:   _trad.colour ? this.hexa(_trad.rgb) : null,
                dom:    this.domColor(_trad)
            }
        })
    }

    get dom() {
        return this.colores.map(x => x.dom).join(" ")
    }

    tradColor(valor) {
        return { nombre: valor, ...(colores[valor.replace(/\s+/g, '').toLowerCase()] || { colour: null })}
    }
    
    hexa(rgb) {
        return "#" +rgb.map(dd).join("")
    }
    
    domColor(valor) {
        let _color = typeof valor === "string" ? this.tradColor(valor) : valor;
        return  _color.colour ?
            `<input type='color' value= ${this.hexa(_color.rgb)}>` :
            `<span>Error (${_color.nombre})</span>`
    }
}
