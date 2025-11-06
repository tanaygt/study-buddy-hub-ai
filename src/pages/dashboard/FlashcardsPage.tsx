
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { generateFlashcards } from "@/lib/gemini";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic: string;
}

export default function FlashcardsPage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [numCards, setNumCards] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [activeCard, setActiveCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [tab, setTab] = useState("create");

  // Mock flashcard topics
  const sampleTopics = ["JavaScript Basics", "World History", "Biology 101"];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const count = parseInt(numCards) || 5;
      const generatedFlashcards = await generateFlashcards(topic, count);
      
      const generatedCards: Flashcard[] = generatedFlashcards.map((card, index) => ({
        id: (index + 1).toString(),
        question: card.question,
        answer: card.answer,
        topic: topic,
      }));

      setFlashcards(generatedCards);
      toast({
        title: "Success",
        description: `Generated ${generatedCards.length} flashcards on ${topic} using Gemini AI`,
      });
      setTab("study");
    } catch (error: any) {
      console.error("Error generating flashcards:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startStudySession = (cards: Flashcard[]) => {
    if (cards.length === 0) {
      toast({
        title: "No flashcards",
        description: "Generate some flashcards first",
        variant: "destructive",
      });
      return;
    }

    setActiveCard(cards[0]);
    setShowAnswer(false);
    setTab("study");
  };

  const nextCard = () => {
    if (!activeCard) return;
    
    const currentIndex = flashcards.findIndex(card => card.id === activeCard.id);
    const nextIndex = (currentIndex + 1) % flashcards.length;
    setActiveCard(flashcards[nextIndex]);
    setShowAnswer(false);
  };

  const prevCard = () => {
    if (!activeCard) return;
    
    const currentIndex = flashcards.findIndex(card => card.id === activeCard.id);
    const prevIndex = currentIndex === 0 ? flashcards.length - 1 : currentIndex - 1;
    setActiveCard(flashcards[prevIndex]);
    setShowAnswer(false);
  };

  return (
    <div className="container mx-auto">
      <Tabs defaultValue="create" value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Generate Flashcards</CardTitle>
              <CardDescription>
                Enter a topic and our AI will create customized flashcards for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., JavaScript Basics, World History, Biology 101"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numCards">Number of cards</Label>
                <Input
                  id="numCards"
                  type="number"
                  min="1"
                  max="20"
                  value={numCards}
                  onChange={(e) => setNumCards(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating} 
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Flashcards"}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Recent Topics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleTopics.map((sampleTopic) => (
                <Card key={sampleTopic} className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{sampleTopic}</CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => {
                        setTopic(sampleTopic);
                        handleGenerate();
                      }}
                    >
                      Load Topic
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="study" className="mt-6">
          {activeCard ? (
            <div className="max-w-2xl mx-auto">
              <Card className="h-80 flex flex-col">
                <CardContent className="flex-1 flex items-center justify-center p-6 text-center">
                  <div className="space-y-4 w-full">
                    {!showAnswer ? (
                      <>
                        <h3 className="text-sm text-muted-foreground">{activeCard.topic}</h3>
                        <h2 className="text-2xl font-bold">{activeCard.question}</h2>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowAnswer(true)}
                          className="mt-4"
                        >
                          Show Answer
                        </Button>
                      </>
                    ) : (
                      <>
                        <h3 className="text-sm text-muted-foreground">{activeCard.topic}</h3>
                        <div className="bg-study-50 p-4 rounded-lg">
                          <p className="text-lg">{activeCard.answer}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4 flex justify-between">
                  <Button variant="outline" onClick={prevCard}>Previous</Button>
                  <div className="text-sm text-muted-foreground">
                    {flashcards.findIndex(card => card.id === activeCard.id) + 1} of {flashcards.length}
                  </div>
                  <Button variant="outline" onClick={nextCard}>Next</Button>
                </CardFooter>
              </Card>
            </div>
          ) : flashcards.length > 0 ? (
            <div className="text-center">
              <Button onClick={() => startStudySession(flashcards)}>
                Start Studying
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No flashcards available. Generate some first!</p>
              <Button onClick={() => setTab("create")}>Create Flashcards</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
