import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.page.html",
  styleUrls: ["./admin.page.scss"],
})
export class AdminPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  logOut() {
    localStorage.removeItem("email");
    localStorage.removeItem("isAdmin");
    this.router.navigate(["/login"]);
  }
}
