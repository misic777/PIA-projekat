import { Component, inject } from '@angular/core';
import Korisnik from '../models/korisnik';
import { FormsModule } from '@angular/forms';
import { KorisnikService } from '../services/korisnik.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vlasnik-profil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vlasnik-profil.component.html',
  styleUrl: './vlasnik-profil.component.css'
})
export class VlasnikProfilComponent {
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
        this.ulogovan.email.trim() === '' 
      ) {
        this.message = 'Sva polja su obavezna!';
        return false;
      }
      this.message = '';
      return true
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
