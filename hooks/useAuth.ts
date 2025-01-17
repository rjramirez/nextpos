import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set initial session and user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to handle login using an OAuth provider (Google, GitHub, etc.)
  const login = async (provider: 'google' | 'github' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });
    if (error) throw error;
  };

  // Logout the user
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, login, logout };
};
