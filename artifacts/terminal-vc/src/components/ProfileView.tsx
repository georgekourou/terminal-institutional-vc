import { useState, FormEvent } from 'react';
import {
  Globe,
  Twitter,
  Users,
  ChevronRight,
  FileText,
  PieChart,
  ShieldAlert,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { Startup } from '../types';

interface ProfileViewProps {
  startup: Startup;
  setView: (view: string) => void;
  onInvest: (id: string, amount: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  showToast?: (message: string, type?: 'info' | 'error' | 'success') => void;
}

export default function ProfileView({
  startup,
  setView,
  onInvest,
  isFavorite,
  onToggleFavorite,
  showToast,
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TEAM' | 'METRICS' | 'DOCUMENTS'>('OVERVIEW');
  const [investmentInput, setInvestmentInput] = useState<string>('15000');
  const [investSuccessMsg, setInvestSuccessMsg] = useState<string | null>(null);

  const formatMoney = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const handleInvestment = (e: FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(investmentInput);
    if (isNaN(amt) || amt <= 0) {
      if (showToast) {
        showToast('ERROR: PLEASE SPECIFY A VALID POSITIVE NUMERICAL AMOUNT.', 'error');
      } else {
        alert('Please specify a valid positive numerical amount.');
      }
      return;
    }
    onInvest(startup.id, amt);
    const msg = `INVESTMENT TRANSACTION OF ${formatMoney(amt)} SUBMITTED TO MAINNET LEDGER!`;
    if (showToast) {
      showToast(msg, 'success');
    }
    setInvestSuccessMsg(msg);
    setTimeout(() => setInvestSuccessMsg(null), 4000);
  };

  const progressPercent = Math.min(100, Math.round((startup.raised / startup.target) * 100));

  return (
    <div className="w-full bg-background relative select-none" id="startup-profile-view">
      <div className="absolute inset-0 terminal-grid-lines opacity-15 pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 relative z-10">

        {/* Breadcrumb */}
        <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            id="back-to-dashboard-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO DASHBOARD
          </button>

          <button
            onClick={() => onToggleFavorite(startup.id)}
            className={`px-3 py-1 text-xs font-mono font-semibold tracking-wider border rounded-sm transition-all cursor-pointer ${
              isFavorite
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-outline-variant text-on-surface-variant hover:border-on-surface-variant'
            }`}
            id="bookmark-favorite-btn"
          >
            {isFavorite ? '★ BOOKMARKED FAVORITE' : '☆ ADD TO FAVORITES'}
          </button>
        </div>

        {/* Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-container-highest border border-outline-variant flex items-center justify-center rounded-sm shrink-0">
                <span className="font-serif text-xl font-bold text-primary">
                  {startup.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-on-surface leading-tight">
                    {startup.name}
                  </h1>
                  <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow"></span>
                    LIVE
                  </span>
                </div>
                <p className="text-on-surface-variant font-mono text-xs tracking-wide mt-1">
                  {startup.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <a
              href={startup.docsUrl}
              className="flex-1 md:flex-none px-3.5 py-2 border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 font-mono text-[10px] font-bold text-on-surface-variant hover:text-on-surface rounded-sm cursor-pointer"
              onClick={(e) => { e.preventDefault(); showToast ? showToast('OPENING DEVELOPER DOCUMENTATION PORTAL...', 'info') : alert('Opening Developer Documentation hub...'); }}
            >
              <Globe className="w-3.5 h-3.5" /> DOCS
            </a>
            <a
              href={startup.twitterUrl}
              className="flex-1 md:flex-none px-3.5 py-2 border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 font-mono text-[10px] font-bold text-on-surface-variant hover:text-on-surface rounded-sm cursor-pointer"
              onClick={(e) => { e.preventDefault(); showToast ? showToast('REDIRECTING TO X / TWITTER FEED...', 'info') : alert('Redirecting to X (formerly Twitter) microblog...'); }}
            >
              <Twitter className="w-3.5 h-3.5" /> X (TWITTER)
            </a>
            <a
              href={startup.discordUrl}
              className="flex-1 md:flex-none px-3.5 py-2 border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 font-mono text-[10px] font-bold text-on-surface-variant hover:text-on-surface rounded-sm cursor-pointer"
              onClick={(e) => { e.preventDefault(); showToast ? showToast('LAUNCHING SECURE DISCORD SERVER INVITE...', 'info') : alert('Launching Discord Server invitation link...'); }}
            >
              <Users className="w-3.5 h-3.5" /> DISCORD
            </a>
          </div>
        </section>

        {/* Bloomberg KPI Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-0 border border-outline-variant bg-surface-container-lowest" id="bloomberg-stats-grid">
          <div className="p-4 border-r border-b lg:border-b-0 border-outline-variant">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant block mb-1">RAISED</span>
            <span className="font-mono text-xl text-primary font-bold">{formatMoney(startup.raised)}</span>
          </div>
          <div className="p-4 border-r border-b lg:border-b-0 border-outline-variant">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant block mb-1">TARGET</span>
            <span className="font-mono text-xl text-on-surface font-bold">{formatMoney(startup.target)}</span>
          </div>
          <div className="p-4 border-r border-b lg:border-b-0 border-outline-variant">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant block mb-1">VALUATION</span>
            <span className="font-mono text-xl text-on-surface font-bold">{formatMoney(startup.valuation)}</span>
          </div>
          <div className="p-4 border-r border-b lg:border-b-0 border-outline-variant">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant block mb-1">EQUITY SOLD</span>
            <span className="font-mono text-xl text-on-surface font-bold">{startup.equitySold}%</span>
          </div>
          <div className="p-4 border-r border-b lg:border-b-0 border-outline-variant">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant block mb-1">MRR (EST)</span>
            <span className="font-mono text-xl text-primary font-bold">{startup.mrr > 0 ? formatMoney(startup.mrr) : 'N/A'}</span>
          </div>
          <div className="p-4 border-r border-b lg:border-b-0 border-outline-variant">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant block mb-1">TVL</span>
            <span className="font-mono text-xl text-on-surface font-bold">{startup.tvl > 0 ? formatMoney(startup.tvl) : 'N/A'}</span>
          </div>
          <div className="p-4 border-r border-b lg:border-b-0 border-outline-variant">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant block mb-1">RUNWAY</span>
            <span className="font-mono text-xl text-on-surface font-bold">{startup.runway} MO</span>
          </div>
          <div className="p-4 border-outline-variant">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant block mb-1">TEAM SIZE</span>
            <span className="font-mono text-xl text-on-surface font-bold">{startup.teamSize}</span>
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Progress & Tabs */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-surface-container p-5 border border-outline-variant">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-lg text-on-surface font-semibold tracking-tight">Raise Progress</h2>
                <span className="font-mono text-primary font-bold text-sm">{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-8 bg-surface-container-lowest border border-outline-variant p-1 mb-4 rounded-sm">
                <div
                  className="h-full bg-primary transition-all duration-1000 rounded-xs"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-outline-variant/30 pt-4">
                <div>
                  <span className="font-mono text-on-surface-variant block text-[10px] font-bold uppercase">PRIVATE ROUND</span>
                  <span className="font-mono text-sm text-on-surface font-bold">{formatMoney(startup.raised * 0.75)}</span>
                </div>
                <div>
                  <span className="font-mono text-on-surface-variant block text-[10px] font-bold uppercase">COMMUNITY</span>
                  <span className="font-mono text-sm text-on-surface font-bold">{formatMoney(startup.raised * 0.25)}</span>
                </div>
                <div>
                  <span className="font-mono text-on-surface-variant block text-[10px] font-bold uppercase">REMAINING</span>
                  <span className="font-mono text-sm text-tertiary font-bold">
                    {startup.target - startup.raised > 0 ? formatMoney(startup.target - startup.raised) : '$0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-b border-outline-variant flex gap-4 overflow-x-auto">
              {(['OVERVIEW', 'TEAM', 'METRICS', 'DOCUMENTS'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 font-mono text-[10px] font-bold border-b-2 tracking-wider transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-surface-container-low border border-outline-variant p-6 min-h-[300px]">
              {activeTab === 'OVERVIEW' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-lg text-on-surface mb-2 font-semibold">Abstract</h3>
                    <p className="text-on-surface-variant font-sans text-sm leading-relaxed">
                      {startup.abstract}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-surface-container-lowest border border-outline-variant p-3.5 rounded-sm">
                      <div
                        className="w-full h-48 bg-cover bg-center mb-3 grayscale hover:grayscale-0 transition-all duration-500 rounded-sm relative group overflow-hidden"
                        style={{
                          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRggP3X5odVlRoVWIIcHG-ohpriRTi2n1miQIaTqEw1tYjExPXV0iwwEv5mT3TF9BFzE8RvOSP7Q5CZ3kvORhWJHCQpYFz_AlF27390Hj9qk1FyPZWEZefJr5A2Ajcwk6VDVUsmnmHoqP0Qmd-VZzGj5GHixfxReiam4Hss1uGqYuSlIO0LoGvrRaMR0n7jtppTo-CGelTdE6dJhac2p8_B-IJdd7eIwYx_XyW9rRcQ8tdpbo5Oh1Uey-3UfEuaWpad0FW03AtS5n4')`,
                        }}
                      >
                        <div className="absolute inset-0 bg-primary/10 opacity-30 group-hover:opacity-0 transition-all"></div>
                      </div>
                      <span className="font-mono text-primary text-[10px] font-bold tracking-widest uppercase">CORE ARCHITECTURE</span>
                      <p className="font-sans text-xs text-on-surface mt-1 leading-relaxed">
                        Multi-threaded SVM orchestration for parallelized transaction execution.
                      </p>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant p-3.5 rounded-sm">
                      <div
                        className="w-full h-48 bg-cover bg-center mb-3 grayscale hover:grayscale-0 transition-all duration-500 rounded-sm relative group overflow-hidden"
                        style={{
                          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLdDrYUhRH6DyBAAr40goT6ND15hwS03vFl-Le8Ib4fpWUj7TbEom5tlqCNJPLvR85ASlCI85RmnMq_ttrqkFfoycrsf-lXRN_kVuL-h5GQ4Cz0vcL1gkIxq0jijzTeaLwNNDSa0q068K64R1yap7Nz5YQKjqkfgW4k4oZZfmTVthILpcJRFmPiP6AmdoAHrLOABbHVOGTmfevDXU3CbyPCBcian9myvWFwRZHWH_N1UIzFOAdBNaY4-JTGfN4DOqe84uCMaqWdsJo')`,
                        }}
                      >
                        <div className="absolute inset-0 bg-primary/10 opacity-30 group-hover:opacity-0 transition-all"></div>
                      </div>
                      <span className="font-mono text-primary text-[10px] font-bold tracking-widest uppercase">PROTOCOL REVENUE</span>
                      <p className="font-sans text-xs text-on-surface mt-1 leading-relaxed">
                        Fee-splitting model structured dynamically between compute nodes and stakers.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'TEAM' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-on-surface mb-2 font-semibold">Leadership & Pedigree</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-surface-container-lowest p-4 border border-outline-variant rounded-sm">
                      <p className="text-sm font-bold text-on-surface">Alex Mercer</p>
                      <p className="text-[10px] text-primary font-mono tracking-wider font-bold uppercase mt-0.5">CHIEF ARCHITECT (EX-JUMP TRADING)</p>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed font-sans">
                        Designed low-latency pipeline structures responsible for managing over $3B in daily SVM derivatives volumes.
                      </p>
                    </div>
                    <div className="bg-surface-container-lowest p-4 border border-outline-variant rounded-sm">
                      <p className="text-sm font-bold text-on-surface">Elena Rostova</p>
                      <p className="text-[10px] text-primary font-mono tracking-wider font-bold uppercase mt-0.5">HEAD OF COMPUTE ENG (EX-SOLANA LABS)</p>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed font-sans">
                        Core compiler developer responsible for initial SVM transaction scheduling and local fee model logic.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'METRICS' && (
                <div className="space-y-4 font-mono text-xs">
                  <h3 className="font-serif text-lg text-on-surface mb-3 font-semibold font-sans">Performance Benchmarks</h3>
                  <div className="space-y-3 bg-surface-container-lowest p-4 border border-outline-variant rounded-sm">
                    <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                      <span className="text-on-surface-variant">Transaction Processing Latency:</span>
                      <span className="text-primary font-bold">{startup.latencyBenchmark || '0.12ms'}</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                      <span className="text-on-surface-variant">Active Compute Node Operators:</span>
                      <span className="text-on-surface font-bold">482 Verified</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                      <span className="text-on-surface-variant">SVM Execution Engine Vol:</span>
                      <span className="text-on-surface font-bold">$12.4M Daily</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Audit Validation Standard:</span>
                      <span className="text-primary font-bold">100% Deterministic ZK-Proof</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'DOCUMENTS' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-on-surface mb-2 font-semibold">Institutional Materials</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border border-outline-variant hover:bg-surface-container-highest transition-colors rounded-sm cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-tertiary-container" />
                        <div>
                          <p className="text-xs font-bold text-on-surface">Main Whitepaper v2.1</p>
                          <p className="text-[10px] text-on-surface-variant font-mono">TECHNICAL DATA PROTOCOL SPECIFICATION</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                    </div>
                    <div className="flex justify-between items-center p-3 border border-outline-variant hover:bg-surface-container-highest transition-colors rounded-sm cursor-pointer">
                      <div className="flex items-center gap-3">
                        <PieChart className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs font-bold text-on-surface">Tokenomics Allocation Deck</p>
                          <p className="text-[10px] text-on-surface-variant font-mono">FINANCIAL AUDIT ARCHITECTURE REPORT</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Deal Score */}
            <div className="bg-surface-container p-5 border border-outline-variant">
              <h2 className="font-mono text-[10px] font-bold text-on-surface-variant mb-4 uppercase tracking-widest">
                DEAL SCORE
              </h2>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-serif text-5xl font-bold text-primary">{Math.round(startup.score)}</span>
                <span className="font-mono text-sm text-on-surface-variant">/ 100</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-mono font-bold mb-1.5 uppercase">
                    <span className="text-on-surface">TRACTION</span>
                    <span className="text-primary">{Math.min(100, Math.round(startup.score * 1.05))}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, startup.score * 1.05)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono font-bold mb-1.5 uppercase">
                    <span className="text-on-surface">TEAM</span>
                    <span className="text-primary">{Math.min(100, Math.round(startup.score * 1.1))}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, startup.score * 1.1)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono font-bold mb-1.5 uppercase">
                    <span className="text-on-surface">TERMS</span>
                    <span className="text-tertiary">{Math.round(startup.score * 0.85)}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary" style={{ width: `${startup.score * 0.85}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono font-bold mb-1.5 uppercase">
                    <span className="text-on-surface">MARKET FIT</span>
                    <span className="text-primary">{Math.round(startup.score * 1.0)}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${startup.score}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-outline-variant/40">
                <p className="font-sans text-xs text-on-surface-variant italic leading-relaxed">
                  "{startup.name} displays exceptional engineering pedigree with core team members representing leading organizations. Market demand is extremely high."
                </p>
              </div>
            </div>

            {/* Investment CTA */}
            <div className="bg-primary text-on-primary p-5 border border-primary relative overflow-hidden rounded-sm shadow-xl shadow-primary/5">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12">
                <Award className="w-32 h-32 text-on-primary" />
              </div>
              <h3 className="font-serif text-lg font-bold mb-1">Participation Active</h3>
              <p className="text-xs opacity-90 mb-4 leading-relaxed">
                Strategic seed round enrollment closing soon. Minimum allocation $5,000 USD / 250 SOL.
              </p>

              {investSuccessMsg ? (
                <div className="bg-on-primary text-primary p-3 rounded-sm text-xs font-mono font-bold border border-primary flex items-center gap-2 animate-pulse">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{investSuccessMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleInvestment} className="space-y-3 relative z-10">
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-primary text-xs font-bold font-mono">USD</span>
                    <input
                      type="number"
                      className="w-full bg-on-primary border-none py-2 pl-12 pr-3 text-primary placeholder:text-primary/50 text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-primary rounded-sm"
                      placeholder="e.g. 25000"
                      value={investmentInput}
                      onChange={(e) => setInvestmentInput(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full bg-on-primary text-primary py-2.5 font-mono text-[11px] font-bold tracking-widest hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer uppercase"
                      id="submit-simulated-investment-btn"
                    >
                      INVEST NOW
                    </button>
                    <button
                      type="button"
                      className="w-full border border-on-primary/30 text-on-primary py-2.5 font-mono text-[11px] font-bold tracking-widest hover:bg-white/10 transition-colors rounded-sm uppercase cursor-pointer"
                      onClick={() => showToast ? showToast('ACCESSING EXTERNAL REGISTRY ON COINLIST SYNDICATE...', 'info') : alert('Accessing external registry on Coinlist syndicate...')}
                    >
                      VIEW ON COINLIST
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Resources */}
            <div className="bg-surface-container-low border border-outline-variant p-5 rounded-sm">
              <h2 className="font-mono text-[10px] font-bold text-on-surface-variant mb-4 uppercase tracking-widest">
                RESOURCES
              </h2>
              <ul className="space-y-2.5">
                <li>
                  <a
                    className="group flex items-center justify-between p-2.5 border border-outline-variant hover:bg-surface-container-highest transition-colors rounded-sm cursor-pointer"
                    href="#"
                    onClick={(e) => { e.preventDefault(); showToast ? showToast('ACCESSING WHITEPAPER DOSSIER...', 'info') : alert('Accessing whitepaper dossier...'); }}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-tertiary-container" />
                      <span className="text-xs font-medium font-sans">Whitepaper v2.1</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
                <li>
                  <a
                    className="group flex items-center justify-between p-2.5 border border-outline-variant hover:bg-surface-container-highest transition-colors rounded-sm cursor-pointer"
                    href="#"
                    onClick={(e) => { e.preventDefault(); showToast ? showToast('ACCESSING TOKEN ALLOCATION ANALYSIS SPREADSHEET...', 'info') : alert('Accessing token allocation analysis spreadsheet...'); }}
                  >
                    <div className="flex items-center gap-2.5">
                      <PieChart className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium font-sans">Tokenomics Deck</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
                <li>
                  <a
                    className="group flex items-center justify-between p-2.5 border border-outline-variant hover:bg-surface-container-highest transition-colors rounded-sm cursor-pointer"
                    href="#"
                    onClick={(e) => { e.preventDefault(); showToast ? showToast('ACCESSING PROTOCOL SAFETY CERTIFICATES BY HALBORN...', 'info') : alert('Accessing protocol safety certificates by Halborn...'); }}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-outline" />
                      <span className="text-xs font-medium font-sans">Audit Reports (Halborn)</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
