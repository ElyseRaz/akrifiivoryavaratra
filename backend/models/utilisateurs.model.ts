import { get } from 'node:http';
const db = require('../config/db');

export interface Utilisateur {
    id: string;
    nom_utilisateur: string;
    email ?: string;
    mot_de_passe : string;
    role : string;
}

const generateUtilisateurId = async (): Promise<string> => {
    const result = await db.query('SELECT MAX(UTILISATEUR_ID) as max_id FROM UTILISATEUR');
    const maxId = result.rows[0].max_id;
    return maxId ? `U${(parseInt(maxId.replace('U', '')) + 1).toString().padStart(4, '0')}` : 'U0001';
}

const addUtilisateur = async (utilisateur: Omit<Utilisateur, 'id'>): Promise<Utilisateur> => {
    const id = await generateUtilisateurId();
    const result = await db.query(
        'INSERT INTO UTILISATEUR (UTILISATEUR_ID, NOM_UTILISATEUR, EMAIL, MOT_DE_PASSE, ROLE) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, utilisateur.nom_utilisateur, utilisateur.email, utilisateur.mot_de_passe, utilisateur.role]
    );
    return result.rows[0];
}

const getAllUtilisateurs = async (): Promise<Utilisateur[]> => {
    const result = await db.query('SELECT * FROM UTILISATEUR');
    return result.rows;
}

const getUtilisateurById = async (id: string): Promise<Utilisateur | null> => {
    const result = await db.query('SELECT * FROM UTILISATEUR WHERE UTILISATEUR_ID = $1', [id]);
    return result.rows[0] || null;
}

const getUtilisateurByUsername = async (nom_utilisateur: string): Promise<Utilisateur | null> => {
    const result = await db.query('SELECT * FROM UTILISATEUR WHERE NOM_UTILISATEUR = $1', [nom_utilisateur]);
    return result.rows[0] || null;
}

const getUtilisateurByEmail = async (email: string): Promise<Utilisateur | null> => {
    const result = await db.query('SELECT * FROM UTILISATEUR WHERE EMAIL = $1', [email]);
    return result.rows[0] || null;
}

const updateUtilisateur = async (id: string, utilisateur: Partial<Omit<Utilisateur, 'id'>>): Promise<Utilisateur | null> => {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in utilisateur) {
        fields.push(`${key.toUpperCase()} = $${index}`);
        values.push((utilisateur as any)[key]);
        index++;
    }
    values.push(id);
    const result = await db.query(
        `UPDATE UTILISATEUR SET ${fields.join(', ')} WHERE UTILISATEUR_ID = $${index} RETURNING *`,
        values
    );
    return result.rows[0] || null;
}

const deleteUtilisateur = async (id: string): Promise<boolean> => {
    const result = await db.query('DELETE FROM UTILISATEUR WHERE UTILISATEUR_ID = $1', [id]);
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
