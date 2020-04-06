import * as PIXI from 'pixi.js';
export default class Bala {

    constructor(obj) {
        this.uuid = obj.uuid;
        this.uuid_jugador = obj.uuid_jugador;
        this.x = obj.origen_x;
        this.y = obj.origen_y;
        this.destino_x = obj.destino_x;
        this.destino_y = obj.destino_y;
        this.distancia =this.obtenerDistancia(obj);
        this.danio=0;
        this.avance=this.avance(obj.velocidad);        
        this.sprite = this.sprite();
        this.onStage = false;
        this.puntoIndice = this.point();
    }
    point() {
        return new PIXI.Point(this.sprite.width / 2 + this.x, this.sprite.height / 2 + this.y)
    }
    sprite() {
        var graphics = new PIXI.Sprite(PIXI.Texture.WHITE);
        graphics.name = "bala"
        graphics.position.set(this.x, this.y);
        graphics.width = 30
        graphics.height = 30
        graphics.tint = '0xFFFFFF';
        return graphics;
    }
    movimiento() {
        this.setX(this.avance.x);
        this.setY(this.avance.y);
    }
    setX(x) {
        this.x += x;
        this.sprite.x += x;
        this.puntoIndice.x += x;
    }
    setY(y) {
        this.y += y;
        this.sprite.y += y;
        this.puntoIndice.y += y;
    }
    destruir() {
        this.sprite.destroy();
    }
    avance(velocidad) {
        let angulo;
        let x = this.destino_x - this.x
        let y = this.destino_y - this.y
        let x_;
        let y_;
        let vel=velocidad;
        if (x != 0) {
            if (x > 0 && y <= 0) { //cuadrante1
                angulo = Math.atan(y / x);
                x_=Math.cos(angulo )* vel;
                y_=Math.sin(angulo )* vel;
            }else if (x < 0 && y <= 0) { //cuadrante2
                angulo = Math.atan(y / x);
                x_=-Math.cos(angulo  )* vel;
                y_=-Math.sin(angulo  )* vel;
            }else if (x < 0 && y >= 0) { //cuadrante3
                angulo = Math.atan(y / x)
                x_=-Math.cos(angulo )* vel;
                y_=-Math.sin(angulo )* vel;
            }else if (x > 0 && y >= 0) { //cuadrante4
                angulo = Math.atan(y / x)
                x_=Math.cos(angulo )* vel;
                y_=Math.sin(angulo )* vel;
            }

        } else if (x == 0 && y < 0) {
            x_=0;
            y_=-vel;
        } else if (x == 0 && y >= 0) {
            x_=0;
            y_=vel;
        }
        return {
            "x": x_,
            "y": y_
        }
    }
    obtenerDistancia(obj){
        let x = obj.destino_x - obj.origen_x
        let y = obj.destino_y - obj.origen_y
        return Math.hypot(x, y);
    }
}