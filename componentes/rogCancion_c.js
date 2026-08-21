const _rogCancion = {
    que: {
        letra: {
            icono:  "fa fa-font",
            svg: '<svg class="svg-inline--fa fa-font fa-w-14" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="font" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z"></path></svg>',
            mst:    x => "https://www.letras.com/" +x
        },
        video: {
            icono:  "fab fa-youtube", // "fa fa-film", 
            svg: '<svg class="svg-inline--fa fa-youtube fa-w-18" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="youtube" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>',
            mst:    x => "https://www.youtube.com/watch?v=" +x
        },
        acordes: {
            icono:  "fa fa-music",
            svg: '<svg class="svg-inline--fa fa-music fa-w-16" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="music" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M470.38 1.51L150.41 96A32 32 0 0 0 128 126.51v261.41A139 139 0 0 0 96 384c-53 0-96 28.66-96 64s43 64 96 64 96-28.66 96-64V214.32l256-75v184.61a138.4 138.4 0 0 0-32-3.93c-53 0-96 28.66-96 64s43 64 96 64 96-28.65 96-64V32a32 32 0 0 0-41.62-30.49z"></path></svg>',
        },
        chuleta: {
            icono:  "fa fa-comment",
            svg: '<svg class="svg-inline--fa fa-comment fa-w-16" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>',
        },
        papeles: {
            icono:  "fas fa-guitar",
            svg: '<svg class="svg-inline--fa fa-guitar fa-w-16" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="guitar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M502.63 39L473 9.37a32 32 0 0 0-45.26 0L381.46 55.7a35.14 35.14 0 0 0-8.53 13.79L360.77 106l-76.26 76.26c-12.16-8.76-25.5-15.74-40.1-19.14-33.45-7.78-67-.88-89.88 22a82.45 82.45 0 0 0-20.24 33.47c-6 18.56-23.21 32.69-42.15 34.46-23.7 2.27-45.73 11.45-62.61 28.44C-16.11 327-7.9 409 47.58 464.45S185 528 230.56 482.52c17-16.88 26.16-38.9 28.45-62.71 1.76-18.85 15.89-36.13 34.43-42.14a82.6 82.6 0 0 0 33.48-20.25c22.87-22.88 29.74-56.36 22-89.75-3.39-14.64-10.37-28-19.16-40.2L406 151.23l36.48-12.16a35.14 35.14 0 0 0 13.79-8.53l46.33-46.32a32 32 0 0 0 .03-45.22zM208 352a48 48 0 1 1 48-48 48 48 0 0 1-48 48z"></path></svg>',
        }
    },

    click: e => {
        e.stopPropagation()
        let btn = e.target.closest(".rogBtn")
        if(btn) {
            let obj = e.target.getRootNode().host
            obj.dispatchEvent(new CustomEvent("click", {detail: {que: btn.title}}))
        }
    }   
}

class rogCancion extends HTMLElement {
    #bd;
    #datos;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    set id(valor) {
        this.setAttribute("id", valor)
    }

    get id() {
        return this.getAttribute("id")
    }

    get datos() {
        if(!this.#datos) {
            let x = this.id // return this.#bd[this.id]
            this.#datos = {id: x, ...canciones[x], letra: textos[x], chuleta: chuletas[x], papeles: papeles[x]};
        }
        return this.#datos;
    }

    get titulo() {
        return this.datos.titulo || "(none)"
    }

    get lstOpciones() {
        return ["letra", "video", "acordes", "chuleta", "papeles"]
    }

    set bd(valor) {
        this.#bd = valor
    }

    get bd() {
        return this.#bd
    }

    get letra() {
        return this.datos.letra || "";
    }

    get chuleta() {
        return this.datos.chuleta;
    }

    get acordes() {
        return this.ref("acordes")
    }

    get papeles() {
        return this.datos.papeles
    }

    get video() {
//        let retorno = this.datos.video
//        if(retorno) return Array.isArray(retorno) ? retorno.map(x => _rogCancion.getVideo(this, x)) : _rogCancion.getVideo(this, retorno)
        return this.ref("video")
    }

    ref(que) {
        let retorno = this.datos[que]
        
        if(retorno) { 
            let titulo = this.titulo
            let mst = _rogCancion.que[que].mst || (x => x)  
            let getQue = x => typeof x === "string" ? 
                {url: mst(x), titulo} :
                Object.assign(x, {url: mst(x)})

            return Array.isArray(retorno) ? 
                retorno.map(x => getQue(x)) :
                getQue(retorno)
        }    
    }
  
    connectedCallback() {
        this.render();
    }

    disconnectedCallBack() {}

    render() {
        this.shadow.innerHTML = tmpROGCancion(this);
    }

    static get observedAttributes() {
        return ["id"];
    }

    attributeChangedCallback(att, viejo, nuevo) {
        this.#datos = null;
        this.render();
    }
}
    
customElements.define("rog-cancion", rogCancion);

function tmpROGCancion(obj) {
    return `<style>
            .icono svg {
                height: var(--szBtn, 1em);
            }

            .rogBtn {
                background-color: var(--clrFndObj);
                color: var(--clrTxtObj);
            
                font-size: small;
            
                border: none;
                border-right: silver;
                border-bottom: silver;
                padding: .5em 1em;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                margin: .3em .2em;
                cursor: pointer;
            
                transition: trasform 125ms ease-in-out;
            }

            .rogBtn:hover,
            .rogBtn:focus  {
                border: initial;
                font-weight: bolder;
                box-shadow: var(--sombra);
            }
            
            .rogBtn:disabled {
                opacity: .5;
                cursor: not-allowed;
            }
            
            .rogBtn:active {
                background-color: #2f2f2f;
                animation: btnClick 1s linear;
            }
 
            @keyframes btnClick {
                0% {
                background-color: black;
                }
                50% {
                transform: scale(0.8);
                }
            
                100% {
                transform: scale(1);
                }
            }
        </style>
            <fieldset onclick="_rogCancion.click(event)">
            <legend>${obj.titulo}</legend>
            ${obj.lstOpciones.map(x => {
                let retorno = ""
                let opcion = obj[x]
                if(opcion) {
                    retorno = `<button class="rogBtn" title="${x}">
                        <span class="icono">${_rogCancion.que[x].svg}</span>
                    </button>`
                }
                return retorno
            }).join("")}
    </fieldset>`
}