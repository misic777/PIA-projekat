import { Component, inject } from '@angular/core';
import { VikendicaService } from '../services/vikendica.service';
import { Router } from '@angular/router';
import Vikendica from '../models/vikendica';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Korisnik from '../models/korisnik';

@Component({
  selector: 'app-vlasnik-dodaj-vikendicu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vlasnik-dodaj-vikendicu.component.html',
  styleUrl: './vlasnik-dodaj-vikendicu.component.css'
})
export class VlasnikDodajVikendicuComponent {

  private router = inject(Router);
  private vikendicaServis = inject(VikendicaService);

  vlasnik: Korisnik = new Korisnik();
  novaVikendica: Vikendica = new Vikendica();
  odabraneSlike: File[] = [];
  previewSlike: string[] = [];
  message: string = '';

  ngOnInit() {
    let x = localStorage.getItem('ulogovan');
    if (x) {
      this.vlasnik = JSON.parse(x);
      this.novaVikendica.vlasnikId = this.vlasnik._id;
    }
  }

  onSlikeSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    // Validacija - maksimalno 5 slika
    if (files.length > 5) {
      this.message = 'Možete odabrati maksimalno 5 slika.';
      return;
    }

    this.odabraneSlike = [];
    this.previewSlike = [];

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
  }

  ukloniSliku(index: number) {
    this.odabraneSlike.splice(index, 1);
    this.previewSlike.splice(index, 1);
  }

  validiraj(): boolean {
    if (!this.novaVikendica.naziv?.trim()) {
      this.message = 'Naziv je obavezan.';
      return false;
    }
    if (!this.novaVikendica.mesto?.trim()) {
      this.message = 'Mesto je obavezno.';
      return false;
    }
    if (!this.novaVikendica.telefon?.trim()) {
      this.message = 'Telefon je obavezan.';
      return false;
    }
    if (!this.novaVikendica.cena_leto || this.novaVikendica.cena_leto <= 0) {
      this.message = 'Cena za leto mora biti veća od 0.';
      return false;
    }
    if (!this.novaVikendica.cena_zima || this.novaVikendica.cena_zima <= 0) {
      this.message = 'Cena za zimu mora biti veća od 0.';
      return false;
    }
    if (this.odabraneSlike.length === 0) {
      this.message = 'Morate odabrati bar jednu sliku.';
      return false;
    }

    this.message = '';
    return true;
  }

  dodajVikendicu() {
    if (!this.validiraj()) return;

    const data = {
      ...this.novaVikendica,
      slike: this.odabraneSlike
    };

    this.vikendicaServis.dodajVikendicu(data).subscribe({
      next: (res) => {
        //alert('Vikendica uspešno dodata!');
        this.router.navigate(['/vlasnik/mojeVikendice']);
      },
      error: (err) => {
        console.error('Greška prilikom dodavanja vikendice:', err);
        this.message = 'Greška pri dodavanju vikendice.';
      }
    });
  }

  otkazi() {
    this.router.navigate(['/vlasnik/mojeVikendice']);
  }
}
