# Grocery Store - Angular Frontend

A production-quality Angular frontend for a full-stack Grocery Store web application. Features a modern, responsive UI with comprehensive client and admin interfaces.

## 🚀 Features

### Client Features
- **Home Page**: Hero section, featured categories, popular products, and CTAs
- **Product Catalogue**: Advanced filtering (category, price, stock), sorting, pagination
- **Product Details**: Detailed view with quantity controls and cart integration
- **Categories**: Browse products by category with visual cards
- **Shopping Cart**: Add/remove items, update quantities, view totals
- **About Us**: Company information, mission, vision, and features
- **Contact**: Reactive form with validation and Google Maps integration

### Admin Features
- **Secure Login**: JWT-based authentication with route guards
- **Dashboard**: Statistics overview and quick actions
- **Product Management**: Full CRUD operations with image upload UI
- **Category Management**: Manage product categories
- **Order Management**: View and update order status (UI only)

### Technical Features
- Angular 17 with TypeScript
- Lazy-loaded modules for performance
- RxJS state management
- HTTP interceptor for automatic JWT injection
- Route guards for admin protection
- Angular Material UI components
- Responsive mobile-first design
- SCSS with custom theming

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

## 🛠️ Installation

1. **Clone or navigate to the project**
   ```bash
   cd "d:\project\Bapu real\grocery-store-frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally (if not already installed)**
   ```bash
   npm install -g @angular/cli@17
   ```

## 🎯 Running the Application

### Development Server
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

### Production Build
```bash
npm run build
# or
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                    # Singleton services, guards, interceptors
│   │   ├── services/            # API services (Auth, Product, Category, Cart, Contact)
│   │   ├── guards/              # Route guards (AuthGuard)
│   │   ├── interceptors/        # HTTP interceptors (AuthInterceptor)
│   │   └── core.module.ts
│   │
│   ├── shared/                  # Shared components and utilities
│   │   ├── components/          # Header, Footer, ProductCard, LoadingSkeleton, EmptyState
│   │   ├── models/              # TypeScript interfaces
│   │   └── shared.module.ts
│   │
│   ├── client/                  # Client module (lazy-loaded)
│   │   ├── pages/               # Home, Products, ProductDetail, Categories, Cart, About, Contact
│   │   └── client.module.ts
│   │
│   ├── admin/                   # Admin module (lazy-loaded, protected)
│   │   ├── pages/               # Dashboard, ProductManagement, CategoryManagement, OrderManagement
│   │   └── admin.module.ts
│   │
│   ├── auth/                    # Auth module (lazy-loaded)
│   │   ├── pages/               # AdminLogin
│   │   └── auth.module.ts
│   │
│   ├── app-routing.module.ts    # Main routing with lazy loading
│   └── app.module.ts            # Root module
│
├── assets/                      # Static assets
├── styles/                      # Global styles
│   ├── _variables.scss          # SCSS variables
│   └── styles.scss              # Global styles
└── index.html                   # Main HTML file
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep Green (#2E7D32) - Fresh, natural grocery theme
- **Accent**: Orange (#FFA726) - Call-to-action highlights
- **Success**: Green (#4CAF50) - In-stock, positive actions
- **Warning**: Orange (#FF9800) - Alerts
- **Error**: Red (#F44336) - Out-of-stock, errors

### Typography
- **Font Family**: Inter, Roboto, sans-serif
- **Headings**: Weight 600-700
- **Body**: Weight 400-500

## 🔌 Backend Integration

This frontend requires a Node.js + Express backend implementing the REST APIs defined in `API_CONTRACT.md`.

**Key Integration Points:**
- All API calls are made through services in `src/app/core/services/`
- Base API URL is `/api` (configured in each service)
- JWT tokens are automatically attached to requests via `AuthInterceptor`
- See `API_CONTRACT.md` for complete API specifications

## 🔐 Authentication Flow

1. User/Admin logs in via `/auth/admin-login`
2. `AuthService.adminLogin()` sends credentials to backend
3. Backend returns JWT token and user object
4. Token stored in localStorage
5. `AuthInterceptor` attaches token to all subsequent requests
6. `AuthGuard` protects admin routes
7. On 401 response, user is automatically logged out

## 🧪 Testing

```bash
npm test
# or
ng test
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 992px
- Desktop: > 992px

## 🚧 Future Enhancements

- User registration and profile management
- Order checkout and payment integration
- Order history for users
- Advanced analytics dashboard for admin
- Real-time notifications
- Product reviews and ratings
- Wishlist functionality

## 📝 License

This project is created for educational/demonstration purposes.

## 👥 Support

For questions or issues, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Angular** 
