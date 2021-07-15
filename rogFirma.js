let template = document.createElement("template");

template.innerHTML = `
	<style>
footer {
	display: flex;
	height: 2em;
	border: 0;
	box-shadow: 0 10px 10px -10px #8c8c8c inset;
	padding: 5px;
	top: 10px;
	justify-content: flex-end;
}

footer .creditos {
	height: 80%;
}

footer .logo {
	height: 80%;
}
.rogFirma {
	background-color: transparent;
}

.rogFirma-enlaces {
  background-color: #004d66;
  background-repeat: no-repeat;
  color: silver;
  text-shadow: .1rem .1rem black;
  position: fixed;
}

.rogFirma-enlace {
  border: 2px solid currentcolor;
  border-radius: 25px;

  color: silver;
  font-size: 1.5rem;
  display: block;
  padding : 15px;
  margin: auto auto;

  -webkit-transform: rotateZ(45deg);
          transform: rotateZ(45deg);
}

.rogFirma-enlace a {
  color: currentcolor;
}

.rogLogo:hover {
  -ms-transform: scaleY(1.5); /* IE 9 */
  transform: scale(1.5);
}

.rogFirma:hover .rogFirma-enlaces {
  display: block;

  bottom:   100px;
  right:     10px;
}

.rogFirma:hover .rogFirma-enlaces .rogFirma-enlace {
  transition: all 2s ease-in;

  -webkit-transform: rotateZ(0deg);
          transform: rotateZ(0deg);
}

.rogCapa2 {
  transition-delay: .5s;
}

.rogCapa3 {
  transition-delay: 1s;
}

.rogDetBloque {
	display: none;
}
	</style>
	
	<footer>
  <section class="rogFirma">
    <img class="rogLogo" src="Imagenes/rogLogo.png" alt="">
    <div class="rogFirma-enlaces">
      <div class="rogFirma-enlace rogCapa1">
        <p>
          Teléfono: +58 412 977 3807
        </p>
        <div class="rogFirma-enlace rogCapa2">
          <p>
            Correos:<br>
            RafaGomez@yandex.com<br>Rafa.Gomez@LaPoste.net
          </p>
          <div class="rogFirma-enlace rogCapa3">
            <p>
              Página: <br>
              <a href="https://rafagomez.neocities.org" target="_blank">rafagomez.neocities.org</a>
            </p>
          </div>
        </div>
      </div>
  </section>
	<footer>
` 

class rogFirma extends HTMLElement {
	constructor () {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template,template.content.cloneNode(true));
	}
		
	connectedCallback() {
		//this.shadowRoot.querySelector(".alert").addEventListener("click", () => this.tooltip(true));
		//cancel false
		
		//if(this.getAttribute(x)) this.shadowRoot.querySelector(".rog-firma")[x] = this.getAttribute(x)
	}
}

window.customElements.define('rog-firma', rogFirma);

