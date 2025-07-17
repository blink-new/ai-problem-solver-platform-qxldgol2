import { useState } from 'react'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'
import { Card, CardContent } from './components/ui/card'
import { Loader2, Lightbulb, RotateCcw, Sparkles } from 'lucide-react'
import { blink } from './blink/client'

function App() {
  const [problem, setProblem] = useState('')
  const [solution, setSolution] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!problem.trim()) return
    
    setIsLoading(true)
    setSolution('')
    
    try {
      const aiResponse = await blink.ai.generateText({
        prompt: `You are an expert problem solver. Provide a CONCISE, scannable solution to this problem:

"${problem}"

Format your response as:

**Quick Analysis:** (1 sentence max)

**Solution Steps:**
• Step 1: [specific action]
• Step 2: [specific action]  
• Step 3: [specific action]

**Key Tips:**
• [tip 1]
• [tip 2]

Keep it brief, actionable, and easy to scan. Maximum 150 words total.`,
        model: 'gpt-4o-mini',
        maxTokens: 200
      })
      
      setSolution(aiResponse.text)
    } catch (error) {
      console.error('Error generating solution:', error)
      setSolution('Sorry, there was an error generating your solution. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  const clearAll = () => {
    setProblem('')
    setSolution('')
  }

  const exampleProblems = [
    "I'm struggling with time management and constantly missing deadlines",
    "My team has poor communication and projects are falling behind",
    "I want to learn programming but don't know where to start",
    "I'm feeling overwhelmed with work-life balance"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="px-6 py-6 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              AI Problem Solver
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          {!solution && !isLoading && (
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-6">
                <Sparkles className="h-12 w-12 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Describe Your Problem
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The more detail you provide, the better we can help. Include relevant context, 
                what you've already tried, and what outcome you're hoping for.
              </p>
            </div>
          )}

          {/* Problem Input */}
          <Card className="mb-8 shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Describe your problem in detail here..."
                    className="min-h-[120px] text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  {problem && (
                    <button
                      onClick={clearAll}
                      className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <RotateCcw className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Press Cmd/Ctrl + Enter to submit
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!problem.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get Solution
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Problems */}
          {!solution && !isLoading && (
            <div className="mb-12">
              <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                Need inspiration? Try these examples:
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {exampleProblems.map((example, index) => (
                  <Card 
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-blue-300"
                    onClick={() => setProblem(example)}
                  >
                    <CardContent className="p-4">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        "{example}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Analyzing Your Problem
                    </h3>
                    <p className="text-gray-600">
                      Our AI is working on finding the best solution for you...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Solution Display */}
          {solution && !isLoading && (
            <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Lightbulb className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    AI-Generated Solution
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed space-y-4"
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{
                      __html: solution
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 text-lg block mb-3 mt-6">$1</strong>')
                        .replace(/^•\s(.+)$/gm, '<div class="flex items-start space-x-3 mb-2"><span class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span><span class="text-gray-700">$1</span></div>')
                        .replace(/^(\d+\.\s)/gm, '<span class="font-semibold text-blue-600">$1</span>')
                        .replace(/\n\n/g, '</div><div class="mt-4">')
                        .replace(/^/, '<div>')
                        .replace(/$/, '</div>')
                    }}
                  />
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      💡 Generated by AI • Use your judgment for complex issues
                    </div>
                    <Button
                      onClick={clearAll}
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Solve Another Problem
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-gray-50 px-6 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <span className="text-gray-600 font-medium">AI Problem Solver</span>
          </div>
          <p className="text-sm text-gray-500">
            Powered by advanced AI to help you find solutions to any problem
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App