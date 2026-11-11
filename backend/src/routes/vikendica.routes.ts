import express from "express";
import { VikendicaController } from "../controllers/vikendica.controller";

const vikendicaRouter = express.Router();
const vikendicaController = new VikendicaController();

vikendicaRouter.route("/dohvatiVikendice").get(
  (req, res) => vikendicaController.dohvatiVikendice(req, res)
);

vikendicaRouter.route("/dohvatiVikendiceZaVlasnika/:vlasnikId").get(
  (req, res) => vikendicaController.dohvatiVikendiceZaVlasnika(req, res)
);

vikendicaRouter.route("/dodajVikendicu").post(
  (req, res) => vikendicaController.dodajVikendicu(req, res)
);

vikendicaRouter.route("/azurirajVikendicu").post(
  (req, res) => vikendicaController.azurirajVikendicu(req, res)
);

vikendicaRouter.route("/obrisiVikendicu").post(
  (req, res) => vikendicaController.obrisiVikendicu(req, res)
);

export default vikendicaRouter;
