const Quete = require('../models/quete.model');

const getQuetes = async (req: any, res: any) => {
    try {
        const quetes = await Quete.getAllQuetes();
        res.json(quetes);
        res.status(200);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur pour la récupération des quêtes' });
    }
};
    
const getQuete = async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const quete = await Quete.getQuete(id);
        if (quete) {
            res.json(quete);
            res.status(200);
        }
        else {
            res.status(404).json({ error: 'Quête non trouvée' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur pour la récupération de la quête' });
    }
};

const addQuete = async (req: any, res: any) => {
    try {
        // Extraire les données du formulaire (FormData ou JSON)
        const montantParsed = parseFloat(req.body.montant);
        const newQuete = {
            date_quete: req.body.date_quete || new Date().toISOString(),
            nom_donnateur: req.body.nom_donnateur || '',
            montant: isNaN(montantParsed) ? 0 : montantParsed,
            piece_justificatif: req.file ? `quetes/${req.file.filename}` : (req.body.piece_justificatif || ''),
        };

        if (!newQuete.nom_donnateur || !newQuete.montant) {
            return res.status(400).json({ error: 'nom_donnateur et montant sont requis' });
        }

        const createdQuete = await Quete.addQuete(newQuete);
        res.status(201).json(createdQuete);
    }
    catch (error) {
        console.error('Erreur addQuete:', error);
        res.status(500).json({ error: 'Erreur pour la création de la quête' });
    }
};

const updateQuete = async (req: any, res: any) => {
    const id = req.params.id;
    try {
        // Extraire les données du formulaire (FormData ou JSON)
        const montantParsed = parseFloat(req.body.montant);
        const updatedData: any = {
            date_quete: req.body.date_quete,
            nom_donnateur: req.body.nom_donnateur,
            montant: isNaN(montantParsed) ? 0 : montantParsed,
        };

        // Si un nouveau fichier est uploadé, utiliser le nouveau nom
        if (req.file) {
            updatedData.piece_justificatif = `quetes/${req.file.filename}`;
        } else if (req.body.piece_justificatif) {
            // Sinon garder le fichier existant (si envoyé en tant que string)
            updatedData.piece_justificatif = req.body.piece_justificatif;
        }

        // Supprimer les propriétés undefined
        Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

        const updatedQuete = await Quete.updateQuete(id, updatedData);
        if (updatedQuete) {
            res.json(updatedQuete);
            res.status(200);
        }
        else {
            res.status(404).json({ error: 'Quête non trouvée' });
        }
    } catch (error) {
        console.error('Erreur updateQuete:', error);
        res.status(500).json({ error: 'Erreur pour la mise à jour de la quête' });
    }
};

const deleteQuete = async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const deleted = await Quete.deleteQuete(id);
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: 'Quête non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la suppression de la quête' });
    }
};

const getSumQuetes = async (req: any, res: any) => {
    try {
        const total = await Quete.getSumQuetes();
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la récupération de la somme des quêtes' });
    }
};


module.exports = {
    getQuetes,
    getQuete,
    addQuete,
    updateQuete,
    deleteQuete,
    getSumQuetes
};