# Backend API Contract - Grocery Store Application

This document outlines all the backend APIs required for the Angular frontend to function properly. Each endpoint includes its HTTP method, purpose, request/response formats, and where it's used in the frontend.

---

## Authentication APIs

### POST /api/auth/login
**Purpose**: User login  
**Used In**: 
- `AuthService.login()`
- Future user login page (not implemented)

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

### POST /api/auth/admin/login
**Purpose**: Admin login  
**Used In**: 
- `AuthService.adminLogin()`
- `AdminLoginComponent`

**Request Body**:
```json
{
  "email": "admin@freshmart.com",
  "password": "admin123"
}
```

**Response**: Same as user login but with role set to "admin"

---

### POST /api/auth/register
**Purpose**: Create a new user account and automatically log in
**Used In**:
- `AuthService.register()`
- `ClientRegisterComponent`

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

**Responses**:
- `201`:
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "jane@example.com",
    "name": "Jane Doe",
    "role": "user"
  }
}
```

- `400` if missing fields
- `409` if email already exists

---

## Product APIs

### GET /api/products
**Purpose**: Get all products with optional filtering, sorting, and pagination  
**Used In**: 
- `ProductService.getProducts()`
- `HomeComponent` (featured products)
- `ProductsComponent` (product listing)

**Query Parameters**:
- `categoryId` (string, optional)
- `minPrice` (number, optional)
- `maxPrice` (number, optional)
- `inStock` (boolean, optional)
- `search` (string, optional)
- `sortBy` (string, optional): "price" | "name"
- `sortOrder` (string, optional): "asc" | "desc"
- `page` (number, optional, default: 1)
- `pageSize` (number, optional, default: 12)

**Response**:
```json
{
  "data": [
    {
      "id": "product-id",
      "name": "Fresh Apples",
      "description": "Crispy and sweet apples",
      "price": 120,
      "category": "Fruits",
      "categoryId": "cat-id",
      "image": "https://example.com/apple.jpg",
      "stock": 50,
      "inStock": true,
      "featured": false,
      "unit": "kg"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 12,
  "totalPages": 9
}
```

---

### GET /api/products/featured
**Purpose**: Get featured products  
**Used In**: 
- `ProductService.getFeaturedProducts()`
- `HomeComponent`

**Response**: Array of Product objects

---

### GET /api/products/:id
**Purpose**: Get single product details  
**Used In**: 
- `ProductService.getProductById()`
- `ProductDetailComponent`

**Response**: Single Product object

---

### POST /api/products
**Purpose**: Create new product (Admin only)  
**Used In**: 
- `ProductService.createProduct()`
- `ProductManagementComponent`

**Request Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 100,
  "category": "Category Name",
  "categoryId": "cat-id",
  "image": "https://example.com/image.jpg",
  "stock": 50,
  "unit": "kg"
}
```

**Response**:
```json
{
  "success": true,
  "data": { /* Product object */ },
  "message": "Product created successfully"
}
```

---

### PUT /api/products/:id
**Purpose**: Update existing product (Admin only)  
**Used In**: 
- `ProductService.updateProduct()`
- `ProductManagementComponent`

**Request Headers**: Same as POST  
**Request Body**: Same as POST  
**Response**: Same as POST

---

### DELETE /api/products/:id
**Purpose**: Delete product (Admin only)  
**Used In**: 
- `ProductService.deleteProduct()`
- `ProductManagementComponent`

**Response**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### POST /api/products/:id/image
**Purpose**: Upload product image (Admin only)  
**Used In**: 
- `ProductService.uploadProductImage()`

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body**: FormData with "image" field

**Response**:
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://example.com/uploaded-image.jpg"
  }
}
```

---

## Category APIs

### GET /api/categories
**Purpose**: Get all categories  
**Used In**: 
- `CategoryService.getCategories()`
- `HomeComponent`
- `CategoriesComponent`
- `ProductsComponent` (filter sidebar)
- `ProductManagementComponent` (category dropdown)

**Response**:
```json
[
  {
    "id": "cat-id",
    "name": "Fruits",
    "description": "Fresh fruits",
    "image": "https://example.com/fruits.jpg",
    "productCount": 25
  }
]
```

---

### GET /api/categories/:id
**Purpose**: Get single category  
**Used In**: 
- `CategoryService.getCategoryById()`

**Response**: Single Category object

---

### POST /api/categories
**Purpose**: Create new category (Admin only)  
**Used In**: 
- `CategoryService.createCategory()`
- `CategoryManagementComponent`

**Request Body**:
```json
{
  "name": "Category Name",
  "description": "Category description",
  "image": "https://example.com/image.jpg"
}
```

**Response**:
```json
{
  "success": true,
  "data": { /* Category object */ }
}
```

---

### PUT /api/categories/:id
**Purpose**: Update category (Admin only)  
**Used In**: 
- `CategoryService.updateCategory()`
- `CategoryManagementComponent`

**Request Body**: Same as POST  
**Response**: Same as POST

---

### DELETE /api/categories/:id
**Purpose**: Delete category (Admin only)  
**Used In**: 
- `CategoryService.deleteCategory()`
- `CategoryManagementComponent`

**Response**:
```json
{
  "success": true
}
```

---

## Cart APIs

### GET /api/cart
**Purpose**: Get current user's cart items  
**Used In**: 
- `CartService.loadCart()`
- `CartComponent`

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
[
  {
    "id": "cart-item-id",
    "product": { /* Product object */ },
    "quantity": 2,
    "subtotal": 240
  }
]
```

---

### POST /api/cart
**Purpose**: Add item to cart  
**Used In**: 
- `CartService.addToCart()`
- All product display components

**Request Body**:
```json
{
  "productId": "product-id",
  "quantity": 1
}
```

**Response**:
```json
{
  "success": true,
  "data": { /* CartItem object */ }
}
```

---

### PUT /api/cart/:itemId
**Purpose**: Update cart item quantity  
**Used In**: 
- `CartService.updateQuantity()`
- `CartComponent`

**Request Body**:
```json
{
  "quantity": 3
}
```

**Response**:
```json
{
  "success": true,
  "data": { /* Updated CartItem */ }
}
```

---

### DELETE /api/cart/:itemId
**Purpose**: Remove item from cart  
**Used In**: 
- `CartService.removeFromCart()`
- `CartComponent`

**Response**:
```json
{
  "success": true
}
```

---

### DELETE /api/cart/clear
**Purpose**: Clear entire cart  
**Used In**: 
- `CartService.clearCart()`

**Response**:
```json
{
  "success": true
}
```

---

## Contact APIs

### POST /api/contact
**Purpose**: Submit contact form  
**Used In**: 
- `ContactService.submitContactForm()`
- `ContactComponent`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

---

## Implementation Notes

### Authentication
- All APIs except auth endpoints require JWT token in Authorization header
- Token should be sent as: `Authorization: Bearer {token}`
- 401 responses trigger automatic logout and redirect to login

### Error Handling
All error responses should follow this format:
```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (optional)"
}
```

### CORS
Backend must enable CORS for the frontend origin

### File Uploads
- Accept multipart/form-data for image uploads
- Validate file types (jpg, png, webp)
- Store images and return accessible URLs
