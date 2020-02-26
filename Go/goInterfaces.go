package main

import "fmt"

type Punto interface {
    Imprimir()
}

type PuntoPlano struct {
    x, y int
}

type PuntoEspacio struct {
    x, y, z int
}

func (p PuntoPlano)Imprimir() {
    fmt.Println(p.x, p.y)
}

func (p PuntoEspacio)Imprimir() {
    fmt.Println(p.x, p.y, p.z)
}

func Recorrer(vec [2]Punto) {
    for f := 0; f < len(vec); f++ {
        vec[f].Imprimir()
    }
}


func main() {
    var vec [2]Punto
    vec[0] = PuntoPlano{x:3,y:3}
    vec[1] = PuntoEspacio{x:1,y:2,z:3}
    Recorrer(vec)
}

