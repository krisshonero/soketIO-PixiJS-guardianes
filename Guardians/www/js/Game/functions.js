import * as PIXI from 'pixi.js';
import Heroe from "./jugador/Heroe_1.js";
export const _in = {
    crearJugadores: {
        name: "crearJugadores",
        f: crearJugadores
    },
    movimiento: {
        name: "movimiento",
        f: movimiento
    },
    eliminarJugador: {
        name: "eliminarJugador",
        f: eliminarJugador
    },
    obtenerTextfinJuego: {
        f: obtenerTextfinJuego
    },
    listarJugadores: {
        f: listarJugadores
    },
    crearContenedor: {
        f: crearContenedor
    },
}

var list_jugadores = {};

function listarJugadores(){
    return list_jugadores;        
}

function crearJugadores(obj) {
    for (var i in obj.jugadores) {
        var jugador = new Heroe(obj.jugadores[i].nombre, obj.jugadores[i].uuid, obj.jugadores[i].x, obj.jugadores[i].y);
        list_jugadores[obj.jugadores[i].uuid] = jugador;
    }
}

function crearContenedor() {
    var app= new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1,
    });
    return app;
}



function movimiento(obj) {
    if (list_jugadores[obj.uuid]) {
        list_jugadores[obj.uuid].movimiento(obj);
    }
}

function eliminarJugador(jugador) {
    list_jugadores[jugador.uuid].destruir();
    delete list_jugadores[jugador.uuid];
}

function obtenerTextfinJuego() {

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
    });

    const textFinJuego = new PIXI.Text('Fin del juego', style);
    textFinJuego.x = 50;
    textFinJuego.y = 250;
    return textFinJuego;
    //app.stage.addChild(richText);
}


