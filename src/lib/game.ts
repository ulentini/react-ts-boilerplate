import Snake from "./snake"

const MAX_TICK = 0.5
const MIN_TICK = 0.12
const MAX_LEVEL = 10
const MAZE_DIMENSIONS = [14, 20]

export enum Direction {
  UP = "UP",
  RIGHT = "RIGHT",
  DOWN = "DOWN",
  LEFT = "LEFT",
}

export enum GameStatus {
  RUNNING = "RUNNING",
  OVER = "OVER",
  PAUSED = "PAUSED",
}

export default class Game {
  public score: number
  public level: number
  public direction: Direction
  public nextDirection: Direction
  public snake: Snake
  public mazeDimensions: number[]
  public tickValue: number
  public food: number[]
  public justEaten: boolean

  public constructor({
    level = 1,
    mazeDimensions = MAZE_DIMENSIONS,
  }: {
    level?: number
    baseTick?: number
    mazeDimensions?: number[]
  }) {
    this.score = 0
    this.level = level
    this.direction = Direction.RIGHT
    this.nextDirection = Direction.RIGHT
    this.tickValue = 0
    this.mazeDimensions = mazeDimensions
    this.food = []
    this.justEaten = false

    this.snake = new Snake({})

    this.placeNewFood()
    this.updateTickValue()
  }

  public updateTickValue(): void {
    const step = (MAX_TICK - MIN_TICK) / (MAX_LEVEL - 1)
    this.tickValue = MAX_TICK - (this.level - 1) * step
  }

  public tick(): void {
    if (this.justEaten) {
      this.justEaten = false
    } else {
      //Check for food
      if (this.snake.hasCollisionWithBlock(this.food)) {
        this.justEaten = true

        //Place new food
        this.placeNewFood()

        this.updateScore()
        this.updateLevel()
        this.updateTickValue()
      }
    }

    //Move the snake
    this.direction = this.nextDirection

    const lastBlock = this.snake.getLastBlock()
    this.snake.moveTo(this.direction)

    if (this.justEaten) {
      //Add block
      this.snake.addNewBlock(lastBlock)
    }
  }

  public isGameOver(): boolean {
    return this.snake.checkForCollisions(this.mazeDimensions)
  }

  public changeDirection(newDirection: Direction): boolean {
    if (this.directionIsOrthogonalToCurrentDirection(newDirection)) {
      this.nextDirection = newDirection
      return true
    }

    return false
  }

  protected directionIsOrthogonalToCurrentDirection(
    newDirection: Direction,
  ): boolean {
    if (newDirection === Direction.UP || newDirection === Direction.DOWN) {
      return (
        this.direction === Direction.LEFT || this.direction === Direction.RIGHT
      )
    } else {
      return (
        this.direction === Direction.UP || this.direction === Direction.DOWN
      )
    }
  }

  public directionIsHorizontal() {
    return (
      this.direction === Direction.LEFT || this.direction === Direction.RIGHT
    )
  }

  public directionIsVertical() {
    return this.direction === Direction.UP || this.direction === Direction.DOWN
  }

  public placeNewFood() {
    let newFood
    do {
      newFood = [
        Math.floor(Math.random() * this.mazeDimensions[0]),
        Math.floor(Math.random() * this.mazeDimensions[1]),
      ]
    } while (this.snake.hasCollisionWithBlock(newFood))

    this.food = newFood
  }

  public updateScore() {
    this.score += this.level * 10
  }

  public updateLevel() {
    const newLevel = Math.floor(((this.snake.blocks.length - 4) * 2) / 10 + 1)
    if (this.level < newLevel) {
      this.level = newLevel
    }
  }
}
