import { Routes } from '@angular/router';


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
    path: "home",
    loadComponent: () =>
      import("./components/home/home").then(
        (c) => c.Home
      ),
    // canLoad: [AuthGuard],
    children: [
     
    ],
  }
]