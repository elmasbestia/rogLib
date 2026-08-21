let template = document.createElement("template");

template.innerHTML = `
	<style>
    .rogModal {
       /* display: none; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100% /* Full Height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
      }
    .cntModal {
      background-color: #fefefe;
      margin: 5% auto; /* 5% from the top and centered */
      padding: 20px;
      border: 1px solid #888;
      width: 90%;
    }
    .rogCierraModal {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    .rogCierraModal:hover, .rogCierraModal:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
	</style>
	
	<div id="vntVotante"> <!-- class="rogModal"> --!>
		<div class="cntModal">
		  <span class="rogCierraModal">&times;</span>
    </div>
  </div>
`

class rogModal extends HTMLElement {
	constructor () {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template,template.content.cloneNode(true));
	}
	
	muestra() {
		// this.shadowRoot.querySelector(".rogModal");
    this.style.display = "block";			
	}
	
	connectedCallback() {
		let a = this.shadowRoot.querySelector(".rogModal")
		console.log("Primer nivel:")
		console.dir(a)
//		this.shadowRoot.querySelector(".rogCierraModal").addEventListener("click", () => this.style.display = "none");
			
		//if(this.getAttribute(x)) this.shadowRoot.querySelector(".notify-container").chepacua = this.getAttribute(x)
	}
}

window.customElements.define('rog-modal', rogModal);

/* Uso:

<rog-modal ud="nb ventana">

document.querySelector("#nb ventana").muestra()
*/