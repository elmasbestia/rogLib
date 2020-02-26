package main

import "fmt"

func main() {
    var horasTrabajadas int
    var costoHora float32
    var sueldo float32

    fmt.Print("Ingrese las horas trabajadas por el empleado:")
    fmt.Scan(&horasTrabajadas)
    fmt.Print("Ingrese el pago por hora:")
    fmt.Scan(&costoHora)
    sueldo=float32(horasTrabajadas) * costoHora
    fmt.Print("El sueldo total del operario es ",sueldo)
}