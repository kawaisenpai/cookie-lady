import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-payment-success",
  templateUrl: "./payment-success.page.html",
  styleUrls: ["./payment-success.page.scss"],
})
export class PaymentSuccessPage implements OnInit {
  constructor() { }

  ngOnInit() { }

  sendMail() {
    window.location.href = "mailto:" + "thecookieslady@gmail.com";
  }
}
