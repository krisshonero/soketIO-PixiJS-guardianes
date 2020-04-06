import "../css/styles.css"
import {
    idioma
} from './Idioma.js'
import * as game from './Game/Main.js'



idioma.init({
    lng: "sp"
})
game.loadingResources();
document.getElementById("start").addEventListener("click", function () {
    game.init(document.getElementById("text_input_usuario").value);
});


//console.log(idioma.t("Hola"));
/*
var stage = new Container(); // the main Pixi stage container
var objects = {}; // a series of key-value pairs representing the game objects or object arrays
var containerElement = $("#stage"); // jQuery object, grab a handle on the <div id="stage"></div> from index.html
var containerWidth;
var containerHeight; // actual container height/width, determined later
var stageWidth, stageHeight; // stage height/width, determined later
var renderer = autoDetectRenderer(0, 0); // PIXI graphical renderer, don't care about size here
var stageBox; // a JSON object with stage boundaries, mainly used when checking stage wall collisions

// attach the drawing board to the View
containerElement.html(renderer.view);

var ResizeStage = function() {
    // get the actual height and width of the HTML container from index.html
    containerWidth = containerElement.innerWidth();
    containerHeight = containerElement.innerHeight();
  
    // set the stage final height and width - this can be artificially limited by changing these values
    stageWidth = containerWidth;
    stageHeight = containerHeight;
  
    // set the stage boundaries
    stageBox = {
      x: 0, // top left corner X position
      y: 0, // top left corner Y position
      height: stageHeight, // number of pixels
      width: stageWidth, // number of pixels
      halfHeight: stageHeight / 2, // number of pixels - convenience value
      halfWidth: stageWidth / 2 // number of pixels - convenience value
    };
  
    // make sure the drawing board has the size we want, width first, then height
    renderer.resize(stageWidth, stageHeight);
  };
  
  // if window dimensions change, resize the stage accordingly
  $(window).on('resize', ResizeStage);
  */