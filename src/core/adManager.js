/**
 * Ad Manager
 * Quản lý quảng cáo Neubrutalism giả lập sinh động (AdSense Simulation), 
 * làm mới ads khi đổi game và tặng thưởng xu tương tác.
 */
import { playerManager } from './playerManager.js';

const ADS_CREATIVES = [
  {
    id: 'ad_pizza',
    title: '🍕 Pizza Pixel Bốc Khói',
    desc: 'Bánh pizza phô mai kéo sợi siêu ngon. Giảm ngay 30% hôm nay!',
    btnText: 'Ăn Ngay',
    color: '#FF6B6B',
    art: '🍕'
  },
  {
    id: 'ad_soda',
    title: '🥤 Nước Ngọt Vui Vẻ',
    desc: 'Giải khát cực đã, bật nắp trúng ngay 1000 điểm arcade!',
    btnText: 'Khám Phá',
    color: '#4D96FF',
    art: '🥤'
  },
  {
    id: 'ad_sneaker',
    title: '👟 Giày Siêu Bật Nhảy',
    desc: 'Tăng 200% tốc độ chạy nhảy. Thiết kế êm ái cực chất!',
    btnText: 'Xem Giày',
    color: '#00C49A',
    art: '👟'
  },
  {
    id: 'ad_cat_cafe',
    title: '☕ Quán Cà Phê Mèo Mập',
    desc: 'Thưởng thức trà sữa và ôm 20 chú mèo múp míp dễ thương!',
    btnText: 'Đặt Bàn',
    color: '#FFC000',
    art: '🐱'
  },
  {
    id: 'ad_gamepad',
    title: '🎮 Tay Cầm Pro Max',
    desc: 'Không giật lag, độ nhạy chuẩn eSports, bấm cực nảy tay!',
    btnText: 'Săn Ngay',
    color: '#9B5DE5',
    art: '🕹️'
  }
];

export class AdManager {
  constructor() {
    this.currentLeftIndex = 0;
    this.currentRightIndex = 1;
    this.currentFeedIndex = 2;
  }

  /**
   * Khởi tạo và gắn ads vào DOM
   */
  init() {
    this.renderSideAds();
    this.renderInFeedAd();
  }

  /**
   * Render quảng cáo 2 cột bên hông Desktop
   */
  renderSideAds() {
    const leftContainer = document.getElementById('ad-banner-left');
    const rightContainer = document.getElementById('ad-banner-right');

    if (leftContainer) {
      const ad = ADS_CREATIVES[this.currentLeftIndex % ADS_CREATIVES.length];
      leftContainer.innerHTML = this.createSideAdHTML(ad, 'Quảng Cáo Google 160x600');
      this.attachAdListener(leftContainer);
    }

    if (rightContainer) {
      const ad = ADS_CREATIVES[this.currentRightIndex % ADS_CREATIVES.length];
      rightContainer.innerHTML = this.createSideAdHTML(ad, 'Quảng Cáo Nhà Tài Trợ');
      this.attachAdListener(rightContainer);
    }
  }

  /**
   * Render banner in-feed ở trang Portal
   */
  renderInFeedAd() {
    const feedContainer = document.getElementById('infeed-ad-slot');
    if (feedContainer) {
      const ad = ADS_CREATIVES[this.currentFeedIndex % ADS_CREATIVES.length];
      feedContainer.innerHTML = `
        <div class="infeed-ad" style="border-left: 3px solid var(--primary);">
          <span class="ad-tag">+15 Xu</span>
          <div class="ad-art" style="background-color: var(--primary-light);">${ad.art}</div>
          <div class="ad-body">
            <h4 class="ad-title">${ad.title}</h4>
            <p class="ad-subtitle">${ad.desc}</p>
          </div>
          <button class="btn-neu btn-sm btn-accent">${ad.btnText}</button>
        </div>
      `;
      this.attachAdListener(feedContainer);
    }
  }

  createSideAdHTML(ad, sponsorTag) {
    return `
      <div class="card-neu" style="background-color: #ffffff; text-align: center; display: flex; flex-direction: column; gap: 10px; padding: 14px 10px;">
        <div style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: var(--bg-surface); color: var(--text-muted); border-radius: 4px; padding: 3px 6px; border: 1px solid var(--border-color);">
          ${sponsorTag}
        </div>
        
        <div style="width: 56px; height: 56px; margin: 4px auto; background-color: var(--primary-light); border: 1px solid var(--primary-border); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem;">
          ${ad.art}
        </div>

        <div>
          <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-dark); margin-bottom: 3px;">${ad.title}</h4>
          <p style="font-size: 0.74rem; color: var(--text-muted); line-height: 1.35;">${ad.desc}</p>
        </div>

        <button class="btn-neu btn-sm btn-primary" style="margin-top: 2px; width: 100%;">
          ${ad.btnText} (+15 Xu)
        </button>
      </div>
    `;
  }

  attachAdListener(element) {
    const btn = element.querySelector('button') || element;
    btn.onclick = (e) => {
      e.stopPropagation();
      playerManager.addCoins(15);
      alert('🎉 Bạn đã tương tác với nhà tài trợ và nhận được 15 Xu thưởng!');
      this.refreshAds();
    };
  }

  /**
   * Làm mới quảng cáo khi chuyển cảnh hoặc hoàn thành game
   */
  refreshAds() {
    this.currentLeftIndex = (this.currentLeftIndex + 1) % ADS_CREATIVES.length;
    this.currentRightIndex = (this.currentRightIndex + 2) % ADS_CREATIVES.length;
    this.currentFeedIndex = (this.currentFeedIndex + 1) % ADS_CREATIVES.length;
    this.renderSideAds();
    this.renderInFeedAd();
  }
}

export const adManager = new AdManager();
