import { AlertService } from "./../../services/alert.service";
import { UserService } from "./../../services/user.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ),
    });
  }

  async handleLoginUser() {
    if (this.loginForm.valid) {
      this.loadingCtrl
        .create({ keyboardClose: true, cssClass: "loading-ctrl" })
        .then((loadingEl) => {
          loadingEl.present();
          let userDetails = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password,
          };
          this.authService.loginUser(userDetails).then(
            (res) => {
              localStorage.setItem("email", this.loginForm.value.email);

              this.userService.getUserDetails().subscribe(
                (resp: any) => {
                  loadingEl.dismiss();
                  if (resp.isAdmin) {
                    localStorage.setItem("isAdmin", resp.isAdmin);
                    this.router.navigate(["/tabs/home"]);
                  } else {
                    localStorage.setItem("isAdmin", "false");
                    this.router.navigate(["/tabs/home"]);
                  }
                },
                async (err) => {
                  loadingEl.dismiss();
                  await this.alertService.showFirebaseAlert(err);
                }
              );
              this.loginForm.reset();
            },
            async (err) => {
              loadingEl.dismiss();
              const alert = await this.alertCtrl.create({
                header: "Invalid credentials",
                message: err.message,
                buttons: ["Okay"],
              });
              await alert.present();
            }
          );
        });
    } else {
      const alert = await this.alertCtrl.create({
        header: "Alert",
        message: "Please check whether all the fields are correct and valid",
        buttons: ["OK"],
      });

      await alert.present();
    }
  }
}
