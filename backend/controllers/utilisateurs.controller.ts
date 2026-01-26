const Utilisateur = require('../models/utilisateurs.model');

const getUtilisateurs = async (req: any, res: any) => {
    try {
        const utilisateurs = await Utilisateur.getAllUtilisateurs();
        res.status(200).json(utilisateurs);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const addUtilisateur = async (req: any, res: any) => {
    try {
        const newUtilisateur = await Utilisateur.addUtilisateur(req.body);
        res.status(201).json(newUtilisateur);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const updateUtilisateur = async (req: any, res: any) => {
    try {
        const updatedUtilisateur = await Utilisateur.updateUtilisateur(req.params.id, req.body);
        if (updatedUtilisateur) {
            res.status(200).json(updatedUtilisateur);
        }
        else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }   
};

const deleteUtilisateur = async (req: any, res: any) => {
    try {
        const success = await Utilisateur.deleteUtilisateur(req.params.id);
        if (success) {
            res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
        }
        else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const jwt = require('jsonwebtoken');

const loginUtilisateur = async (req: any, res: any) => {
    try {
        const { email, mot_de_passe } = req.body;
        if (!email || !mot_de_passe) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }
        const utilisateur = await Utilisateur.getUtilisateurByEmail(email);
        if (!utilisateur || utilisateur.mot_de_passe !== mot_de_passe) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        // Générer un token JWT
        const token = jwt.sign(
            { id: utilisateur.id, nom_utilisateur: utilisateur.nom_utilisateur, email: utilisateur.email, role: utilisateur.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ message: 'Connexion réussie', token, utilisateur: { id: utilisateur.id, nom_utilisateur: utilisateur.nom_utilisateur, email: utilisateur.email, role: utilisateur.role } });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getUtilisateurs,
    addUtilisateur,
    updateUtilisateur,
    deleteUtilisateur,
    loginUtilisateur
};