import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';
import Korisnik from '../models/korisnik'

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  private router = inject(Router);
  private korisnikServis = inject(KorisnikService)
  
  ulogovanAdmin : Korisnik = new Korisnik();
  sviKorisnici : Korisnik[] = [];
  aktivni : Korisnik[] = [];
  naCekanju : Korisnik[] = [];
  zamenjenKorisnik : Korisnik = new Korisnik();

  ngOnInit(){
    let x = localStorage.getItem('ulogovanAdmin');
    if(x){
      this.ulogovanAdmin = JSON.parse(x);
      this.korisnikServis.dohvatiKorisnike().subscribe(korisnici =>{
        this.sviKorisnici = korisnici;
        this.aktivni = this.sviKorisnici.filter(k => k.status === 'aktivan');
        this.naCekanju = this.sviKorisnici.filter(k => k.status === 'ceka odobrenje');
      });
    }
  }
  
  logout(){
    localStorage.removeItem('ulogovanAdmin');
    this.router.navigate(['']);
  }

  navigateTo(path: string){
    this.korisnikServis.dohvatiKorisnike().subscribe(korisnici =>{
        this.sviKorisnici = korisnici;
        this.aktivni = this.sviKorisnici.filter(k => k.status === 'aktivan' && k.tip !== 'admin');
        this.naCekanju = this.sviKorisnici.filter(k => k.status === 'ceka odobrenje');
      });
    if(path == "admin/zahtevi"){
      localStorage.setItem('naCekanjuKorisnici', JSON.stringify(this.naCekanju));
    }
    else if(path == "admin/listaKorisnika"){
      
      localStorage.setItem('aktivniKorisnici', JSON.stringify(this.aktivni));
    }
    this.router.navigate([path]);
  }

}
