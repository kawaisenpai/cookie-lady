import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { EditProductsPageRoutingModule } from "./edit-products-routing.module";

import { EditProductsPage } from "./edit-products.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditProductsPageRoutingModule,
  ],
  declarations: [EditProductsPage],
})
export class EditProductsPageModule {}
