import Matter from 'matter-js';
import { getRandomUpperPosition, getRandomColor } from '../utils/helpers';

export const setupCollisionHandlers = (engine, entities, setScore, setIsGameOver, setLevelCompleted) => {
    // Remove any existing collision events to prevent duplicates
    Matter.Events.off(engine, 'collisionStart');

    // Handle collisions
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((collision) => {
            const { bodyA, bodyB } = collision;
            
            // Player-enemy collision (score point)
            if ((bodyA.label === 'player' && bodyB.label === 'enemy') ||
                (bodyA.label === 'enemy' && bodyB.label === 'player')) {
                
                setScore(prevScore => {
                    const newScore = prevScore + 1;
                    
                    // Check for win condition (5 points)
                    if (newScore >= 5) {
                        setLevelCompleted(true);
                        setIsGameOver(true);
                    }
                    
                    return newScore;
                });
                
                const player = bodyA.label === 'player' ? bodyA : bodyB;
                const enemy = bodyA.label === 'enemy' ? bodyA : bodyB;
                
                Matter.Body.setVelocity(player, { x: 0, y: 0 });
                const newPos = getRandomUpperPosition();
                Matter.Body.setPosition(enemy, newPos);
                
                if (entities && entities.player) {
                    entities.player.color = getRandomColor();
                }
                
            } 
            // Player-wall collision
            else if ((bodyA.label === 'player' && (bodyB.label === 'wall' || bodyB.label === 'centerWall')) ||
                    ((bodyA.label === 'wall' || bodyA.label === 'centerWall') && bodyB.label === 'player')) {
                const player = bodyA.label === 'player' ? bodyA : bodyB;
                Matter.Body.setVelocity(player, { x: 0, y: 0 });

                if (entities && entities.player) {
                    entities.player.color = getRandomColor();
                }

            } 
            // Player-enemy2 collision
            else if ((bodyA.label === 'player' && bodyB.label === 'Enemy2') ||
                    (bodyA.label === 'Enemy2' && bodyB.label === 'player')) {
                const enemy2 = bodyA.label === 'Enemy2' ? bodyA : bodyB;
                Matter.Body.setVelocity(enemy2, { x: 0, y: -50 });
                
                if (entities && entities.enemy2) {
                    entities.enemy2.color = getRandomColor();
                }
            }
            // enemy2 - centerWall (floor) collision
            // Trigger loss if Enemy2 hits center wall
            else if ((bodyA.label === 'Enemy2' && bodyB.label === 'centerWall') ||
                    (bodyB.label === 'Enemy2' && bodyA.label === 'centerWall')) {
                setIsGameOver(true);
                setLevelCompleted(false);
            }
        });
    });
    
    return () => {
        Matter.Events.off(engine, 'collisionStart');
    };
};