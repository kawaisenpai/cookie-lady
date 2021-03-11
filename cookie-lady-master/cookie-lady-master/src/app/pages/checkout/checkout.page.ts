import { ToastService } from './../../services/toast.service';
import { CartService } from './../../services/cart.service';
import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { from } from 'rxjs';
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  apiUrl: string = "https://us-central1-cookie-lady.cloudfunctions.net";
  paymentAmount;
  orderId;
  currency: string = "MYR";
  stripe_key: string =
    "pk_live_51IFzVtEwklouSakm8Bv8rs6mcAmt8j3wvr8RKmfaF76nQWw5pyY2Fzj9tHXYm50ZmLK1HjFDkwfKGA88o9pZ1dYn00A926UItB";
  cardDetails: any = {};
  customerId;
  cardForm: FormGroup;
  constructor(
    private stripe: Stripe,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertService: AlertService,
    private orderService: OrderService,
    private cartService: CartService,
    private toastService: ToastService
  ) { }

  //   unction URL (addCard): https://us-central1-cookie-lady.cloudfunctions.net/addCard
  // Function URL (addCustomer): https://us-central1-cookie-lady.cloudfunctions.net/addCustomer
  // Function URL (charge): https://us-central1-cookie-lady.cloudfunctions.net/charge
  // Function URL (getAllCards): https://us-central1-cookie-lady.cloudfunctions.net/getAllCards

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {

      this.paymentAmount = this.orderService.getOrderData().totalPrice;
      this.orderId = params.sessionId;
      console.log(this.orderId, this.paymentAmount);
    });
    this.cardForm = this.formBuilder.group({
      email: new FormControl(localStorage.getItem("email")),
      cardName: new FormControl("", Validators.compose([Validators.required])),
      cardNumber: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(
            "^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35d{3})d{11})$"
          ),
        ])
      ),
      month: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^(0?[1-9]|1[012])$"),
        ])
      ),
      year: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]{2}$"),
        ])
      ),
      cvc: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]{3}$"),
        ])
      ),
    });
  }

  checkData() {
    console.log(this.cardForm.value.cardNumber);
    console.log(parseInt(this.cardForm.value.month));
    console.log(parseInt("20" + this.cardForm.value.year));
    console.log(this.cardForm.value.cvc);
  }

  payWithStripe() {
    if (this.cardForm.valid) {
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        this.addCustomer().subscribe(
          (res: any) => {
            console.log(res);
            this.customerId = res.cus.id;
            this.stripe.setPublishableKey(this.stripe_key);

            this.cardDetails = {
              number: this.cardForm.value.cardNumber,
              expMonth: parseInt(this.cardForm.value.month),
              expYear: parseInt("20" + this.cardForm.value.year),
              cvc: this.cardForm.value.cvc,
            };

            this.stripe
              .createCardToken(this.cardDetails)
              .then((token) => {
                console.log(token);
                this.makePayment(token.id).subscribe(
                  (res: any) => {
                    console.log("Payment suiccess res", res);

                    if (res.status === "succeeded") {
                      let orderData: any = this.orderService.getOrderData();
                      orderData.status = "Paid";
                      orderData.orderDate = new Date().toISOString();
                      orderData.paymentId = res.id


                      this.orderService
                        .addNewOrder(orderData)
                        .subscribe((resp) => {
                          console.log("Okay");
                          loadingEl.dismiss();
                          this.router.navigate(["/payment-success"], { replaceUrl: true });
                          this.cartService.resetCart();
                          console.log("Res", res);
                          console.log("Payment succeeded");
                        });
                    } else {
                      this.alertService.showAlert(
                        "Error",
                        "Payment failed :" + res,
                        ["Okay"]
                      );
                    }
                  },
                  (err) => {
                    loadingEl.dismiss();
                    console.log(err);
                    this.alertService.showAlert("Error", err, ["Okay"]);
                  }
                );
              })
              .catch((error) => {
                console.log(error);
                loadingEl.dismiss();
                this.alertService.showAlert("Error", error, ["Okay"]);
              });
          },
          (err) => {
            loadingEl.dismiss();
            console.log(err);
            this.alertService.showAlert("Error", err, ["Okay"]);
          }
        );
      });
    } else {
      this.toastService.presentToast("Invalid / Empty datas")
    }
  }

  addCustomer() {
    return from(
      this.http.post(`${this.apiUrl}/addCustomer`, {
        cusName: this.cardForm.value.cardName,
        cusEmail: localStorage.getItem("email"),
      })
    );
  }

  addCard(token) {
    return from(
      this.http.post(`${this.apiUrl}/addCard`, {
        sourceToken: token,
        userId: this.customerId,
      })
    );
  }

  makePayment(token) {
    return from(
      this.http.post(`${this.apiUrl}/charge`, {
        amount: this.paymentAmount * 100,
        currency: "myr",
        token: token,
        custId: this.customerId,
        email: localStorage.getItem("email"),
      })
    );
  }
}
