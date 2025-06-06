    // Các phần tử DOM
    const uploader = document.getElementById('avatar-uploader');
    const canvas = document.getElementById('avatar-canvas');
    const statusText = document.getElementById('status-text');
    const loader = document.getElementById('loader');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const uploadSection = document.getElementById('upload-section');
    const resultSection = document.getElementById('result-section');
    const generatePostBtn = document.getElementById('generate-post-btn');
    const postTextArea = document.getElementById('post-text');
    const ctx = canvas.getContext('2d');

    // Kích thước canvas landscape
    const CANVAS_WIDTH = 1200;
    const CANVAS_HEIGHT = 600;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Ảnh khung và logo trung tâm làm background
    const frameSrc = './Add-on/framett.png';
    const frameImage = new Image();
    frameImage.src = frameSrc;

    let avatarImage = null;

    // Khi chọn file ảnh avatar
    uploader.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      uploadSection.classList.add('hidden');
      resultSection.classList.remove('hidden');
      statusText.textContent = 'Đang xử lý ảnh...';
      loader.classList.remove('hidden');
      downloadBtn.classList.add('hidden');

      const reader = new FileReader();
      reader.onload = (e) => {
        avatarImage = new Image();
        avatarImage.onload = () => {
          setTimeout(() => {
            drawAvatarOnCanvas();
          }, 1000); // Giả lập thời gian xử lý
        };
        avatarImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    function drawAvatarOnCanvas() {
      if (!frameImage.complete) {
        frameImage.onload = drawAvatarOnCanvas;
        return;
      }
      // Xóa canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Vẽ background: phiên bản làm mờ của khung (cover khung toàn bộ bên trái)
      ctx.save();
      ctx.filter = 'blur(8px)';
      ctx.drawImage(frameImage, 0, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.restore();

      // Thiết lập clip tròn và vẽ ảnh avatar ở vị trí bên trái (center trong ô vuông)
      const avatarSize = CANVAS_HEIGHT * 0.6; // chiếm 60% chiều cao
      const cx = avatarSize / 2 + 20; // cách lề trái 20px
      const cy = CANVAS_HEIGHT / 2;
      const r = avatarSize / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      // Tính tỉ lệ cover cho avatar
      const ratio = avatarImage.width / avatarImage.height;
      let dw, dh, dx, dy;
      if (ratio > 1) {
        dh = avatarSize;
        dw = avatarImage.width * (avatarSize / avatarImage.height);
        dx = cx - dw / 2;
        dy = cy - dh / 2;
      } else {
        dw = avatarSize;
        dh = avatarImage.height * (avatarSize / avatarImage.width);
        dx = cx - dw / 2;
        dy = cy - dh / 2;
      }
      ctx.drawImage(avatarImage, dx, dy, dw, dh);
      ctx.restore();

      // Vẽ khung chính đè lên avatar
      const frameSize = avatarSize + 40; // khung rộng hơn avatar chút
      const frameX = cx - frameSize / 2;
      const frameY = cy - frameSize / 2;
      ctx.drawImage(frameImage, frameX, frameY, frameSize, frameSize);

      // Ẩn loader, hiển thị nút tải
      loader.classList.add('hidden');
      statusText.textContent = 'Ảnh avatar đã sẵn sàng';
      downloadBtn.classList.remove('hidden');
      downloadBtn.href = canvas.toDataURL('image/png');
      downloadBtn.download = 'avatar.png';
    }

    // Khi nhấn nút tạo lại
    resetBtn.addEventListener('click', () => {
      uploadSection.classList.remove('hidden');
      resultSection.classList.add('hidden');
      uploader.value = '';
      avatarImage = null;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    });

    // Hàm vẽ bài đăng: kết hợp avatar và văn bản lên canvas
    function drawPostImage() {
      if (!avatarImage) {
        alert('Vui lòng chọn ảnh avatar trước!');
        return;
      }
      const text = postTextArea.value.trim();
      // Xóa canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Vẽ background làm mờ khung bên trái như cũ
      ctx.save();
      ctx.filter = 'blur(8px)';
      ctx.drawImage(frameImage, 0, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.restore();

      // Vẽ avatar và khung như cũ
      const avatarSize = CANVAS_HEIGHT * 0.6;
      const cx = avatarSize / 2 + 20;
      const cy = CANVAS_HEIGHT / 2;
      const r = avatarSize / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      const ratio = avatarImage.width / avatarImage.height;
      let dw, dh, dx, dy;
      if (ratio > 1) {
        dh = avatarSize;
        dw = avatarImage.width * (avatarSize / avatarImage.height);
        dx = cx - dw / 2;
        dy = cy - dh / 2;
      } else {
        dw = avatarSize;
        dh = avatarImage.height * (avatarSize / avatarImage.width);
        dx = cx - dw / 2;
        dy = cy - dh / 2;
      }
      ctx.drawImage(avatarImage, dx, dy, dw, dh);
      ctx.restore();

      const frameSize = avatarSize + 40;
      const frameX = cx - frameSize / 2;
      const frameY = cy - frameSize / 2;
      ctx.drawImage(frameImage, frameX, frameY, frameSize, frameSize);

      // Vẽ nền trắng cho phần văn bản bên phải
      const textXStart = CANVAS_WIDTH / 2 + 20;
      const textWidth = CANVAS_WIDTH / 2 - 40;
      const textYStart = 40;
      ctx.fillStyle = '#fff';
      ctx.fillRect(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT);

      // Vẽ khung cho phần văn bản (tuỳ chọn - đường viền nhẹ)
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 2;
      ctx.strokeRect(CANVAS_WIDTH / 2 + 10, 10, CANVAS_WIDTH / 2 - 20, CANVAS_HEIGHT - 20);

      // Vẽ văn bản
      if (text) {
        ctx.fillStyle = '#000';
        ctx.font = '24px Inter';
        ctx.textBaseline = 'top';
        const words = text.split(' ');
        let line = '';
        let y = textYStart;
        const lineHeight = 32;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > textWidth && n > 0) {
            ctx.fillText(line, textXStart, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, textXStart, y);
      }

      // Cập nhật nút tải xuống để dùng cho ảnh bài đăng
      downloadBtn.href = canvas.toDataURL('image/png');
      downloadBtn.download = 'avatar_post.png';
      downloadBtn.classList.remove('hidden');
      statusText.textContent = 'Bài đăng đã sẵn sàng!';
    }

    // Khi nhấn nút tạo bài đăng
    generatePostBtn.addEventListener('click', () => {
      drawPostImage();
    });