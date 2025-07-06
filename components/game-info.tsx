"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, User } from "lucide-react"

interface GameInfoProps {
  currentPlayer: string
  gameStatus: string
  username: string
}

export default function GameInfo({ currentPlayer, gameStatus, username }: GameInfoProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "playing":
        return "text-green-600"
      case "waiting":
        return "text-yellow-600"
      case "resigned":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "playing":
        return "Game in Progress"
      case "waiting":
        return "Waiting for Opponent"
      case "resigned":
        return "Game Over - Resigned"
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
            {gameStatus === "playing" && (
              <div className="text-sm text-gray-600">
                Current turn: <span className="font-medium capitalize">{currentPlayer}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">15:00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
