import { Radio, Clock, Layers, Star, Settings, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  startupNamesMap: Record<string, string>;
}

export default function Sidebar({
  currentView,
  setView,
  favorites,
  startupNamesMap,
}: SidebarProps) {
  return (
    <aside
      className="hidden md:flex flex-col items-center py-4 space-y-6 bg-surface-container-low text-primary border-r border-outline-variant h-screen sticky top-0 w-16 xl:w-60 transition-all duration-200 select-none"
      id="sidebar-container"
    >
      <div className="mb-4 text-center w-full px-4 flex justify-center xl:justify-start items-center">
        <div
          className="font-serif text-2xl font-bold tracking-tighter text-primary cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setView('dashboard')}
          id="sidebar-logo"
        >
          <span className="xl:hidden">T</span>
          <span className="hidden xl:inline text-lg tracking-widest text-primary font-bold">TERMINAL</span>
        </div>
      </div>

      <nav className="flex flex-col items-center xl:items-start space-y-2 w-full px-2" id="sidebar-nav">
        <button
          onClick={() => setView('dashboard')}
          className={`flex items-center gap-3 w-full p-2.5 rounded-sm transition-all duration-100 ${
            currentView === 'dashboard'
              ? 'bg-primary-container text-on-primary-container font-semibold'
              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          }`}
          title="Live Dashboard"
          id="sidebar-btn-dashboard"
        >
          <Radio className="w-5 h-5 shrink-0" />
          <span className="hidden xl:inline text-xs font-mono tracking-wider font-semibold uppercase">Live Raises</span>
        </button>

        <button
          onClick={() => setView('active-raises')}
          className={`flex items-center gap-3 w-full p-2.5 rounded-sm transition-all duration-100 ${
            currentView === 'active-raises'
              ? 'bg-primary-container text-on-primary-container font-semibold'
              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          }`}
          title="Active Raises Directory"
          id="sidebar-btn-raises"
        >
          <Clock className="w-5 h-5 shrink-0" />
          <span className="hidden xl:inline text-xs font-mono tracking-wider font-semibold uppercase">Active Raises</span>
        </button>

        <button
          onClick={() => setView('admin-directory')}
          className={`flex items-center gap-3 w-full p-2.5 rounded-sm transition-all duration-100 ${
            currentView === 'admin-directory'
              ? 'bg-primary-container text-on-primary-container font-semibold'
              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          }`}
          title="Startup Management Directory"
          id="sidebar-btn-admin"
        >
          <Layers className="w-5 h-5 shrink-0" />
          <span className="hidden xl:inline text-xs font-mono tracking-wider font-semibold uppercase">All Startups</span>
        </button>

        <div className="w-full pt-4 pb-2 px-2 hidden xl:block">
          <div className="border-t border-outline-variant opacity-25 w-full mb-3"></div>
          <span className="text-[10px] text-outline font-semibold tracking-wider font-sans uppercase">Favorites</span>
        </div>

        {favorites.length > 0 ? (
          favorites.map((favId) => (
            <button
              key={favId}
              onClick={() => setView(`profile-${favId}`)}
              className="hidden xl:flex items-center gap-2 w-full px-2.5 py-1.5 text-xs text-on-surface-variant hover:bg-surface-container-highest rounded-sm hover:text-on-surface transition-colors text-left"
              title={`View ${startupNamesMap[favId] || 'Startup'}`}
              id={`fav-btn-${favId}`}
            >
              <Star className="w-3.5 h-3.5 fill-primary text-primary shrink-0" />
              <span className="truncate font-sans font-medium">{startupNamesMap[favId] || favId}</span>
            </button>
          ))
        ) : (
          <div className="hidden xl:block px-2.5 text-[10px] text-on-surface-variant/50 italic font-mono">
            No active favorites.
          </div>
        )}
      </nav>

      <div className="mt-auto pb-4 flex flex-col items-center xl:items-start space-y-4 w-full px-4" id="sidebar-footer">
        <button
          className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-3 w-full p-2.5 hover:bg-surface-container-highest rounded-sm"
          title="System Settings"
          onClick={() => setView('admin-directory')}
          id="sidebar-btn-settings"
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className="hidden xl:inline text-xs font-sans">Settings</span>
        </button>

        <div
          className="flex items-center gap-3 p-1.5 rounded-sm hover:bg-surface-container-highest transition-all duration-100 cursor-pointer w-full text-left"
          onClick={() => setView('admin-directory')}
          id="sidebar-user-block"
        >
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant shrink-0">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeauxGDvjjG7q9Xk8AlyKj8hmeLvrpeuYnKj-WTMQ32yEeSfngoZNw83BMHroVkqcXc2eGOIm8CzNfUPwH7zorun9CoRPo_IYTSqY53ZY2gbwpsClg4TWf6TicTeuzZiBqFHKbC-8JuptSMlerh5cRahVWu8mlK_hR4r-b3L4RVpmtrzRbfv-Vf7ChRdNWolgTZaz3pBZp458K5it8Q7FKTZZHtXYg6nF1EA66iZewTJLXz4q77nrdBXKF83GRBZasaGxXZHp8iavM"
              alt="User Headshot Avatar"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden xl:block overflow-hidden">
            <div className="font-mono text-[10px] font-bold text-on-surface flex items-center gap-1 leading-tight uppercase">
              <span>ADMIN USER</span>
              <ShieldCheck className="w-3 h-3 text-primary" />
            </div>
            <div className="font-sans text-[9px] text-on-surface-variant truncate leading-none mt-0.5">
              admin@sol.terminal
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
