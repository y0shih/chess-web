// API functions for authentication and user management
// Based on the NestJS backend API documentation

const API_BASE_URL = 'http://localhost:8000'

export interface User {
  id: string
  username: string
  email: string
  elo: number
  gamesPlayed: number
  gamesWon: number
  gamesLost: number
  gamesDraw: number
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  user: {
    id: string
    username: string
    email: string
    elo: number
  }
}

export interface RegisterResponse {
  user?: User
  error?: string
}

export class AuthAPI {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  static async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data = await response.json()
    
    // Store token and user data
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    return data
  }

  static async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    if (data.user) {
      // Store user data (no token returned from register, need to login)
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return data
  }

  static async getUserProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.logout()
        throw new Error('Session expired')
      }
      throw new Error('Failed to fetch user profile')
    }

    return response.json()
  }

  static async getUserById(id: string): Promise<Omit<User, 'email'>> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`)

    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }

    return response.json()
  }

  static async getLeaderboard(): Promise<Omit<User, 'email'>[]> {
    const response = await fetch(`${API_BASE_URL}/users/leaderboard`)

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard')
    }

    return response.json()
  }

  static logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  static getStoredUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('token')
  }

  static isLoggedIn(): boolean {
    return !!this.getStoredToken()
  }
}
