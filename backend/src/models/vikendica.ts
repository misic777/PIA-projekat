import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Vikendica = new Schema({
  naziv: {
    type: String,
    required: true,
  },
  mesto: {
    type: String,
    required: true,
  },
  vlasnikId: {
    type: Schema.Types.ObjectId,
    ref: "Korisnik",
  },
  opis: {
    type: String,
  },
  usluge: {
    type: String,
  },
  telefon: {
    type: String,
  },
  koordinate: {
    latitude: Number,
    longitude: Number,
  },
  slike: [{ type: String }],
  maksGosti: {
    type: Number,
  },
  status: {
    type: String,
    default: "aktivna",
  },
  blokiranaDo: {
    type: Date,
  },
  datumKreiranja: {
    type: Date,
    default: Date.now,
  },
  cena_zima: {
    type: Number,
    required: true,
  },
  cena_leto: {
    type: Number,
    required: true,
  },
  ocene: [
    {
      ocena: Number,
      komentar: String,
      turista: String,
      datum: Date,
    },
  ],
  rezervacije: [
    {
      datum: String,
      turista: String,
      broj_nocenja: Number,
      prihvacena: Boolean,
      komentar: String,
    },
  ],
});

export default mongoose.model("Vikendica", Vikendica, "vikendice");
