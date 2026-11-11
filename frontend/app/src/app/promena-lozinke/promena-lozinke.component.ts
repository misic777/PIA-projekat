import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promena-lozinke',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './promena-lozinke.component.html',
  styleUrl: './promena-lozinke.component.css',
})
export class PromenaLozinkeComponent {
  private router = inject(Router);
  private korisnikServis = inject(KorisnikService);

  novaLozinka: string = '';
  potvrdaLozinke: string = '';
  message: string = '';
  korisnik: string = '';

  constructor() {}

  ngOnInit() {
    let x = localStorage.getItem('korisnikZaPromenuLozinke');
    if (x) {
      this.korisnik = x;
    }
  }

  proveraUslovaLozinke() {
    const pwdRegex =
      /^(?=.{6,10}$)(?=.*[A-Z])(?=(?:.*[a-z]){3,})(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z].*$/;
    if (!pwdRegex.test(this.novaLozinka)) {
      this.message =
        'Nova lozinka nije validna. Mora imati 6-10 karaktera, počinjati slovom, sadržati bar jedno veliko slovo, tri mala slova, jedan broj i jedan specijalni karakter.';
      return false;
    } else {
      this.message = '';
      return true;
    }
  }

  promeniLozinku() {
    if (this.novaLozinka == '' || this.potvrdaLozinke == '') {
      this.message = 'Niste uneli sve podatke!';
      return;
    }
    if (this.novaLozinka != this.potvrdaLozinke) {
      this.message = 'Lozinke se ne poklapaju!';
      return;
    }
    if (!this.proveraUslovaLozinke()) {
      return;
    }
    this.korisnikServis
      .promeniLozinku(this.korisnik, this.novaLozinka)
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/login']);
        } else {
          this.message = JSON.stringify(res);
        }
      });
  }

  goBack() {
    localStorage.removeItem('korisnikZaPromenuLozinke');
    this.router.navigate(['/login']);
  }
}
