import Pistola from './pistola.js';
export default class Arma {
    constructor(obj,x,y) {
        this.x=x;
        this.y=y;
        this.arma = this.obtenerArma(obj);
    }
    obtenerArma(obj) {
        switch (obj.arma.nombre) {
            case "Pistola":
                return new Pistola(obj.arma,this.x,this.y);
                break;
        }
    }
    obtenerSprite(){
        return this.arma.obtenerSprite();
    }
    setX(x) {
        console.log("arma recibe x: "+x)
        this.arma.setX(x);
        console.log("arma setea su x: "+this.arma.obtenerX())
        this.x=this.arma.obtenerX();
    }
    setY(y) {
        console.log("arma recibe y: "+y)
        this.arma.setY(y);
        console.log("arma setea su y: "+this.arma.obtenerY())
        this.y=this.arma.obtenerY();
    }
    obtenerX(){
        return this.x;
    }
    obtenerY(){
        return this.y;
    }
    obtenerPosicion(){
        console.log("dispara desde :"+this.y);
        return {x:this.obtenerX(),y:this.obtenerY()}
    }
    disparoDisponible(){
        return this.arma.disparoDisponible();
    }
    descontarBala(){
        this.arma.descontarBala();
    }
    destruir() {
        this.arma.destruir();
    }
    actualizarPosicion(){
        this.y=this.arma.obtenerY();
        this.x=this.arma.obtenerX();
    }
}