import React from 'react';
import { Award, ShieldCheck, LogIn, LogOut, Calendar, Home, HelpCircle } from 'lucide-react';
import { AdminUser } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  adminSession: AdminUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  adminSession,
  onOpenLogin,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#0A66C2] transition-colors block leading-tight">
              CITDEVHUB
            </span>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">
              Cauvery Institute of Technology
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Text with subtle hover) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1.5 transition-colors hover:text-[#0A66C2] ${
              currentView === 'home' ? 'text-[#0A66C2] font-semibold' : ''
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onNavigate('events')}
            className={`flex items-center gap-1.5 transition-colors hover:text-[#0A66C2] ${
              currentView === 'events' ? 'text-[#0A66C2] font-semibold' : ''
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Available Events</span>
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`flex items-center gap-1.5 transition-colors hover:text-[#0A66C2] ${
              currentView === 'about' ? 'text-[#0A66C2] font-semibold' : ''
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>About</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {adminSession ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  currentView === 'admin'
                    ? 'bg-[#0A66C2] text-white border-[#0A66C2]'
                    : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                }`}
              >
                Dashboard ({adminSession.name.split(' ')[0]})
              </button>
              <button
                onClick={onLogout}
                title="Sign out of Admin"
                className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#0A66C2] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
