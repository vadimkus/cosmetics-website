'use client'

import { useState, useEffect } from 'react'
import { Shield, Eye, EyeOff, Lock, Mail, Zap, Crown, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react'

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
  const [funnyMessages] = useState([
    "Nice try, but that's not the secret handshake! 🤝",
    "Oops! Wrong password. The admin is probably laughing right now! 😂",
    "Access denied! Even my pet hamster has better credentials! 🐹",
    "Nope! That's not the magic word. Try 'Abracadabra' next time! ✨",
    "Wrong credentials! The admin is probably sipping coffee and watching this! ☕",
    "Access denied! The security system is having a good laugh! 🤖",
    "Nope! That's not the secret sauce recipe! 🍝",
    "Wrong password! The admin is probably doing a victory dance! 💃",
    "Access denied! Even the coffee machine has better security! ☕",
    "Nice try! The admin is probably facepalming right now! 🤦‍♂️"
  ])

  const [securityTips] = useState([
    "💡 Pro tip: The admin loves Korean skincare products!",
    "🔐 Hint: The password is related to the number of products we sell!",
    "🎯 Fun fact: Our admin is a certified skincare expert!",
    "🌟 Insider info: The admin's favorite product is a serum!",
    "🎨 Did you know? Our admin designed this login page!",
    "🚀 The admin once coded this entire website in one day!",
    "🎪 The admin's secret power: Making skincare look magical!",
    "🎭 The admin's alter ego: The Skincare Superhero!",
    "🎨 The admin's favorite color: GENOSYS blue!",
    "🎯 The admin's motto: 'Beauty is code, code is beauty!'"
  ])

  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % securityTips.length)
    }, 3000)
    return () => clearInterval(tipInterval)
  }, [securityTips.length])

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header with Animation */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white p-4 rounded-full shadow-lg">
                <Crown className="h-12 w-12 text-yellow-500 animate-bounce" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600 text-lg">Welcome to the GENOSYS Command Center! 🚀</p>
          
          {/* Security Level Indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Security Level:</span>
            <span className={`text-sm font-bold ${securityLevel.color}`}>
              {securityLevel.level}
            </span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4 text-blue-600" />
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="admin@genosys.ae"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock className="h-4 w-4 text-blue-600" />
                Secret Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter the magic word..."
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  <span>Access the Matrix</span>
                </>
              )}
            </button>
          </form>

          {/* Security Tips */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Security Tip:</span>
            </div>
            <p className="text-sm text-blue-700 animate-fade-in">
              {securityTips[currentTip]}
            </p>
          </div>

          {/* Fun Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{attempts}</div>
              <div className="text-xs text-gray-600">Failed Attempts</div>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <div className="text-xs text-gray-600">Admin Patience</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>🔒 Secured by GENOSYS Advanced Security</p>
          <p className="mt-1">Made with ❤️ and lots of ☕</p>
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
      `}</style>
    </div>
  )
}
