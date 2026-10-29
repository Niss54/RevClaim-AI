import type { Metadata } from "next";
import "./globals.css";
import { AuthButton } from "@/components/AuthButton";

export const metadata: Metadata = {
  title: "RevClaim AI | Autonomous Voice-Calling Invoice Recovery Copilot",
  description:
    "AI-powered empathetic debt negotiation, promise-to-pay enforcement, and instant Dodo Payments checkout for freelancers and creative studios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased flex flex-col">
        {/* Hacker House Goa Sponsor Banner */}
        <div className="bg-gradient-to-r from-emerald-600/30 via-indigo-600/30 to-purple-600/30 border-b border-indigo-500/20 px-4 py-2 text-xs flex flex-wrap items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">Hacker House Goa 2026</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Team: Pookie Baddies</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Wispr Flow Voice Dictated
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Dodo Payments MoR
            </span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              viaSocket MCP Connected
            </span>
          </div>
        </div>

        {/* Global Navigation Header */}
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                ⚡
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                  RevClaim <span className="text-indigo-400 text-xs px-2 py-0.5 rounded-md bg-indigo-950 border border-indigo-800 font-mono">AI v1.0</span>
                </h1>
                <p className="text-xs text-slate-400">Autonomous B2B Invoice Recovery Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ElevenLabs Agent: Online
              </span>
              <AuthButton />
              <a
                href="https://github.com/Niss54/RevClaim-AI"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                GitHub Repo
              </a>
            </div>
          </div>
        </header>

        {/* Page Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Built for Hacker House Goa 2026. Zero upfront fees — ₹199 / $5 on recovery only.</span>
            <span className="font-mono text-slate-600">Wispr Flow × Dodo Payments × viaSocket MCP × ElevenLabs</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
