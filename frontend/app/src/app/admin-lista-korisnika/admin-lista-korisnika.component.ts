import { Component, inject } from '@angular/core';
import Korisnik from '../models/korisnik';
import { FormsModule } from '@angular/forms';
import { KorisnikService } from '../services/korisnik.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-azuriraj-korisnike',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-lista-korisnika.component.html',
  styleUrl: './admin-lista-korisnika.component.css'
})
export class AdminListaKorisnikaComponent {

  private router = inject(Router);
  private korisnikService = inject(KorisnikService);

  aktivniKorisnici : Korisnik[] = [];
  //zasebna stranica ovde smao lista korisnika sa mogucnoscu azuriranja
  //klikom na azuriranje vodi na stranicu koja je kao profil i na kojoj se azurira korisnik, sve je isto kao i u 
  //turista profil kad je azuriranje = true

  ngOnInit() {
    let x = localStorage.getItem('aktivniKorisnici');
    if (x) {
      this.aktivniKorisnici = JSON.parse(x);
    }
  }

  azurirajKorisnika(korisnik: Korisnik){
    let x = localStorage.getItem('korisnikZaAzuriranje');
    if(x){
      korisnik = JSON.parse(x);
    }
    localStorage.setItem("korisnikZaAzuriranje", JSON.stringify(korisnik));
    this.router.navigate(['admin/azurirajKorisnika']);
  }

  deaktivirajKorisnika(korisnikId? : string){
    this.korisnikService.deaktivirajKorisnika(korisnikId!).subscribe({
      next: (response) => {
        console.log('Korisnik deaktiviran', response);
        this.aktivniKorisnici = this.aktivniKorisnici.filter(k => k._id !== korisnikId);
        localStorage.setItem('aktivniKorisnici', JSON.stringify(this.aktivniKorisnici));
      },
      error: (error) => {
        console.error('Greska prilikom deaktivacije korisnika', error);
      }
    });
  }

  
}
