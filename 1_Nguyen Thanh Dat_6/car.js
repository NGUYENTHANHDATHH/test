const danhSachXe = [
    {
      "ma_xe": "CAR001",
      "ten_xe": "Toyota Vios",
      "hang_xe": "Toyota",
      "loai_xe": "Sedan",
      "nam_san_xuat": 2021,
      "gia_thue_ngay": 700000,
      "tinh_trang": "Còn sẵn",
      "so_cho_ngoi": 5
    },
    {
      "ma_xe": "CAR002",
      "ten_xe": "Kia Morning",
      "hang_xe": "Kia",
      "loai_xe": "Hatchback",
      "nam_san_xuat": 2020,
      "gia_thue_ngay": 500000,
      "tinh_trang": "Đang cho thuê",
      "so_cho_ngoi": 4
    },
    {
      "ma_xe": "CAR003",
      "ten_xe": "Ford Everest",
      "hang_xe": "Ford",
      "loai_xe": "SUV",
      "nam_san_xuat": 2022,
      "gia_thue_ngay": 1200000,
      "tinh_trang": "Còn sẵn",
      "so_cho_ngoi": 7
    },
    {
      "ma_xe": "CAR004",
      "ten_xe": "Hyundai Accent",
      "hang_xe": "Hyundai",
      "loai_xe": "Sedan",
      "nam_san_xuat": 2021,
      "gia_thue_ngay": 650000,
      "tinh_trang": "Còn sẵn",
      "so_cho_ngoi": 5
    },
    {
      "ma_xe": "CAR005",
      "ten_xe": "Mercedes-Benz C200",
      "hang_xe": "Mercedes-Benz",
      "loai_xe": "Sedan",
      "nam_san_xuat": 2023,
      "gia_thue_ngay": 2500000,
      "tinh_trang": "Bảo trì",
      "so_cho_ngoi": 5
    }
];

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const items = document.getElementsByClassName('item');
    
    for (let i = 0; i < danhSachXe.length; i++) {
        const xe = danhSachXe[i];
        if (items[i]) {
            items[i].innerHTML = `
                <strong>${xe.ten_xe}</strong><br>
                Hãng: ${xe.hang_xe}<br>
                Loại: ${xe.loai_xe}<br>
                Năm sản xuất: ${xe.nam_san_xuat}<br>
                Giá thuê: ${xe.gia_thue_ngay.toLocaleString('vi-VN')} VNĐ/ngày<br>
                Tình trạng: ${xe.tinh_trang}<br>
                Số chỗ ngồi: ${xe.so_cho_ngoi}
            `;
        }
    }
});