/**
 * Game Card Component
 * Renders interactive game selection cards with Neubrutalism styling.
 */
import { playerManager } from '../core/playerManager.js';

export const GAME_CATALOG = [
  {
    id: 'noi-tu',
    title: 'Nối Từ Tiếng Việt',
    shortDesc: 'Đấu trí 2 tiếng cực cuốn: Luyện với bot hoặc ĐẤU NHÓM ONLINE (Mã PIN) sinh tồn!',
    icon: '💬',
    bgColor: '#FFE3E0',
    tag: 'ĐẤU NHÓM 🔥',
    tagColor: 'badge-red',
    path: 'src/games/noi-tu/index.html',
    plays: '15.2k lượt chơi'
  },
  {
    id: 'snake',
    title: 'Rắn Săn Mồi Bự',
    shortDesc: 'Điều khiển chú rắn cartoon háu ăn, gom táo đỏ và phá vỡ kỷ lục chiều dài!',
    icon: '🐍',
    bgColor: '#E1F8DC',
    tag: 'CỔ ĐIỂN 🍎',
    tagColor: 'badge-green',
    path: 'src/games/snake/index.html',
    plays: '8.9k lượt chơi'
  }
];

export function renderGameList(container, onPlayGame) {
  if (!container) return;

  container.innerHTML = GAME_CATALOG.map(game => {
    const highScore = playerManager.getHighScore(game.id);

    return `
      <div class="game-card" data-game-id="${game.id}">
        <div class="game-card-top">
          <div class="game-thumbnail" style="background-color: ${game.bgColor};">
            ${game.icon}
          </div>
          <div class="game-meta">
            <div class="game-title-row">
              <span class="game-name">${game.title}</span>
              <span class="badge-neu ${game.tagColor}">${game.tag}</span>
            </div>
            <p class="game-desc">${game.shortDesc}</p>
            <div class="game-stats-row">
              <span>👥 ${game.plays}</span>
            </div>
          </div>
        </div>

        <div class="game-card-action">
          <div class="high-score-tag">
            <span>🏆 Kỷ lục:</span>
            <strong id="high-score-${game.id}">${highScore} điểm</strong>
          </div>
          <button class="btn-neu btn-primary btn-sm btn-play" data-game-id="${game.id}">
            CHƠI NGAY ▶
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Event listener cho cả Card và nút Chơi ngay
  container.querySelectorAll('.game-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      const gameId = card.getAttribute('data-game-id');
      const game = GAME_CATALOG.find(g => g.id === gameId);
      if (game && typeof onPlayGame === 'function') {
        onPlayGame(game);
      }
    });
  });

  // Tự động cập nhật điểm kỷ lục khi có thay đổi
  window.addEventListener('arcade_player_updated', () => {
    GAME_CATALOG.forEach(game => {
      const el = document.getElementById(`high-score-${game.id}`);
      if (el) {
        el.textContent = `${playerManager.getHighScore(game.id)} điểm`;
      }
    });
  });
}
