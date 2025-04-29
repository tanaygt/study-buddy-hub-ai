
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  sender: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  isAI?: boolean;
}

export default function StudyGroupPage() {
  const [activeTab, setActiveTab] = useState("join");
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: { name: "Sarah Johnson" },
      content: "Hey everyone! Let's start discussing chapter 5.",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: "2",
      sender: { name: "Michael Chen" },
      content: "I found that section about neural networks particularly challenging. Could someone explain it?",
      timestamp: new Date(Date.now() - 2800000)
    },
    {
      id: "3",
      sender: { name: "Study Buddy AI" },
      content: "Neural networks are computing systems inspired by biological neural networks. They learn to perform tasks by considering examples, generally without being programmed with task-specific rules. Would you like me to explain in more detail?",
      timestamp: new Date(Date.now() - 2600000),
      isAI: true
    }
  ]);

  const mockGroups = [
    { id: "g1", name: "Machine Learning Study Group", code: "ML101" },
    { id: "g2", name: "Biology Finals Prep", code: "BIO999" }
  ];

  const handleJoinGroup = () => {
    if (!groupCode) {
      toast({
        title: "Error",
        description: "Please enter a group code",
        variant: "destructive",
      });
      return;
    }

    const foundGroup = mockGroups.find(g => g.code === groupCode);
    if (foundGroup) {
      setActiveGroup(foundGroup.id);
      toast({
        title: "Success",
        description: `Joined ${foundGroup.name}!`,
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid group code",
        variant: "destructive",
      });
    }
  };

  const handleCreateGroup = () => {
    if (!groupName) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    const newGroupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    toast({
      title: "Group Created",
      description: `Your group code is ${newGroupCode}`,
    });
    setActiveGroup("new-group");
    setGroupName("");
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: { name: "You" },
      content: message,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate AI response
    if (message.toLowerCase().includes("explain") || message.toLowerCase().includes("what is")) {
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now().toString(),
          sender: { name: "Study Buddy AI" },
          content: "I'd be happy to explain that concept! [AI would provide a detailed explanation based on the query]",
          timestamp: new Date(),
          isAI: true
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1500);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!activeGroup ? (
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>Study Group</CardTitle>
            <CardDescription>Join an existing group or create your own</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="join" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="join">Join Group</TabsTrigger>
                <TabsTrigger value="create">Create Group</TabsTrigger>
              </TabsList>
              <TabsContent value="join" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter Group Code</label>
                  <Input 
                    placeholder="Enter code (e.g. ML101)" 
                    value={groupCode} 
                    onChange={(e) => setGroupCode(e.target.value)} 
                  />
                </div>
              </TabsContent>
              <TabsContent value="create" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Group Name</label>
                  <Input 
                    placeholder="e.g. Physics Study Group" 
                    value={groupName} 
                    onChange={(e) => setGroupName(e.target.value)} 
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={activeTab === "join" ? handleJoinGroup : handleCreateGroup}
            >
              {activeTab === "join" ? "Join Group" : "Create Group"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="p-4 border-b">
              <div className="flex justify-between items-center">
                <CardTitle>{activeGroup === "new-group" ? "New Study Group" : mockGroups.find(g => g.id === activeGroup)?.name}</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveGroup(null)}
                  size="sm"
                >
                  Leave Group
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.isAI ? "bg-study-50 p-3 rounded-lg" : ""}`}>
                  <Avatar>
                    <AvatarImage src={msg.sender.avatar} />
                    <AvatarFallback className={msg.isAI ? "bg-study-200" : "bg-primary/20"}>
                      {msg.sender.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium">{msg.sender.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="mt-1">{msg.content}</div>
                  </div>
                </div>
              ))}
            </CardContent>
            <Separator />
            <CardFooter className="p-4">
              <div className="flex w-full gap-2">
                <Input 
                  placeholder="Type your message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
