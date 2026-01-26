const Member = require('../models/members.model');

export const getMembers = async (req: any, res: any) => {
    try {
        const members = await Member.getAllMembers();
        res.json(members);
        res.status(200);
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la récupération des membres' });
    }   
};

export const getMember = async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const member = await Member.getMemberById(id);
        if (member) {
            res.json(member);
            res.status(200);
        }
        else {
            res.status(404).json({ error: 'Membre non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la récupération du membre' });
    }
};

export const addMember = async (req: any, res: any) => {
    const newMember = req.body;
    try {
        const createdMember = await Member.addMember(newMember);
        res.status(201).json(createdMember);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur pour la création du membre' });
        console.error(error);
    }
};

export const updateMember = async (req: any, res: any) => {
    const id = req.params.id;
    const updatedData = req.body;
    try {
        const updatedMember = await Member.updateMember(id, updatedData);
        if (updatedMember) {
            res.json(updatedMember);
            res.status(200);
        }
        else {
            res.status(404).json({ error: 'Membre non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la mise à jour du membre' });
    }
};

export const deleteMember = async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const success = await Member.deleteMember(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Membre non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la suppression du membre' });
    }
};