import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';
import Korisnik from '../models/korisnik';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-vlasnik',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet],
  templateUrl: './vlasnik.component.html',
  styleUrl: './vlasnik.component.css'
})
export class VlasnikComponent {

  private router = inject(Router);
  private korisnikServis = inject(KorisnikService);

  ulogovan: Korisnik = new Korisnik();

  ngOnInit() {
    let x = localStorage.getItem('ulogovan');
    if (x != null) {
      this.ulogovan = JSON.parse(x);
    }
  }

  navigateTo(path: string) {
    let x = localStorage.getItem('ulogovan');
    if (x != null) {
      this.ulogovan = JSON.parse(x);
    }
    localStorage.setItem('ulogovan', JSON.stringify(this.ulogovan));
    this.router.navigate([`/vlasnik/${path}`]);
  }

  logout() {
    localStorage.removeItem('ulogovan');
    this.router.navigate(['']);
  }

}
