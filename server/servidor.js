// Iniciando el servidor con sus variables

// let express = require('express')
// let app = express();
// let http = require('http');
// let server = http.Server(app);
// let socketIO = require('socket.io');
// let io = socketIO(server);
// let path = require('path');
//
// //Sirviendo la web dentro de la carpeta public
// const port = process.env.PORT || 3000;
// app.use(express.static(path.join(__dirname, '../public')));

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

//Variables propias del ServidorSocketService
let usuarios = [];
let confirmados = 0;
let preguntas = [
  {
    id: '1',
    pregunta: '¿Cúanto es 4+4?',
    correcta: 'a',
    a: '8',
    b: '16',
    c: 'No lo sé, soy rubia',
    d: '0'
  }, {
    id: '2',
    pregunta: '¿Quién ganaría en una pelea, Batman o Superman?',
    correcta: 'd',
    a: 'Batman',
    b: 'Ninguno',
    c: 'Wonder Woman',
    d: 'Superman'
  }, {
    id: '3',
    pregunta: '¿Fino es maricón?',
    correcta: 'c',
    a: '¿Quién es Fino?',
    b: 'No',
    c: 'Sí',
    d: '¿Lo eres Tú, pirata?'
  }, {
    id: '4',
    pregunta: '¿Saben pensar los políticos?',
    correcta: 'b',
    a: 'Claro, España va bien',
    b: 'No en su profesión, está mal visto',
    c: 'Sólo quieren robarnos',
    d: 'Me da igual la política'
  }, {
    id: '5',
    pregunta: '¿Por qué se suicidó el libro de matemáticas? ',
    correcta: 'd',
    a: 'Porque sí',
    b: 'Los libros no se suicidan',
    c: 'Porque amaba en secreto al libro de física',
    d: 'Porque tenía muchos problemas'
  },
  {
    id:'6',
    pregunta:'¿Qué isla del Caribe tiene nombre de flor?',
    correcta:'a',
    a:'La isla Margarita',
    b:'La isla Rosa',
    c:'La isla Petunia',
    d:'La isla Champiñón'
  },
  {
    id:'7',
    pregunta:'¿Cuál es la residencia oficial más grande del mundo? ',
    correcta:'c',
    a:'San Marino',
    b:'Andorra',
    c:'El Vaticano',
    d:'Fátima'
  },
  {
    id:'8',
    pregunta:'¿En qué árbol crecen los dátiles?',
    correcta:'b',
    a:'No crecen en los árboles',
    b:'En la palmera',
    c:'En el peral',
    d:'En la chumbera'
  },
  {
    id:'9',
    pregunta:'¿Qué rasgo facial no tiene la Mona Lisa? ',
    correcta:'a',
    a:'Cejas',
    b:'Nariz',
    c:'Oreja',
    d:'Boca'
  },
  {
    id:'10',
    pregunta:'¿Qué pie puso primero Neil Amstrong sobre la Luna?',
    correcta:'d',
    a:'El del medio',
    b:'Pisó con los 2 pies',
    c:'El derecho',
    d:'El izquierdo'
  }
];

//Detección de eventos
io.on('connection', (socket) => {
  console.log('Se ha iniciado una nueva conexión');
  socket.on('new-usuario', (datos) => {
    console.log('Usuario Identificado: ' + datos.usuario);
    usuarios.push({nombre: datos.usuario, sala: datos.sala, puntuacion: 0});
    socket.join(datos.sala);
    var confirmado = 0;
    var acabado = 0;
    var habitacion = io.sockets.adapter.rooms[datos.sala];
    // console.log('Habitantes de '+ datos.sala + ': '+ habitacion.length);
    console.log(usuarios);
    if (habitacion.length == 2) {
      console.log('Tenemos 2 jugadores disponibles en sala: ' + datos.sala);
      // console.log(usuarios);
      io.to(datos.sala).emit('esperarJuego', true);
    }

    socket.on('mensaje', (msg)=>{
      let infoMensaje = [];
      infoMensaje.push({usuario:datos.usuario, mensaje:msg});
      io.to(datos.sala).emit('maquetaMensaje', infoMensaje);
    });

    socket.on('confirmado', function(value) {
      if (value) {
        // console.log(datos.sala);
        confirmado++
        // console.log('Confirmado ' + confirmado);
        if (confirmado >= 2) {
          console.log('Ya se puede jugar en la Sala: ' + datos.sala);
          io.to(datos.sala).emit('jugar', true);
        } else {
          socket.broadcast.to(datos.sala).emit('confirmadoGrupo', true);
        }
      }
    });

    socket.on('confirmadoGrupo', function(value) {
      confirmado++;
    });

    socket.on('pregunta', function(datos) {
      console.log('Pregunta ' + datos);
      if (datos < preguntas.length) {
        socket.emit('nPregunta', preguntas[datos]);
      } else {
        socket.emit('acabado', true);
      }
    });

    socket.on('correcta', (valorRespuesta) => {
      valorRespuesta = parseInt(valorRespuesta);
      console.log('Respuesta Correcta ' + valorRespuesta + ' puntos');
      for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].nombre == datos.usuario) {
          usuarios[i].puntuacion += valorRespuesta;
          // console.log('encontrado');
        }
      }
      console.log(usuarios);
    });

    socket.on('incorrecta', (valorRespuesta) => {
      valorRespuesta = parseInt(valorRespuesta);
      console.log('Respuesta Incorrecta ' + valorRespuesta + ' puntos');
      for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].nombre == datos.usuario) {
          usuarios[i].puntuacion += valorRespuesta;
          // console.log('encontrado');
        }
      }
      console.log(usuarios);
    });

    socket.on('acabado', function(value) {
      if (value) {
        // console.log(datos.sala);
        acabado++
        // console.log('Confirmado ' + confirmado);
        if (acabado >= 2) {
          console.log('Ya se puede mostrar la puntuación en la Sala: ' + datos.sala);
          io.to(datos.sala).emit('puntuacion', true);
        } else {
          socket.broadcast.to(datos.sala).emit('acabadoGrupo', true);
        }
      }
    });

    socket.on('acabadoGrupo', function(value) {
      acabado++;
    });

    socket.on('renderizarPuntuacion', function(value) {
      if (value) {
        let nombreGanador;
        let puntuacionGanador = -9999;
        let nombrePerdedor;
        let puntuacionPerdedor;
        let jsonPuntuacion = [];
        for (var i = 0; i < usuarios.length; i++) {
          if (usuarios[i].sala == datos.sala) {
            if (usuarios[i].puntuacion > puntuacionGanador) {
              nombrePerdedor = nombreGanador;
              puntuacionPerdedor = puntuacionGanador;
              nombreGanador = usuarios[i].nombre;
              puntuacionGanador = usuarios[i].puntuacion;
            } else {
              nombrePerdedor = usuarios[i].nombre;
              puntuacionPerdedor = usuarios[i].puntuacion;
            }
          }
        }
        jsonPuntuacion.push({nGanador: nombreGanador, pGanador: puntuacionGanador, nPerdedor: nombrePerdedor, pPerdedor: puntuacionPerdedor});
        io.to(datos.sala).emit('ganador', jsonPuntuacion);
      }
    });

    socket.on('salir', function(value) {
      console.log('Se ha desconectado: ' + datos.usuario);
      socket.leave(datos.sala);
      for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].nombre == datos.usuario) {
          usuarios.splice(i, 1);
        }
      }
      confirmado = 0;
    });

    //Detección de usuario desconectado
    socket.on('disconnect', () => {
      console.log('Se ha desconectado: ' + datos.usuario);
      socket.leave(datos.sala);
      for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].nombre == datos.usuario) {
          usuarios.splice(i, 1);
        }
      }
      confirmado = 0;
      if (habitacion.length == 1) {
        console.log('Esperando más jugadores');
        io.to(datos.sala).emit('esperarJuego', false);
      }
      // console.log(usuarios);
    });
  });
});

// server.listen(port, () => {
//   console.log(`Iniciado en puerto: ${port}`);
// });

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
