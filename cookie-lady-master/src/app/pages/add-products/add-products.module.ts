import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddProductsPageRoutingModule } from "./add-products-routing.module";

import { AddProductsPage } from "./add-products.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddProductsPageRoutingModule,
  ],
  declarations: [AddProductsPage],
})
export class AddProductsPageModule {}
