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
    const newQuete = req.body;
    try {
        const createdQuete = await Quete.addQuete(newQuete);
        res.status(201).json(createdQuete);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur pour la création de la quête' });
        console.error(error);
    }
};

const updateQuete = async (req: any, res: any) => {
    const id = req.params.id;
    const updatedData = req.body;
    try {
        const updatedQuete = await Quete.updateQuete(id, updatedData);
        if (updatedQuete) {
            res.json(updatedQuete);
            res.status(200);
        }
        else {
            res.status(404).json({ error: 'Quête non trouvée' });
        }
    } catch (error) {
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