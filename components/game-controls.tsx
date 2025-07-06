"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flag } from "lucide-react"

interface GameControlsProps {
  onResign: () => void
  gameStatus: string
}

export default function GameControls({ onResign, gameStatus }: GameControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Actions */}
        <div className="space-y-2">
          <Button onClick={onResign} variant="destructive" className="w-full" disabled={gameStatus === "resigned"}>
            <Flag className="h-4 w-4 mr-2" />
            Resign Game
          </Button>

          <Button variant="outline" className="w-full bg-transparent">
            Request Draw
          </Button>

          <Button variant="outline" className="w-full bg-transparent">
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
