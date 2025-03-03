import Matter from 'matter-js';

const MovementSystem = (entities, { time }) => {
    const { physics, enemy2 } = entities;
    Matter.Engine.update(physics.engine, time.delta);

    if (enemy2 && enemy2.body) {
        if (enemy2.body.velocity.y >= 0) {  // Only apply fall speed if not moving up
            const FALL_SPEED = 1;
            Matter.Body.setVelocity(enemy2.body, { x: 0, y: FALL_SPEED });
        }
    }

    return entities;
};

export default MovementSystem;