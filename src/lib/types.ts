export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
    x: number;
    y: number;
}

export interface GameConfig {
    gridSize: number;
    initialSpeed: number;
    speedIncrease: number;
} 