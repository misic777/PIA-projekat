import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Vikendica from '../models/vikendica';
import Korisnik from '../models/korisnik';
import { RezervacijaService } from '../services/rezervacija.service';

@Component({
  selector: 'app-turista-vikendice-detaljno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turista-vikendice-detaljno.component.html',
  styleUrl: './turista-vikendice-detaljno.component.css',
})
export class TuristaVikendiceDetaljnoComponent implements OnInit {
  private router = inject(Router);
  private rezervacijaService = inject(RezervacijaService);

  vikendica: Vikendica = new Vikendica();
  ulogovan: Korisnik = new Korisnik();
  prosecnaOcena: number = 0.0;
  today = new Date();

  // Rezervacija form state
  prikaziFormu: boolean = false;
  trenutniKorak: number = 1;

  // Step 1 - Podaci o rezervaciji
  datumPocetka: string = '';
  datumKraja: string = '';
  brojOdraslih: number = 1;
  brojDece: number = 0;

  // Step 2 - Plaćanje i dodatno
  karticaZaPlacanje: string = '';
  specijalniZahtevi: string = '';

  // Kalkulacije
  brojNocenja: number = 0;
  ukupnaCena: number = 0;

  // Validacija
  greska: string = '';
  minDatum: string = '';

  ngOnInit() {
    const storedVikendica = localStorage.getItem('vikendica');
    if (storedVikendica) {
      this.vikendica = Object.assign(
        new Vikendica(),
        JSON.parse(storedVikendica)
      );
      this.izracunajProsecnuOcenu();
    }

    const storedKorisnik = localStorage.getItem('ulogovan');
    if (storedKorisnik) {
      this.ulogovan = JSON.parse(storedKorisnik);
      this.karticaZaPlacanje = this.ulogovan.broj_kreditne_kartice;
    }

    // Postavi minimalni datum na danas
    const danas = new Date();
    this.minDatum = danas.toISOString().split('T')[0];
  }

  izracunajProsecnuOcenu() {
    if (this.vikendica.ocene && this.vikendica.ocene.length > 0) {
      const suma = this.vikendica.ocene.reduce((acc, o) => acc + o.ocena, 0);
      this.prosecnaOcena = Number(
        (suma / this.vikendica.ocene.length).toFixed(1)
      );
    }
  }

  getCenaZaDatum(datum?: Date): number {
    if (!datum) {
      datum = new Date();
    }
    return this.vikendica.getCenaZaDatum(datum);
  }

  getSezonaZaDatum(datum?: Date): string {
    if (!datum) {
      datum = new Date();
    }
    return this.vikendica.getSezonaZaDatum(datum);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // Otvori rezervacionu formu
  rezervisiVikendicu() {
    this.prikaziFormu = true;
    this.trenutniKorak = 1;
    this.greska = '';
  }

  // Zatvori formu
  zatvoriFormu() {
    this.prikaziFormu = false;
    this.trenutniKorak = 1;
    this.resetujFormu();
  }

  // Reset forme
  resetujFormu() {
    this.datumPocetka = '';
    this.datumKraja = '';
    this.brojOdraslih = 1;
    this.brojDece = 0;
    this.specijalniZahtevi = '';
    this.karticaZaPlacanje = this.ulogovan.broj_kreditne_kartice;
    this.brojNocenja = 0;
    this.ukupnaCena = 0;
    this.greska = '';
  }

  // Validacija Step 1
  validirajKorak1(): boolean {
    this.greska = '';

    if (!this.datumPocetka || !this.datumKraja) {
      this.greska = 'Molimo unesite datume početka i kraja boravka.';
      return false;
    }

    const pocetak = new Date(this.datumPocetka);
    const kraj = new Date(this.datumKraja);
    const danas = new Date();
    danas.setHours(0, 0, 0, 0);

    if (pocetak < danas) {
      this.greska = 'Datum početka ne može biti u prošlosti.';
      return false;
    }

    if(pocetak.getHours () < 14) {
      this.greska = 'Ulazak je moguć od 14 časova.';
      return false;
    }

    if (kraj <= pocetak) {
      this.greska = 'Datum kraja mora biti nakon datuma početka.';
      return false;
    }

    if(kraj.getHours () > 10) {
      this.greska = 'Izlazak je moguć do 10 časova.';
      return false;
    } 

    const ukupnoGostiju = this.brojOdraslih + this.brojDece;
    if (ukupnoGostiju > this.vikendica.maksGosti) {
      this.greska = `Maksimalan broj gostiju je ${this.vikendica.maksGosti}.`;
      return false;
    }

    if (this.brojOdraslih < 1) {
      this.greska = 'Mora biti najmanje jedan odrasli gost.';
      return false;
    }

    // Proveri da li je vikendica blokirana
    if (this.vikendica.status === 'blokirana' && this.vikendica.blokiranaDo) {
      const blokDatum = new Date(this.vikendica.blokiranaDo);
      if (pocetak <= blokDatum) {
        this.greska = `Vikendica je blokirana do ${blokDatum.toLocaleDateString(
          'sr-RS'
        )}.`;
        return false;
      }
    }

    return true;
  }

  // Izračunaj cenu
  izracunajCenu() {
    if (!this.datumPocetka || !this.datumKraja) return;

    const pocetak = new Date(this.datumPocetka);
    const kraj = new Date(this.datumKraja);

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    this.brojNocenja = Math.round(
      (kraj.getTime() - pocetak.getTime()) / MS_PER_DAY
    );

    let ukupno = 0;
    let trenutniDatum = new Date(pocetak);

    // Prolazi kroz svaki dan i sabira cenu
    for (let i = 0; i < this.brojNocenja; i++) {
      const mesec = trenutniDatum.getMonth() + 1;
      const cena =
        mesec >= 5 && mesec <= 8
          ? this.vikendica.cena_leto
          : this.vikendica.cena_zima;
      ukupno += cena;
      trenutniDatum.setDate(trenutniDatum.getDate() + 1);
    }

    this.ukupnaCena = ukupno;
  }

  // Pređi na korak 2
  sledeci() {
    if (this.validirajKorak1()) {
      this.izracunajCenu();
      this.trenutniKorak = 2;
    }
  }

  // Vrati se na korak 1
  nazad() {
    this.trenutniKorak = 1;
    this.greska = '';
  }

  // Validacija Step 2
  validirajKorak2(): boolean {
    this.greska = '';

    if (!this.karticaZaPlacanje || this.karticaZaPlacanje.trim() === '') {
      this.greska = 'Molimo unesite broj kreditne kartice.';
      return false;
    }

    // Validacija broja kartice (osnovana)
    const sanitized = this.karticaZaPlacanje.replace(/\s/g, '');
    const karticaRegex = /^\d{15,16}$/;
    if (!karticaRegex.test(sanitized)) {
      this.greska = 'Broj kartice mora sadržati 15 ili 16 cifara.';
      return false;
    }

    if (this.specijalniZahtevi.length > 500) {
      this.greska = 'Specijalni zahtevi ne mogu biti duži od 500 karaktera.';
      return false;
    }

    return true;
  }

  // Potvrdi rezervaciju
  potvrdiRezervaciju() {
    if (!this.validirajKorak2()) {
      return;
    }

    const rezervacijaData = {
      vikendicaId: this.vikendica._id,
      turistaId: this.ulogovan._id,
      nazivVikendice: this.vikendica.naziv,
      mestoVikendice: this.vikendica.mesto,
      imeTuriste: `${this.ulogovan.ime} ${this.ulogovan.prezime}`,
      datumPocetka: new Date(this.datumPocetka),
      datumKraja: new Date(this.datumKraja),
      brojOdraslih: this.brojOdraslih,
      brojDece: this.brojDece,
      ukupnaCena: this.ukupnaCena,
      specijalniZahtevi: this.specijalniZahtevi,
      status: 'naCekanju',
      karticaZaPlacanje: this.karticaZaPlacanje.replace(/\s/g, ''),
      brojNocenja: this.brojNocenja,
    };

    this.rezervacijaService.kreirajRezervaciju(rezervacijaData).subscribe({
      next: (response) => {
        // alert(
        //   `Rezervacija uspešno kreirana!\n\nBroj noćenja: ${this.brojNocenja}\nUkupna cena: ${this.ukupnaCena} RSD\n\nStatus: Na čekanju\n\nDoći ćete obaveštenje kada vlasnik potvrdi rezervaciju.`
        // );
        this.zatvoriFormu();
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.greska = err.error.message;
        } else {
          this.greska = 'Greška pri kreiranju rezervacije. Pokušajte ponovo.';
        }
        console.error('Greška:', err); // ✅ Dodajte ovo za debugovanje
      },
    });
  }
}
