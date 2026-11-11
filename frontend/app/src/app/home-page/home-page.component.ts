import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';
import { VikendicaService } from '../services/vikendica.service';
import { RezervacijaService } from '../services/rezervacija.service';
import Vikendica from '../models/vikendica';
import Korisnik from '../models/korisnik';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Rezervacija from '../models/rezervacija';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private router = inject(Router);
  private korisnikServis = inject(KorisnikService);
  private vikendicaServis = inject(VikendicaService);
  private rezervacijaServis = inject(RezervacijaService);

  vikendice: Vikendica[] = [];
  prikazaneVikendice: Vikendica[] = [];
  korisnici: Korisnik[] = [];
  rezervacije: Rezervacija[] = [];

  pretragaNaziv: string = '';
  pretragaMesto: string = '';
  sortiranje: string = 'naziv-asc';
  today: Date = new Date();

  brojVikendica: number = 0;
  brojTurista: number = 0;
  brojVlasnika: number = 0;

  rezervacije24h: number = 0;
  rezervacije7d: number = 0;
  rezervacije30d: number = 0;

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
    this.korisnikServis.dohvatiKorisnike().subscribe((korisnici) => {
      this.korisnici = korisnici;
      this.brojVlasnika = this.korisnici.filter(
        (k) => k.tip === 'vlasnik' && k.status === 'aktivan'
      ).length;
      this.brojTurista = this.korisnici.filter(
        (k) => k.tip === 'turista' && k.status === 'aktivan'
      ).length;
    });

    this.vikendicaServis.dohvatiVikendice().subscribe((vikendice) => {
      this.vikendice = vikendice;
      this.brojVikendica = this.vikendice.length;
      this.prikazaneVikendice = this.vikendice;
    });

    this.rezervacijaServis.dohvatiRezervacije().subscribe((rezervacije) => {
      this.rezervacije = rezervacije;
      this.rezervacije24h = this.rezervacije.filter((r) => {
        const sada = new Date();
        const razlika =
          sada.getTime() - new Date(r.datumKreiranja || sada).getTime();
        return razlika <= 24 * 60 * 60 * 1000; // 24h u ms
      }).length;
      this.rezervacije7d = this.rezervacije.filter((r) => {
        const sada = new Date();
        const razlika =
          sada.getTime() - new Date(r.datumKreiranja || sada).getTime();
        return razlika <= 7 * 24 * 60 * 60 * 1000; // 7 dana u ms
      }).length;
      this.rezervacije30d = this.rezervacije.filter((r) => {
        const sada = new Date();
        const razlika =
          sada.getTime() - new Date(r.datumKreiranja || sada).getTime();
        return razlika <= 30 * 24 * 60 * 60 * 1000; // 30 dana u ms
      }).length;
    });
  }

  pretraziVikendice() {
    if (this.pretragaNaziv && this.pretragaMesto) {
      this.prikazaneVikendice = this.vikendice.filter(
        (vikendica) =>
          vikendica.naziv
            .toLowerCase()
            .includes(this.pretragaNaziv.toLowerCase()) &&
          vikendica.mesto
            .toLowerCase()
            .includes(this.pretragaMesto.toLowerCase())
      );
    } else if (this.pretragaNaziv) {
      this.prikazaneVikendice = this.vikendice.filter((vikendica) =>
        vikendica.naziv.toLowerCase().includes(this.pretragaNaziv.toLowerCase())
      );
    } else if (this.pretragaMesto) {
      this.prikazaneVikendice = this.vikendice.filter((vikendica) =>
        vikendica.mesto.toLowerCase().includes(this.pretragaMesto.toLowerCase())
      );
    } else {
      this.prikazaneVikendice = this.vikendice;
    }
  }

  sortirajVikendice() {
    if (this.sortiranje === 'naziv-asc') {
      this.prikazaneVikendice.sort((a, b) => a.naziv.localeCompare(b.naziv));
    } else if (this.sortiranje === 'naziv-desc') {
      this.prikazaneVikendice.sort((a, b) => b.naziv.localeCompare(a.naziv));
    } else if (this.sortiranje === 'mesto-asc') {
      this.prikazaneVikendice.sort((a, b) => a.mesto.localeCompare(b.mesto));
    } else if (this.sortiranje === 'mesto-desc') {
      this.prikazaneVikendice.sort((a, b) => b.mesto.localeCompare(a.mesto));
    }
  }
}
