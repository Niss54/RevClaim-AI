"use client";

import React, { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { AuthModal } from "./AuthModal";
import { LogIn, LogOut, User } from "lucide-react";

export function AuthButton() {
  const [user, setUser] = useState<{ email?: string; name?: string; avatar?: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
    }
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-4 h-4 rounded-full" />
            ) : (
              <User className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span className="font-mono text-[11px] truncate max-w-[120px]">{user.name || user.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition active:scale-95 shadow-sm"
        >
          <LogIn className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sign In</span>
        </button>
      )}

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
