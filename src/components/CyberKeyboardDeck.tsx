import React, { useRef, useEffect } from 'react';
import { Snowflake, Bomb, HeartPulse, Terminal, Flame, AlertCircle } from 'lucide-react';
import { Skill } from '../types';

interface CyberKeyboardDeckProps {
  typedInput: string;
  onInputChange: (val: string) => void;
  energy: number;
  skills: Skill[];
  onTriggerSkill: (skillId: 'freeze' | 'emp' | 'heal') => void;
  combo: number;
  isTargetActive: boolean;
  hasMistype?: boolean;
}

export const CyberKeyboardDeck: React.FC<CyberKeyboardDeckProps> = ({
  typedInput,
  onInputChange,
  energy,
  skills,
  onTriggerSkill,
  combo,
  isTargetActive,
  hasMistype = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on mount and keep focused
  useEffect(() => {
    inputRef.current?.focus();
  }, [isTargetActive]);

  // Global document click auto-refocuses input
  useEffect(() => {
    const handleDocumentClick = () => {
      // Keep focused unless selecting text in another input
      inputRef.current?.focus();
    };
    window.addEventListener('click', handleDocumentClick);
    return () => window.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleDeckClick = () => {
    inputRef.current?.focus();
  };

  const getSkillIcon = (id: string) => {
    switch (id) {
      case 'freeze':
        return <Snowflake className="w-4 h-4 text-cyan-300" />;
      case 'emp':
        return <Bomb className="w-4 h-4 text-amber-300" />;
      case 'heal':
        return <HeartPulse className="w-4 h-4 text-rose-300" />;
      default:
        return null;
    }
  };

  return (
    <div 
      onClick={handleDeckClick}
      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 sm:p-4 flex flex-col gap-3 shadow-xl select-none"
    >
      {/* Upper row: Terminal Command Input Bar */}
      <div className="relative flex items-center">
        <div className={`absolute left-3.5 flex items-center gap-1.5 font-mono text-sm pointer-events-none transition-colors ${
          hasMistype ? 'text-rose-400' : 'text-emerald-400'
        }`}>
          <Terminal className="w-4 h-4" />
          <span className="font-bold">ROOT:&gt;</span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={typedInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={
            hasMistype
              ? "Huruf tidak cocok! Ketik huruf yang sesuai dengan target..."
              : isTargetActive
              ? "Lanjutkan mengetik kata target yang terkunci..."
              : "Ketik langsung di keyboard huruf awal kata musuh yang mendekat..."
          }
          className={`w-full bg-neutral-950 border-2 font-mono text-base sm:text-lg pl-24 pr-28 py-3 rounded-md outline-none transition-all shadow-inner tracking-wider ${
            hasMistype
              ? 'border-rose-500 text-rose-300 shadow-rose-950/60 ring-2 ring-rose-500/40 animate-pulse'
              : isTargetActive
              ? 'border-amber-400/90 text-amber-300 focus:border-amber-400 shadow-amber-950/40 ring-1 ring-amber-400/30'
              : 'border-emerald-500/50 text-emerald-300 focus:border-emerald-400 placeholder:text-neutral-500'
          }`}
          autoFocus
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
        />

        {/* Combo Badge or Input Status on the Right */}
        <div className="absolute right-3 flex items-center gap-2 pointer-events-none">
          {hasMistype ? (
            <div className="flex items-center gap-1 bg-rose-950/90 border border-rose-500 px-2 py-0.5 rounded text-[11px] font-bold text-rose-300">
              <AlertCircle className="w-3 h-3 text-rose-400" />
              <span>MISKEY</span>
            </div>
          ) : combo > 2 ? (
            <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-500/60 px-2 py-0.5 rounded text-xs font-bold text-amber-300 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{combo}x STREAK</span>
            </div>
          ) : null}
          <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
            [ESC: RESET]
          </span>
        </div>
      </div>

      {/* Helper Intel Row */}
      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
        <div className="flex items-center gap-3">
          <span className={isTargetActive ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
            ● TARGET: {isTargetActive ? 'TERKUNCI' : 'SIAP MENDETEKSI'}
          </span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="hidden sm:inline text-neutral-500">
            Anda dapat mengetik langsung kapan saja tanpa klik
          </span>
        </div>
        <div className="text-neutral-500 text-[10px]">
          [BACKSPACE] Hapus // [1, 2, 3] Skill
        </div>
      </div>

      {/* Bottom row: Active Cyber Skills Panel */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/80">
        <div className="text-[11px] text-neutral-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <span>PROTOKOL DARURAT:</span>
          <span className="text-[10px] text-neutral-500">(Tekan angka 1, 2, 3 di keyboard)</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {skills.map((skill) => {
            const canAfford = energy >= skill.energyCost && skill.currentCooldown === 0;
            const onCooldown = skill.currentCooldown > 0;

            return (
              <button
                key={skill.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (canAfford) {
                    onTriggerSkill(skill.id);
                    inputRef.current?.focus();
                  }
                }}
                disabled={!canAfford}
                className={`group px-3 py-1.5 rounded-md border text-xs font-mono font-medium flex items-center gap-2 transition-all relative overflow-hidden ${
                  canAfford
                    ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-600 text-neutral-100 hover:border-emerald-400 shadow-md cursor-pointer'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-600 cursor-not-allowed opacity-60'
                }`}
              >
                {/* Hotkey tag */}
                <span className="w-4 h-4 rounded bg-neutral-900 border border-neutral-700 text-[10px] flex items-center justify-center font-bold text-emerald-400 group-hover:border-emerald-500">
                  {skill.hotkey}
                </span>

                {/* Skill Icon & Name */}
                <span className="flex items-center gap-1">
                  {getSkillIcon(skill.id)}
                  <span>{skill.name}</span>
                </span>

                {/* Cost badge */}
                <span className="text-[10px] text-cyan-400">
                  ({skill.energyCost}⚡)
                </span>

                {/* Cooldown Overlay */}
                {onCooldown && (
                  <div className="absolute inset-0 bg-neutral-950/80 flex items-center justify-center text-[10px] text-neutral-400 font-bold">
                    {skill.currentCooldown.toFixed(1)}s
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
