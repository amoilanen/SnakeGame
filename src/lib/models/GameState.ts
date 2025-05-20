import type { Direction, Position } from '$lib/types';
import Snake from '$lib/models/Snake';

export default interface GameState {
    snake: Snake;
    food: Position;
    direction: Direction;
    score: number;
    isGameOver: boolean;
}