import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth-guard.service';


export const routes: Routes = [
     {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () =>
      import("./components/login/login").then(
        (c) => c.Login
      ),
  },
  {
    canActivate: [AuthGuard]  ,
    canLoad: [AuthGuard],
    path: "home",
    loadComponent: () =>
      import("./components/home/home").then(
        (c) => c.Home
      ),
   
  }
]