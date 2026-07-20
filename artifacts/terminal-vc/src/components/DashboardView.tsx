import { useState } from 'react';
import {
  TrendingUp,
  ArrowRight,
  History,
  BarChart2,
  Gem,
  Rocket,
  Brain,
  Wallet,
  Filter,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Startup, INITIAL_RESEARCH_ITEMS } from '../types';

interface DashboardViewProps {
  startups: Startup[];
  setView: (view: string) => void;
  onSelectStartup: (startup: Startup) => void;
  showToast?: (message: string, type?: 'info' | 'error' | 'success') => void;
}

export default function DashboardView({
  startups,
  setView,
  onSelectStartup,
  showToast,
}: DashboardViewProps) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'DEFI' | 'INFRA' | 'AI'>('ALL');

  const featured = startups.find((s) => s.featured) || startups[0];

  const tableStartups = startups
    .filter((s) => !s.featured && s.status === 'published')
    .filter((s) => {
      if (activeCategoryFilter === 'ALL') return true;
      if (activeCategoryFilter === 'DEFI') return s.category.toUpperCase().includes('DEFI');
      if (activeCategoryFilter === 'INFRA') return s.category.toUpperCase().includes('INFRA');
      if (activeCategoryFilter === 'AI') return s.category.toUpperCase().includes('AI') || s.category.toUpperCase().includes('ML');
      return true;
    })
    .slice(0, 3);

  const handleRowClick = (startup: Startup) => {
    onSelectStartup(startup);
    setView(`profile-${startup.id}`);
  };

  const formatMoney = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto w-full select-none" id="dashboard-view-content">

      {/* Hero Section: Featured Raise */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 border border-outline-variant bg-surface-container-low overflow-hidden group hover:border-primary/40 transition-colors" id="featured-hero-section">
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between min-h-[400px] relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <span className="bg-primary/10 text-primary px-2.5 py-1 text-[10px] tracking-wider font-mono font-bold border border-primary/20">
                FEATURED RAISE
              </span>
              <span className="text-on-surface-variant font-mono text-xs">
                ID: {featured.id}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-on-surface mb-2 font-bold tracking-tight">
              {featured.name.toUpperCase()}
            </h2>
            <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-xl leading-relaxed">
              {featured.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-outline-variant/60 pt-6 mt-6">
            <div>
              <p className="text-[10px] tracking-wider font-mono font-bold text-on-surface-variant mb-1 uppercase">
                FUNDING PROGRESS
              </p>
              <div className="flex items-end space-x-2">
                <span className="font-mono text-xl md:text-2xl text-primary font-bold">
                  {Math.round((featured.raised / featured.target) * 100)}%
                </span>
                <span className="font-mono text-xs text-on-surface-variant mb-1">
                  / {formatMoney(featured.target)}
                </span>
              </div>
              <div className="w-full bg-surface-container-highest h-1 mt-2.5">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${(featured.raised / featured.target) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-wider font-mono font-bold text-on-surface-variant mb-1 uppercase">
                DEAL SCORE
              </p>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xl md:text-2xl text-on-surface font-bold">
                  {featured.score}
                </span>
                <span className="text-primary text-xs flex items-center font-semibold font-mono">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +2.1
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-2 font-medium">
                Tier 1 Institutional Interest
              </p>
            </div>

            <div className="flex flex-col justify-end">
              <button
                onClick={() => handleRowClick(featured)}
                className="bg-primary text-on-primary py-2.5 px-4 font-mono text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                id="view-deal-room-btn"
              >
                <span>VIEW DEAL ROOM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[300px] border-t lg:border-t-0 lg:border-l border-outline-variant overflow-hidden bg-surface-container-lowest">
          <div className="absolute inset-0 terminal-grid-lines opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-surface-container-low pointer-events-none"></div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-64 h-64 border border-primary/20 rounded-full flex items-center justify-center">
              <div className="w-48 h-48 border border-primary/10 rounded-full border-dashed animate-spin" style={{ animationDuration: '40s' }}></div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col items-end text-right">
            <span className="text-[10px] tracking-wider font-mono font-bold text-on-surface-variant uppercase">
              {featured.category}
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant/80 mt-1">
              LATENCY BENCHMARK: {featured.latencyBenchmark || '0.12ms'}
            </span>
          </div>
        </div>
      </section>

      {/* Grid Stats Rows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="dashboard-stats-grid">
        <div className="bg-surface-container border border-outline-variant p-4">
          <div className="flex justify-between items-center mb-4 border-b border-outline-variant/40 pb-2">
            <h3 className="font-mono text-xs font-bold text-on-surface-variant tracking-wider uppercase flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-primary" />
              RECENTLY FUNDED
            </h3>
            <span className="text-[10px] font-mono text-on-surface-variant/50">YTD</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2.5 hover:bg-surface-container-highest transition-colors border border-transparent hover:border-outline-variant rounded-sm">
              <div>
                <p className="text-xs font-bold text-on-surface font-sans">SolanaVM</p>
                <p className="text-[10px] text-on-surface-variant">L2 Scaling Solution</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-primary">$2.1M</p>
                <p className="text-[10px] text-on-surface-variant/70 font-mono uppercase">CLOSED 2H AGO</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2.5 hover:bg-surface-container-highest transition-colors border border-transparent hover:border-outline-variant rounded-sm">
              <div>
                <p className="text-xs font-bold text-on-surface font-sans">Neon Genesis</p>
                <p className="text-[10px] text-on-surface-variant">Gaming Engine</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-primary">$1.5M</p>
                <p className="text-[10px] text-on-surface-variant/70 font-mono uppercase">CLOSED 5H AGO</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container border border-outline-variant p-4">
          <div className="flex justify-between items-center mb-4 border-b border-outline-variant/40 pb-2">
            <h3 className="font-mono text-xs font-bold text-on-surface-variant tracking-wider uppercase flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-primary" />
              LARGEST RAISES
            </h3>
            <span className="text-[10px] font-mono text-on-surface-variant/50">GLOBAL</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2.5 hover:bg-surface-container-highest transition-colors border border-transparent hover:border-outline-variant rounded-sm">
              <div>
                <p className="text-xs font-bold text-on-surface font-sans">Helix Finance</p>
                <p className="text-[10px] text-on-surface-variant">DEX Aggregator</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-on-surface">$12.0M</p>
                <p className="text-[10px] text-on-surface-variant/70 font-mono uppercase">SERIES A</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2.5 hover:bg-surface-container-highest transition-colors border border-transparent hover:border-outline-variant rounded-sm">
              <div>
                <p className="text-xs font-bold text-on-surface font-sans">Pyth Network</p>
                <p className="text-[10px] text-on-surface-variant">Oracle Network</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-on-surface">$8.4M</p>
                <p className="text-[10px] text-on-surface-variant/70 font-mono uppercase">STRATEGIC</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container border border-outline-variant p-4">
          <div className="flex justify-between items-center mb-4 border-b border-outline-variant/40 pb-2">
            <h3 className="font-mono text-xs font-bold text-on-surface-variant tracking-wider uppercase flex items-center gap-1.5">
              <Gem className="w-3.5 h-3.5 text-primary" />
              HIGHEST VALUATION
            </h3>
            <span className="text-[10px] font-mono text-on-surface-variant/50">SVM</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2.5 hover:bg-surface-container-highest transition-colors border border-transparent hover:border-outline-variant rounded-sm">
              <div>
                <p className="text-xs font-bold text-on-surface font-sans">Jito Labs</p>
                <p className="text-[10px] text-on-surface-variant">MEV Infrastructure</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-on-surface">$1.2B</p>
                <p className="text-[10px] text-on-surface-variant/70 font-mono uppercase">UNICORN</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2.5 hover:bg-surface-container-highest transition-colors border border-transparent hover:border-outline-variant rounded-sm">
              <div>
                <p className="text-xs font-bold text-on-surface font-sans">Tensor</p>
                <p className="text-[10px] text-on-surface-variant">NFT Marketplace</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-on-surface">$450M</p>
                <p className="text-[10px] text-on-surface-variant/70 font-mono uppercase">SOON</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Raises Table Section */}
      <section className="bg-surface-container border border-outline-variant overflow-hidden" id="live-raises-table-section">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 className="font-serif text-lg text-on-surface font-semibold tracking-tight">
            LIVE RAISES
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-sm overflow-hidden p-0.5">
              {(['ALL', 'DEFI', 'INFRA', 'AI'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveCategoryFilter(filter)}
                  className={`px-3 py-1 font-mono text-[9px] font-bold rounded-sm transition-all ${
                    activeCategoryFilter === filter
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <button
              className="text-on-surface-variant hover:text-primary transition-colors p-1"
              onClick={() => setView('active-raises')}
              title="Filter and Sort Details"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="text-left py-2 px-4 font-mono text-[10px] text-on-surface-variant tracking-wider uppercase">PROJECT</th>
                <th className="text-left py-2 px-4 font-mono text-[10px] text-on-surface-variant tracking-wider uppercase">CATEGORY</th>
                <th className="text-right py-2 px-4 font-mono text-[10px] text-on-surface-variant tracking-wider uppercase">RAISED / TARGET</th>
                <th className="text-center py-2 px-4 font-mono text-[10px] text-on-surface-variant tracking-wider uppercase">DEAL SCORE</th>
                <th className="text-right py-2 px-4 font-mono text-[10px] text-on-surface-variant tracking-wider uppercase">CLOSES IN</th>
                <th className="text-center py-2 px-4 font-mono text-[10px] text-on-surface-variant tracking-wider uppercase">ACTION</th>
              </tr>
            </thead>
            <tbody className="font-sans text-xs">
              {tableStartups.map((startup) => {
                let CatIcon = Rocket;
                if (startup.category.toUpperCase().includes('AI')) CatIcon = Brain;
                if (startup.category.toUpperCase().includes('DEFI')) CatIcon = Wallet;

                return (
                  <tr
                    key={startup.id}
                    onClick={() => handleRowClick(startup)}
                    className="border-b border-outline-variant/40 hover:bg-surface-container-highest transition-colors cursor-pointer group hover:shadow-[inset_4px_0_0_0_var(--color-primary)]"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-surface-container-lowest border border-outline-variant flex items-center justify-center rounded-sm shrink-0">
                          <CatIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface font-sans text-xs">{startup.name}</p>
                          <p className="text-[9px] text-on-surface-variant font-mono uppercase tracking-wider">{startup.stage}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-surface-container-low border border-outline-variant px-2 py-0.5 text-[9px] text-on-surface-variant font-mono rounded-sm font-semibold tracking-wider">
                        {startup.category.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-mono text-xs">
                        <span className="text-primary font-bold">{formatMoney(startup.raised)}</span>
                        <span className="text-on-surface-variant mx-1">/</span>
                        <span className="text-on-surface font-semibold">{formatMoney(startup.target)}</span>
                      </div>
                      <div className="w-full bg-surface-container-highest h-0.5 mt-1.5 ml-auto max-w-[80px]">
                        <div
                          className="bg-primary h-full"
                          style={{ width: `${Math.min(100, (startup.raised / startup.target) * 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono text-primary bg-primary/5 px-2.5 py-0.5 border border-primary/20 rounded-sm font-bold">
                        {Math.round(startup.score)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-on-surface-variant font-semibold">
                      {startup.closesIn}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Market Intelligence & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" id="market-bento-grid">
        <div className="lg:col-span-3 bg-surface-container border border-outline-variant p-4 relative overflow-hidden">
          <div className="absolute inset-0 terminal-grid-lines opacity-5 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h3 className="font-mono text-[10px] font-bold text-on-surface-variant mb-4 uppercase tracking-widest">
                Macro Trends: Solana VC Inflow
              </h3>
            </div>
            <div className="h-40 w-full flex items-end space-x-2 md:space-x-3 px-2 pt-2">
              <div className="flex-1 bg-primary/10 hover:bg-primary/40 border-t border-primary/25 hover:border-primary transition-all h-[40%] rounded-sm relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant text-[9px] font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-on-surface z-20">$42M</span>
              </div>
              <div className="flex-1 bg-primary/15 hover:bg-primary/40 border-t border-primary/30 hover:border-primary transition-all h-[55%] rounded-sm relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant text-[9px] font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-on-surface z-20">$58M</span>
              </div>
              <div className="flex-1 bg-primary/10 hover:bg-primary/40 border-t border-primary/25 hover:border-primary transition-all h-[45%] rounded-sm relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant text-[9px] font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-on-surface z-20">$49M</span>
              </div>
              <div className="flex-1 bg-primary/25 hover:bg-primary/50 border-t border-primary/40 hover:border-primary transition-all h-[70%] rounded-sm relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant text-[9px] font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-on-surface z-20">$74M</span>
              </div>
              <div className="flex-1 bg-primary/20 hover:bg-primary/40 border-t border-primary/35 hover:border-primary transition-all h-[65%] rounded-sm relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant text-[9px] font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-on-surface z-20">$69M</span>
              </div>
              <div className="flex-1 bg-primary/30 hover:bg-primary/60 border-t border-primary/50 hover:border-primary transition-all h-[85%] rounded-sm relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant text-[9px] font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-on-surface z-20">$91M</span>
              </div>
              <div className="flex-1 bg-primary/40 hover:bg-primary/70 border-t border-primary/60 hover:border-primary transition-all h-[95%] rounded-sm relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant text-[9px] font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-on-surface z-20">$108M</span>
              </div>
              <div className="flex-1 bg-primary/35 hover:bg-primary/60 border-t border-primary/50 hover:border-primary transition-all h-[80%] rounded-sm relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant text-[9px] font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-on-surface z-20">$86M</span>
              </div>
              <div className="flex-1 bg-primary/20 hover:bg-primary/40 border-t border-primary/35 hover:border-primary transition-all h-[60%] rounded-sm relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant text-[9px] font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-on-surface z-20">$64M</span>
              </div>
              <div className="flex-1 bg-primary/30 hover:bg-primary/60 border-t border-primary/45 hover:border-primary transition-all h-[75%] rounded-sm relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant text-[9px] font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-on-surface z-20">$80M</span>
              </div>
            </div>
            <div className="flex justify-between mt-3 font-mono text-[9px] text-on-surface-variant font-semibold tracking-wider">
              <span>JAN 26</span>
              <span>FEB 26</span>
              <span>MAR 26</span>
              <span>APR 26</span>
              <span>MAY 26</span>
              <span>JUN 26</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container border border-outline-variant p-4 flex flex-col justify-between" id="research-block">
          <div>
            <h3 className="font-mono text-[10px] font-bold text-on-surface-variant mb-4 uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              LATEST RESEARCH
            </h3>
            <ul className="space-y-4">
              {INITIAL_RESEARCH_ITEMS.map((item) => (
                <li key={item.id} className="first:pt-0 pt-3 border-t first:border-t-0 border-outline-variant/30">
                  <a className="group block" href="#">
                    <p className="text-xs text-on-surface group-hover:text-primary transition-colors font-sans leading-relaxed line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-[9px] text-on-surface-variant/80 font-mono tracking-wider mt-1.5 font-bold">
                      {item.category} • {item.readTime}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="w-full border border-outline-variant py-2.5 text-[10px] font-mono font-bold text-on-surface-variant hover:text-primary hover:border-primary/40 hover:bg-surface-container-high transition-all mt-4 rounded-sm cursor-pointer"
            onClick={() => showToast ? showToast('ACCESSING INSTITUTIONAL RESEARCH ARCHIVE HUB...') : alert('Accessing Research Archive Hub...')}
          >
            BROWSE ARCHIVE
          </button>
        </div>
      </div>
    </div>
  );
}
