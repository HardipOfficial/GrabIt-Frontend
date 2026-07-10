// Product Model
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    categoryId: string;
    image: string;
    stock: number;
    inStock: boolean;
    featured?: boolean;
    rating?: number;
    unit?: string; // e.g., "kg", "pcs", "ltr"
}

// Category Model
export interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    productCount?: number;
}

// Cart Item Model
export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    subtotal: number;
}

// simplified order item stored in backend
export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

// User Model
export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    profilePicture?: string;
    role: 'user' | 'admin';
}

// Order Model
export interface Order {
    id: string;
    userId: string;
    items: OrderItem[]; // stored as simplified items instead of CartItem
    total: number;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    paymentMethod?: 'cod' | 'online';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    createdAt: Date;
    deliveryAddress?: string;
}

// Contact Form Model
export interface ContactForm {
    name: string;
    email: string;
    message: string;
}

// Auth Response Model
export interface AuthResponse {
    token: string;
    user: User;
}

// API Response Models
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Filter Options
export interface ProductFilter {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
    sortBy?: 'price' | 'name';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}
