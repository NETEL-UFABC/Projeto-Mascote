/*
    Esta lib tem o objetivo de receber uma SpriteSheet em PNG e um arquivo JSON correspondente
    para poder exibir a animacao no browser.

    O arquivo PNG contera os diferentes frames da animacao e o JSON contera a ordem que os frames deverao
    ser executados e os dados de cada frame como tamanho (largura e altura) e posicao dentro do PNG.

    Criado por Joao Miguel 31/10/2017

    **Pontos a desenvolver:
        
*/
$(document).ready(function(){
        
    /*Bloco Abaixo (nao mexer):
        Insere AnimationFrame e CancelAnimationFrame caso o navegador nao possua ainda
        O Chrome (dos testes) ja possui e, portanto, esse bloco de codigo eh inutil
        AnimationFrame eh essencial para a animacao
    */
    (function() {
        // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
        // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
        // MIT license
    
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
     
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
     
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    /****************************************************************************************
        ESCOPO GLOBAL DA BIBLIOTECA 
    ****************************************************************************************/
        
    //create a global list of Mascotes to be animated
    mascotesList = [];


    /****************************************************************************************
        FIM - ESCOPO GLOBAL DA BIBLIOTECA 
    ****************************************************************************************/


    //function createSpriteObject creates sprite object wich will contain the data of each frame/sprite to be rendered
    //sprite object starts empty and later it will be loaded with the sprites from JSON
    function createSpriteObject(options) {
        
        //var: local varaibles
        //maybe i have to input these variables in sprite object
        var sprite = {};//,
            
        //populate sprite object, created above
        sprite.frameIndex = 0,
        sprite.tickCount = 0,
        sprite.ticksPerFrame = options.ticksPerFrame || 2,
        sprite.numberOfFrames = options.numberOfFrames || 1;
        sprite.stopAnim = false;

        sprite.frames = options.frames || [];
        sprite.context = options.context || "";
        sprite.width = options.width || 0;
        sprite.height = options.height || 0;
        sprite.image = options.image || "";
        sprite.startX = options.startX || 0;
        sprite.startY = options.startY || 0;
        sprite.id = options.id || ""
        sprite.runningAnim = false;
        ;

        //render frames
        sprite.render = function() {
            
            //clean the previous rendering so there is no overlap between rendering
            this.context.clearRect(0, 0, this.width, this.height);

            //render new frame
            this.context.drawImage(this.image, this.startX, this.startY, this.width, this.height, 0, 0, this.width, this.height);
        };

        //update function controls the interval between successive renderings and the next frame index
        sprite.update = function() {

            this.tickCount += 1;
            
            if (this.tickCount > this.ticksPerFrame) {

                this.tickCount = 0;
                
                // If the current frame index is in range
                if (this.frameIndex < this.numberOfFrames - 1) {	
                    // Go to the next frame
                    this.frameIndex += 1;
                } else {
                    this.frameIndex = 0;
                }

                this.updateFrame(this.frameIndex);
            }
        };

        //search the next frame to be rendered
        sprite.updateFrame = function (frameIndex) {

            this.startX = this.frames[frameIndex].x;
            this.startY = this.frames[frameIndex].y;
        };

        //stop animation
        sprite.stop = function(){
            
            this.stopAnim = true;
            
        };

        sprite.animLoop = function(){

            window.requestAnimationFrame(sprite.animLoop);

            if (!sprite.stopAnim) {

                sprite.render();
                sprite.update();

                
            }
        }

        //return sprite object
        return sprite;
    };

    //takes an Sprite Object and update it with the data frames from JSON
    function setDataSpritesFromJson(spriteObj, dataJSON) {
        
        var frames = [];
        var frameWidth = 0, frameHeight = 0;
        var numberOfFrames;

        $.each(dataJSON["frames"], function(key, value){

            frames.push(value.frame);

            //set up mascote width and height
            if (frameWidth == 0 && frameHeight == 0) {

                frameWidth = value.sourceSize.w;
                frameHeight = value.sourceSize.h;

            }

        });

        numberOfFrames = frames.length;

        spriteObj.frames = frames;
        spriteObj.width = frameWidth;
        spriteObj.height = frameHeight;
        spriteObj.numberOfFrames = numberOfFrames;

    }

    //takes an sprite object and setup the image source attribute (PNG)
    function setPNG(spriteObj, src) {
        
        var mascoteImagem = new Image();

        mascoteImagem.src = src;

        spriteObj.image = mascoteImagem;

    };

    function getMascoteIndex(idMascote) {

        for (i = 0; i < mascotesList.length; i++)

            if (mascotesList[i].id == idMascote)

                return i;

        return -1;

    }
    
    //get the canvas element from HTML 
    function getCanvas(idCanvas) {

        return document.getElementById(idCanvas);

    }

    //setup the dimensios of the canvas with the Sprite Object dimensions
    function setCanvasProperties(canvas, spriteObj) {

        canvas.width = spriteObj.width;
        canvas.height = spriteObj.height;

    }

    //set events to the canvas
    function setCanvasEvents(canvas) {

        canvas.onmouseover = function() {

            mascoteIndex = getMascoteIndex(canvas.id);

            mascotesList[mascoteIndex].stopAnim = false;

            if (!mascotesList[mascoteIndex].runningAnim) {

                mascotesList[mascoteIndex].animLoop();

                mascotesList[mascoteIndex].runningAnim = !mascotesList[mascoteIndex].runningAnim;
            }
        }

        canvas.onmouseleave = function(){

            mascoteIndex = getMascoteIndex(canvas.id);

            mascotesList[mascoteIndex].stop();

            //mascotesList[mascoteIndex].runningAnim = !mascotesList[mascoteIndex].runningAnim;
        };

        canvas.onclick = function() {
            //change this comment by your code on click
            ;
        };
    }
    
    //load mascote and put it into the global mascotes list 
    function loadMascote(canvas) {
        
        var idMascote = canvas.id;

        //da pra fazer depois uma funcao que retorna o caminho de forma dinamica...buscando a pasta SpritesheetsLib independentemente de onde ela esteja
        // var pathWithoutExtension = "./SpriteSheetsLib/" + idMascote;
        var pathWithoutExtension = "./" + idMascote;

        var pathJSON = pathWithoutExtension + ".json";

        //create an empty sprite object
        var spriteObject = createSpriteObject({id: idMascote});
        
        //set the canvas context to 2d
        spriteObject.context = canvas.getContext("2d");

        //set the PNG source containing the frames 
        setPNG(spriteObject, pathWithoutExtension + ".png");

        setCanvasEvents(canvas);

        //here it is necessary an assync function - when the JSON request returns the JSON, then executes the block inside
        $.getJSON(pathJSON, function(dataJSON){

            //set the JSON data to the sprite object created
            setDataSpritesFromJson(spriteObject, dataJSON);

            //configure some canvas attributes with spriteObject data
            setCanvasProperties(canvas, spriteObject);

            //includes this spriteObject created to the mascotes list to be animated
            mascotesList.push(spriteObject);
        });
    }

   //load all the mascotes from HTML
   (function loadAllMascotes() {

        //get all the HTML canvas that will cheer the mascotes
        var canvasList = document.getElementsByClassName("canvasMascote");
        
        for (i = 0; i < canvasList.length; i++)
            
            loadMascote(canvasList[i]);
    }())
    //loadAllMascotes();

});

