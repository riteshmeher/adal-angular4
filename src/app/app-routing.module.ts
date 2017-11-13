import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { landingPageComponent } from 'app/landingPageComponent/landingPageComponent';

const routes: Routes = [
  { path: 'landingPage', component: landingPageComponent },
  { path: '', component: HomeComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
