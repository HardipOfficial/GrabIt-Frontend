import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';

import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
    declarations: [
        HomeComponent,
        ProductsComponent,
        ProductDetailComponent,
        CategoriesComponent,
        CartComponent,
        CheckoutComponent,
        OrdersComponent,
        AboutComponent,
        ContactComponent,
        ProfileComponent
    ],
    imports: [
        SharedModule,
        ClientRoutingModule
    ]
})
export class ClientModule { }
