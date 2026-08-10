'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Gift, LogIn, UserPlus, LogOut, User as UserIcon, ListOrdered } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-800 hover:opacity-90 transition">
          <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center text-white shadow-md">
            <Gift className="w-5 h-5" />
          </div>
          <span className="text-base sm:text-lg tracking-tight font-extrabold text-slate-800">ListaCasa</span>
        </Link>

        <div className="flex items-center gap-3">
          {status === 'authenticated' && session?.user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/minhas-listas"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold transition"
              >
                <ListOrdered className="w-4 h-4 text-indigo-600" />
                <span>Minhas Listas</span>
              </Link>

              <div className="hidden md:flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 font-medium">
                <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>{session.user.name || session.user.email}</span>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : status === 'unauthenticated' ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                <span>Entrar</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl gradient-btn text-white text-xs font-semibold shadow-md"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Cadastrar</span>
              </Link>
            </div>
          ) : (
            <div className="h-8 w-20 bg-slate-200 rounded-xl animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}
