import { Component } from '@angular/core';
import { Adal4Service } from 'adal-angular4';
import { SecureService } from 'app/service';
import { environment } from 'environments/environment';

@Component({
  selector: 'adal-login',
  template: `

    <h2>This is ADAL Page </h2>
    <table>
      <tr>
        <td>Username:</td>
        <td>{{this.service.userInfo.username}}</td>
      </tr>
      <tr>
        <td>Authenticated:</td>
        <td>{{this.service.userInfo.authenticated}}</td>
      </tr>
      <tr>
        <td>Name:</td>
        <td>{{this.service.userInfo.profile.name}}</td>
      </tr>
      <tr>
        <td>Token:</td>
        <td>{{this.service.userInfo.token}}</td>
      </tr>
    </table>`
})

export class landingPageComponent {
  constructor(private service: Adal4Service, private securService: SecureService) {
    this.securService.get(environment.userUrl + '/' + this.service.userInfo.username).subscribe((result) => {
      this.securService.get(environment.rolesUrl + '/' + this.service.userInfo.username).subscribe((result) => {
          console.log("response");
      });
    });


  }
}