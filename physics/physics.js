import Matter from 'matter-js';
import { width, height, WALL_THICKNESS, PLAYER_SIZE, ENEMY_SIZE, getRandomUpperPosition } from '../utils/helpers';

// Create a new physics engine
export const createPhysicsEngine = () => {
    const engine = Matter.Engine.create();
    const world = engine.world;
    world.gravity.y = 0; // No gravity
    
    return { engine, world };
};

// Create boundary walls
export const createWalls = (world) => {
    const topWall = Matter.Bodies.rectangle(width/2, 0, width, WALL_THICKNESS, { 
        isStatic: true, 
        label: 'wall'
    });

    const bottomWall = Matter.Bodies.rectangle(width/2, height, width, WALL_THICKNESS, { 
        isStatic: true, 
        label: 'wall'
    });

    const leftWall = Matter.Bodies.rectangle(0, height/2, WALL_THICKNESS, height, { 
        isStatic: true, 
        label: 'wall'
    });

    const rightWall = Matter.Bodies.rectangle(width, height/2, WALL_THICKNESS, height, { 
        isStatic: true, 
        label: 'wall'
    });

    const centerWall = Matter.Bodies.rectangle(width/2, height/2, width, WALL_THICKNESS/2, { 
        isStatic: true, 
        label: 'centerWall'
    });

    Matter.World.add(world, [topWall, bottomWall, leftWall, rightWall, centerWall]);

    return { topWall, bottomWall, leftWall, rightWall, centerWall };
};

// Create player object
export const createPlayer = (world) => {
    const player = Matter.Bodies.rectangle(
        width/2,
        height/4,
        PLAYER_SIZE,
        PLAYER_SIZE,
        { 
            label: 'player',
            friction: 0,
            frictionAir: 0,
            restitution: 0,
            inertia: Infinity,
            inverseInertia: 0
        }
    );

    Matter.World.add(world, [player]);
    return player;
};

// Create enemy objects
export const createEnemies = (world) => {
    const enemyPosition = getRandomUpperPosition();
    const enemy = Matter.Bodies.rectangle(
        enemyPosition.x,
        enemyPosition.y,
        ENEMY_SIZE,
        ENEMY_SIZE,
        { 
            label: 'enemy',
            friction: 0.1,
            frictionAir: 0.2,
            restitution: 0.2,
            inertia: Infinity,
            inverseInertia: 0
        }
    );
    
    const enemy2Position = getRandomUpperPosition();
    const enemy2 = Matter.Bodies.rectangle(
        enemy2Position.x,
        0,
        40,
        80,
        { 
            isStatic: false,
            label: "Enemy2",
            inertia: Infinity
        }
    );

    Matter.World.add(world, [enemy, enemy2]);
    return { enemy, enemy2 };
};

// Move player
export const movePlayer = (playerBody, direction) => {
    if (!playerBody) return;
    
    const SPEED = 3;
    const velocities = {
        up: { x: 0, y: -SPEED },
        down: { x: 0, y: SPEED },
        left: { x: -SPEED, y: 0 },
        right: { x: SPEED, y: 0 }
    };
    
    Matter.Body.setVelocity(playerBody, velocities[direction]);
};

// Stop player
export const stopPlayer = (playerBody) => {
    if (!playerBody) return;
    Matter.Body.setVelocity(playerBody, { x: 0, y: 0 });
};