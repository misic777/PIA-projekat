import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  private router = inject(Router);
  private korisnikServis = inject(KorisnikService);

  username: string = '';
  password: string = '';
  message: string = '';

  login() {
    if (this.username == '') {
      this.message = 'Niste uneli korisnicko ime!';
      return;
    } else if (this.password == '') {
      this.message = 'Niste uneli sifru!';
      return;
    }
    this.message = '';
    this.korisnikServis
      .login(this.username, this.password)
      .subscribe((user) => {
        if (user && user.tip == 'admin') {
          localStorage.setItem('ulogovanAdmin', JSON.stringify(user));
          this.router.navigate([user.tip]);
        } else {
          this.message = 'Netacni podaci';
        }
      });
  }

  goBack() {
    this.router.navigate(['']);
  }
}
