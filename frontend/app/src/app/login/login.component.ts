import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';
import { NgIf } from '../../../node_modules/@angular/common/index';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
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
      .login(this.username.toLocaleLowerCase(), this.password)
      .subscribe((user) => {
        if(user){
          if(user.tip == 'admin'){
            this.message = 'Admin ne moze da se prijavi ovde';
            return;
          }
          localStorage.setItem('ulogovan', JSON.stringify(user));
          if(user.tip == 'turista'){
            this.router.navigate(['turista']);
          }
          else if(user.tip == 'vlasnik'){
            this.router.navigate(['vlasnik']);
          }
        }
        else {
          this.message = 'Netačni podaci';
        }
      });
  }

  register() {
    this.router.navigate(['/register']);
  }

  promenaLozinke() {
    if (this.username == '') {
      this.message = 'Niste uneli korisnicko ime!';
      return;
    }
    localStorage.setItem('korisnikZaPromenuLozinke', this.username);
    this.router.navigate(['/promenaLozinke']);
  }

  goToHomePage() {
    this.router.navigate(['']);
  }
}
