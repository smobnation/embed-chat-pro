'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if demo mode is enabled
    const checkDemoMode = async () => {
      try {
        const response = await fetch('/api/demo-check')
        const data = await response.json()
        if (data.demo === true) {
          setIsDemoMode(true)
          setEmail('admin@chatai.com')
          setPassword('123456')
        }
      } catch (error) {
        // If API doesn't exist, check environment variable on client side
        // Note: This is a fallback and won't work in production
        console.log('Demo check API not available')
      }
    }
    
    checkDemoMode()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Sign in
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-1/4 animate-bounce">
        <div className="w-4 h-4 bg-indigo-400 rounded-full"></div>
      </div>
      <div className="absolute top-32 right-1/4 animate-bounce animation-delay-1000">
        <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
      </div>
      <div className="absolute bottom-20 left-1/3 animate-bounce animation-delay-2000">
        <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Login Form */}
        <div className="order-2 lg:order-1">
          <Card className="shadow-2xl bg-white/80 backdrop-blur-sm border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <CardTitle className="text-3xl font-bold mb-2">
                  EmbedChat Pro
                </CardTitle>
                <CardDescription className="text-indigo-100 text-lg">
                  AI FAQ Bot Widget - Sign In
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-red-500 text-xl">⚠️</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Please wait...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🔑</span>
                      Sign In
                    </div>
                  )}
                </Button>
              </form>

              {/* Bottom Info Sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Free to Start Note */}
                <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-indigo-500 text-xl">🚀</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-indigo-600">
                        Free to Start
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lifetime Note */}
                <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-green-500 text-xl">♾️</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-600">
                        Lifetime
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secured Note */}
                <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-purple-500 text-xl">🔒</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-purple-600">
                        Secured
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions Sidebar */}
        <div className="order-1 lg:order-2">
          <div className="space-y-6">
            {/* How It Works */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">🎯</span>
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Create Your Bot</h4>
                    <p className="text-sm text-gray-600">Give your chatbot a name and description</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Add FAQ Content</h4>
                    <p className="text-sm text-gray-600">Paste your questions and answers for AI training</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Get Embed Code</h4>
                    <p className="text-sm text-gray-600">Copy the code and add it to your website</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What You Get */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">✨</span>
                What You Get
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">Unlimited chatbots</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500 text-lg">✓</span>
                  <span className="text-gray-700">Analytics dashboard</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-purple-500 text-lg">✓</span>
                  <span className="text-gray-700">Custom branding</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-orange-500 text-lg">✓</span>
                  <span className="text-gray-700">24/7 support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-teal-500 text-lg">✓</span>
                  <span className="text-gray-700">Easy integration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
