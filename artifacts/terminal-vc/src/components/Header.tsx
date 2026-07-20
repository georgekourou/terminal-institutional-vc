import { Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tps: number;
}

export default function Header({
  currentView,
  setView,
  searchQuery,
  setSearchQuery,
  tps,
}: HeaderProps) {
  return (
    <header className="flex justify-between items-center w-full px-4 h-12 z-40 sticky top-0 bg-surface-container-lowest border-b border-outline-variant select-none">
      <div className="flex items-center gap-6 md:gap-8 flex-1">
        <h1
          className="font-serif text-primary tracking-tighter text-xl font-bold cursor-pointer hover:opacity-85 transition-opacity"
          onClick={() => setView('dashboard')}
          id="header-logo"
        >
          TERMINAL
        </h1>

        <div className="relative w-full max-w-xs md:max-w-sm group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            type="text"
            className="w-full bg-surface-container-low border border-outline-variant rounded-sm py-1 pl-9 pr-8 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            placeholder="Search projects, categories, or founders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="global-search-input"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-0.5 opacity-40 pointer-events-none text-[9px] font-mono">
            <span className="border border-outline-variant px-1 rounded">CMD</span>
            <span className="border border-outline-variant px-1 rounded">K</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-6 text-sm h-full font-sans pt-1">
          <button
            onClick={() => setView('dashboard')}
            className={`transition-colors relative pb-3 mt-2 ${
              currentView === 'dashboard'
                ? 'text-primary font-semibold border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            id="nav-tab-live"
          >
            Live
          </button>
          <button
            onClick={() => setView('active-raises')}
            className={`transition-colors relative pb-3 mt-2 ${
              currentView === 'active-raises'
                ? 'text-primary font-semibold border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            id="nav-tab-active-raises"
          >
            Active Raises
          </button>
          <button
            onClick={() => setView('admin-directory')}
            className={`transition-colors relative pb-3 mt-2 ${
              currentView === 'admin-directory'
                ? 'text-primary font-semibold border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            id="nav-tab-admin"
          >
            Directory (Admin)
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-on-surface-variant" id="tps-indicator">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow"></span>
          <span className="uppercase tracking-wider hidden sm:inline">Solana Mainnet:</span>
          <span className="text-primary font-semibold">{tps.toLocaleString()} TPS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded-sm relative"
            title="Notifications"
            id="notifications-btn"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-tertiary rounded-full"></span>
          </button>
          <button
            onClick={() => setView('admin-directory')}
            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded-sm"
            title="Admin User Profile"
            id="profile-btn"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
