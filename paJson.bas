Attribute VB_Name = "paJson"
Option Compare Database
Option Explicit

Sub convierteBD()
    Dim x As Integer
    Dim tablas As Recordset, nbTab As String
    Dim yaEstan() As String, nXst As Integer, y As Integer
    
    revisaExistentes yaEstan
    On Error Resume Next
    nXst = UBound(yaEstan)
    If Err Then On Error GoTo 0
    
    Set tablas = CurrentDb.OpenRecordset("SELECT MSysObjects.* FROM MSysObjects where Flags = 0 and id > 0;")
    Do While Not tablas.EOF
        x = x + 1
        nbTab = tablas!Name
        If yaEsta(nbTab, yaEstan) Then
            Debug.Print x; "- "; nbTab
        Else
            Debug.Print x; ". "; nbTab
            convierteTab (tablas!Name)
        End If
        tablas.MoveNext
    Loop
    tablas.Close
End Sub

Sub convierteTab(nbTabla)
    Dim x As Integer
    Dim tabla As Recordset
    Dim txt As String
    Dim nCampos As Integer
    Dim valor
    
    x = 0
    Set tabla = CurrentDb.OpenRecordset(nbTabla)
    nCampos = tabla.Fields.Count
    
    txt = "["
    
    Do While Not tabla.EOF
        x = x + 1
        txt = txt + "{"
        For x = 0 To nCampos - 1
            valor = tabla.Fields(x).Value
            txt = txt + entreComillas(tabla.Fields(x).Name) + ": " + entreComillas(valor) + ", "
        Next
        txt = Left$(txt, Len(txt) - 2) + "}, "
        tabla.MoveNext
    Loop
    
    If txt = "[" Then
        txt = txt + "{"
        For x = 0 To nCampos - 1
            txt = txt + entreComillas(tabla.Fields(x).Name) + ": """""", "
        Next
        txt = Left$(txt, Len(txt) - 2) + "}]"
    Else
        txt = Left$(txt, Len(txt) - 2) + "]"
    End If
    
    Guarda nbTabla, txt
    
    tabla.Close
End Sub

Function entreComillas(valor) As String
    entreComillas = Chr$(34) & valor & Chr$(34)
End Function

Sub Guarda(nb, txt)
    Open nb + ".json" For Output As #1
    Print #1, txt
    Close #1
End Sub

Sub revisaExistentes(archivos)
    Dim directorio As String
    Dim nbArch As String
    Dim x As Integer
    
    nbArch = dir("*.json")
    Do While nbArch > Empty
        x = x + 1
        'Debug.Print x, nbArch
        ReDim Preserve archivos(x)
        archivos(x) = nbArch
        
        nbArch = dir
    Loop
End Sub

Function yaEsta(elemento, arreglo) As Boolean
    Dim retorno As Boolean
    Dim n As Integer, x As Integer
    Dim nb As String
    
    nb = extraeNb(elemento)
    On Error Resume Next
    n = UBound(arreglo)
    If Err Then Exit Function
    
    For x = 1 To n
        retorno = arreglo(x) = nb
        If retorno Then Exit For
    Next
        
    yaEsta = retorno
End Function

Function extraeNb(nbCompleto) As String
    Dim pos As Integer
    
    pos = InStr(".", nbCompleto)
    extraeNb = Mid$(nbCompleto, pos + 1)
End Function
