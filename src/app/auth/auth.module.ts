import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

import { ClientLoginComponent } from './pages/client-login/client-login.component';
import { ClientRegisterComponent } from './pages/client-register/client-register.component';

@NgModule({
    declarations: [
        ClientLoginComponent,
        ClientRegisterComponent
    ],
    imports: [
        SharedModule,
        AuthRoutingModule
    ]
})
export class AuthModule { }