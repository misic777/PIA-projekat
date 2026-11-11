import * as express from "express";
import Korisnik from "../models/korisnik";
import * as bcrypt from "bcryptjs";
import path from "path";
import fileUpload from "express-fileupload";
import * as fs from "fs";

export class KorisnikController {
  dohvatiKorisnike = (req: express.Request, res: express.Response) => {
    Korisnik.find()
      .then((korisnici) => res.json(korisnici))
      .catch((error) => console.log(error));
  };

  dohvatiTuriste = (req: express.Request, res: express.Response) => {
    Korisnik.find({ tip_korisnika: "turista" })
      .then((korisnici) => res.json(korisnici))
      .catch((error) => console.log(error));
  };

  dohvatiVlasnike = (req: express.Request, res: express.Response) => {
    Korisnik.find({ tip_korisnika: "vlasnik" })
      .then((korisnici) => res.json(korisnici))
      .catch((error) => console.log(error));
  };

  login = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let lozinka = req.body.lozinka;
    Korisnik.findOne({ korisnicko_ime: korisnicko_ime })
      .then(async (user) => {
        if (!user) {
          res.json(null);
          return;
        }
        if (!user.lozinka) {
          res.json(null);
          return;
        }
        const isMatch = await bcrypt.compare(lozinka, user.lozinka);
        if (!isMatch) {
          res.json(null);
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  register = async (req: express.Request, res: express.Response) => {
    const korisnik = JSON.parse(req.body.korisnik);
    delete korisnik._id;
    korisnik.korisnicko_ime = korisnik.korisnicko_ime.toLowerCase();
    korisnik.email = korisnik.email.toLowerCase();
    Korisnik.findOne({
      $or: [
        { korisnicko_ime: korisnik.korisnicko_ime },
        { email: korisnik.email },
      ],
    }).then(async (user) => {
      if (user) {
        res.json({ message: "Korisničko ime/Email već postoji!" });
        return;
      } else {
        const cryptedPassword = await bcrypt.hash(korisnik.lozinka, 10);
        korisnik.lozinka = cryptedPassword; //cryptedPassword;

        let imagePath = "default.png";

        if (req.files && req.files.profilnaSlika) {
          const picture = req.files.profilnaSlika as fileUpload.UploadedFile;
          const ext = path.extname(picture.name);
          const fileName = `${korisnik.korisnicko_ime}_${Date.now()}${ext}`;
          const filePath = path.join(
            __dirname,
            "..",
            "..",
            "assets",
            "profilePictures",
            fileName
          );

          const dir = path.join(__dirname, "..", "profilePictures");
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          // console.log("Saving to:", filePath); // ← DEBUG
          await picture.mv(filePath);
          // console.log("File saved successfully!"); // ← DEBUG
          imagePath = fileName;
        }
        korisnik.profilna_slika = imagePath;
        const noviKorisnik = new Korisnik(korisnik);
        noviKorisnik
          .save()
          .then(() => {
            res.json({ message: "Korisnik uspešno registrovan." });
          })
          .catch((err: any) => {
            console.log(err);
            res.json({ message: "Greška prilikom registracije." });
          });
      }
    });
  };

  azurirajKorisnika = async (req: express.Request, res: express.Response) => {
    const korisnikData = JSON.parse(req.body.korisnik);
    const korisnicko_ime = korisnikData.korisnicko_ime;

    // Pronađi korisnika
    const korisnik = await Korisnik.findOne({
      korisnicko_ime: korisnicko_ime,
    });
    if (!korisnik) {
      res.json({ message: "Korisnik ne postoji." });
      return;
    }

    // Obrada nove slike ako postoji
    if (req.files && req.files.profilnaSlika) {
      const picture = req.files.profilnaSlika as fileUpload.UploadedFile;
      const ext = path.extname(picture.name);
      const fileName = `${korisnicko_ime}_${Date.now()}${ext}`;
      const uploadDir = path.join(
        __dirname,
        "..",
        "..",
        "assets",
        "profilePictures"
      );
      const filePath = path.join(uploadDir, fileName);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Obriši staru sliku (osim default.png)
      if (
        korisnik.profilna_slika &&
        korisnik.profilna_slika !== "default.png"
      ) {
        const oldImagePath = path.join(uploadDir, korisnik.profilna_slika);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      await picture.mv(filePath);
      korisnikData.profilna_slika = fileName;
    }

    // Ažuriraj korisnika
    await Korisnik.updateOne(
      { korisnicko_ime: korisnicko_ime },
      { $set: korisnikData }
    );

    // Vrati ažuriranog korisnika
    const azuriranKorisnik = await Korisnik.findOne({
      korisnicko_ime: korisnicko_ime,
    });
    res.json({
      message: "Korisnik uspešno ažuriran.",
      korisnik: azuriranKorisnik,
    });
  };

  promenaLozinke = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let novaLozinka = req.body.novaLozinka;
    Korisnik.findOne({ korisnicko_ime: korisnicko_ime }).then(async (user) => {
      if (!user) {
        res.json({ message: "Korisnik ne postoji." });
        return;
      }
      const cryptedPassword = await bcrypt.hash(novaLozinka, 10);
      if (user.lozinka === cryptedPassword) {
        res.json({ message: "Nova lozinka mora biti razlicita od stare." });
        return;
      }
      user.lozinka = cryptedPassword;
      Korisnik.updateOne(
        { korisnicko_ime: korisnicko_ime },
        { $set: { lozinka: user.lozinka } }
      )
        .then(() => {
          res.json({ message: "Lozinka uspesno promenjena." });
        })
        .catch((err) => {
          console.log(err);
          res.json({ message: "Greska prilikom promene lozinke." });
        });
    });
  };

  prihvatiZahtev = (req: express.Request, res: express.Response) => {
    const id = req.body.id;
    Korisnik.updateOne({ _id: id }, { $set: { status: "aktivan" } })
      .then(() => {
        res.json({ message: "Zahtev prihvacen." });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "Greska prilikom prihvatanja zahteva." });
      });
  };

  odbijZahtev = (req: express.Request, res: express.Response) => {
    const id = req.body.id;
    const razlog = req.body.razlog;
    Korisnik.updateOne(
      { _id: id },
      { $set: { status: "odbijen", razlog: razlog } }
    )
      .then(() => {
        res.json({ message: "Zahtev odbijen." });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "Greska prilikom odbijanja zahteva." });
      });
  };


  deaktivirajKorisnika = (req: express.Request, res: express.Response) => {
      const id = req.body.id;
      Korisnik.updateOne({ _id: id }, { $set: { status: "deaktiviran" } })
        .then(() => {
          res.json({ message: "Korisnik deaktiviran." });
        })
        .catch((err) => {
          console.log(err);
          res.json({ message: "Greska prilikom deaktivacije korisnika." });
        });
  };
}