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
    const newDepense = req.body;
    try {
        const createdDepense = await Depense.addDepense(newDepense);
        res.status(201).json(createdDepense);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur pour la création de la dépense' });
        console.error(error);
    }
};

const updateDepense = async (req: any, res: any) => {
    const id = req.params.id;
    const updatedData = req.body;
    try {
        const updatedDepense = await Depense.updateDepense(id, updatedData);
        if (updatedDepense) {
            res.json(updatedDepense);
            res.status(200);
        }
        else {
            res.status(404).json({ error: 'Dépense non trouvée' });
        }
    } catch (error) {
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