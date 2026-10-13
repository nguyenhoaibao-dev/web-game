/**
 * Cartoonish Snake Game Logic
 * Rắn Săn Mồi Bự với đồ họa Neubrutalism & Particle FX.
 */

class SnakeGame {
  constructor() {
    this.canvas = document.getElementById('snake-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.gridSize = 16; // 16x16 ô
    this.cellSize = 20; // 20px mỗi ô => 320x320 canvas
    this.canvas.width = this.gridSize * this.cellSize;
    this.canvas.height = this.gridSize * this.cellSize;

    this.score = 0;
    this.highScore = 0;
    this.snake = [];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.apple = { x: 8, y: 8 };
    this.particles = [];
    this.gameLoop = null;
    this.speed = 130; // ms per tick
    this.isGameOver = false;
    this.audioCtx = null;
    this.isMuted = false;

    this.player = this.loadPlayer();

    // DOM Elements
    this.elScore = document.getElementById('snake-score');
    this.elPlayerName = document.getElementById('player-name-label');
    this.elPlayerAvatar = document.getElementById('player-avatar-small');
    this.elBtnBack = document.getElementById('btn-back-portal');
    this.elBtnSound = document.getElementById('btn-sound-toggle');
    this.elModal = document.getElementById('game-over-modal');
    this.elFinalScore = document.getElementById('final-score');
    this.elFinalRecord = document.getElementById('final-record');
    this.elBtnRestart = document.getElementById('btn-restart');
    this.elBtnExit = document.getElementById('btn-exit');

    this.initControls();
    this.startNewGame();
  }

  loadPlayer() {
    try {
      const raw = localStorage.getItem('ARCADE_WEB_player_profile');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }
    return { name: 'Người Chơi', avatar: '🐍', highScores: { 'snake': 0 } };
  }

  initSound() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playSound(type) {
    if (this.isMuted) return;
    this.initSound();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    if (type === 'eat') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'die') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  initControls() {
    if (this.elPlayerName) this.elPlayerName.textContent = this.player.name || 'Người Chơi';
    if (this.elPlayerAvatar) this.elPlayerAvatar.textContent = this.player.avatar || '🐍';

    // Keyboard listener
    window.addEventListener('keydown', (e) => {
      this.handleKey(e.key);
    });

    // Touch D-Pad
    document.getElementById('btn-up')?.addEventListener('click', () => this.setDirection(0, -1));
    document.getElementById('btn-down')?.addEventListener('click', () => this.setDirection(0, 1));
    document.getElementById('btn-left')?.addEventListener('click', () => this.setDirection(-1, 0));
    document.getElementById('btn-right')?.addEventListener('click', () => this.setDirection(1, 0));

    // Sound toggle
    this.elBtnSound?.addEventListener('click', () => {
      this.isMuted = !this.isMuted;
      this.elBtnSound.textContent = this.isMuted ? '🔇' : '🔊';
    });

    // Exit / Restart
    this.elBtnBack?.addEventListener('click', () => this.exitGame());
    this.elBtnExit?.addEventListener('click', () => this.exitGame());
    this.elBtnRestart?.addEventListener('click', () => this.startNewGame());

    // Swipe gestures
    let touchStartX = 0;
    let touchStartY = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 25) {
        if (dx > 0) this.setDirection(1, 0);
        else this.setDirection(-1, 0);
      } else if (Math.abs(dy) > 25) {
        if (dy > 0) this.setDirection(0, 1);
        else this.setDirection(0, -1);
      }
    }, { passive: true });
  }

  handleKey(key) {
    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.setDirection(0, -1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.setDirection(0, 1);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.setDirection(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.setDirection(1, 0);
        break;
    }
  }

  setDirection(x, y) {
    // Không cho quay đầu 180 độ
    if (x !== -this.dir.x && y !== -this.dir.y) {
      this.nextDir = { x, y };
    }
  }

  startNewGame() {
    this.score = 0;
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.isGameOver = false;
    this.particles = [];

    // Rắn ban đầu có 3 đốt
    this.snake = [
      { x: 5, y: 7 },
      { x: 4, y: 7 },
      { x: 3, y: 7 }
    ];

    this.spawnApple();
    this.updateScoreUI();

    if (this.elModal) this.elModal.classList.remove('active');

    clearInterval(this.gameLoop);
    this.gameLoop = setInterval(() => this.tick(), this.speed);
    this.render();
  }

  spawnApple() {
    let empty = false;
    while (!empty) {
      const x = Math.floor(Math.random() * this.gridSize);
      const y = Math.floor(Math.random() * this.gridSize);
      const onSnake = this.snake.some(segment => segment.x === x && segment.y === y);
      if (!onSnake) {
        this.apple = { x, y };
        empty = true;
      }
    }
  }

  tick() {
    if (this.isGameOver) return;

    this.dir = { ...this.nextDir };
    const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };

    // Kiểm tra đâm tường
    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      this.triggerGameOver('Rắn đã va vào hàng rào bảo vệ!');
      return;
    }

    // Kiểm tra cắn vào đuôi
    if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      this.triggerGameOver('Rắn đã tự cắn vào chính mình!');
      return;
    }

    this.snake.unshift(head);

    // Kiểm tra ăn táo
    if (head.x === this.apple.x && head.y === this.apple.y) {
      this.score += 10;
      this.updateScoreUI();
      this.playSound('eat');
      this.spawnParticles(this.apple.x * this.cellSize + 10, this.apple.y * this.cellSize + 10);
      this.spawnApple();
    } else {
      this.snake.pop();
    }

    this.render();
  }

  spawnParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: ['#FF4A3F', '#FFC000', '#FFF'][Math.floor(Math.random() * 3)],
        life: 12
      });
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Vẽ cỏ bàn cờ hai tông màu xanh
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#A3D977' : '#97CD6B';
        ctx.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
      }
    }

    // 2. Vẽ Táo đỏ Cartoonish
    const ax = this.apple.x * this.cellSize + this.cellSize / 2;
    const ay = this.apple.y * this.cellSize + this.cellSize / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ax, ay, this.cellSize / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = '#FF4A3F';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#111111';
    ctx.stroke();

    // Đốm sáng trên táo
    ctx.beginPath();
    ctx.arc(ax - 3, ay - 3, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    // 3. Vẽ Thân Rắn
    for (let i = this.snake.length - 1; i >= 0; i--) {
      const seg = this.snake[i];
      const sx = seg.x * this.cellSize;
      const sy = seg.y * this.cellSize;
      const isHead = (i === 0);

      ctx.save();
      ctx.fillStyle = isHead ? '#00A884' : '#00C49A';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 2.5;

      // Bo góc cartoonish
      ctx.beginPath();
      ctx.roundRect(sx + 1, sy + 1, this.cellSize - 2, this.cellSize - 2, 6);
      ctx.fill();
      ctx.stroke();

      // Vẽ Mắt Rắn nếu là Đầu
      if (isHead) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1.5;

        // Vị trí 2 mắt lồi ra theo hướng
        let eye1 = { x: sx + 5, y: sy + 5 };
        let eye2 = { x: sx + 15, y: sy + 5 };
        if (this.dir.y !== 0) {
          eye1 = { x: sx + 5, y: sy + (this.dir.y > 0 ? 12 : 5) };
          eye2 = { x: sx + 15, y: sy + (this.dir.y > 0 ? 12 : 5) };
        }

        [eye1, eye2].forEach(eye => {
          ctx.beginPath();
          ctx.arc(eye.x, eye.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Con ngươi đen
          ctx.beginPath();
          ctx.arc(eye.x, eye.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = '#111';
          ctx.fill();
        });
      }
      ctx.restore();
    }

    // 4. Vẽ Hạt nổ Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      ctx.save();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  updateScoreUI() {
    if (this.elScore) {
      this.elScore.textContent = `${this.score}đ`;
    }
  }

  triggerGameOver(reason) {
    this.isGameOver = true;
    clearInterval(this.gameLoop);
    this.playSound('die');

    // Gửi điểm số ra Portal chính
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'ARCADE_RECORD_SCORE',
        gameId: 'snake',
        score: this.score
      }, '*');
    }

    const currentHigh = Math.max(this.score, (this.player.highScores && this.player.highScores['snake']) || 0);

    if (this.elModal) {
      const elReason = document.getElementById('modal-reason');
      if (elReason) elReason.textContent = reason;
      if (this.elFinalScore) this.elFinalScore.textContent = this.score;
      if (this.elFinalRecord) this.elFinalRecord.textContent = currentHigh;
      this.elModal.classList.add('active');
    }
  }

  exitGame() {
    clearInterval(this.gameLoop);
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'ARCADE_EXIT_GAME' }, '*');
    } else {
      window.location.href = '../../../index.html';
    }
  }
}

function bootSnake() {
  new SnakeGame();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootSnake);
} else {
  bootSnake();
}
