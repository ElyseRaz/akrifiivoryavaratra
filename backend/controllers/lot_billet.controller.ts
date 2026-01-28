const LotBillet = require('../models/lot_billet.model');
const BilletsModel = require('../models/billets.model');

const getLotBillets = async (req: any, res: any) => {
    try {
        const lotBillets = await LotBillet.getAllLotBillets();
        res.status(200).json(lotBillets);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const addLotBillet = async (req: any, res: any) => {
    try {
        const newLotBillet = await LotBillet.addLotBillet(req.body);
        res.status(201).json(newLotBillet);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const updateLotBillet = async (req: any, res: any) => {
    try {
        const updatedLotBillet = await LotBillet.updateLotBillet(req.params.id, req.body);
        if (updatedLotBillet) {
            res.status(200).json(updatedLotBillet);
        }
        else {
            res.status(404).json({ error: 'Lot de billet non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const deleteLotBillet = async (req: any, res: any) => {
    try {
        const success = await LotBillet.deleteLotBillet(req.params.id);
        if (success) {
            res.status(200).json({ message: 'Lot de billet supprimé avec succès' });
        }
        else {
            res.status(404).json({ error: 'Lot de billet non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const generateBillets = async (req: any, res: any) => {
    try {
        const { lot_billet_id, prix_unitaire } = req.body;
        const lotBillet = await LotBillet.getLotBilletById(lot_billet_id);
        if (!lotBillet) {
            return res.status(404).json({ error: 'Lot de billet non trouvé' });
        }
        await LotBillet.generateBilletsForLot(lotBillet, prix_unitaire);
        res.status(200).json({ message: 'Billets générés avec succès' });
    } catch (error) {
        console.error('Erreur lors de la génération des billets:', error);
        res.status(500).json({ error: error });
    }
};

const getBilletsByActivite = async (req: any, res: any) => {
    try {
        const { activite_id } = req.params;
        const billets = await BilletsModel.getAllBilletsByActivite(parseInt(activite_id));
        res.status(200).json(billets);
    } catch (error) {
        console.error('Erreur lors de la récupération des billets:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getLotBillets,
    addLotBillet,
    updateLotBillet,
    deleteLotBillet,
    generateBillets,
    getBilletsByActivite
};