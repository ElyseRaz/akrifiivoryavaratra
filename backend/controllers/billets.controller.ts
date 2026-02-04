const Billet = require('../models/billets.model');


const getBillets = async (req: any, res: any) => {
    try {
        const billets = await Billet.getAllBillets();
        res.status(200).json(billets);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const getBilletsByLot = async (req: any, res: any) => {
    try {
        const billets = await Billet.getAllBilletsByLot(req.params.lot_billet_id);
        res.status(200).json(billets);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const addBillet = async (req: any, res: any) => {
    try {
        // Normaliser le statut entré : enlever accents et vérifier si 'pay' ou 'assign' est présent
        if (req.body.statut) {
            const normalized = String(req.body.statut || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
            if (normalized.includes('pay')) {
                req.body.statut = 'Payé';
                if (!req.body.date_paiement) {
                    req.body.date_paiement = new Date().toISOString().split('T')[0];
                }
            } else if (normalized.includes('assign')) {
                req.body.statut = 'Assigné';
            }
        }
        const newBillet = await Billet.addBillet(req.body);
        res.status(201).json(newBillet);
    }
    catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

const updateBillet = async (req: any, res: any) => {
    try {
        // Normaliser le statut : enlever accents et vérifier si 'pay' ou 'assign' est présent
        if (req.body.statut) {
            const normalized = String(req.body.statut || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
            if (normalized.includes('pay')) {
                req.body.statut = 'Payé';
                if (!req.body.date_paiement) {
                    req.body.date_paiement = new Date().toISOString().split('T')[0];
                }
            } else if (normalized.includes('assign')) {
                req.body.statut = 'Assigné';
            }
        }
        const updatedBillet = await Billet.updateBillet(req.params.id, req.body);   
        if (updatedBillet) {
            res.status(200).json(updatedBillet);
        }
        else {  
            res.status(404).json({ error: 'Billet non trouvé' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const deleteBillet = async (req: any, res: any) => {
    try {
        const success = await Billet.deleteBillet(req.params.id);
        if (success) {
            res.status(200).json({ message: 'Billet supprimé avec succès' });
        }
        else {
            res.status(404).json({ error: 'Billet non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

const getSumBilletsByLot = async (req: any, res: any) => {
    try {
        const total = await Billet.getSumBilletsByLot(req.params.lot_billet_id);
        res.status(200).json({ total });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

const getSumBillets = async (req: any, res: any) => {
    try {
        const total = await Billet.getSumBillets();
        res.status(200).json({ total });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports = {
    getBillets,
    addBillet,
    updateBillet,
    deleteBillet,
    getBilletsByLot,
    getSumBilletsByLot,
    getSumBillets
};

