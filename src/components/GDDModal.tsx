import React, { useState } from 'react';
import { X, Copy, Check, FileText, Code2, Layers, Cpu, Database, CheckCircle2 } from 'lucide-react';
import { VANILLA_PROTOTYPE_CODE } from '../data/standalonePrototype';
import { WORD_BANK } from '../data/wordBank';

interface GDDModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GDDModal: React.FC<GDDModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'gdd' | 'data' | 'code'>('gdd');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(VANILLA_PROTOTYPE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
      <div className="w-full max-w-5xl max-h-[92vh] bg-neutral-900 border-2 border-purple-500/60 rounded-xl flex flex-col overflow-hidden shadow-2xl shadow-purple-950/80 font-mono text-neutral-200">
        
        {/* Top Header */}
        <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm sm:text-base">
            <FileText className="w-5 h-5" />
            <span>DOKUMENTASI DESAIN GAME & PROTOTYPE CODE</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-neutral-950/70 border-b border-neutral-800 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('gdd')}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'gdd'
                ? 'bg-purple-600 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bagian 1: Game Design Document (GDD)</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'data'
                ? 'bg-purple-600 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Bagian 2: Struktur Data & Bank Kata</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'code'
                ? 'bg-purple-600 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Bagian 3: Single-File Vanilla HTML/JS</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm font-sans leading-relaxed bg-neutral-900/60">
          {activeTab === 'gdd' && (
            <div className="space-y-6">
              {/* Overview */}
              <div className="bg-neutral-950 p-4 rounded-lg border border-purple-500/30">
                <h3 className="text-base font-bold text-purple-400 font-mono mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> 1. OVERVIEW & IDENTITAS GAME
                </h3>
                <p className="text-neutral-300">
                  <strong>Judul Game:</strong> Ketik Cepat: Cyber Dungeon Crawler<br />
                  <strong>Genre:</strong> Typing Action / Dungeon Crawler Edukasi<br />
                  <strong>Target Audiens:</strong> Siswa, mahasiswa komputer, programmer pemula, dan siapa saja yang ingin melatih kecepatan ketik 10 jari sembari memahami konsep dasar ilmu komputer.<br />
                  <strong>Platform:</strong> Web Browser (HTML5 Canvas / DOM / Vanilla JS / React).
                </p>
              </div>

              {/* Core Loop */}
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <h3 className="text-base font-bold text-emerald-400 font-mono mb-2">
                  2. CORE GAMEPLAY LOOP
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs font-mono my-3">
                  <div className="p-3 bg-neutral-900 border border-neutral-700 rounded">
                    <span className="text-emerald-400 font-bold block mb-1">1. DETEKSI ANCAMAN</span>
                    Bug/Malware spawn dari kanan membawa kata di atas kepalanya.
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-700 rounded">
                    <span className="text-amber-400 font-bold block mb-1">2. KETIK TARGET</span>
                    Pemain mengetik huruf kata tersebut secara akurat & cepat.
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-700 rounded">
                    <span className="text-cyan-400 font-bold block mb-1">3. EKSEKUSI & EDUKASI</span>
                    Musuh meledak! Ticker menampilkan arti/fungsi teknis kata tersebut.
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-700 rounded">
                    <span className="text-purple-400 font-bold block mb-1">4. COMBO & PROGRESI</span>
                    Streak tanpa salah mengisi bar Skill darurat dan membuka lantai berikutnya.
                  </div>
                </div>
                <p className="text-neutral-300 text-xs mt-2">
                  <strong>Fail State:</strong> Jika musuh berhasil mencapai garis batas pertahanan terminal pemain (Core Defense), HP pemain berkurang. Jika HP menyentuh 0, sistem lumpuh (Game Over).
                </p>
              </div>

              {/* UI/UX Wireframe Plan */}
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <h3 className="text-base font-bold text-cyan-400 font-mono mb-2">
                  3. RENCANA UI / UX (LAYOUT WIREFRAME)
                </h3>
                <ul className="list-disc list-inside text-neutral-300 space-y-1.5 text-xs">
                  <li><strong>Header HUD (Top):</strong> Menampilkan Health Bar pemain, Overcharge Energy Bar, Lantai (Sector) saat ini, Skor terakumulasi, serta tombol audio dan filter CRT retro.</li>
                  <li><strong>Cyber Dungeon Arena (Center):</strong> Grid perspektif laboratorium komputer. Di sisi kiri terdapat Core Defense pemain. Musuh berjalan di 3 jalur (lanes) menuju core dengan balon teks yang menyorot karakter yang telah diketik secara real-time.</li>
                  <li><strong>Control Deck (Bottom):</strong> Input bar terminal utama dengan status target-lock, combo streak, dan 3 tombol shortcut skill aktif (Freeze, EMP Bomb, Nano Repair).</li>
                  <li><strong>Knowledge Terminal (Floating/Ticker):</strong> Menyajikan intisari edukasi instan setiap kali musuh berhasil dibasmi.</li>
                </ul>
              </div>

              {/* Leveling & Difficulty Curve */}
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <h3 className="text-base font-bold text-amber-400 font-mono mb-2">
                  4. SISTEM LEVELING & KURVA KESULITAN ADAPTIF
                </h3>
                <div className="space-y-2 text-xs text-neutral-300">
                  <p>
                    <strong>Lantai 1 (Sector 01 - Motherboard):</strong> Kecepatan spawn lambat (2.8s), didominasi oleh musuh <em>Minion</em> (kata 3-5 huruf: BUG, CPU, RAM). Membangun rasa percaya diri pemain.
                  </p>
                  <p>
                    <strong>Lantai 2 (Sector 02 - Network Switch):</strong> Kecepatan naik 25%, muncul musuh <em>Elite</em> (kata 6-9 huruf: FIREWALL, MALWARE). Mengharuskan pemain menjaga ritme ketukan.
                  </p>
                  <p>
                    <strong>Lantai 3 (Sector 03 - Firewall Bastion):</strong> Kecepatan naik 45%, gelombang kombinasi padat. Pemain didorong menggunakan skill Freeze dan EMP.
                  </p>
                  <p>
                    <strong>Lantai 4 (Sector 04 - Mainframe Core [BOSS]):</strong> Kemunculan AI Zero-Day Corrupted Boss dengan kalimat perintah teknis (<code>system.exit()</code>, <code>sudo rm -rf /bug</code>, <code>kill -9 malware</code>).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <h3 className="text-base font-bold text-cyan-400 font-mono mb-2">
                  STRUKTUR DATA ENTITAS (TypeScript / JavaScript Schema)
                </h3>
                <pre className="bg-black p-3 rounded text-xs text-emerald-400 font-mono overflow-x-auto">
{`interface WordItem {
  word: string;         // Kata atau sintaks yang harus diketik
  meaning: string;      // Arti/fungsi edukasi dalam Bahasa Indonesia
  category: 'hardware' | 'networking' | 'security' | 'programming' | 'system';
  difficulty: 'minion' | 'elite' | 'boss';
}

interface EnemyEntity {
  id: string;
  word: string;
  type: 'minion' | 'elite' | 'boss';
  speed: number;        // Laju pergerakan piksel / frame
  x: number;            // Posisi horizontal
  lane: number;         // Jalur lintasan (0, 1, 2)
  typedIndex: number;   // Karakter yang berhasil dicocokkan
  damage: number;       // Kerusakan saat menyentuh core pemain
}`}
                </pre>
              </div>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <h3 className="text-base font-bold text-purple-400 font-mono mb-2">
                  DISTRIBUSI BANK KATA TERDAFTAR ({WORD_BANK.length} Kosakata)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Minions */}
                  <div className="bg-neutral-900 p-3 rounded border border-emerald-500/30">
                    <span className="text-emerald-400 font-bold font-mono text-xs block mb-1">
                      KROCO (MINION: 3-5 Huruf)
                    </span>
                    <p className="text-[11px] text-neutral-400 mb-2">Istilah perangkat keras, memori, & komputasi dasar.</p>
                    <div className="flex flex-wrap gap-1">
                      {WORD_BANK.filter(w => w.difficulty === 'minion').map((w, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-black rounded text-[11px] font-mono text-emerald-300">
                          {w.word}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Elites */}
                  <div className="bg-neutral-900 p-3 rounded border border-purple-500/30">
                    <span className="text-purple-400 font-bold font-mono text-xs block mb-1">
                      SEDANG (ELITE: 6-9 Huruf)
                    </span>
                    <p className="text-[11px] text-neutral-400 mb-2">Istilah keamanan siber, enkripsi, & jaringan.</p>
                    <div className="flex flex-wrap gap-1">
                      {WORD_BANK.filter(w => w.difficulty === 'elite').map((w, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-black rounded text-[11px] font-mono text-purple-300">
                          {w.word}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bosses */}
                  <div className="bg-neutral-900 p-3 rounded border border-rose-500/30">
                    <span className="text-rose-400 font-bold font-mono text-xs block mb-1">
                      BOSS (Sintaks Kode / CLI)
                    </span>
                    <p className="text-[11px] text-neutral-400 mb-2">Perintah bash, pemanggilan fungsi, & query database.</p>
                    <div className="flex flex-wrap gap-1">
                      {WORD_BANK.filter(w => w.difficulty === 'boss').map((w, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-black rounded text-[11px] font-mono text-rose-300">
                          {w.word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 font-mono">
                    STANDALONE SINGLE-FILE HTML + CSS + VANILLA JAVASCRIPT
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Bisa disimpan menjadi file <code>index.html</code> dan dijalankan langsung di browser mana pun tanpa build tool atau dependency!
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'BERHASIL DISALIN!' : 'SALIN SEMUA KODE'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="bg-black border border-neutral-800 p-4 rounded-lg text-xs text-emerald-300 font-mono overflow-x-auto max-h-[500px]">
                  {VANILLA_PROTOTYPE_CODE}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-950 px-4 py-2.5 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Cyber Dungeon Crawler Architecture Document v1.0</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-bold transition-colors"
          >
            TUTUP DOKUMENTASI
          </button>
        </div>

      </div>
    </div>
  );
};
