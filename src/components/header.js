/**
 * Header Component
 * Renders portal navigation, logo, coins, and editable player profile.
 */
import { playerManager, AVATAR_LIST } from '../core/playerManager.js';

export function renderHeader(container) {
  if (!container) return;

  const profile = playerManager.getProfile();

  container.innerHTML = `
    <header class="portal-header">
      <a href="#" class="portal-brand" id="btn-brand-home" title="Trang chủ Arcade Vui">
        <div class="brand-icon-box">🎮</div>
        <h1 class="brand-title">ARCADE<span>VUI</span></h1>
      </a>

      <div class="user-profile-bar">
        <div class="coin-chip" id="coin-display" title="Số Xu tích lũy">
          <span class="coin-icon">🪙</span>
          <span id="player-coins-val">${profile.coins || 0}</span>
        </div>

        <button class="avatar-btn" id="btn-open-profile" title="Xem hồ sơ / Đổi tên">
          <span id="player-avatar-val">${profile.avatar || '🐱'}</span>
        </button>
      </div>
    </header>

    <!-- Modal sửa hồ sơ người chơi -->
    <div class="modal-overlay" id="profile-modal">
      <div class="modal-box">
        <h3 class="modal-title">✏️ Hồ Sơ Người Chơi</h3>
        <p style="font-size: 0.88rem; color: #555;">Chọn nhân vật và đặt biệt danh yêu thích của bạn:</p>

        <div>
          <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 6px;">Chọn Avatar:</label>
          <div class="avatar-selector" id="avatar-selector-box">
            ${AVATAR_LIST.map(av => `
              <div class="avatar-option ${av === profile.avatar ? 'selected' : ''}" data-avatar="${av}">
                ${av}
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 6px;">Biệt danh của bạn:</label>
          <input type="text" class="input-neu" id="input-player-name" maxlength="24" value="${profile.name}" placeholder="Nhập biệt danh...">
        </div>

        <div class="modal-actions">
          <button class="btn-neu btn-sm" id="btn-close-modal" style="background-color: #E2E8F0;">Đóng</button>
          <button class="btn-neu btn-sm btn-accent" id="btn-save-profile">Lưu Lại</button>
        </div>
      </div>
    </div>
  `;

  setupProfileEvents();
}

function setupProfileEvents() {
  const modal = document.getElementById('profile-modal');
  const btnOpen = document.getElementById('btn-open-profile');
  const btnClose = document.getElementById('btn-close-modal');
  const btnSave = document.getElementById('btn-save-profile');
  const inputName = document.getElementById('input-player-name');
  const avatarBoxes = document.querySelectorAll('.avatar-option');

  let selectedAvatar = playerManager.getProfile().avatar;

  btnOpen?.addEventListener('click', (e) => {
    e.stopPropagation();
    const current = playerManager.getProfile();
    inputName.value = current.name;
    selectedAvatar = current.avatar;
    avatarBoxes.forEach(box => {
      box.classList.toggle('selected', box.getAttribute('data-avatar') === selectedAvatar);
    });
    modal.classList.add('active');
  });

  btnClose?.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  avatarBoxes.forEach(box => {
    box.addEventListener('click', () => {
      avatarBoxes.forEach(b => b.classList.remove('selected'));
      box.classList.add('selected');
      selectedAvatar = box.getAttribute('data-avatar');
    });
  });

  btnSave?.addEventListener('click', () => {
    const newName = inputName.value.trim();
    if (newName) {
      playerManager.setName(newName);
    }
    if (selectedAvatar) {
      playerManager.setAvatar(selectedAvatar);
    }
    modal.classList.remove('active');
  });

  // Lắng nghe cập nhật profile từ bất kỳ đâu (kể cả iframe game gửi ra)
  window.addEventListener('arcade_player_updated', (e) => {
    const updated = e.detail?.profile || playerManager.getProfile();
    const coinVal = document.getElementById('player-coins-val');
    const avatarVal = document.getElementById('player-avatar-val');
    if (coinVal) coinVal.textContent = updated.coins;
    if (avatarVal) avatarVal.textContent = updated.avatar;
  });
}
