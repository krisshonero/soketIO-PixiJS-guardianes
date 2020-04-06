import * as PIXI from 'pixi.js';
export default class Enemigo {

    constructor(nombre, uuid, x, y) {
        this.nombre = nombre;
        this.uuid = uuid;
        this.x = x;
        this.y = y;
        this.sprite = this.crearSprite();
        this.movimiento_disponible = true;
        this.text_nombre = this.textNombre(nombre);
        this.reactBala = {
            reaccion: false,
            retroceso: 0,
            inicial_pos_x: 0,
            inicial_pos_y: 0,
            avance_x: 0,
            avance_y: 0
        }
    }
    textNombre(nombre) {
        const basicText = new PIXI.Text(nombre);
        basicText.x = this.x;
        basicText.y = this.y - 20;
        return basicText;
    }
    crearSprite() {
        var graphics = new PIXI.Sprite(PIXI.Texture.WHITE);
        graphics.position.set(this.x, this.y);
        graphics.width = 100
        graphics.height = 100
        graphics.tint = '0x00FF00';
        return graphics;
    }
    movimiento(obj) {
        if (this.movimiento_disponible) {
            if (obj.direccion.norte) {
                this.y -= obj.avance;
                this.sprite.y -= obj.avance;
                this.text_nombre.y -= obj.avance;
            }
            if (obj.direccion.sur) {
                this.y += obj.avance;
                this.sprite.y += obj.avance;
                this.text_nombre.y += obj.avance;
            }
            if (obj.direccion.este) {
                this.x += obj.avance;
                this.sprite.x += obj.avance;
                this.text_nombre.x += obj.avance;
            }
            if (obj.direccion.oeste) {
                this.x -= obj.avance;
                this.sprite.x -= obj.avance;
                this.text_nombre.x -= obj.avance;
            }
        }
    }
    choqueBala(delta) {
        if (this.reactBala.inicial_pos == 0) {
            this.reactBala.inicial_pos_x = this.x;
            this.reactBala.inicial_pos_y = this.y; 
        }
        this.reactBala.retroceso += delta;
        if (this.reactBala.retroceso >= 90 && this.reactBala.reaccion == true) {
            this.reactBala.retroceso = 0;
            this.reactBala.inicial_pos_x = 0;
            this.reactBala.inicial_pos_y = 0;
            this.reactBala.reaccion = false;
        } else {
            let x = this.reactBala.avance_x*1;
            let y = this.reactBala.avance_y*1;
            let avance = Math.sin(this.reactBala.retroceso * Math.PI / 180);
            let _x = x* avance * 100 ;
            let _y = y* avance * 100 ;  
            this.setX(x+this.x);
            this.setY(y+this.y);
        }         
    }
    setY(y) {
        this.y = y;
        this.sprite.y = y;
        this.text_nombre.y = y;
    }
    setX(x) {
        this.x = x;
        this.sprite.x = x;
        this.text_nombre.x = x;
    }
    obtenerPosicion() {
        return {
            "x": this.x,
            "y": this.y
        }
    }
    destruir() {
        this.sprite.destroy();
        this.text_nombre.destroy();
    }
}