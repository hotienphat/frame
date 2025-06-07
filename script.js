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

// Prepare canvases
avatarCanvas.width = CANVAS_SIZE;
avatarCanvas.height = CANVAS_SIZE;

bannerCanvas.width = 1200;
bannerCanvas.height = 400;

let avatarImage = null;

// Load avatar file
uploader.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    avatarImage = new Image();
    avatarImage.src = ev.target.result;
    avatarImage.onload = () => {
      // Show controls ready
    };
  };
  reader.readAsDataURL(file);
});

// Show loader
function showLoader() {
  overlay.classList.remove('hidden');
}

// Hide loader
function hideLoader() {
  overlay.classList.add('hidden');
}

// Draw circular avatar
function drawAvatar() {
  ctxAvatar.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  // Clip circle
  ctxAvatar.save();
  ctxAvatar.beginPath();
  ctxAvatar.arc(CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2, 0, Math.PI*2);
  ctxAvatar.closePath();
  ctxAvatar.clip();
  // Cover
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
  
  avatarCanvas.toDataURL('image/png');
}

// Draw horizontal banner with message
function drawBanner() {
  ctxBanner.clearRect(0, 0, bannerCanvas.width, bannerCanvas.height);
  const padding = 20;
  const avatarSize = bannerCanvas.height - 2*padding;
  // Draw avatar circle
  ctxBanner.save();
  ctxBanner.beginPath();
  ctxBanner.arc(padding + avatarSize/2, bannerCanvas.height/2, avatarSize/2, 0, Math.PI*2);
  ctxBanner.closePath();
  ctxBanner.clip();
  ctxBanner.drawImage(avatarImage, padding, padding, avatarSize, avatarSize);
  ctxBanner.restore();
  // Draw border
  ctxBanner.lineWidth = 4;
  ctxBanner.strokeStyle = '#FDD835';
  ctxBanner.beginPath();
  ctxBanner.arc(padding + avatarSize/2, bannerCanvas.height/2, avatarSize/2, 0, Math.PI*2);
  ctxBanner.stroke();
  
  // Draw message text
  const text = msgInput.value.trim() || '';
  const maxWidth = bannerCanvas.width - avatarSize - 3*padding;
  ctxBanner.fillStyle = '#FFF';
  ctxBanner.font = 'bold 28px Inter';
  ctxBanner.textBaseline = 'middle';
  wrapText(ctxBanner, text, avatarSize + 2*padding, bannerCanvas.height/2, maxWidth, 34);
}

// Helper: wrap text
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let dy = 0;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y + dy);
      line = words[n] + ' ';
      dy += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y + dy);
}

// Generate avatar
genAvatarBtn.addEventListener('click', () => {
  if (!avatarImage) return;
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

// Generate banner
genBannerBtn.addEventListener('click', () => {
  if (!avatarImage) return;
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

// Reset
resetBtn.addEventListener('click', () => {
  resultSection.classList.add('hidden');
  avatarCanvas.classList.add('hidden');
  bannerCanvas.classList.add('hidden');
  downloadBtn.classList.add('hidden');
  uploader.value = '';
  msgInput.value = '';
});