import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  isNewOrderPage: boolean = true;
  isNewProfilePage: boolean = true;

  public getIsNewOrderPage() {
    return this.isNewOrderPage;
  }

  public setIsNewOrderPage(isNewOrderPage: boolean) {
    this.isNewOrderPage = isNewOrderPage;
  }

  public getIsNewProfilePage() {
    return this.isNewProfilePage;
  }

  public setIsNewProfilePage(isNewProfilePage: boolean) {
    this.isNewProfilePage = isNewProfilePage;
  }

  logOut() {
    this.isNewOrderPage = true;
    this.isNewProfilePage = true;
  }

}
