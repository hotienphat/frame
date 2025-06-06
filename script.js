// Lấy các phần tử DOM cần thiết
const uploader = document.getElementById('avatar-uploader');
const canvas = document.getElementById('avatar-canvas');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');
const uploadSection = document.getElementById('upload-section');
const resultSection = document.getElementById('result-section');
const loadingMessage = document.getElementById('loading-message');
const ctx = canvas.getContext('2d');

// Hằng số cho kích thước canvas để đảm bảo chất lượng ảnh
const CANVAS_SIZE = 600; 
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// Nguồn ảnh khung
const frameSrc = 'https://i.imgur.com/GhpC5D2.png';
const frameImage = new Image();
frameImage.crossOrigin = "anonymous"; // Xử lý vấn đề CORS nếu có
frameImage.src = frameSrc;

// Bắt sự kiện khi người dùng chọn tệp
uploader.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return; // Nếu không có tệp nào được chọn, thoát ra

    // Hiển thị trạng thái đang tải và khu vực kết quả
    uploadSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    loadingMessage.classList.remove('hidden');
    downloadBtn.classList.add('hidden');

    const reader = new FileReader();

    // Khi tệp đã được đọc xong
    reader.onload = (e) => {
        const avatarImage = new Image();
        // Khi ảnh đại diện đã tải xong
        avatarImage.onload = () => {
            // Vẽ ảnh đại diện và khung lên canvas
            drawImages(avatarImage, frameImage);
        };
        avatarImage.src = e.target.result;
    };

    // Đọc tệp ảnh dưới dạng Data URL
    reader.readAsDataURL(file);
});

/**
 * Vẽ ảnh đại diện và khung lên canvas.
 * Ảnh đại diện sẽ được điều chỉnh kích thước để lấp đầy canvas mà vẫn giữ nguyên tỷ lệ.
 * @param {Image} avatar - Ảnh đại diện người dùng tải lên.
 * @param {Image} frame - Ảnh khung để lồng vào.
 */
function drawImages(avatar, frame) {
    // Đảm bảo ảnh khung đã tải xong trước khi vẽ
    if (!frame.complete) {
        frame.onload = () => drawImages(avatar, frame);
        return;
    }

    // Xóa canvas trước khi vẽ mới
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // --- Tính toán tỷ lệ để ảnh đại diện "cover" toàn bộ canvas ---
    const canvasRatio = CANVAS_SIZE / CANVAS_SIZE; // Tỷ lệ là 1, nhưng để cho rõ ràng
    const avatarRatio = avatar.width / avatar.height;
    
    let sx, sy, sWidth, sHeight;

    if (avatarRatio > canvasRatio) {
        // Ảnh đại diện rộng hơn canvas
        sHeight = avatar.height;
        sWidth = sHeight * canvasRatio;
        sx = (avatar.width - sWidth) / 2;
        sy = 0;
    } else {
        // Ảnh đại diện cao hơn hoặc có tỷ lệ bằng canvas
        sWidth = avatar.width;
        sHeight = sWidth / canvasRatio;
        sx = 0;
        sy = (avatar.height - sHeight) / 2;
    }
    
    // Vẽ ảnh đại diện (đã được cắt và căn giữa) lên trước
    ctx.drawImage(avatar, sx, sy, sWidth, sHeight, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Vẽ ảnh khung đè lên trên
    ctx.drawImage(frame, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // --- Hoàn tất ---
    // Tạo URL cho ảnh kết quả và gán vào nút tải về
    const finalImageURL = canvas.toDataURL('image/png');
    downloadBtn.href = finalImageURL;
    downloadBtn.download = 'avatar-ky-niem-doan-tncs-hcm.png';
    
    // Ẩn thông báo tải và hiện nút tải về
    loadingMessage.classList.add('hidden');
    downloadBtn.classList.remove('hidden');
}

// Bắt sự kiện cho nút "Tạo ảnh khác"
resetBtn.addEventListener('click', () => {
    uploadSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
    uploader.value = ''; // Xóa tệp đã chọn trong input
});