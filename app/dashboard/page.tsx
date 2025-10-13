'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, LogOut, Save, Upload, Plus, Trash2, Edit, MessageSquare, BarChart3, Users, MessageCircle, Clock, Settings, User, LayoutDashboard, Search, ChevronLeft, ChevronRight, Filter, X, Check } from 'lucide-react'

interface DocumentSource {
  id: string
  name: string
  type: 'pdf' | 'docx' | 'txt'
  content: string
  enabled: boolean
  category?: string
  tags?: string[]
  uploadedAt: string
}

interface URLSource {
  id: string
  url: string
  title: string
  content: string
  enabled: boolean
  category?: string
  tags?: string[]
  scrapedAt: string
}

interface StructuredDataSource {
  id: string
  name: string
  type: 'products' | 'pricing' | 'services' | 'catalog'
  data: any
  enabled: boolean
  category?: string
  tags?: string[]
  createdAt: string
}

interface BotSettings {
  _id?: string
  botId: string
  name: string
  welcomeMessage: string
  themeColor: string
  faqs: string[]
  documents: DocumentSource[]
  urls: URLSource[]
  structuredData: StructuredDataSource[]
  categories: string[]
  createdAt?: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalBots: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [bots, setBots] = useState<BotSettings[]>([])
  const [selectedBot, setSelectedBot] = useState<BotSettings | null>(null)
  const [faqText, setFaqText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedBotId, setCopiedBotId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'faq' | 'documents' | 'urls' | 'structured'>('faq')
  const [newUrl, setNewUrl] = useState('')
  const [newUrlCategory, setNewUrlCategory] = useState('')
  const [newUrlTags, setNewUrlTags] = useState('')
  const [newStructuredName, setNewStructuredName] = useState('')
  const [newStructuredType, setNewStructuredType] = useState<'products' | 'pricing' | 'services' | 'catalog'>('products')
  const [newStructuredData, setNewStructuredData] = useState('')
  const [newStructuredCategory, setNewStructuredCategory] = useState('')
  const [newStructuredTags, setNewStructuredTags] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)
  const [analytics, setAnalytics] = useState<{
    stats?: {
      messagesSent: number
      chatOpens: number
      totalInteractions: number
      uniqueSessions: number
    }
    events?: any[]
  } | null>(null)
  const [newBot, setNewBot] = useState({
    botId: '',
    name: '',
    welcomeMessage: 'Hello! How can I help you today?',
    themeColor: '#3B82F6',
    faqs: [],
    documents: [],
    urls: [],
    structuredData: [],
    categories: []
  })
  
  // Pagination and search state
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalBots: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [allBots, setAllBots] = useState<BotSettings[]>([])
  const [displayedBots, setDisplayedBots] = useState<BotSettings[]>([])
  const [botsToShow, setBotsToShow] = useState(10)
  
  // Modal state
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const [embedCodeCopied, setEmbedCodeCopied] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [botToDelete, setBotToDelete] = useState<BotSettings | null>(null)
  
  // Message states
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isCreatingBot, setIsCreatingBot] = useState(false)
  
  // Preview chat state
  const [showPreview, setShowPreview] = useState(false)
  const [previewMessages, setPreviewMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([])
  const [previewInput, setPreviewInput] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      loadBots()
    }
  }, [status, router])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput)
        setPagination(prev => ({ ...prev, currentPage: 1 }))
        loadBots(1, searchInput, sortBy, sortOrder)
      }
    }, 300) // 300ms delay

    return () => clearTimeout(timeoutId)
  }, [searchInput])

  // Update displayed bots when allBots or botsToShow changes
  useEffect(() => {
    setDisplayedBots(allBots.slice(0, botsToShow))
    setBots(allBots.slice(0, botsToShow))
  }, [allBots, botsToShow])


  const loadBots = async (page = 1, search = '', sortByField = 'createdAt', sortOrderField = 'desc', loadMore = false) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '100', // Load more bots at once
        search,
        sortBy: sortByField,
        sortOrder: sortOrderField
      })
      
      const response = await fetch(`/api/bots?${params}`)
      if (response.ok) {
        const data = await response.json()
        
        if (loadMore) {
          // Append new bots to existing list
          setAllBots(prev => [...prev, ...data.bots])
        } else {
          // Replace all bots (new search or initial load)
          setAllBots(data.bots)
          setBotsToShow(10) // Reset to show first 10
        }
        
        setPagination(data.pagination)
        
        // Select first bot if none selected and bots are available
        if (data.bots.length > 0 && !selectedBot) {
          setSelectedBot(data.bots[0])
          setFaqText(data.bots[0].faqs ? data.bots[0].faqs.join('\n\n') : '')
        }
      }
    } catch (error) {
      console.error('Error loading bots:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createBot = async () => {
    // Clear previous messages
    setErrorMessage('')
    setSuccessMessage('')
    setIsCreatingBot(true)

    if (!newBot.botId || !newBot.name) {
      setErrorMessage('Bot ID and name are required')
      setTimeout(() => setErrorMessage(''), 5000)
      setIsCreatingBot(false)
      return
    }

    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBot),
      })

      if (response.ok) {
        const createdBot = await response.json()
        // Add new bot to the beginning of the list
        setAllBots(prev => [createdBot, ...prev])
        setSelectedBot(createdBot)
        setFaqText('')
        setNewBot({
          botId: '',
          name: '',
          welcomeMessage: 'Hello! How can I help you today?',
          themeColor: '#3B82F6',
          faqs: [],
          documents: [],
          urls: [],
          structuredData: [],
          categories: []
        })
        setSuccessMessage('Bot created successfully!')
        setTimeout(() => {
          setSuccessMessage('')
          setShowCreateForm(false)
        }, 2000)
      } else {
        const error = await response.json()
        setErrorMessage(error.error || 'Failed to create bot. Please try again.')
        setTimeout(() => setErrorMessage(''), 5000)
      }
    } catch (error) {
      setErrorMessage('Network error. Please check your connection and try again.')
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setIsCreatingBot(false)
    }
  }

  const openDeleteModal = (bot: BotSettings) => {
    setBotToDelete(bot)
    setShowDeleteModal(true)
  }

  const confirmDeleteBot = async () => {
    if (!botToDelete) return

    // Clear previous messages
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch(`/api/bots/${botToDelete.botId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove bot from the list
        setAllBots(prev => prev.filter(bot => bot.botId !== botToDelete.botId))
        if (selectedBot?.botId === botToDelete.botId) {
          setSelectedBot(null)
          setFaqText('')
        }
        setSuccessMessage('Bot deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
        setShowDeleteModal(false)
        setBotToDelete(null)
      } else {
        setErrorMessage('Failed to delete bot. Please try again.')
        setTimeout(() => setErrorMessage(''), 5000)
      }
    } catch (error) {
      setErrorMessage('Network error. Please check your connection and try again.')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const cancelDeleteBot = () => {
    setShowDeleteModal(false)
    setBotToDelete(null)
  }

  const selectBot = (bot: BotSettings) => {
    setSelectedBot(bot)
    setFaqText(bot.faqs ? bot.faqs.join('\n\n') : '')
    loadAnalytics(bot.botId)
  }

  const loadAnalytics = async (botId: string) => {
    try {
      const response = await fetch(`/api/analytics?botId=${botId}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const handleSaveSettings = async () => {
    if (!selectedBot) return

    const faqLines = faqText.split('\n\n').filter(faq => faq.trim())
    const faqs = faqLines.map(faq => {
      return faq.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ')
    })
    
    const updatedSettings = { 
      ...selectedBot, 
      faqs,
      documents: selectedBot.documents || [],
      urls: selectedBot.urls || [],
      structuredData: selectedBot.structuredData || [],
      categories: selectedBot.categories || []
    }
    console.log('Saving bot settings:', updatedSettings)
    setSelectedBot(updatedSettings)
    
    try {
      const response = await fetch('/api/bot-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      })

      if (response.ok) {
        const savedBot = await response.json()
        console.log('Bot settings saved:', savedBot)
        // Update the bot in the allBots list
        setAllBots(prev => prev.map(bot => bot.botId === selectedBot.botId ? savedBot : bot))
        // Show embed code modal
        setShowEmbedModal(true)
        setEmbedCodeCopied(false)
      } else {
        const error = await response.json()
        console.error('Save error:', error)
      }
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  const copyEmbedCode = (botId: string) => {
    const baseUrl = window.location.origin
    const embedCode = `<script src="${baseUrl}/bot.js" data-bot="${botId}"></script>`
    navigator.clipboard.writeText(embedCode)
    setCopiedBotId(botId)
    setTimeout(() => setCopiedBotId(null), 2000)
  }

  const copyEmbedCodeModal = () => {
    if (selectedBot) {
      const baseUrl = window.location.origin
      const embedCode = `<script src="${baseUrl}/bot.js" data-bot="${selectedBot.botId}"></script>`
      navigator.clipboard.writeText(embedCode)
      setEmbedCodeCopied(true)
      setTimeout(() => setEmbedCodeCopied(false), 3000)
    }
  }

  // Document upload function
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedBot || !event.target.files?.[0]) return

    const file = event.target.files[0]
    setUploadingFile(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('botId', selectedBot.botId)
      formData.append('category', 'General')
      formData.append('tags', '')

      const response = await fetch('/api/bot-settings/documents', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setSelectedBot(prev => prev ? {
          ...prev,
          documents: [...(prev.documents || []), result.document]
        } : null)
        setSuccessMessage('Document uploaded successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const error = await response.json()
        setErrorMessage(error.error || 'Failed to upload document')
        setTimeout(() => setErrorMessage(''), 3000)
      }
    } catch (error) {
      setErrorMessage('Failed to upload document')
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setUploadingFile(false)
      event.target.value = ''
    }
  }

  // URL scraping function
  const handleUrlScraping = async () => {
    if (!selectedBot || !newUrl.trim()) return

    try {
      const response = await fetch('/api/bot-settings/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId: selectedBot.botId,
          url: newUrl,
          category: newUrlCategory || 'General',
          tags: newUrlTags
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSelectedBot(prev => prev ? {
          ...prev,
          urls: [...(prev.urls || []), result.urlSource]
        } : null)
        setNewUrl('')
        setNewUrlCategory('')
        setNewUrlTags('')
        setSuccessMessage('URL content scraped successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const error = await response.json()
        setErrorMessage(error.error || 'Failed to scrape URL')
        setTimeout(() => setErrorMessage(''), 3000)
      }
    } catch (error) {
      setErrorMessage('Failed to scrape URL')
      setTimeout(() => setErrorMessage(''), 3000)
    }
  }

  // Structured data function
  const handleStructuredData = async () => {
    if (!selectedBot || !newStructuredName.trim() || !newStructuredData.trim()) return

    try {
      let parsedData
      try {
        parsedData = JSON.parse(newStructuredData)
      } catch {
        setErrorMessage('Invalid JSON format for structured data')
        setTimeout(() => setErrorMessage(''), 3000)
        return
      }

      const response = await fetch('/api/bot-settings/structured-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId: selectedBot.botId,
          name: newStructuredName,
          type: newStructuredType,
          data: parsedData,
          category: newStructuredCategory || 'General',
          tags: newStructuredTags
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSelectedBot(prev => prev ? {
          ...prev,
          structuredData: [...(prev.structuredData || []), result.structuredData]
        } : null)
        setNewStructuredName('')
        setNewStructuredData('')
        setNewStructuredCategory('')
        setNewStructuredTags('')
        setSuccessMessage('Structured data added successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const error = await response.json()
        setErrorMessage(error.error || 'Failed to add structured data')
        setTimeout(() => setErrorMessage(''), 3000)
      }
    } catch (error) {
      setErrorMessage('Failed to add structured data')
      setTimeout(() => setErrorMessage(''), 3000)
    }
  }

  // Toggle enable/disable for data sources
  const toggleDataSource = async (type: 'documents' | 'urls' | 'structuredData', id: string, enabled: boolean) => {
    if (!selectedBot) return

    try {
      const endpoint = type === 'documents' ? 'documents' : type === 'urls' ? 'urls' : 'structured-data'
      const response = await fetch(`/api/bot-settings/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId: selectedBot.botId,
          [type === 'documents' ? 'documentId' : type === 'urls' ? 'urlId' : 'dataId']: id,
          enabled
        }),
      })

      if (response.ok) {
        setSelectedBot(prev => prev ? {
          ...prev,
          [type]: prev[type]?.map(item => 
            item.id === id ? { ...item, enabled } : item
          ) || []
        } : null)
      }
    } catch (error) {
      console.error('Failed to toggle data source:', error)
    }
  }

  // Delete data source
  const deleteDataSource = async (type: 'documents' | 'urls' | 'structuredData', id: string) => {
    if (!selectedBot) return

    try {
      const endpoint = type === 'documents' ? 'documents' : type === 'urls' ? 'urls' : 'structured-data'
      const response = await fetch(`/api/bot-settings/${endpoint}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId: selectedBot.botId,
          [type === 'documents' ? 'documentId' : type === 'urls' ? 'urlId' : 'dataId']: id
        }),
      })

      if (response.ok) {
        setSelectedBot(prev => prev ? {
          ...prev,
          [type]: prev[type]?.filter(item => item.id !== id) || []
        } : null)
        setSuccessMessage(`${type === 'documents' ? 'Document' : type === 'urls' ? 'URL' : 'Structured data'} deleted successfully!`)
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      setErrorMessage(`Failed to delete ${type === 'documents' ? 'document' : type === 'urls' ? 'URL' : 'structured data'}`)
      setTimeout(() => setErrorMessage(''), 3000)
    }
  }

  // Preview chat functions
  const openPreview = () => {
    setShowPreview(true)
    setPreviewMessages([{
      id: '1',
      text: selectedBot?.welcomeMessage || 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }])
  }

  const closePreview = () => {
    setShowPreview(false)
    setPreviewMessages([])
    setPreviewInput('')
  }

  const sendPreviewMessage = () => {
    if (!previewInput.trim() || !selectedBot) return

    const userMessage = {
      id: Date.now().toString(),
      text: previewInput,
      isUser: true,
      timestamp: new Date()
    }

    setPreviewMessages(prev => [...prev, userMessage])
    setPreviewInput('')

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: "This is a preview of how your bot will respond. In the actual implementation, it would use AI to generate responses based on your FAQs and settings.",
        isUser: false,
        timestamp: new Date()
      }
      setPreviewMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  // Search functionality - now just updates the input
  const handleSearch = (query: string) => {
    setSearchInput(query)
  }

  // Pagination functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }))
      loadBots(page, searchQuery, sortBy, sortOrder)
    }
  }

  const changePageSize = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }))
    loadBots(1, searchQuery, sortBy, sortOrder)
  }

  // Sort functionality
  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc'
    setSortBy(field)
    setSortOrder(newOrder)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    loadBots(1, searchQuery, field, newOrder)
  }

  // Load more functionality
  const loadMoreBots = () => {
    setBotsToShow(prev => prev + 10)
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null
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
      <div className="relative bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🤖</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  EmbedChat Pro
                </h1>
                <p className="text-sm text-gray-600">AI FAQ Bot Widget Dashboard</p>
              </div>
            </div>
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bots List */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm bg-white border border-gray-200 rounded-md overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">All Chatbots</CardTitle>
                  </div>
                  <Button 
                    onClick={() => setShowCreateForm(!showCreateForm)}  
                    size="sm"
                    variant="outline"
                    className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Bot
                  </Button>
                </div>
                
                {/* Search Field Only */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search bots by name, ID, or message..."
                      value={searchInput}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Global Error Message */}
                {errorMessage && !showCreateForm && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
                    <div className="flex items-center">
                      <div className="text-red-500 text-lg mr-2">⚠️</div>
                      {errorMessage}
                    </div>
                  </div>
                )}
                
                {/* Global Success Message */}
                {successMessage && !showCreateForm && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
                    <div className="flex items-center">
                      <div className="text-green-500 text-lg mr-2">✅</div>
                      {successMessage}
                    </div>
                  </div>
                )}
                
                {showCreateForm && (
                  <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                          <Plus className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-bold">Create New Bot</h3>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Error Message */}
                      {errorMessage && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
                          <div className="flex items-center">
                            <div className="text-red-500 text-lg mr-2">⚠️</div>
                            {errorMessage}
                          </div>
                        </div>
                      )}
                      
                      {/* Success Message */}
                      {successMessage && (
                        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
                          <div className="flex items-center">
                            <div className="text-green-500 text-lg mr-2">✅</div>
                            {successMessage}
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="new-bot-id" className="text-sm font-semibold text-gray-700 mb-2 block">Bot ID</Label>
                          <Input
                            id="new-bot-id"
                            value={newBot.botId}
                            onChange={(e) => setNewBot({...newBot, botId: e.target.value})}
                            placeholder="e.g., restaurant_bot"
                            className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                          <p className="text-xs text-gray-500 mt-1">Must be unique. Use lowercase letters, numbers, and underscores only.</p>
                        </div>
                        <div>
                          <Label htmlFor="new-bot-name" className="text-sm font-semibold text-gray-700 mb-2 block">Bot Name</Label>
                          <Input
                            id="new-bot-name"
                            value={newBot.name}
                            onChange={(e) => setNewBot({...newBot, name: e.target.value})}
                            placeholder="e.g., Restaurant Assistant"
                            className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="new-bot-welcome" className="text-sm font-semibold text-gray-700 mb-2 block">Welcome Message</Label>
                        <Input
                          id="new-bot-welcome"
                          value={newBot.welcomeMessage}
                          onChange={(e) => setNewBot({...newBot, welcomeMessage: e.target.value})}
                          placeholder="Enter a welcoming message for your bot"
                          className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-bot-color" className="text-sm font-semibold text-gray-700 mb-2 block">Theme Color</Label>
                        <div className="flex items-center space-x-3">
                          <Input
                            id="new-bot-color"
                            type="color"
                            value={newBot.themeColor}
                            onChange={(e) => setNewBot({...newBot, themeColor: e.target.value})}
                            className="w-16 h-12 border border-gray-200 rounded-md cursor-pointer"
                          />
                          <span className="text-sm text-gray-600">Choose your bot's primary color</span>
                        </div>
                      </div>
                      <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <Button 
                          onClick={createBot} 
                          disabled={isCreatingBot}
                          size="sm"
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-md shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isCreatingBot ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Create Bot
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={() => setShowCreateForm(false)} 
                          variant="outline" 
                          size="sm"
                          className="border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-2 rounded-md transition-all duration-200"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}


                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-600">Loading bots...</span>
                  </div>
                )}

                {/* Bots List */}
                <div className="space-y-3">
                  {!isLoading && bots.map((bot) => (
                    <div
                      key={bot.botId}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedBot?.botId === bot.botId 
                            ? 'bg-indigo-50 border-indigo-300 shadow-sm' 
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-indigo-200 hover:shadow-sm'
                        }`}
                      onClick={() => selectBot(bot)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <span className="text-indigo-600 text-xs">🤖</span>
                            </div>
                            <h3 className="font-semibold text-gray-900">{bot.name}</h3>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">ID: {bot.botId}</p>
                          <p className="text-xs text-gray-500">{bot.faqs.length} FAQs</p>
                        </div>
                        <div className="flex space-x-2">
                          <div className="relative">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyEmbedCode(bot.botId)
                              }}
                              className="w-8 h-8 p-0 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            {copiedBotId === bot.botId && (
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                Copied!
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDeleteModal(bot)
                            }}
                            className="w-8 h-8 p-0 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* No Results Message */}
                  {!isLoading && bots.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No bots found</h3>
                      <p className="text-gray-600">
                        {searchQuery ? 'Try adjusting your search terms' : 'Create your first bot to get started'}
                      </p>
                    </div>
                  )}

                  {/* Load More Button */}
                  {!isLoading && allBots.length > botsToShow && (
                    <div className="mt-6 text-center">
                      <Button
                        onClick={loadMoreBots}
                        variant="outline"
                        className="px-6 py-2 border border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200"
                      >
                        Load More Bots
                        <span className="ml-2 text-sm text-gray-500">
                          ({allBots.length - botsToShow} remaining)
                        </span>
                      </Button>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Bot Settings */}
          <div className="lg:col-span-2">
            {selectedBot ? (
              <Card className="shadow-sm bg-white border border-gray-200 rounded-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">{selectedBot.name} Settings</CardTitle>
                      <CardDescription className="text-purple-100">Bot ID: {selectedBot.botId}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="bot-name" className="text-sm font-semibold text-gray-700 mb-2 block">Bot Name</Label>
                      <Input
                        id="bot-name"
                        value={selectedBot.name}
                        onChange={(e) => setSelectedBot({...selectedBot, name: e.target.value})}
                        className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bot-color" className="text-sm font-semibold text-gray-700 mb-2 block">Theme Color</Label>
                      <Input
                        id="bot-color"
                        type="color"
                        value={selectedBot.themeColor}
                        onChange={(e) => setSelectedBot({...selectedBot, themeColor: e.target.value})}
                        className="w-full h-12 border border-gray-200 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="welcome-message" className="text-sm font-semibold text-gray-700 mb-2 block">Welcome Message</Label>
                    <Input
                      id="welcome-message"
                      value={selectedBot.welcomeMessage}
                      onChange={(e) => setSelectedBot({...selectedBot, welcomeMessage: e.target.value})}
                      className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Knowledge Base Tabs */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        {[
                          { id: 'faq', name: 'FAQs', icon: MessageSquare },
                          { id: 'documents', name: 'Documents', icon: Upload },
                          { id: 'urls', name: 'Web Content', icon: Plus },
                          { id: 'structured', name: 'Structured Data', icon: BarChart3 }
                        ].map((tab) => {
                          const Icon = tab.icon
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id as any)}
                              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                activeTab === tab.id
                                  ? 'border-indigo-500 text-indigo-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{tab.name}</span>
                            </button>
                          )
                        })}
                      </nav>
                    </div>

                    {/* FAQ Tab */}
                    {activeTab === 'faq' && (
                      <div>
                        <Label htmlFor="faq-text" className="text-sm font-semibold text-gray-700 mb-2 block">FAQ Content</Label>
                        <Textarea
                          id="faq-text"
                          value={faqText}
                          onChange={(e) => setFaqText(e.target.value)}
                          placeholder="Enter FAQs in Q&A format, separated by double line breaks..."
                          rows={10}
                          className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Format: Q: Question? A: Answer. Separate different Q&A pairs with blank lines.
                        </p>
                      </div>
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4">
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                  Upload Documents
                                </span>
                                <span className="mt-1 block text-sm text-gray-500">
                                  PDF, DOCX, and TXT files with full text extraction
                                </span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  accept=".pdf,.docx,.txt"
                                  onChange={handleFileUpload}
                                  disabled={uploadingFile}
                                  className="sr-only"
                                />
                              </label>
                              <Button
                                onClick={() => document.getElementById('file-upload')?.click()}
                                disabled={uploadingFile}
                                className="mt-4"
                              >
                                {uploadingFile ? 'Uploading...' : 'Choose Files'}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Document List */}
                        {selectedBot.documents && selectedBot.documents.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
                            {selectedBot.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-2 h-2 rounded-full ${doc.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                                  <span className="font-medium">{doc.name}</span>
                                  <span className="text-sm text-gray-500">({doc.type.toUpperCase()})</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleDataSource('documents', doc.id, !doc.enabled)}
                                  >
                                    {doc.enabled ? 'Disable' : 'Enable'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deleteDataSource('documents', doc.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* URLs Tab */}
                    {activeTab === 'urls' && (
                      <div className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="url-input" className="text-sm font-semibold text-gray-700 mb-2 block">Website URL</Label>
                            <Input
                              id="url-input"
                              value={newUrl}
                              onChange={(e) => setNewUrl(e.target.value)}
                              placeholder="https://example.com"
                              className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="url-category" className="text-sm font-semibold text-gray-700 mb-2 block">Category</Label>
                              <Input
                                id="url-category"
                                value={newUrlCategory}
                                onChange={(e) => setNewUrlCategory(e.target.value)}
                                placeholder="General"
                                className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="url-tags" className="text-sm font-semibold text-gray-700 mb-2 block">Tags (comma-separated)</Label>
                              <Input
                                id="url-tags"
                                value={newUrlTags}
                                onChange={(e) => setNewUrlTags(e.target.value)}
                                placeholder="support, help, faq"
                                className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                          </div>
                          <Button onClick={handleUrlScraping} disabled={!newUrl.trim()}>
                            Scrape Content
                          </Button>
                        </div>

                        {/* URL List */}
                        {selectedBot.urls && selectedBot.urls.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Scraped URLs</h4>
                            {selectedBot.urls.map((url) => (
                              <div key={url.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-start space-x-3 flex-1 min-w-0">
                                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${url.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{url.title}</div>
                                    <div className="text-sm text-gray-500 break-all">{url.url}</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleDataSource('urls', url.id, !url.enabled)}
                                  >
                                    {url.enabled ? 'Disable' : 'Enable'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deleteDataSource('urls', url.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Structured Data Tab */}
                    {activeTab === 'structured' && (
                      <div className="space-y-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="structured-name" className="text-sm font-semibold text-gray-700 mb-2 block">Name</Label>
                              <Input
                                id="structured-name"
                                value={newStructuredName}
                                onChange={(e) => setNewStructuredName(e.target.value)}
                                placeholder="Product Catalog"
                                className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="structured-type" className="text-sm font-semibold text-gray-700 mb-2 block">Type</Label>
                              <select
                                id="structured-type"
                                value={newStructuredType}
                                onChange={(e) => setNewStructuredType(e.target.value as any)}
                                className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full p-2"
                              >
                                <option value="products">Products</option>
                                <option value="pricing">Pricing</option>
                                <option value="services">Services</option>
                                <option value="catalog">Catalog</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="structured-data" className="text-sm font-semibold text-gray-700 mb-2 block">JSON Data</Label>
                            <Textarea
                              id="structured-data"
                              value={newStructuredData}
                              onChange={(e) => setNewStructuredData(e.target.value)}
                              placeholder='{"products": [{"name": "Product 1", "price": 100, "description": "..."}]}'
                              rows={6}
                              className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="structured-category" className="text-sm font-semibold text-gray-700 mb-2 block">Category</Label>
                              <Input
                                id="structured-category"
                                value={newStructuredCategory}
                                onChange={(e) => setNewStructuredCategory(e.target.value)}
                                placeholder="General"
                                className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="structured-tags" className="text-sm font-semibold text-gray-700 mb-2 block">Tags (comma-separated)</Label>
                              <Input
                                id="structured-tags"
                                value={newStructuredTags}
                                onChange={(e) => setNewStructuredTags(e.target.value)}
                                placeholder="products, pricing, catalog"
                                className="border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                          </div>
                          <Button onClick={handleStructuredData} disabled={!newStructuredName.trim() || !newStructuredData.trim()}>
                            Add Structured Data
                          </Button>
                        </div>

                        {/* Structured Data List */}
                        {selectedBot.structuredData && selectedBot.structuredData.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Structured Data Sources</h4>
                            {selectedBot.structuredData.map((data) => (
                              <div key={data.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-2 h-2 rounded-full ${data.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                                  <div>
                                    <div className="font-medium">{data.name}</div>
                                    <div className="text-sm text-gray-500 capitalize">{data.type}</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleDataSource('structuredData', data.id, !data.enabled)}
                                  >
                                    {data.enabled ? 'Disable' : 'Enable'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deleteDataSource('structuredData', data.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      onClick={openPreview}
                      variant="outline"
                      className="flex items-center space-x-2 border border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-md shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Preview Chat</span>
                    </Button>
                    
                    <Button 
                      onClick={handleSaveSettings} 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-md shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Embed Code</Label>
                    <div className="flex space-x-3">
                      <Input
                        value={`<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://chatai-seven-steel.vercel.app'}/bot.js" data-bot="${selectedBot.botId}"></script>`}
                        readOnly
                        className="font-mono text-sm border border-gray-200 rounded-md bg-gray-50"
                      />
                      <div className="relative">
                        <Button 
                          onClick={() => copyEmbedCode(selectedBot.botId)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-md shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        {copiedBotId === selectedBot.botId && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                            Copied!
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-white text-xs font-bold">i</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">Where to Embed This Code</h4>
                          <div className="text-sm text-blue-800 space-y-2">
                            <p><strong>1. Copy the code above</strong> using the copy button</p>
                            <p><strong>2. Paste it in your website's footer</strong> </p>
                            <p><strong>3. The chat widget will appear automatically</strong> on your website</p>
                            <p className="text-blue-600 font-medium">✨ Works with any website: WordPress, Shopify, HTML, React, Vue, Angular, etc.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {analytics && (
                    <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-6 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                          <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Analytics</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-md border border-blue-200">
                          <div className="flex items-center">
                            <MessageCircle className="w-6 h-6 text-blue-600 mr-3" />
                            <div>
                              <p className="text-2xl font-bold text-blue-600">{analytics.stats?.messagesSent || 0}</p>
                              <p className="text-sm text-gray-600 font-medium">Messages</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-md border border-green-200">
                          <div className="flex items-center">
                            <Users className="w-6 h-6 text-green-600 mr-3" />
                            <div>
                              <p className="text-2xl font-bold text-green-600">{analytics.stats?.chatOpens || 0}</p>
                              <p className="text-sm text-gray-600 font-medium">Chat Opens</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-md border border-purple-200">
                          <div className="flex items-center">
                            <BarChart3 className="w-6 h-6 text-purple-600 mr-3" />
                            <div>
                              <p className="text-2xl font-bold text-purple-600">{analytics.stats?.totalInteractions || 0}</p>
                              <p className="text-sm text-gray-600 font-medium">Interactions</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-md border border-orange-200">
                          <div className="flex items-center">
                            <Clock className="w-6 h-6 text-orange-600 mr-3" />
                            <div>
                              <p className="text-2xl font-bold text-orange-600">{analytics.stats?.uniqueSessions || 0}</p>
                              <p className="text-sm text-gray-600 font-medium">Sessions</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-2xl bg-white/80 backdrop-blur-sm border-0 rounded-md overflow-hidden">
                <CardContent className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bot Selected</h3>
                  <p className="text-gray-600 text-lg">Select a bot from the list to view and edit its settings.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Preview Chat Modal */}
      {showPreview && selectedBot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full h-[600px] flex flex-col">
            {/* Chat Header */}
            <div 
              className="p-4 rounded-t-lg text-white flex items-center justify-between"
              style={{ backgroundColor: selectedBot.themeColor }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedBot.name}</h3>
                  <p className="text-sm opacity-90">Preview Mode</p>
                </div>
              </div>
              <Button
                onClick={closePreview}
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0 bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {previewMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <Input
                  value={previewInput}
                  onChange={(e) => setPreviewInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendPreviewMessage()}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  onClick={sendPreviewMessage}
                  disabled={!previewInput.trim()}
                  className="px-4 py-2"
                  style={{ backgroundColor: selectedBot.themeColor }}
                >
                  Send
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                This is a preview. The actual bot will use AI to respond based on your FAQs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Embed Code Modal */}
      {showEmbedModal && selectedBot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Settings Saved Successfully!</h3>
                  <p className="text-sm text-gray-600">Copy the embed code to add this bot to your website</p>
                </div>
              </div>
              <Button
                onClick={() => setShowEmbedModal(false)}
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Bot Information</Label>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bot Name:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedBot.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bot ID:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedBot.botId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Theme Color:</span>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300" 
                        style={{ backgroundColor: selectedBot.themeColor }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">{selectedBot.themeColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Embed Code</Label>
                <div className="flex space-x-3">
                  <Input
                    value={`<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://chatai-seven-steel.vercel.app'}/bot.js" data-bot="${selectedBot.botId}"></script>`}
                    readOnly
                    className="font-mono text-sm border border-gray-200 rounded-md bg-gray-50"
                  />
                  <div className="relative">
                    <Button 
                      onClick={copyEmbedCodeModal}
                      className={`px-4 py-2 rounded-md shadow-lg transform hover:scale-105 transition-all duration-300 ${
                        embedCodeCopied 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                      }`}
                    >
                      {embedCodeCopied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">How to Use This Code</h4>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p><strong>1. Copy the code above</strong> using the copy button</p>
                      <p><strong>2. Paste it in your website's HTML</strong> (preferably before the closing &lt;/body&gt; tag)</p>
                      <p><strong>3. The chat widget will appear automatically</strong> on your website</p>
                      <p className="text-blue-600 font-medium">✨ Works with any website: WordPress, Shopify, HTML, React, Vue, Angular, etc.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowEmbedModal(false)}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Close
                </Button>
                <Button
                  onClick={copyEmbedCodeModal}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Embed Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && botToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Bot</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              <Button
                onClick={cancelDeleteBot}
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete <strong>"{botToDelete.name}"</strong>?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-red-500 text-lg">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-semibold text-red-800 mb-1">Warning</h4>
                      <p className="text-sm text-red-700">
                        This will permanently delete the bot and all its data. Any websites using this bot will stop working.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={cancelDeleteBot}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteBot}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Bot
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}