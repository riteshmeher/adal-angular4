import { NgModule } from "@angular/core";
import { AppComponent } from "app/app.component";
import { HomeComponent } from "app/home/home.component";
import { NotFoundComponent } from "app/not-found/not-found.component";
import { landingPageComponent } from "app/landingPageComponent/landingPageComponent";
import { HttpModule, Http } from "@angular/http";
import { AppRoutingModule } from "app/app-routing.module";
import { SecureService } from "app/service";
import { Adal4Service, Adal4HTTPService } from "adal-angular4";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    landingPageComponent
  ],
  imports: [
    HttpModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [
    SecureService,
    Adal4Service,
    {
      provide: Adal4HTTPService,
      useFactory: Adal4HTTPService.factory,
      deps: [Http, Adal4Service]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

