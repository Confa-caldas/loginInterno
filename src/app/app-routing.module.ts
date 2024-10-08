import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginInternoComponent } from './components/login-interno/login-interno.component';

const routes: Routes = [
  { path: 'loginInterno', component: LoginInternoComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'loginInterno' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
