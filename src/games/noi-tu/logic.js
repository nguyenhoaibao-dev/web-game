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
      this.mpEntryModal?.classList.remove('active');
      this.mpManager.connect(() => {
        this.mpManager.joinRoom(pin);
      });
    });

    // Nút Tạo phòng mới
    const btnCreateNow = document.getElementById('btn-create-now');
    btnCreateNow?.addEventListener('click', () => {
      const customVal = Number(inputCustomTime?.value) || selectedTurnTime;
      const finalTurnTime = Math.max(5, Math.min(60, customVal));
      this.mpEntryModal?.classList.remove('active');
      this.mpManager.connect(() => {
        this.mpManager.createRoom(finalTurnTime);
      });
    });

    // Nút Đóng Modal Entry
    document.getElementById('btn-close-entry-modal')?.addEventListener('click', () => {
      this.mpEntryModal?.classList.remove('active');
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

      // Nếu chưa vào phòng nào, mở modal tạo / vào phòng
      if (!this.mpManager.currentRoom) {
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
   * Bắt đầu một ván chơi đơn mới
   */
  startNewGame() {
    this.score = 0;
    this.wordCount = 0;
    this.streak = 0;
    this.usedWords.clear();
    this.isGameOver = false;
    this.updateScoreUI();

    // Reset Chat list
    if (this.elChatList) {
      this.elChatList.innerHTML = `
        <div class="system-msg-row">
          <div class="system-msg-pill">
            <span>✨</span>
            <span>Chào mừng ${this.player.name}! Nối từ 2 tiếng trước khi hết giờ nhé.</span>
          </div>
        </div>
      `;
    }

    if (this.elModal) {
      this.elModal.classList.remove('active');
    }

    // Chọn từ xuất phát của Bot
    this.currentWord = dictionary.getRandomStartWord();
    this.usedWords.add(dictionary.normalize(this.currentWord));

    // Máy ra từ đầu tiên
    setTimeout(() => {
      this.addChatBubble('bot', this.currentWord);
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

    const parts = dictionary.splitWords(this.currentWord);
    const targetFirstSyllable = parts ? parts.last : '';

    if (this.elHintText) {
      this.elHintText.innerHTML = `Hãy nhập từ bắt đầu bằng chữ: <strong class="highlight-syllable">${targetFirstSyllable}</strong>`;
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

      // Âm thanh tick khi còn dưới 3.5 giây
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
    if (!this.elTimerBar) return;
    const percentage = Math.max(0, Math.min(100, (this.timeLeft / this.soloTurnTimeLimit) * 100));
    this.elTimerBar.style.width = `${percentage}%`;

    if (percentage > 50) {
      this.elTimerBar.style.backgroundColor = 'var(--timer-green)';
    } else if (percentage > 25) {
      this.elTimerBar.style.backgroundColor = 'var(--timer-yellow)';
    } else {
      this.elTimerBar.style.backgroundColor = 'var(--timer-red)';
    }
  }

  /**
   * Xử lý người chơi bấm gửi từ (Solo)
   */
  handlePlayerSubmit() {
    if (!this.isPlayerTurn || this.isGameOver) return;

    const rawInput = (this.elInput?.value || '').trim();
    if (!rawInput) {
      this.showInputError('Bạn chưa nhập từ nào!');
      return;
    }

    const cleanInput = dictionary.normalize(rawInput);

    // 1. Kiểm tra số tiếng
    if (dictionary.countSyllables(cleanInput) !== 2) {
      this.showInputError('Từ phải có chính xác 2 tiếng!');
      return;
    }

    // 2. Nhận diện từ trong từ điển (hỗ trợ cả có dấu và không dấu)
    const matchedWord = dictionary.resolveWord(cleanInput);
    if (!matchedWord) {
      this.showInputError(`Từ "${cleanInput}" chưa có trong từ điển tiếng Việt!`);
      return;
    }

    // 3. Kiểm tra tiếng đầu tiên trùng tiếng cuối của bot
    const lastWordParts = dictionary.splitWords(this.currentWord);
    const expectedFirstSyllable = lastWordParts ? lastWordParts.last : '';
    const inputParts = dictionary.splitWords(matchedWord);

    if (!inputParts || !dictionary.syllablesMatch(inputParts.first, expectedFirstSyllable)) {
      this.showInputError(`Tiếng đầu tiên phải là "${expectedFirstSyllable}"!`);
      return;
    }

    // 4. Kiểm tra từ đã dùng chưa
    if (this.usedWords.has(matchedWord)) {
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

    // Thêm chat bubble người chơi
    this.addChatBubble('user', matchedWord, `+${roundScore}đ`);

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

      sounds.playPop();
      this.addChatBubble('bot', chosenWord);

      // Chuyển lại lượt cho Người chơi
      this.startPlayerTurn();
    }, thinkTime);
  }

  addChatBubble(sender, word, detail = '') {
    if (!this.elChatList) return;

    const row = document.createElement('div');
    row.className = `chat-row ${sender === 'user' ? 'user-row' : 'bot-row'}`;

    const isUser = sender === 'user';
    const avatar = isUser ? (this.player.avatar || '🐱') : '🤖';
    const name = isUser ? (this.player.name || 'Người Chơi') : 'Bot Thông Thái';

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
