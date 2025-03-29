// Librería para manejar Diaporamas
// rafagomez.neocities.org
function rogImagen(nb, alt, caption, enlace, titulo) {
    this.nb = nb;
    this.alt = alt || nb;
    this.caption = caption;
    this.enlace = enlace;
    this.titulo = titulo;
}

function rogDiapos(dom,directorio,imagenes,intervalo = 3500) {
    /* Crea un carrusel de imágenes a partir de:
     @param dom           Elemento donde se mostrarán las imágenes
     @param directorio    Dirección de las fotos
     @param imagenes      Arreglo de codigo html u objetos con:
              nb          nombre de la imagen
		o 	  video		  nombre del video
              alt         nombre alternativo (img)
              caption     título de la imágen
              enlace      Hipervinculo
              titulo      Texto que aparece al pasar sobre la imagen
	  Se pueden mezclar imágenes con videos y código
    */
    var Intervalo = intervalo;
    var diapos = [];
    var base = typeof dom === "string" ? document.getElementById(dom) : dom;
    var indice = 0;
	var _sigue = true;
    
    function avanza(paso = 1) {
        if (_sigue) {
			// Hasta que encuentre porqué diapos pierde la identidad:
			let diapos = base.querySelectorAll(".rogDiapo")
			let btns = 	 base.querySelectorAll(".btnCarrusel")

            diapos[indice].style.display = 'none';
			btns[indice].classList.remove("activa");

            if(typeof(paso) === "number") {
                if ((indice += paso) >= diapos.length) { indice = 0; }
				if (indice < 0) indice = diapos.length -1;
            } else {
            	indice = paso.target.attibute["data-indice"]
            }
            diapos[indice].style.display = 'block';
			btns[indice].classList.add("activa");
            arranca();
        }
    }
    function arranca() {
        setTimeout(avanza,Intervalo);
    }

	function sigue() {
        _sigue = true;
        avanza();
    }

	function para() {
		_sigue = false;
	}

    function creaDiapos() {
		let _carrusel = document.createElement("DIV");
		
		_carrusel.className = "Diapos";
		_carrusel.innerHTML =
			"<aside class='crrAnt' onclick='avanza(-1)'><span class='flechita'>&#10094;</span></aside>";
        
		base.appendChild(_carrusel)

        imagenes.forEach((x) => {
            let imagen = creaDiapo(x);
            _carrusel.appendChild(imagen);
            diapos.push(imagen);
        });
		_carrusel.innerHTML +=
			"<aside class='crrSig' onclick='avanza()'><span class='flechita'>&#10095;</span></aside>"
			
		base.innerHTML += "</nav>" + diapos.map(
			(x,i) => "<span class='btnCarrusel' data-indice='"+i+"' onclick='avanza()'></span>" 
		).join("")+"</nav>"
    }

    this.para = para;
    this.sigue = sigue;
    this.setIntervalo = (lapso) => { Intervalo = lapso }
    
    if (directorio.charAt(directorio.length -1) != "/" && directorio.charAt(directorio.length -1) != "\\" ) { directorio +="/" }
    creaDiapos();
    indice = diapos.length -1;
    avanza();

	function creaDiapo(imagen) {
		var fig = document.createElement("FIGURE");
		
		if(imagen.caption) {
			var figcaption = document.createElement("FIGCAPTION");
			figcaption.appendChild(document.createTextNode(imagen.caption));
			fig.appendChild(figcaption);
		}

		if (imagen.titulo) {img.title = imagen.titulo}

		fig.style.display = "none";
		fig.className = "rogDiapo";

		if(typeof(imagen) === "string") fig.innerHTML += imagen;
		else fig.appendChild(imagen.video ? creaVideo(imagen) : creaImg(imagen));
		
		return fig;
	}

	function creaImg(imagen) {
		let img = document.createElement("IMG");
		img.src = directorio + imagen.nb;
		img.alt = imagen.alt || imagen.nb;
		img.className = 'img-responsive';

		if (imagen.enlace) {
			let ancla = document.createElement("A");
			ancla.href = imagen.enlace;
			ancla.appendChild(img);
			return ancla;
		} else {
			return img;
		}
	}

	function creaVideo(video) {
		let retorno = document.createElement("VIDEO");
		
		retorno.className   = "video";
		retorno.style.width = "100%";
		retorno.controls    = "true";
		retorno.onplay      = para
		retorno.oncancel    = sigue
		retorno.onended     = sigue
		
		retorno.innerHTML = "<source src='"+directorio+video.video+"' type='video/mp4'>"
		
		return retorno;
	}

}

function chkDiapos(diapos) {
	let _crr = document.querySelectorAll(".rogDiapo");
	
	diapos.forEach((x,i) =>
		console.log(i +". "+ (x === _crr[i]) )
	)
}