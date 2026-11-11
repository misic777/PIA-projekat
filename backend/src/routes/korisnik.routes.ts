import express from "express";
import { KorisnikController } from "../controllers/korisnik.controller";
const korisnikRouter = express.Router();

korisnikRouter
  .route("/login")
  .post((req, res) => new KorisnikController().login(req, res));

korisnikRouter
  .route("/register")
  .post((req, res) => new KorisnikController().register(req, res));

korisnikRouter
  .route("/promenaLozinke")
  .post((req, res) => new KorisnikController().promenaLozinke(req, res));

korisnikRouter
  .route("/dohvatiKorisnike")
  .get((req, res) => new KorisnikController().dohvatiKorisnike(req, res));

korisnikRouter
  .route("/dohvatiTuriste")
  .get((req, res) => new KorisnikController().dohvatiTuriste(req, res));

korisnikRouter
  .route("/dohvatiVlasnike")
  .get((req, res) => new KorisnikController().dohvatiVlasnike(req, res));

korisnikRouter
  .route("/azurirajKorisnika")
  .post((req, res) => new KorisnikController().azurirajKorisnika(req, res));

korisnikRouter.route("/prihvatiZahtev").post((req, res) =>
  new KorisnikController().prihvatiZahtev(req, res)
);

korisnikRouter.route("/odbijZahtev").post((req, res) =>
  new KorisnikController().odbijZahtev(req, res)
);

korisnikRouter.route("/deaktivirajKorisnika").post((req, res) =>
  new KorisnikController().deaktivirajKorisnika(req, res)
);

export default korisnikRouter;
