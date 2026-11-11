import { Component, inject } from '@angular/core';
import { VikendicaService } from '../services/vikendica.service';
import Vikendica from '../models/vikendica';
import { Router } from '@angular/router';
import Korisnik from '../models/korisnik';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vlasnik-moje-vikendice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vlasnik-moje-vikendice.component.html',
  styleUrl: './vlasnik-moje-vikendice.component.css'
})
export class VlasnikMojeVikendiceComponent {
  
  private router = inject(Router);
  private vikendicaServis = inject(VikendicaService);

  mojeVikendice: Vikendica[] = [];
  vlasnik: Korisnik = new Korisnik();

  ngOnInit() {
    let x = localStorage.getItem('ulogovan');
    if (x) {
      this.vlasnik = JSON.parse(x);
      this.osvezi();
    }
  }

  osvezi() {
    this.vikendicaServis.dohvatiVikendiceZaVlasnika(this.vlasnik._id).subscribe({
      next: (response: any) => {
        this.mojeVikendice = response;
      },
      error: (err) => {
        console.error('Greška:', err);
      }
    });
  }

  dodajNovu() {
    this.router.navigate(['/vlasnik/dodajVikendicu']);
  }

  uredi(vikendica: Vikendica) {
    localStorage.setItem('vikendicaZaIzmenu', JSON.stringify(vikendica));
    this.router.navigate(['/vlasnik/urediVikendicu']);
  }

  obrisi(vikendica: Vikendica) {
    const potvrda = confirm(`Da li ste sigurni da želite da obrišete vikendicu "${vikendica.naziv}"?`);
    if (!potvrda) return;

    this.vikendicaServis.obrisiVikendicu(vikendica._id).subscribe({
      next: (response: any) => {
        //alert(response.message);
        this.osvezi();
      },
      error: (err) => {
        console.error('Greška:', err);
        alert('Greška pri brisanju vikendice.');
      }
    });
  }
}
