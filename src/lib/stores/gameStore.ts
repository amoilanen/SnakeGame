import { writable } from 'svelte/store';
import type { Direction, Position, GameConfig } from '$lib/types';
import Snake from '$lib/models/Snake';
import type GameState from '$lib/models/GameState';
import { GRID_SIZE } from '$lib/constants';

const DEFAULT_CONFIG: GameConfig = {
    gridSize: GRID_SIZE,
    initialSpeed: 200,
    speedIncrease: 5
};

const createInitialState = (config: GameConfig): GameState => {
    let snake = new Snake([
        { x: Math.floor(config.gridSize / 2), y: Math.floor(config.gridSize / 2) }
    ]);
    return {
        snake,
        food: generateFood(config.gridSize, snake),
        direction: 'RIGHT',
        score: 0,
        isGameOver: false
    };
};

function generateFood(gridSize: number, snake: Snake): Position {
    let food: Position;
    do {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (snake.eatsFood(food));
    return food;
}

function createGameStore(config: GameConfig = DEFAULT_CONFIG) {
    const { subscribe, set, update } = writable<GameState>(createInitialState(config));

    return {
        subscribe,
        moveSnake: () => {
            update(state => {
                if (state.isGameOver) return state;

                let {
                    updatedSnake,
                    hasCollision,
                    ateFood
                } = state.snake.moveInDirection(state.direction, state.food, config.gridSize);

                if (hasCollision) {
                    return { ...state, isGameOver: true };
                } else if (ateFood) {
                    return {
                        ...state,
                        snake: updatedSnake,
                        food: generateFood(config.gridSize, updatedSnake),
                        score: state.score + 1
                    };
                } else {
                    return { ...state, snake: updatedSnake };
                }
            });
        },
        changeDirection: (newDirection: Direction) => {
            update(state => {
                const opposites = {
                    'UP': 'DOWN',
                    'DOWN': 'UP',
                    'LEFT': 'RIGHT',
                    'RIGHT': 'LEFT'
                };
                
                if (opposites[newDirection] === state.direction) {
                    return state;
                }
                
                return { ...state, direction: newDirection };
            });
        },
        reset: () => {
            set(createInitialState(config));
        },
        setFood: (position: Position) => {
            update(state => ({
                ...state,
                food: position
            }));
        }
    };
}

export const gameStore = createGameStore();
