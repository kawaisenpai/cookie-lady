import { Products } from "./../types/product.type";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(public afs: AngularFirestore) {}

  public addNewProduct(values: any): Observable<any> {
    return new Observable<any>((observer) => {
      const docRef = this.afs.collection(`products`);
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

  public editProduct(id, values: any): Observable<any> {
    return new Observable<any>((observer) => {
      const docRef = this.afs.doc(`products/${id}`);
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

  deleteProduct(id: string) {
    return new Observable<any>((observer) => {
      const docRef = this.afs.doc(`products/${id}`);
      docRef.delete().then(
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

  public getProductById(id): Observable<Products> {
    return new Observable<Products>((observer) => {
      const docRef = this.afs.doc(`products/${id}`);
      const userData = docRef.get().subscribe(
        (res: any) => {
          observer.next(res.data());
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  public getAllProducts() {
    return this.afs
      .collection("products")
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Products;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}
