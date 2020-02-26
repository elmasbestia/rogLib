package main

import "fmt"

func main() {
    var sueldos [5]int
    for f := 0; f < 5; f++ {
        //fmt.Print("Ingrese valor del sueldo:")
        //fmt.Scan(&sueldos[f])
        sueldos[f] = f * f * 10000
    }
    fmt.Println("Listado de sueldos.")
    fmt.Println(sueldos)
}

func recorreMap() {
    paises := map[string]int{
        "argentina" : 40000000,
        "españa"    : 46000000,
        "brasil"    : 190000000,
        "uruguay"   : 3400000,
    }
    for clave, valor := range paises {
        fmt.Println("Clave:", clave, " Valor:", valor)
    }
}