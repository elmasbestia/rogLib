Option Explicit

Sub reune()
    Dim xfila As Integer
    Dim xactual As Integer
    Dim xcol As Integer
    Dim ultcol As Integer
    Dim sigue As Boolean
    Dim igual As Boolean
    Dim hoja As Worksheet
    
    Set hoja = Hoja10
    ultcol = hoja.UsedRange.Columns.Count
    xfila = 2
    sigue = True
    Do While sigue
        If hoja.Cells(xfila, 1).Value = Empty Then
            sigue = False
        Else
            xactual = xfila
            Debug.Print hoja.Cells(xfila, 1).Value
            igual = True
            Do While igual
                xfila = xfila + 1
                If hoja.Cells(xfila, 1).Value = hoja.Cells(xactual, 1).Value Then
                    For xcol = 2 To ultcol
                        If hoja.Cells(xfila, xcol).Value > Empty Then
                            hoja.Cells(xactual, xcol).Value = hoja.Cells(xfila, xcol).Value
                            hoja.Cells(xfila, xcol).Value = Empty
                        End If
                    Next
                Else
                    igual = False
                End If
            Loop
        End If
    Loop
    
    MsgBox "¡Listo!"
End Sub

