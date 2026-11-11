import { inject, Injectable } from '@angular/core';
import Korisnik from '../models/korisnik';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KorisnikService {
  constructor() {}

  private url = 'http://localhost:4000/korisnik';
  private http = inject(HttpClient);

  private korisnici: Korisnik[] = [];

  login(korisnicko_ime: string, lozinka: string) {
    const data = {
      korisnicko_ime: korisnicko_ime,
      lozinka: lozinka,
    };
    return this.http.post<Korisnik>(`${this.url}/login`, data);
  }

  register(data: any): Observable<any> {
    const formData = new FormData();

    const { profilnaSlika, defaultImage, ...korisnikData } = data;

    formData.append('korisnik', JSON.stringify(korisnikData));

    if (profilnaSlika && profilnaSlika instanceof File) {
      formData.append('profilnaSlika', profilnaSlika);
    }
    return this.http.post(`${this.url}/register`, formData);
  }

  dohvatiKorisnike() {
    return this.http.get<Korisnik[]>(`${this.url}/dohvatiKorisnike`);
  }

  promeniLozinku(korisnicko_ime: string, novaLozinka: string) {
    const data = {
      korisnicko_ime: korisnicko_ime,
      novaLozinka: novaLozinka,
    };
    return this.http.post<boolean>(`${this.url}/promenaLozinke`, data);
  }

  sacuvajSliku(formData: FormData) {
    return this.http.post<{ filename: string }>(
      `${this.url}/sacuvajSliku`,
      formData
    );
  }

  azurirajKorisnika(data: any): Observable<any> {
    const formData = new FormData();

    const { profilnaSlika, ...korisnikData } = data;

    formData.append('korisnik', JSON.stringify(korisnikData));

    if (profilnaSlika && profilnaSlika instanceof File) {
      formData.append('profilnaSlika', profilnaSlika);
    }

    return this.http.post(`${this.url}/azurirajKorisnika`, formData);
  }

  deaktivirajKorisnika(id: string) {
    return this.http.post(`${this.url}/deaktivirajKorisnika`, { id });
  }

  prihvatiZahtev(id: string) {
    return this.http.post(`${this.url}/prihvatiZahtev`, { id });
  }

  odbijZahtev(id: string, razlog: string) {
    return this.http.post(`${this.url}/odbijZahtev`, { id, razlog });
  }
}
