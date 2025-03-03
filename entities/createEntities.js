import Box from '../components/Box';
import { createPhysicsEngine, createWalls, createPlayer, createEnemies } from '../physics/physics';
import { PLAYER_SIZE, ENEMY_SIZE, width, height, WALL_THICKNESS } from '../utils/helpers';

export const setupWorld = () => {
    // Create physics engine
    const { engine, world } = createPhysicsEngine();
    
    // Create walls
    const { topWall, bottomWall, leftWall, rightWall, centerWall } = createWalls(world);
    
    // Create player
    const player = createPlayer(world);
    
    // Create enemies
    const { enemy, enemy2 } = createEnemies(world);
    
    // Create entities object
    const entities = {
        physics: { engine, world },
        player: { body: player, size: [PLAYER_SIZE, PLAYER_SIZE], color: 'red', renderer: Box },
        enemy: { body: enemy, size: [ENEMY_SIZE, ENEMY_SIZE], color: 'green', renderer: Box },
        enemy2: { body: enemy2, size: [40, 80], color: 'black', renderer: Box },
        topWall: { body: topWall, size: [width, WALL_THICKNESS], color: '#FFE300', renderer: Box },
        bottomWall: { body: bottomWall, size: [width, WALL_THICKNESS], color: '#FFE300', renderer: Box },
        centerWall: { body: centerWall, size: [width, WALL_THICKNESS/2], color: '#FFE300', renderer: Box },
        leftWall: { body: leftWall, size: [WALL_THICKNESS, height], color: '#FFE300', renderer: Box },
        rightWall: { body: rightWall, size: [WALL_THICKNESS, height], color: '#FFE300', renderer: Box }
    };
    
    return entities;
};