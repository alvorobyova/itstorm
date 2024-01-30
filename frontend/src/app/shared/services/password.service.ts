import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private passwordType: string = 'password';
  private showPassword: boolean = false;

  getPasswordType(): string {
    return this.passwordType;
  }

  togglePasswordVisibility(): void {
    this.passwordType = this.showPassword ? 'password' : 'text';
    this.showPassword = !this.showPassword;
  }
}
