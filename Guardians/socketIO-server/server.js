var express = require("express");
var app = express();
const server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var path = require('path');
const func = require('./functions');

app.use(express.static(path.join(__dirname, './../build')));
console.log(path.join(__dirname, './../build'));
app.post('/', function (req, res) {
    console.log("socket server up!!")
});

func.crearSalas();

io.sockets.on('connect', function (socket) {
    socket.on('registrar_sala', function (obj) {
        console.log("Ha iniciado un nuevo jugador!" + obj.nombre);
        socket.usuario = func.crearJugador(obj.nombre);;
        socket.uuid = socket.usuario.uuid;
        socket.nickname = socket.usuario.nombre;
        func.asignarAEspera(socket.usuario);
        if (func.usuarioEnEspera()) {
            if (func.existeSalaDisponible()) {
                socket.sala = func.obtenerSalaDisponible();
                socket.join(socket.sala.nombre);
                func.asignarSala(socket.sala, func.obtenerUsuarioEspera());
                if (func.salaCompleta(socket.sala)) {
                    func.cerrarSala(socket.sala);
                    func.iniciarPartidaEnSala(socket.sala);
                    io.sockets.in(socket.sala.nombre).emit("iniciarPartida", {
                        jugadores: socket.sala.jugadores
                    });
                }
            }
        }
        //console.log(func.usuarioEnEspera());
        //console.log(socket.sala);
    });

    socket.on('movimiento', function (data) {
        if(socket.sala){
            io.sockets.in(socket.sala.nombre).emit("movimiento", {
                direccion: data,
                uuid: socket.uuid,
                avance: 3
            });
        }
        
    });

    console.log("conectado al server!");
    socket.on('event', function (data) {});
    socket.on('disconnect', function () {
        if (socket.usuario) {
            console.log("se desconecto " + socket.usuario.nombre);
            func.eliminarDeEspera(socket.usuario);
            func.eliminarDeSala(socket.sala, socket.usuario);
            let sala = func.obtenerSala(socket.sala);
            io.sockets.in(socket.sala.nombre).emit("eliminarJugador",
                socket.usuario
            );
            if (sala.usuariosConectados == 1) {
                console.log("fin juego "+sala.nombre);
                io.sockets.in(socket.sala.nombre).emit("finJuego",
                    socket.usuario
                );
            }
            if (sala.usuariosConectados == 0) {
                func.abrirSala(sala);
            }
        }
    });

});


try {
    server.listen(8000);
    console.log("server listening on port 8000!");
} catch (e) {
    console.log("no se logro levantar el servidor!" + e);
}

//export {socketIOServer_init}