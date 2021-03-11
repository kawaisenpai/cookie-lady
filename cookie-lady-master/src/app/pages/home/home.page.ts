import { AlertService } from "./../../services/alert.service";
import { LoadingController } from "@ionic/angular";
import { ProductService } from "./../../services/product.service";
import { ToastService } from "./../../services/toast.service";
import { CartService } from "./../../services/cart.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  products = [];

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private productService: ProductService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.productService.getAllProducts().subscribe((res) => {
        loadingEl.dismiss();
        res.forEach((product) => {
          product.amount = 0;
        });
        this.products = res;
      });
    });
  }

  async addProduct(product) {
    product.amount += 1;
  }

  removeProduct(product) {
    if (product.amount > 0) {
      product.amount -= 1;
    }
  }

  async addToCart(product) {
    await this.cartService.addProduct(product);
    this.toastService.presentToast("Added to cart");
    console.log(this.cartService.getCart());
  }
}
