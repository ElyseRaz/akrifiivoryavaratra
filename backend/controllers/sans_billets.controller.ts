const SansBillet = require('../models/sans_billets.model');

const getSansBillets = async (req: any, res: any) => {
    try {
        const sansBillets = await SansBillet.getAllSansBillets();
        res.status(200).json(sansBillets);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const addSansBillet = async (req: any, res: any) => {
    try {
        const newSansBillet = await SansBillet.addSansBillet(req.body);
        res.status(201).json(newSansBillet);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const updateSansBillet = async (req: any, res: any) => {
    try {
        const updatedSansBillet = await SansBillet.updateSansBillet(req.params.id, req.body);
        if (updatedSansBillet) {
            res.status(200).json(updatedSansBillet);
        }
        else {
            res.status(404).json({ error: 'Sans billet non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const deleteSansBillet = async (req: any, res: any) => {
    try {
        const success = await SansBillet.deleteSansBillet(req.params.id);
        if (success) {
            res.status(200).json({ message: 'Sans billet supprimé avec succès' });
        }   
        else {
            res.status(404).json({ error: 'Sans billet non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getSansBillets,
    addSansBillet,
    updateSansBillet,
    deleteSansBillet
};