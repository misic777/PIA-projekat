import { Component, inject } from '@angular/core';
import { RezervacijaService } from '../services/rezervacija.service';
import { KorisnikService } from '../services/korisnik.service';
import Korisnik from '../models/korisnik';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-zahtevi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-zahtevi.component.html',
  styleUrl: './admin-zahtevi.component.css',
})
export class AdminZahteviComponent {
  private korisnikServis = inject(KorisnikService);
  naCekanjuKorisnici: Korisnik[] = [];

  ngOnInit() {
    this.korisnikServis.dohvatiKorisnike().subscribe((korisnici) => {
      this.naCekanjuKorisnici = korisnici.filter(
        (k) => k.status === 'ceka odobrenje'
      );
    });
  }

  

  prikaziOdbijanje(korisnik: Korisnik) {
    korisnik.prikazOdbijanje = true;
    korisnik.razlogOdbijanja = '';
  }

  otkazi(korisnik: Korisnik) {
    korisnik.prikazOdbijanje = false;
    korisnik.razlogOdbijanja = '';
  }

  prihvati(id?: string) {
    if (!id) return;

    this.korisnikServis.prihvatiZahtev(id).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Greška:', err);
      },
    });
  }

  odbij(id?: string, razlog?: string) {
    if (!id) return;

    if (!razlog || razlog.trim() === '') {
      alert('Morate uneti razlog odbijanja!');
      return;
    }

    this.korisnikServis.odbijZahtev(id, razlog).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Greška:', err);
      },
    });
  }
}
