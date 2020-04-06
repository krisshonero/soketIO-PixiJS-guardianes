var express = require("express");
var app = express();
const server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var path = require('path');
const f = require('./functions');

app.use(express.static(path.join(__dirname, './../build')));
console.log(path.join(__dirname, './../build'));
app.post('/', function (req, res) {
    console.log("socket server up!!")
});

f.crearSalas();

io.sockets.on('connect', function (socket) {
    socket.on('registrar_sala', function (obj) {
        console.log("Ha iniciado un nuevo jugador!" + obj.nombre);
        socket.usuario = f.crearJugador(obj.nombre);
        socket.uuid = socket.usuario.uuid;
        socket.nickname = socket.usuario.nombre;
        socket.emit("jugadorPrincipal",socket.uuid);
        f.asignarAEspera(socket.usuario);
        if (f.usuarioEnEspera()) {
            if (f.salaDisponible()) {
                socket.sala = f.obtenerSalaDisponible();
                socket.join(socket.sala.nombre);
                f.asignarSala(socket.sala, f.obtenerUsuarioEspera());
                if (f.salaCompleta(socket.sala)) {
                    f.cerrarSala(socket.sala);
                    f.iniciarPartidaEnSala(socket.sala);                 
                    io.sockets.in(socket.sala.nombre).emit("iniciarPartida", {
                        jugadores: socket.sala.jugadores,
                        enemigos:f.obtenerListEnemigos()
                    });
                }
            }
        }
        //console.log(f.usuarioEnEspera());
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
    socket.on('movimiento_enemigo', function (data) {
        if(socket.sala){
            io.sockets.in(socket.sala.nombre).emit("movimiento_enemigo", {
                direccion: data.dir,
                uuid: data.uuid,
                avance: 3
            });
        }
        
    });
    socket.on('colisionBalaEnemigo', function (obj) {
        if(socket.sala){
            f.eliminarBala(socket.sala,obj);
            io.sockets.in(socket.sala.nombre).emit("colisionBalaEnemigo", {
                uuid_jugador: obj.uuid_jugador,
                uuid: obj.uuid
            });
        }        
    });
    socket.on('crearBala', function (obj) {
        if(socket.sala){
            let uuid=f.obtenerUUID();
            let bala = f.crearBala(uuid,socket.uuid);
            let sala = f.obtenerSala(socket.sala);
            let bolsillo = sala.jugadores[socket.uuid].bolsilloAbierto;
            let item = sala.jugadores[socket.uuid].bolsillos[bolsillo].obtenerItem();
            if(item.disparoDisponible()){
                item.descontarBala();
                f.agregaObjetoSala(socket.sala,bala);
                io.sockets.in(socket.sala.nombre).emit("crearBala", {
                    origen_x: obj.posicion_arma.x,
                    origen_y: obj.posicion_arma.y,
                    destino_x: obj.enemigo.x,
                    destino_y:obj.enemigo.y,
                    uuid_jugador: socket.uuid,
                    velocidad : bala.velocidad,
                    uuid: uuid,
                });
            }
        }        
    });

    console.log("conectado al server!");
    socket.on('event', function (data) {});
    socket.on('disconnect', function () {
        if (socket.usuario) {
            console.log("se desconecto " + socket.usuario.nombre);
            f.eliminarDeEspera(socket.usuario);
            f.eliminarDeSala(socket.sala, socket.usuario);
            let sala = f.obtenerSala(socket.sala);
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
                f.abrirSala(sala);
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