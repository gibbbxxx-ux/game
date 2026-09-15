import React from 'react';
import { Enemy, GameStats } from '../types';
import { Bug, ShieldAlert, Cpu, Skull, Terminal, Crosshair, Zap } from 'lucide-react';

interface CyberDungeonCanvasProps {
  enemies: Enemy[];
  currentTargetId: string | null;
  typedInput: string;
  isFreezeActive: boolean;
  isEmpTriggered: boolean;
  isPlayerHit: boolean;
  floor: number;
  stats: GameStats;
  onSelectTarget?: (id: string) => void;
}

export const CyberDungeonCanvas: React.FC<CyberDungeonCanvasProps> = ({
  enemies,
  currentTargetId,
  typedInput,
  isFreezeActive,
  isEmpTriggered,
  isPlayerHit,
  floor,
  stats,
  onSelectTarget,
}) => {
  // 4 distinct lanes with generous vertical spacing
  const laneYs = [18, 38, 58, 78];

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] bg-neutral-950 border border-emerald-500/30 rounded-lg overflow-hidden select-none shadow-2xl flex flex-col justify-between">
      {/* Background Cyber Grid Perspective */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Cyber Floor Lane Tracks (4 distinct lanes) */}
      <div className="absolute inset-0 pointer-events-none">
        {laneYs.map((yPercent, idx) => (
          <div
            key={idx}
            className="absolute left-0 right-0 border-b border-dashed border-emerald-500/20 flex items-center justify-end pr-4 text-[9px] text-emerald-600/40 font-mono"
            style={{ top: `${yPercent}%` }}
          >
            <span>LANE 0{idx + 1} ───</span>
          </div>
        ))}
      </div>

      {/* Danger Line (Defense Perimeter at 12% from left) */}
      <div 
        className="absolute top-0 bottom-10 w-[2px] bg-rose-500/50 border-r border-rose-500/40 flex items-center justify-center pointer-events-none z-10"
        style={{ left: '12%' }}
      >
        <div className="bg-rose-950/90 border border-rose-500/60 text-[9px] text-rose-400 py-2 px-1 rotate-180 uppercase tracking-widest font-mono [writing-mode:vertical-rl] shadow-sm">
          DEFENSE PERIMETER
        </div>
      </div>

      {/* EMP Shockwave Visual */}
      {isEmpTriggered && (
        <div className="absolute inset-0 bg-cyan-400/30 z-30 animate-ping pointer-events-none" />
      )}

      {/* Freeze Time Blue Shimmer Overlay */}
      {isFreezeActive && (
        <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-[0.5px] border-2 border-cyan-400/60 z-20 pointer-events-none flex items-center justify-center">
          <div className="bg-cyan-900/95 border border-cyan-400 text-cyan-200 px-5 py-2 rounded-full text-xs font-bold tracking-wider shadow-lg flex items-center gap-2 animate-pulse">
            <Zap className="w-4 h-4 text-cyan-300" />
            CLOCK JAMMER ACTIVE // SELURUH MUSUH DIBEKUKAN
          </div>
        </div>
      )}

      {/* Damage Screen Flash when player is hit */}
      {isPlayerHit && (
        <div className="absolute inset-0 bg-rose-600/40 z-30 pointer-events-none animate-pulse" />
      )}

      {/* Player Terminal Core (Cyber Infiltrator Base on the Far Left) */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
        style={{ left: '2%' }}
      >
        <div className="relative group">
          {/* Animated Shield Aura */}
          <div className={`absolute -inset-2 rounded-xl blur-sm transition-all duration-300 ${
            isPlayerHit 
              ? 'bg-rose-500/70 animate-ping' 
              : 'bg-emerald-500/25'
          }`} />

          {/* Core Hardware Chassis */}
          <div className="relative w-16 sm:w-20 h-32 sm:h-40 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 border-2 border-emerald-500/70 rounded-lg flex flex-col items-center justify-between p-2 shadow-xl shadow-emerald-950/60">
            {/* Status light */}
            <div className="w-full flex items-center justify-between px-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[9px] text-emerald-400 font-bold">CORE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>

            {/* Terminal Screen inside Player Core */}
            <div className="w-full flex-1 my-1.5 bg-black rounded border border-emerald-500/40 p-1 flex flex-col items-center justify-center text-center">
              <Cpu className="w-6 h-6 text-emerald-400 mb-1 animate-pulse" />
              <div className="text-[8px] sm:text-[9px] text-emerald-300 font-mono leading-tight">
                INFILTRATOR<br />TERMINAL
              </div>
            </div>

            {/* Root Access badge */}
            <div className="text-[8px] bg-emerald-950/90 text-emerald-400 border border-emerald-600/50 px-1 py-0.5 rounded uppercase font-bold tracking-tighter">
              SHIELD ON
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Enemies Arena Playground */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {enemies.map((enemy) => {
          const isTarget = enemy.id === currentTargetId;
          const topPosition = `${laneYs[enemy.lane % 4]}%`;

          // Calculate match for highlighted display
          const word = enemy.word;
          const matchLen = isTarget ? Math.min(typedInput.length, word.length) : 0;
          const matchedPart = word.slice(0, matchLen);
          const remainingPart = word.slice(matchLen);

          return (
            <div
              key={enemy.id}
              onClick={() => onSelectTarget && onSelectTarget(enemy.id)}
              className={`absolute flex flex-col items-center select-none pointer-events-auto cursor-pointer transition-transform duration-75 ${
                isTarget ? 'z-30 scale-105' : 'z-20 hover:scale-105'
              }`}
              style={{
                left: `${enemy.x}%`,
                top: topPosition,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Laser beam target lock indicator */}
              {isTarget && (
                <div className="flex items-center gap-1 text-[10px] text-amber-300 font-mono mb-1 bg-black/90 px-2 py-0.5 rounded border border-amber-400/90 shadow-lg shadow-amber-500/30 animate-bounce">
                  <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                  <span>TARGET LOCK</span>
                </div>
              )}

              {/* Word Card / Command Bubble Above Sprite */}
              <div
                className={`px-2.5 py-1 rounded-md text-xs sm:text-sm font-mono tracking-wide font-bold shadow-xl transition-all duration-150 flex flex-col items-center whitespace-nowrap ${
                  isTarget
                    ? 'bg-neutral-900 border-2 border-amber-400 shadow-amber-500/50 scale-110'
                    : enemy.type === 'boss'
                    ? 'bg-neutral-950 border-2 border-rose-500 shadow-rose-900/60'
                    : enemy.type === 'elite'
                    ? 'bg-neutral-900 border border-purple-500/80 shadow-purple-950/60'
                    : 'bg-neutral-900/95 border border-emerald-500/40 shadow-emerald-950/50'
                }`}
              >
                {/* Category & Type Tag */}
                <span className="text-[8px] uppercase tracking-wider mb-0.5 opacity-80 text-neutral-400">
                  {enemy.type === 'boss' ? 'CRITICAL BOSS' : enemy.type === 'elite' ? 'ELITE MALWARE' : 'BUG'} // {enemy.category}
                </span>

                {/* Character Highlights */}
                <div className="flex items-center tracking-wider text-sm sm:text-base font-bold">
                  {isTarget ? (
                    <>
                      <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)] font-black">
                        {matchedPart}
                      </span>
                      <span className="text-amber-300 animate-pulse underline font-black">
                        {remainingPart.charAt(0)}
                      </span>
                      <span className="text-neutral-200">
                        {remainingPart.slice(1)}
                      </span>
                    </>
                  ) : (
                    <span className={enemy.type === 'boss' ? 'text-rose-300 font-bold' : enemy.type === 'elite' ? 'text-purple-300' : 'text-neutral-100'}>
                      {word}
                    </span>
                  )}
                </div>
              </div>

              {/* Enemy Sprite & Visual Glow */}
              <div className="relative mt-1 flex items-center justify-center">
                {enemy.type === 'boss' ? (
                  <div className="relative w-12 h-12 rounded-full bg-rose-950/90 border-2 border-rose-500 flex items-center justify-center shadow-lg shadow-rose-600/50 animate-pulse">
                    <Skull className="w-7 h-7 text-rose-400" />
                    <div className="absolute -inset-1 rounded-full border border-dashed border-rose-400/60 animate-spin" />
                  </div>
                ) : enemy.type === 'elite' ? (
                  <div className="w-9 h-9 rounded-lg bg-purple-950/90 border-2 border-purple-500 flex items-center justify-center shadow-md shadow-purple-600/50 transform rotate-45">
                    <ShieldAlert className="w-5 h-5 text-purple-300 -rotate-45" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded bg-emerald-950/90 border border-emerald-400 flex items-center justify-center shadow shadow-emerald-500/40">
                    <Bug className="w-5 h-5 text-emerald-400 animate-bounce" />
                  </div>
                )}
              </div>

            </div>
          );
        })}

        {/* Empty state message between waves */}
        {enemies.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-neutral-500 text-xs font-mono uppercase tracking-widest flex items-center gap-2 bg-neutral-900/60 px-4 py-2 rounded border border-neutral-800">
              <Terminal className="w-4 h-4 animate-spin text-emerald-400" />
              MEMINDAI ALIRAN DATA LAB... MEMPERSIAPKAN ANCAMAN BARU
            </div>
          </div>
        )}
      </div>

      {/* Bottom Live Feedback Bar in Arena */}
      <div className="bg-neutral-950/90 border-t border-emerald-500/20 px-4 py-2 flex items-center justify-between text-xs text-neutral-400 font-mono z-10">
        <div className="flex items-center gap-4">
          <span className="text-neutral-400">
            KOMBO: <strong className="text-cyan-400">{stats.combo}x</strong> (MAX: {stats.maxCombo}x)
          </span>
          <span className="hidden sm:inline text-neutral-500">|</span>
          <span className="hidden sm:inline text-neutral-400">
            TERBASMI: <strong className="text-emerald-400">{stats.enemiesDefeated}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span>
            WPM: <strong className="text-amber-400">{stats.wpm}</strong>
          </span>
          <span>
            AKURASI: <strong className="text-teal-400">{stats.accuracy}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
