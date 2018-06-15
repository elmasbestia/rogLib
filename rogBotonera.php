<?php
// Botonera para manejar la IU de rogRegistro

// Los iconos usados por este objeto necesitan de la fuente AWESOME:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

Class rogBoton {
	private $texto = "(texto)";
	private $icono = "fa-question-circle-o";
	private $habilitado = false;
	private $fn = null;
	private $filtro = "";
	
	function funcion ($btnTexto) {
		switch ($btnTexto) {
			case "Anterior":
				$retorno = function() {};
				break;
			case "Siguiente":
				$retorno = function() {};
				break;
			case "Imprime":
				$retorno = "javascript:send('Imprimir')";
				break;
			case "Limpia":
				$retorno = function() {};
				break;
			case "Cancela":
				$retorno = function() {};
				break;
			case "Elimina":
				$retorno = function() {};
				break;
			case "Busca":
				$retorno = function() {};
		}
		return $retorno;
	}
	
	function __construct($texto, $icono) {
		$texto = $texto;
		$icono = $icono;
		$fn = $this->funcion($texto);
	}
	
	function muestra() {
		// "<input type='button' class='rogBtn' name='btncancela' value= 'Cancelar'/>"
		return "<i class= 'fa $this->icono fa-large rogBtn' title='$this->titulo'></i>";
	}
}

Class rogBotonera {
	private $botonesRs = false;
	private $botones = [];
	private $rs = null;
	private $btnBsq = null;
	
	function __construct($rs, $botonesRs = true) {
		$this->botonesRs = $botonesRs;
		$this->rs = $rs;
		
		if ($botones) {
			$this->botones[] = new rogBoton("Anterior","fa-chevron-circle-left");
			$this->botones[] = new rogBoton("Agregar","fa-plus-square");
        }
		$this->botones[] = new rogBoton("Procede","fa-check-square-o");
		$this->botones[] = new rogBoton("Imprime","fa-print"); // onClick='javascript:send('Imprimir');'
		$this->botones[] = new rogBoton("Limpia","fa-square-o");
		$this->botones[] = new rogBoton("Cancela","fa-close");
        if ($botonesRs) {
			$this->botones[] = new rogBoton("Siguiente","fa-chevron-circle-right");
		}

		$this->btnBsq = new rogBoton("Busca","fa-search");
		
        $txt .= "<span class='error'><small>* Campo requerido.</small></span>";
	}
	
	function muestra() {
        $txt = "<fieldset>";
        foreach($this->botones as $boton) {
			$txt .= $boton->muestra();
		}
		$txt .= "<span>";
		$txt .= "<label for='nRegs'>Nro. de Registros</label>";
		$txt .= "<input type='text' id='rognRegs' name='rognRegs' value='$this->rs->nRegs()'/>";
		$txt .= "<label for='nRegs'>"+$this->btnBsq->muestra()+"</label>";
		$txt .= "<input type='text' id='rogNroReg' name='rogNroReg' value='$nroReg' form='rogFormulario'/>";
		$txt .= "</span>";
		
        $txt .= "<span class='error'><small>* Campo requerido.</small></span>";
        $txt .= "<div id='rogtxtFiltro'></div>";
        $txt .= "</fieldset>";
        
        return $txt;
	}
}
?>
