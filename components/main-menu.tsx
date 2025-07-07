"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Gamepad2, Zap, ArrowLeft, User, Mail, Calendar, Trophy, LogOut } from "lucide-react"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"

type GameMode = "ranked" | "classic" | "chaos" | "alone" | null
type AuthMode = "login" | "register" | null

// Mock user data - will be replaced with actual user data from backend
const userData = {
  username: "john_doe",
  email: "john.doe@example.com",
  elo: 1337,
  createdAt: "March 2024",
  gamesPlayed: 156,
  gamesWon: 89,
  gamesLost: 67,
  gamesDraw: 0,
}

export default function MainMenu() {
  const [selectedMode, setSelectedMode] = useState<GameMode>(null)
  const [showWorkInProgress, setShowWorkInProgress] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(userData)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing login on component mount
  useEffect(() => {
    const checkExistingLogin = async () => {
      try {
        const { AuthAPI } = await import("@/lib/auth-api")
        if (AuthAPI.isLoggedIn()) {
          const userProfile = await AuthAPI.getUserProfile()
          setIsLoggedIn(true)
          setCurrentUser({
            username: userProfile.username,
            email: userProfile.email,
            elo: userProfile.elo,
            createdAt: new Date(userProfile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            gamesPlayed: userProfile.gamesPlayed,
            gamesWon: userProfile.gamesWon,
            gamesLost: userProfile.gamesLost,
            gamesDraw: userProfile.gamesDraw,
          })
        }
      } catch (error) {
        console.error("Failed to restore login:", error)
        // Clear invalid token
        const { AuthAPI } = await import("@/lib/auth-api")
        AuthAPI.logout()
      } finally {
        setIsLoading(false)
      }
    }

    checkExistingLogin()
  }, [])

  const handleModeSelect = (mode: GameMode) => {
    if (mode === "classic" || mode === "alone") {
      router.push(`/game?mode=${mode}`)
    } else {
      setSelectedMode(mode)
      setShowWorkInProgress(true)
    }
  }

  const handleBackToMenu = () => {
    setShowWorkInProgress(false)
    setSelectedMode(null)
  }

  const handleLogin = async (username: string, password: string) => {
    try {
      const { AuthAPI } = await import("@/lib/auth-api")
      const authResponse = await AuthAPI.login(username, password)
      
      // Get full user profile after login
      const userProfile = await AuthAPI.getUserProfile()
      
      setIsLoggedIn(true)
      setCurrentUser({
        username: userProfile.username,
        email: userProfile.email,
        elo: userProfile.elo,
        createdAt: new Date(userProfile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        gamesPlayed: userProfile.gamesPlayed,
        gamesWon: userProfile.gamesWon,
        gamesLost: userProfile.gamesLost,
        gamesDraw: userProfile.gamesDraw,
      })
      setAuthMode(null)
    } catch (error) {
      console.error("Login failed:", error)
      alert(error instanceof Error ? error.message : "Login failed")
    }
  }

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const { AuthAPI } = await import("@/lib/auth-api")
      const registerResponse = await AuthAPI.register(username, email, password)
      
      if (registerResponse.user) {
        // Registration successful, now login to get token
        await handleLogin(username, password)
      } else {
        throw new Error(registerResponse.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration failed:", error)
      alert(error instanceof Error ? error.message : "Registration failed")
    }
  }

  const handleLogout = async () => {
    try {
      const { AuthAPI } = await import("@/lib/auth-api")
      AuthAPI.logout()
      setIsLoggedIn(false)
      setCurrentUser(userData)
      setAuthMode(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Show loading state while checking for existing login
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (showWorkInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Work in Progress</h2>
              <p className="text-gray-600">
                {selectedMode === "ranked" ? "Ranked" : "Chaos"} mode is currently under development.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">This feature will be available in a future update. Stay tuned!</p>

              <Button onClick={handleBackToMenu} className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show auth forms if not logged in
  if (!isLoggedIn && authMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        {authMode === "login" ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthMode("register")}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthMode("login")}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Main Menu */}
          <div className="flex flex-col justify-center min-h-[600px]">
            {/* Game Title */}
            <div className="mb-12 text-center lg:text-left">
              <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-4 tracking-tight">
                Ches
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Sy
                </span>
              </h1>
              <p className="text-xl text-gray-600 font-light">Choose your mode</p>
            </div>

            {/* Game Mode Selection */}
            <div className="space-y-4 max-w-sm mx-auto lg:mx-0">
              {/* Ranked Mode */}
              <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6" onClick={() => handleModeSelect("ranked")}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <Crown className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-800">Ranked</h3>
                      <p className="text-sm text-gray-500">Competitive matches with ELO rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Classic Mode */}
              <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6" onClick={() => handleModeSelect("classic")}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Gamepad2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-800">Classic</h3>
                      <p className="text-sm text-gray-500">Traditional chess gameplay</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chaos Mode */}
              <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6" onClick={() => handleModeSelect("chaos")}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <Zap className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-800">Chaos</h3>
                      <p className="text-sm text-gray-500">Random events and power-ups</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alone Mode */}
              <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6" onClick={() => handleModeSelect("alone")}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-800">Alone</h3>
                      <p className="text-sm text-gray-500">Debug mode, move both sides</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center lg:text-left">
              <p className="text-gray-400 text-sm">Version 1.0.0 • Built with Next.js</p>
            </div>
          </div>

          {/* Right Side - User Info or Auth */}
          <div className="flex justify-center lg:justify-end">
            {isLoggedIn ? (
              <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Player Profile
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-semibold text-gray-800">{currentUser.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-semibold text-gray-800">{currentUser.createdAt}</p>
                    </div>
                  </div>
                </div>

                {/* ELO Rating */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">ELO Rating</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{currentUser.elo}</span>
                  </div>
                </div>

                {/* Match Statistics */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Match Statistics</h4>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-gray-800">{currentUser.gamesPlayed}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{currentUser.gamesWon}</p>
                      <p className="text-xs text-gray-500">Wins</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{currentUser.gamesLost}</p>
                      <p className="text-xs text-gray-500">Losses</p>
                    </div>
                  </div>

                  {/* Win Rate */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Win Rate</span>
                      <span className="text-sm font-bold text-gray-800">
                        {currentUser.gamesPlayed > 0 
                          ? Math.round((currentUser.gamesWon / currentUser.gamesPlayed) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${currentUser.gamesPlayed > 0 
                            ? (currentUser.gamesWon / currentUser.gamesPlayed) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ) : (
              <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-800 text-center">
                    Welcome to CheSy
                  </CardTitle>
                  <p className="text-gray-600 text-center text-sm">
                    Sign in to track your games and compete with others
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => setAuthMode("login")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setAuthMode("register")}
                    variant="outline"
                    className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-3"
                  >
                    Create Account
                  </Button>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                      You can also play as a guest in Classic or Alone mode
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
