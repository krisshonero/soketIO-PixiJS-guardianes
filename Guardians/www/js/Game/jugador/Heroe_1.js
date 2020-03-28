import * as PIXI from 'pixi.js';
export default class Heroe{
    
    constructor(nombre,uuid,x,y) {
        this.nombre=nombre;
        this.uuid=uuid;
        this.x=x;
        this.y=y;
        this.sprite=this.sprite();
        this.movimiento_disponible=true;
        this.text_nombre=this.textNombre(nombre);
    }
    textNombre(nombre){
        const basicText = new PIXI.Text(nombre);
        basicText.x = this.x;
        basicText.y = this.y-20;
        return basicText;      
    }
    sprite(){
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(10, 0xFFBD01, 1);
        graphics.beginFill(0xC34288, 1);
        graphics.drawCircle(this.x, this.y, 20);
        graphics.endFill();
        return graphics;
    }
    movimiento(obj){
        if(this.movimiento_disponible){
            if(obj.direccion.norte){
                this.y-=obj.avance;
                this.sprite.y-=obj.avance;
                this.text_nombre.y-=obj.avance;
            }
            if(obj.direccion.sur){
                this.y+=obj.avance;
                this.sprite.y+=obj.avance;
                this.text_nombre.y+=obj.avance;
            }
            if(obj.direccion.este){
                this.x+=obj.avance;
                this.sprite.x+=obj.avance;
                this.text_nombre.x+=obj.avance;
            }
            if(obj.direccion.oeste){
                this.x-=obj.avance;
                this.sprite.x-=obj.avance;
                this.text_nombre.x-=obj.avance;
            }
        }        
    }
    destruir(){
        this.sprite.destroy();
        this.text_nombre.destroy();
    }

}