const template = document.createElement("template");

template.innerHTML = `
	<style>
		.notify-container {
			position: absolute;
			bottom: 125%;
			z-index: 9;
			width: 300px;
			background: white;
			box-shadow: 5px 5px 10px rgba(0,0,0,.1);
			font-size: .8em;
			border-radius: .5em;
			padding: 1em;
			transform: scale(0);
			transform-origin: bottom left;
			transition: tranform .5s cubic-bezier(0.860, 0, 0.700, 1)}
	</style>
	
	<div class= ""
`

class PopupNotify extends HTMLElement {
	constructor () {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template,content.cloneNode(true));
	}
	
	tooltip(expandState) {
		const tooltip = this.shadowRoot.querySelector(".notify-container");
		const alert   = this.shadowRoot.querySelector(".alert");
		const cancel  = this.shadowRoot.querySelector(".cancel");
		
		if(expandState) {
			tooltip.style.transform = "scale(1)";
			alert.style.display = "none";
			cancel.style.display = "block";
			expandState = false;
		} else {
			tooltip.style.transform = "scale(0)";
			alert.style.display = "block";
			cancel.style.display = "none";			
		}
	}
	
	connectedCallback() {
		this.shadowRoot.querySelector(".alert").addEventListener("click", () => this.tooltip(true));
		//cancel false
		
		if(this.getAttribute(x)) this.shadowRoot.querySelector(".notify-container").chepacua = this.getAttribute(x)
	}
}

window.customElements.define('popup-notify, PopupNotify)')
/*
Uso:

<popup-notify>
    <span slot="message">Mensaje del Tool Tip
*/