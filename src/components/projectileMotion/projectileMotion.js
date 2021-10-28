import React, { useEffect } from 'react';
import InputField from './inputField';
import { inputDragMap, inputMap } from './inputMap';
import './projectileMotion.scss';

const ProjectileMotion = (props) => {
    useEffect(() => {
        buildGrid();
    }, []);

    let projectileList = [];
    let projectileCount = 0;
    let applyDrag = false;
    let pathMap = new Map();
    let projectileRadius = 5;
    const gridSizeY = 700;
    const gridSizeX = 1200;
    const ballColor = 'blue';
    const dpr = 3;
    let mass = 1000;
    let airDensity = 1.225;
    let dragCoeff = 0.5;
    let angle = 45;
    let fireVelocity = 60;
    let renderInterval = null;
    let xCoor = 0;
    let yCoor = 0;

    const buildGrid = () => {
        let canvas = document.getElementById('my-canvas-projectile');
        if (canvas) {
            let canvasContext = canvas.getContext('2d');
            canvasContext.save();
            canvasContext.scale(dpr, dpr);
            canvasContext.font = '0.9rem Arial';
            canvasContext.clearRect(0, 0, gridSizeX, gridSizeY);
            canvasContext.beginPath();
            canvasContext.strokeStyle = 'black';
            canvasContext.strokeRect(0, 0, gridSizeX, gridSizeY);
            canvasContext.fillStyle = 'white';
            canvasContext.fillRect(1, 1, gridSizeX - 2, gridSizeY - 2);
            canvasContext.closePath();
            generateYAxis();
            generateXAxis();
            drawPath();
            canvasContext.beginPath();
            canvasContext.textAlign = 'center';
            canvasContext.fillStyle = 'black';
            canvasContext.fillText(
                'Click to fire projectile',
                gridSizeX / 2,
                gridSizeY / 2,
            );
            canvasContext.textAlign = 'start';
            canvasContext.closePath();
            projectileList.forEach((proj) => {
                generateCanvasPrjojectile(
                    proj.xMovement,
                    proj.yMovement,
                    proj.radius,
                    ballColor,
                    proj.xSpeed,
                    proj.ySpeed,
                    proj.timeToImpact,
                    proj.velocityAngle,
                    proj.velocity,
                );
            });
            canvasContext.restore();
        }
    };

    const drawPath = () => {
        let canvas = document.getElementById('my-canvas-projectile');
        let canvasContext = canvas.getContext('2d');
        canvasContext.beginPath();
        canvasContext.setLineDash([3, 3]);
        canvasContext.strokeStyle = 'red';
        pathMap.forEach((value) => {
            value.forEach((point, i) => {
                if (i === 0) {
                    canvasContext.moveTo(point.x, point.y);
                } else {
                    canvasContext.lineTo(point.x, point.y);
                }
            });
        });
        canvasContext.stroke();
        canvasContext.setLineDash([]);
        canvasContext.closePath();
    };

    const generateCanvasPrjojectile = (
        x,
        y,
        radius,
        color,
        xSpeed,
        ySpeed,
        time,
        velocityAngle,
        velocity,
    ) => {
        let canvas = document.getElementById('my-canvas-projectile');
        let canvasContext = canvas.getContext('2d');
        canvasContext.beginPath();
        canvasContext.strokeStyle = color;
        canvasContext.fillStyle = color;
        canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
        canvasContext.fill();
        canvasContext.fillStyle = '#000000';
        canvasContext.stroke();
        canvasContext.closePath();
        canvasContext.beginPath();
        canvasContext.translate(x, y);
        canvasContext.fillText(`y-speed: ${ySpeed.toFixed(3)} m/s`, -10, -70);
        canvasContext.fillText(`x-speed: ${xSpeed.toFixed(3)} m/s`, -10, -55);
        canvasContext.fillText(`x: ${x.toFixed(3)} m`, -10, -40);
        canvasContext.fillText(
            `y: ${(gridSizeY - y - radius).toFixed(3)} m`,
            -10,
            -25,
        );
        canvasContext.fillText(`t: ${time.toFixed(3)} s`, -10, -10);
        canvasContext.translate(-x, -y);
        canvasContext.translate(x, y);
        canvasContext.rotate(velocityAngle + 90 * (Math.PI / 180));
        canvasContext.strokeStyle = 'green';
        canvasContext.moveTo(0, -radius);
        canvasContext.lineTo(0, -radius - velocity * 0.8);
        canvasContext.moveTo(0, radius);
        canvasContext.lineTo(0, radius + velocity * 0.5);
        canvasContext.moveTo(0, radius);
        canvasContext.translate(0, -radius - velocity * 0.8);
        canvasContext.moveTo(0, 0);
        canvasContext.lineTo(3, 5);
        canvasContext.moveTo(0, 0);
        canvasContext.lineTo(-3, 5);
        canvasContext.translate(0, radius + velocity * 0.8);
        canvasContext.translate(0, radius + velocity * 0.5);
        canvasContext.moveTo(0, 0);
        canvasContext.lineTo(3, -5);
        canvasContext.moveTo(0, 0);
        canvasContext.lineTo(-3, -5);
        canvasContext.translate(0, -radius - velocity * 0.5);
        canvasContext.rotate(-(velocityAngle + 90 * (Math.PI / 180)));
        canvasContext.translate(-x, -y);
        canvasContext.translate(x, y);
        canvasContext.moveTo(0, radius);
        canvasContext.lineTo(0, radius + 25);
        canvasContext.translate(0, radius + 25);
        canvasContext.moveTo(0, 0);
        canvasContext.lineTo(3, -5);
        canvasContext.moveTo(0, 0);
        canvasContext.lineTo(-3, -5);
        canvasContext.translate(0, -radius - 25);
        canvasContext.translate(-x, -y);
        canvasContext.stroke();
        canvasContext.fillStyle = color;
        canvasContext.closePath();
    };

    const generateYAxis = () => {
        let intervalCount = gridSizeY / 100;
        let canvas = document.getElementById('my-canvas-projectile');
        let canvasContext = canvas.getContext('2d');
        for (let i = 0; i <= intervalCount; i++) {
            canvasContext.beginPath();
            canvasContext.fillStyle = 'black';
            canvasContext.fillText(`${i * 100}m`, 0, gridSizeY - i * 100);
            canvasContext.fillStyle = ballColor;
            canvasContext.closePath();
        }
    };

    const generateXAxis = () => {
        let intervalCount = gridSizeX / 100;
        let canvas = document.getElementById('my-canvas-projectile');
        let canvasContext = canvas.getContext('2d');
        for (let i = 1; i <= intervalCount; i++) {
            canvasContext.beginPath();
            canvasContext.fillStyle = 'black';
            canvasContext.fillText(`${i * 100}m`, i * 100, gridSizeY);
            canvasContext.fillStyle = ballColor;
            canvasContext.closePath();
        }
    };

    const renderWinnerOverlay = () => {
        let secToGame = 5;
        const winnerOverlay = document.createElement('div');
        winnerOverlay.innerHTML =
            '<h1>Winner! Starting mini game in 5 seconds</h1>';
        winnerOverlay.className = 'winner-overlay';
        document.querySelector('#root').appendChild(winnerOverlay);
        const interval = setInterval(() => {
            secToGame--;
            winnerOverlay.innerHTML = `<h1>Winner! Starting mini game in ${secToGame} seconds</h1>`;
        }, 1000);
        setTimeout(() => {
            clearInterval(interval);
            winnerOverlay && winnerOverlay.remove();
            props.setRenderGame(true);
        }, 5000);
    };

    const startInterval = () => {
        renderInterval = setInterval(() => {
            if (document.getElementById('my-canvas-projectile')) {
                projectileList.forEach((proj) => {
                    if (
                        proj.yMovement > gridSizeY - proj.radius &&
                        proj.start === false
                    ) {
                        proj.yMovement = gridSizeY - proj.radius;
                        if (
                            Math.round(proj.xMovement) === 777 &&
                            angle !== 0 &&
                            Math.abs(angle) !== 90 &&
                            fireVelocity > 10
                        ) {
                            renderWinnerOverlay();
                        }
                        proj.bottom = true;
                    } else {
                        if (proj.yMovement < gridSizeY - proj.radius) {
                            proj.start = false;
                        }
                        if (proj.bottom === false) {
                            proj.ySpeed = proj.ySpeed + 9.8 / 100;
                            let velocity = Math.sqrt(
                                proj.ySpeed ** 2 + proj.xSpeed ** 2,
                            );
                            let xNegAccel = null;
                            let yNegAccel = null;
                            if (applyDrag) {
                                let xDragForce =
                                    dragCoeff *
                                    0.5 *
                                    airDensity *
                                    proj.xSpeed ** 2 *
                                    Math.PI *
                                    proj.radius ** 2;
                                let yDragForce =
                                    dragCoeff *
                                    0.5 *
                                    airDensity *
                                    proj.ySpeed ** 2 *
                                    Math.PI *
                                    proj.radius ** 2;
                                xNegAccel = xDragForce / mass / 100;
                                yNegAccel = yDragForce / mass / 100;
                            }
                            proj.velocityAngle = Math.asin(
                                proj.ySpeed / velocity,
                            );
                            if (applyDrag) {
                                proj.xSpeed -= xNegAccel;
                                if (proj.ySpeed < 0) {
                                    proj.ySpeed += yNegAccel;
                                } else {
                                    proj.ySpeed -= yNegAccel;
                                }
                            }
                            proj.velocity = velocity;
                            proj.xMovement = proj.xMovement + proj.xSpeed / 100;
                            proj.yMovement = proj.yMovement + proj.ySpeed / 100;
                            proj.timeToImpact = proj.timeToImpact + 0.01;
                            if (pathMap.has(proj.id)) {
                                pathMap.get(proj.id).push({
                                    x: proj.xMovement,
                                    y: proj.yMovement,
                                });
                            }
                        }
                    }
                    buildGrid();
                });
            } else {
                clearInterval(renderInterval);
            }
            let tempList = projectileList.filter(
                (projectiles) => projectiles.bottom === false,
            );
            if (tempList.length === 0) {
                clearInterval(renderInterval);
            }
        }, 10);
    };

    const handleCanvasClick = () => {
        clearInterval(renderInterval);
        projectileList.push({
            id: projectileCount,
            velocityAngle: 0,
            start: true,
            timeToImpact: 0,
            xMovement: xCoor,
            yMovement: gridSizeY - yCoor - projectileRadius,
            bottom: false,
            xSpeed: Math.cos(angle * (Math.PI / 180)) * fireVelocity,
            ySpeed: -Math.sin(angle * (Math.PI / 180)) * fireVelocity,
            velocity: 0,
            radius: projectileRadius,
        });
        pathMap.set(projectileCount, []);
        projectileCount++;
        if (projectileList.length === 4) {
            let firstId = projectileList[0].id;
            pathMap.delete(firstId);
            projectileList.shift();
        }
        startInterval();
    };

    const handleInputChange = (target) => {
        target.value = target.value.replace(/[^0-9\.]/g, '');
        const valueMap = {
            'y-coor': (newVal) => (yCoor = newVal),
            'x-coor': (newVal) => (xCoor = newVal),
            angle: (newVal) => (angle = newVal),
            'fire-velocity': (newVal) => (fireVelocity = newVal),
            mass: (newVal) => (mass = newVal),
            radius: (newVal) => (projectileRadius = newVal),
            fluid: (newVal) => (airDensity = newVal),
            dragCoeff: (newVal) => (dragCoeff = newVal),
        };
        const id = target.id;
        valueMap[id](
            target.value && !isNaN(target.value)
                ? parseFloat(target.value)
                : null,
        );
    };

    const toggleDragInput = () => {
        applyDrag = !applyDrag;
        if (applyDrag) {
            document.getElementById('drag-inputs').style.display = 'flex';
        } else {
            document.getElementById('drag-inputs').style.display = 'none';
        }
    };

    return (
        <div className='draw-container' id='draw-container' tabIndex='0'>
            <section className='input-parent'>
                <div className='input-container'>
                    {inputMap.map((obj, index) => {
                        return (
                            <InputField
                                key={index}
                                id={obj.id}
                                placeholder={obj.placeholder}
                                defaultValue={obj.defaultValue}
                                label={obj.label}
                                handleChange={handleInputChange}
                            />
                        );
                    })}
                    <div className='input-field-container' id='drag-container'>
                        <label className='grid-label' htmlFor='drag'>
                            Apply Drag
                        </label>
                        <input
                            id='drag'
                            type='checkbox'
                            onChange={toggleDragInput}
                        ></input>
                    </div>
                </div>
                <div
                    className='input-container drag'
                    id='drag-inputs'
                    style={{ display: 'none' }}
                >
                    {inputDragMap.map((obj, index) => {
                        return (
                            <InputField
                                key={index}
                                id={obj.id}
                                placeholder={obj.placeholder}
                                defaultValue={obj.defaultValue}
                                label={obj.label}
                                handleChange={handleInputChange}
                            />
                        );
                    })}
                </div>
            </section>
            <div className='move-container' id='projectile-move-container'>
                <canvas
                    className='canvas'
                    id='my-canvas-projectile'
                    height={gridSizeY * dpr}
                    width={gridSizeX * dpr}
                    onClick={handleCanvasClick}
                />
            </div>
        </div>
    );
};

export default ProjectileMotion;
