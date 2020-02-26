package main

import "fmt"

type Producto struct {
    descripcion string
    precio float64
    stock int
}

func cargar(productos map[int]Producto) {
    var codigo int
    var opcion string
    var pro Producto
    for {
        fmt.Print("Ingrese el codigo del producto:")
        fmt.Scan(&codigo)
        fmt.Print("Ingrese la descripcion:")
        fmt.Scan(&pro.descripcion)
        fmt.Print("Ingrese el precio:")
        fmt.Scan(&pro.precio)
        fmt.Print("Ingrese el stock actual:")
        fmt.Scan(&pro.stock)        
        productos[codigo] = pro
        fmt.Print("Desea cargar otro producto[s/n]?")
        fmt.Scan(&opcion)
        if opcion == "n" {
            break;
        }
    }
}

func imprimir(productos map[int]Producto) {
    fmt.Println("Listado completo")
    for codigo, producto := range productos {
        fmt.Println("Código:", codigo)
        fmt.Println("Descripcion:", producto.descripcion)
        fmt.Println("Precio:", producto.precio)
        fmt.Println("Stock:", producto.stock)
        fmt.Println("-----------------------")
    }    
}

func consulta(productos map[int]Producto) {
    var codigo int
    fmt.Print("Ingrese el código de artículo a consultar:")
    fmt.Scan(&codigo)
    producto, existe := productos[codigo]
    if existe {
        fmt.Println("Descripcion:", producto.descripcion)
        fmt.Println("Precio:", producto.precio)
        fmt.Println("Stock:", producto.stock)
    } else {
        fmt.Println("No existe")
    }    
}

func stockCero(productos map[int]Producto) {
    fmt.Println("Listado de articulos con stock en cero:")
    for codigo, producto := range productos {
        if producto.stock == 0 {
            fmt.Println("Código:", codigo, " Datos:", producto)
        }
    }
}

func main() {
    productos := make(map[int]Producto)
    cargar(productos)
    imprimir(productos)
    consulta(productos)
    stockCero(productos)
}

type Persona struct {
    nombre string
    edad int
}

func (persona *Persona) cargar() {
    fmt.Print("Ingrese el nombre de la persona:")
    fmt.Scan(&persona.nombre)
    fmt.Print("Ingrese la edad:")
    fmt.Scan(&persona.edad)
}

func (persona Persona) imprimir() {
    fmt.Println("Nombre:", persona.nombre)
    fmt.Println("Edad:", persona.edad)
}

func (persona Persona) esMayor() {
    if persona.edad >= 19 {
        fmt.Println(persona.nombre, "es mayor de edad")
    } else {
        fmt.Println(persona.nombre, "no es mayor de edad")
    }
}


func personas() {
    var persona1, persona2 Persona
    persona1.cargar()
    persona1.imprimir()
    persona1.esMayor()
    persona2.cargar()
    persona2.imprimir()
    persona2.esMayor()    
}