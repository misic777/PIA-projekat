import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Vikendica from '../models/vikendica';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VikendicaService {
  constructor() {}

  private url = 'http://localhost:4000/vikendica';
  private http = inject(HttpClient);

  dohvatiVikendice() {
    return this.http.get<Vikendica[]>(`${this.url}/dohvatiVikendice`);
  }

  dohvatiVikendiceZaVlasnika(vlasnikId?: string) {
    return this.http.get<Vikendica[]>(`${this.url}/dohvatiVikendiceZaVlasnika/${vlasnikId}`);
  }

  dodajVikendicu(data: any): Observable<any> {
    const formData = new FormData();

    const { slike, ...vikendicaData } = data;

    formData.append('vikendica', JSON.stringify(vikendicaData));

    if (slike && slike.length > 0) {
      for (let slika of slike) {
        formData.append('slike', slika);
      }
    }

    return this.http.post(`${this.url}/dodajVikendicu`, formData);
  }

  azurirajVikendicu(data: any): Observable<any> {
    const formData = new FormData();

    const { slike, ...vikendicaData } = data;

    formData.append('vikendica', JSON.stringify(vikendicaData));

    if (slike && slike.length > 0) {
      for (let slika of slike) {
        formData.append('slike', slika);
      }
    }

    return this.http.post(`${this.url}/azurirajVikendicu`, formData);
  }

  obrisiVikendicu(vikendicaId?: string) {
    return this.http.post<{ message: string }>(`${this.url}/obrisiVikendicu`, { id: vikendicaId });
  }
}
