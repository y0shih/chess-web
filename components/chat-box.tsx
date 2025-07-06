"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

interface Message {
  id: number
  username: string
  message: string
  timestamp: Date
}

interface ChatBoxProps {
  username: string
}

export default function ChatBox({ username }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      username: "System",
      message: "Welcome to the chess game!",
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        username,
        message: newMessage.trim(),
        timestamp: new Date(),
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-96 flex flex-col">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Chat</h3>

      <ScrollArea className="flex-1 mb-3 border rounded p-2">
        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className="font-medium text-blue-600">{msg.username}:</span>
              <span className="ml-2 text-gray-700">{msg.message}</span>
              <div className="text-xs text-gray-400">{msg.timestamp.toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={handleSendMessage} size="sm">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
