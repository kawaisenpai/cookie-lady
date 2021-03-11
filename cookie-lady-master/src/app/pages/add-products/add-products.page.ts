import { Router } from "@angular/router";
import { ProductService } from "./../../services/product.service";
import { ToastService } from "./../../services/toast.service";
import { AlertService } from "./../../services/alert.service";
import { LoadingController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";

import { Plugins, CameraResultType } from "@capacitor/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

const { Camera } = Plugins;

@Component({
  selector: "app-add-products",
  templateUrl: "./add-products.page.html",
  styleUrls: ["./add-products.page.scss"],
})
export class AddProductsPage implements OnInit {
  imagePath = "";
  productForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertService: AlertService,
    private toastService: ToastService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      title: new FormControl("", Validators.compose([Validators.required])),
      price: new FormControl("", Validators.compose([Validators.required])),
    });
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });

    var imageUrl = "data:image/jpeg;base64," + image.base64String;
    this.imagePath = imageUrl;
  }

  addProduct() {
    if (this.productForm.valid) {
      if (this.imagePath) {
        this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
          loadingEl.present();
          let data = {
            title: this.productForm.value.title,
            price: this.productForm.value.price,
            imageUrl: this.imagePath,
          };
          this.productService.addNewProduct(data).subscribe(
            (res) => {
              loadingEl.dismiss();
              this.toastService.presentToast("Product added");
              this.router.navigate(["/admin-products"]);
            },
            (err) => {
              loadingEl.dismiss();
              this.alertService.showFirebaseAlert(err);
            }
          );
        });
      } else {
        this.toastService.presentToast("Upload product image");
      }
    } else {
      this.toastService.presentToast("Enter title and price");
    }
  }
}
