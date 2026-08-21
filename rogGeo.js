"use strict";
/* Librería para manejo de Información Geográfica
   https://rafagomez.neocities.org
   
   Para incluirla en tu página debes usar:
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=TU CLAVE"></script>
   <script src="rogGeo.js"></script>
*/

function rogGeo(dom, domCoo, inicio, Marcas, primerPunto) {
    // @param dom               dom a contener el mapa
    // @param domCoo            dom a mostrar las coordenadas
    // @param inicio            función a ejecutar al presentar el Mapa
    // @param Marcas            Nombre bajo el que se guardan los puntos marcados
    // @param primerPunto       Objeto punto con los datos del primer punto a marcarse en el mapa
    
    var miPosicion, miLat, miLng, primero, fino = false;
    var puntos = [], Rutas = [], Marcadores = [];

    var modoViaje = ["DRIVING", "BICYCLING", "TRANSIT", "WALKING"]; // Travel Mode
    
    var tipoMapa = ["roadmap", "satellite", "hybrid", "terrain"]; // mapTypeID
  
    function PzaBolivar() { return new Punto(10.506067, -66.914628, "Plaza Bolívar", "Plaza Bolívar de Caracas")}
    
    function ErrorGeo(pos) { alert('¡Error! No se puede determinar la posición geográfica')}

    function NoGeo() { alert('Parece que su navegador no soporta Geolocalización. ¡Lástima!')}
    
    function Punto(lat, lng, texto, info) {
        let wlat, wlng, wtexto, winfo;
        
        if (typeof lat === "object") {
            if (lat.currentTarget) {    // La función fue llamada al hacer "click" en el mapa
                [wlat, wlng] = [lat.currentTarget.latLng()];
            } else {
                if (lat.latLng) {
                    [wlat, wlng] = [lat.latLng];
                    wtexto = lat.texto;
                    winfo  = lat.info
                } else {
                    wlat = lat.lat;
                    wlng   = lat.lng;
                    wtexto = lat.texto;
                    winfo  = lat.info;
                }
            }
        } else {
            wlat   = lat;
            wlng   = lng;
            wtexto = texto;
            winfo  = info;
        }
        
        this.lat   = wlat;
        this.lng   = wlng;
        this.texto = wtexto;
        this.info  = winfo;
    }
    
    function nuevoPunto(lat, lng, texto, info) {
        // Crear un nuevo punto en el mapa
        var punto = new Punto(lat, lng, texto, info);
        var marca = new google.maps.Marker();

        marca.position = {lat: punto.lat, lng: punto.lng};
        marca.title = punto.texto;
        if (punto.info) {
            marca.infoWindow = {content: '<p>' + punto.info + '</p>'}
        }
        
        marca.setMap(self.mapa);

        puntos.push(punto);
        Marcadores.push(marca);

        if (puntos.length === 1) {primero = puntos[0]}
        if (Marcas) {localStorage[Marcas] = JSON.stringify(puntos)}
        
        self.muestraPuntos("txtPuntos");
    }
    
    function defPrimerPunto () {
        // El primer punto del mapa puede ser definido por:
        // 1. El parámetro primerPunto
        // 2. El primer elemento del arreglo Marcas
        // 3. La ubicación actual

        if (primerPunto) {primero = new Punto(primerPunto)}

        if (!primero) { primero = miPosicion }
    };

    function defPosicion() {
        miPosicion = PzaBolivar(); // Defecto
        miLat = miPosicion.lat;
        miLng = miPosicion.lng;

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
              miPosicion = {lat: pos.coords.latitude, lng: pos.coords.longitude};
              miLat = miPosicion.lat;
              miLng = miPosicion.lng;
          }, 
            ErrorGeo
          );
        } else {
          NoGeo(); // Browser doesn't support Geolocation
        }
    }
    
    this.fino = () => fino;
    this.base = typeof dom === "string" ? document.getElementById(dom) : dom;
    this.miPosicion = () => miPosicion;
    this.getLat = () => miLat;
    this.setLat = (valor) => {
        if (typeof valor === "object") {
            miLat = valor.lat;
            miLng = valor.lng;
        } else {
            miLat = valor;
        }
        this.centrarMapa(miLat, miLng);
    }
    this.latitud = (x = miLat) => Math.abs(x).toFixed(2)+(x > 0?  "N" :"S");
    this.getLng = () => miLng;
    this.setLng = (valor) => {
        if (typeof valor === "object") {
            miLat = valor.lat;
            miLng = valor.lng;
        } else {
            miLng = valor;
        }
        this.centrarMapa(miLat, miLng);
    }
    this.longitud = (x = miLng) => Math.abs(x).toFixed(2)+(x > 0?  "E" :"O");
    this.txtCoords = document.getElementById(domCoo);
    this.Coordenadas = (lat = miLat, lng = miLng) => {return this.latitud(lat) +", " +this.longitud(lng)};
    this.MuestraCoords =   (lat = miLat, lng = miLng) => {
        this.txtCoords.innerHTML = this.msjCoordenadas(lat,lng);
    }
    this.msjCoordenadas =  (lat = miLat, lng = miLng) => '<p>Tus coordenadas son: ' + this.Coordenadas(lat,lng) + '</p>'
    this.modo = modoViaje[0];
    this.tipo = tipoMapa[0];
    this.mapa = {};
    this.nuevoPunto = nuevoPunto;
    this.nuevaRuta = (hasta) => {
        BorrarRutas();
        TrazaRuta (hasta, "Origen");
    };
	this.trazaRuta = (hasta, marcador, info) => {
        var x = puntos.length;
        var deLat, deLng;

        if (hasta.lat) {
            {deLat = hasta.lat; deLng = hasta.lng}
        } else {
            if (hasta.coords) {
                deLat = hasta.coords.latitude; deLng = hasta.coords.longitude
            } else {
                deLat = hasta.latLng.lat(); deLng = hasta.latLng.lng()
            }
        }
            
        if (x) {
            Rutas.push(new google.maps.Polyline({
                path: [puntos[puntos.length -1], {lat: deLat, lng: deLng}],
                strokeColor: '#FF0000',
                strokeOpacity: 0.6,
                strokeWeight: 2,
                map: self.mapa
            }));
        nuevoPunto({lat: deLat , lng: deLng}, marcador, info);
      }
    };
    this.borrarRutas = () => {
        Rutas.forEach((x) => { x.setMap(null)});
        Rutas = [];
        if (Marcas) {localStorage.removeItem(Marcas)};
        
        puntos = [];
        defPrimerPunto(primero);
    };
    this.compactarRutas = () => {
        var ultimo = puntos.pop();
        this.borrarRutas();
        this.trazaRuta (ultimo)
    };
    this.recobraMarcas = (Si = nuevoPunto,No) => {
        var Ruta = [];

        if (localStorage[Marcas]) {Ruta = JSON.parse(localStorage[Marcas])}
        if (Ruta.length) { Ruta.forEach((x) => {Si(x)}) }
        else {if(No) No()}
    };
    this.centrarMapa = (lat, lng) => {
        var Coords = new google.maps.LatLng(lat, lng);
        //Mapa.map.center = Coords;           center: {lat: -34.397, lng: 150.644}
        //Mapa.map.panTo(Coords);
        self.mapa.setCenter(Coords);
        self.MuestraCoords();
    };
    this.Puntos = puntos;
    this.Marcadores = Marcadores;
    this.muestraPuntos = (donde) => {
        let domDe = typeof donde === "string" ? document.getElementById(donde) : donde;
        if (domDe) {
            let tabla = "<table>";
            puntos.forEach((x, n) => { tabla+= "<tr><td>" + n + "</td><td>" + this.Coordenadas(x.lat, x.lng)+ "</td></tr>"});
            domDe = tabla +"</table>";
        } else {
            console.table(puntos);  
        }
    };
    
    var self = this;

    defPosicion();
    defPrimerPunto();

    // self.base.height = "100%"; Era mentira lo del 100%
    self.mapa = new google.maps.Map(self.base, {center: primero, zoom: 18});

    fino = true;
    self.mapa.setZoom(17);
    self.mapa.addListener('click', nuevoPunto);

    if (Marcas) { self.recobraMarcas()}
    
    if (inicio) inicio();
}