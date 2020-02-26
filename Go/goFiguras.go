package main

import "fmt"

type Figura interface {
    Perimetro()
    Superficie()
}

type Cuadrado struct {
    Lado int
}

type Rectangulo struct {
    LadoMenor int
    LadoMayor int
}

func (cuad Cuadrado) Perimetro() {
    fmt.Println("El perímetro del cuadrado de lado:", cuad.Lado, " es ", cuad.Lado * 4)
}

func (cuad Cuadrado) Superficie() {
    fmt.Println("La superficie del cuadrado de lado:", cuad.Lado, " es ", cuad.Lado * cuad.Lado)    
}

func (rect Rectangulo) Perimetro() {
    fmt.Println("El perímetro del rectángulo de lado menor:", rect.LadoMenor," y lado mayor:", rect.LadoMayor, " es ", (rect.LadoMayor * 2) + (rect.LadoMenor * 2))
}

func (rect Rectangulo) Superficie() {
    fmt.Println("La superficie del rectángulo de lado menor:", rect.LadoMenor, " y lado mayor:", rect.LadoMayor, " es ", rect.LadoMenor * rect.LadoMayor)
}

func Calcular(fig [3]Figura) {
    for f := 0; f < len(fig); f++ {
        fig[f].Superficie()
        fig[f].Perimetro()
    }
}

func main() {
    var vec [3] Figura
    vec[0] = Cuadrado{Lado: 10}
    vec[1] = Cuadrado{Lado: 6}
    vec[2] = Rectangulo{LadoMenor: 10, LadoMayor: 20}
    Calcular(vec)
}