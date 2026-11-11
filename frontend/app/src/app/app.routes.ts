import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { TuristaComponent } from './turista/turista.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { RegisterComponent } from './register/register.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { HomePageComponent } from './home-page/home-page.component';
import { TuristaProfilComponent } from './turista-profil/turista-profil.component';
import { TuristaRezervacijeComponent } from './turista-rezervacije/turista-rezervacije.component';
import { TuristaVikendiceComponent } from './turista-vikendice/turista-vikendice.component';
import { TuristaVikendiceDetaljnoComponent } from './turista-vikendice-detaljno/turista-vikendice-detaljno.component';
import { AdminListaKorisnikaComponent } from './admin-lista-korisnika/admin-lista-korisnika.component';
import { AdminZahteviComponent } from './admin-zahtevi/admin-zahtevi.component';
import { AdminAzuriranjeKorisnikaComponent } from './admin-azuriranje-korisnika/admin-azuriranje-korisnika.component';
import { VlasnikProfilComponent } from './vlasnik-profil/vlasnik-profil.component';
import { VlasnikRezervacijeComponent } from './vlasnik-rezervacije/vlasnik-rezervacije.component';
import { VlasnikMojeVikendiceComponent } from './vlasnik-moje-vikendice/vlasnik-moje-vikendice.component';
import { VlasnikStatistikaComponent } from './vlasnik-statistika/vlasnik-statistika.component';
import { VlasnikUrediVikendicuComponent } from './vlasnik-uredi-vikendicu/vlasnik-uredi-vikendicu.component';
import { VlasnikDodajVikendicuComponent } from './vlasnik-dodaj-vikendicu/vlasnik-dodaj-vikendicu.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'adminLogin', component: AdminLoginComponent },
  { path: 'promenaLozinke', component: PromenaLozinkeComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'listaKorisnika', pathMatch: 'full' },
      { path: 'listaKorisnika', component: AdminListaKorisnikaComponent },
      { path: 'zahtevi', component: AdminZahteviComponent },
      { path: 'azurirajKorisnika', component: AdminAzuriranjeKorisnikaComponent }
    ],
  },
  { path: 'vlasnik', component: VlasnikComponent, children : [
    { path: '', redirectTo: 'profil', pathMatch: 'full' },
    { path: 'profil', component: VlasnikProfilComponent },
    { path: 'rezervacije', component: VlasnikRezervacijeComponent },
    { path: 'mojeVikendice', component: VlasnikMojeVikendiceComponent },
    { path: 'statistika', component: VlasnikStatistikaComponent },
    { path: 'urediVikendicu', component: VlasnikUrediVikendicuComponent },
    { path: 'dodajVikendicu', component: VlasnikDodajVikendicuComponent }
  ]},
  {
    path: 'turista',
    component: TuristaComponent,
    children: [
      { path: '', redirectTo: 'profil', pathMatch: 'full' },
      { path: 'profil', component: TuristaProfilComponent },
      { path: 'rezervacije', component: TuristaRezervacijeComponent },
      { path: 'vikendice', component: TuristaVikendiceComponent },
    ],
  },
  { path: 'vikendiceDetaljno', component: TuristaVikendiceDetaljnoComponent },
];
