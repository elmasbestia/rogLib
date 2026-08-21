
const rogCreditos = {
    awe: {
        nb: "awe",
        url: "https://fontawesome.com",
        img: "Logos/LogoAwe.png"
    },
    neo: {
        nb: "neo",
        url: "http://neocities.org",
        img: "Logos/neocities.png"
    },
    fb: {
        nb: "fb",
        url: "https://firebase.google.com",
        img: "Logos/firebase-logo.png"
    },
    rog: {
        nb: "rog",
        url: "https://rafagomez.neocities.org",
        img: "rogLogo.svg"
    }
}

const _rogFoot = {

    creditos: obj => obj.creditos.map(_rogFoot.credito).join(""),

    credito: x => {
        const crd = rogCreditos[x];
        return `<a href="${crd.url}" target="_blank"><img src="${_rogFoot.dirImg() +crd.img}" alt="logo de ${crd.nb}" class="logo"></a>`;
    },

    dirImg: x => "http://rafagomez.neocities.org/rogLib/Imagenes/"
}

class rogFoot extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }
    
    get creditos () {
        const creditos = this.getAttribute("creditos");
        return creditos ? creditos.split(", ") : [];
    }
  
    connectedCallback() {
        this.render();
    }
    
    disconnectedCallBack() {}
    
    render() {
        this.shadow.innerHTML = tmpROGFoot(this);
    }
    
    static get observedAttributes() {
        return _rogFoot.observados;
    }
    
    attributeChangedCallback(att, viejo, nuevo) {
        if (_rogFoot.cambia[att]) _rogFoot.cambia[att](this, viejo, nuevo);
        this.render();
    }
}

customElements.define("rog-footer", rogFoot);

function tmpROGFoot(obj) {
    return `<style>
            footer {
                display: flex;
                justify-content: flex-end;
            
            height: 2em;
                border: 0;
                box-shadow: 0 10px 10px -10px #8c8c8c inset;
            
            padding: 5px;
                margin-top: 10px;
            }
            
            footer .creditos {
                height: 80%;
            }
            
            footer .logo {
                height: 80%;
            }
            
            .rogLogo:hover {
            -ms-transform: scaleY(1.5); /* IE 9 */
            transform: scale(1.5);
            }
        </style>
    <footer>
        <section class="creditos">
            ${_rogFoot.creditos(obj)}
            ${_rogFoot.credito("rog")}
        </section>
    </footer>`;
}
