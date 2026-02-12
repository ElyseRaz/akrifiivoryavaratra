import { get } from 'node:http';
const db = require('../config/db');
const bcrypt = require('bcryptjs');

export interface Utilisateur {
    id: string;
    nom_utilisateur: string;
    email ?: string;
    mot_de_passe : string;
}

const generateUtilisateurId = async (): Promise<string> => {
    const result = await db.query('SELECT MAX(UTILISATEURS_ID) as max_id FROM UTILISATEURS');
    const maxId = result.rows[0].max_id;
    return maxId ? `U${(parseInt(maxId.replace('U', '')) + 1).toString().padStart(4, '0')}` : 'U0001';
}

const addUtilisateur = async (utilisateur: Omit<Utilisateur, 'id'>): Promise<Utilisateur> => {
    const id = await generateUtilisateurId();
    // Hash password before storing
    const hashed = await bcrypt.hash(utilisateur.mot_de_passe, 10);
    const result = await db.query(
        'INSERT INTO UTILISATEURS (UTILISATEURS_ID, NOM_UTILISATEUR, EMAIL, MOT_DE_PASSE) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, utilisateur.nom_utilisateur, utilisateur.email, hashed]
    );
    return result.rows[0];
}

const getAllUtilisateurs = async (): Promise<Utilisateur[]> => {
    const result = await db.query('SELECT * FROM UTILISATEURS');
    return result.rows;
}

const getUtilisateurById = async (id: string): Promise<Utilisateur | null> => {
    const result = await db.query('SELECT * FROM UTILISATEUR WHERE UTILISATEURS_ID = $1', [id]);
    return result.rows[0] || null;
}

const getUtilisateurByUsername = async (nom_utilisateur: string): Promise<Utilisateur | null> => {
    const result = await db.query('SELECT * FROM UTILISATEURS WHERE NOM_UTILISATEUR = $1', [nom_utilisateur]);
    return result.rows[0] || null;
}

const getUtilisateurByEmail = async (email: string): Promise<Utilisateur | null> => {
    const result = await db.query('SELECT * FROM UTILISATEURS WHERE EMAIL = $1', [email]);
    return result.rows[0] || null;
}

const updateUtilisateur = async (id: string, utilisateur: Partial<Omit<Utilisateur, 'id'>>): Promise<Utilisateur | null> => {
    const fields = [];
    const values = [];
    let index = 1;

    // If password is being updated, hash it
    if ((utilisateur as any).mot_de_passe) {
        (utilisateur as any).mot_de_passe = await bcrypt.hash((utilisateur as any).mot_de_passe, 10);
    }

    for (const key in utilisateur) {
        fields.push(`${key.toUpperCase()} = $${index}`);
        values.push((utilisateur as any)[key]);
        index++;
    }
    values.push(id);
    const result = await db.query(
        `UPDATE UTILISATEURS SET ${fields.join(', ')} WHERE UTILISATEURS_ID = $${index} RETURNING *`,
        values
    );
    return result.rows[0] || null;
}

const deleteUtilisateur = async (id: string): Promise<boolean> => {
    const result = await db.query('DELETE FROM UTILISATEURS WHERE UTILISATEURS_ID = $1', [id]);
    return result.rowCount > 0;
}

module.exports = {
    addUtilisateur,
    getAllUtilisateurs,
    getUtilisateurById,
    getUtilisateurByUsername,
    getUtilisateurByEmail,
    updateUtilisateur,
    deleteUtilisateur
}
