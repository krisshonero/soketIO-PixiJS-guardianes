import * as PIXI from 'pixi.js';
import Heroe from "./jugador/Heroe_1.js";
import Enemigo from "./enemigo/enemigo_1.js";
import Bala from "./armas/bala.js";
import * as loadList from "./loadList.js";
export const _in = {
    socketOn: {
        movimiento: {
            name: "movimiento",
            f: movimiento
        },
        movimiento_enemigo: {
            name: "movimiento_enemigo",
            f: movimiento_enemigo
        },
        eliminarJugador: {
            name: "eliminarJugador",
            f: eliminarJugador
        },
        jugadorPrincipal: {
            name: "jugadorPrincipal",
            f: jugadorPrincipal
        },
        colisionBalaEnemigo: {
            name: "colisionBalaEnemigo",
            f: colisionBalaEnemigo
        },
        crearBala: {
            name: "crearBala",
            f: crearBala
        },
    },
    functions: {
        "crearApp": crearApp,
        "obtenerListaContenedores": obtenerListaContenedores,
        "crearJugadores": crearJugadores,
        "crearEnemigos": crearEnemigos,
        "obtenerTextfinJuego": obtenerTextfinJuego,
        "listarJugadores": listarJugadores,
        "listarEnemigos": listarEnemigos,
        "obtenerJugadorPrincipal": obtenerJugadorPrincipal,
        "crearSprite": crearSprite,
        "obtenerListadoImg": obtenerListadoImg,
        "testForCollision": testForCollision,
        "obtenerListaBalas": obtenerListaBalas,
        "balaColision": balaColision,
        "eliminarBala": eliminarBala,
        "movimientoBala": movimientoBala
    }
}

var list_jugadores = {};
var list_enemigos = {};
var list_balas = {};
var jugadorUiid = "";
var list_containers = {
    "mapa": crearContenedor(),
    "objetos": crearContenedor(),
    "menu": crearContenedor()
}

//********************** */
//CREADORES
//********************** */
function crearJugadores(obj) {
    for (let i in obj.jugadores) {
        let jugador = new Heroe(obj.jugadores[i]);
        let item = obj.jugadores[i].bolsillos[obj.jugadores[i].bolsilloAbierto].item;
        let bolsillo = jugador.obtenerBolsilloAbierto()
        jugador.agregarItemBolsillo(bolsillo,item);
        jugador.obtenerItem().actualizarPosicion();
        list_jugadores[obj.jugadores[i].uuid] = jugador;
    }
}

function crearEnemigos(obj) {
    for (let i in obj.enemigos) {
        let enemigo = new Enemigo(obj.enemigos[i].nombre, obj.enemigos[i].uuid, obj.enemigos[i].x, obj.enemigos[i].y);
        list_enemigos[obj.enemigos[i].uuid] = enemigo;
    }
}

function crearApp() {
    return new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1,
        renderer: {
            autoResize: true
        }
    });
}

function crearContenedor() {
    return new PIXI.Container();
}

function crearSprite(obj) {
    let texture = PIXI.utils.TextureCache[obj.url];
    let rectangle = new PIXI.Rectangle(obj.rectangle.x, obj.rectangle.y, obj.rectangle.ancho, obj.rectangle.alto);
    texture.frame = rectangle;
    let sprite = new PIXI.Sprite(texture);
    sprite.x = obj.x;
    sprite.y = obj.y;
    return sprite;
}

function crearBala(obj) {
    list_balas[obj.uuid] = new Bala(obj);
}
//********************** */
//LISTADORES
//********************** */
function listarJugadores() {
    return list_jugadores;
}

function listarEnemigos() {
    return list_enemigos;
}
//********************** */
//OBTENEDORES
//********************** */
function obtenerListadoImg() {
    return loadList.spriteList;
}

function obtenerListaBalas() {
    return list_balas;
}

function obtenerJugadorPrincipal() {
    return jugadorUiid;
}

function obtenerListaContenedores() {
    return list_containers;
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
//********************** */
//ELIMINADORES
//********************** */
function eliminarJugador(jugador) {
    list_jugadores[jugador.uuid].destruir();
    delete list_jugadores[jugador.uuid];
}

function eliminarBala(obj) {
    list_balas[obj.uuid].destruir();
    delete list_balas[obj.uuid]
}
//********************** */
//OTROS
//********************** */

function jugadorPrincipal(uuid) {
    jugadorUiid = uuid;
}

function movimiento(obj) {
    //movimiento para el heroe
    if (list_jugadores[obj.uuid]) {
        if (obj.uuid == obtenerJugadorPrincipal()) {
            let list = obtenerListaContenedores();
            let actual_y=list_jugadores[obj.uuid].obtenerY();
            let actual_x=list_jugadores[obj.uuid].obtenerX();
            if (obj.direccion.norte) {
                list.mapa.position.y += obj.avance;  
                list_jugadores[obj.uuid].obtenerItem().y -= obj.avance;
                //list_jugadores[obj.uuid].obtenerArma().setY(y- obj.avance); 
            }
            if (obj.direccion.sur) {
                list.mapa.position.y -= obj.avance;
                list_jugadores[obj.uuid].obtenerItem().y += obj.avance;
                //list_jugadores[obj.uuid].obtenerArma().setY(y + obj.avance); 
            }
            if (obj.direccion.este) {
                list.mapa.position.x -= obj.avance;
                list_jugadores[obj.uuid].obtenerItem().x += obj.avance;
                //list_jugadores[obj.uuid].obtenerArma().setX(x + obj.avance); 
            }
            if (obj.direccion.oeste) {
                list.mapa.position.x += obj.avance;
                list_jugadores[obj.uuid].obtenerItem().x-= obj.avance;
                //list_jugadores[obj.uuid].obtenerArma().setX(x - obj.avance); 
            }
        } else {
            list_jugadores[obj.uuid].movimiento(obj);
        }
    }
}

function movimiento_enemigo(obj) {
    //movimiento para el enemigo
    if (list_enemigos[obj.uuid]) {
        list_enemigos[obj.uuid].movimiento(obj);
    }
}

function colisionBalaEnemigo(obj) {
    //movimiento para el enemigo
    if (list_enemigos[obj.uuid_jugador]) {
        if(list_balas[obj.uuid]){
            list_enemigos[obj.uuid_jugador].reactBala.reaccion = true;
            list_enemigos[obj.uuid_jugador].reactBala.inicial_pos = 0;
            list_enemigos[obj.uuid_jugador].reactBala.retroceso = 0;
            if(list_balas[obj.uuid]){
                list_enemigos[obj.uuid_jugador].reactBala.avance_x = list_balas[obj.uuid].avance.x;
                list_enemigos[obj.uuid_jugador].reactBala.avance_y = list_balas[obj.uuid].avance.y;
                eliminarBala(obj);
            }
            
        }
    }
}

function testForCollision(object1, object2) {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();
    return bounds1.x < bounds2.x + bounds2.width &&
        bounds1.x + bounds2.width > bounds2.x &&
        bounds1.y < bounds2.y + bounds2.height &&
        bounds1.y + bounds2.height > bounds2.y;
}

function balaColision(bounds1, bounds2) {

    return bounds2.x > bounds1.x &&
        bounds2.x < bounds1.x + bounds1.width &&
        bounds2.y > bounds1.y &&
        bounds2.y < bounds1.y + bounds1.height;
}
// Calculate the distance between two given points
function distanceBetweenTwoPoints(p1, p2) {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;

    return Math.hypot(a, b);
}

function movimientoBala(obj) {
    if (list_balas[obj.uuid]) {
        list_balas[obj.uuid].movimiento();
    }
}