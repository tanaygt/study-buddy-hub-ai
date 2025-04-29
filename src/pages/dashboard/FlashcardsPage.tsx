
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

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
      // Simulate API call to AI service
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock generated flashcards based on topic
      let generatedCards: Flashcard[] = [];

      if (topic.toLowerCase().includes("javascript")) {
        generatedCards = [
          { id: "1", question: "What is a closure in JavaScript?", answer: "A closure is a function that has access to its own scope, the scope of the outer function, and the global scope.", topic },
          { id: "2", question: "What is the difference between let and var?", answer: "let is block-scoped while var is function-scoped. Variables declared with let cannot be redeclared in the same scope.", topic },
          { id: "3", question: "What is a Promise in JavaScript?", answer: "A Promise is an object representing the eventual completion or failure of an asynchronous operation and its resulting value.", topic },
          { id: "4", question: "What is event bubbling?", answer: "Event bubbling is a type of event propagation where the event first triggers on the innermost target element, and then successively triggers on the ancestors.", topic },
          { id: "5", question: "What is the purpose of the 'this' keyword?", answer: "The 'this' keyword refers to the object it belongs to. In a method, 'this' refers to the owner object. Alone, 'this' refers to the global object.", topic }
        ];
      } else if (topic.toLowerCase().includes("history")) {
        generatedCards = [
          { id: "1", question: "When did World War II begin?", answer: "World War II began on September 1, 1939, with Germany's invasion of Poland.", topic },
          { id: "2", question: "Who was the first President of the United States?", answer: "George Washington was the first President of the United States, serving from 1789 to 1797.", topic },
          { id: "3", question: "What was the Renaissance?", answer: "The Renaissance was a period of European cultural, artistic, political, and economic 'rebirth' that spanned the 14th to the 17th century.", topic },
          { id: "4", question: "When did the Roman Empire fall?", answer: "The Western Roman Empire officially fell in 476 CE when Emperor Romulus Augustulus was deposed by Odoacer.", topic },
          { id: "5", question: "What was the Industrial Revolution?", answer: "The Industrial Revolution was a period of major industrialization and innovation that took place during the late 1700s and early 1800s.", topic }
        ];
      } else if (topic.toLowerCase().includes("biology")) {
        generatedCards = [
          { id: "1", question: "What is photosynthesis?", answer: "Photosynthesis is the process used by plants, algae, and certain bacteria to convert light energy into chemical energy.", topic },
          { id: "2", question: "What is DNA?", answer: "DNA (Deoxyribonucleic Acid) is a molecule composed of two chains that coil around each other to form a double helix carrying genetic instructions.", topic },
          { id: "3", question: "What is cellular respiration?", answer: "Cellular respiration is the process by which cells convert nutrients into ATP, the energy currency of cells.", topic },
          { id: "4", question: "What is natural selection?", answer: "Natural selection is the process through which populations of living organisms adapt and change due to the survival of individuals with favorable traits.", topic },
          { id: "5", question: "What are the main parts of a cell?", answer: "The main parts of a eukaryotic cell include the cell membrane, nucleus, cytoplasm, mitochondria, endoplasmic reticulum, and Golgi apparatus.", topic }
        ];
      } else {
        // Generic cards for any other topic
        generatedCards = [
          { id: "1", question: `What is the definition of ${topic}?`, answer: `This would be filled with a comprehensive definition of ${topic}.`, topic },
          { id: "2", question: `What are the key components of ${topic}?`, answer: `This would list and explain the main elements or concepts related to ${topic}.`, topic },
          { id: "3", question: `Who are the important figures in ${topic}?`, answer: `This would name and describe significant people who contributed to ${topic}.`, topic },
          { id: "4", question: `What is the historical development of ${topic}?`, answer: `This would provide a timeline of how ${topic} evolved over time.`, topic },
          { id: "5", question: `How is ${topic} applied in real-world scenarios?`, answer: `This would explain practical applications and examples of ${topic} in use.`, topic }
        ];
      }

      setFlashcards(generatedCards);
      toast({
        title: "Success",
        description: `Generated ${generatedCards.length} flashcards on ${topic}`,
      });
      setTab("study");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards",
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
