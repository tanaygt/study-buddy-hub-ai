
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: Date;
}

export default function ChatTutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      isUser: false,
      content: "Hello! I'm your AI study tutor. What would you like to learn about today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      isUser: true,
      content: input,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate API call to AI service
      await new Promise(resolve => setTimeout(resolve, 1000));

      const botResponses: Record<string, string> = {
        "python": "Python is a high-level, interpreted programming language known for its readability and versatility. It supports multiple programming paradigms including procedural, object-oriented, and functional programming. Python's syntax allows programmers to express concepts in fewer lines of code than languages like C++ or Java.",
        "loop": "Loops in programming allow you to execute a block of code repeatedly. Common types of loops include:\n\n- For loops: Execute a block of code a fixed number of times\n- While loops: Execute a block as long as a condition is true\n- Do-while loops: Similar to while loops but guarantees at least one execution",
        "photosynthesis": "Photosynthesis is the process by which green plants and certain other organisms transform light energy into chemical energy. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.",
        "history": "History is the study of past events, particularly human affairs. It involves the discovery, collection, organization, and presentation of information about past events. Historians use various sources like documents, oral accounts, and artifacts to study and interpret the past.",
        "math": "Mathematics is the science of structure, order, and relation that has evolved from counting, measuring, and describing the shapes of objects. It deals with logical reasoning and quantitative calculation.",
        "chemistry": "Chemistry is the scientific study of the properties and behavior of matter. It involves the study of atoms, molecules, and their interactions. The field is often divided into organic chemistry, inorganic chemistry, biochemistry, physical chemistry, and analytical chemistry."
      };

      // Find a relevant response based on keywords in the user's message
      const userInput = input.toLowerCase();
      const matchedTopic = Object.keys(botResponses).find(key => userInput.includes(key));
      
      let responseContent = "I'm not sure about that specific topic, but I'd be happy to help if you provide more details or try another subject like math, science, history, or programming!";
      
      if (matchedTopic) {
        responseContent = botResponses[matchedTopic];
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        isUser: false,
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI tutor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="p-4 border-b">
          <CardTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-study-200">AI</AvatarFallback>
            </Avatar>
            AI Study Tutor
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="mb-1">
                  <span className="text-sm font-medium">
                    {msg.isUser ? 'You' : 'Study Buddy AI'}
                  </span>
                </div>
                <div className="space-y-2 whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <Separator />
        <CardFooter className="p-4">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Ask me anything about your studies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? "Thinking..." : "Send"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
