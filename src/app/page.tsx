"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AuthForm } from "@/components/AuthForm";
import { TodoList } from "@/components/TodoList";
import { Toaster } from "@/components/ui/sonner";
import type { User } from "@supabase/supabase-js";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {user ? <TodoList /> : <AuthForm />}
      <Toaster />
    </>
  );
}
