import { Direction } from "./game"

const STARTING_BLOCKS = [
  //0
  [6, 11],

  //1
  [6, 10],

  //2
  [6, 9],

  //3
  [6, 8],
]

export default class Snake {
  public blocks: number[][]

  public constructor({
    startingBlocks = [...STARTING_BLOCKS],
  }: {
    startingBlocks?: number[][]
  }) {
    this.blocks = startingBlocks
  }

  public moveTo(direction: Direction): void {
    if (this.blocks.length < 1) {
      throw new Error("Empty block list!")
    }

    this.blocks.pop()
    const firstBlock = this.blocks[0] as number[]
    const nextBlock = [...firstBlock]

    switch (direction) {
      case Direction.UP:
        nextBlock[0]--
        break

      case Direction.RIGHT:
        nextBlock[1]++
        break

      case Direction.DOWN:
        nextBlock[0]++
        break

      case Direction.LEFT:
        nextBlock[1]--
        break

      default:
        throw new Error("Invalid direction: " + direction)
    }

    this.blocks.unshift(nextBlock)
  }

  public checkForCollisions(mazeDimensions: number[]): boolean {
    let verifiedBlocks: { [key: string]: boolean } = {}
    for (let block of this.blocks) {
      //Check for collisions between blocks
      if (verifiedBlocks[block.join("-")]) {
        return true
      }

      //Check for out-of-bound blocks
      if (
        block[0] < 0 ||
        block[1] < 0 ||
        block[0] >= mazeDimensions[0] ||
        block[1] >= mazeDimensions[1]
      ) {
        return true
      }

      verifiedBlocks[block.join("-")] = true
    }

    return false
  }

  public hasCollisionWithBlock(block: number[]) {
    for (let snakeBlock of this.blocks) {
      if (snakeBlock[0] === block[0] && snakeBlock[1] === block[1]) {
        return true
      }
    }

    return false
  }

  public getLastBlock(): number[] {
    return this.blocks.slice(-1)[0]
  }

  public addNewBlock(newBlock: number[]) {
    this.blocks.push([...newBlock])
  }
}
