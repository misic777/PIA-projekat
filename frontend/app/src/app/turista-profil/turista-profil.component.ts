import { Component, inject } from '@angular/core';
import Korisnik from '../models/korisnik';
import { FormsModule } from '@angular/forms';
import { KorisnikService } from '../services/korisnik.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turista-profil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './turista-profil.component.html',
  styleUrl: './turista-profil.component.css',
})
export class TuristaProfilComponent {
  private korisnikService = inject(KorisnikService);

  ulogovan: Korisnik = new Korisnik();
  azuriranje: boolean = false;
  tipKartice: string = '';

  dodatFajl: File | null = null;
  previewSlike: string | ArrayBuffer | null = null;
  message: string = '';

  ngOnInit() {
    let x = localStorage.getItem('ulogovan');
    if (x) {
      this.ulogovan = JSON.parse(x);
    }
    this.checkCardType();
  }

  azurirajPodatke() {
    if (!this.azuriranje) {
      this.azuriranje = true;
      return;
    }

    // Validacija
    if (!this.proveraUnetihPodataka()) {
      return;
    }

    // Slanje na backend
    this.korisnikService
      .azurirajKorisnika({
        ...this.ulogovan,
        profilnaSlika: this.dodatFajl,
      })
      .subscribe({
        next: (res) => {
          if (res.message === 'Korisnik uspešno ažuriran.') {
            this.ulogovan = res.korisnik;
            localStorage.setItem('ulogovan', JSON.stringify(res.korisnik));
            this.message = '';
            this.azuriranje = false;
            this.dodatFajl = null;
            this.previewSlike = null;
          } else {
            this.message = res.message || 'Greška prilikom ažuriranja.';
          }
        },
        error: (err) => {
          this.message = 'Greška prilikom ažuriranja.';
          console.error(err);
        },
      });
  }

  proveraUnetihPodataka(): boolean {
    if (
      this.ulogovan.ime.trim() === '' ||
      this.ulogovan.prezime.trim() === '' ||
      this.ulogovan.adresa.trim() === '' ||
      this.ulogovan.kontakt_telefon.trim() === '' ||
      this.ulogovan.email.trim() === '' ||
      this.ulogovan.broj_kreditne_kartice.trim() === ''
    ) {
      this.message = 'Sva polja su obavezna!';
      return false;
    }

    if(this.ulogovan.kontakt_telefon.trim().length < 9 || this.ulogovan.kontakt_telefon.trim().length > 10) {
      this.message = 'Kontakt telefon mora imati 9/10 cifara.';
      return false;
    }

    this.message = '';
    return this.checkCardType();
  }

  checkCardType(): boolean {
    // Brisanje razmaka i crtica
    const digits = this.ulogovan.broj_kreditne_kartice.replace(/\D/g, '');

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
      return;
    }

    // Provera tipa
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      this.message = 'Dozvoljeni formati: JPG i PNG.';
      this.dodatFajl = null;
      this.previewSlike = null;
      return;
    }

    // Provera veličine
    if (file.size > 4 * 1024 * 1024) {
      this.message = 'Maksimalna veličina fajla je 4MB.';
      this.dodatFajl = null;
      this.previewSlike = null;
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
          return;
        }

        this.dodatFajl = file;
        this.previewSlike = reader.result;
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
  }

  odustani() {
    this.azuriranje = false;
    this.dodatFajl = null;
    this.previewSlike = null;
    this.message = '';
    // Resetuj podatke na originalne
    let x = localStorage.getItem('ulogovan');
    if (x) {
      this.ulogovan = JSON.parse(x);
    }
  }
}
