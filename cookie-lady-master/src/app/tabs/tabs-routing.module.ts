import { AdminGuard } from "./../guards/admin.guard";
import { HomeGuard } from "./../guards/home.guard";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("../pages/home/home.module").then((m) => m.HomePageModule),
        canActivate: [HomeGuard, AdminGuard],
      },
      {
        path: "profile",
        loadChildren: () =>
          import("../pages/profile/profile.module").then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: "cart",
        loadChildren: () =>
          import("../pages/cart/cart.module").then((m) => m.CartPageModule),
      },
      {
        path: "orders",
        loadChildren: () =>
          import("../pages/orders/orders.module").then(
            (m) => m.OrdersPageModule
          ),
      },
      {
        path: "",
        redirectTo: "/tabs/home",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/tabs/home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
