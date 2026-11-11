export default class Korisnik {
  _id?: string = '';
  korisnicko_ime: string = '';
  lozinka: string = '';
  tip: string = '';
  ime: string = '';
  prezime: string = '';
  pol: string = '';
  adresa: string = '';
  kontakt_telefon: string = '';
  email: string = '';
  profilna_slika: string = '';
  broj_kreditne_kartice: string = '';
  status: string = '';
  datum_registracije: Date = new Date();
  agencija: string = '';
  
  // UI helper polja (ne šalju se na backend)
  prikazOdbijanje?: boolean = false;
  razlogOdbijanja?: string = '';
  prikazAzuriranje?: boolean = false;
  dodatFajl?: File;
  previewSlike?: string | ArrayBuffer | null;
  message?: string = '';
}
