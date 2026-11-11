export default class Rezervacija {
  _id?: string = '';
  vikendicaId: string = '';
  turistaId: string = '';
  nazivVikendice: string = '';
  mestoVikendice: string = '';
  imeTuriste: string = '';
  datumPocetka: Date = new Date();
  datumKraja: Date = new Date();
  brojOdraslih: number = 1;
  brojDece: number = 0;
  ukupnaCena: number = 0;
  specijalniZahtevi: string = '';
  status: string = 'naCekanju';
  karticaZaPlacanje: string = '';
  brojNocenja: number = 1;
  datumKreiranja?: Date;
  razlogOtkazivanja?: string = '';
  razlogOdbijanja?: string = '';
  ocena: number = 0;
  komentar: string = '';
  moguceOtkazati: boolean = true;

  vikendica?: {
    naziv: string;
    mesto: string;
    slike: string[];
    cena_leto: number;
    cena_zima: number;
  };

  turista?: {
    ime: string;
    prezime: string;
    email: string;
    kontakt_telefon: string;
  };

  // Helper metoda za izračunavanje cene
  static izracunajCenu(
    datumPocetka: Date,
    datumKraja: Date,
    cenaLeto: number,
    cenaZima: number
  ): { ukupnaCena: number; brojNocenja: number } {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const pocetakMs = new Date(datumPocetka).getTime();
    const krajMs = new Date(datumKraja).getTime();
    const brojNocenja = Math.round((krajMs - pocetakMs) / MS_PER_DAY);

    let ukupnaCena = 0;
    let trenutniDatum = new Date(datumPocetka);

    // Prolazi kroz svaki dan i dodaje odgovarajuću cenu
    for (let i = 0; i < brojNocenja; i++) {
      const mesec = trenutniDatum.getMonth() + 1;
      const cena = mesec >= 5 && mesec <= 8 ? cenaLeto : cenaZima;
      ukupnaCena += cena;
      trenutniDatum.setDate(trenutniDatum.getDate() + 1);
    }

    return { ukupnaCena, brojNocenja };
  }
}
