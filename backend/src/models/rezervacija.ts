import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Rezervacija = new Schema({
  vikendicaId: {
    type: Schema.Types.ObjectId,
    ref: "Vikendica",
    required: true,
  },
  turistaId: {
    type: Schema.Types.ObjectId,
    ref: "Korisnik",
    required: true,
  },
  nazivVikendice: {
    type: String,
    required: true,
  },
  mestoVikendice: {
    type: String,
    required: true,
  },
  imeTuriste: {
    type: String,
    required: true,
  },
  datumPocetka: {
    type: Date,
    required: true,
  },
  datumKraja: {
    type: Date,
    required: true,
  },
  brojOdraslih: {
    type: Number,
    required: true,
    min: 1,
  },
  brojDece: {
    type: Number,
    default: 0,
  },
  ukupnaCena: {
    type: Number,
    required: true,
  },
  specijalniZahtevi: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "naCekanju",
  },
  karticaZaPlacanje: {
    type: String,
    required: true,
  },
  brojNocenja: {
    type: Number,
    required: true,
  },
  datumKreiranja: {
    type: Date,
    default: Date.now,
  },
  razlogOtkazivanja: {
    type: String,
  },
  razlogOdbijanja: {
    type: String,
  },
  ocena: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  komentar: {
    type: String,
    default: "",
  },
  moguceOtkazati: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Rezervacija", Rezervacija, "rezervacije");
