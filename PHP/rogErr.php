<?php
// Prepara el manejo de Errores

    //error handler function
    error_reporting(E_ALL);
    ini_set('display_errors','On');
    
    function mstError($errno, $errstr, $errfile, $errline) {
        echo "<div style='background-color: #FFecec; color: red'>";
        echo "<b>Error:</b> [$errno] $errstr";
        echo " Error en la linea <strong>$errline</strong> en $errfile<br>";
        echo "<hr>";
        echo "</div>";
    }

    set_error_handler("mstError");

?>