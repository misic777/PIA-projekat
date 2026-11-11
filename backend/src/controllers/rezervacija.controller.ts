import * as express from "express";
import Rezervacija from "../models/rezervacija";
import Vikendica from "../models/vikendica";

export class RezervacijaController {
  // Helper funkcija za izračunavanje cene
  private izracunajCenu(
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

    for (let i = 0; i < brojNocenja; i++) {
      const mesec = trenutniDatum.getMonth() + 1;
      const cena = mesec >= 5 && mesec <= 8 ? cenaLeto : cenaZima;
      ukupnaCena += cena;
      trenutniDatum.setDate(trenutniDatum.getDate() + 1);
    }

    return { ukupnaCena, brojNocenja };
  }

  // Dohvati sve rezervacije
  dohvatiRezervacije = (req: express.Request, res: express.Response) => {
    Rezervacija.find()
      .populate("vikendicaId", "naziv mesto slike cena_leto cena_zima")
      .populate("turistaId", "ime prezime email kontakt_telefon")
      .sort({ datumKreiranja: -1 })
      .then((rezervacije) => res.json(rezervacije))
      .catch((error) => res.status(500).json({ error: error.message }));
  };

  // Dohvati rezervacije za turista
  dohvatiRezervacijeZaTuristu = (
    req: express.Request,
    res: express.Response
  ) => {
    const turistaId = req.params.turistaId;

    Rezervacija.find({ turistaId: turistaId })
      .populate("vikendicaId", "naziv mesto slike cena_leto cena_zima")
      .sort({ datumKreiranja: -1 })
      .then((rezervacije) => res.json(rezervacije))
      .catch((error) => res.status(500).json({ error: error.message }));
  };

  // Dohvati rezervacije za vikendicu
  dohvatiRezervacijeZaVikendicu = (
    req: express.Request,
    res: express.Response
  ) => {
    const vikendicaId = req.params.vikendicaId;

    Rezervacija.find({ vikendicaId: vikendicaId })
      .populate("turistaId", "ime prezime email kontakt_telefon")
      .sort({ datumPocetka: 1 })
      .then((rezervacije) => res.json(rezervacije))
      .catch((error) => res.status(500).json({ error: error.message }));
  };

  // Dohvati aktivne rezervacije za turista
  dohvatiAktivneRezervacije = (req: express.Request, res: express.Response) => {
    const turistaId = req.params.turistaId;
    const danas = new Date();

    Rezervacija.find({
      turistaId: turistaId,
      status: { $in: ["naCekanju", "potvrdjena"] },
      datumKraja: { $gte: danas },
    })
      .populate("vikendicaId", "naziv mesto slike cena_leto cena_zima")
      .sort({ datumPocetka: 1 })
      .then((rezervacije) => res.json(rezervacije))
      .catch((error) => res.status(500).json({ error: error.message }));
  };

  // Dohvati istoriju rezervacija
  dohvatiIstoriju = (req: express.Request, res: express.Response) => {
    const turistaId = req.params.turistaId;

    Rezervacija.find({
      turistaId: turistaId,
      status: { $in: ["zavrsena", "otkazana", "odbijena"] },
    })
      .populate("vikendicaId", "naziv mesto slike cena_leto cena_zima")
      .sort({ datumKreiranja: -1 })
      .then((rezervacije) => res.json(rezervacije))
      .catch((error) => res.status(500).json({ error: error.message }));
  };

  // Kreiraj rezervaciju
  kreirajRezervaciju = async (req: express.Request, res: express.Response) => {
    try {
      const rezervacijaData = req.body;
      // Dohvati vikendicu za cene
      const vikendica = await Vikendica.findById(rezervacijaData.vikendicaId);
      if (!vikendica) {
        res.status(404).json({ message: "Vikendica nije pronađena." });
        return;
      }

      // Izračunaj cenu na osnovu sezone
      const { ukupnaCena, brojNocenja } = this.izracunajCenu(
        new Date(rezervacijaData.datumPocetka),
        new Date(rezervacijaData.datumKraja),
        vikendica.cena_leto,
        vikendica.cena_zima
      );

      // Proveri preklapanje rezervacija
      const preklapanje = await Rezervacija.findOne({
        vikendicaId: rezervacijaData.vikendicaId,
        status: { $in: ["potvrdjena", "naCekanju"] },
        $or: [
          {
            datumPocetka: {
              $lte: new Date(rezervacijaData.datumKraja),
            },
            datumKraja: {
              $gte: new Date(rezervacijaData.datumPocetka),
            },
          },
        ],
      });

      if (preklapanje) {
        res.status(400).json({
          message: "Vikendica je već rezervisana za traženi period.",
        });
        return;
      }

      const novaRezervacija = new Rezervacija({
        ...rezervacijaData,
        ukupnaCena,
        brojNocenja,
      });

      await novaRezervacija.save();

      res.json({
        message: "Rezervacija uspešno kreirana.",
        rezervacija: novaRezervacija,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Potvrdi rezervaciju
  potvrdiRezervaciju = async (req: express.Request, res: express.Response) => {
    try {
      const rezervacijaId = req.params.id;

      await Rezervacija.updateOne(
        { _id: rezervacijaId },
        { $set: { status: "potvrdjena" } }
      );

      res.json({ message: "Rezervacija uspešno potvrđena." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Odbij rezervaciju
  odbijRezervaciju = async (req: express.Request, res: express.Response) => {
    try {
      const rezervacijaId = req.params.id;
      const { razlogOdbijanja } = req.body;

      await Rezervacija.updateOne(
        { _id: rezervacijaId },
        { $set: { status: "odbijena", razlogOdbijanja } }
      );

      res.json({ message: "Rezervacija odbijena." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Otkaži rezervaciju
  otkaziRezervaciju = async (req: express.Request, res: express.Response) => {
    try {
      const rezervacijaId = req.params.id;
      const { razlogOtkazivanja } = req.body;

      const rezervacija = await Rezervacija.findById(rezervacijaId);

      if (!rezervacija) {
        res.status(404).json({ message: "Rezervacija nije pronađena." });
        return;
      }

      if (!rezervacija.moguceOtkazati) {
        res.status(400).json({
          message: "Rezervaciju nije više moguće otkazati.",
        });
        return;
      }

      await Rezervacija.updateOne(
        { _id: rezervacijaId },
        {
          $set: {
            status: "otkazana",
            razlogOtkazivanja,
            moguceOtkazati: false,
          },
        }
      );

      res.json({ message: "Rezervacija uspešno otkazana." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Dodaj recenziju
  dodajRecenziju = async (req: express.Request, res: express.Response) => {
    try {
      const rezervacijaId = req.params.id;
      const { ocena, komentar } = req.body;

      const rezervacija = await Rezervacija.findById(rezervacijaId);

      if (!rezervacija) {
        res.status(404).json({ message: "Rezervacija nije pronađena." });
        return;
      }

      if (rezervacija.status !== "zavrsena") {
        res.status(400).json({
          message: "Možete oceniti samo završene rezervacije.",
        });
        return;
      }

      await Rezervacija.updateOne(
        { _id: rezervacijaId },
        { $set: { ocena, komentar } }
      );

      res.json({ message: "Recenzija uspešno dodata." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Statistika rezervacija (za dashboard)
  dohvatiStatistiku = async (req: express.Request, res: express.Response) => {
    try {
      const danas = new Date();
      const pre24h = new Date(danas.getTime() - 24 * 60 * 60 * 1000);
      const pre7dana = new Date(danas.getTime() - 7 * 24 * 60 * 60 * 1000);
      const pre30dana = new Date(danas.getTime() - 30 * 24 * 60 * 60 * 1000);

      const rezervacije24h = await Rezervacija.countDocuments({
        datumKreiranja: { $gte: pre24h },
      });

      const rezervacije7d = await Rezervacija.countDocuments({
        datumKreiranja: { $gte: pre7dana },
      });

      const rezervacije30d = await Rezervacija.countDocuments({
        datumKreiranja: { $gte: pre30dana },
      });

      res.json({
        rezervacije24h,
        rezervacije7d,
        rezervacije30d,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  dohvatiVlasnikoveRezervacije = (req: express.Request, res: express.Response) =>{
    const vlasnikId = req.params.vlasnikId;
    Vikendica.find({vlasnikId: vlasnikId}).then(vikendice =>{
      const vikendicaIds = vikendice.map(v => v._id);
      Rezervacija.find({vikendicaId: {$in: vikendicaIds}, status: "naCekanju"})
      .populate("vikendicaId", "naziv mesto slike cena_leto cena_zima")
      .populate("turistaId", "ime prezime email kontakt_telefon")
      .sort({ datumKreiranja: -1 })
      .then((rezervacije) => res.json(rezervacije))
      .catch((error) => res.status(500).json({ error: error.message }));
    }).catch((error) => res.status(500).json({ error: error.message }) );
  }
}
