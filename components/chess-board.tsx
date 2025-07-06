"use client"

import { useState, useEffect } from "react"
import { Chess } from "chess.js"

interface ChessBoardProps {
  onMove: (move: any) => void
}

export default function ChessBoard({ onMove }: ChessBoardProps) {
  const [game, setGame] = useState(new Chess())
  const [board, setBoard] = useState<string[][]>([])

  useEffect(() => {
    // Initialize the board
    updateBoard()
  }, [])

  const updateBoard = () => {
    const boardArray = []
    const fen = game.fen().split(" ")[0]
    const rows = fen.split("/")

    for (let i = 0; i < 8; i++) {
      const row = []
      let colIndex = 0

      for (const char of rows[i]) {
        if (isNaN(Number.parseInt(char))) {
          row.push(char)
          colIndex++
        } else {
          const emptySquares = Number.parseInt(char)
          for (let j = 0; j < emptySquares; j++) {
            row.push("")
            colIndex++
          }
        }
      }
      boardArray.push(row)
    }
    setBoard(boardArray)
  }

  const getPieceSymbol = (piece: string) => {
    const pieces: { [key: string]: string } = {
      K: "♔",
      Q: "♕",
      R: "♖",
      B: "♗",
      N: "♘",
      P: "♙",
      k: "♚",
      q: "♛",
      r: "♜",
      b: "♝",
      n: "♞",
      p: "♟",
    }
    return pieces[piece] || ""
  }

  const handleSquareClick = (row: number, col: number) => {
    // This is a simplified move handling - in a real implementation,
    // you'd want to track selected squares and validate moves
    console.log(`Clicked square: ${String.fromCharCode(97 + col)}${8 - row}`)
  }

  return (
    <div className="flex justify-center mt-4">
      <div className="inline-block border-2 border-gray-800">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((piece, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-12 h-12 flex items-center justify-center text-2xl cursor-pointer
                  ${(rowIndex + colIndex) % 2 === 0 ? "bg-amber-100" : "bg-amber-800"}
                  hover:bg-blue-200 transition-colors
                `}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {getPieceSymbol(piece)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
