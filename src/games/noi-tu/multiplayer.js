/**
 * Word Chain Multiplayer Manager (Real-time Room PIN Battle Royale)
 * Quản lý kết nối WebSocket, Phòng chờ, Ván đấu Đấu Sinh Tồn và Trao Thưởng.
 */
import { sounds } from './audio.js';

export class MultiplayerManager {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.ws = null;
    this.myPlayerId = null;
    this.currentRoom = null;
    this.isMyTurn = false;
    this.isEliminated = false;
    this.currentTurnPlayerId = null;
    this.currentWord = '';
    this.targetSyllable = '';
    this.timeLeft = 12;

    this.playerProfile = this.loadPlayerProfile();
    this.setupUrlRoomCheck();
  }

  loadPlayerProfile() {
    try {
      const raw = localStorage.getItem('ARCADE_WEB_player_profile');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Profile read err:', e);
    }
    return { name: 'Người Chơi', avatar: '🐱', coins: 100 };
  }

  setupUrlRoomCheck() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');
    if (roomFromUrl) {
      this.pendingRoomCode = roomFromUrl;
    }
  }

  /**
   * Kết nối WebSocket tới server
   */
  connect(onOpenCallback) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      if (onOpenCallback && this.ws.readyState === WebSocket.OPEN) onOpenCallback();
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:3000';
    const wsUrl = `${protocol}//${host}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ Đã kết nối WebSocket thành công:', wsUrl);
        if (onOpenCallback) onOpenCallback();
        if (this.pendingRoomCode) {
          this.joinRoom(this.pendingRoomCode);
          this.pendingRoomCode = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleServerMessage(msg);
        } catch (e) {
          console.error('Lỗi phân tích tin nhắn từ server:', e);
        }
      };

      this.ws.onclose = () => {
        console.warn('⚠️ Mất kết nối WebSocket tới server!');
        this.showToast('Mất kết nối tới máy chủ phòng!');
      };

      this.ws.onerror = (err) => {
        console.error('WS Error:', err);
        this.showToast('Lỗi kết nối máy chủ!');
      };
    } catch (err) {
      console.error('Không thể tạo kết nối WebSocket:', err);
      this.showToast('Không thể kết nối WebSocket!');
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      this.showToast('Đang kết nối lại máy chủ...');
      this.connect(() => {
        this.ws.send(JSON.stringify(data));
      });
    }
  }

  createRoom(turnTimeLimit = 12) {
    this.send({
      type: 'CREATE_ROOM',
      playerName: this.playerProfile.name,
      playerAvatar: this.playerProfile.avatar,
      turnTimeLimit: Number(turnTimeLimit) || 12
    });
  }

  joinRoom(roomCode) {
    const cleanCode = (roomCode || '').trim();
    if (!cleanCode || cleanCode.length !== 4) {
      this.showToast('Mã PIN phải gồm 4 chữ số!');
      return;
    }
    this.send({
      type: 'JOIN_ROOM',
      roomCode: cleanCode,
      playerName: this.playerProfile.name,
      playerAvatar: this.playerProfile.avatar
    });
  }

  toggleReady() {
    this.send({ type: 'TOGGLE_READY' });
  }

  startMatch() {
    this.send({ type: 'START_MATCH' });
  }

  submitWord(word) {
    this.send({
      type: 'SUBMIT_WORD',
      word: word
    });
  }

  giveUp() {
    this.send({ type: 'GIVE_UP' });
  }

  returnToLobby() {
    this.send({ type: 'RETURN_TO_LOBBY' });
  }

  leaveRoom() {
    this.send({ type: 'LEAVE_ROOM' });
    this.currentRoom = null;
    this.myPlayerId = null;
    this.isEliminated = false;
    this.closeAllModals();
  }

  closeAllModals() {
    document.getElementById('game-over-modal')?.classList.remove('active');
    document.getElementById('mp-game-over-modal')?.classList.remove('active');
    document.getElementById('mp-room-modal')?.classList.remove('active');
    document.getElementById('mp-entry-modal')?.classList.remove('active');
  }

  closeMatchOverModal() {
    document.getElementById('mp-game-over-modal')?.classList.remove('active');
    document.getElementById('game-over-modal')?.classList.remove('active');
  }

  /**
   * Xử lý gói tin từ server
   */
  handleServerMessage(msg) {
    switch (msg.type) {
      case 'ROOM_CREATED':
      case 'ROOM_JOINED':
        this.myPlayerId = msg.playerId;
        this.currentRoom = msg.room;
        this.isEliminated = false;
        sounds.playPop();
        this.closeMatchOverModal();
        this.renderLobby();
        break;

      case 'ROOM_UPDATE':
        this.currentRoom = msg.room;
        if (msg.event) {
          this.showToast(msg.event);
        }
        if (this.currentRoom.state === 'LOBBY') {
          this.closeMatchOverModal();
          this.isEliminated = false;
          this.renderLobby();
        } else if (this.currentRoom.state === 'PLAYING') {
          this.closeAllModals();
          this.renderTurnTracker();
        }
        break;

      case 'MATCH_STARTED':
        this.closeAllModals();
        this.currentRoom = msg.room;
        this.currentWord = msg.startWord;
        this.targetSyllable = msg.targetSyllable;
        this.currentTurnPlayerId = msg.currentTurnPlayerId;
        this.isEliminated = false;
        sounds.playCorrect();
        this.startMatchUI(msg);
        break;

      case 'TURN_TICK':
        this.timeLeft = msg.timeLeft;
        this.updateTimerUI(msg.timeLeft);
        if (msg.timeLeft <= 3 && msg.timeLeft > 0) {
          sounds.playTick();
        }
        break;

      case 'WORD_ACCEPTED':
        sounds.playCorrect();
        this.currentWord = msg.word;
        this.handleWordAcceptedUI(msg);
        break;

      case 'WORD_REJECTED':
        sounds.playError();
        this.showToast(`❌ ${msg.reason}`);
        this.unlockInputForRetry();
        break;

      case 'NEXT_TURN':
        this.currentTurnPlayerId = msg.currentTurnPlayerId;
        this.currentWord = msg.currentWord;
        this.targetSyllable = msg.targetSyllable;
        this.timeLeft = msg.timeLeft;
        this.handleNextTurnUI();
        break;

      case 'PLAYER_ELIMINATED':
        sounds.playElimination();
        this.handlePlayerEliminatedUI(msg);
        break;

      case 'MATCH_OVER':
        sounds.playVictory();
        this.handleMatchOverUI(msg);
        break;

      case 'ERROR':
        sounds.playError();
        this.showToast(`⚠️ ${msg.message}`);
        break;
    }
  }

  // ==========================================
  // GIAO DIỆN & TƯƠNG TÁC UI
  // ==========================================

  showToast(text) {
    let toast = document.getElementById('mp-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mp-toast';
      toast.className = 'mp-toast-box';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  /**
   * Render màn hình Phòng Chờ (Lobby)
   */
  renderLobby() {
    this.closeMatchOverModal();
    const room = this.currentRoom;
    if (!room) return;

    const overlay = document.getElementById('mp-room-modal');
    if (!overlay) return;

    overlay.classList.add('active');
    overlay.innerHTML = `
      <div class="mp-modal-card">
        <!-- Header Mã PIN -->
        <div class="mp-lobby-header">
          <div class="mp-pin-badge">
            <span class="mp-pin-label">MÃ PHÒNG (PIN):</span>
            <div class="mp-pin-digits" id="btn-copy-pin" title="Bấm để sao chép mã">
              <span class="pin-code">${room.code}</span>
              <button class="btn-copy-neu" title="Sao chép">📋</button>
            </div>
          ${this.myPlayerId === room.hostId ? `
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 3px;">
              <span style="font-size: 0.68rem; font-weight: 800; color: #555; text-transform: uppercase;">Thời gian lượt:</span>
              <div style="display: flex; align-items: center; gap: 4px; background: #FFF; border: 2.5px solid #111; border-radius: 10px; padding: 2px 6px; box-shadow: 2px 2px 0 #111;">
                <button type="button" class="btn-time-step" id="btn-lobby-dec-time" title="Giảm 1 giây">−</button>
                <span id="lobby-time-display" style="font-family:'Fredoka', cursive; font-weight:800; font-size:1rem; min-width:36px; text-align:center; cursor: pointer;" title="Bấm để nhập số giây thủ công">${room.turnTimeLimit}s</span>
                <button type="button" class="btn-time-step" id="btn-lobby-inc-time" title="Tăng 1 giây">+</button>
              </div>
            </div>
          ` : `
            <span class="badge-neu badge-blue">⏱️ ${room.turnTimeLimit}s/lượt</span>
          `}
        </div>

        <p class="mp-lobby-sub">Chia sẻ mã PIN <strong>${room.code}</strong> cho bạn bè để cùng vào ván đấu!</p>

        <!-- Danh sách người chơi trong phòng -->
        <div class="mp-players-list">
          <div class="mp-players-title">
            <span>👥 Người chơi (${room.players.length}/8):</span>
            <span style="font-size: 0.78rem; color: #666;">Đấu Sinh Tồn Loại Trực Tiếp</span>
          </div>
          <div class="mp-player-grid">
            ${room.players.map(p => {
              const isHost = p.id === room.hostId;
              const isMe = p.id === this.myPlayerId;
              return `
                <div class="mp-player-item ${isMe ? 'is-me' : ''}">
                  <div class="mp-player-avatar">${p.avatar}</div>
                  <div class="mp-player-meta">
                    <span class="mp-player-name">${p.name} ${isMe ? '(Bạn)' : ''}</span>
                    <div class="mp-player-status">
                      ${isHost ? '<span class="host-tag">👑 Chủ phòng</span>' : ''}
                      ${p.isReady ? '<span class="ready-tag">✅ Đã sẵn sàng</span>' : '<span class="wait-tag">⏳ Đang đợi...</span>'}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Các nút điều khiển Lobby -->
        <div class="mp-lobby-actions">
          ${this.myPlayerId === room.hostId ? `
            <button class="btn-neu btn-primary btn-start-match" id="btn-mp-start" ${room.players.length < 2 ? 'disabled style="opacity: 0.6; cursor: not-allowed;"' : ''}>
              🎮 BẮT ĐẦU VÁN ĐẤU ${room.players.length < 2 ? '(Cần ≥ 2 người)' : '🚀'}
            </button>
          ` : `
            <button class="btn-neu ${room.players.find(p => p.id === this.myPlayerId)?.isReady ? 'btn-accent' : 'btn-primary'}" id="btn-mp-ready">
              ${room.players.find(p => p.id === this.myPlayerId)?.isReady ? '❌ HỦY SẴN SÀNG' : '✅ SẴN SÀNG CHIẾN'}
            </button>
          `}
          <button class="btn-neu btn-leave-room" id="btn-mp-leave" style="background-color: #F0F0F0;">
            🚪 Rời Phòng
          </button>
        </div>
      </div>
    `;

    // Gắn sự kiện copy PIN
    document.getElementById('btn-copy-pin')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(room.code);
      this.showToast(`Đã sao chép mã PIN: ${room.code}!`);
    });

    // Sự kiện Ready / Start
    document.getElementById('btn-mp-ready')?.addEventListener('click', () => {
      this.toggleReady();
    });

    document.getElementById('btn-mp-start')?.addEventListener('click', () => {
      if (room.players.length >= 2) {
        this.startMatch();
      } else {
        this.showToast('Cần ít nhất 2 người chơi!');
      }
    });

    document.getElementById('btn-mp-leave')?.addEventListener('click', () => {
      this.leaveRoom();
      overlay.classList.remove('active');
      this.game.switchMode('solo');
    });

    // Sự kiện chỉnh thời gian lượt dành riêng cho Chủ phòng
    if (this.myPlayerId === room.hostId) {
      document.getElementById('btn-lobby-dec-time')?.addEventListener('click', () => {
        this.updateRoomTime(Math.max(5, room.turnTimeLimit - 1));
      });
      document.getElementById('btn-lobby-inc-time')?.addEventListener('click', () => {
        this.updateRoomTime(Math.min(60, room.turnTimeLimit + 1));
      });
      document.getElementById('lobby-time-display')?.addEventListener('click', () => {
        const val = prompt('Nhập số giây mỗi lượt (5 - 60 giây):', room.turnTimeLimit);
        if (val !== null) {
          const num = Number(val);
          if (!isNaN(num) && num >= 5 && num <= 60) {
            this.updateRoomTime(num);
          } else {
            this.showToast('Vui lòng nhập số từ 5 đến 60 giây!');
          }
        }
      });
    }
  }

  updateRoomTime(newLimit) {
    const clean = Math.max(5, Math.min(60, Number(newLimit) || 12));
    this.send({
      type: 'UPDATE_SETTINGS',
      turnTimeLimit: clean
    });
  }

  /**
   * Bắt đầu giao diện Ván Đấu Sinh Tồn
   */
  startMatchUI(msg) {
    this.closeAllModals();
    this.isEliminated = false;

    // Chuyển container chat sang chế độ Multiplayer
    const chatList = document.getElementById('chat-list');
    if (chatList) {
      chatList.innerHTML = `
        <div class="system-msg-row">
          <div class="system-msg-pill battle-pill">
            <span>🔥</span>
            <span>ĐẤU SINH TỒN BẮT ĐẦU! Ai hết giờ hoặc nối sai sẽ bị loại.</span>
          </div>
        </div>
        <div class="chat-row bot-row">
          <div class="chat-avatar-box">🎮</div>
          <div class="chat-bubble bot-bubble">
            <span class="chat-sender-name">Trọng Tài 🤖</span>
            <div class="chat-word-text">${msg.startWord}</div>
            <span class="chat-badge-detail">Từ mở đầu</span>
          </div>
        </div>
      `;
    }

    this.renderTurnTracker();
    this.handleNextTurnUI();
  }

  /**
   * Hiển thị thanh người chơi đang tham chiến (Turn Tracker)
   */
  renderTurnTracker() {
    let tracker = document.getElementById('mp-turn-tracker');
    if (!tracker) {
      tracker = document.createElement('div');
      tracker.id = 'mp-turn-tracker';
      tracker.className = 'mp-turn-tracker';
      const header = document.querySelector('.game-header');
      if (header) {
        header.appendChild(tracker);
      }
    }

    if (!this.currentRoom) return;

    tracker.innerHTML = `
      <div class="mp-roster-scroller">
        ${this.currentRoom.players.map(p => {
          const isTurn = p.id === this.currentTurnPlayerId;
          const isDead = !p.isAlive;
          return `
            <div class="mp-roster-pill ${isTurn ? 'is-turn' : ''} ${isDead ? 'is-dead' : ''}" title="${p.name} (${p.score}đ)">
              <span class="roster-avatar">${p.avatar}</span>
              <span class="roster-name">${p.name}</span>
              ${isDead ? '<span class="roster-dead-icon">💀</span>' : ''}
              ${isTurn ? '<span class="roster-active-pulse"></span>' : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Xử lý lượt kế tiếp
   */
  handleNextTurnUI() {
    this.renderTurnTracker();

    this.isMyTurn = (this.currentTurnPlayerId === this.myPlayerId);
    const input = document.getElementById('word-input');
    const sendBtn = document.getElementById('btn-send');
    const hintText = document.getElementById('hint-text');

    const currentPlayer = this.currentRoom?.players.find(p => p.id === this.currentTurnPlayerId);
    const currentPlayerName = currentPlayer ? currentPlayer.name : 'Người chơi';

    if (this.isEliminated) {
      if (input) {
        input.disabled = true;
        input.placeholder = `Bạn đang là khán giả... Đang chờ ${currentPlayerName}`;
      }
      if (sendBtn) sendBtn.disabled = true;
      if (hintText) hintText.innerHTML = `🍿 Khán giả: Đang chờ <strong>${currentPlayerName}</strong> nối từ bắt đầu bằng "<strong>${this.targetSyllable}</strong>"`;
      return;
    }

    if (this.isMyTurn) {
      if (input) {
        input.disabled = false;
        input.value = '';
        input.placeholder = `Nhập từ bắt đầu bằng: ${this.targetSyllable} ...`;
        input.focus();
      }
      if (sendBtn) sendBtn.disabled = false;
      if (hintText) {
        hintText.innerHTML = `👉 <strong>ĐẾN LƯỢT BẠN!</strong> Nối từ 2 tiếng bắt đầu bằng: <strong class="highlight-syllable">${this.targetSyllable}</strong>`;
      }
      sounds.playPop();
    } else {
      if (input) {
        input.disabled = true;
        input.value = '';
        input.placeholder = `⏳ Đang chờ ${currentPlayerName} nối từ...`;
      }
      if (sendBtn) sendBtn.disabled = true;
      if (hintText) {
        hintText.innerHTML = `⏳ Đang chờ <strong>${currentPlayerName}</strong> nối từ bắt đầu bằng "<strong>${this.targetSyllable}</strong>"`;
      }
    }
  }

  unlockInputForRetry() {
    if (this.isMyTurn && !this.isEliminated) {
      const input = document.getElementById('word-input');
      const sendBtn = document.getElementById('btn-send');
      if (input) {
        input.disabled = false;
        input.focus();
        input.select();
      }
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  /**
   * Cập nhật thanh đếm ngược
   */
  updateTimerUI(timeLeft) {
    const timerBar = document.getElementById('timer-bar');
    if (!timerBar) return;

    const totalLimit = this.currentRoom?.turnTimeLimit || 12;
    const pct = Math.max(0, Math.min(100, (timeLeft / totalLimit) * 100));
    timerBar.style.width = `${pct}%`;

    if (pct > 50) {
      timerBar.style.backgroundColor = 'var(--timer-green)';
    } else if (pct > 25) {
      timerBar.style.backgroundColor = 'var(--timer-yellow)';
    } else {
      timerBar.style.backgroundColor = 'var(--timer-red)';
    }
  }

  /**
   * Thêm từ nối thành công vào chat stream
   */
  handleWordAcceptedUI(msg) {
    const item = msg.historyItem;
    const chatList = document.getElementById('chat-list');
    if (!chatList) return;

    const isMe = item.playerId === this.myPlayerId;
    const bubbleRow = document.createElement('div');
    bubbleRow.className = `chat-row ${isMe ? 'user-row' : 'bot-row'}`;

    bubbleRow.innerHTML = `
      <div class="chat-avatar-box">${item.avatar}</div>
      <div class="chat-bubble ${isMe ? 'user-bubble' : 'bot-bubble'}">
        <span class="chat-sender-name">${item.playerName}</span>
        <div class="chat-word-text">${item.word}</div>
        <span class="chat-badge-detail">+${item.scoreGain}đ</span>
      </div>
    `;

    chatList.appendChild(bubbleRow);
    chatList.scrollTop = chatList.scrollHeight;

    // Cập nhật điểm của người này trong room
    const p = this.currentRoom?.players.find(x => x.id === item.playerId);
    if (p) {
      p.score = msg.playerScore;
    }
  }

  /**
   * Người chơi bị loại khỏi ván đấu
   */
  handlePlayerEliminatedUI(msg) {
    const isMe = msg.playerId === this.myPlayerId;
    if (isMe) {
      this.isEliminated = true;
      this.isMyTurn = false;
      this.showToast('💥 Bạn đã bị loại khỏi ván đấu!');
    }

    const p = this.currentRoom?.players.find(x => x.id === msg.playerId);
    if (p) p.isAlive = false;

    // Hiển thị thông báo trên khung chat
    const chatList = document.getElementById('chat-list');
    if (chatList) {
      const banner = document.createElement('div');
      banner.className = 'system-msg-row';
      banner.innerHTML = `
        <div class="system-msg-pill eliminated-pill">
          <span>💥</span>
          <span><strong>${msg.playerName}</strong> đã bị loại: ${msg.reason}</span>
        </div>
      `;
      chatList.appendChild(banner);
      chatList.scrollTop = chatList.scrollHeight;
    }

    this.renderTurnTracker();
  }

  /**
   * Kết thúc ván đấu - Vinh danh Quán Quân
   */
  handleMatchOverUI(msg) {
    const winner = msg.winner;
    const scoreboard = msg.scoreboard || [];
    const isMeWinner = winner && (winner.id === this.myPlayerId);

    // Thưởng xu cho người chơi
    let rewardCoins = 15; // xu an ủi tham gia
    if (isMeWinner) {
      rewardCoins = 50; // Quán quân nhận 50 xu!
    }

    // Gửi điểm và xu thưởng ra Portal chính
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'ARCADE_RECORD_SCORE',
        gameId: 'noi-tu',
        score: isMeWinner ? (winner.score || 30) : 10
      }, '*');
    }

    // Modal vinh danh
    const modal = document.getElementById('mp-game-over-modal') || document.getElementById('game-over-modal');
    if (modal) {
      modal.classList.add('active');
      modal.innerHTML = `
        <div class="game-modal-card mp-podium-card">
          <div class="modal-header-art">🏆</div>
          <h2 class="modal-game-title" style="color: #FFC000;">
            ${isMeWinner ? '👑 QUÁN QUÂN VÔ ĐỊCH!' : '🎉 KẾT THÚC VÁN ĐẤU!'}
          </h2>
          <p class="modal-game-reason">
            ${winner ? `Chúc mừng <strong>${winner.name}</strong> ${winner.avatar} là người sống sót cuối cùng!` : 'Ván đấu đã kết thúc!'}
          </p>

          <!-- Bảng xếp hạng ván đấu -->
          <div class="mp-scoreboard-box">
            <h4 style="font-size: 0.88rem; margin-bottom: 6px; font-weight: 800;">BẢNG XẾP HẠNG SINH TỒN:</h4>
            ${scoreboard.map((p, idx) => `
              <div class="mp-score-row ${p.isWinner ? 'winner-row' : ''}">
                <span class="mp-rank-num">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}</span>
                <span class="mp-score-player">${p.avatar} ${p.name} ${p.id === this.myPlayerId ? '(Bạn)' : ''}</span>
                <strong class="mp-score-val">${p.score}đ</strong>
              </div>
            `).join('')}
          </div>

          <div class="mp-reward-note">
            <span>🪙 Thưởng ván đấu: <strong>+${rewardCoins} Xu</strong></span>
          </div>

          <div class="modal-actions-col">
            ${this.myPlayerId === this.currentRoom?.hostId ? `
              <button class="btn-neu btn-primary" id="btn-mp-quick-restart" style="width: 100%; padding: 12px; font-size: 1.05rem;">
                🚀 BẮT ĐẦU VÁN MỚI NGAY
              </button>
              <button class="btn-neu" id="btn-mp-return-lobby" style="width: 100%; padding: 10px; background-color: #FFDE59;">
                🔄 VỀ PHÒNG CHỜ (LOBBY)
              </button>
            ` : `
              <div style="background: #F8F9FA; border: 2px solid #111; border-radius: 12px; padding: 10px; text-align: center;">
                <p style="font-size: 0.88rem; font-weight: 700; color: #111;">⏳ Đang chờ chủ phòng bắt đầu ván mới...</p>
                <p style="font-size: 0.75rem; color: #666; margin-top: 2px;">Ván đấu mới sẽ tự động hiển thị ngay khi chủ phòng bắt đầu!</p>
              </div>
              <button class="btn-neu btn-sm" id="btn-mp-close-podium" style="width: 100%; padding: 8px; background-color: #E2E8F0;">
                👁️ Đóng popup xem lại trận đấu
              </button>
            `}
            <button class="btn-neu" id="btn-mp-exit-portal" style="width: 100%; padding: 10px; background-color: #F0F0F0;">
              🏠 RỜI PHÒNG VỀ TRANG CHỦ
            </button>
          </div>
        </div>
      `;

      // Host bấm bắt đầu ván mới ngay
      document.getElementById('btn-mp-quick-restart')?.addEventListener('click', () => {
        this.closeAllModals();
        this.startMatch();
      });

      // Host đưa cả phòng về lobby
      document.getElementById('btn-mp-return-lobby')?.addEventListener('click', () => {
        this.closeAllModals();
        this.returnToLobby();
      });

      // Khách bấm đóng popup xem lại trận
      document.getElementById('btn-mp-close-podium')?.addEventListener('click', () => {
        this.closeMatchOverModal();
      });

      // Rời phòng
      document.getElementById('btn-mp-exit-portal')?.addEventListener('click', () => {
        this.closeAllModals();
        this.leaveRoom();
        this.game.exitGame();
      });
    }
  }
}
