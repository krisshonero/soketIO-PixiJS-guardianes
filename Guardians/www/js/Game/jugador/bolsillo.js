export default class Bolsillo {
    constructor(uuid){
        this.uuid=uuid;
        this.item=null;
    }
    agregarItem(item){
        this.item=item;
    }
    obtenerItem(){
        return this.item;
    }
    obtenerUUID(){
        return this.uuid;
    }
}