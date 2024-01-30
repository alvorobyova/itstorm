import {inject, Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {UsersType} from "../../../types/users.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userNameKey: string = 'userName';
  private http = inject(HttpClient);

  getUsers(): Observable<UsersType | DefaultResponseType> {
    return this.http.get<UsersType | DefaultResponseType>(environment.api + 'users',);
  }

  setUserName(name: string): void {
    localStorage.setItem(this.userNameKey, JSON.stringify(name));
  }

  getUserNameFromLocalStorage(): string {
    // return JSON.parse(localStorage.getItem(this.userNameKey) || '');

    const storedName = localStorage.getItem(this.userNameKey);
    return storedName ? JSON.parse(storedName) : '';
  }
}
