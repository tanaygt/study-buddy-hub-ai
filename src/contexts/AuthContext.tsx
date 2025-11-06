
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    // Check Supabase session
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
          });
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    getSession();

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // Login with Supabase auth
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      // Ensure user has a profile
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (profileError) {
            console.error("Error ensuring profile exists:", profileError);
            // Continue anyway - profile might already exist
          }
        } catch (profileErr) {
          console.error("Profile check error:", profileErr);
          // Continue anyway
        }
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      // Handle specific Supabase errors
      let errorMessage = "Please check your credentials and try again.";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email address before logging in. Check your inbox for a confirmation link.";
      } else if (error.message?.includes("too many requests")) {
        errorMessage = "Too many login attempts. Please wait a moment and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate confirmation token
  const generateConfirmationToken = () => {
    return crypto.randomUUID() + '-' + Date.now().toString(36);
  };

  // Signup with Supabase auth and send confirmation email
  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        // Email confirmation required by Supabase settings
        // Note: Edge function for custom email is optional
        // Supabase will send its own confirmation email if configured
        
        toast({
          title: "Account created successfully!",
          description: "Please check your email and click the confirmation link to activate your account. You can then log in.",
        });
        
        // Don't navigate to dashboard if email confirmation is required
        navigate("/login");
        return;
      }

      // User is automatically confirmed (if Supabase settings allow it)
      if (data.user && data.session) {
        // Ensure profile is created
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (profileError) {
            console.error("Error creating profile:", profileError);
            // Profile might already exist, which is fine
          }
        } catch (profileErr) {
          console.error("Profile creation error:", profileErr);
        }

        toast({
          title: "Account created successfully!",
          description: "Welcome to Study Buddy Hub AI!",
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      // Handle specific Supabase errors
      let errorMessage = "An error occurred during signup. Please try again.";
      
      if (error.message?.includes("already registered")) {
        errorMessage = "This email is already registered. Please try logging in instead.";
      } else if (error.message?.includes("invalid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message?.includes("password")) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout with Supabase auth
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
