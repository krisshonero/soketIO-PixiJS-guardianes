import * as PIXI from 'pixi.js';
import * as call from "./functions.js";
import * as io from "socket.io-client";

const socket = io.connect();
const sf_in = call._in;
const app = sf_in.crearContenedor.f();


function emit_(value, obj) {
    socket.emit(value, obj);
}

function agregarObjAStage(value) {
    app.stage.addChild(value);
}
(function on_() {
    for (var i in sf_in) {
        socket.on(sf_in[i].name, sf_in[i].f);
    }
})();
export function init(nombre) {
    var juegoActivo = false;
    emit_("registrar_sala", {
        nombre: nombre
    });
    socket.on("iniciarPartida", function (jugadores) {
        sf_in.crearJugadores.f(jugadores);
        juegoActivo = true;
        document.body.appendChild(app.view);
        const container = new PIXI.Container();
        agregarObjAStage(container);
        var list_jugadores = sf_in.listarJugadores.f();
        for (var key in list_jugadores) {
            agregarObjAStage(list_jugadores[key].sprite);
            agregarObjAStage(list_jugadores[key].text_nombre);
        }
    });
    socket.on("finJuego", function () {
        var txt = sf_in.obtenerTextfinJuego.f();
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


    app.ticker.add(() => {
        if (juegoActivo) {
            if (dir.norte || dir.sur || dir.este || dir.oeste) {
                emit_("movimiento", dir);
            }
            //app.stage.scale.x += 0.002;
            //app.stage.scale.y += 0.002;
            // just for fun, let's rotate mr rabbit a little
        }
    });



}