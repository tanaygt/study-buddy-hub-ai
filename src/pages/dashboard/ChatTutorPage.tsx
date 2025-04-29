
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      content: "Hello! I'm your AI study tutor powered by Gemini AI. What would you like to learn about today?",
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
      // Convert messages to history format (excluding the initial greeting)
      const messageHistory = messages.slice(1).map(msg => ({
        isUser: msg.isUser,
        content: msg.content,
      }));

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { 
          message: input,
          history: messageHistory
        }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: Date.now().toString(),
        isUser: false,
        content: data.response || "I'm having trouble understanding that. Could you try rephrasing your question?",
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error("AI response error:", error);
      
      toast({
        title: "Error",
        description: "Failed to get response from AI tutor. Please try again.",
        variant: "destructive",
      });
      
      // Add an error message from the AI
      const errorMessage: Message = {
        id: Date.now().toString(),
        isUser: false,
        content: "I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
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
            Gemini AI Study Tutor
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
