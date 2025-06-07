// DOM Elements
const uploader = document.getElementById('avatar-uploader');
const msgInput = document.getElementById('message-input');
const genAvatarBtn = document.getElementById('generate-avatar');
const genBannerBtn = document.getElementById('generate-banner');
const resetBtn = document.getElementById('reset-btn');
const resultSection = document.getElementById('result-section');
const overlay = document.getElementById('overlay');
const avatarCanvas = document.getElementById('avatar-canvas');
const bannerCanvas = document.getElementById('banner-canvas');
const downloadBtn = document.getElementById('download-btn');
const ctxAvatar = avatarCanvas.getContext('2d');
const ctxBanner = bannerCanvas.getContext('2d');
const CANVAS_SIZE = 600;

// Setup canvas sizes
avatarCanvas.width = CANVAS_SIZE;
avatarCanvas.height = CANVAS_SIZE;

bannerCanvas.width = 1200;
bannerCanvas.height = 400;

let avatarImage = null;

// Load image
uploader.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    avatarImage = new Image();
    avatarImage.src = ev.target.result;
    avatarImage.onload = () => {};
  };
  reader.readAsDataURL(file);
});

// Loader toggles
function showLoader() { overlay.classList.remove('hidden'); }
function hideLoader() { overlay.classList.add('hidden'); }

// Draw circular avatar
function drawAvatar() {
  ctxAvatar.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctxAvatar.save();
  ctxAvatar.beginPath();
  ctxAvatar.arc(CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2, 0, Math.PI*2);
  ctxAvatar.closePath();
  ctxAvatar.clip();

  const ratio = avatarImage.width / avatarImage.height;
  let dw, dh, dx, dy;
  if (ratio > 1) {
    dh = CANVAS_SIZE;
    dw = avatarImage.width * (CANVAS_SIZE / avatarImage.height);
    dx = (CANVAS_SIZE - dw) / 2;
    dy = 0;
  } else {
    dw = CANVAS_SIZE;
    dh = avatarImage.height * (CANVAS_SIZE / avatarImage.width);
    dx = 0;
    dy = (CANVAS_SIZE - dh) / 2;
  }

  ctxAvatar.drawImage(avatarImage, dx, dy, dw, dh);
  ctxAvatar.restore();
}

// Draw banner with message
function drawBanner() {
  ctxBanner.clearRect(0, 0, bannerCanvas.width, bannerCanvas.height);
  const padding = 20;
  const avatarSize = bannerCanvas.height - 2 * padding;

  // Avatar circle
  ctxBanner.save();
  ctxBanner.beginPath();
  ctxBanner.arc(padding + avatarSize/2, bannerCanvas.height/2, avatarSize/2, 0, Math.PI*2);
  ctxBanner.closePath();
  ctxBanner.clip();
  ctxBanner.drawImage(avatarImage, padding, padding, avatarSize, avatarSize);
  ctxBanner.restore();

  // Border
  ctxBanner.lineWidth = 4;
  ctxBanner.strokeStyle = '#FDD835';
  ctxBanner.beginPath();
  ctxBanner.arc(padding + avatarSize/2, bannerCanvas.height/2, avatarSize/2, 0, Math.PI*2);
  ctxBanner.stroke();

  // Message
  const text = msgInput.value.trim();
  ctxBanner.fillStyle = '#FFF';
  ctxBanner.font = 'bold 28px Inter';
  ctxBanner.textBaseline = 'middle';
  wrapText(ctxBanner, text, avatarSize + padding * 2, bannerCanvas.height/2, bannerCanvas.width - avatarSize - padding * 3, 34);
}

// Text wrapping helper
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let dy = 0;
  words.forEach((word, i) => {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      ctx.fillText(line, x, y + dy);
      line = word + ' ';
      dy += lineHeight;
    } else {
      line = test;
    }
  });
  ctx.fillText(line, x, y + dy);
}

// Show avatar
genAvatarBtn.addEventListener('click', () => {
  if (!avatarImage) return;
  bannerCanvas.classList.add('hidden');
  resultSection.classList.remove('hidden');
  avatarCanvas.classList.remove('hidden');
  showLoader();
  setTimeout(() => {
    drawAvatar();
    hideLoader();
    downloadBtn.href = avatarCanvas.toDataURL('image/png');
    downloadBtn.download = 'avatar.png';
    downloadBtn.classList.remove('hidden');
  }, 800);
});

// Show banner
genBannerBtn.addEventListener('click', () => {
  if (!avatarImage) return;
  avatarCanvas.classList.add('hidden');
  resultSection.classList.remove('hidden');
  bannerCanvas.classList.remove('hidden');
  showLoader();
  setTimeout(() => {
    drawBanner();
    hideLoader();
    downloadBtn.href = bannerCanvas.toDataURL('image/png');
    downloadBtn.download = 'banner.png';
    downloadBtn.classList.remove('hidden');
  }, 800);
});

// Reset all
resetBtn.addEventListener('click', () => {
  resultSection.classList.add('hidden');
  avatarCanvas.classList.add('hidden');
  bannerCanvas.classList.add('hidden');
  downloadBtn.classList.add('hidden');
  uploader.value = '';
  msgInput.value = '';
});