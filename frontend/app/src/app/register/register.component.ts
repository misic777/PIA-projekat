import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';
import Korisnik from '../models/korisnik';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private router = inject(Router);
  private korisnikServis = inject(KorisnikService);

  korisnik: Korisnik = new Korisnik();

  message: string = '';
  tipKartice: string = '';

  profilna_slika: string = ''; // ime fajla, ne ceo path
  dodatFajl: File | null = null; //fajl
  previewSlike: string | ArrayBuffer | null = null;
  validnaSlika: boolean = false;
  //loading: boolean = false;

  register() {
    // Proveriti validnost unetih podataka
    if (!this.proveraUneitihPodataka()) return;

    this.korisnik.status = 'ceka odobrenje';
    this.korisnikServis
      .register({
        ...this.korisnik,
        profilnaSlika: this.dodatFajl,
        defaultImage: !this.dodatFajl,
      })
      .subscribe({
        next: (res) => {
          if (res.message === 'Korisnik uspešno registrovan.') this.router.navigate([]);
          else this.message = res.message || 'Greška prilikom registracije.';
        },
        error: (err) => (this.message = err.message || 'Greška na serveru.'),
      });
  }

  goBack() {
    this.router.navigate(['']);
  }

  proveraUneitihPodataka(): boolean {
    if (
      this.korisnik.korisnicko_ime.trim() === '' ||
      this.korisnik.lozinka.trim() === '' ||
      this.korisnik.ime.trim() === '' ||
      this.korisnik.prezime.trim() === '' ||
      this.korisnik.pol.trim() === '' ||
      this.korisnik.adresa.trim() === '' ||
      this.korisnik.kontakt_telefon.trim() === '' ||
      this.korisnik.email.trim() === ''
      // || this.korisnik.broj_kreditne_kartice.trim() === ''
    ) {
      this.message = 'Sva polja su obavezna!';
      this.tipKartice = '';
      return false;
    }

    if (this.korisnik.tip === 'turista') {
      if (this.korisnik.broj_kreditne_kartice.trim() === '') {
        this.message = 'Broj kreditne kartice je obavezan za turiste.';
        this.tipKartice = '';
        return false;
      }
    }

    // Provera lozinke
    const pwdRegex =
      /^(?=.{6,10}$)(?=.*[A-Z])(?=(?:.*[a-z]){3,})(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z].*$/;
    if (!pwdRegex.test(this.korisnik.lozinka)) {
      this.message =
        'Lozinka nije validna. Mora imati 6-10 karaktera, počinjati slovom, sadržati bar jedno veliko slovo, tri mala slova, jedan broj i jedan specijalni karakter.';
      this.tipKartice = '';
      return false;
    }

    if(this.korisnik.kontakt_telefon.length < 9 || this.korisnik.kontakt_telefon.length > 10) {
      this.message = 'Kontakt telefon mora imati 9/10 cifara.';
      return false;
    }

    if (this.korisnik.tip === 'turista') {
      return this.checkCardType();
    } else {
      this.korisnik.broj_kreditne_kartice = '';
      this.tipKartice = '';
      this.message = '';
      return true;
    }
  }

  checkCardType(): boolean {
    // Brisanje razmaka i crtica
    const digits = this.korisnik.broj_kreditne_kartice.replace(/\D/g, '');

    const dinersPrefixes = ['300', '301', '302', '303', '36', '38'];
    const visaPrefixes = [
      '4539',
      '4556',
      '4916',
      '4532',
      '4929',
      '4485',
      '4716',
    ];
    const masterCardPrefixes = ['51', '52', '53', '54', '55'];

    // Diners
    if (
      digits.length === 15 &&
      dinersPrefixes.some((p) => digits.startsWith(p))
    ) {
      this.tipKartice = 'Diners';
      this.message = '';
      return true;
    }

    // MasterCard
    else if (
      digits.length === 16 &&
      masterCardPrefixes.some((p) => digits.startsWith(p))
    ) {
      this.tipKartice = 'MasterCard';
      this.message = '';
      return true;
    }

    // Visa
    else if (
      digits.length === 16 &&
      visaPrefixes.some((p) => digits.startsWith(p))
    ) {
      this.tipKartice = 'Visa';
      this.message = '';
      return true;
    } else {
      this.tipKartice = '';
      this.message = 'Neispravan broj kreditne kartice.';
      return false;
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0] ?? null;
    if (!file) {
      this.dodatFajl = null;
      this.previewSlike = null;
      this.message = '';
      this.validnaSlika = false;
      return;
    }

    // Provera tipa
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      this.message = 'Dozvoljeni formati: JPG i PNG.';
      this.dodatFajl = null;
      this.previewSlike = null;
      this.validnaSlika = false;
      return;
    }

    // Provera veličine
    if (file.size > 4 * 1024 * 1024) {
      this.message = 'Maksimalna veličina fajla je 4MB.';
      this.dodatFajl = null;
      this.previewSlike = null;
      this.validnaSlika = false;
      return;
    }

    // Provera dimenzije
    const reader = new FileReader();
    const img = new Image();
    reader.onload = () => {
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        if (w < 100 || h < 100 || w > 300 || h > 300) {
          this.message =
            'Dimenzije slike moraju biti između 100x100 i 300x300 px.';
          this.dodatFajl = null;
          this.previewSlike = null;
          this.validnaSlika = false;
          return;
        }
        // OK -> keep file locally for upload on register click
        this.dodatFajl = file;
        this.profilna_slika = file.name;
        this.previewSlike = reader.result;
        this.validnaSlika = true;
        this.message = '';
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeSelectedFile() {
    this.dodatFajl = null;
    this.previewSlike = null;
    this.message = '';
    this.validnaSlika = false;
  }
}
