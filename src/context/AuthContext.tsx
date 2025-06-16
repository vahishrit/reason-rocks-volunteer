
import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";

type User = {
  id: string;
  email: string;
  full_name?: string;
  grade?: string;
  isAdmin?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signUp: (options: {email: string; password: string; full_name: string; grade: string;}) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          // Fetch user profile data
          try {
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            setUser({
              id: session.user.id,
              email: session.user.email!,
              full_name: profile?.full_name,
              grade: profile?.grade?.toString(),
              isAdmin: profile?.is_admin || false
            });
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser({
              id: session.user.id,
              email: session.user.email!,
              ...session.user.user_metadata
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // This will trigger the auth state change listener above
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const signUp = async ({ email, password, full_name, grade }: { email: string; password: string; full_name: string; grade: string; }) => {
    const redirectUrl = `${window.location.origin}/`;
    
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name, grade }
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
