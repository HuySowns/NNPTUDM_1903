# NNPTUD-C5 - Inventory Management System

## 📋 Mô Tả Dự Án

Đây là một hệ thống quản lý kho hàng (Inventory Management System) được xây dựng trên Node.js + Express + MongoDB. Hệ thống cung cấp các API để quản lý tồn kho, hàng đặt hàng, hàng đã bán.

## ✨ Tính Năng

### Quản Lý Kho Hàng
- ✅ Tạo inventory tự động khi tạo sản phẩm
- ✅ Xem tất cả inventories
- ✅ Xem inventory theo ID (với join product)
- ✅ Xem inventory theo Product ID
- ✅ Thêm hàng hóa vào kho
- ✅ Giảm hàng hóa từ kho
- ✅ Đặt hàng/Reservation
- ✅ Xác nhận bán hàng (Sold)

## 📁 Cấu Trúc Thư Mục

```
d:\son\NNPTUDM_1903\
├── schemas/
│   ├── users.js
│   ├── products.js
│   ├── categories.js
│   ├── roles.js
│   └── inventories.js        ⭐ NEW
├── controllers/
│   ├── users.js
│   └── inventories.js         ⭐ NEW
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── categories.js
│   ├── roles.js
│   ├── index.js
│   └── inventories.js         ⭐ NEW
├── utils/
├── keys/
├── bin/
├── app.js
├── package.json
├── INVENTORY_API.md           ⭐ NEW - API Documentation
├── INVENTORY_POSTMAN_COLLECTION.json ⭐ NEW - Postman Collection
├── TESTING_GUIDE.md           ⭐ NEW - Hướng Dẫn Kiểm Thử
└── README.md (file này)
```

## 🗄️ Mô Hình Dữ Liệu

### Inventory Schema
```javascript
{
  product: ObjectId (ref: product, required, unique),
  stock: number (min: 0),           // Hàng sẵn có
  reserved: number (min: 0),        // Hàng đã đặt, chưa giao
  soldCount: number (min: 0),       // Hàng đã bán
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Khởi Động

### 1. Cài Đặt Dependencies
```bash
npm install
```

### 2. Cấu Hình MongoDB
Tạo file `.env` ở thư mục gốc:
```env
MONGODB_URI=mongodb://localhost:27017/NNPTUD-C5
PORT=3000
```

### 3. Khởi Động Server
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📚 API Documentation

Xem file **[INVENTORY_API.md](INVENTORY_API.md)** để biết chi tiết tất cả các endpoint.

### Danh Sách Endpoints

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| GET | `/api/v1/inventories` | Lấy tất cả inventories |
| GET | `/api/v1/inventories/:id` | Lấy inventory theo ID |
| GET | `/api/v1/inventories/product/:productId` | Lấy inventory theo Product ID |
| POST | `/api/v1/inventories/add-stock` | Thêm hàng |
| POST | `/api/v1/inventories/remove-stock` | Giảm hàng |
| POST | `/api/v1/inventories/reservation` | Đặt hàng |
| POST | `/api/v1/inventories/sold` | Xác nhận bán |

## 🧪 Kiểm Thử

### Với Postman
1. Import file **INVENTORY_POSTMAN_COLLECTION.json** vào Postman
2. Xem file **[TESTING_GUIDE.md](TESTING_GUIDE.md)** để hướng dẫn chi tiết

### Quy Trình Kiểm Thử Cơ Bản
```
1. Tạo Category
2. Tạo Product → Inventory tự động tạo
3. Add Stock 100 cái → stock=100
4. Reservation 30 cái → stock=70, reserved=30
5. Sold 20 cái → stock=70, reserved=10, soldCount=20
6. Remove Stock 40 cái → stock=30, reserved=10, soldCount=20
```

## 📝 Git Repository

Khởi tạo repository:
```bash
git init
git add .
git commit -m "Initial commit: Add inventory management system"
git remote add origin <your_github_url>
git push -u origin main
```

## 🔍 Validation & Error Handling

### Validation Rules
- `quantity` phải > 0
- Không thể remove stock nhiều hơn stock hiện tại
- Không thể reservation nhiều hơn stock hiện tại
- Không thể sold nhiều hơn reserved hiện tại

### Error Messages
- "Missing product or quantity" - Thiếu dữ liệu yêu cầu
- "Quantity must be greater than 0" - Quantity không hợp lệ
- "Insufficient stock" - Không đủ hàng
- "Inventory NOT FOUND" - Không tìm thấy inventory
- "Product ID NOT FOUND" - ID sản phẩm không tồn tại

## 📋 Product Creation Flow

Khi tạo sản phẩm mới:
```javascript
POST /api/v1/products
{
  "title": "Laptop",
  "price": 1000,
  "description": "...",
  "category": "category_id",
  "images": [...]
}

→ Response sẽ chứa:
{
  "product": { ...product details },
  "inventory": { ...inventory with stock=0 }
}
```

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **nodemon** - Development server
- **dotenv** - Environment variables

## 📞 Support

Nếu gặp lỗi, hãy kiểm tra:
1. MongoDB đang chạy?
2. Port 3000 có bị chiếm không?
3. Tất cả dependencies đã cài đặt?
4. Environment variables đã cấu hình?

## 📄 License

Dự án này được tạo cho mục đích học tập.

---

**Tác Giả**: NNPTUDM  
**Ngày Tạo**: March 19, 2024  
**Phiên Bản**: 1.0.0
