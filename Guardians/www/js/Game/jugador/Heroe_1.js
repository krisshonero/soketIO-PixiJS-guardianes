import * as PIXI from 'pixi.js';
import Arma from '../armas/arma.js';
import Bolsillo from './bolsillo';
export default class Heroe {

    constructor(obj) {
        this.nombre = obj.nombre;
        this.uuid = obj.uuid;
        this.x = obj.x;
        this.y = obj.y;
        this.sprite = this.sprite();
        this.movimiento_disponible = true;
        this.text_nombre = this.textNombre(obj.nombre);
        this.bolsilloAbierto=obj.bolsilloAbierto
        this.bolsillos = this.crearBolsillos(obj.bolsillos);
    }
    obtenerSprite(){
        return this.sprite;
    }
    crearBolsillos(obj) {
        return {
            bolsillo1: new Bolsillo(obj.bolsillo1.uuid),
            bolsillo2: new Bolsillo(obj.bolsillo2.uuid),
            bolsillo3: new Bolsillo(obj.bolsillo3.uuid),
            bolsillo4: new Bolsillo(obj.bolsillo4.uuid)
        }
    }
    obtenerBolsilloAbierto(){
        return this.bolsilloAbierto;
    }
    agregarItemBolsillo(bolsillo,item){//definir tipo item
        this.bolsillos[bolsillo].agregarItem(new Arma(item,this.x,this.y));
    }
    obtenerItem(){
        return this.bolsillos[this.obtenerBolsilloAbierto()].obtenerItem();
    }
    obtenerPosicionArmaActiva(){
        for(let bolsillo in this.bolsillos){
            if(this.bolsillos[bolsillo].arma.obtenerActiva()){
                return {"x":this.bolsillos[bolsillo].arma.obtenerX(),"y":this.bolsillos[bolsillo].arma.obtenerY()};
            }
        }
    }
    textNombre(nombre) {
        const basicText = new PIXI.Text(nombre);
        basicText.x = this.x;
        basicText.y = this.y - 20;
        return basicText;
    }
    sprite() {
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
                console.log("jugador: "+this.obtenerY());
                this.setY(this.obtenerY() - obj.avance);
            }
            if (obj.direccion.sur) {
                this.setY(this.obtenerY() + obj.avance);
            }
            if (obj.direccion.este) {
                this.setX(this.obtenerX() + obj.avance);
            }
            if (obj.direccion.oeste) {
                this.setX(this.obtenerX() - obj.avance);
            }
        }
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
    setX(x){
        this.x=x;
        this.sprite.x = x;
        this.text_nombre.x=x;
        this.obtenerItem().setX(x);

    }
    setY(y){
        this.y=y;
        this.sprite.y = y;
        this.text_nombre.y=y;
        this.obtenerItem().setY(y);
    }
    obtenerX(){
        return this.x;
    }
    obtenerY(){
        return this.y;
    }

}