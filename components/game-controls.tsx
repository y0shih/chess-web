"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Flag } from "lucide-react"

interface GameControlsProps {
  username: string
  onUsernameChange: (username: string) => void
  onResign: () => void
  gameStatus: string
}

export default function GameControls({ username, onUsernameChange, onResign, gameStatus }: GameControlsProps) {
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [tempUsername, setTempUsername] = useState(username)

  const handleUsernameSubmit = () => {
    if (tempUsername.trim()) {
      onUsernameChange(tempUsername.trim())
      setIsEditingUsername(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUsernameSubmit()
    } else if (e.key === "Escape") {
      setTempUsername(username)
      setIsEditingUsername(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Username Section */}
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Username
          </Label>
          {isEditingUsername ? (
            <div className="flex gap-2">
              <Input
                id="username"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
                autoFocus
              />
              <Button onClick={handleUsernameSubmit} size="sm">
                Save
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <span className="flex-1 p-2 bg-gray-50 rounded border">{username}</span>
              <Button onClick={() => setIsEditingUsername(true)} variant="outline" size="sm">
                Edit
              </Button>
            </div>
          )}
        </div>

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
