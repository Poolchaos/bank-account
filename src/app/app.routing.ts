import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './authenticate/login/login.component';
import { ApplicationComponent } from './application/application.component';
import { RegisterComponent } from './authenticate/register/register.component';
import { PublicComponent } from './public/public.component';
import { HomeComponent } from './public/home/home.component';

const appRoutes: Routes = [
  { path: '', component: PublicComponent, children: [
    { path: '', component: HomeComponent }
  ]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: ApplicationComponent, canActivate: [AuthGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
