import React from 'react';
import { GameStats, GameStatus } from '../types';
import { Play, RotateCcw, Skull, Trophy, CheckCircle2, ArrowRight, Terminal, Zap, Shield, BookOpen } from 'lucide-react';

interface CyberModalsProps {
  status: GameStatus;
  stats: GameStats;
  onStartGame: () => void;
  onRestartGame: () => void;
  onNextFloor: () => void;
  onOpenGDD: () => void;
  onOpenGlossary: () => void;
}

export const CyberModals: React.FC<CyberModalsProps> = ({
  status,
  stats,
  onStartGame,
  onRestartGame,
  onNextFloor,
  onOpenGDD,
  onOpenGlossary,
}) => {
  if (status === 'playing' || status === 'paused') return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none font-mono">
      {/* START / MAIN MENU */}
      {status === 'menu' && (
        <div className="w-full max-w-xl bg-neutral-900 border-2 border-emerald-500/80 rounded-xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/80 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
            <Terminal className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>

          <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-widest mb-1">
            LABORATORIUM KOMPUTER TUA // DATA SECTOR 01
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider mb-3">
            KETIK CEPAT: <span className="text-emerald-400">DUNGEON CRAWLER</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed max-w-md mb-6">
            Anda adalah <strong>Penyusup Cyber</strong>. Basmi gelombang <em>Bug</em>, <em>Malware</em>, dan <em>Boss AI Rusak</em> dengan mengetik kosakata dan sintaks kode sebelum pertahanan Anda ditembus!
          </p>

          {/* Key mechanics badges */}
          <div className="grid grid-cols-3 gap-2 w-full mb-6 text-xs text-neutral-300">
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
              <span className="text-emerald-400 font-bold block mb-0.5">3-5 Huruf</span>
              <span className="text-[10px] text-neutral-400">Bug & Glitch</span>
            </div>
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
              <span className="text-purple-400 font-bold block mb-0.5">6-9 Huruf</span>
              <span className="text-[10px] text-neutral-400">Malware & Trojan</span>
            </div>
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
              <span className="text-rose-400 font-bold block mb-0.5">Sintaks Kode</span>
              <span className="text-[10px] text-neutral-400">Zero-Day Boss</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onStartGame}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-3 px-6 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>MULAI INFILTRASI DATA</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mt-5 text-xs text-neutral-400">
            <button onClick={onOpenGDD} className="hover:text-purple-400 underline cursor-pointer">
              Lihat GDD & Spek Desain
            </button>
            <span>•</span>
            <button onClick={onOpenGlossary} className="hover:text-cyan-400 underline cursor-pointer">
              Buka Glosarium Cyber
            </button>
          </div>
        </div>
      )}

      {/* FLOOR CLEAR TRANSITION */}
      {status === 'floor_clear' && (
        <div className="w-full max-w-md bg-neutral-900 border-2 border-cyan-500 rounded-xl p-6 sm:p-8 text-center flex flex-col items-center shadow-2xl shadow-cyan-950/80">
          <div className="w-14 h-14 rounded-full bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-cyan-400" />
          </div>

          <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mb-1">
            SEKTOR DIBERSIHKAN
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            LANTAI {stats.floor} SELESAI DITEMBUS!
          </h2>
          <p className="text-xs text-neutral-300 font-sans mb-6">
            Protokol pertahanan data berhasil dipulihkan. Bersiap menuju sektor laboratorium berikutnya dengan ancaman lebih agresif.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mb-6 text-xs text-neutral-300">
            <div className="bg-neutral-950 p-3 rounded border border-neutral-800">
              <span className="text-neutral-400 text-[10px] block">WPM TERAKHIR</span>
              <strong className="text-amber-400 text-lg font-bold">{stats.wpm}</strong>
            </div>
            <div className="bg-neutral-950 p-3 rounded border border-neutral-800">
              <span className="text-neutral-400 text-[10px] block">AKURASI</span>
              <strong className="text-teal-400 text-lg font-bold">{stats.accuracy}%</strong>
            </div>
          </div>

          <button
            onClick={onNextFloor}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black py-3 px-6 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <span>LANJUT KE LANTAI {stats.floor + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {status === 'game_over' && (
        <div className="w-full max-w-md bg-neutral-900 border-2 border-rose-500 rounded-xl p-6 sm:p-8 text-center flex flex-col items-center shadow-2xl shadow-rose-950/80">
          <div className="w-14 h-14 rounded-full bg-rose-950/80 border-2 border-rose-400 flex items-center justify-center mb-4 animate-bounce">
            <Skull className="w-8 h-8 text-rose-400" />
          </div>

          <div className="text-[10px] text-rose-400 uppercase tracking-widest font-bold mb-1">
            CORE DEFENSE DILUMPUHKAN
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-rose-300 mb-2">
            SISTEM GAGAL // GAME OVER
          </h2>
          <p className="text-xs text-neutral-300 font-sans mb-6">
            Bug dan Malware berhasil membanjiri terminal memori Anda. Reboot terminal dan coba lagi!
          </p>

          <div className="grid grid-cols-3 gap-2 w-full mb-6 text-xs text-neutral-300">
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">SKOR</span>
              <strong className="text-amber-400 font-bold">{stats.score.toLocaleString()}</strong>
            </div>
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">MAX COMBO</span>
              <strong className="text-cyan-400 font-bold">{stats.maxCombo}x</strong>
            </div>
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">TERBASMI</span>
              <strong className="text-emerald-400 font-bold">{stats.enemiesDefeated}</strong>
            </div>
          </div>

          <button
            onClick={onRestartGame}
            className="w-full bg-rose-500 hover:bg-rose-400 text-white font-black py-3 px-6 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/40 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REBOOT SISTEM & ULANGI</span>
          </button>
        </div>
      )}

      {/* VICTORY SCREEN */}
      {status === 'victory' && (
        <div className="w-full max-w-lg bg-neutral-900 border-2 border-amber-500 rounded-xl p-6 sm:p-8 text-center flex flex-col items-center shadow-2xl shadow-amber-950/80">
          <div className="w-16 h-16 rounded-full bg-amber-950/80 border-2 border-amber-400 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
            <Trophy className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>

          <div className="text-[10px] text-amber-400 uppercase tracking-widest font-bold mb-1">
            MAINFRAME SELURUH LANTAI TELAH DIBERSIHKAN
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 mb-2">
            MISI BERHASIL: CYBER MASTER!
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-sans mb-6">
            Seluruh infeksi data malware dan AI Zero-Day telah musnah. Kecepatan dan ketepatan jari Anda telah menyelamatkan laboratorium komputer tua ini!
          </p>

          <div className="grid grid-cols-4 gap-2 w-full mb-6 text-xs text-neutral-300">
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
              <span className="text-neutral-500 text-[9px] block">TOTAL SKOR</span>
              <strong className="text-amber-400 text-sm font-bold">{stats.score.toLocaleString()}</strong>
            </div>
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
              <span className="text-neutral-500 text-[9px] block">RATA-RATA WPM</span>
              <strong className="text-cyan-400 text-sm font-bold">{stats.wpm}</strong>
            </div>
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
              <span className="text-neutral-500 text-[9px] block">AKURASI</span>
              <strong className="text-teal-400 text-sm font-bold">{stats.accuracy}%</strong>
            </div>
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
              <span className="text-neutral-500 text-[9px] block">MAX STREAK</span>
              <strong className="text-purple-400 text-sm font-bold">{stats.maxCombo}x</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onRestartGame}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3 px-6 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>MAIN LAGI (NEW GAME+)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
