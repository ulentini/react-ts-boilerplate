import React, { useState, useRef } from "react"
import { Maze } from "./maze"
import Game, { GameStatus, Direction } from "../lib/game"
import { useInterval, useBodyListener } from "../utils/custom-hooks"

const App: React.FC = () => {
  const [game, setGame] = useState(new Game({}))
  const [gameStatus, setGameStatus] = useState(GameStatus.RUNNING)
  const [ticker, setTicker] = useState(0)
  const tickRef = useRef<() => void>()
  const resetIntervalRef = useRef<() => void>()
  const setupIntervalRef = useRef<() => void>()
  let resetInterval: () => void
  let setupInterval: () => void
  let tick: () => void

  const newGame = () => {
    resetInterval()
    setGame(new Game({}))
    setGameStatus(GameStatus.RUNNING)
    setupInterval()
  }

  const togglePause = () => {
    if (gameStatus === GameStatus.PAUSED) {
      setGameStatus(GameStatus.RUNNING)
    } else if (gameStatus !== GameStatus.OVER) {
      setGameStatus(GameStatus.PAUSED)
    }
  }

  const moveSnake = () => {
    resetInterval()
    tick()
    setupInterval()
  }

  const moveSnakeBottomLeft = () => {
    if (game.directionIsHorizontal()) {
      game.changeDirection(Direction.DOWN)
    } else {
      game.changeDirection(Direction.LEFT)
    }

    moveSnake()
  }
  const moveSnakeUpRight = () => {
    if (game.directionIsHorizontal()) {
      game.changeDirection(Direction.UP)
    } else {
      game.changeDirection(Direction.RIGHT)
    }

    moveSnake()
  }

  tickRef.current = () => {
    if (gameStatus === GameStatus.RUNNING) {
      game.tick()
      //setGame(game)
      if (game.isGameOver()) {
        setGameStatus(GameStatus.OVER)
        ;(resetIntervalRef.current as () => void)()
      }
      setTicker(ticker + 1)
    }
  }

  tick = () => (tickRef.current as () => void)()
  const intervalFns = useInterval(tick, game.tickValue * 1000)

  resetIntervalRef.current = intervalFns[0]
  setupIntervalRef.current = intervalFns[1]

  resetInterval = () => (resetIntervalRef.current as () => void)()
  setupInterval = () => (setupIntervalRef.current as () => void)()

  useBodyListener(
    "keydown",
    event => {
      const kEvent = event as KeyboardEvent

      if (gameStatus !== GameStatus.OVER) {
        let snakeMoved = false
        switch (kEvent.code) {
          case "KeyP":
          case "Space":
            togglePause()
            break

          case "ArrowUp":
            snakeMoved = game.changeDirection(Direction.UP)
            break
          case "ArrowRight":
            snakeMoved = game.changeDirection(Direction.RIGHT)
            break
          case "ArrowDown":
            snakeMoved = game.changeDirection(Direction.DOWN)
            break
          case "ArrowLeft":
            snakeMoved = game.changeDirection(Direction.LEFT)
            break
          default:
            //nope
            break
        }

        //*/
        if (snakeMoved) {
          moveSnake()
        }
        //*/
      } else {
        switch (kEvent.code) {
          case "KeyN":
            newGame()
            break
          default:
            //nope
            break
        }
      }
    },
    [gameStatus],
  )

  return (
    <div className="bg-white h-screen flex flex-col justify-center items-center">
      <div className="flex justify-between w-80">
        <button
          onClick={newGame}
          className="my-4 uppercase px-4 py-2 bg-blue-600 text-white font-semibold rounded text-xs"
        >
          New game
        </button>

        <button
          onClick={togglePause}
          className="my-4 uppercase px-4 py-2 bg-yellow-600 text-white font-semibold rounded text-xs"
        >
          Pause
        </button>
      </div>
      <div className="w-full flex items-center flex-col">
        {(() => {
          switch (gameStatus) {
            case GameStatus.OVER:
              return (
                <div className="mx-auto text-red-600 text-5xl font-bold h-56 flex items-center">
                  GAME OVER
                </div>
              )

            case GameStatus.PAUSED:
              return (
                <div className="mx-auto text-yellow-600 text-5xl font-bold  h-56 flex items-center ">
                  PAUSED
                </div>
              )

            case GameStatus.RUNNING:
              return <Maze snake={game.snake} food={game.food} />

            default:
              break
          }
        })()}
        <div className="flex justify-between w-80 my-2">
          <div className="rounded bg-gray-200 px-2 py-1 uppercase text-gray-600 font-bold text-xs">
            SCORE: {game.score}
          </div>
          <div className="rounded bg-gray-200 px-2 py-1 uppercase text-gray-600 font-bold text-xs">
            LEVEL: {game.level}
          </div>
        </div>

        <div className="flex w-80 justify-between mt-8">
          <button
            onClick={moveSnakeBottomLeft}
            className="disable-zoom block w-20 h-20 rounded-full bg-green-600"
          />
          <button
            onClick={moveSnakeUpRight}
            className="disable-zoom block w-20 h-20 rounded-full bg-green-600"
          />
        </div>
      </div>
    </div>
  )
}

export default App
