/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


window.onload = () => {
    
    let myGame = new _game_js__WEBPACK_IMPORTED_MODULE_0__.default();
    myGame.init();
    
    document.addEventListener("keydown", (event) => {
        const key = event.key;
        let newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                myGame.launch();
                return;
            default:
                return;
        }
        myGame.snakee.setDirection(newDirection);
    });
    
 
}



/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _snake_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _apple_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _drawing_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);




class Game {

    constructor(canvasWidth = 900, canvasHeight = 600, blockSize = 30) {

        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.blockSize = blockSize;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.widthInBlocks = this.canvasWidth/this.blockSize;
        this.heightInBlocks = this.canvasHeight/this.blockSize;
        this.centreX = this.canvasWidth / 2;
        this.centreY = this.canvasHeight / 2;
        this.delay = 100;
        this.snakee;
        this.applee; 
        this.score;
        this.timeOut;

    }

    init () {
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.canvas.style.border = "30px solid gray";
        this.canvas.style.margin = "50px auto";
        this.canvas.style.display = "block";
        this.canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(this.canvas);
        this.launch();
    };
    
    launch () {
        this.snakee = new _snake_js__WEBPACK_IMPORTED_MODULE_0__.default("right", [6,4],[5,4],[4,4],[3,4],[2,4]);
        this.applee = new _apple_js__WEBPACK_IMPORTED_MODULE_1__.default([10,10]);
        this.score = 0;
        clearTimeout(this.timeOut);
        this.delay = 100;
        this.refreshCanvas();
    };
    
    refreshCanvas () {
        this.snakee.advance();
        if (this.snakee.checkCollision(this.widthInBlocks, this.heightInBlocks)){
            _drawing_js__WEBPACK_IMPORTED_MODULE_2__.default.gameOver(this.ctx, this.centreX, this.centreY);
        } else {
            if (this.snakee.isEatingApple(this.applee)){
                this.score++;
                this.snakee.ateApple = true;
                
                do {
                    this.applee.setNewPosition(this.widthInBlocks, this.heightInBlocks); 
                } while(this.applee.isOnSnake(this.snakee));
                
                if(this.score % 5 == 0){
                    this.speedUp();
                }
            }
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            _drawing_js__WEBPACK_IMPORTED_MODULE_2__.default.drawScore(this.ctx, this.score, this.centreX, this.centreY);
            _drawing_js__WEBPACK_IMPORTED_MODULE_2__.default.drawSnake(this.ctx, this.blockSize,this.snakee);
            _drawing_js__WEBPACK_IMPORTED_MODULE_2__.default.drawApple(this.ctx, this.blockSize, this.applee);
            this.timeOut = setTimeout(this.refreshCanvas.bind(this),this.delay);
         }
    };
    
    speedUp () {
        this.delay /= 2;
    };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Snake
/* harmony export */ });
class Snake {
        
    constructor(direction, ...body) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
    }
    
    advance() {
        const nextPosition = this.body[0].slice();
        switch(this.direction){
            case "left":
                nextPosition[0] -= 1;
                break;
            case "right":
                nextPosition[0] += 1;
                break;
            case "down":
                nextPosition[1] += 1;
                break;
            case "up":
                nextPosition[1] -= 1;
                break;
            default:
                throw("invalid direction");
        }
        this.body.unshift(nextPosition);
        if (!this.ateApple)
            this.body.pop();
        else
            this.ateApple = false;
    }
    
    setDirection(newDirection) {
        let allowedDirections;
        switch(this.direction){
            case "left":
            case "right":
                allowedDirections=["up","down"];
                break;
            case "down":
            case "up":
                allowedDirections=["left","right"];
                break;  
           default:
                throw("invalid direction");
        }
        if (allowedDirections.includes(newDirection)){
            this.direction = newDirection;
        }
    }
    
    checkCollision(widthInBlocks, heightInBlocks) {
        let wallCollision = false;
        let snakeCollision = false;
        const [head , ...rest ] = this.body;
        const [snakeX , snakeY] = head;
        const minX = 0;
        const minY = 0;
        const maxX = widthInBlocks - 1;
        const maxY = heightInBlocks - 1;
        const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
        const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
        
        if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            wallCollision = true;
        
        for (let block of rest){
            if (snakeX === block[0] && snakeY === block[1])
                snakeCollision = true;
        }
        
        return wallCollision || snakeCollision;        
    }
    
    isEatingApple(appleToEat) {
        const head = this.body[0];
        if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
            return true;
        else
            return false;
    }
    
}

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Apple
/* harmony export */ });
class Apple {
        
    constructor(position) {
        this.position = position;
    }
    
    setNewPosition(widthInBlocks, heightInBlocks) {
        const newX = Math.round(Math.random()*(widthInBlocks-1));
        const newY = Math.round(Math.random()*(heightInBlocks-1));
        this.position = [newX,newY];
    }
    
    isOnSnake(snakeToCheck) {
        let isOnSnake = false;
        for (let block of snakeToCheck.body){
            if(this.position[0] === block[0] && this.position[1] === block[1]){
                isOnSnake = true;     
            }
        }
        return isOnSnake;
    }

}

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Drawing
/* harmony export */ });
class Drawing {
        
    static gameOver (ctx, centreX, centreY) {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    };

    static drawScore (ctx, score, centreX, centreY) {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    };

    static drawSnake(ctx, blockSize, snake) {
        ctx.save();
        ctx.fillStyle="#ff0000";
        for (let block of snake.body){
            this.drawBlock(ctx, block, blockSize);
        }
        ctx.restore();
    }

    static drawBlock (ctx, position, blockSize) {
        const [x , y] = position;
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    };

    static drawApple(ctx, blockSize, apple) {
        const radius = blockSize/2;
        const x = apple.position[0]*blockSize + radius;
        const y = apple.position[1]*blockSize + radius;
        ctx.save();
        ctx.fillStyle = "#33cc33";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2, true);
        ctx.fill();
        ctx.restore();
      }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__(0);
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;