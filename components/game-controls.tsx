"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flag, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface GameControlsProps {
  onResign: () => void
  gameStatus: string
  onDisconnect: () => void
}

export default function GameControls({ onResign, gameStatus, onDisconnect }: GameControlsProps) {
  const router = useRouter()

  const handleResign = () => {
    onResign()
    onDisconnect()
    router.push("/")
  }

  const handleNewGame = () => {
    onDisconnect()
    router.push("/")
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Actions */}
        <div className="space-y-2">
          <Button onClick={handleResign} variant="destructive" className="w-full" disabled={gameStatus === "resigned"}>
            <Flag className="h-4 w-4 mr-2" />
            Resign Game
          </Button>
          
          <Button onClick={handleNewGame} variant="outline" className="w-full bg-transparent">
            <RotateCcw className="h-4 w-4 mr-2" />
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
