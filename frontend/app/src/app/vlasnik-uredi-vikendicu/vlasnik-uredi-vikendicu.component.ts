import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VikendicaService } from '../services/vikendica.service';
import Vikendica from '../models/vikendica';

@Component({
  selector: 'app-vlasnik-uredi-vikendicu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vlasnik-uredi-vikendicu.component.html',
  styleUrl: './vlasnik-uredi-vikendicu.component.css'
})
export class VlasnikUrediVikendicuComponent {

  private router = inject(Router);
  private vikendicaServis = inject(VikendicaService);

  vikendicaZaIzmenu: Vikendica = new Vikendica();
  odabraneSlike: File[] = [];
  previewSlike: string[] = [];
  postojeceSlike: string[] = [];
  message: string = '';

  ngOnInit() {
    let x = localStorage.getItem('vikendicaZaIzmenu');
    if (x) {
      this.vikendicaZaIzmenu = JSON.parse(x);
      // Sačuvaj postojeće slike
      if (this.vikendicaZaIzmenu.slike && this.vikendicaZaIzmenu.slike.length > 0) {
        this.postojeceSlike = [...this.vikendicaZaIzmenu.slike];
      }
    } else {
      // Ako nema podataka, vrati na moje vikendice
      this.router.navigate(['/vlasnik/mojeVikendice']);
    }
  }

  onSlikeSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    // Validacija - maksimalno 5 slika ukupno (postojeće + nove)
    if (this.postojeceSlike.length + this.odabraneSlike.length + files.length > 5) {
      this.message = 'Možete imati maksimalno 5 slika ukupno.';
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validacija tipa
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        this.message = 'Dozvoljeni formati: JPG i PNG.';
        return;
      }

      // Validacija veličine (max 2MB po slici)
      if (file.size > 2 * 1024 * 1024) {
        this.message = 'Maksimalna veličina slike je 2MB.';
        return;
      }

      this.odabraneSlike.push(file);

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewSlike.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    this.message = '';
    // Resetuj input
    event.target.value = '';
  }

  ukloniNovuSliku(index: number) {
    this.odabraneSlike.splice(index, 1);
    this.previewSlike.splice(index, 1);
  }

  ukloniPostojecuSliku(index: number) {
    this.postojeceSlike.splice(index, 1);
  }

  validiraj(): boolean {
    if (!this.vikendicaZaIzmenu.naziv?.trim()) {
      this.message = 'Naziv je obavezan.';
      return false;
    }
    if (!this.vikendicaZaIzmenu.mesto?.trim()) {
      this.message = 'Mesto je obavezno.';
      return false;
    }
    if (!this.vikendicaZaIzmenu.telefon?.trim()) {
      this.message = 'Telefon je obavezan.';
      return false;
    }
    if (!this.vikendicaZaIzmenu.cena_leto || this.vikendicaZaIzmenu.cena_leto <= 0) {
      this.message = 'Cena za leto mora biti veća od 0.';
      return false;
    }
    if (!this.vikendicaZaIzmenu.cena_zima || this.vikendicaZaIzmenu.cena_zima <= 0) {
      this.message = 'Cena za zimu mora biti veća od 0.';
      return false;
    }
    if (this.postojeceSlike.length === 0 && this.odabraneSlike.length === 0) {
      this.message = 'Vikendica mora imati bar jednu sliku.';
      return false;
    }

    this.message = '';
    return true;
  }

  azurirajVikendicu() {
    if (!this.validiraj()) return;

    // Ako ima novih slika, dodaj ih
    if (this.odabraneSlike.length > 0) {
      this.vikendicaZaIzmenu.slike = this.postojeceSlike;
    } else {
      // Samo ažuriraj postojeće slike
      this.vikendicaZaIzmenu.slike = this.postojeceSlike;
    }

    const data = {
      ...this.vikendicaZaIzmenu,
      slike: this.odabraneSlike.length > 0 ? this.odabraneSlike : undefined
    };

    this.vikendicaServis.azurirajVikendicu(data).subscribe({
      next: (res) => {
        //alert('Vikendica uspešno ažurirana!');
        localStorage.removeItem('vikendicaZaIzmenu');
        this.router.navigate(['/vlasnik/mojeVikendice']);
      },
      error: (err) => {
        console.error('Greška prilikom ažuriranja vikendice:', err);
        this.message = 'Greška pri ažuriranju vikendice.';
      }
    });
  }

  otkazi() {
    localStorage.removeItem('vikendicaZaIzmenu');
    this.router.navigate(['/vlasnik/mojeVikendice']);
  }
}
