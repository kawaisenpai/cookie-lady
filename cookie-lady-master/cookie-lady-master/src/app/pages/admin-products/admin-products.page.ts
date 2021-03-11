import { Router } from "@angular/router";
import { AlertService } from "./../../services/alert.service";
import { ProductService } from "./../../services/product.service";
import { LoadingController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admin-products",
  templateUrl: "./admin-products.page.html",
  styleUrls: ["./admin-products.page.scss"],
})
export class AdminProductsPage implements OnInit {
  products = [];

  constructor(
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.productService.getAllProducts().subscribe(
        (res) => {
          loadingEl.dismiss();
          console.log(res);
          this.products = res;
        },
        (err) => {
          loadingEl.dismiss();
          this.alertService.showFirebaseAlert(err);
        }
      );
    });
  }

  productClicked(id) {
    this.router.navigate(["/edit-products"], { queryParams: { id: id } });
  }
}
