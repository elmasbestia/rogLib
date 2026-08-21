
function objCorreo() {
    const nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tucartours@gmail.com',
            pass: 'paraErick'
        }
    });

    const firma = "\n\nQuedamos a tus órdenes.\n\n\n\nRafael Gómez, IT\nVenezuelan Aerobics Tucar Tours";

    const msjs = require("./mensajes.json");
    
    function txt(msj) {
        return "¡Hola, " +destinatario.Nombre 
        +(msj || msjs[destinatario.status]) 
        +firma
    }
    
    this.envia(destinatario, msj) {
        let retorno = { destinatario: destinatario };
         
        var mailOptions = {
            from: transporter.user,
            to: destinatario.Correo,
            subject: '',
            text: ''
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(mailOptions.to, error);
                retorno.error = error;
            } else {
                console.log('Enviado a ' +x.Nombre +': '+info.response);
            }
            //res.send(retorno);
            return retorno;
        });
       return retorno;
    }
}

function mndCorreo(destinatario,asunto,msj) {
    console.log ("Voy con " +destinatario.Nombre);
}
