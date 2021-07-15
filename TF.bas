Attribute VB_Name = "M�dulo1"
Option Explicit

Function LLAPSO(p_fdesde As Date, p_1)
'* Objetivo :  N�mero de d�as laborales entre dos fechas  o
'*             fecha final de un lapso de d�as laborales.
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
'* Objetivo : Buscar la tabla de d�as feriados para un a�o dado
'* Fecha    : 10:24:05  2/7/1991 - 9/9/99 19:59
  Dim RSTF As New Recordset
  
  RSTF.Open ("Select * from D�asFeriados where Ano = " & p_ano), Conexion
  If RSTF.EOF Then
      TF = "aAdSeAfXgEgXjLlY"
      If MsgBox("�No encontr� la Tabla de d�as feriados del a�o " & p_ano & " ! �La Creamos ?", vbYesNo, "Tabla de D�as Feriados") = vbYes Then
        Conexion.Execute ("Insert into D�asFeriados (Ano,Feriados) values (" & p_ano & ", '" & TF & "')")
      End If
   Else
      TF = RSTF!Feriados
   End If
   RSTF.Close:  Set RSTF = Nothing
End Sub

