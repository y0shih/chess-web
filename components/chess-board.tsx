"use client"

import { useState, useEffect } from "react"

interface ChessBoardProps {
  mode: string | null
  onMove: (move: any) => void
  gameState: any // Will be GameState from backend
  playerColor: 'white' | 'black' | 'spectator' | null
}

export default function ChessBoard({ mode, onMove, gameState, playerColor }: ChessBoardProps) {
  const [board, setBoard] = useState<(string | null)[][]>([])
  const [selectedPiece, setSelectedPiece] = useState<{ row: number; col: number } | null>(null)

  useEffect(() => {
    if (gameState && gameState.board) {
      const boardArray = []
      for (let i = 0; i < 8; i++) {
        const row = []
        for (let j = 0; j < 8; j++) {
          const piece = gameState.board[i][j]
          if (piece) {
            row.push(piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase())
          } else {
            row.push(null)
          }
        }
        boardArray.push(row)
      }
      setBoard(boardArray)
    }
  }, [gameState])

  const getPieceImage = (piece: string | null) => {
    if (!piece) return null
    const pieceColor = piece === piece.toUpperCase() ? "w" : "b"
    const pieceFile = `${pieceColor}${piece.toUpperCase()}.png`
    return <img src={`/pieces/${pieceFile}`} alt={piece} />
  }

  const handleSquareClick = (row: number, col: number) => {
    if (!gameState || gameState.gameOver) return // Disable moves if game is over or state not loaded

    const algebraic = (String.fromCharCode(97 + col) + (8 - row)) as any

    if (selectedPiece) {
      const from = (String.fromCharCode(97 + selectedPiece.col) + (8 - selectedPiece.row)) as any
      const to = algebraic

      // Emit move to backend
      onMove({ from, to })
      setSelectedPiece(null)
    } else {
      const piece = gameState.board[row][col]
      if (piece) {
        // Allow selection if in alone mode or it's the player's turn and their piece
        if (mode === "alone" || (playerColor && piece.color === gameState.turn && piece.color === playerColor[0])) {
          setSelectedPiece({ row, col })
        }
      }
    }
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
                  w-16 h-16 flex items-center justify-center text-2xl cursor-pointer
                  ${(rowIndex + colIndex) % 2 === 0 ? "bg-amber-100" : "bg-amber-800"}
                  ${
                    selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex
                      ? "bg-blue-400"
                      : ""
                  }
                  hover:bg-blue-200 transition-colors
                `}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {getPieceImage(piece)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
