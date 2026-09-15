import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Enemy,
  GameStatus,
  GameStats,
  Skill,
  WordItem,
  DefeatedWordLog,
  EnemyType,
} from './types';
import { WORD_BANK, FLOOR_CONFIGS } from './data/wordBank';
import { sound } from './utils/sound';
import { CyberHeader } from './components/CyberHeader';
import { CyberDungeonCanvas } from './components/CyberDungeonCanvas';
import { CyberKeyboardDeck } from './components/CyberKeyboardDeck';
import { KnowledgeDrawer } from './components/KnowledgeDrawer';
import { CyberModals } from './components/CyberModals';
import { GDDModal } from './components/GDDModal';

export function App() {
  // Core game states
  const [status, setStatus] = useState<GameStatus>('menu');
  const [floor, setFloor] = useState<number>(1);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [maxHp] = useState<number>(100);
  const [energy, setEnergy] = useState<number>(40);
  const [maxEnergy] = useState<number>(100);

  // Entities & Targeting
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [currentTargetId, setCurrentTargetId] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState<string>('');
  const [latestIntel, setLatestIntel] = useState<DefeatedWordLog | null>(null);
  const [hasMistype, setHasMistype] = useState<boolean>(false);

  // Visual Effects & Feedback
  const [isFreezeActive, setIsFreezeActive] = useState<boolean>(false);
  const [isEmpTriggered, setIsEmpTriggered] = useState<boolean>(false);
  const [isPlayerHit, setIsPlayerHit] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);

  // Modals & Drawers
  const [isGDDOpen, setIsGDDOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  // Cyber Infiltrator Skills
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: 'freeze',
      name: 'Clock Jammer',
      description: 'Membekukan pergerakan seluruh musuh selama 4 detik.',
      energyCost: 35,
      cooldownSeconds: 12,
      currentCooldown: 0,
      hotkey: '1',
    },
    {
      id: 'emp',
      name: 'EMP Surge',
      description: 'Hancurkan seketika semua musuh Kroco (Bug) di layar.',
      energyCost: 50,
      cooldownSeconds: 16,
      currentCooldown: 0,
      hotkey: '2',
    },
    {
      id: 'heal',
      name: 'Kernel Patch',
      description: 'Pulihkan 35 HP pertahanan inti data.',
      energyCost: 30,
      cooldownSeconds: 10,
      currentCooldown: 0,
      hotkey: '3',
    },
  ]);

  // Statistics
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    floor: 1,
    wpm: 0,
    accuracy: 100,
    totalCharsTyped: 0,
    correctCharsTyped: 0,
    combo: 0,
    maxCombo: 0,
    enemiesDefeated: 0,
    minionsDefeated: 0,
    elitesDefeated: 0,
    bossesDefeated: 0,
  });

  // Tracking references for game loop & state synchronization
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mistypeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const floorEnemiesSpawned = useRef<number>(0);
  const totalFloorEnemies = useRef<number>(10);
  const startTimeRef = useRef<number>(Date.now());

  // Real-time synchronization refs
  const enemiesRef = useRef<Enemy[]>([]);
  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);

  const currentTargetIdRef = useRef<string | null>(currentTargetId);
  useEffect(() => {
    currentTargetIdRef.current = currentTargetId;
  }, [currentTargetId]);

  const typedInputRef = useRef<string>(typedInput);
  useEffect(() => {
    typedInputRef.current = typedInput;
  }, [typedInput]);

  const statusRef = useRef<GameStatus>(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const playerHpRef = useRef<number>(playerHp);
  useEffect(() => {
    playerHpRef.current = playerHp;
  }, [playerHp]);

  // Update sound controller state
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Start a new game or sector
  const startGame = useCallback((startFloor: number = 1) => {
    const config = FLOOR_CONFIGS.find((c) => c.floor === startFloor) || FLOOR_CONFIGS[0];
    setFloor(startFloor);
    setPlayerHp(100);
    setEnergy(40);
    setEnemies([]);
    setCurrentTargetId(null);
    setTypedInput('');
    setIsFreezeActive(false);
    setHasMistype(false);

    floorEnemiesSpawned.current = 0;
    totalFloorEnemies.current = config.minionCount + config.eliteCount + config.bossCount;
    startTimeRef.current = Date.now();

    if (startFloor === 1) {
      setStats({
        score: 0,
        floor: 1,
        wpm: 0,
        accuracy: 100,
        totalCharsTyped: 0,
        correctCharsTyped: 0,
        combo: 0,
        maxCombo: 0,
        enemiesDefeated: 0,
        minionsDefeated: 0,
        elitesDefeated: 0,
        bossesDefeated: 0,
      });
    } else {
      setStats((prev) => ({ ...prev, floor: startFloor }));
    }

    setStatus('playing');
  }, []);

  // Spawn Enemy Logic (Executed cleanly outside setState)
  const spawnEnemy = useCallback(() => {
    if (statusRef.current !== 'playing') return;

    const currentConfig = FLOOR_CONFIGS.find((c) => c.floor === floor) || FLOOR_CONFIGS[0];

    // Check if quota for current floor has been reached
    if (floorEnemiesSpawned.current >= totalFloorEnemies.current) {
      return;
    }

    // Determine type to spawn
    let chosenDifficulty: EnemyType = 'minion';
    const rand = Math.random();
    if (currentConfig.bossCount > 0 && floorEnemiesSpawned.current >= totalFloorEnemies.current - currentConfig.bossCount) {
      chosenDifficulty = 'boss';
    } else if (currentConfig.eliteCount > 0 && rand < 0.35) {
      chosenDifficulty = 'elite';
    }

    const eligibleWords = WORD_BANK.filter((w) => w.difficulty === chosenDifficulty);
    const selectedTemplate: WordItem = eligibleWords[Math.floor(Math.random() * eligibleWords.length)] || eligibleWords[0];

    // Smart Lane Selection: 4 distinct lanes (0, 1, 2, 3)
    const activeEnemies = enemiesRef.current;
    const LANES_COUNT = 4;
    let chosenLane = 0;
    let maxClearance = -999;

    for (let l = 0; l < LANES_COUNT; l++) {
      const laneEnemies = activeEnemies.filter((e) => e.lane === l);
      if (laneEnemies.length === 0) {
        chosenLane = l;
        maxClearance = 999;
        break;
      }
      const maxXInLane = Math.max(...laneEnemies.map((e) => e.x));
      const clearance = 92 - maxXInLane;
      if (clearance > maxClearance) {
        maxClearance = clearance;
        chosenLane = l;
      }
    }

    // If lane clearance is too crowded right now, delay spawn slightly
    if (maxClearance < 16 && maxClearance !== 999 && maxClearance !== -999) {
      spawnTimerRef.current = setTimeout(spawnEnemy, 800);
      return;
    }

    // Increment spawn count once per spawned enemy
    floorEnemiesSpawned.current += 1;

    const newEnemy: Enemy = {
      id: `enemy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      word: selectedTemplate.word,
      meaning: selectedTemplate.meaning,
      category: selectedTemplate.category,
      type: selectedTemplate.difficulty,
      hp: selectedTemplate.difficulty === 'boss' ? 3 : selectedTemplate.difficulty === 'elite' ? 2 : 1,
      maxHp: selectedTemplate.difficulty === 'boss' ? 3 : selectedTemplate.difficulty === 'elite' ? 2 : 1,
      speed: (selectedTemplate.difficulty === 'boss' ? 2.0 : selectedTemplate.difficulty === 'elite' ? 3.0 : 4.5) * currentConfig.speedMultiplier,
      x: 92, // Starts visibly at 92% on the right side of arena
      lane: chosenLane,
      typedIndex: 0,
      isTargeted: false,
      damage: selectedTemplate.difficulty === 'boss' ? 35 : selectedTemplate.difficulty === 'elite' ? 18 : 10,
      scoreValue: selectedTemplate.difficulty === 'boss' ? 400 : selectedTemplate.difficulty === 'elite' ? 180 : 75,
      color: selectedTemplate.difficulty === 'boss' ? '#f43f5e' : selectedTemplate.difficulty === 'elite' ? '#a855f7' : '#10b981',
    };

    setEnemies((prev) => [...prev, newEnemy]);

    // Schedule next spawn if more enemies remain
    if (floorEnemiesSpawned.current < totalFloorEnemies.current) {
      spawnTimerRef.current = setTimeout(spawnEnemy, currentConfig.spawnIntervalMs);
    }
  }, [floor]);

  // Handle initial spawn timer when playing starts
  useEffect(() => {
    if (status === 'playing') {
      spawnTimerRef.current = setTimeout(spawnEnemy, 1000);
    }
    return () => {
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    };
  }, [status, floor, spawnEnemy]);

  // Main 60FPS Game Loop
  useEffect(() => {
    if (status !== 'playing') {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    const updateFrame = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Update skill cooldowns
      setSkills((prevSkills) =>
        prevSkills.map((s) => ({
          ...s,
          currentCooldown: Math.max(0, s.currentCooldown - dt),
        }))
      );

      // Move enemies if clock jammer freeze is not active
      if (!isFreezeActive) {
        setEnemies((prevEnemies) => {
          let hitOccurred = false;
          let damageDealt = 0;
          let targetBreached = false;

          // 1. Move each enemy to the left (decreasing x)
          const movedEnemies = prevEnemies.map((enemy) => ({
            ...enemy,
            x: enemy.x - enemy.speed * dt,
          }));

          // 2. Anti-Stacking & Anti-Overtaking per lane
          const LANES_COUNT = 4;
          for (let l = 0; l < LANES_COUNT; l++) {
            const laneEnemies = movedEnemies.filter((e) => e.lane === l);
            laneEnemies.sort((a, b) => a.x - b.x); // smaller x is ahead (closer to base)

            for (let i = 1; i < laneEnemies.length; i++) {
              const inFront = laneEnemies[i - 1];
              const behind = laneEnemies[i];
              const MIN_GAP = 18; // Minimum 18% horizontal distance

              if (behind.x - inFront.x < MIN_GAP) {
                behind.x = inFront.x + MIN_GAP;
                behind.speed = Math.min(behind.speed, inFront.speed * 0.95);
              }
            }
          }

          // 3. Check perimeter breach (x <= 12%)
          const remainingEnemies: Enemy[] = [];

          for (const enemy of movedEnemies) {
            if (enemy.x <= 12) {
              hitOccurred = true;
              damageDealt += enemy.damage;
              if (enemy.id === currentTargetIdRef.current) {
                targetBreached = true;
              }
            } else {
              remainingEnemies.push(enemy);
            }
          }

          if (hitOccurred) {
            sound.playDamageSound();
            setIsPlayerHit(true);
            setTimeout(() => setIsPlayerHit(false), 300);

            setStats((prev) => ({
              ...prev,
              combo: 0,
            }));

            setPlayerHp((prevHp) => {
              const nextHp = prevHp - damageDealt;
              if (nextHp <= 0) {
                setStatus('game_over');
                return 0;
              }
              return nextHp;
            });

            if (targetBreached) {
              setCurrentTargetId(null);
              setTypedInput('');
            }
          }

          // Check if floor completed: all wave enemies spawned and none remaining in arena
          if (
            floorEnemiesSpawned.current >= totalFloorEnemies.current &&
            remainingEnemies.length === 0 &&
            playerHpRef.current > 0
          ) {
            setTimeout(() => {
              setStatus((currentStatus) => {
                if (currentStatus === 'playing') {
                  return floor >= FLOOR_CONFIGS.length ? 'victory' : 'floor_clear';
                }
                return currentStatus;
              });
            }, 400);
          }

          return remainingEnemies;
        });
      }

      gameLoopRef.current = requestAnimationFrame(updateFrame);
    };

    lastTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [status, isFreezeActive, floor]);

  // Skill Trigger Execution
  const triggerSkill = useCallback(
    (skillId: 'freeze' | 'emp' | 'heal') => {
      const skill = skills.find((s) => s.id === skillId);
      if (!skill || energy < skill.energyCost || skill.currentCooldown > 0) return;

      // Deduct energy & start cooldown
      setEnergy((prev) => Math.max(0, prev - skill.energyCost));
      setSkills((prev) =>
        prev.map((s) => (s.id === skillId ? { ...s, currentCooldown: s.cooldownSeconds } : s))
      );

      if (skillId === 'freeze') {
        sound.playSkillFreeze();
        setIsFreezeActive(true);
        setTimeout(() => {
          setIsFreezeActive(false);
        }, 4000);
      } else if (skillId === 'emp') {
        sound.playSkillEMP();
        setIsEmpTriggered(true);
        setTimeout(() => setIsEmpTriggered(false), 500);

        // Wipe all minion bugs
        setEnemies((prev) => {
          const minions = prev.filter((e) => e.type === 'minion');
          const survivors = prev.filter((e) => e.type !== 'minion');

          if (minions.length > 0) {
            setStats((s) => ({
              ...s,
              score: s.score + minions.length * 100,
              enemiesDefeated: s.enemiesDefeated + minions.length,
              minionsDefeated: s.minionsDefeated + minions.length,
            }));
          }

          // Reset target if target was a minion
          if (minions.some((m) => m.id === currentTargetIdRef.current)) {
            setCurrentTargetId(null);
            setTypedInput('');
          }

          return survivors;
        });
      } else if (skillId === 'heal') {
        sound.playSkillHeal();
        setPlayerHp((prev) => Math.min(maxHp, prev + 35));
      }
    },
    [skills, energy, maxHp]
  );

  // Defeat Enemy Handler
  const defeatEnemy = useCallback(
    (target: Enemy) => {
      sound.playDefeatSound();

      // Educational Intel Log
      const intelLog: DefeatedWordLog = {
        id: `log_${Date.now()}`,
        word: target.word,
        meaning: target.meaning,
        category: target.category,
        type: target.type,
        timestamp: Date.now(),
      };
      setLatestIntel(intelLog);

      // Score bonus with combo multiplier
      setStats((prev) => {
        const nextCombo = prev.combo + 1;
        const comboMultiplier = 1 + nextCombo * 0.15;
        const earnedScore = Math.floor(target.scoreValue * comboMultiplier);
        const newCorrect = prev.correctCharsTyped + 1;
        const newTotal = prev.totalCharsTyped + 1;
        const elapsedMin = Math.max(0.1, (Date.now() - startTimeRef.current) / 60000);
        const currentWpm = Math.round((newCorrect / 5) / elapsedMin);
        const currentAcc = Math.round((newCorrect / newTotal) * 100);

        return {
          ...prev,
          score: prev.score + earnedScore,
          combo: nextCombo,
          maxCombo: Math.max(prev.maxCombo, nextCombo),
          enemiesDefeated: prev.enemiesDefeated + 1,
          minionsDefeated: target.type === 'minion' ? prev.minionsDefeated + 1 : prev.minionsDefeated,
          elitesDefeated: target.type === 'elite' ? prev.elitesDefeated + 1 : prev.elitesDefeated,
          bossesDefeated: target.type === 'boss' ? prev.bossesDefeated + 1 : prev.bossesDefeated,
          correctCharsTyped: newCorrect,
          totalCharsTyped: newTotal,
          wpm: currentWpm,
          accuracy: currentAcc,
        };
      });

      setEnergy((prev) => Math.min(maxEnergy, prev + 12));
      setCurrentTargetId(null);
      setTypedInput('');

      // Remove from active list
      setEnemies((prev) => {
        const remaining = prev.filter((e) => e.id !== target.id);
        if (
          floorEnemiesSpawned.current >= totalFloorEnemies.current &&
          remaining.length === 0 &&
          playerHpRef.current > 0
        ) {
          setTimeout(() => {
            setStatus((curr) => (curr === 'playing' ? (floor >= FLOOR_CONFIGS.length ? 'victory' : 'floor_clear') : curr));
          }, 300);
        }
        return remaining;
      });
    },
    [floor, maxEnergy]
  );

  // Register a correct key hit
  const registerCorrectKeystroke = useCallback(() => {
    setStats((prev) => {
      const newCorrect = prev.correctCharsTyped + 1;
      const newTotal = prev.totalCharsTyped + 1;
      const elapsedMin = Math.max(0.1, (Date.now() - startTimeRef.current) / 60000);
      const currentWpm = Math.round((newCorrect / 5) / elapsedMin);
      const currentAcc = Math.round((newCorrect / newTotal) * 100);

      return {
        ...prev,
        correctCharsTyped: newCorrect,
        totalCharsTyped: newTotal,
        wpm: currentWpm,
        accuracy: currentAcc,
      };
    });
    setEnergy((prev) => Math.min(maxEnergy, prev + 2));
  }, [maxEnergy]);

  // Register a wrong key hit
  const registerWrongKeystroke = useCallback(() => {
    setHasMistype(true);
    if (mistypeTimerRef.current) clearTimeout(mistypeTimerRef.current);
    mistypeTimerRef.current = setTimeout(() => setHasMistype(false), 250);

    setStats((prev) => ({
      ...prev,
      totalCharsTyped: prev.totalCharsTyped + 1,
      combo: 0,
      accuracy: Math.round((prev.correctCharsTyped / (prev.totalCharsTyped + 1)) * 100),
    }));
  }, []);

  // Process a single character input from any source
  const handleCharInput = useCallback(
    (char: string) => {
      if (statusRef.current !== 'playing') return;

      const activeEnemies = enemiesRef.current;
      const currentTarget = activeEnemies.find((e) => e.id === currentTargetIdRef.current);

      // CASE 1: No target locked yet
      if (!currentTarget) {
        // Find enemies whose word starts with this character (case-insensitive)
        const matchingEnemies = activeEnemies.filter((e) =>
          e.word.toLowerCase().startsWith(char.toLowerCase())
        );

        if (matchingEnemies.length > 0) {
          // Select enemy closest to the defense line (smallest x)
          matchingEnemies.sort((a, b) => a.x - b.x);
          const target = matchingEnemies[0];

          setCurrentTargetId(target.id);
          const matchedPrefix = target.word.slice(0, 1);
          setTypedInput(matchedPrefix);
          sound.playHitSound();

          if (matchedPrefix.toLowerCase() === target.word.toLowerCase()) {
            defeatEnemy(target);
          } else {
            registerCorrectKeystroke();
          }
        } else {
          // Invalid starting key
          sound.playErrorSound();
          registerWrongKeystroke();
        }
        return;
      }

      // CASE 2: Target is already locked
      const currentTyped = typedInputRef.current;
      const targetWord = currentTarget.word;
      const nextExpectedChar = targetWord.charAt(currentTyped.length);

      if (char.toLowerCase() === nextExpectedChar.toLowerCase()) {
        const newTyped = targetWord.slice(0, currentTyped.length + 1);
        setTypedInput(newTyped);
        sound.playHitSound();

        if (newTyped.toLowerCase() === targetWord.toLowerCase()) {
          defeatEnemy(currentTarget);
        } else {
          registerCorrectKeystroke();
        }
      } else {
        // Mistype on current locked target
        sound.playErrorSound();
        registerWrongKeystroke();
      }
    },
    [defeatEnemy, registerCorrectKeystroke, registerWrongKeystroke]
  );

  // Global Keyboard Event Listener: captures keystrokes ANYWHERE without requiring clicking input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;

      // Ignore standard browser shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Emergency skill hotkeys 1, 2, 3
      if (e.key === '1') {
        triggerSkill('freeze');
        e.preventDefault();
        return;
      }
      if (e.key === '2') {
        triggerSkill('emp');
        e.preventDefault();
        return;
      }
      if (e.key === '3') {
        triggerSkill('heal');
        e.preventDefault();
        return;
      }

      // Escape or Enter: Clear target lock
      if (e.key === 'Escape' || e.key === 'Enter') {
        setTypedInput('');
        setCurrentTargetId(null);
        e.preventDefault();
        return;
      }

      // Backspace: Delete character or clear target lock
      if (e.key === 'Backspace') {
        setTypedInput((prev) => {
          const next = prev.slice(0, -1);
          if (next.length === 0) {
            setCurrentTargetId(null);
          }
          return next;
        });
        e.preventDefault();
        return;
      }

      // Standard printable characters
      if (e.key.length === 1) {
        handleCharInput(e.key);
        if (e.key === ' ' || e.key === '/') {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, triggerSkill, handleCharInput]);

  // Input deck change handler (for IME / virtual keyboards)
  const handleInputChange = (val: string) => {
    if (status !== 'playing') return;

    if (val.length === 0) {
      setTypedInput('');
      setCurrentTargetId(null);
      return;
    }

    if (val.length > typedInput.length) {
      const addedChar = val.slice(-1);
      handleCharInput(addedChar);
    } else if (val.length < typedInput.length) {
      setTypedInput(val);
      if (val.length === 0) {
        setCurrentTargetId(null);
      }
    }
  };

  // Click on enemy in arena to focus fire
  const handleSelectTarget = (enemyId: string) => {
    const enemy = enemies.find((e) => e.id === enemyId);
    if (!enemy) return;
    setCurrentTargetId(enemy.id);
    setTypedInput('');
    sound.playHitSound();
  };

  const nextFloor = () => {
    const nextF = floor + 1;
    startGame(nextF);
  };

  const restartGame = () => {
    startGame(1);
  };

  return (
    <div
      className={`min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col font-mono ${
        crtEnabled ? 'crt-effect' : ''
      }`}
    >
      {/* Top Header Navigation & Status Bar */}
      <CyberHeader
        playerHp={playerHp}
        maxHp={maxHp}
        energy={energy}
        maxEnergy={maxEnergy}
        stats={stats}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        crtEnabled={crtEnabled}
        onToggleCrt={() => setCrtEnabled(!crtEnabled)}
        onOpenGDD={() => setIsGDDOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />

      {/* Main Gameplay Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-4">
        {/* Dynamic Educational Intel Ticker */}
        <KnowledgeDrawer
          latestIntel={latestIntel}
          isOpen={isGlossaryOpen}
          onClose={() => setIsGlossaryOpen(false)}
          learnedCount={stats.enemiesDefeated}
        />

        {/* Visual Arena Canvas */}
        <CyberDungeonCanvas
          enemies={enemies}
          currentTargetId={currentTargetId}
          typedInput={typedInput}
          isFreezeActive={isFreezeActive}
          isEmpTriggered={isEmpTriggered}
          isPlayerHit={isPlayerHit}
          floor={floor}
          stats={stats}
          onSelectTarget={handleSelectTarget}
        />

        {/* Typing Input Deck & Hotkey Skills Bar */}
        <CyberKeyboardDeck
          typedInput={typedInput}
          onInputChange={handleInputChange}
          energy={energy}
          skills={skills}
          onTriggerSkill={triggerSkill}
          combo={stats.combo}
          isTargetActive={currentTargetId !== null}
          hasMistype={hasMistype}
        />
      </main>

      {/* Interactive Status Modals (Start Menu, Floor Clear, Game Over, Victory) */}
      <CyberModals
        status={status}
        stats={stats}
        onStartGame={() => startGame(1)}
        onRestartGame={restartGame}
        onNextFloor={nextFloor}
        onOpenGDD={() => setIsGDDOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />

      {/* Game Design Document & Standalone Prototype Modal */}
      <GDDModal isOpen={isGDDOpen} onClose={() => setIsGDDOpen(false)} />
    </div>
  );
}

export default App;
