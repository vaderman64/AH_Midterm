import React, { useEffect, useState, useRef } from 'react';
import { View, Text, PanResponder } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

// Import components
import ControlButton from './components/ControlButton';
import StartButton from './components/StartButton';

// Import game systems
import MovementSystem from './systems/MovementSystem';

// Import physics utilities
import { movePlayer, stopPlayer } from './physics/physics';
import { setupCollisionHandlers } from './physics/collisionHandlers';

// Import entity creation
import { setupWorld } from './entities/createEntities';

// Import helpers
import { getRandomColor } from './utils/helpers';

// Game component to manage state of entities and handle controls
const Game = () => {
    // State variables
    const [gameEntities, setGameEntities] = useState(null); // stores entities
    const [isGameStarted, setIsGameStarted] = useState(false); // value for if the game was started
    const [score, setScore] = useState(0); // value for player score
    const [isGameOver, setIsGameOver] = useState(false); // value for tracking if the game is over
    const [levelCompleted, setLevelCompleted] = useState(false); // value for tracking if the level complete message should display

    // references for game engine and entities
    const gameEngineRef = useRef(null);
    const entitiesRef = useRef(null);
    
    // Start or restart the game
    const startGame = () => {
        setIsGameStarted(true);
        
        if (isGameOver && !levelCompleted) {
            // Reset score on loss, but preserve on win
            setScore(0);
        }
        
        setIsGameOver(false);
        
        // Setup new world and entities
        const newEntities = setupWorld();
        setGameEntities(newEntities);
        entitiesRef.current = newEntities;
    };
    
    // Initialize game on first load and setup collision handlers
    useEffect(() => {
        if (isGameStarted && gameEntities) {
            const cleanupCollisionHandlers = setupCollisionHandlers(
                gameEntities.physics.engine,
                entitiesRef.current,
                setScore,
                setIsGameOver,
                setLevelCompleted
            );
            
            return cleanupCollisionHandlers;
        }
    }, [isGameStarted, gameEntities]);
    
    // Start game when isGameStarted changes to true
    useEffect(() => {
        if (isGameStarted && !gameEntities) {
            startGame();
        }
    }, [isGameStarted]);
    
    // Handle cleanup on game over
    useEffect(() => {
        if (isGameOver && entitiesRef.current && entitiesRef.current.physics) {
            Matter.Events.off(entitiesRef.current.physics.engine, 'collisionStart');
        }
    }, [isGameOver]);

    // Function to move player
    const handleMovePlayer = (direction) => {
        
        if (entitiesRef.current && entitiesRef.current.player && entitiesRef.current.player.body) {
            
            movePlayer(entitiesRef.current.player.body, direction);
            
            // Force update the game engine
            if (gameEngineRef.current) {
                gameEngineRef.current.dispatch({ type: 'move-player' });
            }
        } else {
            // console.log("Player body not found!");
        }
    };

    const handleStopPlayer = () => {
        
        if (entitiesRef.current && entitiesRef.current.player && entitiesRef.current.player.body) {
            stopPlayer(entitiesRef.current.player.body);
            
            // Force update the game engine
            if (gameEngineRef.current) {
                gameEngineRef.current.dispatch({ type: 'stop-player' });
            }
        } else {
            // console.log("Player body not found for stopping!");
        }
    };

    // Handle touch events for controlling the enemy's movement
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            if (entitiesRef.current && entitiesRef.current.enemy && entitiesRef.current.enemy.body) {
                // Update position and velocity based on users touch
                const SWIPE_SPEED = 0.8;
                const currentPos = entitiesRef.current.enemy.body.position;
                
                const newX = currentPos.x + (gesture.dx * SWIPE_SPEED);
                const newY = currentPos.y + (gesture.dy * SWIPE_SPEED);
                
                const boundedX = Math.max(entitiesRef.current.enemy.size[0]/2, 
                                        Math.min(entitiesRef.current.rightWall.body.position.x - entitiesRef.current.enemy.size[0]/2, newX));
                const boundedY = Math.max(entitiesRef.current.enemy.size[1]/2, 
                                        Math.min(entitiesRef.current.bottomWall.body.position.y - entitiesRef.current.enemy.size[1]/2, newY));
                
                Matter.Body.setPosition(entitiesRef.current.enemy.body, {
                    x: boundedX,
                    y: boundedY
                });
                
                Matter.Body.setVelocity(entitiesRef.current.enemy.body, {
                    x: gesture.dx * SWIPE_SPEED * 0.5,
                    y: gesture.dy * SWIPE_SPEED * 0.5
                });
            }
        }
    });

    // Show start screen or game over screen
    if ((!gameEntities && !isGameStarted) || isGameOver) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                {levelCompleted && (
                    <Text style={{ 
                        marginBottom: 40, 
                        fontSize: 24, 
                        fontWeight: 'bold', 
                        color: 'green' 
                    }}>
                        Great! Level 1 completed
                    </Text>
                )}
                <StartButton onPress={startGame} title="Start Game" />
            </View>
        );
    }

    if (!gameEntities) return null;

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View {...panResponder.panHandlers} style={{ flex: 1 }}>
                <GameEngine
                    ref={gameEngineRef}
                    systems={[MovementSystem]}
                    entities={gameEntities}
                    running={true}
                />
            </View>
            
            {/* View to hold everything */}
            <View style={{ 
                position: 'absolute', 
                bottom: 100, 
                left: 0, 
                right: 0,
                alignItems: 'center'
            }}>
                {/* Buttons for player input */}
                <ControlButton style={{top: 30, backgroundColor: '#942586', borderRadius: 0}}
                    onPress={() => handleMovePlayer('up')} 
                    title="Up" 
                />
                <View style={{ flexDirection: 'row', top: 30 }}>
                    <ControlButton 
                        style={{ backgroundColor: '#005A00', borderRadius: 0, left: 6}}
                        onPress={() => handleMovePlayer('left')} 
                        title="Left" 
                    />
                    <ControlButton style={{ backgroundColor: '#942586', borderRadius: 0, left: 6}}
                        onPress={() => handleMovePlayer('down')} 
                        title="Down" 
                    />
                    <ControlButton style={{ backgroundColor: '#005A00', borderRadius: 0, left: 6}}
                        onPress={() => handleMovePlayer('right')} 
                        title="Right" 
                    />
                </View>
                <ControlButton 
                    onPress={() => handleStopPlayer()} 
                    title="stop" 
                    style={{
                        borderRadius: 0,
                        top: 25
                    }}
                />
            </View>

            {/* Score Display */}
            <Text style={{
                position: 'absolute',
                top: 40,
                width: '100%',
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 'bold',
            }}>
                Score: {score}0
            </Text>

            {/* Text for your name */}
            <Text style={{
                position: 'absolute',
                bottom: 40,
                width: '100%',
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 'bold'
            }}>
                Midterm - AJ Henderson
            </Text>
        </View>
    );
};

export default Game;