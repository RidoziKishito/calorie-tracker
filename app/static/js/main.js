document.addEventListener('DOMContentLoaded', () => {
    console.log('VietFood AI Frontend Loaded');
});

// Hàm xem trước ảnh khi chọn từ input file
function previewImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            // Tìm thẻ img có id là 'image-preview' để hiển thị
            const previewElement = document.getElementById('image-preview');
            if(previewElement) {
                previewElement.src = e.target.result;
                previewElement.classList.remove('d-none'); // Hiển thị ảnh
            }
            
            // Nếu đang ở trang dashboard, có thể submit form ngay lập tức hoặc chuyển hướng
            // Demo: Log ra console
            console.log("Image selected:", input.files[0].name);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

// Xử lý sự kiện vuốt đơn giản (Ví dụ: để xóa item trong diary)
// Đây là demo placeholder
function handleSwipe() {
    // Implement swipe logic here using touchstart/touchend
}