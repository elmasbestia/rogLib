rogSMS

No es un objeto: es un servicio

1. Permite envíar SMS a cualquier número
2. Recibe respuestas a los SMS
3. Rastrea las respuestas y emite alertas si no se contestan en t
4. Implica que existe una Central de Mensajes que monitorea las interacciones (svrSMS)
5. Si el SMS no pudo ser enviado, se llama a la función de respuesta indicando el error correspondiente
6. buffer del SMS:
	texto, 
      	numero, 
      	fnRespuesta, 
      	fnAlerta = () => alert(`${rogFmt.tlf(numero)} no respondió `),
      	t,


