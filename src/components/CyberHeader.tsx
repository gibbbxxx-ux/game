import React from 'react';
import { Shield, Zap, Terminal, Trophy, Volume2, VolumeX, BookOpen, FileCode, Monitor } from 'lucide-react';
import { GameStats } from '../types';

interface CyberHeaderProps {
  playerHp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  stats: GameStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  onOpenGDD: () => void;
  onOpenGlossary: () => void;
}

export const CyberHeader: React.FC<CyberHeaderProps> = ({
  playerHp,
  maxHp,
  energy,
  maxEnergy,
  stats,
  soundEnabled,
  onToggleSound,
  crtEnabled,
  onToggleCrt,
  onOpenGDD,
  onOpenGlossary,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (playerHp / maxHp) * 100));
  const energyPercent = Math.max(0, Math.min(100, (energy / maxEnergy) * 100));

  return (
    <header className="w-full bg-neutral-900/90 backdrop-blur border-b border-emerald-500/30 px-3 py-2.5 sm:px-6 sm:py-3 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* Left: Brand & Floor Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold tracking-wider">
            <Terminal className="w-4 h-4 animate-pulse text-emerald-300" />
            <span>SECTOR {stats.floor}</span>
          </div>
          <div className="hidden sm:block text-neutral-400 text-xs">
            DATA DUNGEON // INFILTRATION
          </div>
        </div>

        {/* Center: HP & Energy Meters */}
        <div className="flex items-center gap-4 flex-1 max-w-md justify-center">
          {/* Health Bar */}
          <div className="flex-1 min-w-[120px]">
            <div className="flex justify-between items-center text-[11px] mb-1 font-semibold">
              <span className="flex items-center gap-1 text-rose-400">
                <Shield className="w-3.5 h-3.5" /> HP
              </span>
              <span className={playerHp < 30 ? 'text-rose-400 animate-pulse' : 'text-neutral-300'}>
                {Math.max(0, playerHp)} / {maxHp}
              </span>
            </div>
            <div className="h-2.5 bg-neutral-950 rounded-sm border border-neutral-800 overflow-hidden relative">
              <div
                className={`h-full transition-all duration-300 ${
                  hpPercent > 50 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : hpPercent > 25 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Cyber Energy Bar */}
          <div className="flex-1 min-w-[120px]">
            <div className="flex justify-between items-center text-[11px] mb-1 font-semibold">
              <span className="flex items-center gap-1 text-cyan-400">
                <Zap className="w-3.5 h-3.5" /> OVERCHARGE
              </span>
              <span className="text-cyan-300">
                {Math.floor(energy)}%
              </span>
            </div>
            <div className="h-2.5 bg-neutral-950 rounded-sm border border-neutral-800 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-300"
                style={{ width: `${energyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Stats, Toggles, and Documents */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Score & Multiplier */}
          <div className="text-right pr-1 sm:pr-2">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">SKOR DATA</div>
            <div className="text-amber-400 font-bold tracking-tight text-sm sm:text-base flex items-center justify-end gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              {stats.score.toLocaleString()}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 border-l border-neutral-800 pl-2">
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Audio Aktif' : 'Audio Mati'}
              className={`p-1.5 rounded border transition-colors ${
                soundEnabled
                  ? 'bg-emerald-950/50 border-emerald-600/40 text-emerald-400 hover:bg-emerald-900/60'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onToggleCrt}
              title={crtEnabled ? 'Efek CRT Aktif' : 'Efek CRT Mati'}
              className={`p-1.5 rounded border transition-colors ${
                crtEnabled
                  ? 'bg-teal-950/50 border-teal-600/40 text-teal-300 hover:bg-teal-900/60'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenGlossary}
              title="Buka Bank Kata & Glosarium Edukasi"
              className="px-2 py-1.5 rounded bg-blue-950/50 border border-blue-600/40 text-blue-300 hover:bg-blue-900/60 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Glosarium</span>
            </button>

            <button
              onClick={onOpenGDD}
              title="Buka Game Design Document (GDD) & Kode Prototype"
              className="px-2 py-1.5 rounded bg-purple-950/50 border border-purple-600/40 text-purple-300 hover:bg-purple-900/60 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden md:inline">GDD & Kode</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
