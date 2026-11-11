import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VikendicaService } from '../services/vikendica.service';
import Vikendica from '../models/vikendica';
import { Router } from '@angular/router';

@Component({
  selector: 'app-turista-vikendice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turista-vikendice.component.html',
  styleUrl: './turista-vikendice.component.css',
})
export class TuristaVikendiceComponent implements OnInit {
  private router = inject(Router);
  private vikendicaService = inject(VikendicaService);

  vikendice: Vikendica[] = [];
  prikazaneVikendice: Vikendica[] = [];

  pretragaNaziv: string = '';
  pretragaMesto: string = '';
  sortiranje: string = 'naziv-asc';

  ngOnInit() {
    this.ucitajVikendice();
  }

  ucitajVikendice() {
    this.vikendicaService.dohvatiVikendice().subscribe({
      next: (data) => {
        this.vikendice = data;
        this.prikazaneVikendice = data;
        this.sortirajVikendice();
      },
      error: (err) => {
        console.error('Greška pri učitavanju vikendica:', err);
      },
    });
  }

  pretraziVikendice() {
    this.prikazaneVikendice = this.vikendice.filter((vikendica) => {
      const nazivMatch = vikendica.naziv
        .toLowerCase()
        .includes(this.pretragaNaziv.toLowerCase());
      const mestoMatch = vikendica.mesto
        .toLowerCase()
        .includes(this.pretragaMesto.toLowerCase());
      return nazivMatch && mestoMatch;
    });
    this.sortirajVikendice();
  }

  sortirajVikendice() {
    switch (this.sortiranje) {
      case 'naziv-asc':
        this.prikazaneVikendice.sort((a, b) => a.naziv.localeCompare(b.naziv));
        break;
      case 'naziv-desc':
        this.prikazaneVikendice.sort((a, b) => b.naziv.localeCompare(a.naziv));
        break;
      case 'mesto-asc':
        this.prikazaneVikendice.sort((a, b) => a.mesto.localeCompare(b.mesto));
        break;
      case 'mesto-desc':
        this.prikazaneVikendice.sort((a, b) => b.mesto.localeCompare(a.mesto));
        break;
    }
  }

  goToDetails(v: Vikendica) {
    localStorage.setItem('vikendica', JSON.stringify(v));
    this.router.navigate(['vikendiceDetaljno']);
  }
}
