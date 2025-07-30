'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, MessageCircle, Coffee, Wine } from 'lucide-react'
import { trackChatbotInteraction } from '../../components/GoogleAnalytics'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  recommendations?: CigarRecommendation[]
}

interface CigarRecommendation {
  name: string
  brand: string
  strength: string
  flavor: string
  price: number
  confidence: number
}

const AIConciergeInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome! I'm your personal AI sommelier. I can help you find the perfect cigar based on your preferences, mood, or occasion. What would you like to explore today?",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    { text: "Recommend a cigar for a celebration", icon: Coffee },
    { text: "What pairs well with whiskey?", icon: Wine },
    { text: "I'm new to cigars, where do I start?", icon: Sparkles },
    { text: "Show me premium Cuban cigars", icon: MessageCircle },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Track user interaction
    trackChatbotInteraction('user_message', detectIntent(messageText))

    try {
      // Simulate AI response with realistic delay
      const response = await generateAIResponse(messageText)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        recommendations: response.recommendations,
      }

      setMessages(prev => [...prev, assistantMessage])
      trackChatbotInteraction('ai_response', response.intent)
    } catch (error) {
      toast.error('Sorry, I encountered an issue. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const detectIntent = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) return 'recommendation'
    if (lowerMessage.includes('pair') || lowerMessage.includes('drink')) return 'pairing'
    if (lowerMessage.includes('beginner') || lowerMessage.includes('new')) return 'education'
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) return 'pricing'
    return 'general'
  }

  const generateAIResponse = async (userMessage: string): Promise<{ content: string; recommendations?: CigarRecommendation[]; intent: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

    const intent = detectIntent(userMessage)
    const lowerMessage = userMessage.toLowerCase()

    // Generate contextual responses based on intent
    if (intent === 'recommendation') {
      const recommendations: CigarRecommendation[] = [
        {
          name: 'Cohiba Behike 56',
          brand: 'Cohiba',
          strength: 'Full',
          flavor: 'Rich chocolate, cedar, with hints of coffee and spice',
          price: 45,
          confidence: 92
        },
        {
          name: 'Arturo Fuente Opus X',
          brand: 'Arturo Fuente',
          strength: 'Medium-Full',
          flavor: 'Spicy cedar, leather, with notes of pepper and earth',
          price: 35,
          confidence: 88
        }
      ]

      return {
        content: "Based on your preferences, I've found some excellent options for you. These cigars offer exceptional quality and should align perfectly with what you're looking for. Would you like me to explain more about any of these recommendations?",
        recommendations,
        intent
      }
    }

    if (intent === 'pairing') {
      return {
        content: "Excellent question! Pairing cigars with drinks is an art. For whiskey, I recommend medium to full-bodied cigars with earthy or spicy notes. The robust flavors complement each other beautifully. Cuban cigars like Montecristo or Nicaraguan options like Padrón work wonderfully. Would you like specific recommendations for your whiskey preference?",
        intent
      }
    }

    if (intent === 'education') {
      return {
        content: "Welcome to the wonderful world of cigars! For beginners, I recommend starting with milder cigars to develop your palate. Connecticut-wrapped cigars are perfect - they're smooth, creamy, and forgiving. Consider cigars from brands like Macanudo, Ashton, or Romeo y Julieta Reserve. Would you like me to suggest a specific starter set?",
        intent
      }
    }

    // Default response
    return {
      content: "I'm here to help you discover amazing cigars! Whether you're looking for recommendations, pairing advice, or learning about cigar culture, I have the knowledge of master blenders and decades of expertise. What specific aspect of cigars interests you most?",
      intent: 'general'
    }
  }

  return (
    <div className="card-luxury h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 p-6 border-b border-text-muted/20">
        <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-background-primary" />
        </div>
        <div>
          <h3 className="font-display text-luxury-gold font-semibold">AI Sommelier</h3>
          <p className="text-sm text-text-muted">Expert guidance, available 24/7</p>
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-1 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-background-accent' 
                    : 'bg-gradient-gold'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-text-primary" />
                  ) : (
                    <Bot className="w-4 h-4 text-background-primary" />
                  )}
                </div>
                
                <div className={`space-y-2 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-luxury-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-luxury-gold text-background-primary'
                      : 'bg-background-accent text-text-primary'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  
                  {/* Recommendations */}
                  {message.recommendations && (
                    <div className="space-y-2">
                      {message.recommendations.map((rec, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="card-glass p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-display text-luxury-gold font-semibold">{rec.name}</h4>
                            <span className="text-xs bg-luxury-gold text-background-primary px-2 py-1 rounded-full">
                              {rec.confidence}% match
                            </span>
                          </div>
                          <p className="text-text-muted text-sm mb-2">{rec.brand}</p>
                          <p className="text-text-secondary text-sm mb-3">{rec.flavor}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-text-muted text-sm">{rec.strength} strength</span>
                            <span className="text-luxury-gold font-bold">${rec.price}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-text-muted">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-background-primary" />
              </div>
              <div className="bg-background-accent rounded-luxury-lg p-4">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <p className="text-sm text-text-muted mb-3">Try asking:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map((prompt, index) => {
              const IconComponent = prompt.icon
              return (
                <button
                  key={index}
                  onClick={() => handleSubmit(prompt.text)}
                  className="flex items-center space-x-2 p-3 bg-background-accent hover:bg-background-leather rounded-luxury text-left text-sm transition-colors"
                  disabled={isLoading}
                >
                  <IconComponent className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                  <span className="text-text-secondary">{prompt.text}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t border-text-muted/20">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about cigars, pairings, or get recommendations..."
            className="input-luxury flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default AIConciergeInterface