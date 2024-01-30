import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HotToastService} from "@ngneat/hot-toast";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../services/users.service";
import {UsersType} from "../../../../types/users.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;
  name: string = '';
  users: UsersType = {id: '', name: '', email: ''};

  private authService = inject(AuthService);
  private hotToastService = inject(HotToastService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private route= inject(ActivatedRoute);

  constructor() {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit() {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;

      if (this.isLogged) {
        this.authService.userName$.subscribe((userName: string) => {
          this.name = userName;
        });



      }
    })
    this.showUserName();
  }

  showUserName() {
    if(this.isLogged) {
      this.usersService.getUsers()
        .subscribe({
          next: (data: UsersType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            this.users = data as UsersType;
            this.name = this.users.name;
            this.usersService.setUserName(this.users.name);
            this.authService.userName$.next(this.users.name);

            if (error) {
              this.hotToastService.error(error);
              throw new Error(error);
            }
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


  isFragmentActive(fragment: string): boolean {
    return this.route.snapshot.fragment === fragment;
  }

  logout() {
    this.authService.logout()
      .subscribe({
        next: (data: DefaultResponseType) => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    // this.authService.userId = null;
    this.hotToastService.info('Вы вышли из системы!');
    this.router.navigate(['/']);
  }
}
