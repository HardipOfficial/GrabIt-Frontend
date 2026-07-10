import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CartComponent } from './pages/cart/cart.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ClientGuard } from '../core/guards/client.guard';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [ClientGuard], data: { title: 'Home' } },
    { path: 'products', component: ProductsComponent, canActivate: [ClientGuard], data: { title: 'Products' } },
    { path: 'product/:id', component: ProductDetailComponent, canActivate: [ClientGuard], data: { title: 'Product Details' } },
    { path: 'categories', component: CategoriesComponent, canActivate: [ClientGuard], data: { title: 'Categories' } },
    { path: 'cart', component: CartComponent, canActivate: [ClientGuard], data: { title: 'Shopping Cart' } },
    { path: 'about', component: AboutComponent, canActivate: [ClientGuard], data: { title: 'About Us' } },
    { path: 'contact', component: ContactComponent, canActivate: [ClientGuard], data: { title: 'Contact Us' } },
    { path: 'checkout', component: CheckoutComponent, canActivate: [ClientGuard], data: { title: 'Checkout' } },
    { path: 'orders', component: OrdersComponent, canActivate: [ClientGuard], data: { title: 'My Orders' } },
    { path: 'profile', component: ProfileComponent, canActivate: [ClientGuard], data: { title: 'My Profile' } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
