import * as PIXI from 'pixi.js';
export default class Pistola {

    constructor(obj,x,y) {
        this.nombre=obj.nombre;    
        this.cargadorBalas=obj.cargadorBalas;
        this.cantidadBalas=obj.cantidadBalas;
        this.perdigones=obj.perdigones;
        this.bala=obj.bala;
        this.sprite = this.setSprite(x,y);
    }
    setSprite(x,y) {
        var graphics = new PIXI.Sprite(PIXI.Texture.WHITE);
        graphics.name = this.nombre;
        graphics.position.set(x+30, y-25);
        console.log("pistola x: "+(x+30)+" pistola y: "+(y-25))
        graphics.width = 30;
        graphics.height = 30;
        graphics.tint = '0xFFFFFF';
        return graphics;
    }   
    obtenerSprite(){
        return this.sprite;
    }
    setX(x){
        this.sprite.x=x+30;
    } 
    setY(y){
        
        this.sprite.y=y-25;
    }
    obtenerX(){
        return this.sprite.x;
    } 
    obtenerY(){
        return this.sprite.y;
    } 
    disparoDisponible(){
        if(this.cantidadBalas>0){
            return true;
        } else{
            return false;
        }
    }
    descontarBala(){
        this.cantidadBalas -=1;
    }
    destruir() {
        this.sprite.destroy();
    }

}