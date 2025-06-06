// Lấy các phần tử DOM cần thiết
const uploader = document.getElementById('avatar-uploader');
const canvas = document.getElementById('avatar-canvas');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');
const uploadSection = document.getElementById('upload-section');
const resultSection = document.getElementById('result-section');
const loadingMessage = document.getElementById('loading-message');
const ctx = canvas.getContext('2d');

// Kích thước canvas (thay đổi để phù hợp với khung tròn)
const CANVAS_SIZE = 600;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// Nguồn ảnh khung (đảm bảo có hình trong thư mục Add-on)
const frameSrc = './Add-on/framett.png';
const frameImage = new Image();
frameImage.src = frameSrc;

// Bắt sự kiện khi người dùng chọn tệp
uploader.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Chuẩn bị hiển thị
    uploadSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    loadingMessage.classList.remove('hidden');
    downloadBtn.classList.add('hidden');

    const reader = new FileReader();
    reader.onload = (e) => {
        const avatarImage = new Image();
        avatarImage.onload = () => {
            // Khi cả avatar và frame đã sẵn sàng, vẽ vào canvas
            drawCircularAvatar(avatarImage, frameImage);
        };
        avatarImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

/**
 * Vẽ ảnh đại diện theo hình tròn và khung lên canvas.
 * @param {Image} avatar - Ảnh đại diện người dùng
 * @param {Image} frame - Ảnh khung
 */
function drawCircularAvatar(avatar, frame) {
    if (!frame.complete) {
        frame.onload = () => drawCircularAvatar(avatar, frame);
        return;
    }

    // Xóa canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Tạo clip hình tròn ở giữa canvas
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const radius = CANVAS_SIZE / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // Tính tỉ lệ để avatar cover toàn bộ vùng tròn
    const avatarRatio = avatar.width / avatar.height;
    let drawWidth, drawHeight, dx, dy;

    if (avatarRatio > 1) {
        // Ảnh rộng hơn khung
        drawHeight = CANVAS_SIZE;
        drawWidth = avatar.width * (CANVAS_SIZE / avatar.height);
        dx = (CANVAS_SIZE - drawWidth) / 2;
        dy = 0;
    } else {
        // Ảnh cao hơn hoặc vuông
        drawWidth = CANVAS_SIZE;
        drawHeight = avatar.height * (CANVAS_SIZE / avatar.width);
        dx = 0;
        dy = (CANVAS_SIZE - drawHeight) / 2;
    }

    ctx.drawImage(avatar, dx, dy, drawWidth, drawHeight);
    ctx.restore();

    // Vẽ khung lên phía trên
    ctx.drawImage(frame, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Tạo URL cho ảnh kết quả và gán cho nút tải
    const finalImageURL = canvas.toDataURL('image/png');
    downloadBtn.href = finalImageURL;
    downloadBtn.download = 'avatar-ky-niem.png';

    // Hiển thị nút tải và ẩn loading
    loadingMessage.classList.add('hidden');
    downloadBtn.classList.remove('hidden');
}

// Sự kiện cho nút Tạo ảnh khác
resetBtn.addEventListener('click', () => {
    uploadSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
    uploader.value = '';
});