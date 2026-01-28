import { get } from 'node:http';
const db = require('../config/db');
const { randomUUID } = require('crypto');

export interface Billet{
    billet_id: string;
    membre_id?: string;
    lot_billet_id: string;
    numero : number;
    statut ?: string;
    prix_unitaire : number;
    nom_membre?: string;
    prenom_membre?: string;
}

const generateBilletId = (lot_billet_id: string, numero: number): string => {
    return require('crypto').randomBytes(16).toString('hex');
};

const getAllBillets = async (): Promise<Billet[]> => {
    const result = await db.query('SELECT BILLET.*, MEMBRE.NOM_MEMBRE as nom_membre, MEMBRE.PRENOM_MEMBRE as prenom_membre FROM BILLET LEFT JOIN MEMBRE ON BILLET.MEMBRE_ID = MEMBRE.MEMBRE_ID');
    return result.rows;
};

const getAllBilletsByLot = async (lot_billet_id: string): Promise<Billet[]> => {
    const result = await db.query('SELECT BILLET.*, MEMBRE.NOM_MEMBRE as nom_membre, MEMBRE.PRENOM_MEMBRE as prenom_membre FROM BILLET LEFT JOIN MEMBRE ON BILLET.MEMBRE_ID = MEMBRE.MEMBRE_ID WHERE LOT_BILLET_ID = $1', [lot_billet_id]);
    return result.rows;
};

const getAllBilletsByActivite = async (activite_id: number): Promise<Billet[]> => {
    const result = await db.query('SELECT BILLET.*, MEMBRE.NOM_MEMBRE as nom_membre, MEMBRE.PRENOM_MEMBRE as prenom_membre FROM BILLET LEFT JOIN MEMBRE ON BILLET.MEMBRE_ID = MEMBRE.MEMBRE_ID JOIN LOT_BILLET ON BILLET.LOT_BILLET_ID = LOT_BILLET.LOT_BILLET_ID WHERE LOT_BILLET.ACTIVITE_ID = $1', [activite_id]);
    return result.rows;
};

const addBillet = async (billet: Omit<Billet, 'billet_id'>): Promise<Billet> => {
    const billet_id = generateBilletId(billet.lot_billet_id, billet.numero);
    try {
        const result = await db.query(
            'INSERT INTO BILLET (BILLET_ID, MEMBRE_ID, LOT_BILLET_ID, NUMERO, STATUT, PRIX_UNITAIRE) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [billet_id, billet.membre_id || null, billet.lot_billet_id, billet.numero, billet.statut, billet.prix_unitaire]
        );
        if (result.rows[0]) {
            // Récupérer avec jointure si membre_id existe
            if (billet.membre_id) {
                const selectResult = await db.query('SELECT BILLET.*, MEMBRE.NOM_MEMBRE as nom_membre, MEMBRE.PRENOM_MEMBRE as prenom_membre FROM BILLET LEFT JOIN MEMBRE ON BILLET.MEMBRE_ID = MEMBRE.MEMBRE_ID WHERE BILLET_ID = $1', [billet_id]);
                return selectResult.rows[0];
            } else {
                return result.rows[0];
            }
        }
        return result.rows[0];
    } catch (error) {
        console.error('Erreur lors de l\'insertion du billet:', billet_id, error);
        throw error;
    }
};

const updateBillet = async (id: string, billet: Partial<Omit<Billet, 'billet_id'>>): Promise<Billet | null> => {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in billet) {
        fields.push(`${key.toUpperCase()} = $${index}`);
        values.push((billet as any)[key]);
        index++;
    }
    values.push(id);
    const result = await db.query(
        `UPDATE BILLET SET ${fields.join(', ')} WHERE BILLET_ID = $${index} RETURNING *`,
        values
    );
    if (result.rows[0]) {
        // Récupérer avec jointure
        const selectResult = await db.query('SELECT BILLET.*, MEMBRE.NOM_MEMBRE as nom_membre, MEMBRE.PRENOM_MEMBRE as prenom_membre FROM BILLET JOIN MEMBRE ON BILLET.MEMBRE_ID = MEMBRE.MEMBRE_ID WHERE BILLET_ID = $1', [id]);
        return selectResult.rows[0] || null;
    }
    return null;
};

const deleteBillet = async (id: string): Promise<boolean> => {
    const result = await db.query('DELETE FROM BILLET WHERE BILLET_ID = $1', [id]);
    return result.rowCount > 0;
};


const getSumBilletsByLot = async (lot_billet_id: string): Promise<number> => {
    const result = await db.query(
        'SELECT SUM(PRIX_UNITAIRE) as total FROM BILLET WHERE LOT_BILLET_ID = $1 AND STATUT = $2',
        [lot_billet_id, 'Payé']
    );
    return result.rows[0].total || 0;
}

const getSumBillets = async (): Promise<number> => {
    const result = await db.query(
        'SELECT SUM(PRIX_UNITAIRE) as total FROM BILLET WHERE STATUT = $1',
        ['Payé']
    );
    return result.rows[0].total || 0;
}

module.exports = {
    getAllBillets,
    addBillet,
    updateBillet,
    deleteBillet,
    getAllBilletsByLot,
    getAllBilletsByActivite,
    getSumBilletsByLot,
    getSumBillets
};

