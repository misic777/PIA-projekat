import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Rezervacija from '../models/rezervacija';

@Injectable({
  providedIn: 'root',
})
export class RezervacijaService {
  constructor() {}

  private url = 'http://localhost:4000/rezervacija';
  private http = inject(HttpClient);

  dohvatiRezervacije(): Observable<Rezervacija[]> {
    return this.http.get<Rezervacija[]>(`${this.url}/dohvatiRezervacije`);
  }

  dohvatiRezervacijeZaTuristu(turistaId?: string): Observable<Rezervacija[]> {
    return this.http.get<Rezervacija[]>(`${this.url}/turista/${turistaId}`);
  }

  dohvatiRezervacijeZaVikendicu(
    vikendicaId?: string
  ): Observable<Rezervacija[]> {
    return this.http.get<Rezervacija[]>(`${this.url}/vikendica/${vikendicaId}`);
  }

  dohvatiVlasnikoveRezervacije(vlasnikId?: string) {
    return this.http.get<any[]>(`${this.url}/dohvatiVlasnikoveRezervacije/${vlasnikId}`);
  }

  dohvatiAktivneRezervacije(turistaId?: string): Observable<Rezervacija[]> {
    return this.http.get<Rezervacija[]>(`${this.url}/aktivne/${turistaId}`);
  }

  dohvatiIstoriju(turistaId?: string): Observable<Rezervacija[]> {
    return this.http.get<Rezervacija[]>(`${this.url}/istorija/${turistaId}`);
  }

  kreirajRezervaciju(rezervacijaData: any): Observable<any> {
    return this.http.post(`${this.url}/kreiraj`, rezervacijaData);
  }

  prihvatiRezervaciju(id: string) {
    return this.http.put(`${this.url}/potvrdi/${id}`, {});
  }

  odbijRezervaciju(id: string, razlogOdbijanja: string) {
    return this.http.put(`${this.url}/odbij/${id}`, { razlogOdbijanja });
  }

  otkaziRezervaciju(
    rezervacijaId: string,
    razlogOtkazivanja: string
  ): Observable<any> {
    return this.http.put(`${this.url}/otkazi/${rezervacijaId}`, {
      razlogOtkazivanja,
    });
  }

  dodajRecenziju(
    rezervacijaId: string,
    ocena: number,
    komentar: string
  ): Observable<any> {
    return this.http.put(`${this.url}/recenzija/${rezervacijaId}`, {
      ocena,
      komentar,
    });
  }

  dohvatiStatistiku(): Observable<{
    rezervacije24h: number;
    rezervacije7d: number;
    rezervacije30d: number;
  }> {
    return this.http.get<{
      rezervacije24h: number;
      rezervacije7d: number;
      rezervacije30d: number;
    }>(`${this.url}/statistika`);
  }
}
