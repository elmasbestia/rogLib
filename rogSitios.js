function Sitio (id, alias, nombre, tipo, dir) {
    this.id = id 
    this.Alias = alias
    this.nombre = nombre || alias
    this.tipo = tipo
    this.direccion = new Direccion(dir)

    this.tipos = () => ["Local Comercial", "Sitio Público", "Institución Internacional", "Ente Público", "Empresa Privada"]
}
