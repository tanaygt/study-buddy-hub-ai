import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface StudyGroup {
  id: string;
  name: string;
  code: string;
  created_by?: string;
}

export default function StudyGroupPage() {
  const [activeTab, setActiveTab] = useState("join");
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [activeGroup, setActiveGroup] = useState<StudyGroup | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<StudyGroup[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Fetch joined groups when component mounts
  useEffect(() => {
    if (user) {
      fetchJoinedGroups();
    }
  }, [user]);

  // Fetch messages when active group changes and set up real-time subscription
  useEffect(() => {
    if (activeGroup) {
      fetchGroupMessages();
      
      // Set up real-time subscription for new messages
      const channel = supabase
        .channel(`group_messages:${activeGroup.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'group_messages',
            filter: `group_id=eq.${activeGroup.id}`,
          },
          (payload) => {
            const newMessage = payload.new;
            // Only add if it's not from the current user (to avoid duplicates from optimistic updates)
            if (newMessage.sender_id !== user?.id) {
              const formattedMessage: Message = {
                id: newMessage.id,
                sender: { 
                  name: "User"
                },
                content: newMessage.content || "",
                timestamp: new Date(newMessage.created_at || Date.now()),
                isAI: false
              };
              setMessages(prev => [...prev, formattedMessage]);
            } else {
              // Refresh to get the properly formatted message
              fetchGroupMessages();
            }
          }
        )
        .subscribe();

      // Cleanup subscription when group changes or component unmounts
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeGroup, user]);

  const fetchJoinedGroups = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          groups (
            id,
            name,
            code
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data) {
        const groups = data.map(item => ({
          id: item.groups?.id || "",
          name: item.groups?.name || "",
          code: item.groups?.code || ""
        }));
        
        setJoinedGroups(groups);
      }
    } catch (error: any) {
      console.error("Error fetching groups:", error.message);
    }
  };

  const fetchGroupMessages = async () => {
    if (!activeGroup) return;
    
    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select(`
          id, 
          content, 
          created_at, 
          sender_id
        `)
        .eq('group_id', activeGroup.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          sender: { 
            name: msg.sender_id === user?.id ? "You" : "User"
          },
          content: msg.content || "",
          timestamp: new Date(msg.created_at || Date.now()),
          isAI: false
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error: any) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupCode) {
      toast({
        title: "Error",
        description: "Please enter a group code",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to join a group",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if group exists
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('id, name, code')
        .eq('code', groupCode)
        .single();
      
      if (groupError || !groupData) {
        toast({
          title: "Error",
          description: "Invalid group code",
          variant: "destructive",
        });
        return;
      }

      // Check if user is already a member
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupData.id)
        .eq('user_id', user.id)
        .single();
      
      if (!memberError && memberData) {
        // User is already a member
        const group = {
          id: groupData.id,
          name: groupData.name,
          code: groupData.code
        };
        
        setActiveGroup(group);
        toast({
          title: "Success",
          description: `Joined ${groupData.name}!`,
        });
        return;
      }

      // Add user to group
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id
        });
      
      if (joinError) throw joinError;

      const group = {
        id: groupData.id,
        name: groupData.name,
        code: groupData.code
      };
      
      setActiveGroup(group);
      await fetchJoinedGroups();
      
      toast({
        title: "Success",
        description: `Joined ${groupData.name}!`,
      });
    } catch (error: any) {
      console.error("Error joining group:", error.message);
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      });
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a group",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate a unique code (6 characters, uppercase alphanumeric)
      const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const newGroupCode = generateCode();
      
      // Create the group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupName,
          code: newGroupCode,
          created_by: user.id
        })
        .select('id, name, code')
        .single();
      
      if (groupError || !groupData) throw groupError;

      // Add creator as a member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id
        });
      
      if (memberError) throw memberError;

      const newGroup = {
        id: groupData.id,
        name: groupData.name,
        code: groupData.code
      };
      
      setActiveGroup(newGroup);
      await fetchJoinedGroups();
      setGroupName("");
      
      toast({
        title: "Group Created",
        description: `Your group code is ${newGroupCode}`,
      });
    } catch (error: any) {
      console.error("Error creating group:", error.message);
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeGroup || !user) return;

    try {
      const { error } = await supabase
        .from('group_messages')
        .insert({
          group_id: activeGroup.id,
          sender_id: user.id,
          content: message
        });
      
      if (error) throw error;
      
      // Optimistic update
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: { name: "You" },
        content: message,
        timestamp: new Date()
      };

      setMessages([...messages, newMessage]);
      setMessage("");
      
      // Refresh messages to get the properly formatted one from the database
      fetchGroupMessages();
    } catch (error: any) {
      console.error("Error sending message:", error.message);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleSelectGroup = (group: StudyGroup) => {
    setActiveGroup(group);
  };

  const handleLeaveGroup = async () => {
    if (!activeGroup || !user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', activeGroup.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setActiveGroup(null);
      await fetchJoinedGroups();
      
      toast({
        title: "Success",
        description: "You left the group",
      });
    } catch (error: any) {
      console.error("Error leaving group:", error.message);
      toast({
        title: "Error",
        description: "Failed to leave group",
        variant: "destructive",
      });
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
                    placeholder="Enter code (e.g. ABC123)" 
                    value={groupCode} 
                    onChange={(e) => setGroupCode(e.target.value.toUpperCase())} 
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

            {joinedGroups.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Your Groups</h3>
                <div className="space-y-2">
                  {joinedGroups.map(group => (
                    <Button 
                      key={group.id} 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => handleSelectGroup(group)}
                    >
                      {group.name}
                      <span className="ml-auto text-xs opacity-70">Code: {group.code}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
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
                <CardTitle>{activeGroup.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground hidden sm:block">
                    Code: {activeGroup.code}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleLeaveGroup}
                    size="sm"
                  >
                    Leave Group
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <p>No messages yet.</p>
                    <p className="text-sm">Be the first to send a message!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.isAI ? "bg-muted p-3 rounded-lg" : ""}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.sender.avatar} />
                      <AvatarFallback className={msg.isAI ? "bg-primary/20" : "bg-secondary"}>
                        {msg.sender.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-medium text-sm">{msg.sender.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="mt-1 text-sm">{msg.content}</div>
                    </div>
                  </div>
                ))
              )}
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
