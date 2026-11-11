import express, { Router } from "express";
import cors from "cors";
import mongoose from "mongoose";
import korisnikRouter from "./routes/korisnik.routes";
import vikendicaRouter from "./routes/vikendica.routes";
import rezervacijaRouter from "./routes/rezervacija.routes";
import fileUpload from "express-fileupload";

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true,
    createParentPath: true,
  })
);

// Static folder za slike
app.use("/profilneSlike", express.static("assets/profilePictures"));
app.use("/vikendice", express.static("assets/vikendice"));

mongoose.connect("mongodb://127.0.0.1:27017/planinskaVikendica");
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});

const router = Router();
router.use("/korisnik", korisnikRouter);
router.use("/vikendica", vikendicaRouter);
router.use("/rezervacija", rezervacijaRouter);

app.use("/", router);

app.listen(4000, () => console.log("Express running on port 4000"));

export default app;
