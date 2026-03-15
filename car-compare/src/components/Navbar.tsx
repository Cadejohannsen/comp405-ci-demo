"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, User, LogOut } from "lucide-react";
import SettingsPanel from "./SettingsPanel";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-black/10">
      <div className="h-20 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Car<span className="text-accent">Compare</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/search"
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider hover:text-accent transition-colors"
            >
              <Search size={16} />
              Search
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SettingsPanel />
          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-accent text-white px-4 py-2 text-sm font-medium uppercase tracking-wider">
                <User size={16} />
                <span className="hidden md:inline">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-accent text-white px-5 py-2 text-sm font-medium uppercase tracking-wider hover:bg-accent-dark transition-colors"
            >
              <User size={16} />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
