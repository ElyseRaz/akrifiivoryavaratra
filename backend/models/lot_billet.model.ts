import { get } from 'node:http';
const db = require ('../config/db');

export interface LotBillet {
    lot_billet_id: string;
    activite_id: number;
    nom_lot_billet: string;
    description?: string;
}

const generateLotBilletId = async (): Promise<string> => {
    const result = await db.query('SELECT MAX(LOT_BILLET_ID) as max_id FROM LOT_BILLET');
    const maxId = result.rows[0].max_id;
    if (!maxId) {
        return 'LB-001';
    }
    const num = parseInt(maxId.split('-')[1]) + 1;
    return `LB-${num.toString().padStart(3, '0')}`;
};

const getAllLotBillets = async (): Promise<LotBillet[]> => {
    const result = await db.query('SELECT * FROM LOT_BILLET');
    return result.rows;
}

const addLotBillet = async (lotBillet: Omit<LotBillet, 'lot_billet_id'>): Promise<LotBillet> => {
    const lot_billet_id = await generateLotBilletId();
    const result = await db.query(
        'INSERT INTO LOT_BILLET (LOT_BILLET_ID, ACTIVITE_ID, NOM_LOT_BILLET, DESCRIPTION) VALUES ($1, $2, $3, $4) RETURNING *',
        [lot_billet_id, lotBillet.activite_id, lotBillet.nom_lot_billet, lotBillet.description]
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

module.exports = {
    addLotBillet,
    updateLotBillet,
    deleteLotBillet,
    getAllLotBillets
};