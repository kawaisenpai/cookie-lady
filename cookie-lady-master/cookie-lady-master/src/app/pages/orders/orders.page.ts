import { Router } from '@angular/router';
import { AlertService } from './../../services/alert.service';
import { ProductService } from './../../services/product.service';
import { LoadingController } from '@ionic/angular';
import { ViewService } from './../../services/view.service';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  myOrders = [];
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private viewService: ViewService,
    private loadingCtrl: LoadingController,
    private alertService: AlertService,
    private productService: ProductService,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.viewService.getIsNewOrderPage()) {
        this.myOrders = [];
        this.loadingCtrl.create({ keyboardClose: true }).then(loadingEl => {
          loadingEl.present();
          this.orderService.getCurrentUserOrders().subscribe(res => {
            this.myOrders = res;
            console.log(this.myOrders);

            loadingEl.dismiss();
          }, (err => {
            loadingEl.dismiss()
            this.alertService.showFirebaseAlert(err);
          }))
        })
        this.viewService.setIsNewOrderPage(false);
      }
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

  orderClick(order) {
    this.router.navigate(['/order-details'], { queryParams: { order: JSON.stringify(order) } })
  }

}
