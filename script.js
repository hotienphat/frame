// Các phần tử DOM
const uploader = document.getElementById('avatar-uploader');
const canvas = document.getElementById('avatar-canvas');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');
const uploadSection = document.getElementById('upload-section');
const resultSection = document.getElementById('result-section');
const loadingMessage = document.getElementById('overlay');
const loader = document.getElementById('loader');
const ctx = canvas.getContext('2d');

// Kích thước canvas cho hình tròn
const CANVAS_SIZE = 600;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// Ảnh khung
const frameSrc = './Add-on/framett.png';
const frameImage = new Image();
frameImage.src = frameSrc;

// Khi chọn file
uploader.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Ẩn phần upload, hiển thị result và loader
  uploadSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
  loader.classList.remove('hidden');
  downloadBtn.classList.add('hidden');
  loadingMessage.classList.remove('hidden');

  const reader = new FileReader();
  reader.onload = (e) => {
    const avatarImage = new Image();
    avatarImage.onload = () => {
      // Giả lập thời gian xử lý (1s) để hiển thị loader
      setTimeout(() => {
        drawCircularAvatar(avatarImage, frameImage);
      }, 1000);
    };
    avatarImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

/**
 * Vẽ avatar tròn và khung
 */
function drawCircularAvatar(avatar, frame) {
  if (!frame.complete) {
    frame.onload = () => drawCircularAvatar(avatar, frame);
    return;
  }

  // Xóa canvas
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Thiết lập clip tròn
  const cx = CANVAS_SIZE / 2;
  const cy = CANVAS_SIZE / 2;
  const r = CANVAS_SIZE / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  // Tính tỉ lệ cover
  const ratio = avatar.width / avatar.height;
  let dw, dh, dx, dy;
  if (ratio > 1) {
    dh = CANVAS_SIZE;
    dw = avatar.width * (CANVAS_SIZE / avatar.height);
    dx = (CANVAS_SIZE - dw) / 2;
    dy = 0;
  } else {
    dw = CANVAS_SIZE;
    dh = avatar.height * (CANVAS_SIZE / avatar.width);
    dx = 0;
    dy = (CANVAS_SIZE - dh) / 2;
  }
  ctx.drawImage(avatar, dx, dy, dw, dh);
  ctx.restore();

  // Vẽ khung
  ctx.drawImage(frame, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Tạo link tải
  const finalImageURL = canvas.toDataURL('image/png');
  downloadBtn.href = finalImageURL;
  downloadBtn.download = 'avatar-hoc-duong.png';

  // Ẩn loader và hiển thị nút tải
  loader.classList.add('hidden');
  loadingMessage.classList.add('hidden');
  downloadBtn.classList.remove('hidden');
}

// Tạo lại
resetBtn.addEventListener('click', () => {
  uploadSection.classList.remove('hidden');
  resultSection.classList.add('hidden');
  uploader.value = '';
});