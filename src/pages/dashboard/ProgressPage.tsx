
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for charts
const studyTimeData = [
  { name: 'Mon', minutes: 45 },
  { name: 'Tue', minutes: 60 },
  { name: 'Wed', minutes: 30 },
  { name: 'Thu', minutes: 75 },
  { name: 'Fri', minutes: 90 },
  { name: 'Sat', minutes: 120 },
  { name: 'Sun', minutes: 60 },
];

const quizScoresData = [
  { name: 'Math', score: 85 },
  { name: 'Science', score: 92 },
  { name: 'History', score: 78 },
  { name: 'English', score: 88 },
  { name: 'Programming', score: 95 },
];

const flashcardProgressData = [
  { name: 'JavaScript', total: 25, mastered: 15 },
  { name: 'React', total: 30, mastered: 22 },
  { name: 'Python', total: 20, mastered: 8 },
  { name: 'Biology', total: 15, mastered: 12 },
  { name: 'Chemistry', total: 18, mastered: 5 },
];

const studySessionsData = [
  { date: '2025-04-22', subject: 'Math', duration: 45, notes: 'Reviewed calculus concepts' },
  { date: '2025-04-23', subject: 'Biology', duration: 60, notes: 'Studied cellular respiration' },
  { date: '2025-04-24', subject: 'Programming', duration: 90, notes: 'Practiced React hooks' },
  { date: '2025-04-25', subject: 'History', duration: 30, notes: 'Read about World War II' },
  { date: '2025-04-26', subject: 'English', duration: 45, notes: 'Analyzed Shakespeare\'s Macbeth' },
];

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const totalStudyTime = studyTimeData.reduce((total, day) => total + day.minutes, 0);
  const averageQuizScore = quizScoresData.reduce((total, quiz) => total + quiz.score, 0) / quizScoresData.length;
  const totalFlashcards = flashcardProgressData.reduce((total, subject) => total + subject.total, 0);
  const masteredFlashcards = flashcardProgressData.reduce((total, subject) => total + subject.mastered, 0);
  
  return (
    <div className="container mx-auto">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="studyTime">Study Time</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Total Study Time</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudyTime} minutes</div>
                <p className="text-xs text-muted-foreground">That's {Math.round(totalStudyTime / 60)} hours!</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Avg. Quiz Score</CardTitle>
                <CardDescription>All subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageQuizScore.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">{averageQuizScore >= 80 ? 'Excellent work!' : 'Keep improving!'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Flashcards Mastered</CardTitle>
                <CardDescription>All topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{masteredFlashcards}/{totalFlashcards}</div>
                <p className="text-xs text-muted-foreground">{((masteredFlashcards / totalFlashcards) * 100).toFixed(0)}% completion</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Study Streak</CardTitle>
                <CardDescription>Days in a row</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5 days</div>
                <p className="text-xs text-muted-foreground">Your longest streak: 12 days</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Quiz Performance</CardTitle>
                <CardDescription>Recent quiz scores by subject</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={quizScoresData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#8b5cf6" name="Score (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Recent Study Sessions</CardTitle>
                <CardDescription>Your last 5 study sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studySessionsData.map((session, index) => (
                    <div key={index} className="flex justify-between items-start border-b pb-2 last:border-0">
                      <div>
                        <h4 className="font-medium">{session.subject}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()} • {session.duration} mins
                        </p>
                      </div>
                      <div className="text-xs max-w-[50%] text-right text-muted-foreground">
                        {session.notes}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="studyTime" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Study Time</CardTitle>
              <CardDescription>Minutes spent studying per day</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={studyTimeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="minutes" 
                      stroke="#8b5cf6" 
                      activeDot={{ r: 8 }} 
                      name="Minutes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Distribution</CardTitle>
                <CardDescription>Time spent on each subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { subject: "Math", percentage: 35 },
                    { subject: "Science", percentage: 25 },
                    { subject: "Programming", percentage: 20 },
                    { subject: "English", percentage: 10 },
                    { subject: "History", percentage: 10 },
                  ].map((item) => (
                    <div key={item.subject} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.subject}</span>
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${item.percentage}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Productivity Insights</CardTitle>
                <CardDescription>Your study patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Most productive day</span>
                    <span className="text-sm font-bold">Saturday</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Least productive day</span>
                    <span className="text-sm font-bold">Wednesday</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average daily study time</span>
                    <span className="text-sm font-bold">68 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Study consistency</span>
                    <span className="text-sm font-bold text-green-600">Good</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Weekly goal progress</span>
                    <span className="text-sm font-bold">70% complete</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="flashcards" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flashcard Mastery</CardTitle>
              <CardDescription>Progress across different topics</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={flashcardProgressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#94a3b8" name="Total Cards" />
                    <Bar dataKey="mastered" fill="#8b5cf6" name="Mastered" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Flashcard Practice Sessions</CardTitle>
                <CardDescription>Your recent practice sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "April 28, 2025", topic: "JavaScript", cardsReviewed: 15, accuracy: 87 },
                    { date: "April 26, 2025", topic: "Python", cardsReviewed: 12, accuracy: 75 },
                    { date: "April 25, 2025", topic: "Biology", cardsReviewed: 10, accuracy: 90 },
                    { date: "April 23, 2025", topic: "React", cardsReviewed: 20, accuracy: 80 },
                    { date: "April 21, 2025", topic: "Chemistry", cardsReviewed: 8, accuracy: 62 },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center space-x-4 border-b pb-2 last:border-0">
                      <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center">
                        <span className="text-xl font-medium">{session.accuracy}%</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.topic}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.date} • {session.cardsReviewed} cards reviewed
                        </p>
                      </div>
                      <div className={`text-xs ${
                        session.accuracy >= 80 ? "text-green-600" : 
                        session.accuracy >= 60 ? "text-amber-600" : "text-red-600"
                      }`}>
                        {session.accuracy >= 80 ? "Excellent" : 
                         session.accuracy >= 60 ? "Good" : "Needs Work"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
