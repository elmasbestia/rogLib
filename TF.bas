Attribute VB_Name = "Módulo1"
Option Explicit

Function LLAPSO(p_fdesde As Date, p_1)
'* Objetivo :  Número de días laborales entre dos fechas  o
'*             fecha final de un lapso de días laborales.
  Dim f_hasta As Date, ndias As Integer, f2 As Date, SIGNO, retorno, xdia

  If TypeName(p_1) = "Date" Then
     ndias = 0
     If p_fdesde < p_1 Then
        f_hasta = p_fdesde
        f2 = p_1
        SIGNO = 1
     Else
        f_hasta = p_1
        f2 = p_fdesde
        SIGNO = -1
     End If
     Do While f_hasta < f2
        If LABORAL(f_hasta) Then
           ndias = ndias + 1
        End If
        f_hasta = f_hasta + 1
     Loop
     retorno = ndias * SIGNO
  Else
     xdia = 0
     f_hasta = p_fdesde
     Do While p_1 > xdia
        If LABORAL(f_hasta) Then
           xdia = xdia + 1
        End If
        f_hasta = f_hasta + 1
     Loop
     Do While Not LABORAL(f_hasta)
        f_hasta = f_hasta + 1
     Loop
     retorno = f_hasta
  End If
  LLAPSO = retorno
End Function


Function LABORAL(p_fecha As Date) As Boolean
'* Objetivo :  Reconocer fecha laboral
  LABORAL = Not ((InStr(TF, (Chr$(96 + Month(p_fecha)) + Chr$(64 + Day(p_fecha)))) > 0) Or (Weekday(p_fecha, vbMonday) > 5))
End Function

Sub tablaf(p_ano)
'* Objetivo : Buscar la tabla de días feriados para un año dado
'* Fecha    : 10:24:05  2/7/1991 - 9/9/99 19:59
  Dim RSTF As New Recordset
  
  RSTF.Open ("Select * from DíasFeriados where Ano = " & p_ano), Conexion
  If RSTF.EOF Then
      TF = "aAdSeAfXgEgXjLlY"
      If MsgBox("¡No encontré la Tabla de días feriados del año " & p_ano & " ! ¿La Creamos ?", vbYesNo, "Tabla de Días Feriados") = vbYes Then
        Conexion.Execute ("Insert into DíasFeriados (Ano,Feriados) values (" & p_ano & ", '" & TF & "')")
      End If
   Else
      TF = RSTF!Feriados
   End If
   RSTF.Close:  Set RSTF = Nothing
End Sub

