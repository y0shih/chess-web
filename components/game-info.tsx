"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, User } from "lucide-react"
import { useEffect, useState } from "react"

interface GameInfoProps {
  currentPlayer: string
  gameStatus: string
  username: string
  whiteTime: number
  blackTime: number
  lastMoveTime: number
  turn: 'w' | 'b'
  outcome?: { winner: 'white' | 'black' | 'draw'; reason: string };
  id: string;
}

export default function GameInfo({ currentPlayer, gameStatus, username, whiteTime, blackTime, lastMoveTime, turn, outcome, id }: GameInfoProps) {
  const [displayWhiteTime, setDisplayWhiteTime] = useState(whiteTime)
  const [displayBlackTime, setDisplayBlackTime] = useState(blackTime)

  useEffect(() => {
    setDisplayWhiteTime(whiteTime)
    setDisplayBlackTime(blackTime)
  }, [whiteTime, blackTime])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameStatus === "playing") {
      timer = setInterval(() => {
        const now = Date.now()
        const elapsed = now - lastMoveTime

        if (turn === "w") {
          setDisplayWhiteTime(Math.max(0, whiteTime - elapsed))
        } else {
          setDisplayBlackTime(Math.max(0, blackTime - elapsed))
        }
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [gameStatus, whiteTime, blackTime, lastMoveTime, turn])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "playing":
        return "text-green-600"
      case "waiting":
        return "text-yellow-600"
      case "resigned":
      case "checkmate":
      case "draw":
      case "stalemate":
        return "text-red-600"
      case "check":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    if (outcome) {
      if (outcome.winner === 'draw') {
        return `Draw! ${outcome.reason}`;
      } else {
        return `${outcome.winner} wins! ${outcome.reason}`;
      }
    }
    switch (status) {
      case "playing":
        return "Game in Progress"
      case "waiting":
        return "Waiting for Opponent"
      case "resigned":
        return "Game Over - Resigned"
      case "checkmate":
        return `Checkmate! ${currentPlayer === "white" ? "Black" : "White"} wins!`
      case "stalemate":
        return "Stalemate! It's a draw."
      case "draw":
        return "Draw!"
      case "check":
        return `Check! ${currentPlayer === "white" ? "White" : "Black"} is in check.`
      default:
        return "Ready to Play"
    }
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium">{username}</span>
          </div>

          <div className="text-center">
            <div className={`font-semibold ${getStatusColor(gameStatus)}`}>{getStatusText(gameStatus)}</div>
            {(!outcome && (gameStatus === "playing" || gameStatus === "check")) && (
              <div className="text-sm text-gray-600">
                Current turn: <span className="font-medium capitalize">{currentPlayer}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{formatTime(displayWhiteTime)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div></div> {/* Spacer */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{formatTime(displayBlackTime)}</span>
          </div>
        </div>
        <div className="text-center mt-2 text-sm text-gray-500">
          Game ID: {id}
        </div>
      </CardContent>
    </Card>
  )
}