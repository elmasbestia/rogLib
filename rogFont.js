/* Objeto para manipular Tipografía */

        const fuentes = [
            'Arial',
            'Arial Black',
            'Book Antiqua',
            'Bookman Old Style', 
            'Calculator',
            'Charcoal',
            'Comic Sans MS', 
            'Courier', 
            'Courier New', 
            'Gadget',
            'Garamond',
            'Geneva', 
            'Georgia',    
            'Helvetica',
            'Impact',     
            'Lucida Console', 
            'Lucida Sans Unicode',
            'Lucida Grande', 
            'Monaco',
            'MS Sans Serif',
            'MS Serif',
            'New York',
            'Obelix',
            'Open 24 Display St',
            'Palatino',
            'Palatino Linotype',
            'Symbol',     
            'Tahoma',
            'Times',
            'Times New Roman',    
            'Trebuchet MS',
            'Verdana',
            'Webdings',     
            'Wingdings',
            'Zapf Dingbats'
       ];

class rogFont {
    constructor(props) {
        this.w = {
            css: {
                "font-family": "Raleway",
                "font-size": "36px",
                "font-style": "normal",
                "font-weight": 400,
                "letter-spacing": "0",

                "background-color": '#030303',
                color: '#f3f3f3'
            }
        };

        this.css = props.css;
    }

    set css(valores = {}) {
        for(valor in valores) this.w.css[valor] = valores[valor];
    }

    get css() {
        return this.w.css;
    }

    get value() {
        return JSON.stringify(this.css);
    }

    mst() {
        if (!this.vnt) this.vnt = new rogVnt({
            
        })
        this.vnt.mst();
    }
}       

        
function cambia() {
    texto.innerHTML = txtTexto.value
    campos.forEach(x => texto.style[x.name] = x.value);
}

function tmpFonts() {
    return `<header>
    <div class="marco">
        <p id="texto"></p>
    </div>
</header>

<form oninput="cambia()">
    
    <label for="txtTexto">Texto: </label>
    <input type="text" id='txtTexto' placeholder='Texto de Prueba'><br><br>
    <datalist id="fuentes"></datalist>
   
    <label for="font-family">Fuente: </label>
    <a href="https://fonts.google.com" target="_blank">font-family: </a>
    <input type="text" name="font-family" list="fuentes"><br>
    
    <label for="font-size">Tamaño: </label>
    font-size: <input type="text" name="font-size"><br>

    <label for="font-style">Estilo: </label>
    <a href="https://www.w3schools.com/cssref/pr_font_font-style.asp" target="_blank">font-style: </a>
    <input type="text" name="font-style" list="style"><br>
    <datalist id="style">
        <option>normal
        <option>italic
        <option>oblique
        <option>initial
        <option>inherit
    </datalist>

    <label for="font-weight">Volumen: </label>
    <a href="https://www.w3schools.com/cssref/pr_font_weight.asp" target="_blank">font-weight: </a>
    <input type="text" name="font-weight" list="weight"><br>
    <datalist id= "weight">
        <option>normal
        <option>bold
        <option>bolder
        <option>lighter
        <option>100
        <option>200
        <option>300
        <option>400
        <option>500
        <option>600
        <option>700
        <option>800
        <option>900
        <option>initial
        <option>inherit
    </datalist>

    <label for="letter-spacing">Espaciado: </label>
    letter-spacing: <input type="text" name="letter-spacing"><br>

    <label for="background-color">Color Fondo: </label>
    <input type="color" name="background-color"><br>
    <label for="color">Color Texto: </label>
    <input type="color" name="color">
</form>
`}