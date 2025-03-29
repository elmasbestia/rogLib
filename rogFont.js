/* Objeto para manipular Tipografía */

const fuentes = [
    "Arial",
    "Arial Black",
    "Book Antiqua",
    "Bookman Old Style",
    "Calculator",
    "Charcoal",
    "Comic Sans MS",
    "Courier",
    "Courier New",
    "Gadget",
    "Garamond",
    "Geneva",
    "Georgia",
    "Helvetica",
    "Impact",
    "Lucida Console",
    "Lucida Sans Unicode",
    "Lucida Grande",
    "Monaco",
    "MS Sans Serif",
    "MS Serif",
    "New York",
    "Obelix",
    "Open 24 Display St",
    "Palatino",
    "Palatino Linotype",
    "Symbol",
    "Tahoma",
    "Times",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
    "Webdings",
    "Wingdings",
    "Zapf Dingbats"
  ];
  
  class rogFont {
    constructor(props = {}) {
      this.w = {
        css: {
          "font-family": "Raleway",
          "font-size": "36px",
          "font-style": "normal",
          "font-weight": 400,
          "letter-spacing": "0",
  
          "background-color": "#030303",
          color: "#f3f3f3"
        }
      };
  
      this.css = props.css;
      this.texto = props.texto;
      this.lee = props.lee;
    }
  
    set css(valores = {}) {
      this.w.css = Object.assign(this.w.css, valores);
    }
  
    get css() {
      return this.w.css;
    }
  
    get value() {
      return JSON.stringify(this.css);
    }
  
    set lee(fn = () => true) {
      this.w.lee = fn;
    }
  
    get lee() {
      return this.w.lee;
    }
  
    set texto(valor) {
      this.w.texto = valor;
    }
  
    get texto() {
      return this.w.texto;
    }
  
    submit(frm) {
      this.css = valores(frm);
      if (this.lee()) this.vnt.mst();
    }
  
    mst() {
      if (!this.vnt) this.vnt = new rogVnt({});
      this.vnt.mst();
      this.vnt.contenido = tmpFonts(this.texto, this.w.css);
      let frm = this.vnt.vnt.querySelector("FORM");
      preparaFrm(frm, this.submit.bind(this));
      frm.querySelector(".btnAnula").onclick = this.vnt.mst;
  
      let texto = frm.querySelector("textarea");
      this.aplica(texto);
      frm.texto = texto;
    }
  
    aplica(dom) {
      for (let que in this.css) dom.style[que] = this.css[que];
    }
  }
  
  function cambia(event) {
    if (event.target.name)
      event.currentTarget.texto.style[event.target.name] = event.target.value;
  }
  
  function tmpFonts(texto, x) {
    return `<form>
        <fieldset>
            <label>Texto: </label>
            <textarea cols="30" rows="3">${texto}</textarea>
            <datalist id="fuentes"></datalist>
        </fieldset>
        <br>
        <table>
            <tr>
                <td>Fuente:</td>
                <td>
                    <a href="https://fonts.google.com" target="_blank">font-family:</a>
                </td>
                <td>
                    <input type="text" name="font-family" list="fuentes" value="${x["font-family"]}">
                </td>
            </tr>
            <tr>
                <td>Tamaño:</td>
                <td> <a href="https://www.w3schools.com/cssref/pr_font_font-size.asp" target="_blank">font-size: </a>
                </td>
                <td>
                    <input type="text" name="font-size" value="${x["font-size"]}">
                </td>
            </tr>
            <tr>
                <td>Estilo:</td>
                <td>
                    <a href="https://www.w3schools.com/cssref/pr_font_font-style.asp" target="_blank">font-style: </a>
                </td>
                <td>
                    <select name="font-style" value="${x["font-style"]}">
                        <option>normal
                        <option>italic
                        <option>oblique
                        <option>initial
                        <option>inherit
                    </select>
                </td>
            </tr>
            <tr>
                <td>Volumen:</td>
                <td>
                    <a href="https://www.w3schools.com/cssref/pr_font_weight.asp" target="_blank">font-weight: </a>
                </td>
                <td>
                    <select name="font-weight" value="${x["font-weight"]}">
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
                    </select>
                </td>
            </tr>
            <tr>
                <td>Espaciado:</td>
                <td> <a href="https://www.w3schools.com/cssref/pr_text_letter-spacing.asp" target="_blank">letter-spacing: </a></td>
                <td>
                    <input type="text" name="letter-spacing" value="${x["letter-spacing"]}">
                </td>
            </tr>
            <tr>
                <td>Color / Fondo:</td>
                <td></td>
                <td>
                    <input type="color" name="color" value="${x["color"]}">
                    <input type="color" name="background-color" value="${x["background-color"]}">
                </td>
            </tr>
        </table>
        <fieldset>
            <input type="submit" class="rogBtn" value="Guarda">
            <button class="rogBtn btnAnula">Anula</button>
        </fieldset>
    </form>`;
  }
  
  function preparaFrm(frm, lee) {
    frm.addEventListener("submit", (event) => {
      event.preventDefault();
      limpiaTextAreas(frm);
      if (frm.checkValidity()) lee(frm);
    });
  
    frm.btn = document.querySelector("[type=submit]");
  
    frm.addEventListener("change", (event) => {
      frm.btn.disabled = !frm.checkValidity();
    });
  
    frm.addEventListener("input", cambia);
  
    frm.querySelector("#fuentes").innerHTML = llenaFuentes();
  }
  
  function llenaFuentes() {
    return fuentes.map((x) => `<option>${x}`).join("");
  }
  