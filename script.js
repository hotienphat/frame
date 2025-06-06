const uploader = document.getElementById('avatar-uploader');
const canvas = document.getElementById('post-canvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');
const overlay = document.getElementById('overlay');
const messageInput = document.getElementById('message-input');

const BACKGROUND_SRC = './a5c0ad71-a130-4e0c-a963-06b04fc9a5b2.png'; // Đường dẫn ảnh nền bạn upload

let avatarImg = null;
let bgImg = new Image();
bgImg.src = BACKGROUND_SRC;

uploader.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    avatarImg = new Image();
    avatarImg.onload = () => {};
    avatarImg.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

generateBtn.addEventListener('click', () => {
  overlay.classList.remove('hidden');
  setTimeout(() => {
    drawPost();
    overlay.classList.add('hidden');
    downloadBtn.classList.remove('hidden');
  }, 600);
});

function drawPost() {
  // Xóa canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vẽ background làm mờ
  ctx.save();
  ctx.globalAlpha = 0.45; // mức độ mờ
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  // Vẽ avatar hình tròn, căn trái
  if (avatarImg) {
    const size = 180;
    const cx = 100 + size/2;
    const cy = canvas.height / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, size/2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, cx-size/2, cy-size/2, size, size);
    ctx.restore();
  }

  // Vẽ lời muốn nói
  const msg = messageInput.value;
  ctx.save();
  ctx.font = '700 32px Inter';
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#000A';
  ctx.shadowBlur = 6;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const maxWidth = canvas.width - 320;
  const x = 260;
  const y = 80;
  wrapText(ctx, msg, x, y, maxWidth, 44);
  ctx.restore();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

downloadBtn.addEventListener('click', (e) => {
  const url = canvas.toDataURL('image/png');
  downloadBtn.href = url;
  downloadBtn.download = 'bai-dang-tot-nghiep.png';
});

resetBtn.addEventListener('click', () => {
  messageInput.value = '';
  uploader.value = '';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  downloadBtn.classList.add('hidden');
});
