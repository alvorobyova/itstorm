import {Component, inject} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {HotToastService} from "@ngneat/hot-toast";
import {Router} from "@angular/router";
import {UsersType} from "../../../../types/users.type";
import {UsersService} from "../../../shared/services/users.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private hotToastService = inject(HotToastService);
  private usersService = inject(UsersService);
  private router = inject(Router);

  showPassword: boolean = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = data as LoginResponseType;

            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = ('Ошибка авторизации');
              this.hotToastService.error('Ошибка авторизации');
            }

            if (error) {
              this.hotToastService.error(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            // this.authService.setUserInfo(loginResponse.userId);

            this.usersService.getUsers()
              .subscribe((data: UsersType | DefaultResponseType) => {
                if((data as DefaultResponseType).error !== undefined) {
                  throw new Error((data as DefaultResponseType).message);
                }
                const userInfo = data as UsersType;
                if(userInfo.name) {
                  this.usersService.setUserName(userInfo.name);
                }

                const userName = this.usersService.getUserNameFromLocalStorage();
                this.authService.userName$.next(userName);
              });

            this.hotToastService.success('Авторизация прошла успешно!');
            this.router.navigate(['/']);

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.hotToastService.error(errorResponse.error.message);
            } else {
              this.hotToastService.error('Ошибка авторизации');
            }
          }
        })
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
