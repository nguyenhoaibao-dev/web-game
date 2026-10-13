/**
 * Player Manager
 * Manages player profile, random name generation, coins, and high scores.
 */
import { storage } from './storage.js';

const RANDOM_ADJECTIVES = [
  'Siêu Cấp', 'Tinh Nghịch', 'Bác Học', 'Đáng Yêu', 'Thần Tốc', 
  'Vui Vẻ', 'Chiến Binh', 'Hài Hước', 'Dũng Cảm', 'Nhanh Nhẹn',
  'Thông Thái', 'Tinh Tế', 'Bất Khả Chiến Bại', 'Huyền Thoại'
];

const RANDOM_ANIMALS = [
  'Mèo Béo', 'Gấu Nâu', 'Sóc Nhỏ', 'Cáo Cam', 'Thỏ Bảy Màu',
  'Chim Cánh Cụt', 'Hổ Con', 'Rùa Vàng', 'Gà Con', 'Vịt Donal',
  'Khỉ Thông Minh', 'Chó Shiba', 'Cá Heo', 'Gấu Trúc'
];

export const AVATAR_LIST = ['🐱', '🐻', '🦊', '🐰', '🐧', '🐯', '🐵', '🐶', '🐼', '🐸', '🦁', '🦄'];

const PROFILE_KEY = 'player_profile';

export class PlayerManager {
  constructor() {
    this.profile = this.loadProfile();
  }

  /**
   * Sinh ngẫu nhiên tên thân thiện và đáng yêu bằng tiếng Việt
   */
  generateRandomName() {
    const animal = RANDOM_ANIMALS[Math.floor(Math.random() * RANDOM_ANIMALS.length)];
    const adj = RANDOM_ADJECTIVES[Math.floor(Math.random() * RANDOM_ADJECTIVES.length)];
    return `${animal} ${adj}`;
  }

  /**
   * Sinh ngẫu nhiên avatar
   */
  generateRandomAvatar() {
    return AVATAR_LIST[Math.floor(Math.random() * AVATAR_LIST.length)];
  }

  /**
   * Khởi tạo hoặc tải profile người chơi
   */
  loadProfile() {
    let data = storage.get(PROFILE_KEY, null);
    if (!data || !data.name) {
      data = {
        id: 'user_' + Date.now().toString(36),
        name: this.generateRandomName(),
        avatar: this.generateRandomAvatar(),
        coins: 100, // Điểm xu ban đầu tặng người chơi
        highScores: {
          'noi-tu': 0,
          'snake': 0
        },
        gamesPlayed: 0,
        createdAt: Date.now()
      };
      storage.set(PROFILE_KEY, data);
    }
    return data;
  }

  /**
   * Lấy thông tin profile hiện tại
   */
  getProfile() {
    return { ...this.profile };
  }

  /**
   * Cập nhật tên người chơi
   */
  setName(newName) {
    const cleanName = (newName || '').trim();
    if (!cleanName) return false;
    this.profile.name = cleanName.slice(0, 24);
    this.save();
    return true;
  }

  /**
   * Cập nhật avatar
   */
  setAvatar(newAvatar) {
    if (newAvatar) {
      this.profile.avatar = newAvatar;
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Cộng hoặc trừ xu/điểm
   */
  addCoins(amount) {
    this.profile.coins = Math.max(0, (this.profile.coins || 0) + amount);
    this.save();
    return this.profile.coins;
  }

  /**
   * Ghi nhận điểm số của một ván chơi
   * @param {string} gameId 
   * @param {number} score 
   * @returns {{ isNewRecord: boolean, currentRecord: number }}
   */
  recordGameScore(gameId, score) {
    if (!this.profile.highScores) {
      this.profile.highScores = {};
    }
    const currentRecord = this.profile.highScores[gameId] || 0;
    let isNewRecord = false;
    if (score > currentRecord) {
      this.profile.highScores[gameId] = score;
      isNewRecord = true;
    }
    this.profile.gamesPlayed = (this.profile.gamesPlayed || 0) + 1;
    // Thưởng xu theo điểm số: 1 điểm = 2 xu
    const rewardCoins = Math.max(5, Math.floor(score * 2));
    this.profile.coins = (this.profile.coins || 0) + rewardCoins;

    this.save();
    return { isNewRecord, currentRecord: this.profile.highScores[gameId], rewardCoins };
  }

  /**
   * Lấy điểm kỷ lục của một game
   */
  getHighScore(gameId) {
    return (this.profile.highScores && this.profile.highScores[gameId]) || 0;
  }

  /**
   * Lưu và phát sự kiện đồng bộ
   */
  save() {
    storage.set(PROFILE_KEY, this.profile);
    window.dispatchEvent(new CustomEvent('arcade_player_updated', {
      detail: { profile: this.getProfile() }
    }));
  }
}

export const playerManager = new PlayerManager();
