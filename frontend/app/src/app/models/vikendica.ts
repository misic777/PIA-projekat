import Rezervacija from './rezervacija';
import Recenzija from './recenzija';

export default class Vikendica {
  _id?: string = '';
  naziv: string = '';
  mesto: string = '';
  vlasnikId?: string = '';
  opis: string = '';
  usluge: string = '';
  telefon: string = '';
  koordinate?: {
    latitude: number;
    longitude: number;
  };
  slike: string[] = [];
  maksGosti: number = 0;
  status: string = 'aktivna';
  blokiranaDo?: Date;
  datumKreiranja?: Date;
  cena_leto: number = 0;
  cena_zima: number = 0;
  ocene: Recenzija[] = [];
  rezervacije: Rezervacija[] = [];

  // Computed property za prosečnu ocenu
  get prosecna_ocena(): number {
    if (this.ocene.length === 0) return 0;
    const suma = this.ocene.reduce((acc, o) => acc + o.ocena, 0);
    return Number((suma / this.ocene.length).toFixed(1));
  }

  // Helper metoda za dobijanje cene po sezoni
  getCenaZaDatum(datum: Date): number {
    const mesec = datum.getMonth() + 1; // 1-12
    // Maj (5), Jun (6), Jul (7), Avgust (8)
    return mesec >= 5 && mesec <= 8 ? this.cena_leto : this.cena_zima;
  }

  get cenaDanas(): number {
    return this.getCenaZaDatum(new Date());
  }

  // Helper metoda za opis sezone
  getSezonaZaDatum(datum: Date): string {
    const mesec = datum.getMonth() + 1;
    return mesec >= 5 && mesec <= 8 ? 'leto' : 'zima';
  }
}
