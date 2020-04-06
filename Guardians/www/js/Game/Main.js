import * as PIXI from 'pixi.js';
import * as _call from "./functions.js";
import * as io from "socket.io-client";

const socket = io.connect();
const sock = _call._in.socketOn;
const f = _call._in.functions;
const app = f.crearApp();
const resize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);
resize();


function emit_(value, obj) {
    socket.emit(value, obj);
}

function agregarObjAStage(value) {
    app.stage.addChild(value);
}
(function on_() {
    for (var i in sock) {
        socket.on(sock[i].name, sock[i].f);
    }
})();

export function loadingResources() {
    app.loader.add('mapa_texture', 'assets/game/estructuras.png')
    app.loader.on("progress", loadProgressHandler)
    app.loader.load(setup);

    function loadProgressHandler(loader, resource) {
        console.log("loading: " + resource.url);
        console.log("progress: " + loader.progress + "%");
    }

    function setup() {
        console.log("All files loaded");
    }
}


export function init(nombre) {
    var juegoActivo = false;
    emit_("registrar_sala", {
        nombre: nombre
    });


    socket.on("iniciarPartida", function (obj) {
        document.body.appendChild(app.view);

        var mapa = f.obtenerListaContenedores().mapa;
        mapa.x = 0;
        mapa.y = 0;

        var spriteList = f.obtenerListadoImg();
        for (var key in spriteList) {
            mapa.addChild(f.crearSprite(spriteList[key]));
        }
        agregarObjAStage(mapa);
        f.crearJugadores(obj);
        f.crearEnemigos(obj);
        juegoActivo = true;

        let list_jugadores = f.listarJugadores();
        let listarEnemigos = f.listarEnemigos();
        for (let key in list_jugadores) {
            let jugador=list_jugadores[key];
            if (jugador.uuid == f.obtenerJugadorPrincipal()) {
                agregarObjAStage(jugador.obtenerSprite());
                agregarObjAStage(jugador.text_nombre);
                agregarObjAStage(jugador.bolsillos[jugador.obtenerBolsilloAbierto()].item.obtenerSprite());
            } else {
                mapa.addChild(jugador.obtenerSprite());
                mapa.addChild(jugador.text_nombre);
                mapa.addChild(jugador.bolsillos[jugador.obtenerBolsilloAbierto()].item.obtenerSprite());
                        
            }
        }
        for (var key in listarEnemigos) {
            console.log(key);
            mapa.addChild(listarEnemigos[key].sprite);
        }
        //var button = new PIXI.Graphics();
        //button.interactive = true;
        //button.beginFill(0xC34288, 1);
        //button.drawCircle(50,50, 20);
        //button.endFill();
        //button.mousedown =  onTouchstart.bind(undefined, "test");
        //function onTouchstart(param, e) {
        //        console.log(param, e);
        //}
        //agregarObjAStage(button);
        //var sprite = PIXI.Sprite.fromImage(imgUrl);

    });
    socket.on("finJuego", function () {
        var txt = f.obtenerTextfinJuego();
        agregarObjAStage(txt);
        juegoActivo = false;
    });
    var dir = {
        "norte": false,
        "sur": false,
        "este": false,
        "oeste": false
    };
    addEventListener("keydown", function (e) {
        if (juegoActivo) {
            if (e.keyCode == 87) {
                dir.norte = true;
            }
            if (e.keyCode == 83) {
                dir.sur = true;
            }
            //console.log("grado: " + grado + "    x: " + Math.sin(grado * Math.PI / 180) * 100 + 100);
            //grado >= 90 ? grado = -90 : grado += 3;
            //test.position.set(Math.sin(grado * Math.PI / 180) * 100 + 105, 50); //
        }
    });
    addEventListener("keydown", function (e) {
        if (juegoActivo) {
            if (e.keyCode == 68) {
                dir.este = true;
            }
            if (e.keyCode == 65) {
                dir.oeste = true;
            }
        }
    });
    addEventListener("keyup", function (e) {
        if (juegoActivo) {
            if (e.keyCode == 87) {
                dir.norte = false;
            }
            if (e.keyCode == 83) {
                dir.sur = false;
            }
        }
    });
    addEventListener("keyup", function (e) {
        if (juegoActivo) {
            if (e.keyCode == 68) {
                dir.este = false;
            }
            if (e.keyCode == 65) {
                dir.oeste = false;
            }


        }
    });
    var disparo;

    addEventListener("keydown", function (e) {
        if (juegoActivo) {
            if (e.keyCode == 69) {
                disparo = true;
            }
        }
    });
    addEventListener("keyup", function (e) {
        if (juegoActivo) {
            if (e.keyCode == 69) {
                disparo = false;
            }
        }
    });

    var list_jugadores = f.listarJugadores();
    var listarEnemigos = f.listarEnemigos();
    var list_balas = f.obtenerListaBalas();
    var dir_enemigo = {
        "norte": false,
        "sur": false,
        "este": true,
        "oeste": false
    };

    var uuid = ""
    var send;
    var enviar = true;

    function test(delta) {
        for (var index in listarEnemigos) {
            if (listarEnemigos[index].reactBala.reaccion) {
                listarEnemigos[index].choqueBala(delta);
            }
        }
    }

    let tick = new PIXI.Ticker();
    tick.add((delta) => {
        test(delta)
    });
    tick.autoStart = false;
    tick.stop();
    tick.start();
    tick.speed = 2;

    function ejecutardisparo(delta) {
        for (var index in list_balas) {     
            if(!list_balas[index].onStage){
                list_balas[index].onStage=true;
                var mapa = f.obtenerListaContenedores().mapa;
                mapa.addChild(list_balas[index].sprite);
            }       
            f.movimientoBala(list_balas[index]);
        }
    }

    let tick1 = new PIXI.Ticker();
    tick1.add(() => {
        ejecutardisparo();
    });
    tick1.autoStart = false;
    tick1.stop();
    tick1.start();
    tick1.speed = 0.01;

    var count=0;

    app.ticker.add((delta) => {
        if (juegoActivo) {
            
            count+=delta
            //app.stage.scale.x += 0.002;
            //app.stage.scale.y += 0.002;
            // just for fun, let's rotate mr rabbit a little
            if (dir.norte || dir.sur || dir.este || dir.oeste) {
                emit_("movimiento", dir);
            }
            for (var index in listarEnemigos) {   
                if(count>=100){
                    //console.log(listarEnemigos[index].sprite.x+" - "+listarEnemigos[index].sprite.y);
                    count=0;
                }             
                for (var index2 in list_balas) {
                    
                    if (f.balaColision(listarEnemigos[index].sprite, list_balas[index2].puntoIndice)) {
                        console.log("collision con bala!");
                        emit_("colisionBalaEnemigo", {"uuid_jugador":listarEnemigos[index].uuid,"uuid":list_balas[index2].uuid}); 
                    }
                }
            }
            if (disparo) {
                for (var index in listarEnemigos) { 
                    let item = list_jugadores[f.obtenerJugadorPrincipal()].obtenerItem();
                    if(item.disparoDisponible()){
                        item.descontarBala();
                        emit_("crearBala", {"posicion_arma":item.obtenerPosicion(),"enemigo":listarEnemigos[index].obtenerPosicion()});
                    }
                    disparo=false;
                }
            }

            for (var key in list_jugadores) {
                for (var key1 in list_jugadores) {
                    if (list_jugadores[key].uuid != list_jugadores[key1].uuid) {
                        if (f.testForCollision(list_jugadores[key].sprite, list_jugadores[key1].sprite)) {
                            //console.log("collision entre jugadores!")
                            // Calculate the changes in acceleration that should be made between
                            // each square as a result of the collision
                            /*const collisionPush = f.collisionResponse(list_jugadores[key].sprite, list_jugadores[key1].sprite);
                            // Set the changes in acceleration for both squares
                            list_jugadores[key1].sprite.acceleration.set(
                                (collisionPush.x * list_jugadores[key].sprite.mass),
                                (collisionPush.y * list_jugadores[key].sprite.mass),
                            );
                            list_jugadores[key].sprite.acceleration.set(
                                -(collisionPush.x * list_jugadores[key1].sprite.mass),
                                -(collisionPush.y * list_jugadores[key1].sprite.mass),
                            );*/
                        }
                        //list_jugadores[key].sprite.x += list_jugadores[key].sprite.acceleration.x * delta;
                        //list_jugadores[key].sprite.y += list_jugadores[key].sprite.acceleration.y * delta;

                        //list_jugadores[key1].sprite.x += list_jugadores[key1].sprite.acceleration.x * delta;
                        //list_jugadores[key1].sprite.y += list_jugadores[key1].sprite.acceleration.y * delta;
                    }     
                }
            }
        }
    });
}