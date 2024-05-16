import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import {NotFoundPageComponent} from "./pages/not-found-page/not-found-page.component";
import {EntryPageComponent} from "./pages/entry-page/entry-page.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {TableCandidatePageComponent} from "./pages/table-candidate-page/table-candidate-page.component";
import {AddCandidatePageComponent} from "./pages/add-candidate-page/add-candidate-page.component";
import {CalendarPageComponent} from "./pages/calendar-page/calendar-page.component";
import {ClientPageComponent} from "./pages/client-page/client-page.component";
import {ProfilePageComponent} from "./pages/profile-page/profile-page.component";
import {UsersListPageComponent} from "./pages/users-list-page/users-list-page.component";
import {AuthGuard} from "./auth.guard";
import {ForgotPassPageComponent} from "./pages/forgot-pass-page/forgot-pass-page.component";
import {ResetPasswordPageComponent} from "./pages/reset-password-page/reset-password-page.component";
import { TaxPageComponent } from './pages/tax-page/tax-page.component';

const routes: Routes = [
  {path: 'reset-password', component: ResetPasswordPageComponent},
  {path: 'resetpassword?token=/:token', component: ResetPasswordPageComponent},
  {path: 'forgot-password', component: ForgotPassPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'entry', component: EntryPageComponent, canActivate:[AuthGuard], children:[
      {path: 'home', component: HomePageComponent},
      {path: 'candidate-table', component: TableCandidatePageComponent},
      {path: 'add-candidate', component: AddCandidatePageComponent},
      {path: 'calendar', component: CalendarPageComponent},
      {path: 'clients', component: ClientPageComponent},
      {path: 'profile', component: ProfilePageComponent},
      {path: 'users-list', component: UsersListPageComponent},
      {path: 'tax', component: TaxPageComponent},
    ],
  },
  {path: '**', component: NotFoundPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
