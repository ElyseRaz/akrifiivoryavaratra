const Depense = require('../models/depenses.model');

const getDepenses = async (req: any, res: any) => {
    try {
        const depenses = await Depense.getAllDepenses();
        res.json(depenses);
        res.status(200);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur pour la récupération des dépenses' });
    }
};

const getDepense = async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const depense = await Depense.getDepense(id);
        if (depense) {
            res.json(depense);
            res.status(200);
        }
        else {
            res.status(404).json({ error: 'Dépense non trouvée' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur pour la récupération de la dépense' });
    }
};

const addDepense = async (req: any, res: any) => {
    try {
        // Extraire les données du formulaire (FormData ou JSON)
        const newDepense = {
            activity_id: parseInt(req.body.activity_id) || 0,
            nom_depense: req.body.nom_depense || '',
            piece_justificatif: req.file ? `depenses/${req.file.filename}` : (req.body.piece_justificatif || ''),
            date_depense: req.body.date_depense || new Date().toISOString(),
            montant: parseFloat(req.body.montant) || 0,
        };

        if (!newDepense.activity_id || !newDepense.nom_depense) {
            return res.status(400).json({ error: 'activity_id et nom_depense sont requis' });
        }

        const createdDepense = await Depense.addDepense(newDepense);
        res.status(201).json(createdDepense);
    }
    catch (error) {
        console.error('Erreur addDepense:', error);
        res.status(500).json({ error: 'Erreur pour la création de la dépense' });
    }
};

const updateDepense = async (req: any, res: any) => {
    const id = req.params.id;
    try {
        // Extraire les données du formulaire (FormData ou JSON)
        const updatedData: any = {
            activity_id: parseInt(req.body.activity_id) || 0,
            nom_depense: req.body.nom_depense || '',
            date_depense: req.body.date_depense,
            montant: parseFloat(req.body.montant) || 0,
        };

        // Ajouter le fichier seulement s'il y en a un nouveau
        if (req.file) {
            updatedData.piece_justificatif = `depenses/${req.file.filename}`;
        } else if (req.body.piece_justificatif && typeof req.body.piece_justificatif === 'string') {
            updatedData.piece_justificatif = req.body.piece_justificatif;
        }

        const updatedDepense = await Depense.updateDepense(id, updatedData);
        if (updatedDepense) {
            res.json(updatedDepense);
            res.status(200);
        } else {
            res.status(404).json({ error: 'Dépense non trouvée' });
        }
    } catch (error) {
        console.error('Erreur updateDepense:', error);
        res.status(500).json({ error: 'Erreur pour la mise à jour de la dépense' });
    }
};

const deleteDepense = async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const success = await Depense.deleteDepense(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Dépense non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la suppression de la dépense' });
    }
};

const getSumDepensesByActivity = async (req: any, res: any) => {
    const activityId = req.params.activityId;
    try {
        const total = await Depense.getSumDepensesByActivity(activityId);
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la récupération du total des dépenses' });
    }
};


const getSumDepenses = async (req: any, res: any) => {
    try {
        const total = await Depense.getSumDepenses();
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la récupération du total des dépenses' });
    }
};

module.exports = {
    getDepenses,
    getDepense,
    addDepense,
    updateDepense,
    deleteDepense,
    getSumDepensesByActivity,
    getSumDepenses
};