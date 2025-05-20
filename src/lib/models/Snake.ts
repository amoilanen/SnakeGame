import type { Position, Direction } from '$lib/types';

export interface SnakeMoveResult {
    ateFood: boolean,
    hasCollision: boolean,
    updatedSnake: Snake
}

export default class Snake {
    constructor(public segments: Position[]) {}

    public hasCollision(): boolean {
        let detectedCollision = false;
        if (this.segments.length > 0) {
            const head = { ...this.segments[0] };
            if (this.segments.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
                detectedCollision = true;
            }
        }
        return detectedCollision;
    }

    public hasSegment(segment: Position): boolean {
        return this.segments.some(s => s.x === segment.x && s.y === segment.y);
    }

    public eatsFood(food: Position): boolean {
        return this.hasSegment(food);
    }

    public moveInDirection(direction: Direction, food: Position, gridSize: number): SnakeMoveResult {
        let segments = this.segments;
        const head = { ...segments[0] };

        switch (direction) {
            case 'UP':
                head.y = (head.y - 1 + gridSize) % gridSize;
                break;
            case 'DOWN':
                head.y = (head.y + 1) % gridSize;
                break;
            case 'LEFT':
                head.x = (head.x - 1 + gridSize) % gridSize;
                break;
            case 'RIGHT':
                head.x = (head.x + 1) % gridSize;
                break;
        }

        let hasCollision = segments.some(segment => segment.x === head.x && segment.y === head.y);

        const ateFood = head.x === food.x && head.y === food.y;

        let updatedSegments = [head];
        if (ateFood) {
            updatedSegments.push(...segments);
        } else {
            updatedSegments.push(...segments.slice(0, -1));
        }

        return {
            ateFood,
            hasCollision,
            updatedSnake: new Snake(updatedSegments)
        };
    }
}