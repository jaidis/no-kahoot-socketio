// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +
// + Variables para usar con el cliente
// +
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var socket = io();
var nick;
var room;
var numeroPregunta = 0;
var respuestaCorrecta;

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +
// + Ocultando elementos visibles
// +
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$('#esperando').hide();
$('#confirmar').hide();
$('#jugar').hide();
$('#terminando').hide();
$('#ganador').hide();
$('#chatSala').hide();

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +
// + Captar nick y sala
// +
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$('#buttonUsuarios').on('click', function() {
  nick = $('#nickname').val();
  room = $('#room').val();
  if (nick != '' && room != '') {
    // console.log(`Enviando ` + nick + ` a la sala ` + room);
    let datos = {
      usuario: nick,
      sala: room
    };
    socket.emit('new-usuario', datos);
    $('#nick').hide();
    $('#esperando').show();
    $('#chatSala').show();
    $('#ganador').hide();
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +
// + Captar eventos del chat como enviar mensajes y maquetarlos
// +
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$('#mensajeSala').keypress(function( event ) {
  if ( event.which == 13 ) {
     event.preventDefault();
     $('#buttonEnviar').click();
  }
});
$('#buttonEnviar').on('click', function() {
  let msg = $('#mensajeSala').val();
  // console.log(msg);
  socket.emit('mensaje', msg);
  $('#mensajeSala').val('');
});

socket.on('maquetaMensaje', (infoMensaje) => {
  // console.log(infoMensaje);
  $('.cajaMensajes').append('<li class="mensaje"><strong>'+ infoMensaje[0].usuario +'</strong> : <em>'+ infoMensaje[0].mensaje +'</em></li>');
  $('.mensaje:odd').addClass('pares');
  $('.mensaje:even').addClass('impares');
  $('.cajaMensajes').scrollTop($('.cajaMensajes')[0].scrollHeight);
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +
// + Mostrar mensaje de espera a que se conecte otro usuario a la sala
// +
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

socket.on('esperarJuego', (value) => {
  if (value) {
    $('#esperando').hide();
    $('#jugar').hide();
    $('#confirmar').show();
    $('#buttonConfirmar').prop('disabled', false);
    $('#terminando').hide();
    $('#ganador').hide();
  } else {
    $('#esperando').show();
    $('#confirmar').hide();
    $('#jugar').hide();
    $('#terminando').hide();
    $('#buttonConfirmar').prop('disabled', false);
    $('#ganador').hide();
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +
// + Captar botón de confirmación para iniciar partida
// +
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$('#buttonConfirmar').on('click', function() {
  // console.log(room);
  socket.emit('confirmado', true);
  $(this).prop('disabled', true);

});

socket.on('confirmadoGrupo', (value) => {
  socket.emit('confirmadoGrupo', true);
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +
// + Iniciar partida
// +
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

socket.on('jugar', (value) => {
  if (value) {
    window.scrollTo(0, 0);
    nPregunta = 0;
    socket.emit('pregunta', nPregunta);
    $('#confirmar').hide();
    $('#ganador').hide();
  } else {
    $('#jugar').hide();
    $('#esperando').show();
    $('#confirmar').hide();
    $('#terminando').hide();
    $('#buttonConfirmar').prop('disabled', false);
    $('#ganador').hide();
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +
// + Cargar las preguntas del listado de preguntas y captar las posibles
// + respuestas que se van generando
// +
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

socket.on('nPregunta', function(datos) {
  numeroPregunta = parseInt(datos.id);
  $('#numero').html('Pregunta ' + datos.id);
  $('#pregunta').html(datos.pregunta);
  $('#Button1').data('respuesta', 'a');
  $('#Button1').html(datos.a);
  $('#Button2').data('respuesta', 'b');
  $('#Button2').html(datos.b);
  $('#Button3').data('respuesta', 'c');
  $('#Button3').html(datos.c);
  $('#Button4').data('respuesta', 'd');
  $('#Button4').html(datos.d);
  $('#jugar').show();
  respuestaCorrecta = datos.correcta;
});
$('#Button1').on('click', () => {
  if ($('#Button1').data('respuesta') == respuestaCorrecta) {
    console.log('Respuesta correcta A');
    //Emite 3 puntos
    let valorRespuesta = 3;
    socket.emit('correcta', valorRespuesta);
  } else {
    let valorRespuesta = -2;
    //Emite -2 puntos;
    socket.emit('incorrecta', valorRespuesta);
  }
  socket.emit('pregunta', numeroPregunta);
});
$('#Button2').on('click', () => {
  if ($('#Button2').data('respuesta') == respuestaCorrecta) {
    console.log('Respuesta correcta B');
    //Emite 3 puntos
    let valorRespuesta = 3;
    socket.emit('correcta', valorRespuesta);
  } else {
    let valorRespuesta = -2;
    //Emite -2 puntos;
    socket.emit('incorrecta', valorRespuesta);
  }
  socket.emit('pregunta', numeroPregunta);
});
$('#Button3').on('click', () => {
  if ($('#Button3').data('respuesta') == respuestaCorrecta) {
    console.log('Respuesta correcta C');
    //Emite 3 puntos
    let valorRespuesta = 3;
    socket.emit('correcta', valorRespuesta);
  } else {
    let valorRespuesta = -2;
    //Emite -2 puntos;
    socket.emit('incorrecta', valorRespuesta);
  }
  socket.emit('pregunta', numeroPregunta);
});
$('#Button4').on('click', () => {
  if ($('#Button4').data('respuesta') == respuestaCorrecta) {
    console.log('Respuesta correcta D');
    //Emite 3 puntos
    let valorRespuesta = 3;
    socket.emit('correcta', valorRespuesta);
  } else {
    let valorRespuesta = -2;
    //Emite -2 puntos;
    socket.emit('incorrecta', valorRespuesta);
  }
  socket.emit('pregunta', numeroPregunta);
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +
// + Mostrar mensaje de espera hasta mostrar el final del juego e
// + indicar que al resto de jugadores de la sala que se ha terminado
// +
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

socket.on('acabado', (valorAcabado) => {
  if (valorAcabado) {
    // console.log('Se ha terminado');
    $('#nick').hide();
    $('#esperando').hide();
    $('#confirmar').hide();
    $('#jugar').hide();
    $('#terminando').show();
    $('#ganador').hide();
    socket.emit('acabado', true);
  } else {
    console.log('No se ha acabado?!');
  }
});
socket.on('acabadoGrupo', (value) => {
  socket.emit('acabadoGrupo', true);
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +
// + Mostrar puntuación y ganador de la ronda, permite cerrar la
// + conexión con la sala e iliminar el jugador del listado
// +
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

socket.on('puntuacion', (valor) => {
  socket.emit('renderizarPuntuacion', true);
});

socket.on('ganador', (valor) => {
  // console.log(valor);
  // console.log(valor[0].nGanador);
  $('#nGanador').html(valor[0].nGanador);
  $('#pGanador').html(valor[0].pGanador);
  $('#nPerdedor').html(valor[0].nPerdedor);
  $('#pPerdedor').html(valor[0].pPerdedor);
  $('#nick').hide();
  $('#esperando').hide();
  $('#confirmar').hide();
  $('#jugar').hide();
  $('#terminando').hide();
  $('#ganador').show();
});

$('#buttonCerrar').on('click', () => {
  socket.emit('salir', true);
  $('#nick').show();
  $('#ganador').hide();
  $('#chatSala').hide();
  $('.cajaMensajes').empty('');
});
