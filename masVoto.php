<?php
/**
 * Obtiene el detalle de una meta especificada por
 * su identificador "idMeta"
 */

require 'votos.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    if (isset($_GET['idMeta'])) {

        // Obtener parámetro idMeta
        $parametro = $_GET['idMeta'];

        // Tratar retorno
        $retorno = Voto::getById($parametro);


        if ($retorno) {

            $meta["estado"] = "1";
            $meta["meta"] = $retorno;
            // Enviar objeto json de la meta
            print json_encode($meta);
        } else {
            // Enviar respuesta de error general
            print json_encode(
                array(
                    'estado' => '2',
                    'mensaje' => 'No se obtuvo el registro'
                )
            );
        }

    } else {
        // Enviar respuesta de error
        print json_encode(
            array(
                'estado' => '3',
                'mensaje' => 'Se necesita un identificador'
            )
        );
    }
}
?>