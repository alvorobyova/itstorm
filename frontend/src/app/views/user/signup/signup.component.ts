import {Component, EventEmitter, inject, Injectable, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {HotToastService} from "@ngneat/hot-toast";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UsersType} from "../../../../types/users.type";
import {UsersService} from "../../../shared/services/users.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

@Injectable({
  providedIn: 'root',
})

export class SignupComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private hotToastService = inject(HotToastService);
  private router = inject(Router);
  private usersService = inject(UsersService);


  showPassword: boolean = false;

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^\s*([А-Я][а-я]+\s*)+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]]
  });

  name: string | null | undefined = '';
  @Output() nameChanged: EventEmitter<string | null | undefined> = new EventEmitter<string | null | undefined>();

  signup() {
    if(this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password
      &&  this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next:(data:DefaultResponseType| LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка регистрации';
            }

            if (error) {
              this.hotToastService.error(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            // this.authService.userId = loginResponse.userId;

            this.hotToastService.success('Регистрация прошла успешно!');
            this.router.navigate(['/']);

            this.name = this.signupForm.value.name;
            this.nameChanged.emit(this.name);

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
          },
          error:(errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.hotToastService.error(errorResponse.error.message);
            } else {
              this.hotToastService.error('Ошибка регистрации');
            }
          }
        })
    }
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
