import { get } from 'node:http';
const db = require ('../config/db');
const { randomUUID } = require('crypto');

export interface LotBillet {
    lot_billet_id: string;
    activite_id: number;
    nom_lot_billet: string;
    description?: string;
    numero_debut: number;
    numero_fin: number;
}

const generateLotBilletId = async (): Promise<string> => {
    return require('crypto').randomBytes(16).toString('hex');
};

const getAllLotBillets = async (): Promise<LotBillet[]> => {
    const result = await db.query('SELECT * FROM LOT_BILLET');
    return result.rows;
}

const getLotBilletById = async (id: string): Promise<LotBillet | null> => {
    const result = await db.query('SELECT * FROM LOT_BILLET WHERE LOT_BILLET_ID = $1', [id]);
    return result.rows[0] || null;
}

const addLotBillet = async (lotBillet: Omit<LotBillet, 'lot_billet_id'>): Promise<LotBillet> => {
    const lot_billet_id = await generateLotBilletId();
    const result = await db.query(
        'INSERT INTO LOT_BILLET (LOT_BILLET_ID, ACTIVITE_ID, NOM_LOT_BILLET, DESCRIPTION, NUMERO_DEBUT, NUMERO_FIN) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [lot_billet_id, lotBillet.activite_id, lotBillet.nom_lot_billet, lotBillet.description, lotBillet.numero_debut, lotBillet.numero_fin]
    );
    return result.rows[0];
}

const updateLotBillet = async (id: string, lotBillet: Partial<Omit<LotBillet, 'lot_billet_id'>>): Promise<LotBillet | null> => {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in lotBillet) {
        fields.push(`${key.toUpperCase()} = $${index}`);
        values.push((lotBillet as any)[key]);
        index++;
    }
    values.push(id);
    const result = await db.query(
        `UPDATE LOT_BILLET SET ${fields.join(', ')} WHERE LOT_BILLET_ID = $${index} RETURNING *`,
        values
    );
    return result.rows[0] || null;
}


const deleteLotBillet = async (id: string): Promise<boolean> => {
    const result = await db.query('DELETE FROM LOT_BILLET WHERE LOT_BILLET_ID = $1', [id]);
    return result.rowCount > 0;
}

const generateBilletsForLot = async (lotBillet: LotBillet, prixUnitaire: number): Promise<void> => {
    const Billet = require('./billets.model');
    for (let numero = lotBillet.numero_debut; numero <= lotBillet.numero_fin; numero++) {
        try {
            await Billet.addBillet({
                membre_id: undefined, // Pas assigné à un membre
                lot_billet_id: lotBillet.lot_billet_id,
                numero,
                statut: 'disponible',
                prix_unitaire: prixUnitaire,
            });
        } catch (error) {
            console.error(`Erreur lors de l'ajout du billet numéro ${numero}:`, error);
            throw error;
        }
    }
}

module.exports = {
    addLotBillet,
    updateLotBillet,
    deleteLotBillet,
    generateBilletsForLot,
    getAllLotBillets,
    getLotBilletById
};