function Direccion (referencia, dir,localidad,edo, coo) {
    // var dir, localidad, edo, coo;
    
    this.Direccion = dir
    this.Localidad = localidad
    this.dpt = new rogDPT(edo)
    this.lat = coo.lat
    this.lng = coo.lng
}
