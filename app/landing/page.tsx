'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  const { data: session } = useSession()

  const features = [
    {
      title: "AI-Powered Intelligence",
      description: "gpt-4o-mini analyzes your comprehensive knowledge base from multiple sources to provide intelligent, context-aware responses.",
      icon: "🧠",
      details: [
        "Multi-source knowledge base analysis",
        "Natural language understanding",
        "Context-aware conversations",
        "Human-like responses from all data sources"
      ]
    },
    {
      title: "Multi-Source Knowledge Base",
      description: "Upload documents, scrape web content, add structured data, and manage FAQs all in one comprehensive knowledge base.",
      icon: "📚",
      details: [
        "Document upload (PDF, DOCX, TXT)",
        "Web content scraping from URLs",
        "Structured data management",
        "Smart categorization and tagging"
      ]
    },
    {
      title: "Easy Integration",
      description: "Get your chatbot live on your website in minutes with our simple embed code.",
      icon: "⚡",
      details: [
        "One-line embed code",
        "Works with any website",
        "No technical knowledge required",
        "Mobile-responsive design"
      ]
    },
    {
      title: "Customizable Design",
      description: "Match your brand with customizable colors, fonts, and chat widget appearance.",
      icon: "🎨",
      details: [
        "Brand color matching",
        "Custom welcome messages",
        "Flexible positioning",
        "Multiple chat themes"
      ]
    },
  ]

  const steps = [
    {
      number: 1,
      title: "Sign Up & Create Bot",
      description: "Create your account and set up your first chatbot with a simple name and description.",
      details: "Choose a name that represents your business or service. This will be how customers identify your chatbot."
    },
    {
      number: 2,
      title: "Build Your Knowledge Base",
      description: "Upload documents (PDF, DOCX, TXT), scrape web content from URLs, add structured data, and manage FAQs all in one place.",
      details: "The gpt-4o-mini AI analyzes content from all sources - documents, web pages, structured data, and FAQs - to provide comprehensive, accurate answers. Upload manuals, policies, product catalogs, scrape your website content, and add structured data for products and services."
    },
    {
      number: 3,
      title: "Customize Appearance",
      description: "Match your brand with custom colors, welcome messages, and chat widget settings.",
      details: "Personalize the chat widget to match your website's design. Set your brand colors, customize the welcome message, and configure response behavior."
    },
    {
      number: 4,
      title: "Get Embed Code",
      description: "Copy the generated embed code and paste it into your website's HTML.",
      details: "Simply copy the provided script tag and paste it before the closing </body> tag of your website. The chatbot will appear automatically."
    },
    {
      number: 5,
      title: "Monitor & Improve",
      description: "Track conversations, analyze performance, and continuously improve your chatbot's responses.",
      details: "Use the analytics dashboard to see which questions are asked most, how well your bot is performing, and where you can improve the FAQ content."
    }
  ]

  const benefits = [
    "24/7 automated customer support",
    "Instant responses from comprehensive knowledge base",
    "Reduces support ticket volume by up to 80%",
    "Improves customer satisfaction",
    "Document processing & web scraping",
    "Multi-source intelligence",
    "Works across all devices",
    "No technical expertise required"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ChatBot Platform</span>
            </div>
            <div className="flex space-x-4">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Settings
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/login" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Animated Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-8 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <span className="text-4xl animate-pulse">🤖</span>
            </div>
            
            {/* Main Heading with Gradient */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
              EmbedChat Pro
              <br />
              <span className="text-4xl md:text-5xl text-gray-700">AI Chatbot Builder</span>
            </h1>
            
            {/* Enhanced Description */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed animate-fade-in-up">
              Transform your customer support with intelligent AI chatbots powered by 
              <span className="font-semibold text-indigo-600"> gpt-4o-mini</span>. 
              Build chatbots with FAQs, documents, and web content. Embeddable widgets for WordPress, Shopify & all websites.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-fade-in-up animation-delay-500">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-10 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                      <span className="mr-2">🚀</span>
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button size="lg" variant="outline" className="border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 text-lg px-10 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                      <span className="mr-2">⚙️</span>
                      Manage Settings
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-10 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                      <span className="mr-2">🚀</span>
                      Start Building Your Bot
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 text-lg px-10 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                    <span className="mr-2">📖</span>
                    Learn More
                  </Button>
                </>
              )}
            </div>
            
            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 animate-fade-in-up animation-delay-1000">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-green-500 text-lg">✓</span>
                <span className="font-medium">Free to start</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-green-500 text-lg">✓</span>
                <span className="font-medium">No coding required</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-green-500 text-lg">✓</span>
                <span className="font-medium">5-minute setup</span>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-indigo-600 mb-2">10K+</div>
                <div className="text-gray-600">Active Bots</div>
              </div>
              <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
              <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-pink-600 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to create, deploy, and manage intelligent chatbots that 
              <span className="font-semibold text-indigo-600"> actually work</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="transition-all duration-500 transform hover:-translate-y-2 min-h-[400px] shadow-lg hover:shadow-2xl hover:border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50"
              >
                <CardHeader className="text-center relative">
                  <div className="text-5xl mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4"></div>
                    <ul className="space-y-3">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center space-x-3 text-sm text-gray-700">
                          <div className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 text-xs">✓</span>
                          </div>
                          <span className="font-medium">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Feature Showcase */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Experience the Power?</h3>
              <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                See how our AI chatbots can transform your customer support in just a few clicks
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {session ? (
                  <>
                    <Link href="/dashboard">
                      <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-indigo-600 px-8 py-3 rounded-full font-semibold">
                        Manage Settings
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold">
                        Try It Free
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-indigo-600 px-8 py-3 rounded-full font-semibold">
                      View Pricing
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get your AI chatbot running in 
              <span className="font-bold text-indigo-600"> 5 simple steps</span> - 
              no technical expertise required
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300"></div>
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="relative flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-12 group">
                  {/* Step Number with Connection */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-2xl transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                      {step.number}
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">
                            {index === 0 && '👤'}
                            {index === 1 && '📚'}
                            {index === 2 && '🎨'}
                            {index === 3 && '📋'}
                            {index === 4 && '📊'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                          {step.description}
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                          <p className="text-sm text-gray-700 font-medium">
                            💡 <span className="text-indigo-600">Pro Tip:</span> {step.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Process Visualization */}
          <div className="mt-20 text-center">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The Complete Process</h3>
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  <span className="font-medium text-indigo-700">Sign Up</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="font-medium text-purple-700">Build Knowledge Base</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex items-center space-x-2 bg-pink-50 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span className="font-medium text-pink-700">Customize</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="font-medium text-green-700">Deploy</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="font-medium text-yellow-700">Monitor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-indigo-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
                <span className="text-2xl">🚀</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of businesses already using our AI chatbot platform 
                to improve customer support with comprehensive knowledge bases and 
                <span className="font-bold text-indigo-600"> reduce costs by up to 80%</span>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-fade-in-right">
              <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
                  </div>
                  <p className="text-indigo-100 mb-8 text-lg leading-relaxed">
                    Create your first AI chatbot with comprehensive knowledge base in minutes and start providing 
                    better customer support today. Upload documents, scrape web content, and add structured data!
                  </p>
                  
                  <div className="space-y-4">
                    {session ? (
                      <>
                        <Link href="/dashboard">
                          <Button size="lg" className="w-full bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                            <span className="mr-2">🚀</span>
                            Go to Dashboard
                          </Button>
                        </Link>
                        <div className="text-center">
                          <p className="text-indigo-200 text-sm">
                            ✨ <span className="font-semibold">Welcome back!</span> • Manage your bots
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link href="/login" target="_blank" rel="noopener noreferrer">
                          <Button size="lg" className="w-full bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                            <span className="mr-2">🚀</span>
                            Create Your Bot Now
                          </Button>
                        </Link>
                        <div className="text-center">
                          <p className="text-indigo-200 text-sm">
                            ✨ <span className="font-semibold">Free to start</span> • No credit card required
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-1/4 animate-float">
          <div className="w-6 h-6 bg-white/20 rounded-full"></div>
        </div>
        <div className="absolute top-32 right-1/4 animate-float animation-delay-1000">
          <div className="w-4 h-4 bg-white/30 rounded-full"></div>
        </div>
        <div className="absolute bottom-20 left-1/3 animate-float animation-delay-2000">
          <div className="w-8 h-8 bg-white/10 rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-2xl">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Start Building Your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                AI Chatbot Today
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join the future of customer support. Create your first chatbot with comprehensive knowledge base in minutes 
              and see the difference AI can make for your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold">
                      <span className="mr-3">🚀</span>
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 text-xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold">
                      <span className="mr-3">⚙️</span>
                      Manage Settings
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold">
                      <span className="mr-3">🚀</span>
                      Get Started Free
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-indigo-600 text-xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold">
                    <span className="mr-3">💬</span>
                    Contact Sales
                  </Button>
                </>
              )}
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-indigo-200">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-green-400 text-xl">✓</span>
                <span className="font-semibold">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-green-400 text-xl">✓</span>
                <span className="font-semibold">Setup in 5 minutes</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-green-400 text-xl">✓</span>
                <span className="font-semibold">24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-bold">ChatBot Platform</span>
              </div>
              <p className="text-gray-400">
                Create intelligent AI chatbots with comprehensive knowledge bases for your website in minutes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI ChatBot Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
