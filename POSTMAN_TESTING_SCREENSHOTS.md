# Hình Ảnh Kiểm Thử API - Screenshot Guide

## Giới Thiệu
Tài liệu này hướng dẫn các bước kiểm thử Inventory Management API bằng Postman hoặc Thunder Client.

## Instructions để chụp Screenshots Postman

### 1. Mở Postman
- Khởi động ứng dụng: `npm start`
- Mở Postman
- Import file `INVENTORY_POSTMAN_COLLECTION.json`

### 2. Kiểm Thử Từng API

#### **Test 1: Get All Inventories** (GET)
```
URL: http://localhost:3000/api/v1/inventories
Method: GET
Headers: Không cần
Body: Không cần

Expected Response:
{
  "success": true,
  "data": [...list inventories...],
  "message": "Get all inventories successfully"
}
```
**Screenshot tips**: 
- Hiển thị Request tab với URL đẹp
- Hiển thị Response với data trả về

---

#### **Test 2: Tạo Product (tự động tạo Inventory)**
```
URL: http://localhost:3000/api/v1/products
Method: POST
Headers: Content-Type: application/json
Body:
{
  "title": "iPhone 15 Pro",
  "price": 999.99,
  "description": "Latest Apple smartphone",
  "category": "<CATEGORY_ID>",
  "images": ["https://placeimg.com/640/480/any"]
}

Expected Response:
{
  "success": true,
  "data": {...product...},
  "inventory": {
    "product": "<PRODUCT_ID>",
    "stock": 0,
    "reserved": 0,
    "soldCount": 0
  }
}
```
**Screenshot tips**:
- Hiển thị body JSON
- Hiển thị response với inventory info

---

#### **Test 3: Get Inventory by Product ID**
```
URL: http://localhost:3000/api/v1/inventories/product/<PRODUCT_ID>
Method: GET

Expected Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "product": {
      "_id": "<PRODUCT_ID>",
      "title": "iPhone 15 Pro",
      "price": 999.99,
      ...
    },
    "stock": 0,
    "reserved": 0,
    "soldCount": 0
  }
}
```
**Screenshot tips**:
- Hiển thị URL params rõ ràng
- Hiển thị product join information

---

#### **Test 4: Add Stock (+100)**
```
URL: http://localhost:3000/api/v1/inventories/add-stock
Method: POST
Headers: Content-Type: application/json
Body:
{
  "product": "<PRODUCT_ID>",
  "quantity": 100
}

Expected Response:
{
  "success": true,
  "data": {
    "stock": 100,
    "reserved": 0,
    "soldCount": 0
  }
}
```
**Screenshot tips**:
- Hiển thị request body
- Hiển thị response với stock = 100

---

#### **Test 5: Make Reservation (-30 stock, +30 reserved)**
```
URL: http://localhost:3000/api/v1/inventories/reservation
Method: POST
Headers: Content-Type: application/json
Body:
{
  "product": "<PRODUCT_ID>",
  "quantity": 30
}

Expected Response:
{
  "success": true,
  "data": {
    "stock": 70,      // 100 - 30
    "reserved": 30,   // 0 + 30
    "soldCount": 0
  }
}
```
**Screenshot tips**:
- Hiển thị request body
- Hiển thị response với stock=70, reserved=30

---

#### **Test 6: Confirm Sale (-20 reserved, +20 soldCount)**
```
URL: http://localhost:3000/api/v1/inventories/sold
Method: POST
Headers: Content-Type: application/json
Body:
{
  "product": "<PRODUCT_ID>",
  "quantity": 20
}

Expected Response:
{
  "success": true,
  "data": {
    "stock": 70,      // Không đổi
    "reserved": 10,   // 30 - 20
    "soldCount": 20   // 0 + 20
  }
}
```
**Screenshot tips**:
- Hiển thị request body
- Hiển thị response với reserved=10, soldCount=20

---

#### **Test 7: Remove Stock (-40)**
```
URL: http://localhost:3000/api/v1/inventories/remove-stock
Method: POST
Headers: Content-Type: application/json
Body:
{
  "product": "<PRODUCT_ID>",
  "quantity": 40
}

Expected Response:
{
  "success": true,
  "data": {
    "stock": 30,      // 70 - 40
    "reserved": 10,   // Không đổi
    "soldCount": 20   // Không đổi
  }
}
```
**Screenshot tips**:
- Hiển thị request body
- Hiển thị response với stock=30

---

#### **Test 8: Error Test - Insufficient Stock**
```
URL: http://localhost:3000/api/v1/inventories/remove-stock
Method: POST
Body:
{
  "product": "<PRODUCT_ID>",
  "quantity": 100  // > current stock (30)
}

Expected Response:
{
  "success": false,
  "message": "Insufficient stock. Current stock: 30"
}
```
**Screenshot tips**:
- Hiển thị lỗi validation
- Hiển thị message rõ ràng

---

#### **Test 9: Error Test - Invalid Quantity**
```
URL: http://localhost:3000/api/v1/inventories/add-stock
Method: POST
Body:
{
  "product": "<PRODUCT_ID>",
  "quantity": -10  // Invalid
}

Expected Response:
{
  "success": false,
  "message": "Quantity must be greater than 0"
}
```
**Screenshot tips**:
- Hiển thị validation error
- Highlight error message

---

## Tóm Tắt State Changes

### Trước & Sau

```
┌─────────────────────────────────────────────┐
│          Inventory State Changes             │
├──────────────┬──────────┬──────────┬─────────┤
│ Operation    │ Stock    │ Reserved │ Sold    │
├──────────────┼──────────┼──────────┼─────────┤
│ Initial      │ 0        │ 0        │ 0       │
│ Add 100      │ 100      │ 0        │ 0       │
│ Reserve 30   │ 70       │ 30       │ 0       │
│ Sold 20      │ 70       │ 10       │ 20      │
│ Remove 40    │ 30       │ 10       │ 20      │
└──────────────┴──────────┴──────────┴─────────┘
```

## Format Để Đưa Vào Word Document

### Từng Screenshot nên include:
1. **Request Header**
   - Method (GET/POST)
   - URL/Path
   - Headers (nếu có)

2. **Request Body** (nếu POST)
   - JSON formatted đẹp

3. **Response**
   - Status Code (200, 400, 404, etc.)
   - Response body JSON

4. **Text Description**
   - Mô tả những gì test
   - Kết quả mong đợi
   - Kết quả thực tế

## Tools Đề Xuất

1. **Postman** (Recommended)
   - Built-in screenshot
   - Có thể export response
   - Format JSON tự động

2. **Thunder Client**
   - Lightweight
   - Tích hợp VS Code
   - Dễ chụp screenshot

3. **cURL with Output**
   ```bash
   curl -X POST http://localhost:3000/api/v1/inventories/add-stock \
     -H "Content-Type: application/json" \
     -d '{"product":"<ID>","quantity":100}'
   ```

## Hướng Dẫn Tạo Word Document

### Template Word
```
┌─────────────────────────────────┐
│  INVENTORY MANAGEMENT API TEST  │
│      Screenshot Report          │
├─────────────────────────────────┤
│ Date: March 19, 2024            │
│ Project: NNPTUDM_1903           │
│ Tested By: [Tên của bạn]        │
└─────────────────────────────────┘

## 1. Get All Inventories
[SCREENSHOT OF REQUEST & RESPONSE]
Description: ...

## 2. Create Product
[SCREENSHOT]
Description: ...

... (tiếp tục cho 9 tests)
```

## Upload to Git

```bash
cd d:\son\NNPTUDM_1903
git init (nếu chưa khởi tạo)
git add .
git commit -m "Add inventory system with test documentation"
git push origin main
```

---

**Chúc bạn tạo documentation đẹp! 🎉**
