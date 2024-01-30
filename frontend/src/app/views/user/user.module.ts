import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRoutingModule} from './user-routing.module';
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from "./login/login.component";
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import { PolicyComponent } from './policy/policy.component';
import {ArticlesRoutingModule} from "../articles/articles-routing.module";


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    PolicyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    UserRoutingModule,
    ArticlesRoutingModule
  ]
})
export class UserModule {
}
