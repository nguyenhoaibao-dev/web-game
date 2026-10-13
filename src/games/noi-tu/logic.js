/**
 * Word Chain ("Nối Từ") Core Game Loop & Interaction Controller
 * Hỗ trợ 2 chế độ:
 * 1. Luyện tập với máy (Solo vs Bot)
 * 2. Đấu nhóm thời gian thực (Multiplayer Battle Royale qua mã PIN)
 */
import { dictionary } from './dictionary.js';
import { sounds } from './audio.js';
import { MultiplayerManager } from './multiplayer.js';

const TURN_TIME_LIMIT = 12; // 12 giây cho mỗi lượt nối solo

export class WordChainGame {
  constructor() {
    this.mode = 'solo'; // 'solo' | 'multi'
    this.score = 0;
    this.wordCount = 0;
    this.streak = 0;
    this.currentWord = '';
    this.usedWords = new Set();
    this.soloTurnTimeLimit = 12;
    this.timerInterval = null;
    this.timeLeft = this.soloTurnTimeLimit;
    this.isPlayerTurn = false;
    this.isGameOver = false;
    this.activeSoloBubbles = new Map(); // 'bot' | 'user' -> { text, status, detail, expiresAt }

    // Lấy thông tin player từ localStorage hoặc mặc định
    this.player = this.loadPlayerInfo();

    // DOM Elements
    this.elChatList = document.getElementById('chat-list');
    this.elScore = document.getElementById('current-score');
    this.elTimerBar = document.getElementById('timer-bar');
    this.elInput = document.getElementById('word-input');
    this.elBtnSend = document.getElementById('btn-send');
    this.elBtnGiveUp = document.getElementById('btn-giveup');
    this.elBtnSoloTime = document.getElementById('btn-solo-time');
    this.elSoloTimeLabel = document.getElementById('solo-time-label');
    this.elHintText = document.getElementById('hint-text');
    this.elPlayerName = document.getElementById('player-name-label');
    this.elPlayerAvatar = document.getElementById('player-avatar-small');
    this.elBtnBack = document.getElementById('btn-back-portal');
    this.elBtnSound = document.getElementById('btn-sound-toggle');
    this.elModal = document.getElementById('game-over-modal');
    this.elModalTitle = document.getElementById('modal-title');
    this.elModalReason = document.getElementById('modal-reason');
    this.elFinalScore = document.getElementById('final-score');
    this.elFinalWords = document.getElementById('final-words');
    this.elFinalRecord = document.getElementById('final-record');
    this.elBtnRestart = document.getElementById('btn-restart');
    this.elBtnExit = document.getElementById('btn-exit');

    // Table Arena elements
    this.elTableTopSeats = document.getElementById('table-top-seats');
    this.elTableBottomSeats = document.getElementById('table-bottom-seats');
    this.elTableLeftSeats = document.getElementById('table-left-seats');
    this.elTableRightSeats = document.getElementById('table-right-seats');
    this.elCenterWordCard = document.getElementById('center-word-card');
    this.elTargetSyllableBadge = document.getElementById('target-syllable-badge');
    this.elSpotlightSpeakerLabel = document.getElementById('spotlight-speaker-label');
    this.elRecentChainFlow = document.getElementById('recent-chain-flow');
    this.elCenterTimerVal = document.getElementById('center-timer-val');
    this.elMetaPlayersText = document.getElementById('meta-players-text');
    this.elMetaStatusText = document.getElementById('meta-status-text');
    this.elMetaChainText = document.getElementById('meta-chain-text');
    this.recentChain = [];
    this.botWordCount = 0;

    // Multiplayer elements
    this.tabSolo = document.getElementById('tab-solo-mode');
    this.tabMulti = document.getElementById('tab-multi-mode');
    this.mpEntryModal = document.getElementById('mp-entry-modal');

    // Multiplayer Manager
    this.mpManager = new MultiplayerManager(this);

    this.initEvents();
    this.setupMultiplayerUI();
  }

  loadPlayerInfo() {
    try {
      const raw = localStorage.getItem('ARCADE_WEB_player_profile');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn(e);
    }
    return { name: 'Người Chơi', avatar: '🐱', highScores: { 'noi-tu': 0 } };
  }

  initEvents() {
    // Render info user
    if (this.elPlayerName) this.elPlayerName.textContent = this.player.name || 'Người Chơi';
    if (this.elPlayerAvatar) this.elPlayerAvatar.textContent = this.player.avatar || '🐱';

    // Submit form (dùng chung cho cả solo và multi)
    this.elBtnSend?.addEventListener('click', () => this.handleGeneralSubmit());
    this.elInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleGeneralSubmit();
      }
    });

    // Phát tín hiệu đang gõ chữ cho đối thủ (Multiplayer)
    this.elInput?.addEventListener('input', () => {
      if (this.mode === 'multi') {
        this.mpManager.sendTypingPreview(this.elInput?.value || '');
      }
    });

    // Sound toggle
    this.elBtnSound?.addEventListener('click', () => {
      const isMuted = sounds.toggleMute();
      this.elBtnSound.textContent = isMuted ? '🔇' : '🔊';
    });

    // Back button
    this.elBtnBack?.addEventListener('click', () => this.exitGame());
    this.elBtnExit?.addEventListener('click', () => this.exitGame());

    // Restart button
    this.elBtnRestart?.addEventListener('click', () => {
      if (this.mode === 'solo') {
        this.startNewGame();
      }
    });

    // Give up button (Multiplayer)
    this.elBtnGiveUp?.addEventListener('click', () => {
      if (this.mode === 'multi') {
        if (confirm('Bạn có chắc chắn muốn bỏ cuộc ván này?')) {
          this.mpManager.giveUp();
        }
      }
    });

    // Cài đặt thời gian chơi đơn thủ công
    this.elBtnSoloTime?.addEventListener('click', () => {
      const val = prompt('Nhập số giây mỗi lượt chơi đơn (5 - 60 giây):', this.soloTurnTimeLimit);
      if (val !== null) {
        const num = Number(val);
        if (!isNaN(num) && num >= 5 && num <= 60) {
          this.soloTurnTimeLimit = num;
          if (this.elSoloTimeLabel) this.elSoloTimeLabel.textContent = `${num}s`;
          this.timeLeft = num;
          this.startNewGame();
          this.mpManager.showToast(`Đã đổi thời gian chơi đơn: ${num}s/lượt!`);
        } else {
          this.mpManager.showToast('Vui lòng nhập số từ 5 đến 60 giây!');
        }
      }
    });

    // Lắng nghe phản hồi từ parent window nếu có
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'ARCADE_PLAYER_INFO' && e.data.profile) {
        this.player = e.data.profile;
        this.mpManager.playerProfile = this.player;
        if (this.elPlayerName) this.elPlayerName.textContent = this.player.name;
        if (this.elPlayerAvatar) this.elPlayerAvatar.textContent = this.player.avatar;
      }
    });

    // Gửi yêu cầu xin thông tin người chơi mới nhất
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'ARCADE_REQUEST_PLAYER' }, '*');
    }
  }

  /**
   * Thiết lập giao diện và sự kiện Đấu Nhóm (Multiplayer)
   */
  setupMultiplayerUI() {
    // Mode Switcher Tabs
    this.tabSolo?.addEventListener('click', () => this.switchMode('solo'));
    this.tabMulti?.addEventListener('click', () => this.switchMode('multi'));

    // Sub tabs inside Entry Modal (Vào phòng vs Tạo phòng)
    const tabSubJoin = document.getElementById('tab-sub-join');
    const tabSubCreate = document.getElementById('tab-sub-create');
    const secJoin = document.getElementById('section-join-room');
    const secCreate = document.getElementById('section-create-room');

    tabSubJoin?.addEventListener('click', () => {
      tabSubJoin.classList.add('active');
      tabSubCreate?.classList.remove('active');
      if (secJoin) secJoin.style.display = 'flex';
      if (secCreate) secCreate.style.display = 'none';
    });

    tabSubCreate?.addEventListener('click', () => {
      tabSubCreate.classList.add('active');
      tabSubJoin?.classList.remove('active');
      if (secCreate) secCreate.style.display = 'flex';
      if (secJoin) secJoin.style.display = 'none';
    });

    // Time limit options & manual stepper input
    let selectedTurnTime = 12;
    const timeBtns = document.querySelectorAll('.mp-time-opt');
    const inputCustomTime = document.getElementById('input-custom-turn-time');
    const btnDecCustomTime = document.getElementById('btn-dec-custom-time');
    const btnIncCustomTime = document.getElementById('btn-inc-custom-time');

    const updateSelectedTime = (val) => {
      selectedTurnTime = Math.max(5, Math.min(60, Number(val) || 12));
      if (inputCustomTime) inputCustomTime.value = selectedTurnTime;
      timeBtns.forEach(b => {
        const t = Number(b.getAttribute('data-time'));
        if (t === selectedTurnTime) {
          b.classList.add('btn-accent');
          b.style.background = '';
        } else {
          b.classList.remove('btn-accent');
          b.style.background = '#FFF';
        }
      });
    };

    timeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        updateSelectedTime(btn.getAttribute('data-time'));
      });
    });

    btnDecCustomTime?.addEventListener('click', () => {
      const curr = Number(inputCustomTime?.value) || selectedTurnTime;
      updateSelectedTime(curr - 1);
    });

    btnIncCustomTime?.addEventListener('click', () => {
      const curr = Number(inputCustomTime?.value) || selectedTurnTime;
      updateSelectedTime(curr + 1);
    });

    inputCustomTime?.addEventListener('input', () => {
      const val = Number(inputCustomTime.value);
      if (!isNaN(val) && val >= 5 && val <= 60) {
        selectedTurnTime = val;
        timeBtns.forEach(b => {
          if (Number(b.getAttribute('data-time')) === val) {
            b.classList.add('btn-accent');
            b.style.background = '';
          } else {
            b.classList.remove('btn-accent');
            b.style.background = '#FFF';
          }
        });
      }
    });

    inputCustomTime?.addEventListener('change', () => {
      updateSelectedTime(inputCustomTime.value);
    });

    // Nút Vào phòng bằng PIN
    const btnJoinPin = document.getElementById('btn-join-pin');
    const inputPin = document.getElementById('input-pin-code');
    btnJoinPin?.addEventListener('click', () => {
      const pin = (inputPin?.value || '').trim();
      if (pin.length !== 4) {
        this.mpManager.showToast('Vui lòng nhập đủ 4 chữ số PIN!');
        return;
      }
      btnJoinPin.disabled = true;
      btnJoinPin.innerHTML = '⏳ Đang vào bàn...';
      this.mpManager.joinRoom(pin);
    });

    // Nút Tạo phòng mới
    const btnCreateNow = document.getElementById('btn-create-now');
    btnCreateNow?.addEventListener('click', () => {
      const customVal = Number(inputCustomTime?.value) || selectedTurnTime;
      const finalTurnTime = Math.max(5, Math.min(60, customVal));
      btnCreateNow.disabled = true;
      btnCreateNow.innerHTML = '⏳ Đang tạo bàn...';
      this.mpManager.createRoom(finalTurnTime);
    });

    // Nút Đóng Modal Entry
    document.getElementById('btn-close-entry-modal')?.addEventListener('click', () => {
      this.mpEntryModal?.classList.remove('active');
      this.mpManager.resetEntryButtons();
      if (!this.mpManager.currentRoom) {
        this.switchMode('solo');
      }
    });

    // Kiểm tra nếu có mã room trên URL query thì tự động chuyển sang multi
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('room')) {
      setTimeout(() => {
        this.switchMode('multi');
      }, 300);
    }
  }

  /**
   * Đặt lại giao diện Bàn Đấu sang chế độ Đấu Nhóm (chờ vào bàn)
   */
  resetTableForMultiplayer() {
    clearInterval(this.timerInterval);
    this.isPlayerTurn = false;
    this.recentChain = [];

    if (this.elCenterWordCard) {
      this.elCenterWordCard.style.cursor = 'default';
      this.elCenterWordCard.innerHTML = 'Phòng Chờ';
    }
    if (this.elTargetSyllableBadge) this.elTargetSyllableBadge.textContent = '---';
    if (this.elSpotlightSpeakerLabel) this.elSpotlightSpeakerLabel.textContent = 'Bàn Đấu Nhóm';
    if (this.elRecentChainFlow) this.elRecentChainFlow.innerHTML = '';
    if (this.elMetaPlayersText) this.elMetaPlayersText.textContent = 'Bàn đấu nhóm';
    if (this.elMetaStatusText) {
      this.elMetaStatusText.textContent = 'Chờ vào bàn';
      this.elMetaStatusText.style.cursor = 'default';
    }
    if (this.elMetaChainText) this.elMetaChainText.textContent = '0 từ';

    if (this.elInput) {
      this.elInput.disabled = true;
      this.elInput.value = '';
      this.elInput.placeholder = 'Tạo hoặc vào bàn để bắt đầu...';
    }
    if (this.elHintText) {
      this.elHintText.textContent = 'Tạo bàn mới hoặc nhập mã PIN 4 chữ số để cùng chơi!';
    }

    // Xóa ghế bot ở 12h
    const topSeats = document.getElementById('table-top-seats');
    const leftSeats = document.getElementById('table-left-seats');
    const rightSeats = document.getElementById('table-right-seats');
    if (topSeats) topSeats.innerHTML = '';
    if (leftSeats) leftSeats.innerHTML = '';
    if (rightSeats) rightSeats.innerHTML = '';

    // Ghế 6h luôn là Bạn
    if (this.elTableBottomSeats) {
      this.elTableBottomSeats.innerHTML = `
        <div class="player-seat is-me" title="Hướng 6h: Vị trí của Bạn">
          <div class="seat-avatar-wrap">
            <div class="seat-avatar">${this.player.avatar || '🐱'}</div>
          </div>
          <div class="seat-meta">
            <div class="seat-name-row">
              <span class="seat-name">${this.player.name || 'Người Chơi'}</span>
              <span class="seat-clock-tag">6h • Bạn</span>
            </div>
            <span class="seat-stat">${this.score || 0}đ</span>
            <span class="seat-status-badge">Sẵn sàng</span>
          </div>
        </div>
      `;
    }
  }

  /**
   * Chuyển đổi giữa chế độ Solo và Đấu Nhóm
   */
  switchMode(targetMode) {
    if (this.mode === targetMode) return;
    this.mode = targetMode;

    if (this.mode === 'solo') {
      this.tabSolo?.classList.add('active');
      this.tabMulti?.classList.remove('active');
      if (this.elBtnGiveUp) this.elBtnGiveUp.style.display = 'none';

      // Xóa turn tracker nếu có
      const tracker = document.getElementById('mp-turn-tracker');
      if (tracker) tracker.remove();

      this.mpEntryModal?.classList.remove('active');
      document.getElementById('mp-room-modal')?.classList.remove('active');

      if (this.elModal) this.elModal.classList.remove('active');

      // Khởi động lại ván chơi đơn với bot
      this.startNewGame();
    } else {
      // Đấu Nhóm
      this.tabMulti?.classList.add('active');
      this.tabSolo?.classList.remove('active');
      if (this.elBtnGiveUp) this.elBtnGiveUp.style.display = 'inline-block';

      // Dừng vòng lặp timer chơi đơn
      clearInterval(this.timerInterval);

      if (this.elModal) this.elModal.classList.remove('active');

      // Nếu chưa vào phòng nào, thiết lập bàn chờ và mở modal tạo / vào phòng
      if (!this.mpManager.currentRoom) {
        this.resetTableForMultiplayer();
        this.mpEntryModal?.classList.add('active');
        this.mpManager.connect();
      } else {
        if (this.mpManager.currentRoom.state === 'LOBBY') {
          this.mpManager.renderLobby();
        }
      }
    }
  }

  /**
   * Xử lý gửi từ (Router cho Solo & Multiplayer)
   */
  handleGeneralSubmit() {
    if (this.mode === 'multi') {
      if (!this.mpManager.isMyTurn || this.mpManager.isEliminated) {
        this.mpManager.showToast('Chưa đến lượt của bạn!');
        return;
      }
      const rawInput = (this.elInput?.value || '').trim();
      if (!rawInput) {
        this.mpManager.showToast('Bạn chưa nhập từ nào!');
        return;
      }
      this.mpManager.submitWord(rawInput);
    } else {
      this.handlePlayerSubmit();
    }
  }

  // ============================================================
  // LOGIC CHẾ ĐỘ CHƠI ĐƠN VỚI BOT (SOLO)
  // ============================================================

  /**
   * Bàn thi đấu: Render các ghế người chơi ở chế độ Solo (Bạn vs Bot)
   */
  renderSoloSeats(activeTurn = 'bot') {
    if (this.mode !== 'solo') return;

    if (this.elMetaPlayersText) {
      this.elMetaPlayersText.textContent = 'Bàn đấu: 2 người (Bạn vs Bot)';
    }
    if (this.elMetaStatusText) {
      this.elMetaStatusText.textContent = this.isGameOver ? 'Kết thúc ván' : 'Đang thi đấu';
    }
    if (this.elMetaChainText) {
      this.elMetaChainText.textContent = `${this.wordCount} từ đã nối`;
    }

    // Xóa ghế 2 bên cánh khi chơi Solo
    const leftSeats = document.getElementById('table-left-seats');
    const rightSeats = document.getElementById('table-right-seats');
    if (leftSeats) leftSeats.innerHTML = '';
    if (rightSeats) rightSeats.innerHTML = '';

    // Hướng 12h (Đối diện): Bot Thông Thái
    if (this.elTableTopSeats) {
      const isBotTurn = (activeTurn === 'bot');
      let botBubbleHtml = '';
      const activeBot = this.activeSoloBubbles.get('bot');
      if (activeBot && activeBot.expiresAt > Date.now()) {
        const icon = activeBot.status === 'correct' ? '✅' : (activeBot.status === 'wrong' ? '❌' : '✍️');
        const detailBadge = activeBot.detail ? `<span class="bubble-badge">${activeBot.detail}</span>` : '';
        botBubbleHtml = `
          <div class="seat-speech-bubble ${activeBot.status}">
            <span class="bubble-word">${icon} "${activeBot.text}"</span>
            ${detailBadge}
          </div>
        `;
      }

      this.elTableTopSeats.innerHTML = `
        <div class="player-seat ${isBotTurn ? 'is-turn' : ''}" title="Hướng 12h: Bot Thông Thái">
          <div class="seat-bubble-container" id="seat-bubble-bot">
            ${botBubbleHtml}
          </div>
          <div class="seat-avatar-wrap">
            <div class="seat-avatar">🤖</div>
            ${isBotTurn ? '<div class="seat-turn-dot"></div>' : ''}
          </div>
          <div class="seat-meta">
            <div class="seat-name-row">
              <span class="seat-name">Bot Thông Thái</span>
              <span class="seat-clock-tag">12h</span>
            </div>
            <span class="seat-stat">${this.botWordCount || 0} từ</span>
            <span class="seat-status-badge ${isBotTurn ? 'seat-status-turn' : ''}">
              ${isBotTurn ? '⚡ Đang suy nghĩ' : '⏳ Chờ lượt'}
            </span>
          </div>
        </div>
      `;
    }

    // Hướng 6h (Chính diện - Vị trí mặc định của Bạn!): Player
    if (this.elTableBottomSeats) {
      const isPlayerTurn = (activeTurn === 'user');
      let userBubbleHtml = '';
      const activeUser = this.activeSoloBubbles.get('user');
      if (activeUser && activeUser.expiresAt > Date.now()) {
        const icon = activeUser.status === 'correct' ? '✅' : (activeUser.status === 'wrong' ? '❌' : '✍️');
        const detailBadge = activeUser.detail ? `<span class="bubble-badge">${activeUser.detail}</span>` : '';
        userBubbleHtml = `
          <div class="seat-speech-bubble ${activeUser.status}">
            <span class="bubble-word">${icon} "${activeUser.text}"</span>
            ${detailBadge}
          </div>
        `;
      }

      this.elTableBottomSeats.innerHTML = `
        <div class="player-seat is-me ${isPlayerTurn ? 'is-turn' : ''}" title="Hướng 6h: Vị trí của Bạn">
          <div class="seat-bubble-container" id="seat-bubble-user">
            ${userBubbleHtml}
          </div>
          <div class="seat-avatar-wrap">
            <div class="seat-avatar">${this.player.avatar || '🐱'}</div>
            ${isPlayerTurn ? '<div class="seat-turn-dot"></div>' : ''}
          </div>
          <div class="seat-meta">
            <div class="seat-name-row">
              <span class="seat-name">${this.player.name || 'Người Chơi'}</span>
              <span class="seat-clock-tag">6h • Bạn</span>
            </div>
            <span class="seat-stat">${this.score}đ • ${this.wordCount} từ</span>
            <span class="seat-status-badge ${isPlayerTurn ? 'seat-status-turn' : ''}">
              ${isPlayerTurn ? '👉 Đến lượt bạn' : '⏳ Chờ máy'}
            </span>
          </div>
        </div>
      `;
    }
  }

  /**
   * Bàn thi đấu: Cập nhật thẻ bài tâm bàn và mạch chuỗi từ nối
   */
  updateTableCenter(word, speakerName = '', scoreGain = '') {
    if (!word) return;

    if (this.elCenterWordCard) {
      this.elCenterWordCard.textContent = word;
    }
    if (this.elSpotlightSpeakerLabel && speakerName) {
      this.elSpotlightSpeakerLabel.textContent = `${speakerName} vừa đánh`;
    }

    const parts = dictionary.splitWords(word);
    const targetSyllable = parts ? parts.last : '';
    if (this.elTargetSyllableBadge) {
      this.elTargetSyllableBadge.textContent = targetSyllable ? `${targetSyllable} ...` : '---';
    }

    if (!this.recentChain) this.recentChain = [];
    this.recentChain.push(word);
    if (this.recentChain.length > 4) {
      this.recentChain.shift();
    }

    if (this.elRecentChainFlow) {
      this.elRecentChainFlow.innerHTML = this.recentChain.map((w, idx) => {
        const isLast = idx === this.recentChain.length - 1;
        return `
          <span class="chain-chip ${isLast ? 'active' : ''}">${w}</span>
          ${!isLast ? '<span class="chain-arrow">➔</span>' : ''}
        `;
      }).join('');
    }

    if (this.elMetaChainText) {
      this.elMetaChainText.textContent = `${this.wordCount} từ đã nối`;
    }
  }

  /**
   * Bắt đầu một ván chơi đơn mới
   */
  startNewGame() {
    this.score = 0;
    this.wordCount = 0;
    this.botWordCount = 0;
    this.streak = 0;
    this.recentChain = [];
    this.usedWords.clear();
    this.isGameOver = false;
    this.updateScoreUI();

    if (this.elModal) {
      this.elModal.classList.remove('active');
    }

    this.renderSoloSeats('bot');

    // Chọn từ xuất phát của Bot
    this.currentWord = dictionary.getRandomStartWord();
    this.usedWords.add(dictionary.normalize(this.currentWord));
    this.botWordCount = 1;

    // Máy ra từ đầu tiên trên bàn
    setTimeout(() => {
      this.addChatBubble('bot', this.currentWord);
      this.updateTableCenter(this.currentWord, 'Bot');
      this.showSoloSeatBubble('bot', this.currentWord, 'correct');
      sounds.playPop();
      this.startPlayerTurn();
    }, 400);
  }

  /**
   * Bắt đầu lượt của người chơi (Solo)
   */
  startPlayerTurn() {
    if (this.isGameOver) return;
    this.isPlayerTurn = true;
    this.timeLeft = this.soloTurnTimeLimit;
    this.renderSoloSeats('user');

    const parts = dictionary.splitWords(this.currentWord);
    const targetFirstSyllable = parts ? parts.last : '';

    if (this.elHintText) {
      this.elHintText.innerHTML = `Nối từ bắt đầu bằng tiếng: <strong class="highlight-syllable">${targetFirstSyllable}</strong>`;
    }

    if (this.elInput) {
      this.elInput.disabled = false;
      this.elInput.value = '';
      this.elInput.placeholder = `Ví dụ: ${targetFirstSyllable} ...`;
      this.elInput.focus();
    }

    this.startTimer();
  }

  /**
   * Quản lý đếm ngược (Solo)
   */
  startTimer() {
    clearInterval(this.timerInterval);
    this.updateTimerUI();

    this.timerInterval = setInterval(() => {
      this.timeLeft -= 0.1;
      this.updateTimerUI();

      if (this.timeLeft <= 3.5 && this.timeLeft > 0) {
        if (Math.round(this.timeLeft * 10) % 10 === 0) {
          sounds.playTick();
        }
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.triggerGameOver('Hết thời gian suy nghĩ!');
      }
    }, 100);
  }

  updateTimerUI() {
    const percentage = Math.max(0, Math.min(100, (this.timeLeft / this.soloTurnTimeLimit) * 100));
    if (this.elTimerBar) {
      this.elTimerBar.style.width = `${percentage}%`;
      if (percentage > 50) {
        this.elTimerBar.style.backgroundColor = 'var(--primary)';
      } else if (percentage > 25) {
        this.elTimerBar.style.backgroundColor = 'var(--warning)';
      } else {
        this.elTimerBar.style.backgroundColor = 'var(--danger)';
      }
    }

    const secVal = Math.max(0, Math.ceil(this.timeLeft));
    if (this.elCenterTimerVal) {
      this.elCenterTimerVal.textContent = secVal;
    }
    const circle = document.getElementById('center-timer-circle');
    if (circle) {
      if (percentage > 50) {
        circle.style.borderColor = 'var(--primary)';
        if (this.elCenterTimerVal) this.elCenterTimerVal.style.color = 'var(--primary-dark)';
      } else if (percentage > 25) {
        circle.style.borderColor = 'var(--warning)';
        if (this.elCenterTimerVal) this.elCenterTimerVal.style.color = 'var(--warning)';
      } else {
        circle.style.borderColor = 'var(--danger)';
        if (this.elCenterTimerVal) this.elCenterTimerVal.style.color = 'var(--danger)';
      }
    }
  }

  /**
   * Hiển thị bóng thoại trên ghế người chơi hoặc Bot ở chế độ Solo
   */
  showSoloSeatBubble(target, text, status = 'correct', detail = '') {
    if (!target) return;
    const duration = status === 'wrong' ? 3200 : (status === 'typing' ? 2200 : 2600);
    const expiresAt = Date.now() + duration;

    this.activeSoloBubbles.set(target, {
      text,
      status,
      detail,
      expiresAt
    });

    const containerId = target === 'user' ? 'seat-bubble-user' : 'seat-bubble-bot';
    const container = document.getElementById(containerId);
    if (container) {
      if (container._bubbleTimer) clearTimeout(container._bubbleTimer);

      const icon = status === 'correct' ? '✅' : (status === 'wrong' ? '❌' : '✍️');
      const detailBadge = detail ? `<span class="bubble-badge">${detail}</span>` : '';

      container.innerHTML = `
        <div class="seat-speech-bubble ${status}">
          <span class="bubble-word">${icon} "${text}"</span>
          ${detailBadge}
        </div>
      `;

      container._bubbleTimer = setTimeout(() => {
        const bubble = container.querySelector('.seat-speech-bubble');
        if (bubble) {
          bubble.classList.add('fade-out');
          setTimeout(() => {
            if (this.activeSoloBubbles.get(target)?.expiresAt <= Date.now()) {
              this.activeSoloBubbles.delete(target);
            }
            if (container.querySelector('.seat-speech-bubble') === bubble) {
              container.innerHTML = '';
            }
          }, 260);
        } else {
          this.activeSoloBubbles.delete(target);
        }
      }, duration);
    }
  }

  /**
   * Xử lý người chơi bấm gửi từ (Solo)
   */
  handlePlayerSubmit() {
    if (!this.isPlayerTurn || this.isGameOver) return;

    const rawInput = (this.elInput?.value || '').trim();
    if (!rawInput) {
      this.showSoloSeatBubble('user', '---', 'wrong', 'Chưa nhập từ nào');
      this.showInputError('Bạn chưa nhập từ nào!');
      return;
    }

    const cleanInput = dictionary.normalize(rawInput);

    // 1. Kiểm tra số tiếng
    if (dictionary.countSyllables(cleanInput) !== 2) {
      this.showSoloSeatBubble('user', rawInput, 'wrong', 'Phải có 2 tiếng');
      this.showInputError('Từ phải có chính xác 2 tiếng!');
      return;
    }

    // 2. Nhận diện từ trong từ điển (hỗ trợ cả có dấu và không dấu)
    const matchedWord = dictionary.resolveWord(cleanInput);
    if (!matchedWord) {
      this.showSoloSeatBubble('user', rawInput, 'wrong', 'Không có trong từ điển');
      this.showInputError(`Từ "${cleanInput}" chưa có trong từ điển tiếng Việt!`);
      return;
    }

    // 3. Kiểm tra tiếng đầu tiên trùng tiếng cuối của bot
    const lastWordParts = dictionary.splitWords(this.currentWord);
    const expectedFirstSyllable = lastWordParts ? lastWordParts.last : '';
    const inputParts = dictionary.splitWords(matchedWord);

    if (!inputParts || !dictionary.syllablesMatch(inputParts.first, expectedFirstSyllable)) {
      this.showSoloSeatBubble('user', rawInput, 'wrong', `Phải bắt đầu bằng "${expectedFirstSyllable}"`);
      this.showInputError(`Tiếng đầu tiên phải là "${expectedFirstSyllable}"!`);
      return;
    }

    // 4. Kiểm tra từ đã dùng chưa
    if (this.usedWords.has(matchedWord)) {
      this.showSoloSeatBubble('user', matchedWord, 'wrong', 'Từ đã dùng rồi');
      this.showInputError(`Từ "${matchedWord}" đã được sử dụng rồi!`);
      return;
    }

    // NỐI TỪ HỢP LỆ THÀNH CÔNG!
    clearInterval(this.timerInterval);
    this.isPlayerTurn = false;
    this.usedWords.add(matchedWord);
    this.currentWord = matchedWord;
    this.wordCount++;
    this.streak++;

    // Tính điểm thưởng
    const speedBonus = Math.floor(Math.max(1, this.timeLeft));
    const streakBonus = Math.min(20, this.streak * 2);
    const roundScore = 10 + speedBonus + streakBonus;
    this.score += roundScore;
    this.updateScoreUI();

    sounds.playCorrect();

    // Hiện bóng thoại màu xanh hợp lệ trên ghế người chơi
    this.showSoloSeatBubble('user', matchedWord, 'correct', `+${roundScore}đ`);

    // Thêm từ vào bàn đấu
    this.addChatBubble('user', matchedWord, `+${roundScore}đ`);
    this.updateTableCenter(matchedWord, this.player.name || 'Bạn', `+${roundScore}đ`);
    this.renderSoloSeats('bot');

    if (this.elInput) {
      this.elInput.disabled = true;
      this.elInput.value = '';
    }

    // Chuyển lượt cho Máy
    this.handleBotTurn();
  }

  /**
   * Lượt phản hồi của Bot (Solo)
   */
  handleBotTurn() {
    if (this.isGameOver) return;

    if (this.elHintText) {
      this.elHintText.innerHTML = `🤖 Bot đang suy nghĩ...`;
    }
    this.renderSoloSeats('bot');
    this.showSoloSeatBubble('bot', '...', 'typing');

    const typingEl = this.showTypingIndicator();

    // Giả lập thời gian suy nghĩ ngẫu nhiên 0.8s - 1.4s
    const thinkTime = 800 + Math.random() * 600;

    setTimeout(() => {
      this.removeTypingIndicator(typingEl);

      const parts = dictionary.splitWords(this.currentWord);
      const targetFirstSyllable = parts ? parts.last : '';
      const candidates = dictionary.findCandidates(targetFirstSyllable, this.usedWords);

      if (candidates.length === 0) {
        // Bot bí từ -> Người chơi CHIẾN THẮNG!
        sounds.playVictory();
        this.score += 50; // Thưởng chiến thắng bot
        this.updateScoreUI();
        this.triggerGameOver('🎉 Bot đã cạn kiệt vốn từ! Bạn đã chiến thắng xuất sắc!', true);
        return;
      }

      // Chọn từ từ candidates
      const chosenWord = candidates[Math.floor(Math.random() * candidates.length)];
      this.usedWords.add(dictionary.normalize(chosenWord));
      this.currentWord = chosenWord;
      this.botWordCount = (this.botWordCount || 0) + 1;

      sounds.playPop();
      this.showSoloSeatBubble('bot', chosenWord, 'correct');
      this.addChatBubble('bot', chosenWord);
      this.updateTableCenter(chosenWord, 'Bot');

      // Chuyển lại lượt cho Người chơi
      this.startPlayerTurn();
    }, thinkTime);
  }

  addChatBubble(sender, word, detail = '') {
    const isUser = sender === 'user';
    const name = isUser ? (this.player.name || 'Người Chơi') : 'Bot Thông Thái';
    this.updateTableCenter(word, name, detail);

    if (!this.elChatList) return;

    const row = document.createElement('div');
    row.className = `chat-row ${sender === 'user' ? 'user-row' : 'bot-row'}`;

    const avatar = isUser ? (this.player.avatar || '🐱') : '🤖';

    row.innerHTML = `
      <div class="chat-avatar-box">${avatar}</div>
      <div class="chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}">
        <span class="chat-sender-name">${name}</span>
        <div class="chat-word-text">${word}</div>
        ${detail ? `<span class="chat-badge-detail">${detail}</span>` : ''}
      </div>
    `;

    this.elChatList.appendChild(row);
    this.elChatList.scrollTop = this.elChatList.scrollHeight;
  }

  showTypingIndicator() {
    if (!this.elChatList) return null;

    const row = document.createElement('div');
    row.className = 'chat-row bot-row typing-row';
    row.innerHTML = `
      <div class="chat-avatar-box">🤖</div>
      <div class="chat-bubble bot-bubble typing-bubble">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;

    this.elChatList.appendChild(row);
    this.elChatList.scrollTop = this.elChatList.scrollHeight;
    return row;
  }

  removeTypingIndicator(el) {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  showInputError(message) {
    sounds.playError();
    if (this.elInput) {
      this.elInput.classList.add('input-shake');
      setTimeout(() => this.elInput.classList.remove('input-shake'), 450);
    }
    if (this.elHintText) {
      const original = this.elHintText.innerHTML;
      this.elHintText.innerHTML = `<span style="color: #FF4A3F; font-weight: 800;">❌ ${message}</span>`;
      setTimeout(() => {
        if (!this.isGameOver) this.elHintText.innerHTML = original;
      }, 2000);
    }
  }

  updateScoreUI() {
    if (this.elScore) {
      this.elScore.textContent = `${this.score}đ`;
    }
  }

  triggerGameOver(reason, isVictory = false) {
    this.isGameOver = true;
    clearInterval(this.timerInterval);

    if (!isVictory) {
      sounds.playGameOver();
    }

    // Gửi điểm số ra Portal chính
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'ARCADE_RECORD_SCORE',
        gameId: 'noi-tu',
        score: this.score
      }, '*');
    }

    // Cập nhật kỷ lục cá nhân
    const currentHigh = Math.max(this.score, (this.player.highScores && this.player.highScores['noi-tu']) || 0);

    if (this.elModal) {
      if (this.elModalTitle) {
        this.elModalTitle.textContent = isVictory ? '🏆 XUẤT SẮC!' : '💥 GAME OVER';
        this.elModalTitle.style.color = isVictory ? 'var(--timer-green)' : '#FF4A3F';
      }
      if (this.elModalReason) {
        this.elModalReason.textContent = reason;
      }
      if (this.elFinalScore) this.elFinalScore.textContent = this.score;
      if (this.elFinalWords) this.elFinalWords.textContent = this.wordCount;
      if (this.elFinalRecord) this.elFinalRecord.textContent = currentHigh;

      this.elModal.classList.add('active');
    }
  }

  /**
   * Thoát ra Portal
   */
  exitGame() {
    clearInterval(this.timerInterval);
    if (this.mpManager) {
      this.mpManager.leaveRoom();
    }
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'ARCADE_EXIT_GAME' }, '*');
    } else {
      window.location.href = '../../../index.html';
    }
  }
}

// Khởi chạy khi DOM sẵn sàng
function bootGame() {
  const game = new WordChainGame();
  game.startNewGame();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootGame);
} else {
  bootGame();
}
