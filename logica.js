const math = require('mathjs');                  // Cargamos la librería math.js
const remote = require('electron').remote;       // Cargamos remote de Electron
const calApp = remote.require('./disparador.js');// Cargamos el objeto de la aplicacion.


$(function() {
	$('input.in').focus();
});

$('table tr td').click(function () {
	let tecla = $(this).text();
	let tecla = $.trim(tecla);
	let input = $('input.in').val();
	if (tecla == '=') {
		var r = math.eval(input);
		$('input.in').val(r);
		return;
	}
	$('input.in').val(input + tecla);
});

$('button.cerrar').click(function(){
	calApp.app.quit();
});
$('button.minimizar').click(function(){
	calApp.win.minimize();
});

$('input.in').keydown(function (e) {
	let codigo = e.which;
	if (codigo>47 && codigo<58) {
		return;
	}
	if (codigo == 13 ) { // tecla enter
		$('#igual').click();
	}else if (codigo == 27 ) { // tecla esc
		$('input.in').val('');
	}
	var permitidos = [8,9,37,38,106,107,109,187];
	if (permitidos.indexOf(codigo) != -1) {
		return;
	}
	console.log(codigo);
	e.preventDefault();
});
