/*
    Estatistiques sur a fichier quelconque
*/

const XL = require("./rogXL.js");

const prms = {
    LimiteDeTamano: 0, 
    MaxV: 0, 
    Todos: false, 
    Limite: false,
    autres: false;
    fecha: false;    // Piratería por URGENCIA
} 

function Calcula(campo, Cruce, Tabla) {
    let SQL = "", SQLNum = ""
    let expresion = ""
    let nbcampo = "[" + campo.Name + "]"
    console.log(nbcampo)

    If (VaPalBaile(campo)) {
        SQL = "Select " + IIf(Cruce = Empty, "''", "[" + Cruce + "]") + " as Cruce, '" + campo.Name + "' As Campo, Count(*) as NRegs, Sum(iif(isnull(" + nbcampo + "),1,0)) as Nul, Sum(iif(isnull(" + nbcampo + "),0,1)) as NoNul, Min(" + nbcampo + ") as Min, Max(" + nbcampo + ") as Max"
        If (campo.Type = dbText) {
            If (campo.Size > prms.LimiteDeTamano ) {
                expresion = "Left(" + nbcampo + ", " + prms.LimiteDeTamano + ")"
            ] else {
                expresion = nbcampo;       
            }
        } else if ((campo.Type = dbDate) || (campo.Type = dbBoolean)) expresion = nbcampo
        else {
            expresion = nbcampo
            SQLNum = ", Sum(" + nbcampo + ")as Total, Avg(" + nbcampo + ")as Moy, Var(" + nbcampo + ")as VAR, StDev(" + nbcampo + ")as DE"   // Farta la Mediana:  Med
        }
            
        QS = await bd.lee (SQL + SQLNum + " from [" + Tabla + "] " + IIf(Cruce = Empty, Cruce, "Group by [" + Cruce + "];")
        QG = await bd.lee("Select " + IIf(Cruce = Empty, "''", "[" + Cruce + "]") + " as Cruce, '" + wcampo.Name + "' As Campo, " + expresion + " As VALOR, Count(*) as NRegs " + " from [" + Tabla + "] Group by " + (Cruce ? " [" + Cruce + "], " : "") + expresion)
    }
        
    return { QS, QG }
}

function VaPalBaile(campo) {
    ' No se procesan los campos memo u Ole, o texto muy grandes (más de x car.)
    let retorno = false
    
    switch (campo.Type) {
        Case dbMemo:
        Case dbLongBinary:
            retorno = False
            break;
        Case dbText:
            retorno = prms.Limite ? campo.Size <= prms.LimiteDeTamano : True
            break;
        default:
            retorno = True
    }
    
    return retorno
}

function Calc_Med() {
    // Calcula la Mediana y el No.de Grupos
    let Campos As Recordset, Grupos As Recordset
    let nGrupos As Long, Mediana
    let posicion As Long, van As Long, aunno As Boolean
    let mismocruce As Boolean, mismoCampo As Boolean
    let wCruce
    
    let Campos = QS.srtCompara("Cruce, Campo")
    let Grupos = QG.srtCompara("Cruce, Campo, Valor")
    
    ' La mediana es el valor que está en la mitad de los datos en fila ordenada
    posicion = Campos.length / 2
    Campos.forEach()
    Do While Not Campos.EOF
        console.log( "Grupo: "); Grupos!Cruce
        mismocruce = (Grupos!Cruce = Campos!Cruce)
        Do While mismocruce
            console.log( "** ", Campos.Cruce, Campos.campo)
            nGrupos = 0
            Mediana = 0
            van = 0
            aunno = True
            mismoCampo = (Campos!campo = Grupos!campo)
            Do While mismoCampo And mismocruce
                nGrupos = nGrupos + 1
                If aunno Then
                    van = van + Grupos!nregs
                    If van >= posicion Then
                        aunno = False
                        Mediana = Grupos!valor
                    End If
                End If
                Grupos.MoveNext
                If Not Grupos.EOF Then
                    mismoCampo = (Nz(Campos!campo) = Nz(Grupos!campo))
                    mismocruce = (Nz(Campos!Cruce) = Nz(Grupos!Cruce))
                Else
                    mismoCampo = False
                    mismocruce = False
                End If
            Loop
            ' Actualiza
            Campos.Grp = nGrupos
            Campos.Med = Mediana

            Campos.MoveNext
            
            If Campos.EOF Then
                mismocruce = False
            End If
        Loop
    Loop
}

function Porcentaje(numerico As Boolean, Total, Cantidad, TotalTotal, CantidadTotal) {
    let wPorcentaje As Double
    
    If numerico Then    ' El porcentaje es la razón entre el monto y el Total
        If Nz(TotalTotal) = 0 Then
            wPorcentaje = 0
        Else
            wPorcentaje = Total / TotalTotal
        End If
    Else                ' El porcentaje es con respecto a la cantidad
        If CantidadTotal = 0 Then
            wPorcentaje = 0
        Else
            wPorcentaje = Cantidad / CantidadTotal
        End If
    End If
    
    Porcentaje = wPorcentaje
}

function tipo(nbTabla As String, campo As String, numerico As Boolean) {
    let wtipo As String
    
    numerico = False
    fecha = False
    
    Select Case CurrentDb(nbTabla)(campo).Type
        Case dbText
            wtipo = "CARACTERE"
        Case dbDate
            fecha = True
            wtipo = "DATE"
        Case dbBoolean
            wtipo = "LOGIQUE"
        Case Else
            numerico = True
            wtipo = "NUMERIQUE"
    End Select

    tipo = Trad(wtipo, IdiomaSalida)
}

function ExprCampo(nbTabla As String, campo As String, valor) {
    let retorno As String
    
    Select Case CurrentDb(nbTabla)(campo).Type
        Case dbText
            retorno = Chr$(34) & valor & Chr$(34)
        Case dbDate
            retorno = "#" + Format$(valor, "mm/dd/yyyy") + "#"
        Case dbBoolean
            retorno = valor
        Case Else
            retorno = valor
    End Select
    
    ExprCampo = retorno
}

function DefineColumnas(aCols As Collection, numerico As Boolean)
    let x As Integer
    
    For x = 1 To aCols.Count: aCols.Remove 1:    Next

    AgregaElemento aCols, "NRegs", "Nul", "NoNul", "Grp", "Min", "Max"
    If autres Then AgregaElemento aCols, "Autres"
    If numerico Then AgregaElemento aCols, "TOTAL", "Moy", "Med", "DE", "VAR"
}

function AgregaElemento(Col, ...Elementos) {
    Elementos.forEach(Nuevo => Col.push(Nuevo))
}

function ImprimeXL(nbArchivo As String, Cruce, Filtro As String, Hoja As Object, Datos As Recordset, Grupos As Recordset, Idioma) {
    let Columnas As Collection, Col
    let x As Integer, xFila As Integer, xCol As Integer
    let numerico As Boolean
    let campo As Field, Nombre As String, nbLargo As String
    let wCruce, mismocruce As Boolean
    
    Hoja.cells(1, 1) = nbArchivo
    Hoja.cells(2, 1) = Now
    Hoja.cells(3, 1) = Filtro
    Hoja.cells.font.Bold = True
    Hoja.cells.font.Size = 8
    
    xFila = 4
    Do While Not Datos.EOF
        wCruce = Datos!Cruce
        mismocruce = True
        If wCruce > Empty Then
            xFila = xFila + 1
            Hoja.cells(xFila, 1) = Cruce
            xFila = xFila + 1
            Hoja.cells(xFila, 1) = wCruce
            Hoja.cells(xFila, 1).font.Size = 14
        End If
        
        Do While mismocruce
            Nombre = Datos!campo
            nbLargo = NombreLargo(nbArchivo, Datos!campo)
        
            xFila = xFila + 1
            Hoja.cells(xFila, 1) = Nombre + "     (" + Trad(tipo(nbArchivo, Nombre, numerico), IdiomaSalida) + ")"
            Hoja.cells(xFila, 1).font.Size = 12
        
            If nbLargo <> Nombre Then
                xFila = xFila + 1
                Hoja.cells(xFila, 1) = nbLargo
                Hoja.cells(xFila, 1).font.Bold = True
            End If
            Set Columnas = New Collection
            DefineColumnas Columnas, numerico
            ' Ciclo de Etiquetar chaque colomne
            xFila = xFila + 1
            xCol = 0
            For Each Col In Columnas
                xCol = xCol + 1
                Hoja.cells(xFila, xCol) = Trad((Col), IdiomaSalida)
                Hoja.cells(xFila, xCol).font.Bold = True
                Hoja.cells(xFila, xCol).font.Size = 8
                If Col <> "autres" Then Hoja.cells(xFila + 1, xCol) = IIf(numerico, Val(Nz(Datos(Col))), Nz(Datos(Col)))
            Next

            xFila = xFila + 1
            Hoja.Range(Rango(xFila - 1, 1, xFila, xCol)).BorderAround 1, 3

            MuestraGrupos Hoja, Datos, Grupos, numerico, xFila

            Datos.MoveNext
            If Datos.EOF Then
                mismocruce = False
            Else
                mismocruce = (Nz(Datos!Cruce) = Nz(wCruce))
            End If
        Loop
    Loop
}

function MuestraGrupos(Hoja As Object, Datos As Recordset, Grupos As Recordset, numerico As Boolean, xFila As Integer) {
    let Tranches As Boolean, mismoCampo As Boolean
    let rsTranches As Recordset
    let xValor As Integer, xTranche As Integer, xtotal As Integer, xcant As Integer, xPorc As Integer
    let xCol As Integer
    let wTotal As Double, wCant As Long
    let minimo, maximo, valor
    let paso As Double, aTranches() As Double, buscalimite As Boolean
    Const xlimite = 0, xtcant = 1, xttotal = 2
    autres = False
    
    'Definir los tranches
    ' tranches = Numérico y extenso
    Tranches = (numerico Or fecha) And (Datos!Grp > MaxV)
    If Tranches Then
        If numerico Then
            maximo = Val(Datos!max)
            minimo = Val(Datos!min)
        Else
            maximo = CDate(Datos!max)
            minimo = CDate(Datos!min)
        End If
        paso = Int(((maximo - minimo) + (maximo / 10)) / 10)
        Relet aTranches(10, 2) As Double
        aTranches(10, xlimite) = maximo
        For xTranche = 9 To 1 Step -1
            aTranches(xTranche, xlimite) = aTranches(xTranche + 1, xlimite) - paso
        Next
    End If
    
    xFila = xFila + 1
    xValor = xFila
    If numerico Or Tranches Then
        xFila = xFila + 1
        xtotal = xFila
    End If
    xFila = xFila + 1:  xcant = xFila
    xFila = xFila + 1:  xPorc = xFila
    xCol = 1
    Hoja.cells(xValor, xCol) = Trad(IIf(Tranches, "Limite", "Valeur"), IdiomaSalida)
    If numerico Then Hoja.cells(xtotal, xCol) = Trad("Total", IdiomaSalida)
    Hoja.cells(xcant, xCol) = Trad("Numero", IdiomaSalida)
    Hoja.cells(xPorc, xCol) = "%"

    If Not Grupos.EOF Then mismoCampo = (Datos!campo = Grupos!campo)
    ' für den tranches
    If Tranches Then
        Do While mismoCampo And Not Grupos.EOF
            If IsNull(Grupos!valor) Then
                xTranche = 0
            Else
                buscalimite = True
                xTranche = 1
                Do While buscalimite
                    If numerico Then
                        valor = Val(Grupos!valor)
                    Else
                        valor = CDate(Grupos!valor)
                    End If
                    buscalimite = (valor > aTranches(xTranche, xlimite))
                    If buscalimite Then
                        xTranche = xTranche + 1
                        buscalimite = (xTranche < 10)
                    End If
                Loop
            End If
                
            aTranches(xTranche, xttotal) = aTranches(xTranche, xttotal) + Grupos!nregs * Val(Nz(Grupos!valor))
            aTranches(xTranche, xtcant) = aTranches(xTranche, xtcant) + Grupos!nregs
            Grupos.MoveNext
            If Not Grupos.EOF Then mismoCampo = (Datos!campo = Grupos!campo)
        Loop
                
        ' Muestra los "tranches"
        For xTranche = 0 To 10
            xCol = xCol + 1
            If xTranche = 0 Then
                Hoja.cells(xValor, xCol) = Trad("Vacio", wIdioma)
            Else
                Hoja.cells(xValor, xCol) = aTranches(xTranche, xlimite)
                If fecha Then Hoja.cells(xValor, xCol).numberFormat = "dd/mm/yyyy"
            End If
                
            Hoja.cells(xtotal, xCol) = aTranches(xTranche, xttotal)
            Hoja.cells(xcant, xCol) = aTranches(xTranche, xtcant)
            Hoja.cells(xPorc, xCol) = Porcentaje(numerico, aTranches(xTranche, xttotal), aTranches(xTranche, xtcant), Datos!Total, Datos!nregs)
        Next
    Else
        Do While mismoCampo And Not Grupos.EOF
            xCol = xCol + 1
            If (Todos Or (xCol <= MaxV)) And (xCol < 100) Then
            
                If IsNull(Grupos!valor) Then
                    Hoja.cells(xValor, xCol) = Trad("Vacio", wIdioma)
                Else
                    If numerico Then
                        Hoja.cells(xValor, xCol) = Val(Grupos!valor)
                    ElseIf fecha Then
                        Hoja.cells(xValor, xCol) = CDate(Grupos!valor)
                    Else
                        Hoja.cells(xValor, xCol) = Grupos!valor
                    End If
                End If
            
                If numerico Then wTotal = Grupos!nregs * Val(Nz(Grupos!valor))
                wCant = Grupos!nregs
            Else    ' Autres
                autres = True
                wTotal = 0
                wCant = 0
                Hoja.cells(xValor, xCol) = Trad("Autres", IdiomaSalida)
                Do While mismoCampo And Not Grupos.EOF
                    If numerico Then wTotal = wTotal + Grupos!nregs * Val(Nz(Grupos!valor))
                    wCant = wCant + Grupos!nregs
                    Grupos.MoveNext
                    If Not Grupos.EOF Then mismoCampo = (Datos!campo = Grupos!campo)
                Loop
            End If
            If numerico Then Hoja.cells(xtotal, xCol) = wTotal
            Hoja.cells(xcant, xCol) = wCant
            Hoja.cells(xPorc, xCol) = Porcentaje(numerico, wTotal, wCant, Datos!Total, Datos!nregs)
        
            If Not Grupos.EOF Then Grupos.MoveNext
            If Not Grupos.EOF Then mismoCampo = (Datos!campo = Grupos!campo)
        Loop
    End If
    ' Formatos
    Hoja.Range(Rango(xValor, 1, xPorc, xCol)).BorderAround 1, 2
    Hoja.Range(Rango(xPorc, 1, xPorc, xCol)).numberFormat = "0.00%"
}

// F u n c i o n e s   de Agrupar Datos

// P R O C E D E

functionProcedeXL(nbArchivo As String, Cruce As String, Filtro As String, nbArchXL As String, txtHojaXL As String) {
    if(args.len < 3) {
        console.log("Sintaxis: rogStat nombre_del_archivo_a_analizar nombre_del_archivo_XL.");
        process.exit(0);
    }
    
    const XL   = require("rogXL.js");
    const path = require("path");
    
    let nbArch = args[1];
    let nb     = path.parse(nbArch).name;
        
    let archivo = require(nbArch)
    let Hoja = new XL.Hoja(nbArch+"Stat", nb);    //' Abre la Hoja XL

    
    
    Set Datos = CurrentDb.OpenRecordset("Select * from QStatQS Order by Cruce, Campo")
    Set Grupos = CurrentDb.OpenRecordset("Select * from [QStatQSG] Order by Cruce, Campo, NRegs DESC, valor")

    ImprimeXL nbArchivo, Cruce, Filtro, Hoja, Datos, Grupos, wIdioma
    
    Grupos.Close
    Datos.Close
    
    Hoja.Libro.guarda();

    Set Hoja = Nothing
    Set Datos = Nothing
}
