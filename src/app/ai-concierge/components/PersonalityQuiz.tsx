'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, CheckCircle, User, Award } from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  options: Array<{
    value: string
    label: string
    description: string
  }>
  category: string
}

interface QuizResult {
  personality: string
  description: string
  recommendations: string[]
  preferredStrength: string
  preferredOrigins: string[]
  flavorProfile: string
}

const PersonalityQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "What best describes your experience with cigars?",
      category: "experience",
      options: [
        { value: "new", label: "New to cigars", description: "I'm just starting my cigar journey" },
        { value: "casual", label: "Casual smoker", description: "I enjoy cigars occasionally" },
        { value: "regular", label: "Regular enthusiast", description: "I smoke cigars regularly and know my preferences" },
        { value: "expert", label: "Connoisseur", description: "I'm very knowledgeable about cigars and terroir" }
      ]
    },
    {
      id: 2,
      question: "When do you typically enjoy cigars?",
      category: "occasion",
      options: [
        { value: "evening", label: "Evening relaxation", description: "After dinner or work to unwind" },
        { value: "special", label: "Special occasions", description: "Celebrations, achievements, or events" },
        { value: "social", label: "Social gatherings", description: "With friends, at lounges, or parties" },
        { value: "contemplative", label: "Quiet reflection", description: "Alone time for thinking or meditation" }
      ]
    },
    {
      id: 3,
      question: "What flavors do you gravitate toward in food and drinks?",
      category: "flavor",
      options: [
        { value: "mild", label: "Mild & Creamy", description: "Vanilla, cream, light coffee, nuts" },
        { value: "balanced", label: "Balanced & Complex", description: "Mix of sweet and savory, herbs, citrus" },
        { value: "rich", label: "Rich & Earthy", description: "Dark chocolate, leather, wood, tobacco" },
        { value: "bold", label: "Bold & Spicy", description: "Pepper, espresso, dark spirits, strong cheese" }
      ]
    },
    {
      id: 4,
      question: "How much time do you prefer to spend smoking?",
      category: "duration",
      options: [
        { value: "short", label: "30-45 minutes", description: "Quick enjoyment, smaller vitolas" },
        { value: "medium", label: "1-1.5 hours", description: "Standard smoking session" },
        { value: "long", label: "1.5-2 hours", description: "Extended, leisurely experience" },
        { value: "varies", label: "Depends on mood", description: "I like having options for different times" }
      ]
    },
    {
      id: 5,
      question: "What's your preferred drinking companion with cigars?",
      category: "pairing",
      options: [
        { value: "coffee", label: "Coffee or Tea", description: "Espresso, cappuccino, or premium tea" },
        { value: "whiskey", label: "Whiskey or Bourbon", description: "Aged spirits with complex flavors" },
        { value: "wine", label: "Wine or Port", description: "Red wine, port, or dessert wines" },
        { value: "rum", label: "Rum or Cognac", description: "Caribbean rum or French cognac" }
      ]
    }
  ]

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      completeQuiz()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const completeQuiz = () => {
    // Analyze answers and generate personality profile
    const analysisResult = analyzeAnswers(answers)
    setResult(analysisResult)
    setIsCompleted(true)
  }

  const analyzeAnswers = (userAnswers: Record<number, string>): QuizResult => {
    // Simple personality analysis based on answers
    const experience = userAnswers[0]
    const occasion = userAnswers[1]
    const flavor = userAnswers[2]
    const duration = userAnswers[3]
    const pairing = userAnswers[4]

    // Determine personality type
    let personality = "The Balanced Explorer"
    let description = "You appreciate quality and are open to new experiences while respecting tradition."
    let preferredStrength = "Medium"
    let preferredOrigins = ["Nicaragua", "Dominican Republic"]
    let flavorProfile = "Balanced with complexity"

    if (experience === "new" && flavor === "mild") {
      personality = "The Gentle Discoverer"
      description = "You're beginning your journey and prefer smooth, approachable cigars that welcome newcomers."
      preferredStrength = "Mild to Medium-Mild"
      preferredOrigins = ["Connecticut", "Ecuador"]
      flavorProfile = "Creamy, smooth, with subtle sweetness"
    } else if (experience === "expert" && flavor === "bold") {
      personality = "The Bold Connoisseur"
      description = "You seek complexity and intensity, appreciating the finest nuances in premium tobacco."
      preferredStrength = "Full"
      preferredOrigins = ["Cuba", "Nicaragua"]
      flavorProfile = "Bold, complex, with rich earthy tones"
    } else if (occasion === "contemplative" && flavor === "rich") {
      personality = "The Thoughtful Traditionalist"
      description = "You view cigars as a meditative experience, appreciating craftsmanship and heritage."
      preferredStrength = "Medium-Full"
      preferredOrigins = ["Cuba", "Honduras"]
      flavorProfile = "Rich, earthy, with traditional tobacco notes"
    } else if (occasion === "social" && flavor === "balanced") {
      personality = "The Social Connector"
      description = "You enjoy cigars as a social experience, preferring versatile options that please everyone."
      preferredStrength = "Medium"
      preferredOrigins = ["Dominican Republic", "Nicaragua"]
      flavorProfile = "Well-balanced with universal appeal"
    }

    const recommendations = [
      `Start with ${preferredStrength.toLowerCase()} strength cigars`,
      `Explore cigars from ${preferredOrigins.join(" and ")}`,
      `Look for flavor profiles featuring ${flavorProfile.toLowerCase()}`,
      `Consider pairing with ${pairing === "coffee" ? "coffee or tea" : pairing === "whiskey" ? "whiskey or bourbon" : pairing === "wine" ? "wine or port" : "rum or cognac"}`
    ]

    return {
      personality,
      description,
      recommendations,
      preferredStrength,
      preferredOrigins,
      flavorProfile
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsCompleted(false)
    setResult(null)
  }

  if (isCompleted && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-luxury p-8 text-center"
      >
        <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-10 h-10 text-background-primary" />
        </div>

        <h3 className="font-display text-2xl font-bold text-luxury-gold mb-4">
          {result.personality}
        </h3>

        <p className="text-luxury-body mb-8 max-w-2xl mx-auto">
          {result.description}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-glass p-4">
            <h4 className="font-display text-luxury-gold font-semibold mb-2">Preferred Strength</h4>
            <p className="text-text-secondary">{result.preferredStrength}</p>
          </div>
          <div className="card-glass p-4">
            <h4 className="font-display text-luxury-gold font-semibold mb-2">Recommended Origins</h4>
            <p className="text-text-secondary">{result.preferredOrigins.join(", ")}</p>
          </div>
          <div className="card-glass p-4">
            <h4 className="font-display text-luxury-gold font-semibold mb-2">Flavor Profile</h4>
            <p className="text-text-secondary">{result.flavorProfile}</p>
          </div>
        </div>

        <div className="text-left mb-8">
          <h4 className="font-display text-lg font-semibold text-luxury-gold mb-4">
            Your Personalized Recommendations:
          </h4>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={restartQuiz} className="btn-secondary">
            Retake Quiz
          </button>
          <button className="btn-primary">
            Get My Recommendations
          </button>
        </div>
      </motion.div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="card-luxury p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-muted">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm text-luxury-gold font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-background-accent rounded-full h-2">
          <motion.div
            className="bg-gradient-gold h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-display text-xl font-semibold text-luxury-gold mb-8 text-center">
            {question.question}
          </h3>

          <div className="space-y-4 mb-8">
            {question.options.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full text-left p-6 rounded-luxury-lg border-2 transition-all duration-300 ${
                  answers[currentQuestion] === option.value
                    ? 'border-luxury-gold bg-luxury-gold/10'
                    : 'border-text-muted/20 bg-background-accent hover:border-luxury-gold/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    answers[currentQuestion] === option.value
                      ? 'border-luxury-gold bg-luxury-gold'
                      : 'border-text-muted/50'
                  }`}>
                    {answers[currentQuestion] === option.value && (
                      <div className="w-2 h-2 bg-background-primary rounded-full" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary mb-1">{option.label}</h4>
                    <p className="text-sm text-text-muted">{option.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={!answers[currentQuestion]}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  )
}

export default PersonalityQuiz