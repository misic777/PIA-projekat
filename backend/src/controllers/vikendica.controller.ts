import * as express from "express";
import Vikendica from "../models/vikendica";

export class VikendicaController {

    dohvatiVikendice = (req: express.Request, res: express.Response) => {
        Vikendica.find()
            .then((vikendice) => res.json(vikendice))
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    dohvatiVikendiceZaVlasnika = (req: express.Request, res: express.Response) => {
        const vlasnikId = req.params.vlasnikId;
        Vikendica.find({
            vlasnikId: vlasnikId
        })
            .then((vikendice) => res.json(vikendice))
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    dodajVikendicu = async (req: express.Request, res: express.Response) => {
        try {
            const vikendicaData = JSON.parse(req.body.vikendica);
            
            // Ukloni _id ako postoji
            delete vikendicaData._id;

            let slike: string[] = [];

            // Provera da li su slike uploadovane
            if (req.files && req.files.slike) {
                const uploadedFiles = Array.isArray(req.files.slike) 
                    ? req.files.slike 
                    : [req.files.slike];

                // Kreiranje foldera za vikendicu
                const fs = require('fs');
                const path = require('path');
                const vikendicaFolder = path.join(__dirname, '../../assets/vikendice', vikendicaData.naziv);
                
                if (!fs.existsSync(vikendicaFolder)) {
                    fs.mkdirSync(vikendicaFolder, { recursive: true });
                }

                // Čuvanje slika
                for (let file of uploadedFiles) {
                    const fileName = Date.now() + '-' + file.name;
                    const uploadPath = path.join(vikendicaFolder, fileName);
                    
                    await file.mv(uploadPath);
                    slike.push(fileName);
                }
            }

            const novaVikendica = new Vikendica({
                ...vikendicaData,
                slike: slike,
                status: 'aktivna',
                datumKreiranja: new Date()
            });

            await novaVikendica.save();
            res.json({ message: 'Vikendica uspešno dodata!', vikendica: novaVikendica });
        } catch (error: any) {
            console.log(error);
            res.status(400).json({ message: 'Greška pri dodavanju vikendice!', error: error.message });
        }
    }

    azurirajVikendicu = async (req: express.Request, res: express.Response) => {
        try {
            const vikendicaData = JSON.parse(req.body.vikendica);
            const id = vikendicaData._id;

            let updateData: any = { ...vikendicaData };
            delete updateData._id;

            // Ako ima novih slika
            if (req.files && req.files.slike) {
                const uploadedFiles = Array.isArray(req.files.slike) 
                    ? req.files.slike 
                    : [req.files.slike];

                const fs = require('fs');
                const path = require('path');
                const vikendicaFolder = path.join(__dirname, '../../assets/vikendice', vikendicaData.naziv);
                
                if (!fs.existsSync(vikendicaFolder)) {
                    fs.mkdirSync(vikendicaFolder, { recursive: true });
                }

                let noveSlike: string[] = [];
                for (let file of uploadedFiles) {
                    const fileName = Date.now() + '-' + file.name;
                    const uploadPath = path.join(vikendicaFolder, fileName);
                    
                    await file.mv(uploadPath);
                    noveSlike.push(fileName);
                }
                
                updateData.slike = noveSlike;
            }

            const azuriranaVikendica = await Vikendica.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );

            if (!azuriranaVikendica) {
                res.status(404).json({ message: 'Vikendica nije pronađena!' });
                return;
            }

            res.json({ message: 'Vikendica uspešno ažurirana!', vikendica: azuriranaVikendica });
        } catch (error: any) {
            console.log(error);
            res.status(400).json({ message: 'Greška pri ažuriranju vikendice!', error: error.message });
        }
    }

    obrisiVikendicu = async (req: express.Request, res: express.Response) => {
        try {
            const vikendicaId = req.body.id;
            
            // Prvo dohvati vikendicu da bi dobio naziv
            const vikendica = await Vikendica.findById(vikendicaId);
            
            if (!vikendica) {
                res.status(404).json({ message: "Vikendica nije pronađena." });
                return;
            }

            // Obriši folder sa slikama
            const fs = require('fs');
            const path = require('path');
            const vikendicaFolder = path.join(__dirname, '../../assets/vikendice', vikendica.naziv);
            
            if (fs.existsSync(vikendicaFolder)) {
                // Obriši sve fajlove u folderu
                const files = fs.readdirSync(vikendicaFolder);
                for (const file of files) {
                    fs.unlinkSync(path.join(vikendicaFolder, file));
                }
                // Obriši sam folder
                fs.rmdirSync(vikendicaFolder);
            }

            // Obriši vikendicu iz baze
            await Vikendica.findByIdAndDelete(vikendicaId);
            
            res.json({ message: "Vikendica i svi njeni fajlovi su uspešno obrisani." });
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ message: "Greška pri brisanju vikendice.", error: error.message });
        }
    }
}
