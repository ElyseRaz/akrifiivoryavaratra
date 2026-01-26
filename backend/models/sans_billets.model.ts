import { get } from 'node:http';
const db = require('../config/db');

interface SansBillet {
    sans_billet_id: string;
    montant: number;
    membre_id: string;
    activite_id: number;
    date_don: Date;
    nom_membre?: string;
    prenom_membre?: string;
}

const generateSansBilletId = async(): Promise<string> => {
    const result = await db.query('SELECT MAX(SANS_BILLET_ID) as max_id FROM SANS_BILLET');
    const maxId = result.rows[0].max_id;
    if(!maxId){
        return 'SB-001';
    }
    const num = parseInt(maxId.split('-')[1]) + 1;
    return `SB-${num.toString().padStart(3,'0')}`;
}

const addSansBillet = async(sansBillet: Omit<SansBillet,'sans_billet_id'>): Promise<SansBillet> => {
    const sans_billet_id = await generateSansBilletId();
    const result = await db.query(
        'INSERT INTO SANS_BILLET (SANS_BILLET_ID, MONTANT, MEMBRE_ID, ACTIVITE_ID, DATE_DON) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [sans_billet_id, sansBillet.montant, sansBillet.membre_id, sansBillet.activite_id, sansBillet.date_don]
    );
    if (result.rows[0]) {
        // Récupérer avec jointure
        const selectResult = await db.query('SELECT SANS_BILLET.*, MEMBRE.NOM_MEMBRE as nom_membre, MEMBRE.PRENOM_MEMBRE as prenom_membre FROM SANS_BILLET JOIN MEMBRE ON SANS_BILLET.MEMBRE_ID = MEMBRE.MEMBRE_ID WHERE SANS_BILLET_ID = $1', [sans_billet_id]);
        return selectResult.rows[0];
    }
    return result.rows[0];
}

const getAllSansBillets = async(): Promise<SansBillet[]> => {
    const result = await db.query('SELECT SANS_BILLET.*, MEMBRE.NOM_MEMBRE as nom_membre, MEMBRE.PRENOM_MEMBRE as prenom_membre FROM SANS_BILLET JOIN MEMBRE ON SANS_BILLET.MEMBRE_ID = MEMBRE.MEMBRE_ID');
    return result.rows;

}

const getSansBilletById = async(id: string): Promise<SansBillet | null> => {
    const result = await db.query('SELECT SANS_BILLET.*, MEMBRE.NOM_MEMBRE as nom_membre, MEMBRE.PRENOM_MEMBRE as prenom_membre FROM SANS_BILLET JOIN MEMBRE ON SANS_BILLET.MEMBRE_ID = MEMBRE.MEMBRE_ID WHERE SANS_BILLET_ID = $1', [id]);
    return result.rows[0] || null;
}

const updateSansBillet = async(id: string, sansBillet: Partial<Omit<SansBillet,'sans_billet_id'>>): Promise<SansBillet | null> => {
    const fields = [];
    const values = [];
    let index = 1;
    for(const key in sansBillet){
        fields.push(`${key.toUpperCase()} = $${index}`);
        values.push((sansBillet as any)[key]);
        index++;
    }
    values.push(id);
    const result = await db.query(
        `UPDATE SANS_BILLET SET ${fields.join(', ')} WHERE SANS_BILLET_ID = $${index} RETURNING *`,
        values
    );
    if (result.rows[0]) {
        // Récupérer avec jointure
        const selectResult = await db.query('SELECT SANS_BILLET.*, MEMBRE.NOM_MEMBRE as nom_membre, MEMBRE.PRENOM_MEMBRE as prenom_membre FROM SANS_BILLET JOIN MEMBRE ON SANS_BILLET.MEMBRE_ID = MEMBRE.MEMBRE_ID WHERE SANS_BILLET_ID = $1', [id]);
        return selectResult.rows[0] || null;
    }
    return null;
}

const deleteSansBillet = async(id: string): Promise<boolean> => {
    const result = await db.query('DELETE FROM SANS_BILLET WHERE SANS_BILLET_ID = $1', [id]);
    return result.rowCount > 0;
}

module.exports = {
    addSansBillet,
    getAllSansBillets,
    getSansBilletById,
    updateSansBillet,
    deleteSansBillet
}