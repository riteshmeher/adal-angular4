import { Component } from '@angular/core';

import { Adal4Service} from 'adal-angular4';
import { environment } from 'environments/environment';

// Adal Configuration
const config = environment.adalConfig;

@Component({
  selector: 'aa4-root',
  templateUrl: './app.component.html'
})

export class AppComponent {

  title = 'Adal Angular4 Example';

  constructor(private service: Adal4Service) {

    this.service.init(config);
    console.log('this is after init config ');

  }

  logOut(){
    this.service.logOut();
  }
}
