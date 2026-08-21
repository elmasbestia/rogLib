const _rogLogin = {
  observados: ["proveedores","estado"],

  cambia: {},

  iniFrm: (obj) => {
    obj.frm.addEventListener("submit", (event) => {
      event.preventDefault();
      const btn = event.submitter

      if(obj.proveedores) obj.dispatchEvent(new CustomEvent("lee", {detail: {proveedor: event.submitter.dataset.proveedor}}));
      else {
        obj.frm.btn.disabled = true;
        _rogLogin.lmpErrores();
        obj.usr = obj.frm.usr.value;
        if(obj.frm.checkValidity()) obj.dispatchEvent(new CustomEvent("lee", {detail: {
                usr: obj.usr,
                clave: obj.frm.clave.value
            }
        }));
      }
    });

    if(!obj.proveedores) {
      obj.frm.btn = obj.frm.querySelector("[type=submit]");
      obj.frm.btn.disabled = true;
      
      obj.frm.addEventListener("change", (event) => {
        obj.frm.btn.disabled = !obj.frm.checkValidity();
      });
    }
  },

  chxOjo: e => {
    let btn = e
    if(e instanceof Event) {
      e.stopPropagation()
      btn = e.target
    }
    const input = btn.parentElement.querySelector("INPUT")
    input.type = input.type === "password" ? "text" : "password"
  },

  lmpErrores() {
    document.querySelectorAll(".error").forEach(x => x.classList.remove("error"));
  },

  mstError(obj,error) {
    if(obj.proveedores) {
      if (obj.frm) {
        obj.frm.classList.add("error");
        obj.frm.querySelector(".msj").textContent = error.msj;
      } else alert (error);
    } else {      
      const campo = obj.frm.querySelector(`[name=${error.campo}]`);
      const grupo = campo.parentNode;
      
      grupo.classList.add("error");
      grupo.querySelector(".msj").textContent = error.msj;
    }
  },
  
  urlLogo: (proveedor) => `https://rafagomez.neocities.org/rogLib/Imagenes/Logos/${proveedor}.png`
}

function tmpROGLogin(obj) {
  function tmpNormal(obj) {
    return `<div class="grupo-input">
        <label for="usr">Usuario</label>
        <input type="text" name="usr" value="${obj.usr}" required>
        <span class="msj" for="usr"></span>
      </div>

      <div class="grupo-input">
        <label for="clave">Clave</label>
        <div class="inputConBtn">
            <input type="password" name="clave" required>
            <span class="mstPwd" onclick="_rogLogin.chxOjo(this)">👁</span>
        </div>
        <span class="msj" for="clave"></span>
      </div>
      <input type="submit" class="boton" value="${obj.accion}">`;
  }

  function tmpProveedores() {
    return `<h2 class="proveedores">Conéctate a través de tu servicio preferido:</h2>
    <div class="msj"></div>
    <section id="proveedores" class="proveedores">
      <button class="boton" title="Identifícate a través de FaceBook" data-proveedor="face">
        <img src="${_rogLogin.urlLogo("facebookFull")}" alt="Facebook">
      </button>
      <button class="boton" title="Identifícate a través de Google" data-proveedor="g">
        <img src="${_rogLogin.urlLogo("googleFull")}" alt="Google">
      </button>
      <button class="boton" title="Identifícate a través de MS Passport" data-proveedor="ms">
        <img src="${_rogLogin.urlLogo("logoMS")}" alt="MS">
      </button>
    </section>`
  }

  return obj.estado === "abierta" ? "" :
    `<style>
      ${tmpCSSROGLogin(obj)}
    </style>
    <div class="telon">
      <div class="card">
        <h1 class="titulo">Bienvenid@</h1>
        <form>
          ${obj.proveedores ?
            tmpProveedores() :
            tmpNormal(obj)
          }
        </form>
      </div>
    </div>`;
}

function tmpCSSROGLogin(obj) {
  return `:root {
    --clr-claro: 200, 100%, 91%;
    --clr-hsl: 221, 44%, 41%;
    --clr-oscuro: 200, 100%, 6%;
    --valido-hsl: 100, 60%, 50%;
    --error-hsl: 0, 60%, 50%;
  }
  
  :host {
    isolate: isolation;
    z-index: 250;
  }

  .telon {
    position: fixed;
    inset: 0;
    background-color: hsl(200, 100%, 6%, 0.7);
  
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card {
    color: white;
    background-color: hsl(200, 100%, 6%, 0.7);
    box-shadow: 0 0 15px 0 hsl(200, 100%, 6%, 0.7);
    padding: 40px 30px;
    width: 80%;
    max-width: 600px;
    border-radius: 20px;
  }
  
  .titulo {
    color: white;
    text-align: center;
  }
  
  section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 40px;
  }
  
  .grupo-input {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  
  .grupo-input label {
    font-weight: lighter;
  }
  
  .grupo-input input, span {
    font-size: 1.25rem;
    font-weight: lighter;
    color: white;
    background-color: hsl(200, 100%, 91%, 0.3);
  
    padding: 0.5em;
    border: none;
    outline: none;
    border-radius: 0.25em;
  }

  .grupo-input input {
    flex-grow: 1;
  }
  
  .grupo-input input:focus {
    box-shadow: 0 0 0 1px hsl(221, 44%, 41%);
  }
  
  .grupo-input.valido input {
    box-shadow: 0 0 0 1px hsl(100, 60%, 50%);
  }
  
  .grupo-input.error input {
    box-shadow: 0 0 0 1px hsl(0, 60%, 50%);
  }
  
  .inputConBtn {
    display: flex;
    gap: 2em;
  }

  .msj {
    display: none;
    font-size: 0.75rem;
  }
  
  .grupo-input.valido .msj {
    display: unset;
    color: hsl(hsl(100, 60%, 50%));
  }
  
  .error .msj {
    display: unset;
    color: hsl(0, 60%, 50%);
  }
  
  .boton {
    margin-top: 1em;
    padding: 0.5em 1em;
    font-size: 1.5rem;
    font-weight: lighter;
    color: white;
    background-color: hsl(221, 44%, 41%, 0.25);
    border: 1px solid hsl(221, 44%, 41%);
    border-radius: 0.25em;
    outline: none;
    cursor: pointer;
    text-align: center;
    width: 100%;
  }
  
  .boton img {
    height: 2em;
  }
  
  .boton:hover,
  .boton:focus {
    background-color: hsl(221, 44%, 41%);
  }
  
  .boton:disabled {
    opacity: .5;
    cursor: not-allowed;
  }`;
}

class rogLogin extends HTMLElement {
  /**
   * Estados:
   * 0. cerrada:    No hay sesion abierta: se muestra login
   * 1. validando:  Se estan validando usr y clave
   * 2. abierta:    La sesion esta abierta: no se muestra login
   */
  #usr = "";
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  get proveedores(){
    return (this.hasAttribute("proveedores") && (this.getAttribute("proveedores") !== "false"));
  }
  
  set proveedores(valor) {
    this.setAttribute("proveedores",valor);
  }

  get estado() {
    return this.getAttribute("estado") || "cerrada";
  }

  set estado(valor) {
    this.setAttribute("estado",valor); 
  }

  set error(error) {
    _rogLogin.mstError(this,error)
  }

  set usr(valor) {
    this.#usr = valor;
  }

  get usr() {
    return this.#usr;
  }

  set accion(valor) {
    this.setAttribute("accion",valor)
  }

  get accion() {
    return this.getAttribute("accion") || "Conectar";
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallBack() {}

  render() {
    this.shadow.innerHTML = tmpROGLogin(this);
    this.frm = this.shadow.querySelector("form");
    if(this.frm) _rogLogin.iniFrm(this);
  }

  static get observedAttributes() {
    return _rogLogin.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    if (_rogLogin.cambia[att]) _rogLogin.cambia[att](this, viejo, nuevo);
    this.render();
  }
}
  
customElements.define("rog-login", rogLogin);
