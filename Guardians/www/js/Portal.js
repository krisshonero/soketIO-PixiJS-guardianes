import {
    showAlert
} from "./functions";
import "../css/styles.css"
import {
    idioma
} from './Idioma.js'
import * as game from './Game/Main.js'


idioma.init({
    lng: "sp"
})

document.getElementById("start").addEventListener("click", function () {
    game.init(document.getElementById("text_input_usuario").value);
});


//console.log(idioma.t("Hola"));