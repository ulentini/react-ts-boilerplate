import React from "react"
import Snake from "../lib/snake"

export const Maze: React.FC<{
  snake: Snake
  food: number[]
}> = ({ snake, food }) => {
  return (
    <div className="w-80 h-56 bg-gray-200 relative mx-auto">
      <div
        className={`bg-gray-600 border rounded-full border-gray-200 w-4 h-4 absolute top-0 left-0 ml-${food[1] *
          4} mt-${food[0] * 4}`}
      />
      {snake.blocks.map((block, i) => (
        <div
          key={`block-${i}`}
          className={`bg-gray-800 w-4 h-4 absolute top-0 left-0 ml-${block[1] *
            4} mt-${block[0] * 4}`}
        />
      ))}
    </div>
  )
}
