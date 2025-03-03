import { Dimensions } from 'react-native';

// Get device dimensions and define constants
export const { width, height } = Dimensions.get('window');
export const WALL_THICKNESS = 40;
export const PLAYER_SIZE = 30;
export const ENEMY_SIZE = 50;

// Function to generate random color
export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Function to generate random position for player to be called after collision
export const getRandomUpperPosition = () => ({
    x: Math.random() * (width - ENEMY_SIZE * 2) + ENEMY_SIZE,
    y: Math.random() * (height/2 - ENEMY_SIZE * 2) + ENEMY_SIZE
});