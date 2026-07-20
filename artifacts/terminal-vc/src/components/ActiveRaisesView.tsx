import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { Startup } from '../types';

interface ActiveRaisesViewProps {
  startups: Startup[];
  setView: (view: string) => void;
  onSelectStartup: (startup: Startup) => void;
  showToast?: (message: string, type?: 'info' | 'error' | 'success') => void;
}

type SortField = 'name' | 'category' | 'raised' | 'target' | 'percent' | 'valuation' | 'tvl' | 'users' | 'closesIn' | 'score';
type SortOrder = 'asc' | 'desc';

export default function ActiveRaisesView({
  startups,
  setView,
  onSelectStartup,
  showToast: _showToast,
}: ActiveRaisesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Sectors');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All Platforms');
  const [selectedRaiseSize, setSelectedRaiseSize] = useState<string>('Any Amount');
  const [liveOnly, setLiveOnly] = useState<boolean>(true);
  const [localSearch, setLocalSearch] = useState<string>('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<SortField>('raised');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleRowClick = (startup: Startup) => {
    onSelectStartup(startup);
    setView(`profile-${startup.id}`);
  };

  const processedStartups = useMemo(() => {
    let list = [...startups];

    if (localSearch.trim() !== '') {
      const q = localSearch.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }

    if (selectedCategory !== 'All Sectors') {
      list = list.filter((s) => {
        if (selectedCategory === 'Infrastructure') return s.category.toUpperCase().includes('INFRA');
        if (selectedCategory === 'DeFi') return s.category.toUpperCase().includes('DEFI');
        if (selectedCategory === 'AI') return s.category.toUpperCase().includes('AI') || s.category.toUpperCase().includes('DATA');
        return s.category.toUpperCase().includes(selectedCategory.toUpperCase());
      });
    }

    if (selectedPlatform !== 'All Platforms') {
      list = list.filter((s) => s.platform.toUpperCase() === selectedPlatform.toUpperCase());
    }

    if (selectedRaiseSize !== 'Any Amount') {
      if (selectedRaiseSize === '> $1M') list = list.filter((s) => s.raised >= 1000000);
      else if (selectedRaiseSize === '> $5M') list = list.filter((s) => s.raised >= 5000000);
      else if (selectedRaiseSize === '> $10M') list = list.filter((s) => s.raised >= 10000000);
    }

    if (liveOnly) {
      list = list.filter((s) => s.status === 'published');
    }

    list.sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortField) {
        case 'name': valA = a.name.toLowerCase(); valB = b.name.toLowerCase(); break;
        case 'category': valA = a.category.toLowerCase(); valB = b.category.toLowerCase(); break;
        case 'raised': valA = a.raised; valB = b.raised; break;
        case 'target': valA = a.target; valB = b.target; break;
        case 'percent': valA = a.raised / a.target; valB = b.raised / b.target; break;
        case 'valuation': valA = a.valuation; valB = b.valuation; break;
        case 'tvl': valA = a.tvl; valB = b.tvl; break;
        case 'closesIn': valA = a.closesIn; valB = b.closesIn; break;
        case 'score': valA = a.score; valB = b.score; break;
        default: valA = a.raised; valB = b.raised;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [startups, localSearch, selectedCategory, selectedPlatform, selectedRaiseSize, liveOnly, sortField, sortOrder]);

  const totalVolume = useMemo(() => startups.reduce((acc, curr) => acc + curr.raised, 0), [startups]);

  const formatMoney = (val: number) => val.toLocaleString();

  const formatShortMoney = (val: number) => {
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(0)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val.toString();
  };

  return (
    <div className="w-full flex flex-col bg-background relative" id="active-raises-view">

      <div className="p-3 md:hidden border-b border-outline-variant bg-surface-container">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            type="text"
            className="w-full bg-surface-container-low border border-outline-variant py-1.5 pl-9 pr-4 text-xs text-on-surface focus:outline-none focus:border-primary rounded-sm"
            placeholder="Search active raises..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      <header className="sticky top-12 bg-surface-container-lowest z-30 border-b border-outline-variant px-4 py-3">
        <div className="flex flex-wrap items-center gap-4 text-xs">

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">CATEGORY</span>
            <select
              className="bg-surface border border-outline-variant text-[11px] px-2 py-1.5 rounded-sm focus:border-primary outline-none cursor-pointer font-sans"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            >
              <option>All Sectors</option>
              <option>Infrastructure</option>
              <option>DeFi</option>
              <option>Restaking</option>
              <option>AI</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">PLATFORM</span>
            <select
              className="bg-surface border border-outline-variant text-[11px] px-2 py-1.5 rounded-sm focus:border-primary outline-none cursor-pointer font-sans"
              value={selectedPlatform}
              onChange={(e) => { setSelectedPlatform(e.target.value); setCurrentPage(1); }}
            >
              <option>All Platforms</option>
              <option>INTERNAL</option>
              <option>FJORD</option>
              <option>JUP LFG</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">RAISE SIZE</span>
            <select
              className="bg-surface border border-outline-variant text-[11px] px-2 py-1.5 rounded-sm focus:border-primary outline-none cursor-pointer font-sans"
              value={selectedRaiseSize}
              onChange={(e) => { setSelectedRaiseSize(e.target.value); setCurrentPage(1); }}
            >
              <option>Any Amount</option>
              <option>&gt; $1M</option>
              <option>&gt; $5M</option>
              <option>&gt; $10M</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="flex items-center gap-2 cursor-pointer group select-none">
              <div
                onClick={() => { setLiveOnly(!liveOnly); setCurrentPage(1); }}
                className={`relative w-8 h-4 rounded-full transition-colors ${
                  liveOnly ? 'bg-primary' : 'bg-surface-container-highest group-hover:bg-outline-variant'
                }`}
              >
                <div
                  className="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all"
                  style={{ left: liveOnly ? '16px' : '2px' }}
                ></div>
              </div>
              <span className="font-mono text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">LIVE ONLY</span>
            </label>
          </div>

          <div className="ml-auto flex items-center gap-4 text-xs font-mono font-medium text-on-surface-variant">
            <span>
              Total Volume: <span className="text-primary font-bold font-mono">${(totalVolume / 1000000).toFixed(1)}M</span>
            </span>
            <div className="h-4 w-px bg-outline-variant/40 mx-1"></div>
            <span>
              Active Deals: <span className="text-primary font-bold font-mono">{startups.filter(s => s.status === 'published').length}</span>
            </span>
          </div>

        </div>
      </header>

      <div className="overflow-x-auto select-none">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-outline-variant h-10 select-none">
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase sticky left-0 bg-surface-container-lowest z-10 w-48">
                <div onClick={() => handleSort('name')} className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                  Project <ArrowUpDown className="w-3 h-3 text-on-surface-variant/50" />
                </div>
              </th>
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                <div onClick={() => handleSort('category')} className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                  Category <ArrowUpDown className="w-3 h-3 text-on-surface-variant/50" />
                </div>
              </th>
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase text-right">
                <div onClick={() => handleSort('raised')} className="flex items-center justify-end gap-1 cursor-pointer hover:text-primary transition-colors">
                  Raised ($) <ArrowUpDown className="w-3 h-3 text-on-surface-variant/50" />
                </div>
              </th>
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase text-right">
                <div onClick={() => handleSort('target')} className="flex items-center justify-end gap-1 cursor-pointer hover:text-primary transition-colors">
                  Target ($) <ArrowUpDown className="w-3 h-3 text-on-surface-variant/50" />
                </div>
              </th>
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase text-right">
                <div onClick={() => handleSort('percent')} className="flex items-center justify-end gap-1 cursor-pointer hover:text-primary transition-colors">
                  % <ArrowUpDown className="w-3 h-3 text-on-surface-variant/50" />
                </div>
              </th>
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase text-right">
                <div onClick={() => handleSort('valuation')} className="flex items-center justify-end gap-1 cursor-pointer hover:text-primary transition-colors">
                  Valuation ($) <ArrowUpDown className="w-3 h-3 text-on-surface-variant/50" />
                </div>
              </th>
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase text-right">
                <div onClick={() => handleSort('tvl')} className="flex items-center justify-end gap-1 cursor-pointer hover:text-primary transition-colors">
                  TVL <ArrowUpDown className="w-3 h-3 text-on-surface-variant/50" />
                </div>
              </th>
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase text-right">Users</th>
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase text-right">MRR</th>
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">Platform</th>
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                <div onClick={() => handleSort('closesIn')} className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                  Closes In <ArrowUpDown className="w-3 h-3 text-on-surface-variant/50" />
                </div>
              </th>
              <th className="px-4 font-mono text-[10px] font-bold tracking-wider text-on-surface-variant uppercase text-right">
                <div onClick={() => handleSort('score')} className="flex items-center justify-end gap-1 cursor-pointer hover:text-primary transition-colors">
                  Score <ArrowUpDown className="w-3 h-3 text-on-surface-variant/50" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 font-sans text-xs">
            {processedStartups.length > 0 ? (
              processedStartups.map((startup) => {
                const closesSoon = startup.closesIn.toLowerCase().includes('h') && !startup.closesIn.toLowerCase().includes('d');
                return (
                  <tr
                    key={startup.id}
                    onClick={() => handleRowClick(startup)}
                    className="hover:bg-surface-container-high/40 h-10 transition-all cursor-pointer group"
                  >
                    <td className="px-4 sticky left-0 bg-surface/90 backdrop-blur-xs z-10 border-r border-outline-variant/20 group-hover:bg-surface-container-high/80">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-sm bg-primary-container flex items-center justify-center text-[9px] text-on-primary font-mono font-bold uppercase shrink-0">
                          {startup.name.slice(0, 3)}
                        </div>
                        <span className="font-sans font-bold text-on-surface group-hover:text-primary transition-colors">
                          {startup.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 text-[11px] text-on-surface-variant/90 font-medium">{startup.category}</td>
                    <td className="px-4 text-right font-mono font-semibold text-on-surface">{formatMoney(startup.raised)}</td>
                    <td className="px-4 text-right font-mono text-on-surface-variant/80">{formatMoney(startup.target)}</td>
                    <td className="px-4 text-right font-mono font-bold text-primary">{((startup.raised / startup.target) * 100).toFixed(1)}%</td>
                    <td className="px-4 text-right font-mono text-on-surface">{formatShortMoney(startup.valuation)}</td>
                    <td className="px-4 text-right font-mono text-on-surface-variant">{startup.tvl > 0 ? formatShortMoney(startup.tvl) : 'N/A'}</td>
                    <td className="px-4 text-right font-mono text-on-surface-variant">{startup.usersCount || 'N/A'}</td>
                    <td className="px-4 text-right font-mono text-on-surface-variant">{startup.mrr > 0 ? `$${formatShortMoney(startup.mrr)}` : 'N/A'}</td>
                    <td className="px-4">
                      <span className="bg-surface-container border border-outline-variant px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-sm text-on-surface">
                        {startup.platform}
                      </span>
                    </td>
                    <td className={`px-4 text-[11px] font-semibold ${closesSoon ? 'text-tertiary font-mono font-bold' : 'text-on-surface-variant'}`}>
                      {startup.closesIn}
                    </td>
                    <td className="px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5 text-primary">
                        <span className="font-mono font-bold text-xs">{(startup.score / 10).toFixed(1)}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${startup.score >= 80 ? 'bg-primary' : 'bg-tertiary'}`}></div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-on-surface-variant/70 italic font-mono">
                  No active raises matched current search parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="h-10 border-t border-outline-variant px-4 flex items-center justify-between bg-surface-container-lowest sticky bottom-0 select-none">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-on-surface-variant font-mono font-bold uppercase tracking-wider">
            PAGE {currentPage} OF 5
          </span>
          <div className="flex gap-1">
            <button
              className="w-6 h-6 border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant disabled:opacity-20"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              className="w-6 h-6 border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface text-on-surface-variant"
              onClick={() => setCurrentPage(currentPage === 5 ? 1 : currentPage + 1)}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span>Rows per page:</span>
            <select
              className="bg-transparent border-none text-[11px] focus:ring-0 cursor-pointer text-on-surface font-mono font-bold"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            >
              <option className="bg-surface">25</option>
              <option className="bg-surface">50</option>
              <option className="bg-surface">100</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow"></span>
            <span className="text-[9px] font-mono font-bold text-on-surface-variant tracking-wider uppercase">
              LIVE STREAMING ACTIVE
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
