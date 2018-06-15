// Librería para manejar Diaporamas
// rafagomez.neocities.org
function rogImagen(nb, alt, caption, enlace, titulo) {
    this.nb = nb;
    this.alt = alt || nb;
    this.caption = caption;
    this.enlace = enlace;
    this.titulo = titulo;
}

function rogDiapos(dom,directorio,imagenes) {
    // Crea un carrusel de imágenes a partir de:
    // @param dom           Elemento donde se mostrarán las imágenes
    // @param directorio    Dirección de las fotos
    // @param imagenes      Arreglo de imégenes con:
    //          nb          nombre de la imagen
    //          alt         nombre alternativo (img)
    //          caption     título de la imágen
    //          enlace      Hipervinculo
    //          titulo      Texto que aparece al pasar sobre la imagen
    
    var Intervalo = 3500;
    var diapos = [];
    var base = typeof dom === "string" ? document.getElementById(dom) : dom;
    var indice = 0;
    
    function avanza() {
        if (!this.para) {
            diapos[indice].style.display = 'none';

            if (++indice == diapos.length) { indice = 0; }
            diapos[indice].style.display = 'block';
            arranca();            
        }
    }
    function arranca() {
        setTimeout(avanza,Intervalo);
    }

    function preparaDiapos() {
        function preparaDiapo(imagen) {
            var fig = document.createElement("FIGURE");
            var img = document.createElement("IMG");
            var figcaption = document.createElement("FIGCAPTION");

            img.src = directorio + imagen.nb;
            img.alt = imagen.alt || imagen.nb;
            img.className = 'img-responsive';
            if (imagen.titulo) {img.title = imagen.titulo}

            if (imagen.enlace) {
                let ancla = document.createElement("A");
                ancla.href = imagen.enlace;
                ancla.appendChild(img);
                fig.appendChild(ancla);
            } else {
                fig.appendChild(img);
            }

            figcaption.appendChild(document.createTextNode(imagen.caption));
            fig.appendChild(figcaption);
            fig.style.display = "none";
            fig.className = "rogDiapo";
            
            return fig;
        }
        
        imagenes.forEach((x) => {
            let imagen = preparaDiapo(x);
            base.appendChild(imagen);
            diapos.push(imagen);
        });
    }

    this.para = false;
    this.sigue = () => {
        this.para = false;
        avanza();
    }
    this.setIntervalo = (lapso) => { Intervalo = lapso }
    
    if (directorio.charAt(directorio.length -1) != "/" && directorio.charAt(directorio.length -1) != "\\" ) { directorio +="/" }
    preparaDiapos();
    indice = diapos.length -1;
    avanza();
}