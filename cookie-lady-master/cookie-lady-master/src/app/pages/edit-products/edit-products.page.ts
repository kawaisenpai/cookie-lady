import { ToastService } from "./../../services/toast.service";
import { AlertService } from "./../../services/alert.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { ProductService } from "./../../services/product.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

import { Plugins, CameraResultType } from "@capacitor/core";
const { Camera } = Plugins;

@Component({
  selector: "app-edit-products",
  templateUrl: "./edit-products.page.html",
  styleUrls: ["./edit-products.page.scss"],
})
export class EditProductsPage implements OnInit {
  productId;
  productDetails;
  productForm: FormGroup;
  imageUrl;
  constructor(
    private router: Router,
    private productService: ProductService,
    private loadingCtrl: LoadingController,
    private alertService: AlertService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      title: new FormControl("", Validators.compose([Validators.required])),
      price: new FormControl("", Validators.compose([Validators.required])),
    });
    this.route.queryParams.subscribe((params) => {
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        this.productId = params.id;
        this.productService.getProductById(this.productId).subscribe(
          (res) => {
            console.log(res);

            this.productDetails = res;
            loadingEl.dismiss();
            this.patchDetails();
          },
          (err) => {
            loadingEl.dismiss();
            this.alertService.showFirebaseAlert(err);
          }
        );
      });
    });
  }

  patchDetails() {
    this.imageUrl = this.productDetails.imageUrl;
    this.productForm.patchValue({
      title: this.productDetails.title,
      price: this.productDetails.price,
    });
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });

    var imageUrl = "data:image/jpeg;base64," + image.base64String;
    this.imageUrl = imageUrl;
  }

  updateProduct() {
    if (this.productForm.valid) {
      if (this.imageUrl) {
        this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
          loadingEl.present();
          let data = {
            title: this.productForm.value.title,
            price: this.productForm.value.price,
            imageUrl: this.imageUrl,
          };
          this.productService.editProduct(this.productId, data).subscribe(
            (res) => {
              loadingEl.dismiss();
              this.toastService.presentToast("Product updated");
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

  async deleteProduct() {
    const alert = await this.alertController.create({
      header: "Confirm!",
      message: "Are you sure you want to delete this product?",
      cssClass: "alert-controller",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: (blah) => {},
        },
        {
          text: "Yes",
          handler: () => {
            this.doDelete();
          },
        },
      ],
    });
    await alert.present();
  }

  doDelete() {
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.productService.deleteProduct(this.productId).subscribe(
        (res) => {
          loadingEl.dismiss();
          this.toastService.presentToast("Product deleted");
          this.router.navigate(["/admin-products"]);
        },
        (err) => {
          loadingEl.dismiss();
          this.alertService.showFirebaseAlert(err);
        }
      );
    });
  }
}
