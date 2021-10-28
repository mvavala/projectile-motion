import React, { useEffect } from 'react';
import './spaceDodger.scss';

const SpaceDodger = () => {
    let xMovement = 20;
    let yMovement = 200;
    let xMovement2 = 20;
    let yMovement2 = 220;
    let isMultiPlayer = null;
    let score = 0;
    let starList = [];
    const smallBoxDim = 10;
    const gridSizeY = 400;
    const gridSizeX = 800;
    const dpr = 2;
    let objectList = [{ x: gridSizeX }, { x: gridSizeX }];
    const movementSpeed = 4;
    let stop = false;
    let newObInterval = 2000;
    let projSpeed = 10;
    let difficulty = null;
    let keySet = new Set();

    useEffect(() => {
        buildGrid();
    }, []);

    if (starList.length === 0) {
        for (let i = 0; i < 30; i++) {
            let x = Math.floor(Math.random() * gridSizeX);
            let y = Math.floor(Math.random() * gridSizeY);
            starList.push({ x: x, y: y });
        }
    }

    const buildGrid = () => {
        let canvas = document.getElementById('my-canvas-obj');
        let canvasContext = canvas.getContext('2d');
        canvasContext.save();
        canvasContext.scale(dpr, dpr);
        canvasContext.clearRect(0, 0, gridSizeX, gridSizeY);
        canvasContext.beginPath();
        canvasContext.strokeRect(0, 0, gridSizeX, gridSizeY);
        canvasContext.closePath();
        drawStars();
        generateCanvasRect(
            xMovement,
            yMovement,
            smallBoxDim,
            smallBoxDim,
            'green',
        );
        if (isMultiPlayer) {
            generateCanvasRect(
                xMovement2,
                yMovement2,
                smallBoxDim,
                smallBoxDim,
                'yellow',
            );
        }
        objectList.forEach((obj) => {
            if (!obj.y) {
                obj.y = Math.floor(Math.random() * gridSizeY);
            }
            generateCanvasRect(obj.x, obj.y, 10, 2, 'red');
        });
        canvasContext.restore();
    };

    const generateCanvasRect = (x, y, width, height, color) => {
        let canvas = document.getElementById('my-canvas-obj');
        let canvasContext = canvas.getContext('2d');
        canvasContext.beginPath();
        canvasContext.fillStyle = color;
        canvasContext.fillRect(x, y, width, height);
        canvasContext.stroke();
        canvasContext.closePath();
    };

    const drawStars = () => {
        let canvas = document.getElementById('my-canvas-obj');
        let canvasContext = canvas.getContext('2d');

        canvasContext.strokeStyle = 'white';

        starList.forEach((star) => {
            canvasContext.beginPath();
            canvasContext.arc(star.x, star.y, 1, 0, 2 * Math.PI);
            canvasContext.stroke();
            canvasContext.closePath();
        });
    };

    const start = () => {
        if (document.getElementById('start-overlay')) {
            document.getElementById('start-overlay').remove();
        }
        document.getElementById('draw-container').focus();
        let newObstacles = setInterval(() => {
            objectList.push({ x: gridSizeX });
            if (objectList[0] && objectList[0].x <= -20) {
                objectList.shift();
            }
            buildGrid();
        }, newObInterval);

        let scoreTracker = setInterval(() => {
            score++;
            if (
                window.localStorage.getItem('hi-score') &&
                score > window.localStorage.getItem('hi-score')
            ) {
                window.localStorage.setItem('hi-score', score);
            } else if (!window.localStorage.getItem('hi-score')) {
                window.localStorage.setItem('hi-score', score);
            }
            let isDraw = document.getElementById('draw-container');
            if (isDraw) {
                let scoreKeep = document.getElementById('score-keeper');
                let hiScore = document.getElementById('hi-score');
                scoreKeep.innerText = `Score: ${score}`;
                hiScore.innerText = `Highscore: ${window.localStorage.getItem(
                    'hi-score',
                )}`;
            }
        }, 200);

        const collisionDetection = (obj) => {
            let p1Detection =
                xMovement + smallBoxDim === obj.x &&
                yMovement <= obj.y &&
                yMovement + smallBoxDim >= obj.y;
            let p2Detection =
                xMovement2 + smallBoxDim === obj.x &&
                yMovement2 <= obj.y &&
                yMovement2 + smallBoxDim >= obj.y;
            if (p1Detection || (isMultiPlayer && p2Detection)) {
                stop = true;
            }
        };

        let obstacleMovement = setInterval(() => {
            objectList.forEach((obj) => {
                obj.x--;
                collisionDetection(obj);
            });
            if (stop || !document.getElementById('my-canvas-obj')) {
                clearInterval(obstacleMovement);
                clearInterval(newObstacles);
                clearInterval(scoreTracker);
                clearInterval(difficulty);
                if (document.getElementById('move-container')) {
                    let overlay = document.createElement('div');
                    overlay.id = 'canvas-overlay';
                    overlay.style.height =
                        document.querySelector('canvas').clientHeight + 'px';
                    overlay.style.width =
                        document.querySelector('canvas').clientWidth + 'px';
                    let gameOver = document.createElement('h3');
                    gameOver.innerText = 'GAME OVER!';
                    overlay.appendChild(gameOver);
                    let restart = document.createElement('button');
                    restart.innerText = 'RESTART';
                    restart.onclick = handleRestart;
                    overlay.appendChild(restart);
                    document
                        .getElementById('move-container')
                        .appendChild(overlay);
                }
            } else {
                buildGrid();
            }
        }, projSpeed);

        difficulty = setInterval(() => {
            clearInterval(obstacleMovement);
            clearInterval(newObstacles);
            clearInterval(scoreTracker);
            clearInterval(difficulty);
            newObInterval = newObInterval * 0.5;
            projSpeed = projSpeed * 0.9;
            if (!stop) {
                start();
            }
        }, 10000);
    };

    const handleRestart = () => {
        document.getElementById('canvas-overlay').remove();
        xMovement = 20;
        yMovement = 200;
        xMovement2 = 20;
        yMovement2 = 220;
        newObInterval = 2000;
        projSpeed = 10;
        score = 0;
        objectList = [{ x: gridSizeX }, { x: gridSizeX }];
        stop = false;
        start();
    };

    const addToKeySet = (key) => {
        keySet.add(key);
    };

    const removeFromKeySet = (key) => {
        keySet.delete(key);
    };

    const updateCanvas = (key) => {
        switch (key.toLowerCase()) {
            case 'arrowup':
                if (yMovement !== 0) {
                    yMovement = yMovement - movementSpeed;
                }
                break;
            case 'arrowdown':
                if (yMovement <= gridSizeY - smallBoxDim) {
                    yMovement = yMovement + movementSpeed;
                }
                break;
            case 'arrowleft':
                if (xMovement !== 0) {
                    xMovement = xMovement - movementSpeed;
                }
                break;
            case 'arrowright':
                if (xMovement <= gridSizeX - smallBoxDim) {
                    xMovement = xMovement + movementSpeed;
                }
                break;
            case 'w':
                if (isMultiPlayer && yMovement2 !== 0) {
                    yMovement2 = yMovement2 - movementSpeed;
                }
                break;
            case 's':
                if (isMultiPlayer && yMovement2 <= gridSizeY - smallBoxDim) {
                    yMovement2 = yMovement2 + movementSpeed;
                }
                break;
            case 'a':
                if (isMultiPlayer && xMovement2 !== 0) {
                    xMovement2 = xMovement2 - movementSpeed;
                }
                break;
            case 'd':
                if (isMultiPlayer && xMovement2 <= gridSizeX - smallBoxDim) {
                    xMovement2 = xMovement2 + movementSpeed;
                }
                break;
            default:
                break;
        }
    };

    const handleKeyDown = (e) => {
        e.preventDefault();
        addToKeySet(e.key);
        keySet.forEach((k) => {
            updateCanvas(k);
        });
    };

    const handleKeyUp = (e) => {
        e.preventDefault();
        removeFromKeySet(e.key);
    };

    window.onresize = () => {
        if (document.getElementById('canvas-overlay')) {
            let overlay = document.getElementById('canvas-overlay');
            overlay.style.height =
                document.querySelector('canvas').clientHeight + 'px';
            overlay.style.width =
                document.querySelector('canvas').clientWidth + 'px';
        }
    };

    return (
        <div
            className='draw-container'
            id='draw-container'
            tabIndex='0'
            onKeyDown={(e) => handleKeyDown(e)}
            onKeyUp={(e) => handleKeyUp(e)}
        >
            <div id='score-keeper'>Score: 0</div>
            <div id='hi-score'>
                Highscore:{' '}
                {window.localStorage.getItem('hi-score')
                    ? window.localStorage.getItem('hi-score')
                    : 0}
            </div>
            <div className='button-container'>
                <button
                    onClick={() => {
                        isMultiPlayer = false;
                    }}
                >
                    1 Player
                </button>
                <button
                    onClick={() => {
                        isMultiPlayer = true;
                    }}
                >
                    2 Player
                </button>
            </div>
            <div className='move-container' id='move-container'>
                <div
                    id='start-overlay'
                    style={{
                        height: gridSizeY + 'px',
                        width: gridSizeX + 'px',
                    }}
                >
                    <section className='instruction-section'>
                        <h3>Instructions</h3>
                        <div>Player 1: Arrow Keys</div>
                        <div>Player 2: WASD</div>
                    </section>
                    <button onClick={start}>Start</button>
                </div>
                <canvas
                    className='canvas'
                    id='my-canvas-obj'
                    style={{ height: '40%', width: '60%' }}
                    height={gridSizeY * dpr}
                    width={gridSizeX * dpr}
                />
            </div>
        </div>
    );
};

export default SpaceDodger;
