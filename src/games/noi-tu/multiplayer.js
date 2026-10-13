/**
 * Word Chain Multiplayer Manager (Real-time Room PIN Battle Royale)
 * Quản lý kết nối WebSocket, Phòng chờ, Ván đấu Đấu Sinh Tồn và Trao Thưởng.
 */
import { sounds } from './audio.js';

export class MultiplayerManager {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.ws = null;
    this.connectCallbacks = [];
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
   * Kết nối WebSocket tới server với hàng đợi callback
   */
  connect(onOpenCallback) {
    if (typeof onOpenCallback === 'function') {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        onOpenCallback();
      } else {
        this.connectCallbacks.push(onOpenCallback);
      }
    }

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:3000';
    const wsUrl = `${protocol}//${host}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ Đã kết nối WebSocket thành công:', wsUrl);
        // Chạy tất cả các callback đang chờ trong hàng đợi
        while (this.connectCallbacks.length > 0) {
          const cb = this.connectCallbacks.shift();
          try {
            cb();
          } catch (err) {
            console.error('Lỗi khi thực thi connect callback:', err);
          }
        }
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
        this.connectCallbacks = [];
        this.resetEntryButtons();
      };

      this.ws.onerror = (err) => {
        console.error('WS Error:', err);
        this.connectCallbacks = [];
        this.resetEntryButtons();
        this.showToast('Lỗi kết nối máy chủ!');
      };
    } catch (err) {
      console.error('Không thể tạo kết nối WebSocket:', err);
      this.connectCallbacks = [];
      this.resetEntryButtons();
      this.showToast('Không thể kết nối WebSocket!');
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      this.connect(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      });
    }
  }

  resetEntryButtons() {
    const btnCreate = document.getElementById('btn-create-now');
    if (btnCreate) {
      btnCreate.disabled = false;
      btnCreate.innerHTML = '🚀 Tạo Bàn Đấu';
    }
    const btnJoin = document.getElementById('btn-join-pin');
    if (btnJoin) {
      btnJoin.disabled = false;
      btnJoin.innerHTML = '🚪 Vào Bàn Ngay';
    }
  }

  closeEntryModalAndResetButtons() {
    this.resetEntryButtons();
    document.getElementById('mp-entry-modal')?.classList.remove('active');
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
        this.closeEntryModalAndResetButtons();
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
        this.resetEntryButtons();
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

    // Đảm bảo đóng modal entry (nếu có)
    this.closeEntryModalAndResetButtons();

    // 1. Cập nhật giao diện bàn thi đấu (Table Arena) ở trạng thái phòng chờ
    this.renderLobbyTable();

    // 2. Mở Modal Phòng Chờ hiển thị to rõ Mã PIN
    const overlay = document.getElementById('mp-room-modal');
    if (!overlay) return;

    overlay.classList.add('active');
    overlay.innerHTML = `
      <div class="mp-modal-card">
        <!-- Header Mã PIN -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-c); padding-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">MÃ BÀN (PIN):</span>
            <div id="btn-copy-pin" style="display: flex; align-items: center; gap: 6px; background: var(--primary-light); border: 1px solid var(--primary-border); border-radius: 8px; padding: 4px 12px; cursor: pointer;" title="Bấm để sao chép mã">
              <span style="font-size: 1.35rem; font-weight: 800; color: var(--primary-dark); letter-spacing: 3px;">${room.code}</span>
              <span style="font-size: 0.85rem;">📋</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${this.myPlayerId === room.hostId ? `
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                <span style="font-size: 0.68rem; font-weight: 600; color: var(--text-muted);">Thời gian:</span>
                <div style="display: flex; align-items: center; gap: 3px; background: #ffffff; border: 1px solid var(--border-c); border-radius: 6px; padding: 2px 4px;">
                  <button type="button" class="btn-neu btn-sm" id="btn-lobby-dec-time" style="width: 22px; height: 22px; padding: 0;" title="Giảm 1 giây">−</button>
                  <span id="lobby-time-display" style="font-weight: 700; font-size: 0.82rem; min-width: 26px; text-align: center; cursor: pointer;" title="Bấm để đổi số giây">${room.turnTimeLimit}s</span>
                  <button type="button" class="btn-neu btn-sm" id="btn-lobby-inc-time" style="width: 22px; height: 22px; padding: 0;" title="Tăng 1 giây">+</button>
                </div>
              </div>
            ` : `
              <span class="badge-neu badge-green">⏱️ ${room.turnTimeLimit}s/lượt</span>
            `}
            <button class="btn-icon-neu" id="btn-minimize-lobby" style="width: 28px; height: 28px; font-size: 0.8rem;" title="Thu nhỏ để xem bàn">✕</button>
          </div>
        </div>

        <p style="font-size: 0.78rem; color: var(--text-muted);">Chia sẻ mã PIN <strong>${room.code}</strong> cho bạn bè để cùng vào bàn đấu!</p>

        <!-- Danh sách người chơi trong phòng -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; font-weight: 700;">
            <span>👥 Người chơi (${room.players.length}/8):</span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500;">Bàn Đấu Sinh Tồn</span>
          </div>
          <div class="mp-player-grid">
            ${room.players.map(p => {
              const isHost = p.id === room.hostId;
              const isMe = p.id === this.myPlayerId;
              return `
                <div class="mp-player-item ${isMe ? 'is-me' : ''}">
                  <span style="font-size: 1.3rem;">${p.avatar}</span>
                  <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                    <span style="font-size: 0.82rem; font-weight: 700;">${p.name} ${isMe ? '(Bạn)' : ''}</span>
                    <div style="display: flex; gap: 6px; align-items: center; margin-top: 2px;">
                      ${isHost ? '<span style="font-size: 0.65rem; background: #fffbeb; color: #b45309; border: 1px solid #fde68a; border-radius: 4px; padding: 1px 4px;">👑 Chủ bàn</span>' : ''}
                      ${p.isReady ? '<span style="font-size: 0.65rem; background: var(--primary-light); color: var(--primary-dark); border: 1px solid var(--primary-border); border-radius: 4px; padding: 1px 4px;">✅ Đã sẵn sàng</span>' : '<span style="font-size: 0.65rem; color: var(--text-muted);">⏳ Đang đợi...</span>'}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Các nút điều khiển Lobby -->
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
          ${this.myPlayerId === room.hostId ? `
            <button class="btn-neu btn-primary" id="btn-mp-start" style="width: 100%; padding: 10px;" ${room.players.length < 2 ? 'disabled style="opacity: 0.6; cursor: not-allowed;"' : ''}>
              🎮 Bắt Đầu Ván Đấu ${room.players.length < 2 ? '(Cần ≥ 2 người)' : '🚀'}
            </button>
          ` : `
            <button class="btn-neu ${room.players.find(p => p.id === this.myPlayerId)?.isReady ? 'btn-accent' : 'btn-primary'}" id="btn-mp-ready" style="width: 100%; padding: 10px;">
              ${room.players.find(p => p.id === this.myPlayerId)?.isReady ? '❌ Hủy Sẵn Sàng' : '✅ Sẵn Sàng Chiến'}
            </button>
          `}
          <button class="btn-neu" id="btn-mp-leave" style="width: 100%; padding: 8px;">
            🚪 Rời Bàn
          </button>
        </div>
      </div>
    `;

    // Gắn sự kiện copy PIN
    document.getElementById('btn-copy-pin')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(room.code);
      this.showToast(`Đã sao chép mã PIN: ${room.code}!`);
    });

    // Thu nhỏ modal để xem bàn
    document.getElementById('btn-minimize-lobby')?.addEventListener('click', () => {
      overlay.classList.remove('active');
      this.showToast('Bấm vào ô Mã PIN ở tâm bàn để mở lại phòng chờ!');
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

  /**
   * Cập nhật Bàn Đấu (Table Arena) khi ở chế độ Phòng Chờ (Lobby)
   */
  renderLobbyTable() {
    const room = this.currentRoom;
    if (!room) return;

    // Cập nhật Meta Bar
    const metaPlayers = document.getElementById('meta-players-text');
    const metaStatus = document.getElementById('meta-status-text');
    const metaChain = document.getElementById('meta-chain-text');
    if (metaPlayers) metaPlayers.textContent = `Bàn đấu: ${room.players.length}/8 người`;
    if (metaStatus) {
      metaStatus.textContent = `Mã PIN: ${room.code}`;
      metaStatus.style.cursor = 'pointer';
      metaStatus.title = 'Bấm để mở bảng phòng chờ';
      metaStatus.onclick = () => {
        document.getElementById('mp-room-modal')?.classList.add('active');
      };
    }
    if (metaChain) metaChain.textContent = `Chờ bắt đầu`;

    // Cập nhật Tâm bàn: hiển thị to rõ Mã PIN và thông báo chờ
    const centerCard = document.getElementById('center-word-card');
    const speakerLabel = document.getElementById('spotlight-speaker-label');
    const targetBadge = document.getElementById('target-syllable-badge');
    const centerTimerVal = document.getElementById('center-timer-val');
    const recentChain = document.getElementById('recent-chain-flow');

    if (centerCard) {
      centerCard.style.cursor = 'pointer';
      centerCard.title = 'Bấm để mở bảng phòng chờ';
      centerCard.innerHTML = `
        <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">MÃ BÀN ĐẤU (PIN)</div>
        <div style="font-size: 1.85rem; font-weight: 800; color: var(--primary-dark); letter-spacing: 4px;">${room.code}</div>
      `;
      centerCard.onclick = () => {
        if (this.currentRoom && this.currentRoom.state === 'LOBBY') {
          document.getElementById('mp-room-modal')?.classList.add('active');
        }
      };
    }
    if (speakerLabel) speakerLabel.textContent = `Phòng Chờ Đấu Nhóm (${room.players.length}/8 người)`;
    if (targetBadge) {
      const isHost = this.myPlayerId === room.hostId;
      targetBadge.textContent = isHost 
        ? (room.players.length >= 2 ? 'Sẵn sàng bắt đầu! 🚀' : 'Đang đợi thêm người... ⏳')
        : 'Chờ chủ bàn bắt đầu... ⏳';
    }
    if (centerTimerVal) centerTimerVal.textContent = room.turnTimeLimit;
    if (recentChain) recentChain.innerHTML = `<span class="chain-chip active" style="font-size: 0.75rem;">Mã PIN: ${room.code} • ${room.turnTimeLimit}s/lượt</span>`;

    // Khóa input nhập từ
    if (this.game) {
      if (this.game.elInput) {
        this.game.elInput.disabled = true;
        this.game.elInput.value = '';
        this.game.elInput.placeholder = 'Chờ bắt đầu ván đấu để nối từ...';
      }
      if (this.game.elHintText) {
        this.game.elHintText.innerHTML = `Mã bàn: <strong class="highlight-syllable">${room.code}</strong> • Chia sẻ mã cho bạn bè để cùng vào bàn!`;
      }
    }

    // Render các ghế người chơi quanh bàn theo nguyên tắc đồng hồ (6h = Bạn)
    this.renderTableSeats();
  }

  updateRoomTime(newLimit) {
    const clean = Math.max(5, Math.min(60, Number(newLimit) || 12));
    this.send({
      type: 'UPDATE_SETTINGS',
      turnTimeLimit: clean
    });
  }

  /**
   * Bàn thi đấu: Render các thành viên quanh bàn theo nguyên tắc đồng hồ:
   * VỊ TRÍ MẶC ĐỊNH CỦA MỖI NGƯỜI CHƠI (TRÊN MÀN HÌNH CỦA HỌ) LUÔN LUÔN LÀ HƯỚNG 6H!
   * Các đối thủ còn lại được phân bổ theo chiều kim đồng hồ quanh bàn (9h, 12h, 3h).
   */
  renderTableSeats() {
    if (!this.currentRoom) return;

    const topSeats = document.getElementById('table-top-seats');
    const bottomSeats = document.getElementById('table-bottom-seats');
    const leftSeats = document.getElementById('table-left-seats');
    const rightSeats = document.getElementById('table-right-seats');
    const metaPlayers = document.getElementById('meta-players-text');
    const metaStatus = document.getElementById('meta-status-text');

    const players = this.currentRoom.players || [];
    const alivePlayers = players.filter(p => p.isAlive);
    const isLobby = this.currentRoom.state === 'LOBBY';

    if (metaPlayers) {
      metaPlayers.textContent = isLobby 
        ? `Bàn đấu: ${players.length}/8 người`
        : `Bàn đấu: ${alivePlayers.length}/${players.length} người sống sót`;
    }
    if (metaStatus) {
      metaStatus.textContent = `Mã PIN: ${this.currentRoom.code}`;
    }

    // 1. Tìm vị trí của Người Chơi Hiện Tại (Bạn)
    const myIdx = players.findIndex(p => p.id === this.myPlayerId);

    // 2. Xoay vòng danh sách sao cho Bạn luôn đứng đầu danh sách (VỊ TRÍ 6H)
    const rotated = myIdx >= 0
      ? [...players.slice(myIdx), ...players.slice(0, myIdx)]
      : [...players];

    const me = rotated[0]; // Luôn là Bạn ở hướng 6h
    const opponents = rotated.slice(1); // Các đối thủ còn lại

    const renderSeatHtml = (p, clockLabel, isSide = false) => {
      if (!p) return '';
      const isTurn = p.id === this.currentTurnPlayerId;
      const isDead = !p.isAlive;
      const isMe = p.id === this.myPlayerId;
      const isHost = p.id === this.currentRoom.hostId;

      let statusBadge = '';
      if (isLobby) {
        if (isHost) {
          statusBadge = '<span class="seat-status-badge seat-status-turn">👑 Chủ bàn</span>';
        } else if (p.isReady) {
          statusBadge = '<span class="seat-status-badge seat-status-turn">✅ Sẵn sàng</span>';
        } else {
          statusBadge = '<span class="seat-status-badge">⏳ Chờ...</span>';
        }
      } else {
        if (isDead) {
          statusBadge = '<span class="seat-status-badge seat-status-dead">❌ Đã loại</span>';
        } else if (isTurn) {
          statusBadge = '<span class="seat-status-badge seat-status-turn">👉 Đến lượt</span>';
        } else {
          statusBadge = '<span class="seat-status-badge">⏳ Chờ</span>';
        }
      }

      return `
        <div class="player-seat ${isSide ? 'side-seat' : ''} ${isMe ? 'is-me' : ''} ${isTurn && !isLobby ? 'is-turn' : ''} ${isDead && !isLobby ? 'is-dead' : ''}" title="Hướng ${clockLabel}: ${p.name}">
          <div class="seat-avatar-wrap">
            <div class="seat-avatar">${p.avatar || '🐱'}</div>
            ${isTurn && !isDead && !isLobby ? '<div class="seat-turn-dot"></div>' : ''}
          </div>
          <div class="seat-meta">
            <div class="seat-name-row">
              <span class="seat-name">${p.name} ${isMe ? '(Bạn)' : ''}</span>
              ${isHost ? '<span class="seat-host-badge" title="Chủ bàn">👑</span>' : ''}
              <span class="seat-clock-tag">${clockLabel}</span>
            </div>
            <span class="seat-stat">${p.score || 0}đ • ${p.wordsCount || 0} từ</span>
            ${statusBadge}
          </div>
        </div>
      `;
    };

    // 3. Render Ghế Hướng 6h: Luôn là Người Chơi Hiện Tại (Bạn)
    if (bottomSeats) {
      bottomSeats.innerHTML = me ? renderSeatHtml(me, '6h • Bạn', false) : '';
    }

    // 4. Phân bổ các đối thủ theo chiều kim đồng hồ quanh bàn
    let leftList = [];
    let topList = [];
    let rightList = [];

    if (opponents.length === 1) {
      // 2 người: Đối diện ở hướng 12h
      topList.push({ player: opponents[0], label: '12h' });
    } else if (opponents.length === 2) {
      // 3 người: 9h (trái) và 3h (phải)
      leftList.push({ player: opponents[0], label: '9h' });
      rightList.push({ player: opponents[1], label: '3h' });
    } else if (opponents.length === 3) {
      // 4 người: 9h (trái), 12h (trên), 3h (phải)
      leftList.push({ player: opponents[0], label: '9h' });
      topList.push({ player: opponents[1], label: '12h' });
      rightList.push({ player: opponents[2], label: '3h' });
    } else if (opponents.length === 4) {
      // 5 người: 9h, 11h, 1h, 3h
      leftList.push({ player: opponents[0], label: '9h' });
      topList.push({ player: opponents[1], label: '11h' });
      topList.push({ player: opponents[2], label: '1h' });
      rightList.push({ player: opponents[3], label: '3h' });
    } else if (opponents.length === 5) {
      // 6 người: 9h, 11h, 12h, 1h, 3h
      leftList.push({ player: opponents[0], label: '9h' });
      topList.push({ player: opponents[1], label: '11h' });
      topList.push({ player: opponents[2], label: '12h' });
      topList.push({ player: opponents[3], label: '1h' });
      rightList.push({ player: opponents[4], label: '3h' });
    } else if (opponents.length >= 6) {
      // 7-8 người: 8h, 10h, 11h, 12h, 1h, 2h, 4h
      leftList.push({ player: opponents[0], label: '8h' });
      if (opponents[1]) leftList.push({ player: opponents[1], label: '10h' });
      if (opponents[2]) topList.push({ player: opponents[2], label: '11h' });
      if (opponents[3]) topList.push({ player: opponents[3], label: '12h' });
      if (opponents[4]) topList.push({ player: opponents[4], label: '1h' });
      if (opponents[5]) rightList.push({ player: opponents[5], label: '2h' });
      if (opponents[6]) rightList.push({ player: opponents[6], label: '4h' });
    }

    if (topSeats) {
      if (topList.length === 0 && isLobby) {
        topSeats.innerHTML = `
          <div class="player-seat empty-seat" style="opacity: 0.65; border-style: dashed;" title="Đang chờ bạn bè vào bàn">
            <div class="seat-avatar-wrap">
              <div class="seat-avatar" style="background: var(--bg-game); font-size: 0.95rem;">➕</div>
            </div>
            <div class="seat-meta">
              <div class="seat-name-row">
                <span class="seat-name" style="color: var(--text-muted);">Chờ đối thủ...</span>
                <span class="seat-clock-tag">12h</span>
              </div>
              <span class="seat-stat">Mã PIN: ${this.currentRoom.code}</span>
              <span class="seat-status-badge">Đang đợi</span>
            </div>
          </div>
        `;
      } else {
        topSeats.innerHTML = topList.map(item => renderSeatHtml(item.player, item.label, false)).join('');
      }
    }
    if (leftSeats) {
      leftSeats.innerHTML = leftList.map(item => renderSeatHtml(item.player, item.label, true)).join('');
    }
    if (rightSeats) {
      rightSeats.innerHTML = rightList.map(item => renderSeatHtml(item.player, item.label, true)).join('');
    }
  }

  /**
   * Bắt đầu giao diện Ván Đấu Sinh Tồn
   */
  startMatchUI(msg) {
    this.closeAllModals();
    this.isEliminated = false;

    if (this.game) {
      this.game.recentChain = [msg.startWord];
      this.game.updateTableCenter(msg.startWord, 'Trọng Tài 🤖');
    }

    this.renderTableSeats();
    this.handleNextTurnUI();
  }

  /**
   * Xử lý lượt kế tiếp
   */
  handleNextTurnUI() {
    this.renderTableSeats();

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
   * Cập nhật thanh đếm ngược và tâm bàn
   */
  updateTimerUI(timeLeft) {
    const timerBar = document.getElementById('timer-bar');
    const totalLimit = this.currentRoom?.turnTimeLimit || 12;
    const pct = Math.max(0, Math.min(100, (timeLeft / totalLimit) * 100));

    if (timerBar) {
      timerBar.style.width = `${pct}%`;
      if (pct > 50) {
        timerBar.style.backgroundColor = 'var(--primary)';
      } else if (pct > 25) {
        timerBar.style.backgroundColor = 'var(--warning)';
      } else {
        timerBar.style.backgroundColor = 'var(--danger)';
      }
    }

    const centerTimerVal = document.getElementById('center-timer-val');
    if (centerTimerVal) {
      centerTimerVal.textContent = Math.max(0, Math.ceil(timeLeft));
    }
    const circle = document.getElementById('center-timer-circle');
    if (circle) {
      if (pct > 50) {
        circle.style.borderColor = 'var(--primary)';
        if (centerTimerVal) centerTimerVal.style.color = 'var(--primary-dark)';
      } else if (pct > 25) {
        circle.style.borderColor = 'var(--warning)';
        if (centerTimerVal) centerTimerVal.style.color = 'var(--warning)';
      } else {
        circle.style.borderColor = 'var(--danger)';
        if (centerTimerVal) centerTimerVal.style.color = 'var(--danger)';
      }
    }
  }

  /**
   * Thêm từ nối thành công vào bàn đấu
   */
  handleWordAcceptedUI(msg) {
    const item = msg.historyItem;
    if (this.game) {
      this.game.updateTableCenter(item.word, item.playerName, item.scoreGain);
    }

    // Cập nhật điểm của người này trong room
    const p = this.currentRoom?.players.find(x => x.id === item.playerId);
    if (p) {
      p.score = msg.playerScore;
      p.wordsCount = (p.wordsCount || 0) + 1;
    }

    this.renderTableSeats();
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

    this.showToast(`💥 ${msg.playerName} đã bị loại: ${msg.reason}`);
    this.renderTableSeats();
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
        <div class="game-modal-card">
          <div style="text-align: center; font-size: 2.2rem;">🏆</div>
          <h2 style="font-size: 1.25rem; font-weight: 800; text-align: center; color: var(--primary-dark);">
            ${isMeWinner ? '👑 QUÁN QUÂN VÔ ĐỊCH!' : '🎉 KẾT THÚC VÁN ĐẤU!'}
          </h2>
          <p style="font-size: 0.82rem; color: var(--text-muted); text-align: center;">
            ${winner ? `Chúc mừng <strong>${winner.name}</strong> ${winner.avatar} là người sống sót cuối cùng!` : 'Ván đấu đã kết thúc!'}
          </p>

          <!-- Bảng xếp hạng ván đấu -->
          <div style="background: var(--bg-game); border: 1px solid var(--border-c); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 6px;">
            <h4 style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">BẢNG XẾP HẠNG SINH TỒN:</h4>
            ${scoreboard.map((p, idx) => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; background: #ffffff; border: 1px solid ${p.isWinner ? 'var(--primary-border)' : 'var(--border-c)'}; border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 0.9rem;">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}</span>
                  <span style="font-size: 0.82rem; font-weight: 600;">${p.avatar} ${p.name} ${p.id === this.myPlayerId ? '(Bạn)' : ''}</span>
                </div>
                <strong style="font-size: 0.85rem; color: var(--primary-dark);">${p.score}đ</strong>
              </div>
            `).join('')}
          </div>

          <div style="text-align: center; font-size: 0.82rem; color: var(--primary-dark); font-weight: 700; background: var(--primary-light); border: 1px solid var(--primary-border); border-radius: 8px; padding: 6px;">
            <span>🪙 Thưởng ván đấu: <strong>+${rewardCoins} Xu</strong></span>
          </div>

          <div class="modal-actions-col">
            ${this.myPlayerId === this.currentRoom?.hostId ? `
              <button class="btn-neu btn-primary" id="btn-mp-quick-restart" style="width: 100%; padding: 10px;">
                🚀 Bắt Đầu Ván Mới Ngay
              </button>
              <button class="btn-neu btn-accent" id="btn-mp-return-lobby" style="width: 100%; padding: 10px;">
                🔄 Về Bàn Chờ (Lobby)
              </button>
            ` : `
              <div style="background: var(--bg-game); border: 1px solid var(--border-c); border-radius: 8px; padding: 10px; text-align: center;">
                <p style="font-size: 0.82rem; font-weight: 600; color: var(--text-dark);">⏳ Đang chờ chủ bàn bắt đầu ván mới...</p>
              </div>
              <button class="btn-neu btn-sm" id="btn-mp-close-podium" style="width: 100%; padding: 8px;">
                👁️ Xem Lại Bàn Đấu
              </button>
            `}
            <button class="btn-neu" id="btn-mp-exit-portal" style="width: 100%; padding: 8px;">
              🏠 Rời Bàn Về Trang Chủ
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
