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
        this.objetos_juego={};
        this.score={};
    }
}

class Jugador {
    constructor(nombre, uuid_jugador) {
        this.nombre = nombre
        this.uuid = uuid_jugador;        
        this.velocidad= 3;
        this.avance = this.velocidad * 3;
        this.x = 400;
        this.y = 400;
        this.bolsilloAbierto=null;
        this.bolsillos={
            bolsillo1:null,
            bolsillo2:null,
            bolsillo3:null,
            bolsillo4:null
        }
    }
}
class Bolsillo {
    constructor(uuid){
        this.uuid=uuid;
        this.item=null;
    }
    obtenerItem(){
        return this.item;
    }
}
class Bala {
    constructor(uuid,uuid_jugador) {
        this.uuid_jugador = uuid_jugador
        this.uuid = uuid;        
        this.velocidad= 3;
        this.danio=100;
    }
}
class Arma {
    constructor(uuid,uuid_jugador) {
        this.arma=new Pistola(uuid,uuid_jugador);
    }
    descontarBala(){
        this.arma.cantidadBalas -=1;
    }
    disparoDisponible(){
        if(this.arma.cantidadBalas>0){
            return true;
        } else{
            return false;
        }
    }
}

class Pistola {
    constructor(uuid,uuid_jugador){
        this.nombre="Pistola";
        this.cargadorBalas=10;
        this.cantidadBalas=10;
        this.perdigones=false;
        this.bala= new Bala(uuid,uuid_jugador)
    }    
}

class Enemigo {
    constructor(nombre,uuid) {
        this.nombre = nombre
        this.uuid = uuid;        
        this.velocidad= 3;
        this.x = 50;
        this.y = 50;
    }
}

module.exports = {
    //********************* */
    //Creadores
    //********************* */
    crearSalas: function () {
        for (var i = 1; i <= 3; i++) {
            var nombre = "sala" + i.toString();
            var room = new Salas(nombre);
            sala[room.nombre] = room;
        };
        console.log("salas creadas");
    },
    crearBala: function (uuid, uuid_jugador) {
        return new Bala(uuid, uuid_jugador);
    },   
    crearJugador: function (nickname) {
        let jugador= new Jugador(nickname, this.obtenerUUID());
        for(let bolsillo in jugador.bolsillos){
            jugador.bolsillos[bolsillo]=new Bolsillo(this.obtenerUUID());
        }
        jugador.bolsillos.bolsillo1.item=new Arma(this.obtenerUUID(),jugador.uuid);
        jugador.bolsilloAbierto="bolsillo1";
        return jugador;
    },
    crearEnemigo: function (nombre) {
        return new Enemigo(nombre,this.obtenerUUID());
    }, 
    //********************* */
    //Agregadores
    //********************* */ 
    agregaObjetoSala: function (sala, objeto) {
        let sala_ = this.obtenerSala(sala);
        sala_.objetos_juego[objeto.uuid]=objeto;
    },
    
    //********************* */
    //Obtenedores
    //********************* */  
    obtenerListEnemigos:function(){
        var max=1;
        var list={}
        for(var i=0;i<max;i++){
            var enemigo=this.crearEnemigo(i);
            list[enemigo.uuid]=enemigo;
        }
        return list;
    },
    obtenerBala(){

    },
    obtenerUUID: function () {
        return uuidv4();
    },
    obtenerSala: function(sala_){
        return sala[sala_.nombre];
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
    obtenerRandom: function(min, max) {
        return Math.random() * (max - min) + min;
    },    
    obtenerUsuarioEspera: function () {
        for (keys in usersEspera) {
            return usersEspera[keys];
            break;
        }
    },
    obtenerSalaDisponible: function () {
        for (keys in sala) {
            if (sala[keys].disponible == true) {
                return sala[keys];
                break;
            }            
        }
    },
    //********************* */
    //Eliminadores
    //********************* */
    eliminarBala: function (sala,objeto) {
        let sala_ = this.obtenerSala(sala);
        delete sala_.objetos_juego[objeto.uuid];
    },
    eliminarDeEspera: function (usuario) {
        delete usersEspera[usuario.uuid];
    },
    eliminarDeSala: function (sala, usuario) {
        sala.usuariosConectados -= 1;
        delete sala.jugadores[usuario.uuid];
    },
    //********************* */
    //Validadores
    //********************* */
    salaDisponible: function () {
        for (keys in sala) {
            if (sala[keys].disponible == true) {
                return true;
                break;
            }            
        }
        return false;
    },
    salaCompleta: function (sala) {
        if (sala.usuariosConectados >= minUsuariosEnSala) {
            return true;
        } else {
            return false;
        }
    },
    usuarioEnEspera: function () {
        for (keys in usersEspera) {
            return true;
            break;
        }
        return false;
    },
    //********************* */
    //Otros
    //********************* */
    abrirSala: function(sala_){
        sala[sala_.nombre].disponible=true;
    },
    cerrarSala: function(sala_){
        sala[sala_.nombre].disponible=false;
    },
    iniciarPartidaEnSala: function (sala) {
        sala.idPartida = this.obtenerUUID();
        sala.fecha_inicio = this.obtenerFechaHora();
        sala.partidaActiva = true;
    },
    asignarAEspera: function (jugador) {
        usersEspera[jugador.uuid] = jugador;
    },
    asignarSala: function (sala, usuario) {
        sala.jugadores[usuario.uuid] = usuario;
        sala.usuariosConectados += 1;
        console.log("sala: "+sala.nombre+" || conectados: "+sala.usuariosConectados);
        delete usersEspera[usuario.uuid];
    },
};