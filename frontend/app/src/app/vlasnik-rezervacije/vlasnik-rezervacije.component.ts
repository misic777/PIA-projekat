import { Component, inject } from '@angular/core';
import { RezervacijaService } from '../services/rezervacija.service';
import Korisnik from '../models/korisnik';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vlasnik-rezervacije',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './vlasnik-rezervacije.component.html',
  styleUrl: './vlasnik-rezervacije.component.css'
})
export class VlasnikRezervacijeComponent {

  private rezervacijaServis = inject(RezervacijaService);

  vlasnik: Korisnik = new Korisnik();
  mojeRezervacije: any[] = [];

  ngOnInit(): void {
    let x = localStorage.getItem('ulogovan');
    if (x) {
      this.vlasnik = JSON.parse(x);
    }
    this.osvezi();
  }

  osvezi() {
    this.rezervacijaServis.dohvatiVlasnikoveRezervacije(this.vlasnik._id).subscribe({
      next: (rezervacije) => {
        // Filtriraj samo neobrađene (na čekanju)
        this.mojeRezervacije = rezervacije.filter(r => r.status === 'naCekanju');
      },
      error: (error) => {
        console.error('Greška:', error);
      },
    });
  }

  prikaziOdbijanje(item: any) {
    item.prikazOdbijanje = true;
    item.razlogOdbijanja = '';
  }

  otkazi(item: any) {
    item.prikazOdbijanje = false;
    item.razlogOdbijanja = '';
  }

  potvrdi(item: any) {
    if (!item._id) return;

    this.rezervacijaServis.prihvatiRezervaciju(item._id).subscribe({
      next: () => {
        this.osvezi();
      },
      error: (err) => {
        console.error('Greška:', err);
      }
    });
  }

  odbij(item: any) {
    if (!item._id) return;

    if (!item.razlogOdbijanja || item.razlogOdbijanja.trim() === '') {
      alert('Morate uneti razlog odbijanja!');
      return;
    }

    this.rezervacijaServis.odbijRezervaciju(item._id, item.razlogOdbijanja).subscribe({
      next: () => {
        this.osvezi();
      },
      error: (err) => {
        console.error('Greška:', err);
      }
    });
  }
}