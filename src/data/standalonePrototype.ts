export const VANILLA_PROTOTYPE_CODE = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ketik Cepat Dungeon Crawler - Standalone Prototype</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0d1117;
      color: #39ff14;
      font-family: 'Courier New', Courier, monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
    }
    #game-container {
      width: 100%;
      max-width: 800px;
      border: 2px solid #39ff14;
      border-radius: 8px;
      background: #030712;
      box-shadow: 0 0 20px rgba(57, 255, 20, 0.25);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    header {
      background: #111827;
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #1f2937;
      font-size: 14px;
    }
    #arena {
      position: relative;
      width: 100%;
      height: 380px;
      background: radial-gradient(circle at center, #0f172a 0%, #030712 100%);
      overflow: hidden;
      border-bottom: 1px solid #1f2937;
    }
    #player-core {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 70px;
      border: 2px solid #00ffff;
      background: rgba(0, 255, 255, 0.1);
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #00ffff;
      text-align: center;
      box-shadow: 0 0 10px #00ffff;
    }
    .enemy-unit {
      position: absolute;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: left 0.05s linear;
    }
    .enemy-tag {
      background: rgba(0,0,0,0.85);
      border: 1px solid #ff0055;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: bold;
      color: #fff;
      white-space: nowrap;
      margin-bottom: 4px;
    }
    .enemy-tag.targeted {
      border-color: #ffff00;
      box-shadow: 0 0 10px #ffff00;
    }
    .typed-char { color: #39ff14; text-shadow: 0 0 6px #39ff14; }
    .remaining-char { color: #94a3b8; }
    .enemy-sprite {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      filter: drop-shadow(0 0 6px rgba(255,0,85,0.7));
    }
    #control-panel {
      padding: 16px;
      background: #0b0f19;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    #typing-input {
      width: 100%;
      background: #030712;
      border: 2px solid #39ff14;
      color: #39ff14;
      padding: 12px 16px;
      font-family: inherit;
      font-size: 18px;
      outline: none;
      border-radius: 4px;
      text-transform: lowercase;
    }
    #typing-input:focus {
      box-shadow: 0 0 12px rgba(57, 255, 20, 0.4);
    }
    #knowledge-box {
      font-size: 13px;
      color: #94a3b8;
      background: #111827;
      padding: 10px 14px;
      border-radius: 4px;
      border-left: 3px solid #00ffff;
      min-height: 42px;
    }
    #game-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.85);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 10;
    }
    button.cyber-btn {
      background: #39ff14;
      color: #000;
      border: none;
      padding: 10px 24px;
      font-family: inherit;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;
    }
    button.cyber-btn:hover { background: #52ff33; }
  </style>
</head>
<body>

<div id="game-container">
  <header>
    <div>HP: <span id="hp-val" style="color: #ff0055;">100</span> / 100</div>
    <div>SKOR: <span id="score-val" style="color: #ffff00;">0</span></div>
    <div>COMBO: <span id="combo-val" style="color: #00ffff;">0x</span></div>
    <div>WAVE: <span id="wave-val">1</span></div>
  </header>

  <div id="arena">
    <div id="player-core">CORE<br>DEF</div>
    <div id="game-overlay">
      <h2 id="overlay-title" style="color: #39ff14;">CYBER DUNGEON CRAWLER</h2>
      <p id="overlay-desc" style="color: #94a3b8; font-size: 13px; text-align: center; max-width: 400px;">
        Ketik kata musuh sebelum mereka menembus inti data pertahanan Anda!
      </p>
      <button class="cyber-btn" id="start-btn" onclick="startGame()">MULAI EKSEKUSI</button>
    </div>
  </div>

  <div id="control-panel">
    <input type="text" id="typing-input" placeholder="Ketik kata musuh di sini..." autocomplete="off" spellcheck="false" autofocus>
    <div id="knowledge-box">
      <strong>[KNOWLEDGE LOG]:</strong> Siap menyerap data intelijen...
    </div>
  </div>
</div>

<script>
  // 1. DATA BANK KATA & MUSUH (Minion, Elite, Boss)
  const WORD_BANK = [
    { word: "bug", meaning: "Kesalahan logika atau sintaks pada program komputer.", type: "minion", hp: 1, speed: 0.6, icon: "👾" },
    { word: "ram", meaning: "Random Access Memory, memori utama akses cepat komputer.", type: "minion", hp: 1, speed: 0.65, icon: "💾" },
    { word: "code", meaning: "Baris instruksi yang ditulis programmer untuk komputer.", type: "minion", hp: 1, speed: 0.55, icon: "📜" },
    { word: "data", meaning: "Fakta mentah digital yang disimpan atau diproses sistem.", type: "minion", hp: 1, speed: 0.7, icon: "📦" },
    { word: "ping", meaning: "Perintah utilitas untuk menguji koneksi & latensi jaringan.", type: "minion", hp: 1, speed: 0.65, icon: "⚡" },
    { word: "firewall", meaning: "Sistem keamanan pencegah lalu lintas jaringan tak diizinkan.", type: "elite", hp: 1, speed: 0.4, icon: "🛡️" },
    { word: "malware", meaning: "Perangkat lunak berbahaya dirancang merusak sistem.", type: "elite", hp: 1, speed: 0.38, icon: "🦠" },
    { word: "hacker", meaning: "Individu yang memiliki keahlian mendalam menembus sistem data.", type: "elite", hp: 1, speed: 0.42, icon: "🎭" },
    { word: "encrypt", meaning: "Mengamankan data dengan mengubahnya menjadi sandi rahasia.", type: "elite", hp: 1, speed: 0.45, icon: "🔒" },
    { word: "system.exit()", meaning: "Perintah pemanggilan terminasi paksa seluruh proses berjalan.", type: "boss", hp: 1, speed: 0.22, icon: "💀" },
    { word: "disable_virus()", meaning: "Fungsi mematikan thread eksekusi payload virus di memori.", type: "boss", hp: 1, speed: 0.2, icon: "☠️" }
  ];

  // 2. STATE VARIABEL
  let playerHp = 100;
  let score = 0;
  let combo = 0;
  let wave = 1;
  let enemies = [];
  let gameRunning = false;
  let spawnTimer = null;
  let gameLoopId = null;
  const arena = document.getElementById("arena");
  const inputElem = document.getElementById("typing-input");
  const knowledgeElem = document.getElementById("knowledge-box");

  // 3. LOGIKA SPAWN MUSUH
  function spawnEnemy() {
    if (!gameRunning) return;
    const pool = wave >= 3 ? WORD_BANK : (wave >= 2 ? WORD_BANK.filter(w => w.type !== 'boss') : WORD_BANK.filter(w => w.type === 'minion'));
    const template = pool[Math.floor(Math.random() * pool.length)];

    const id = "enemy_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
    const lanes = [50, 130, 210, 290];
    
    // Pilih jalur dengan jarak terjauh dari titik spawn (anti tumpuk)
    let bestLane = lanes[0];
    let maxDistance = -999;
    const spawnX = (arena.clientWidth > 200 ? arena.clientWidth : 720) - 100;

    for (let laneY of lanes) {
      const enemiesInLane = enemies.filter(e => e.y === laneY);
      if (enemiesInLane.length === 0) {
        bestLane = laneY;
        break;
      }
      const maxX = Math.max(...enemiesInLane.map(e => e.x));
      const dist = spawnX - maxX;
      if (dist > maxDistance) {
        maxDistance = dist;
        bestLane = laneY;
      }
    }

    const enemy = {
      id,
      word: template.word,
      meaning: template.meaning,
      type: template.type,
      speed: template.speed + (wave * 0.08),
      x: spawnX,
      y: bestLane,
      icon: template.icon,
      typedChars: 0
    };

    enemies.push(enemy);

    const el = document.createElement("div");
    el.id = id;
    el.className = "enemy-unit";
    el.style.left = enemy.x + "px";
    el.style.top = enemy.y + "px";
    el.innerHTML = '<div class="enemy-tag"><span class="remaining-char">' + enemy.word + '</span></div><div class="enemy-sprite">' + enemy.icon + '</div>';
    arena.appendChild(el);

    const nextInterval = Math.max(1400, 2800 - (wave * 250));
    spawnTimer = setTimeout(spawnEnemy, nextInterval);
  }

  // 4. GAME LOOP (UPDATE POSISI & CEK COLLISION)
  function gameLoop() {
    if (!gameRunning) return;

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.x -= e.speed;

      // Anti-tumpuk di jalur yang sama
      for (let j = 0; j < enemies.length; j++) {
        if (i !== j && enemies[j].y === e.y && enemies[j].x < e.x) {
          if (e.x - enemies[j].x < 80) {
            e.x = enemies[j].x + 80;
          }
        }
      }

      const el = document.getElementById(e.id);
      if (el) el.style.left = e.x + "px";

      // Jika musuh menembus player (x <= 60px)
      if (e.x <= 60) {
        playerHp -= (e.type === 'boss' ? 30 : (e.type === 'elite' ? 15 : 10));
        combo = 0;
        updateHUD();
        if (el) el.remove();
        enemies.splice(i, 1);

        if (playerHp <= 0) {
          gameOver();
          return;
        }
      }
    }

    gameLoopId = requestAnimationFrame(gameLoop);
  }

  // 5. INPUT KETIK REAL-TIME
  inputElem.addEventListener("input", function(evt) {
    if (!gameRunning) return;
    const typedText = this.value.trim().toLowerCase();
    let target = null;

    // Cari musuh yang diawali dengan kata yang sedang diketik
    for (let e of enemies) {
      if (e.word.toLowerCase().startsWith(typedText)) {
        target = e;
        break;
      }
    }

    // Update highlight teks musuh
    enemies.forEach(e => {
      const el = document.getElementById(e.id);
      if (!el) return;
      const tag = el.querySelector(".enemy-tag");
      if (e === target) {
        tag.classList.add("targeted");
        const matched = e.word.substring(0, typedText.length);
        const remaining = e.word.substring(typedText.length);
        tag.innerHTML = '<span class="typed-char">' + matched + '</span><span class="remaining-char">' + remaining + '</span>';
      } else {
        tag.classList.remove("targeted");
        tag.innerHTML = '<span class="remaining-char">' + e.word + '</span>';
      }
    });

    // Jika kata selesai diketik secara lengkap
    if (target && typedText === target.word.toLowerCase()) {
      score += (target.type === 'boss' ? 300 : (target.type === 'elite' ? 150 : 50)) * (1 + combo * 0.1);
      combo++;
      if (score > wave * 500) wave++;
      
      // Edukasi log
      knowledgeElem.innerHTML = '<strong>[INTEL DITEMUKAN - ' + target.word.toUpperCase() + ']:</strong> ' + target.meaning;
      
      // Hapus musuh
      const el = document.getElementById(target.id);
      if (el) el.remove();
      enemies = enemies.filter(item => item.id !== target.id);

      this.value = "";
      updateHUD();
    }
  });

  function updateHUD() {
    document.getElementById("hp-val").innerText = Math.max(0, playerHp);
    document.getElementById("score-val").innerText = Math.floor(score);
    document.getElementById("combo-val").innerText = combo + "x";
    document.getElementById("wave-val").innerText = wave;
  }

  function startGame() {
    playerHp = 100;
    score = 0;
    combo = 0;
    wave = 1;
    enemies.forEach(e => {
      const el = document.getElementById(e.id);
      if (el) el.remove();
    });
    enemies = [];
    gameRunning = true;
    document.getElementById("game-overlay").style.display = "none";
    updateHUD();
    inputElem.value = "";
    inputElem.focus();
    spawnEnemy();
    gameLoop();
  }

  function gameOver() {
    gameRunning = false;
    clearTimeout(spawnTimer);
    cancelAnimationFrame(gameLoopId);
    document.getElementById("overlay-title").innerText = "SISTEM DILUMPUHKAN (GAME OVER)";
    document.getElementById("overlay-title").style.color = "#ff0055";
    document.getElementById("overlay-desc").innerText = "Skor Akhir: " + Math.floor(score) + " | Gelombang: " + wave;
    document.getElementById("start-btn").innerText = "REBOOT ULANG";
    document.getElementById("game-overlay").style.display = "flex";
  }
</script>
</body>
</html>`;
