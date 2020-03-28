const {
    v4: uuidv4
} = require('uuid');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var users = {}; //sockets de todos los usuarios conectados
var usersEspera = {}; //array con nombre de usuarios en espera
var sala = {};
var minUsuariosEnSala = 2;
var maxUsuariosEnSala = 2;

class Salas {
    constructor(nombre) {
        this.nombre = nombre;
        this.idPartida = "";
        this.disponible = true;
        this.usuariosConectados = 0;
        this.jugadores = {};
    }
}

class Jugador {
    constructor(nombre, uuid) {
        this.nombre = nombre
        this.uuid = uuid;        
        this.velocidad= 3;
        this.avance = this.velocidad * 3;
        this.x = 100;
        this.y = 100;
    }
}

module.exports = {
    crearSalas: function () {
        for (var i = 1; i <= 3; i++) {
            var nombre = "sala" + i.toString();
            var room = new Salas(nombre);
            sala[room.nombre] = room;
        };
        console.log("salas creadas");
    },
    crearJugador: function (nickname,uuid) {
        return new Jugador(nickname, this.asignarUUID());
    },
    asignarUUID: function () {
        return uuidv4();
    },
    usuarioEnEspera: function () {
        for (keys in usersEspera) {
            return true;
            break;
        }
        return false;
    },
    obtenerUsuarioEspera: function () {
        for (keys in usersEspera) {
            return usersEspera[keys];
            break;
        }
    },
    obtenerFechaHora: function () {
        var fechaPartida = new Date();
        var anio = fechaPartida.getFullYear();
        var mes = (fechaPartida.getMonth() + 1);
        var dia = fechaPartida.getDate();
        var hora = fechaPartida.getHours();
        var min = fechaPartida.getMinutes();
        var sec = fechaPartida.getSeconds();
        var millisec = fechaPartida.getMilliseconds();
        return anio.toString() + mes.toString() + dia.toString() + hora.toString() + min.toString() + sec.toString() + millisec.toString();
    },
    existeSalaDisponible: function () {
        for (keys in sala) {
            if (sala[keys].disponible == true) {
                return true;
                break;
            }            
        }
        return false;
    },
    obtenerSalaDisponible: function () {
        for (keys in sala) {
            if (sala[keys].disponible == true) {
                return sala[keys];
                break;
            }            
        }
    },
    salaCompleta: function (sala) {
        if (sala.usuariosConectados >= minUsuariosEnSala) {
            return true;
        } else {
            return false;
        }
    },
    asignarAEspera: function (jugador) {
        usersEspera[jugador.uuid] = jugador;
    },
    iniciarPartidaEnSala: function (sala) {
        sala.idPartida = this.asignarUUID();
        sala.fecha_inicio = this.obtenerFechaHora();
        sala.partidaActiva = true;
    },
    abrirSala: function(sala_){
        sala[sala_.nombre].disponible=true;
    },
    cerrarSala: function(sala_){
        sala[sala_.nombre].disponible=false;
    },
    obtenerSala: function(sala_){
        return sala[sala_.nombre];
    },
    asignarSala: function (sala, usuario) {
        sala.jugadores[usuario.uuid] = usuario;
        sala.usuariosConectados += 1;
        console.log("sala: "+sala.nombre+" || conectados: "+sala.usuariosConectados);
        delete usersEspera[usuario.uuid];
    },
    eliminarDeEspera: function (usuario) {
        delete usersEspera[usuario.uuid];
    },
    eliminarDeSala: function (sala, usuario) {
        sala.usuariosConectados -= 1;
        delete sala.jugadores[usuario.uuid];
    }
};