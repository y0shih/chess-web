"use client"

import { useState, useEffect } from "react"
import { io, Socket } from "socket.io-client"

interface GameState {
  board: Array<Array<{ square: string; type: string; color: string } | null>>;
  fen: string;
  turn: 'w' | 'b';
  pgn: string;
  players: {
    white?: string;
    black?: string;
  };
  gameOver: boolean;
  inCheck: boolean;
  inDraw: boolean;
  inStalemate: boolean;
  inThreefoldRepetition: boolean;
  insufficientMaterial: boolean;
  checkmate: boolean;
  whiteTime: number; // Time in milliseconds for white
  blackTime: number; // Time in milliseconds for black
  lastMoveTime: number; // Timestamp of the last move
  outcome?: { winner: 'white' | 'black' | 'draw'; reason: string };
  id: string; // Changed from gameId to id to match backend payload
}

interface ReceivedChatMessage {
  sender: string;
  message: string;
}

interface Message {
  id: number;
  username: string;
  message: string;
  timestamp: Date;
}

import ChessBoard from "./chess-board"
import ChatBox from "./chat-box"
import GameControls from "././game-controls"
import GameInfo from "./game-info"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChessGame() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

  const [socket, setSocket] = useState<Socket | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | 'spectator' | null>(null)
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 1,
      username: "System",
      message: ["Welcome to the game!", "GLHF!"].join(" "),
      timestamp: new Date(),
    },
  ])

  useEffect(() => {
    const newSocket = io("http://localhost:8000") // Replace with your backend address
    setSocket(newSocket)

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server")
      newSocket.emit("joinGame", { gameId: mode === "alone" ? "debug" : undefined })
    })

    newSocket.on("gameUpdate", (state: GameState) => {
      console.log("Game state updated:", state)
      setGameState(state)

      // Determine your assigned color from the gameUpdate
      const myClientId = newSocket.id
      let myAssignedColor: 'white' | 'black' | 'spectator' = 'spectator' // Default to spectator

      if (state.players.white === myClientId) {
        myAssignedColor = 'white'
      } else if (state.players.black === myClientId) {
        myAssignedColor = 'black'
      }
      setPlayerColor(myAssignedColor)
    })

    newSocket.on("chatMessage", (data: ReceivedChatMessage) => {
      console.log("Chat message received:", data)
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, username: data.sender, message: data.message, timestamp: new Date() },
      ])
    })

    newSocket.on("error", (errorMessage: string) => {
      console.error("Backend error:", errorMessage)
      alert(`Error: ${errorMessage}`)
    })

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server")
    })

    return () => {
      newSocket.disconnect()
    }
  }, [mode])

  const handleMove = (move: any) => {
    if (socket) {
      socket.emit("move", move)
    }
  }

  const handleSendMessage = (message: string) => {
    if (socket) {
      socket.emit("chat", message)
    }
  }

  const handleResign = () => {
    // Implement resign logic with backend
    alert(`${playerColor} has resigned! (Not yet implemented with backend)`)
  }

  const getGameStatus = () => {
    if (!gameState) return "waiting"
    if (gameState.checkmate) return "checkmate"
    if (gameState.inDraw) return "draw"
    if (gameState.inStalemate) return "stalemate"
    if (gameState.inThreefoldRepetition) return "draw"
    if (gameState.insufficientMaterial) return "draw"
    if (gameState.inCheck) return "check"
    return "playing"
  }

  const getCurrentPlayer = () => {
    if (!gameState) return "white"
    return gameState.turn === "w" ? "white" : "black"
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
            <GameInfo
              currentPlayer={getCurrentPlayer()}
              gameStatus={getGameStatus()}
              username={playerColor || "Player"}
              whiteTime={gameState?.whiteTime || 0}
              blackTime={gameState?.blackTime || 0}
              lastMoveTime={gameState?.lastMoveTime || 0}
              turn={gameState?.turn || 'w'}
              outcome={gameState?.outcome}
              id={gameState?.id || ''}
            />
            <ChessBoard
              mode={mode}
              onMove={handleMove}
              gameState={gameState}
              playerColor={playerColor}
            />
          </div>
        </div>

        {/* Right side - Chat and Controls */}
        <div className="space-y-4">
          <GameControls
            onResign={handleResign}
            gameStatus={getGameStatus()}
          />
          <ChatBox username={playerColor || "Player"} messages={chatMessages} onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  )
}