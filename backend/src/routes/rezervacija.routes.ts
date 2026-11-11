import express from "express";
import { RezervacijaController } from "../controllers/rezervacija.controller";

const rezervacijaRouter = express.Router();

rezervacijaRouter
  .route("/dohvatiRezervacije")
  .get((req, res) => new RezervacijaController().dohvatiRezervacije(req, res));

rezervacijaRouter
  .route("/turista/:turistaId")
  .get((req, res) =>
    new RezervacijaController().dohvatiRezervacijeZaTuristu(req, res)
  );

rezervacijaRouter
  .route("/vikendica/:vikendicaId")
  .get((req, res) =>
    new RezervacijaController().dohvatiRezervacijeZaVikendicu(req, res)
  );

rezervacijaRouter
  .route("/aktivne/:turistaId")
  .get((req, res) =>
    new RezervacijaController().dohvatiAktivneRezervacije(req, res)
  );

rezervacijaRouter
  .route("/istorija/:turistaId")
  .get((req, res) => new RezervacijaController().dohvatiIstoriju(req, res));

rezervacijaRouter
  .route("/kreiraj")
  .post((req, res) => new RezervacijaController().kreirajRezervaciju(req, res));

rezervacijaRouter
  .route("/potvrdi/:id")
  .put((req, res) => new RezervacijaController().potvrdiRezervaciju(req, res));

rezervacijaRouter
  .route("/odbij/:id")
  .put((req, res) => new RezervacijaController().odbijRezervaciju(req, res));

rezervacijaRouter
  .route("/otkazi/:id")
  .put((req, res) => new RezervacijaController().otkaziRezervaciju(req, res));

rezervacijaRouter
  .route("/recenzija/:id")
  .put((req, res) => new RezervacijaController().dodajRecenziju(req, res));

rezervacijaRouter
  .route("/statistika")
  .get((req, res) => new RezervacijaController().dohvatiStatistiku(req, res));

rezervacijaRouter.route("/dohvatiVlasnikoveRezervacije/:vlasnikId").get((req, res) =>
  new RezervacijaController().dohvatiVlasnikoveRezervacije(req, res)
);

export default rezervacijaRouter;
