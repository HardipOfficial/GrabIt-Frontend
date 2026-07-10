import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductManagementComponent } from './pages/product-management/product-management.component';
import { CategoryManagementComponent } from './pages/category-management/category-management.component';
import { OrderManagementComponent } from './pages/order-management/order-management.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';

@NgModule({
    declarations: [
        DashboardComponent,
        ProductManagementComponent,
        CategoryManagementComponent,
        OrderManagementComponent,
        AdminLoginComponent
    ],
    imports: [
        SharedModule,
        AdminRoutingModule
    ]
})
export class AdminModule { }
