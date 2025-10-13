'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCreateAdmin = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/setup-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Admin User',
          email: 'admin@chatai.com',
          password: 'admin123'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setIsSuccess(true)
      } else {
        setMessage(data.error || 'Error creating admin user')
        setIsSuccess(false)
      }
    } catch (error) {
      setMessage('Error creating admin user')
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Setup Admin User
            </CardTitle>
            <CardDescription className="text-center">
              Create the default admin account for the chatbot system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Admin Credentials:</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <div><strong>Email:</strong> admin@chatai.com</div>
                <div><strong>Password:</strong> admin123</div>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                isSuccess 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <Button
              onClick={handleCreateAdmin}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Admin...' : 'Create Admin User'}
            </Button>

            {isSuccess && (
              <div className="text-center">
                <a 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-500 underline"
                >
                  Go to Login Page
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
