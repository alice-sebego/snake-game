import Game from './game.js';

window.onload = () => {
    
    let myGame = new Game();
    myGame.init();
    
    document.addEventListener("keydown", event => {
        
        // if (event.preventDefaulted) {
        //     return; 
        // }
        event.preventDefault();    
     
        let newDirection;
        switch(event.code){
            case "ArrowLeft":
                newDirection = "left";
                break;
            case "ArrowUp":
                newDirection = "up";
                break;
            case "ArrowRight":
                newDirection = "right";
                break;
            case "ArrowDown":
                newDirection = "down";
                break;
            case "Space":
                myGame.launch();
                return;
            default:
                return;
        }
        myGame.snakee.setDirection(newDirection);
       
    }, true);
    
}
// https://developer.mozilla.org/fr/docs/Web/API/KeyboardEvent/code