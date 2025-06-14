
import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/utils/supabaseClient";

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
    const session = supabase.auth.getSession();
    session.then(({data: {session}}) => {
      if(session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          ...session.user.user_metadata
        });
      }
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          ...session.user.user_metadata
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => {
      listener.subscription.unsubscribe();
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const signUp = async ({ email, password, full_name, grade }: { email: string; password: string; full_name: string; grade: string; }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
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
