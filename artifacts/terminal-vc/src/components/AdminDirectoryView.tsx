import { useState, MouseEvent } from 'react';
import {
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  X,
  UploadCloud,
  BadgeCheck,
  Building,
} from 'lucide-react';
import { Startup } from '../types';

interface AdminDirectoryViewProps {
  startups: Startup[];
  setView: (view: string) => void;
  onSelectStartup: (startup: Startup) => void;
  onCreateStartup: (newStartup: Startup) => void;
  onDeleteStartup: (id: string) => void;
  onToggleStatus: (id: string) => void;
  showToast?: (message: string, type?: 'info' | 'error' | 'success') => void;
}

export default function AdminDirectoryView({
  startups,
  setView,
  onSelectStartup,
  onCreateStartup,
  onDeleteStartup,
  onToggleStatus,
  showToast,
}: AdminDirectoryViewProps) {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeActionsRow, setActiveActionsRow] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('DeFi Infrastructure');
  const [formDescription, setFormDescription] = useState('');
  const [formAbstract, setFormAbstract] = useState('');
  const [formTarget, setFormTarget] = useState('5000000');
  const [formValuation, setFormValuation] = useState('50000000');
  const [formEquity, setFormEquity] = useState('10');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formTrending, setFormTrending] = useState(true);
  const [formStage, setFormStage] = useState('Series A');

  const filteredList = startups.filter((s) => {
    if (statusFilter === 'ALL') return true;
    return s.status.toUpperCase() === statusFilter;
  });

  const handleRowClick = (startup: Startup, e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('.actions-trigger-btn')) return;
    onSelectStartup(startup);
    setView(`profile-${startup.id}`);
  };

  const handleCreateSubmit = (status: 'draft' | 'published') => {
    if (!formName.trim()) {
      if (showToast) {
        showToast('ERROR: PROJECT NAME IS A REQUIRED FIELD.', 'error');
      } else {
        alert('Project Name is a required field.');
      }
      return;
    }

    const newId = `SOL-${Math.floor(1000 + Math.random() * 9000)}-X`;
    const newProject: Startup = {
      id: newId,
      name: formName,
      description: formDescription || 'Innovative institutional technology layer engineered for the modern Solana blockchain ecosystem.',
      category: formCategory.toUpperCase(),
      stage: formStage,
      status,
      raised: status === 'published' ? 250000 : 0,
      target: parseFloat(formTarget) || 5000000,
      valuation: parseFloat(formValuation) || 50000000,
      equitySold: parseFloat(formEquity) || 10,
      mrr: status === 'published' ? 5000 : 0,
      tvl: 0,
      runway: 18,
      teamSize: 4,
      score: 75 + Math.floor(Math.random() * 20),
      closesIn: '30D : 00H',
      platform: 'INTERNAL',
      featured: formFeatured,
      trending: formTrending,
      abstract: formAbstract || 'Technical ledger enrollment and decentralized execution layer addressing infrastructure scalability constraints.',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2uxQBMytgBsy-vHLefyQdko6YvfI2TFTWpP6mcBTJ_AhBsY-2DYH-XxKBVjp3yb3Oqh7vsPCc9Mcdjm1WJPt1O6JePUyJtKrFLZ5n-5RzG_1-ca5bKyvqNYrDz1Ous0eTDDDmA4HmeC2aMRp_fGz3X6m3ICKAgCQkCrm5fzKeUdASMcJMbvP05-lRPVpYf6XLOlSYZy6D8UfJOEAzc5GKgUUkgIA6PsypmWnxZ4lCKQRcyWSWbxPTBrJemNIWYA8jV-S6mgzyZL2h',
      docsUrl: '#',
      twitterUrl: '#',
      discordUrl: '#',
    };

    onCreateStartup(newProject);
    setShowCreateModal(false);
    if (showToast) {
      showToast(`SUCCESS: ENROLLED LEDGER RECORD FOR ${newProject.name.toUpperCase()} (${newProject.id})`, 'success');
    }

    setFormName('');
    setFormDescription('');
    setFormAbstract('');
    setFormTarget('5000000');
    setFormValuation('50000000');
    setFormEquity('10');
    setFormFeatured(false);
    setFormTrending(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-background relative overflow-hidden select-none" id="admin-directory-view">

      <header className="flex justify-between items-center w-full px-4 md:px-6 h-12 z-30 border-b border-outline-variant bg-surface-container-lowest select-none">
        <div className="flex items-center space-x-4">
          <span className="text-xs text-on-surface-variant font-mono uppercase tracking-wider">ADMIN CONTROL TERMINAL</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-on-primary font-mono text-[10px] font-bold px-3.5 h-8 flex items-center space-x-1.5 rounded-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            id="open-create-modal-btn"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>CREATE NEW STARTUP</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-on-surface">Startup Directory</h1>
            <p className="text-on-surface-variant text-xs font-mono mt-1">Manage institutional access and data integrity for Solana ecosystem projects.</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-surface-container rounded-sm p-0.5 border border-outline-variant select-none">
              {(['ALL', 'DRAFT', 'PUBLISHED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1 font-mono text-[9px] font-bold rounded-sm transition-all ${
                    statusFilter === filter
                      ? 'bg-surface-container-highest text-primary font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="admin-stats-summary-grid">
          <div className="bg-surface-container p-4 border border-outline-variant">
            <div className="text-on-surface-variant font-mono text-[10px] font-bold mb-2 uppercase tracking-wider">TOTAL RAISED (YTD)</div>
            <div className="font-mono text-lg md:text-xl text-primary font-bold">$412.8M</div>
          </div>
          <div className="bg-surface-container p-4 border border-outline-variant">
            <div className="text-on-surface-variant font-mono text-[10px] font-bold mb-2 uppercase tracking-wider">ACTIVE ROUNDS</div>
            <div className="font-mono text-lg md:text-xl text-on-surface font-bold">24</div>
          </div>
          <div className="bg-surface-container p-4 border border-outline-variant">
            <div className="text-on-surface-variant font-mono text-[10px] font-bold mb-2 uppercase tracking-wider">PENDING REVIEW</div>
            <div className="font-mono text-lg md:text-xl text-tertiary font-bold">08</div>
          </div>
          <div className="bg-surface-container p-4 border border-outline-variant">
            <div className="text-on-surface-variant font-mono text-[10px] font-bold mb-2 uppercase tracking-wider">TPS AVG (ECOSYSTEM)</div>
            <div className="font-mono text-lg md:text-xl text-on-surface font-bold">3,421</div>
          </div>
        </div>

        <div className="bg-surface-container border border-outline-variant overflow-hidden" id="admin-table-container">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-high border-b border-outline-variant">
              <tr className="select-none h-10">
                <th className="px-4 py-2.5 font-mono text-[10px] text-outline font-bold uppercase tracking-wider">PROJECT</th>
                <th className="px-4 py-2.5 font-mono text-[10px] text-outline font-bold uppercase tracking-wider hidden md:table-cell">STAGE</th>
                <th className="px-4 py-2.5 font-mono text-[10px] text-outline font-bold uppercase tracking-wider">STATUS</th>
                <th className="px-4 py-2.5 font-mono text-[10px] text-outline font-bold uppercase tracking-wider text-right">VALUATION</th>
                <th className="px-4 py-2.5 font-mono text-[10px] text-outline font-bold uppercase tracking-wider text-right hidden sm:table-cell">DATE ADDED</th>
                <th className="px-4 py-2.5 font-mono text-[10px] text-outline font-bold uppercase tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/35 font-sans text-xs">
              {filteredList.map((startup) => (
                <tr
                  key={startup.id}
                  onClick={(e) => handleRowClick(startup, e)}
                  className="hover:bg-surface-container-highest/50 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-surface-container-lowest border border-outline-variant flex items-center justify-center p-1 rounded-sm shrink-0">
                        <img
                          className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all"
                          src={startup.logoUrl}
                          alt="Logo Asset"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-sans font-bold text-on-surface flex items-center gap-1">
                          <span>{startup.name}</span>
                          {startup.score >= 90 && (
                            <BadgeCheck className="w-3.5 h-3.5 text-primary">
                              <title>Top Tier Sovereign Project</title>
                            </BadgeCheck>
                          )}
                        </div>
                        <div className="text-[9px] text-on-surface-variant font-mono uppercase tracking-wider">
                          {startup.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="font-sans font-medium text-on-surface">{startup.stage}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(startup.id);
                      }}
                      className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider rounded-sm cursor-pointer select-none border transition-colors ${
                        startup.status === 'published'
                          ? 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10'
                          : startup.status === 'draft'
                          ? 'bg-surface-container-highest text-on-surface border-outline-variant hover:bg-surface-container-high'
                          : 'bg-error/5 text-error border-error/20 hover:bg-error/10'
                      }`}
                    >
                      {startup.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-on-surface text-sm">
                    ${(startup.valuation / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <div className="text-[10px] font-mono text-on-surface-variant font-semibold">OCT 12, 2024</div>
                  </td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionsRow(activeActionsRow === startup.id ? null : startup.id);
                      }}
                      className="actions-trigger-btn p-1.5 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-high rounded-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeActionsRow === startup.id && (
                      <div className="absolute right-4 top-10 w-28 bg-surface-container border border-outline-variant rounded-sm shadow-xl z-50 py-1 text-left font-sans text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(startup.id);
                            setActiveActionsRow(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-surface-container-high hover:text-primary transition-colors"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you absolutely certain you want to purge this record from mainnet VC ledger?')) {
                              onDeleteStartup(startup.id);
                            }
                            setActiveActionsRow(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-error/10 hover:text-error text-error font-medium transition-colors border-t border-outline-variant/30 mt-1"
                        >
                          Purge/Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-4 py-3 border-t border-outline-variant bg-surface-container-low flex justify-between items-center select-none h-10">
            <div className="text-[10px] text-on-surface-variant font-mono font-bold uppercase tracking-wider">
              Showing {filteredList.length} of {startups.length} Projects in Ledger
            </div>
            <div className="flex space-x-1">
              <button className="p-1 border border-outline-variant hover:bg-surface-container-highest transition-all rounded-sm disabled:opacity-20" disabled>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 border border-outline-variant hover:bg-surface-container-highest transition-all rounded-sm disabled:opacity-20" disabled>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none" id="create-modal-overlay">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          ></div>
          <div className="relative bg-surface-container border border-outline-variant w-full max-w-4xl h-full max-h-[90%] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">

            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-high">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-container p-1 rounded-sm shrink-0">
                  <PlusCircle className="w-5 h-5 text-on-primary-container" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-on-surface leading-none">New Project Entry</h2>
                  <p className="text-[9px] text-on-surface-variant font-mono font-bold uppercase tracking-wider mt-1">Institutional Ledger Enrollment</p>
                </div>
              </div>
              <button
                className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="flex-1 overflow-y-auto p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>

              <div className="space-y-4">
                <h3 className="font-mono text-primary text-[10px] font-bold tracking-widest border-b border-outline-variant/30 pb-1 uppercase">
                  01. Identity &amp; Core Data
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">PROJECT NAME *</label>
                    <input
                      type="text"
                      className="w-full bg-background border border-outline-variant p-2 text-xs text-on-surface rounded-sm focus:outline-none focus:border-primary font-sans"
                      placeholder="e.g. Aura Network"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">SECTOR *</label>
                    <select
                      className="w-full bg-background border border-outline-variant p-2 text-xs text-on-surface rounded-sm focus:outline-none focus:border-primary font-sans cursor-pointer"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      <option>DeFi Infrastructure</option>
                      <option>Infrastructure</option>
                      <option>DeFi</option>
                      <option>Restaking</option>
                      <option>AI / ML</option>
                      <option>L2 Solutions</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">PROJECT STAGE *</label>
                    <select
                      className="w-full bg-background border border-outline-variant p-2 text-xs text-on-surface rounded-sm focus:outline-none focus:border-primary font-sans cursor-pointer"
                      value={formStage}
                      onChange={(e) => setFormStage(e.target.value)}
                    >
                      <option>Pre-Seed</option>
                      <option>Seed Round</option>
                      <option>Seed Plus</option>
                      <option>Series A</option>
                      <option>Strategic Round</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">ONE LINE DESCRIPTION *</label>
                    <input
                      type="text"
                      className="w-full bg-background border border-outline-variant p-2 text-xs text-on-surface rounded-sm focus:outline-none focus:border-primary font-sans"
                      placeholder="e.g. Next-generation parallelized scaling layer."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">EXECUTIVE SUMMARY (ABSTRACT) *</label>
                    <textarea
                      className="w-full bg-background border border-outline-variant p-2.5 text-xs text-on-surface rounded-sm focus:outline-none focus:border-primary font-sans resize-none"
                      placeholder="Detailed technical execution thesis, architecture abstract and commercial market fit..."
                      rows={3}
                      value={formAbstract}
                      onChange={(e) => setFormAbstract(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-mono text-primary text-[10px] font-bold tracking-widest border-b border-outline-variant/30 pb-1 uppercase">
                  02. Capital &amp; Valuation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">RAISE TARGET (USD) *</label>
                    <input
                      type="number"
                      className="w-full bg-background border border-outline-variant p-2 text-xs text-on-surface font-mono rounded-sm focus:outline-none focus:border-primary"
                      placeholder="e.g. 5000000"
                      value={formTarget}
                      onChange={(e) => setFormTarget(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">POST-MONEY VALUATION *</label>
                    <input
                      type="number"
                      className="w-full bg-background border border-outline-variant p-2 text-xs text-on-surface font-mono rounded-sm focus:outline-none focus:border-primary"
                      placeholder="e.g. 50000000"
                      value={formValuation}
                      onChange={(e) => setFormValuation(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">EQUITY/TOKEN OFFERED % *</label>
                    <input
                      type="number"
                      className="w-full bg-background border border-outline-variant p-2 text-xs text-on-surface font-mono rounded-sm focus:outline-none focus:border-primary"
                      placeholder="e.g. 10"
                      value={formEquity}
                      onChange={(e) => setFormEquity(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-mono text-primary text-[10px] font-bold tracking-widest border-b border-outline-variant/30 pb-1 uppercase">
                  03. Documentation &amp; Verification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="p-5 border border-dashed border-outline-variant hover:border-primary transition-all cursor-pointer flex flex-col items-center justify-center bg-surface-container-lowest group rounded-sm"
                    onClick={() => showToast ? showToast('DOSSIER UPLOADED AND VERIFIED SUCCESSFULLY (SIMULATED)', 'success') : alert('Dossier uploaded successfully (simulated).')}
                  >
                    <UploadCloud className="w-8 h-8 text-on-surface-variant group-hover:text-primary mb-2 transition-colors" />
                    <div className="text-xs font-bold text-on-surface">Upload Whitepaper / Deck PDF</div>
                    <div className="text-[10px] font-mono text-on-surface-variant/80 mt-1 uppercase">PDF, MAX SIZE 20MB</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-outline-variant bg-surface-container-high rounded-sm">
                      <div className="flex items-center space-x-3">
                        <Building className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-wider">FEATURED ON DASHBOARD</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formFeatured}
                          onChange={(e) => setFormFeatured(e.target.checked)}
                        />
                        <div className="w-8 h-4 bg-surface-container-lowest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-outline-variant bg-surface-container-high rounded-sm">
                      <div className="flex items-center space-x-3">
                        <Building className="w-4 h-4 text-tertiary shrink-0" />
                        <span className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-wider">MARK AS TRENDING</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formTrending}
                          onChange={(e) => setFormTrending(e.target.checked)}
                        />
                        <div className="w-8 h-4 bg-surface-container-lowest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            </form>

            <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-high flex justify-end space-x-3 select-none">
              <button
                type="button"
                className="px-4 h-9 font-mono text-[10px] font-bold text-on-surface hover:bg-surface-container-highest transition-all rounded-sm cursor-pointer uppercase"
                onClick={() => setShowCreateModal(false)}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="px-4 h-9 bg-surface-container-highest border border-outline-variant text-on-surface font-mono text-[10px] font-bold rounded-sm hover:bg-surface-container-high active:scale-[0.98] transition-all cursor-pointer uppercase"
                onClick={() => handleCreateSubmit('draft')}
              >
                SAVE DRAFT
              </button>
              <button
                type="button"
                className="px-4 h-9 bg-primary text-on-primary font-mono text-[10px] font-bold rounded-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer uppercase"
                onClick={() => handleCreateSubmit('published')}
              >
                FINALIZE &amp; PUBLISH
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
