"use client"

import { useState } from "react"
import ChessBoard from "./chess-board"
import ChatBox from "./chat-box"
import GameControls from "./game-controls"
import GameInfo from "./game-info"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChessGame() {
  const router = useRouter()
  const [username, setUsername] = useState("Player1")
  const [gameStatus, setGameStatus] = useState("waiting")
  const [currentPlayer, setCurrentPlayer] = useState("white")

  const handleResign = () => {
    setGameStatus("resigned")
    alert(`${username} has resigned!`)
  }

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <Button onClick={() => router.push("/")} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Chess Game Online</h1>
        <div></div> {/* Spacer for centering */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Chess Board */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <GameInfo currentPlayer={currentPlayer} gameStatus={gameStatus} username={username} />
            <ChessBoard
              onMove={(move) => {
                console.log("Move made:", move)
                setCurrentPlayer(currentPlayer === "white" ? "black" : "white")
              }}
            />
          </div>
        </div>

        {/* Right side - Chat and Controls */}
        <div className="space-y-4">
          <GameControls
            username={username}
            onUsernameChange={handleUsernameChange}
            onResign={handleResign}
            gameStatus={gameStatus}
          />
          <ChatBox username={username} />
        </div>
      </div>
    </div>
  )
}
