import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientLoginComponent } from './pages/client-login/client-login.component';
import { ClientRegisterComponent } from './pages/client-register/client-register.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: ClientLoginComponent, data: { title: 'Client Login' } },
    { path: 'register', component: ClientRegisterComponent, data: { title: 'Register' } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
