import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cart = [];

  constructor() { }

  public getCart() {
    return this.cart;
  }

  public setCart(cart) {
    this.cart = cart;
  }

  public resetCart() {
    this.cart = [];
  }

  public addProduct(product) {
    let added = false;
    let cart = this.cart;
    for (let item of cart) {
      if (item.id === product.id) {
        item.selectedAmount = item.selectedAmount + product.amount;
        added = true;
      }
    }
    if (!added) {
      product.selectedAmount = product.amount;
      cart.push(product);
    }
    this.cart = cart;
    product.amount = 0;
  }
}
