import { Orders } from './../types/order.type';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderData: any;

  constructor(public afs: AngularFirestore) { }

  getOrderData() {
    return this.orderData;
  }

  setOrderData(data: any) {
    this.orderData = data;
  }

  public addNewOrder(values: any): Observable<any> {
    return new Observable<any>((observer) => {
      const docRef = this.afs.collection(`orders`);
      docRef.add(values).then(
        (res) => {
          console.log(res.id);

          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  public updateOrder(id, values: any): Observable<any> {
    return new Observable<any>((observer) => {
      const docRef = this.afs.doc(`orders/${id}`);
      docRef.update(values).then(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  public getCurrentUserOrders() {
    return this.afs
      .collection("orders", (ref) =>
        ref.where("orderedBy", "==", localStorage.getItem("email"))
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Orders;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}
