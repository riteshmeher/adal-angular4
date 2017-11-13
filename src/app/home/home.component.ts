import { Component, OnInit, HostListener } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';

import { Adal4Service, Adal4HTTPService } from 'adal-angular4';
import { SecureService } from 'app/service';
import { environment } from 'environments/environment';

@Component({
  selector: 'aa4-home',
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

  // Inject the ADAL Services
  // tslint:disable-next-line:max-line-length
  constructor(private service: Adal4Service, private http: Adal4HTTPService, private router: Router, private securService: SecureService) { }

  // Check authentication on component load
  ngOnInit() {

    // Handle callback if this is a redirect from Azure
    this.service.handleWindowCallback();
    // Check if the user is authenticated. If not, call the login() method
    if (!this.service.userInfo.authenticated) {
      this.service.login();
    }
    else
      console.log(this.service.userInfo);
  }

  // Logout Method
  public logout() {
    this.service.logOut();
  }
}
