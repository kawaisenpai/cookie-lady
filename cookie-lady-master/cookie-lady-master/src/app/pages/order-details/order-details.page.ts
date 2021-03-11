import { ProductService } from "./../../services/product.service";
import { LoadingController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.page.html",
  styleUrls: ["./order-details.page.scss"],
})
export class OrderDetailsPage implements OnInit {
  order: any = {};
  loaded = false;
  constructor(
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loadingCtrl.create({ keyboardClose: true }).then(loadingEl => {
        loadingEl.present();
        this.order = JSON.parse(params.order);
        let loop = 0;
        let length = this.order.products.length;
        this.order.products.forEach(product => {

          this.productService.getProductById(product.id).subscribe(res => {
            product.productDetails = res;
            console.log(this.order);
            loop = loop + 1;
            if (loop == length) {
              this.loaded = true;
              loadingEl.dismiss();
            }
          }, (err => {
            loadingEl.dismiss();
          }))
        })
      })
    })
  }

  totalItems(products) {
    let amount = 0;
    products.forEach(product => {
      amount = amount + product.amount;
    })
    return amount;
  }


  getFormattedTime(date) {
    return moment(date).format("DD-MMM-YYYY")
  }
}
