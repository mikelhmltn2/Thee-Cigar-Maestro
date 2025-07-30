'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react'
import { LuxuryButton, PremiumLoader } from '@/components/luxury'
import { cn } from '@/utils/cn'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface ChatInterfaceProps {
  className?: string
  placeholder?: string
  welcomeMessage?: string
  onSendMessage?: (message: string) => Promise<string>
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  className,
  placeholder = "Ask me about cigars, pairings, or recommendations...",
  welcomeMessage = "Welcome! I'm your AI cigar concierge. How may I assist you in finding the perfect cigar today?",
  onSendMessage
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      // Get AI response
      const response = onSendMessage 
        ? await onSendMessage(userMessage.content)
        : await simulateAIResponse(userMessage.content)

      // Remove typing indicator and add response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing')
        return [...filtered, {
          id: Date.now().toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }]
      })
    } catch (error) {
      console.error('Error getting AI response:', error)
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing')
        return [...filtered, {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date()
        }]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Simulate AI response for demo
  const simulateAIResponse = async (message: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const responses = [
      "Based on your preferences, I'd recommend the Padron 1964 Anniversary Series. Its complex flavor profile of cocoa, coffee, and subtle spice would pair beautifully with your evening ritual.",
      "For a special celebration, consider the Cohiba Behike 56. This ultra-premium Cuban offers an unparalleled smoking experience with notes of honey, cedar, and cream.",
      "The Arturo Fuente OpusX is an excellent choice for connoisseurs. Its rare Dominican tobacco creates a symphony of flavors that evolve throughout the smoke.",
      "I suggest trying the Davidoff Winston Churchill Late Hour. Its sophisticated blend is perfect for contemplative moments, offering notes of black pepper, dark chocolate, and vintage leather."
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <div className={cn('flex flex-col h-[600px]', className)}>
      {/* Chat header */}
      <div className="bg-gradient-to-r from-luxury-gold/10 to-luxury-gold/5 p-4 border-b border-luxury-gold/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-background-primary" />
          </div>
          <div>
            <h3 className="font-medium text-text-primary">AI Concierge</h3>
            <p className="text-xs text-text-muted">Always here to help</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-secondary/50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-background-primary" />
                </div>
              )}
              
              <div
                className={cn(
                  'max-w-[70%] rounded-luxury-lg p-4',
                  message.role === 'user'
                    ? 'bg-luxury-gold text-background-primary'
                    : 'bg-background-accent border border-luxury-gold/10'
                )}
              >
                {message.isTyping ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-text-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-background-primary" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-luxury-gold/20 bg-background-secondary">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 bg-background-accent border border-luxury-gold/20 rounded-luxury p-3 text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-luxury-gold/50 transition-colors"
            rows={1}
            disabled={isLoading}
          />
          <LuxuryButton
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            variant="primary"
            size="md"
            icon={<Send className="w-4 h-4" />}
            className="self-end"
          >
            Send
          </LuxuryButton>
        </div>
        
        {/* Quick actions */}
        <div className="flex gap-2 mt-3">
          {['Recommend a cigar', 'Find pairings', 'Learn basics'].map((action) => (
            <button
              key={action}
              onClick={() => setInput(action)}
              className="text-xs text-luxury-gold hover:text-luxury-gold-light transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatInterface