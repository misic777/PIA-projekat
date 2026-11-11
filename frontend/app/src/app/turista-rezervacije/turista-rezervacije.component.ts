import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RezervacijaService } from '../services/rezervacija.service';
import Rezervacija from '../models/rezervacija';
import Korisnik from '../models/korisnik';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turista-rezervacije',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turista-rezervacije.component.html',
  styleUrl: './turista-rezervacije.component.css',
})
export class TuristaRezervacijeComponent {
  private router = inject(Router);
  private rezervacijaServis = inject(RezervacijaService);

  rezervacije: Rezervacija[] = [];
  turista: Korisnik = new Korisnik();

  trenutneRezervacije: Rezervacija[] = [];
  arhivaRezervacija: Rezervacija[] = [];

  ngOnInit() {
    const x = localStorage.getItem('ulogovan');
    if (x) {
      this.turista = JSON.parse(x);
    }
    this.rezervacijaServis
      .dohvatiAktivneRezervacije(this.turista._id)
      .subscribe({
        next: (rezervacije) => {
          this.trenutneRezervacije = rezervacije;
        },
        error: (error) => {
          console.error('Greška pri dohvaćanju aktivnih rezervacija:', error);
        },
      });

    this.rezervacijaServis.dohvatiIstoriju(this.turista._id).subscribe({
      next: (rezervacije) => {
        this.arhivaRezervacija = rezervacije;
      },
      error: (error) => {
        console.error('Greška pri dohvaćanju aktivnih rezervacija:', error);
      },
    });
  }

  otkaziRezervaciju(rezervacijaId?: string) {
    if (!rezervacijaId) return;

    const potvrda = confirm(
      'Da li ste sigurni da želite da otkažete ovu rezervaciju?'
    );
    if (!potvrda) return;

    const razlog = prompt('Molimo unesite razlog otkazivanja:');
    if (!razlog || razlog.trim() === '') {
      alert('Morate uneti razlog otkazivanja.');
      return;
    }

    this.rezervacijaServis.otkaziRezervaciju(rezervacijaId, razlog).subscribe({
      next: (response) => {
        //alert('Rezervacija uspešno otkazana.');
        // Osvežavanje liste
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Greška pri otkazivanju rezervacije:', error);
        alert('Greška pri otkazivanju rezervacije. Pokušajte ponovo.');
      },
    });
  }
}
