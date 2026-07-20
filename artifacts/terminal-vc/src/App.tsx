import { useState, useEffect, useMemo } from 'react';
import { INITIAL_STARTUPS, Startup } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ProfileView from './components/ProfileView';
import ActiveRaisesView from './components/ActiveRaisesView';
import AdminDirectoryView from './components/AdminDirectoryView';

export default function App() {
  const [startups, setStartups] = useState<Startup[]>(() => {
    const saved = localStorage.getItem('terminal_vc_startups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fall through to seed data
      }
    }
    return INITIAL_STARTUPS;
  });

  const [currentView, setView] = useState<string>('dashboard');

  const [selectedStartup, setSelectedStartup] = useState<Startup>(() => {
    return INITIAL_STARTUPS.find((s) => s.id === 'SOL-1200-A') || INITIAL_STARTUPS[0];
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('terminal_vc_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fall through
      }
    }
    return ['SOL-1200-A', 'SOL-4401-K'];
  });

  const [tps, setTps] = useState<number>(2401);
  const [footerUtcTime, setFooterUtcTime] = useState<string>('TIME: 14:32:01 UTC');

  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'error' | 'success' } | null>(null);

  const showToast = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    localStorage.setItem('terminal_vc_startups', JSON.stringify(startups));
  }, [startups]);

  useEffect(() => {
    localStorage.setItem('terminal_vc_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const ticker = setInterval(() => {
      setTps(Math.floor(2310 + Math.random() * 190));
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      setFooterUtcTime(`TIME: ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`);
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  const startupNamesMap = useMemo(() => {
    return startups.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {} as Record<string, string>);
  }, [startups]);

  const handleSimulatedInvestment = (id: string, amount: number) => {
    setStartups((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updatedRaised = s.raised + amount;
          const updatedStartup = { ...s, raised: updatedRaised };
          if (selectedStartup.id === id) {
            setSelectedStartup(updatedStartup);
          }
          return updatedStartup;
        }
        return s;
      })
    );
  };

  const handleCreateStartup = (newStartup: Startup) => {
    setStartups((prev) => [newStartup, ...prev]);
  };

  const handleDeleteStartup = (id: string) => {
    setStartups((prev) => prev.filter((s) => s.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  };

  const handleToggleStatus = (id: string) => {
    setStartups((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'published' ? 'draft' : s.status === 'draft' ? 'archived' : 'published';
          const updated = { ...s, status: nextStatus as 'published' | 'draft' | 'archived' };
          if (selectedStartup.id === id) {
            setSelectedStartup(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (searchQuery.trim() !== '' && currentView === 'dashboard') {
      setView('active-raises');
    }
  }, [searchQuery, currentView]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface select-none font-sans atmosphere-bg relative">
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <Sidebar
        currentView={currentView}
        setView={setView}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        startupNamesMap={startupNamesMap}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Header
          currentView={currentView}
          setView={setView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          tps={tps}
        />

        <main className="flex-1 overflow-y-auto pb-10 bg-transparent relative flex flex-col">
          {(() => {
            if (currentView.startsWith('profile-')) {
              const profileId = currentView.split('profile-')[1];
              const resolvedStartup = startups.find((s) => s.id === profileId);
              if (resolvedStartup) {
                return (
                  <ProfileView
                    startup={resolvedStartup}
                    setView={setView}
                    onInvest={handleSimulatedInvestment}
                    isFavorite={favorites.includes(resolvedStartup.id)}
                    onToggleFavorite={handleToggleFavorite}
                    showToast={showToast}
                  />
                );
              }
            }

            switch (currentView) {
              case 'dashboard':
                return (
                  <DashboardView
                    startups={startups}
                    setView={setView}
                    onSelectStartup={setSelectedStartup}
                    showToast={showToast}
                  />
                );
              case 'active-raises':
                return (
                  <ActiveRaisesView
                    startups={startups}
                    setView={setView}
                    onSelectStartup={setSelectedStartup}
                    showToast={showToast}
                  />
                );
              case 'admin-directory':
                return (
                  <AdminDirectoryView
                    startups={startups}
                    setView={setView}
                    onSelectStartup={setSelectedStartup}
                    onCreateStartup={handleCreateStartup}
                    onDeleteStartup={handleDeleteStartup}
                    onToggleStatus={handleToggleStatus}
                    showToast={showToast}
                  />
                );
              default:
                return (
                  <DashboardView
                    startups={startups}
                    setView={setView}
                    onSelectStartup={setSelectedStartup}
                    showToast={showToast}
                  />
                );
            }
          })()}
        </main>

        <footer className="mt-auto py-1 px-4 border-t border-outline-variant bg-surface-container-lowest/80 backdrop-blur-md flex justify-between items-center text-[9px] font-mono text-on-surface-variant/70 uppercase tracking-widest h-6 z-25 absolute bottom-0 left-0 right-0 select-none">
          <div className="flex items-center space-x-6">
            <span>© 2026 TERMINAL CORP</span>
            <span className="flex items-center">
              <span className="w-1 h-1 bg-primary rounded-full mr-1.5 animate-pulse-slow"></span>
              SYSTEM SECURE
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{footerUtcTime}</span>
            <span>SESSION: SOL-X992</span>
          </div>
        </footer>
      </div>

      {toast && (
        <div className="fixed bottom-10 right-4 z-50 glass-card px-4 py-3 rounded border border-primary/30 flex items-center space-x-3 shadow-2xl animate-float max-w-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
