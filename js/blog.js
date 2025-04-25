// Hàm lọc bài viết theo chuyên mục (ReactJS, JavaScript, Front-end)
function locTheoChuyenMuc(tag) {
    const baiVietLoc = document.querySelectorAll('.tungbaiviet');
    baiVietLoc.forEach(baiViet => {
        const category = baiViet.getAttribute('data-category');
        if (category === tag || tag === 'Tất cả') {
            baiViet.style.display = 'block'; // Hiển thị bài viết
        } else {
            baiViet.style.display = 'none'; // Ẩn bài viết không thuộc tag
        }
    });
}

// Hàm hiển thị tất cả bài viết
function hienThiTatCaBaiViet() {
    const baiVietLoc = document.querySelectorAll('.tungbaiviet');
    baiVietLoc.forEach(baiViet => {
        baiViet.style.display = 'block'; // Hiển thị tất cả bài viết
    });
}
        function boxclick(event) {
             const btn = event.currentTarget;
             const shareBox = btn.nextElementSibling; // Lấy box liền sau nút
             const allBoxes = document.querySelectorAll('.Sharebox');

             allBoxes.forEach(box => {
                 if (box !== shareBox) {
                     box.style.display = "none"; // Ẩn các box khác
                 }
             });

// Toggle box gần nút
shareBox.style.display = shareBox.style.display === "block" ? "none" : "block";
}                 

  // Tự động ẩn khi click ra ngoài
 window.addEventListener("click", function(suKien) {
   const hop = document.getElementById("box");
    const nut = document.querySelector(".Sharebutton");
    if (!hop.contains(suKien.target) && !nut.contains(suKien.target)) {
      hop.style.display = "none";
    }
 });

    
      function toggleLike(event) {
      const likeButton = event.target.closest('.like-button'); // Lấy phần tử like-button gần nhất

      // Kiểm tra trạng thái của nút "Like"
      if (likeButton.classList.contains("default")) {
          likeButton.classList.remove("default");
          likeButton.classList.add("liked");
      } else {
          likeButton.classList.remove("liked");
          likeButton.classList.add("default");
      }
  }

                   let trangHienTai = 1;  // Trang hiện tại
         const soBaiVietMoiTrang = 4;  // Số bài viết hiển thị trên mỗi trang
         const danhSachBaiViet = document.querySelectorAll('.tungbaiviet');  // Lấy tất cả các bài viết

         // Hàm hiển thị các bài viết trên trang hiện tại
         function hienThiBaiViet() {
             const viTriBatDau = (trangHienTai - 1) * soBaiVietMoiTrang;
             const viTriKetThuc = trangHienTai * soBaiVietMoiTrang;

             // Ẩn tất cả bài viết
             danhSachBaiViet.forEach((baiViet, index) => {
                 if (index >= viTriBatDau && index < viTriKetThuc) {
                                      baiViet.style.display = 'block';  // Hiển thị bài viết trong khoảng
                 } else {
                     baiViet.style.display = 'none';  // Ẩn các bài viết không thuộc trang hiện tại
                 }
             });

             // Cập nhật số trang hiện tại
             document.querySelector('.so-trang').textContent = `Trang ${trangHienTai}`;
         }

         // Hàm thay đổi trang
         function thayDoiTrang(huong) {
             const tongSoTrang = Math.ceil(danhSachBaiViet.length / soBaiVietMoiTrang);

             // Thay đổi trang hiện tại theo hướng
             if (trangHienTai + huong > 0 && trangHienTai + huong <= tongSoTrang) {
                 trangHienTai += huong;
                 hienThiBaiViet();
             }
         }

         // Hiển thị bài viết khi trang được tải
         hienThiBaiViet();