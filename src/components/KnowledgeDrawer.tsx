import React, { useState } from 'react';
import { DefeatedWordLog } from '../types';
import { WORD_BANK } from '../data/wordBank';
import { BookOpen, X, Search, ShieldCheck, Cpu, Code, Network, Database, Sparkles } from 'lucide-react';

interface KnowledgeDrawerProps {
  latestIntel: DefeatedWordLog | null;
  isOpen: boolean;
  onClose: () => void;
  learnedCount: number;
}

export const KnowledgeDrawer: React.FC<KnowledgeDrawerProps> = ({
  latestIntel,
  isOpen,
  onClose,
  learnedCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'minion', label: 'Bug Dasar (Kroco)' },
    { id: 'elite', label: 'Malware (Sedang)' },
    { id: 'boss', label: 'Sintaks Kode (Boss)' },
  ];

  const filteredWords = WORD_BANK.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.difficulty === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'security':
        return <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />;
      case 'hardware':
        return <Cpu className="w-3.5 h-3.5 text-amber-400" />;
      case 'programming':
        return <Code className="w-3.5 h-3.5 text-emerald-400" />;
      case 'networking':
        return <Network className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Database className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <>
      {/* Real-time Ticker banner for the latest defeated item */}
      {latestIntel && (
        <div className="w-full bg-neutral-900/90 border border-cyan-500/40 rounded-lg p-3 sm:px-4 sm:py-2.5 flex items-start sm:items-center justify-between gap-3 shadow-lg shadow-cyan-950/40 select-none animate-fadeIn">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-1.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300 mt-0.5 sm:mt-0">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 font-mono">
                  INTEL DIEKSTRAKSI:
                </span>
                <span className="text-sm font-mono font-black text-white bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-700">
                  {latestIntel.word}
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                  {latestIntel.category}
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-sans mt-0.5 line-clamp-2">
                {latestIntel.meaning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Cyber Encyclopedia & Glossary Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] bg-neutral-900 border-2 border-cyan-500/60 rounded-xl flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/80 font-mono">
            
            {/* Modal Header */}
            <div className="bg-neutral-950 px-4 py-3.5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm sm:text-base">
                <BookOpen className="w-5 h-5" />
                <span>ARSIP PENGETAHUAN CYBER // GLOSARIUM KOMPUTER</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-bar with Search & Category Filters */}
            <div className="p-3 bg-neutral-950/60 border-b border-neutral-800 flex flex-wrap gap-2 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari istilah atau definisi kata..."
                  className="w-full bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 pl-9 pr-3 py-1.5 rounded outline-none focus:border-cyan-400 placeholder:text-neutral-500 font-sans"
                />
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Words List */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-neutral-900/50">
              {filteredWords.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-950/70 border border-neutral-800 hover:border-cyan-500/40 rounded-lg p-3 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base font-bold text-emerald-400 tracking-wider font-mono">
                        {item.word}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 uppercase bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                  
                  <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-500">
                    <span>
                      Tingkat: <strong className="text-neutral-400">{item.difficulty.toUpperCase()}</strong>
                    </span>
                    <span>{item.word.length} Karakter</span>
                  </div>
                </div>
              ))}

              {filteredWords.length === 0 && (
                <div className="col-span-full py-12 text-center text-neutral-500 text-xs">
                  Tidak ada istilah yang cocok dengan kueri "{searchQuery}".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-neutral-950 px-4 py-2.5 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>Menampilkan {filteredWords.length} dari {WORD_BANK.length} istilah komputer</span>
              <button
                onClick={onClose}
                className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs font-bold transition-colors"
              >
                KEMBALI KE TERMINAL
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
