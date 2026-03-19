# Hướng Dẫn Kiểm Thử Inventory Management API

## 1. Chuẩn Bị

### Yêu cầu
- Node.js
- MongoDB đang chạy
- Postman (hoặc Thunder Client)
- Git

### Khởi động ứng dụng
```bash
cd d:\son\NNPTUDM_1903
npm install
npm start
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 2. Import Postman Collection

1. Mở Postman
2. Click **Import** (hoặc Ctrl + Shift + I)
3. Chọn file `INVENTORY_POSTMAN_COLLECTION.json` từ thư mục dự án
4. Click **Import**

## 3. Quy Trình Kiểm Thử Từng Bước

### Bước 1: Tạo Danh Mục (Category)
**Request**: POST `/api/v1/categories`
```json
{
  "name": "Electronics"
}
```
**Lưu lại ID của category** để dùng ở bước tiếp theo

---

### Bước 2: Tạo Sản Phẩm
**Request**: POST `/api/v1/products`
```json
{
  "title": "Laptop Dell XPS 13",
  "price": 1299.99,
  "description": "High performance laptop",
  "category": "<CATEGORY_ID>",
  "images": ["https://placeimg.com/640/480/any"]
}
```

**Kết quả mong đợi:**
- Sản phẩm được tạo
- Inventory được tạo tự động với: `stock=0, reserved=0, soldCount=0`
- Response sẽ chứa product ID và inventory thông tin

**Lưu lại Product ID** để dùng trong các bước tiếp theo

---

### Bước 3: Xem Tất Cả Inventory
**Request**: GET `/api/v1/inventories`

**Kết quả mong đợi:**
- Danh sách tất cả inventories
- Mỗi inventory hiển thị thông tin product (title, price, description)
- Giá trị: stock=0, reserved=0, soldCount=0

---

### Bước 4: Xem Inventory Theo ID
**Request**: GET `/api/v1/inventories/{INVENTORY_ID}`

**Kết quả mong đợi:**
- Inventory chi tiết với thông tin product đầy đủ

---

### Bước 5: Xem Inventory Theo Product ID
**Request**: GET `/api/v1/inventories/product/{PRODUCT_ID}`

**Kết quả mong đợi:**
- Inventory của sản phẩm cụ thể

---

### Bước 6: Thêm Hàng Hóa (Add Stock)
**Request**: POST `/api/v1/inventories/add-stock`
```json
{
  "product": "<PRODUCT_ID>",
  "quantity": 100
}
```

**Kết quả mong đợi:**
- `stock` tăng từ 0 lên 100
- `reserved` vẫn là 0
- `soldCount` vẫn là 0

**Test lỗi**: Thử nhập quantity âm hoặc 0
```json
{
  "product": "<PRODUCT_ID>",
  "quantity": -5
}
```
→ Phải nhận được lỗi: "Quantity must be greater than 0"

---

### Bước 7: Đặt Hàng (Reservation)
**Request**: POST `/api/v1/inventories/reservation`
```json
{
  "product": "<PRODUCT_ID>",
  "quantity": 30
}
```

**Kết quả mong đợi:**
- `stock` giảm từ 100 xuống 70
- `reserved` tăng từ 0 lên 30
- `soldCount` vẫn là 0

**Giải thích**: Khách hàng đặt 30 cái, nên stock giảm (không còn hàng sẵn) và reserved tăng (đang chờ giao hàng)

**Test lỗi**: Thử đặt nhiều hơn hàng có sẵn
```json
{
  "product": "<PRODUCT_ID>",
  "quantity": 100
}
```
→ Phải nhận được lỗi: "Insufficient stock for reservation. Current stock: 70"

---

### Bước 8: Xác Nhận Bán Hàng (Sold)
**Request**: POST `/api/v1/inventories/sold`
```json
{
  "product": "<PRODUCT_ID>",
  "quantity": 20
}
```

**Kết quả mong đợi:**
- `stock` vẫn là 70 (không đổi, vì đã trừ ở bước reservation)
- `reserved` giảm từ 30 xuống 10
- `soldCount` tăng từ 0 lên 20

**Giải thích**: Đã giao 20 cái cho khách, nên reserved giảm (không còn chờ đó) và soldCount tăng (đã bán)

**Test lỗi**: Thử bán nhiều hơn số đặt
```json
{
  "product": "<PRODUCT_ID>",
  "quantity": 50
}
```
→ Phải nhận được lỗi: "Insufficient reserved quantity. Current reserved: 10"

---

### Bước 9: Giảm Hàng (Remove Stock)
**Request**: POST `/api/v1/inventories/remove-stock`
```json
{
  "product": "<PRODUCT_ID>",
  "quantity": 40
}
```

**Kết quả mong đợi:**
- `stock` giảm từ 70 xuống 30
- `reserved` vẫn là 10 (không đổi)
- `soldCount` vẫn là 20 (không đổi)

**Giải thích**: Hàng hỏng hoặc mất, giảm stock trực tiếp

---

### Bước 10: Kiểm Tra Trạng Thái Cuối Cùng
**Request**: GET `/api/v1/inventories/product/{PRODUCT_ID}`

**Kết quả mong đợi - Trạng thái cuối cùng:**
- `stock`: 30 (còn hàng sẵn)
- `reserved`: 10 (đang chờ giao)
- `soldCount`: 20 (đã bán)
- **Tổng cộng**: 30 + 10 + 20 = 60 hàng

## 4. Tóm Tắt Quy Trình Hàng Hóa

```
Bước 1: Tạo sản phẩm
        → Auto tạo inventory: stock=0, reserved=0, soldCount=0

Bước 2: Nhập hàng (Add Stock) 100 cái
        → stock=100, reserved=0, soldCount=0

Bước 3: Đặt hồi quy (Reservation) 30 cái
        → stock=70, reserved=30, soldCount=0

Bước 4: Giao hàng (Sold) 20 cái
        → stock=70, reserved=10, soldCount=20

Bước 5: Hủy/Hỏng (Remove Stock) 40 cái
        → stock=30, reserved=10, soldCount=20
```

## 5. Tạo Git Repository

```bash
cd d:\son\NNPTUDM_1903
git init
git add .
git commit -m "Add inventory management system"
git remote add origin <your_github_repo_url>
git push -u origin main
```

## 6. Files Đã Thêm

```
schemas/inventories.js          - Mongoose schema cho Inventory
controllers/inventories.js      - Business logic
routes/inventories.js           - API endpoints
INVENTORY_API.md               - API documentation
INVENTORY_POSTMAN_COLLECTION.json - Postman collection
TESTING_GUIDE.md               - Hướng dẫn kiểm thử (file này)
```

## 7. Cấu Trúc Response

### Success Response
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "product": {...},
    "stock": 30,
    "reserved": 10,
    "soldCount": 20,
    "createdAt": "2024-03-19T...",
    "updatedAt": "2024-03-19T..."
  },
  "message": "Action successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 8. Lỗi Thường Gặp

| Lỗi | Nguyên Nhân | Giải Pháp |
|-----|-----------|----------|
| Cannot POST /api/v1/inventories | Routes chưa được thêm vào app.js | Kiểm tra app.js có dòng `app.use('/api/v1/inventories', ...)` |
| Cannot find module 'inventories' | File không tồn tại hoặc tên sai | Kiểm tra file `routes/inventories.js` |
| Inventory NOT FOUND | Product ID sai hoặc inventory chưa tạo | Kiểm tra Product ID, hoặc tạo product mới |
| Insufficient stock | Quantity > stock hiện tại | Dùng quantity nhỏ hơn hoặc add stock trước |
| MongoDB connection error | MongoDB chưa chạy | Khởi động MongoDB |

---

**Chúc bạn kiểm thử vui vẻ! 🎉**
