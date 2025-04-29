
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold gradient-text">AI Study Buddy Hub</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link to="#testimonials" className="text-sm font-medium hover:text-primary">
              Testimonials
            </Link>
            <Link to="#faq" className="text-sm font-medium hover:text-primary">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                    Your <span className="gradient-text">AI-Powered</span> Study Companion
                  </h1>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  Study smarter with our AI-powered platform. Create study groups, get instant help from
                  AI tutors, generate flashcards, and track your progress all in one place.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Log In
                    </Button>
                  </Link>
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-study-500/20 via-study-400/10 to-blue-500/20 border shadow-lg"
              >
                <div className="p-6 h-full flex flex-col justify-center items-center">
                  <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm border">
                    <div className="space-y-2">
                      <div className="bg-study-100 p-2 rounded-lg">
                        <p className="text-sm font-medium text-study-800">AI Tutor</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">Can you explain how photosynthesis works?</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full max-w-sm bg-study-50/90 backdrop-blur-sm rounded-lg p-4 shadow-sm border mt-4">
                    <div className="space-y-2">
                      <div className="bg-study-100 p-2 rounded-lg">
                        <p className="text-sm font-medium text-study-800">Study Buddy AI</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          Photosynthesis is the process where plants convert sunlight, water, and carbon dioxide into oxygen and glucose. The key steps include:
                          <br/><br/>
                          1. Light absorption by chlorophyll
                          <br/>
                          2. Conversion of light energy to chemical energy
                          <br/>
                          3. Using this energy to convert CO₂ to glucose
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-study-50" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-study-100 px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Everything you need to excel</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform combines the power of AI with collaborative tools to help you study more effectively
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
              {[
                {
                  title: "Study Group Chat",
                  description: "Create or join study groups and chat in real-time with other students",
                  icon: "👥"
                },
                {
                  title: "AI Chat Tutor",
                  description: "Get instant help from our AI tutor for any subject",
                  icon: "🤖"
                },
                {
                  title: "Smart Flashcards",
                  description: "Generate AI-powered flashcards to test your knowledge",
                  icon: "🃏"
                },
                {
                  title: "Progress Tracking",
                  description: "Monitor your study habits and improvement over time",
                  icon: "📈"
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-study-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to transform your study habits?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-90">
                  Join thousands of students who are already studying smarter, not harder.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <Link to="/signup">
                  <Button size="lg" className="w-full bg-white text-study-600 hover:bg-study-50">
                    Get Started For Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2025 AI Study Buddy Hub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link to="#" className="text-xs hover:underline underline-offset-4">Terms of Service</Link>
          <Link to="#" className="text-xs hover:underline underline-offset-4">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}
