'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield, Eye, EyeOff, Lock, Mail, Zap, Crown, Sparkles, AlertTriangle, CheckCircle, Terminal, Code, Cpu, Database } from 'lucide-react'

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [funnyMessages] = useState([
    "ACCESS DENIED: Invalid credentials detected! 🚫",
    "ERROR 404: Admin privileges not found! 🔍",
    "SECURITY BREACH: Unauthorized access attempt! ⚠️",
    "SYSTEM ALERT: Wrong password matrix! 🔐",
    "NEURAL NETWORK: Authentication failed! 🧠",
    "CYBER SECURITY: Intrusion detected! 🛡️",
    "QUANTUM ENCRYPTION: Access denied! ⚛️",
    "MATRIX PROTOCOL: Invalid user! 🔮",
    "DIGITAL FORTRESS: Breach attempt failed! 🏰",
    "BINARY CODE: Wrong sequence! 💻"
  ])

  const [securityTips] = useState([
    "💡 SYSTEM INFO: Admin credentials are encrypted with quantum algorithms!",
    "🔐 SECURITY PROTOCOL: Password contains binary sequences!",
    "🎯 NEURAL NETWORK: Admin is a certified cybersecurity expert!",
    "🌟 MATRIX DATA: Admin's favorite language is JavaScript!",
    "🎨 DIGITAL ART: This login was designed in the Matrix!",
    "🚀 QUANTUM SPEED: Admin coded this in one matrix cycle!",
    "🎪 CYBER POWER: Admin's secret: Making code look magical!",
    "🎭 DIGITAL IDENTITY: Admin's alter ego: The Code Architect!",
    "🎨 MATRIX COLORS: Admin's favorite: Neon green!",
    "🎯 CYBER MOTTO: 'Code is reality, reality is code!'"
  ])

  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % securityTips.length)
    }, 3000)
    return () => clearInterval(tipInterval)
  }, [securityTips.length])

  // Matrix Rain Effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}"
    const matrixArray = matrix.split("")

    const fontSize = 10
    const columns = canvas.width / fontSize

    const drops: number[] = []
    for (let x = 0; x < columns; x++) {
      drops[x] = 1
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0F4'
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 35)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const success = await onLogin(email, password)
    if (!success) {
      setAttempts(prev => prev + 1)
      const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
      setError(randomMessage)
    }
    setLoading(false)
  }

  const getSecurityLevel = () => {
    if (attempts === 0) return { level: "🟢 Low", color: "text-green-600" }
    if (attempts < 3) return { level: "🟡 Medium", color: "text-yellow-600" }
    if (attempts < 5) return { level: "🟠 High", color: "text-orange-600" }
    return { level: "🔴 Maximum", color: "text-red-600" }
  }

  const securityLevel = getSecurityLevel()

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Matrix Rain Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/60" style={{ zIndex: 2 }}></div>

      <div className="max-w-md w-full space-y-8 relative" style={{ zIndex: 10 }}>
        {/* Header with Matrix Animation */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-black/80 border border-green-500 p-4 rounded-full shadow-lg">
                <Terminal className="h-12 w-12 text-green-400 animate-pulse" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-green-400 mb-2 font-mono">
            &gt; ACCESS
          </h1>
          
        </div>

        {/* Login Form */}
        <div className="bg-black/90 backdrop-blur-sm rounded-lg shadow-2xl p-8 border border-green-500/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-green-400 font-mono">
                <Database className="h-4 w-4 text-green-400" />
                &gt; USER_ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-green-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-black/50 text-green-400 font-mono placeholder-green-600"
                  placeholder="admin@genosys.ae"
                />
                <Database className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-green-400 font-mono">
                <Lock className="h-4 w-4 text-green-400" />
                &gt; ACCESS_KEY
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-12 border border-green-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-black/50 text-green-400 font-mono placeholder-green-600"
                  placeholder="Enter quantum key..."
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm font-medium font-mono">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 font-mono border border-green-500/50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>INITIALIZING...</span>
                </>
              ) : (
                <>
                  <Code className="h-5 w-5" />
                  <span>CLICK</span>
                </>
              )}
            </button>
          </form>


        </div>

        {/* Footer */}
        <div className="text-center text-sm text-green-500 font-mono">
          <p>🔒 QUANTUM ENCRYPTION</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
        @keyframes matrix-glow {
          0%, 100% { text-shadow: 0 0 5px #0F4, 0 0 10px #0F4, 0 0 15px #0F4; }
          50% { text-shadow: 0 0 10px #0F4, 0 0 20px #0F4, 0 0 30px #0F4; }
        }
        .matrix-glow {
          animation: matrix-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
