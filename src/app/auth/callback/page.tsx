"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = getSupabase();
      if (!supabase) {
        setStatus("error");
        setErrorMessage("Supabase client is not configured.");
        return;
      }

      // Check if error was passed in URL query
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      if (errorParam) {
        setStatus("error");
        setErrorMessage(errorDescription || errorParam);
        return;
      }

      // Check for code exchange (PKCE)
      const code = searchParams.get("code");
      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setStatus("error");
            setErrorMessage(error.message);
            return;
          }
        } catch (err: any) {
          setStatus("error");
          setErrorMessage(err.message || "Failed to exchange authorization code.");
          return;
        }
      }

      // Verify current session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setStatus("success");
        const nextUrl = searchParams.get("next") || "/";
        setTimeout(() => {
          router.replace(nextUrl);
        }, 1000);
      } else {
        // Fallback: check onAuthStateChange event
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            setStatus("success");
            const nextUrl = searchParams.get("next") || "/";
            setTimeout(() => {
              router.replace(nextUrl);
            }, 800);
          }
        });

        // Timeout fallback after 3 seconds if no session
        setTimeout(() => {
          if (status === "loading") {
            router.replace("/");
          }
        }, 3000);

        return () => {
          authListener.subscription.unsubscribe();
        };
      }
    };

    handleAuthCallback();
  }, [router, searchParams, status]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-white">Authenticating with Provider</h2>
            <p className="text-xs text-slate-400">
              Verifying your GitHub / Google session and establishing secure access...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">Login Successful!</h2>
            <p className="text-xs text-slate-400">
              Redirecting you to your RevClaim AI recovery copilot dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">Authentication Failed</h2>
            <p className="text-xs text-rose-300 bg-rose-950/50 p-3 rounded-lg border border-rose-900/60 font-mono">
              {errorMessage}
            </p>
            <button
              onClick={() => router.replace("/")}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
