import { ViewService } from './../../services/view.service';
import { ToastService } from "./../../services/toast.service";
import { LoadingController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import { AlertService } from "src/app/services/alert.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertService: AlertService,
    private toastService: ToastService,
    private viewService: ViewService
  ) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      fname: new FormControl("", Validators.compose([Validators.required])),
      lname: new FormControl("", Validators.compose([Validators.required])),
      address: new FormControl("", Validators.compose([Validators.required])),
      mobile: new FormControl("", Validators.compose([Validators.required])),
    });
    this.route.queryParams.subscribe((params) => {
      if (this.viewService.getIsNewProfilePage()) {
        this.profileForm.reset();
        this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
          loadingEl.present();
          this.userService.getUserDetails().subscribe(
            (res: any) => {
              console.log(res);
              loadingEl.dismiss();
              this.profileForm.patchValue({
                email: localStorage.getItem("email"),
                fname: res.fname,
                lname: res.lname,
                address: res.address,
                mobile: res.mobile,
              });
            },
            (err) => {
              this.alertService.showFirebaseAlert(err);
            }
          );
        });
        this.viewService.setIsNewProfilePage(false);
      }
    });
  }

  logOut() {
    this.router.navigate(["/login"]);
    localStorage.removeItem("email");
    this.viewService.logOut();
    localStorage.removeItem("isAdmin");
  }

  updateUser() {
    if (this.profileForm.valid) {
      let userData = {
        fname: this.profileForm.value.fname,
        lname: this.profileForm.value.lname,
        address: this.profileForm.value.address,
        mobile: this.profileForm.value.mobile,
      };
      this.userService
        .updateUser(localStorage.getItem("email"), userData)
        .subscribe(
          (res) => {
            this.toastService.presentToast("Data updated");
          },
          (err) => {
            this.toastService.presentToast(err.message);
          }
        );
    } else {
      this.toastService.presentToast("Invalid datas");
    }
  }
}
