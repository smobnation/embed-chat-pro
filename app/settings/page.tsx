'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Key, Eye, EyeOff, CheckCircle, AlertCircle, Settings, User, LogOut, LayoutDashboard, BarChart3 } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [showApiKey, setShowApiKey] = useState(false)
  const [settings, setSettings] = useState({
    openaiApiKey: ''
  })
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      loadSettings()
      checkDemoMode()
    }
  }, [status])

  const checkDemoMode = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setIsDemo(data.isDemo || false)
      }
    } catch (error) {
      console.error('Error checking demo mode:', error)
    }
  }

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsPageLoading(false)
    }
  }

  if (status === 'loading' || isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const handleSave = async () => {
    if (isDemo) {
      setMessage('Demo mode: Settings cannot be saved')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    console.log('Saving settings:', settings)

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (response.ok) {
        setMessage('Settings saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setError(responseData.error || 'Failed to save settings')
        setTimeout(() => setError(''), 5000)
      }
    } catch (error) {
      console.error('Save error:', error)
      setError('Failed to save settings')
      setTimeout(() => setError(''), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const testApiKey = async () => {
    if (isDemo) {
      setMessage('Demo mode: API key testing is disabled')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    if (!settings.openaiApiKey) {
      setError('Please enter your OpenAI API key first')
      setTimeout(() => setError(''), 3000)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/test-openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: settings.openaiApiKey }),
      })

      if (response.ok) {
        setMessage('API key is valid and working!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setError('API key is invalid or not working')
        setTimeout(() => setError(''), 5000)
      }
    } catch (error) {
      setError('Failed to test API key')
      setTimeout(() => setError(''), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center shadow-lg">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    EmbedChat Pro
                  </h1>
                  <p className="text-sm text-gray-600">AI FAQ Bot Widget - Settings</p>
                </div>
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="flex items-center space-x-3">
              {/* User Info */}
              <div className="hidden sm:block text-right mr-4">
                <p className="text-sm font-semibold text-gray-900">{session?.user?.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              
              {/* Menu Items */}
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className={`flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-2 hover:bg-white/90 hover:border-b-indigo-300 shadow-lg relative ${
                  pathname === '/dashboard' 
                    ? 'border-gray-200 border-b-2 border-b-indigo-500' 
                    : 'border-gray-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:block">All Chatbots</span>
              </Button>
              
              <Button
                onClick={() => router.push('/statistics')}
                variant="outline"
                className={`flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-2 hover:bg-white/90 hover:border-b-indigo-300 shadow-lg relative ${
                  pathname === '/statistics' 
                    ? 'border-gray-200 border-b-2 border-b-indigo-500' 
                    : 'border-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:block">Analytics</span>
              </Button>
              
              <Button
                onClick={() => router.push('/settings')}
                variant="outline"
                className={`flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-2 hover:bg-white/90 hover:border-b-indigo-300 shadow-lg relative ${
                  pathname === '/settings' 
                    ? 'border-gray-200 border-b-2 border-b-indigo-500' 
                    : 'border-gray-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:block">Settings</span>
              </Button>
              
              <Button
                onClick={() => router.push('/profile')}
                variant="outline"
                className={`flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-2 hover:bg-white/90 hover:border-b-indigo-300 shadow-lg relative ${
                  pathname === '/profile' 
                    ? 'border-gray-200 border-b-2 border-b-indigo-500' 
                    : 'border-gray-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:block">Profile</span>
              </Button>
              
              <Button
                onClick={() => signOut()}
                className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 rounded-md shadow-lg">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 text-lg mr-2" />
              {message}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 rounded-md shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 text-lg mr-2" />
              {error}
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Demo Mode Indicator */}
          {isDemo && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 text-yellow-800 rounded-md shadow-lg">
              <div className="flex items-center">
                <AlertCircle className="text-yellow-500 text-lg mr-2" />
                <div>
                  <p className="font-semibold">Demo Mode Active</p>
                  <p className="text-sm">You are viewing the application in demo mode. API key values are hidden and settings cannot be modified.</p>
                </div>
              </div>
            </div>
          )}

          {/* OpenAI API Configuration */}
          <Card className="shadow-2xl bg-white/80 backdrop-blur-sm border-0 rounded-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">OpenAI API Configuration</CardTitle>
                  <CardDescription className="text-indigo-100">Configure your OpenAI API key</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <Label htmlFor="api-key" className="text-sm font-semibold text-gray-700 mb-2 block">OpenAI API Key</Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    value={isDemo ? "Your API key will go here..." : settings.openaiApiKey}
                    onChange={(e) => !isDemo && setSettings({...settings, openaiApiKey: e.target.value})}
                    placeholder={isDemo ? "Your API key will go here..." : "sk-..."}
                    disabled={isDemo}
                    className="pr-12 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Your API key is encrypted and stored securely</p>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={testApiKey}
                  disabled={isLoading || !settings.openaiApiKey || isDemo}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-md shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isDemo ? 'Test API Key (Demo)' : 'Test API Key'}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || isDemo}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-md shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isDemo ? 'Save Settings (Demo)' : (isLoading ? 'Saving...' : 'Save Settings')}
                </Button>
              </div>

              {/* Instructions for getting OpenAI API Key */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Key className="w-5 h-5 mr-2 text-blue-600" />
                  How to Get Your OpenAI API Key
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <div>
                      <p className="font-medium">Visit OpenAI Platform</p>
                      <p>Go to <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">https://platform.openai.com</a></p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <div>
                      <p className="font-medium">Sign Up or Log In</p>
                      <p>Create an account or log in to your existing OpenAI account</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <div>
                      <p className="font-medium">Navigate to API Keys</p>
                      <p>Click on your profile icon → "View API keys" or go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">https://platform.openai.com/api-keys</a></p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <div>
                      <p className="font-medium">Create New API Key</p>
                      <p>Click "Create new secret key", give it a name, and copy the generated key</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                    <div>
                      <p className="font-medium">Add Credits</p>
                      <p>Make sure you have credits in your OpenAI account. Add billing information if needed</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Keep your API key secure and never share it publicly. The key starts with "sk-" and should be kept confidential.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
