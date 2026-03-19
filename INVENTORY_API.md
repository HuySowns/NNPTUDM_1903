# Inventory Management API Documentation

## Overview
This API provides complete inventory management functionality for managing product stocks, reservations, and sold items.

## Base URL
```
http://localhost:3000/api/v1/inventories
```

## Inventory Model
```json
{
  "_id": "ObjectId",
  "product": "ObjectId (ref: product)",
  "stock": "number (min: 0)",
  "reserved": "number (min: 0)",
  "soldCount": "number (min: 0)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Endpoints

### 1. Get All Inventories
- **Method**: GET
- **URL**: `/`
- **Description**: Retrieve all inventories with product details
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "inventory_id",
      "product": {
        "_id": "product_id",
        "title": "Product Name",
        "price": 100,
        "description": "Description",
        "category": "category_id",
        "images": ["url1", "url2"]
      },
      "stock": 50,
      "reserved": 5,
      "soldCount": 10,
      "createdAt": "2024-03-19T...",
      "updatedAt": "2024-03-19T..."
    }
  ],
  "message": "Get all inventories successfully"
}
```

### 2. Get Inventory by ID
- **Method**: GET
- **URL**: `/:id`
- **Description**: Retrieve a specific inventory by its ID with product details
- **Example**: `/507f1f77bcf86cd799439011`
- **Response**: Same as single inventory object

### 3. Get Inventory by Product ID
- **Method**: GET
- **URL**: `/product/:productId`
- **Description**: Retrieve inventory for a specific product
- **Example**: `/product/507f1f77bcf86cd799439011`

### 4. Add Stock
- **Method**: POST
- **URL**: `/add-stock`
- **Body**:
```json
{
  "product": "product_id",
  "quantity": 10
}
```
- **Description**: Increase stock for a product
- **Response**: Updated inventory object

### 5. Remove Stock
- **Method**: POST
- **URL**: `/remove-stock`
- **Body**:
```json
{
  "product": "product_id",
  "quantity": 5
}
```
- **Description**: Decrease stock for a product
- **Validation**: 
  - Quantity must be positive
  - Cannot remove more than available stock
- **Response**: Updated inventory object

### 6. Make Reservation
- **Method**: POST
- **URL**: `/reservation`
- **Body**:
```json
{
  "product": "product_id",
  "quantity": 3
}
```
- **Description**: Reserve items from stock
- **Process**:
  - Decreases stock by quantity
  - Increases reserved by quantity
- **Validation**: 
  - Quantity must be positive
  - Cannot reserve more than available stock
- **Response**: Updated inventory object

### 7. Confirm Sale
- **Method**: POST
- **URL**: `/sold`
- **Body**:
```json
{
  "product": "product_id",
  "quantity": 2
}
```
- **Description**: Complete sale from reserved items
- **Process**:
  - Decreases reserved by quantity
  - Increases soldCount by quantity
- **Validation**: 
  - Quantity must be positive
  - Cannot sell more than reserved
- **Response**: Updated inventory object

## Flow Example

```
1. Create a product:
   POST /api/v1/products
   → Automatically creates inventory with stock=0

2. Add stock:
   POST /api/v1/inventories/add-stock
   {product: "123", quantity: 100}
   → product: {stock: 100, reserved: 0, soldCount: 0}

3. Make reservation:
   POST /api/v1/inventories/reservation
   {product: "123", quantity: 30}
   → product: {stock: 70, reserved: 30, soldCount: 0}

4. Confirm sale:
   POST /api/v1/inventories/sold
   {product: "123", quantity: 30}
   → product: {stock: 70, reserved: 0, soldCount: 30}
```

## Error Handling

All endpoints return error responses in the following format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common errors:
- Missing product or quantity: 400
- Insufficient stock: 400
- Inventory not found: 404
- Server error: 500

## Testing with Postman

### Import Collection
Use the provided `INVENTORY_POSTMAN_COLLECTION.json` file in Postman to test all endpoints.

### Step-by-step Testing:
1. Create a category (if not exists)
2. Create a product (inventory auto-created)
3. Add stock to inventory
4. Make reservations
5. Confirm sales
6. Verify final inventory state

### Notes:
- Replace `{productId}` with actual product IDs
- All timestamps use ISO 8601 format
- Ensure MongoDB is running before testing
