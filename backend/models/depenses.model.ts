import { get } from "node:http";

const db = require("../config/db")

export interface Depense{
    id : string;
    activity_id : number;
    nom_depense : string;
    piece_justificatif : string;
    date_depense : Date;
    montant : number
}

const generateDepenseId = async(): Promise<string> => {
    const result = await db.query('SELECT MAX(DEPENSE_ID) as max_id FROM DEPENSE');
    const maxId = result.rows[0].max_id;
    if(!maxId){
        return 'DPS-001';
    }   
    const num = parseInt(maxId.split('-')[1]) + 1;
    return `DPS-${num.toString().padStart(3,'0')}`;
}

const addDepense = async(depense: Omit<Depense,'id'>): Promise<Depense> => {
    const id = await generateDepenseId();
    const result = await db.query(
        'INSERT INTO DEPENSE (DEPENSE_ID, ACTIVITE_ID, NOM_DEPENSE, PIECE_JUSTIFICATIF, DATE_DEPENSE, MONTANT) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [id, depense.activity_id, depense.nom_depense, depense.piece_justificatif, depense.date_depense, depense.montant]
    );
    return result.rows[0];
}

const getAllDepenses = async(): Promise<Depense[]> => {
    const result = await db.query('SELECT * FROM DEPENSE');
    return result.rows;
}

const getDepense = async(id: string): Promise<Depense | null> => {
    const result = await db.query('SELECT * FROM DEPENSE WHERE DEPENSE_ID = $1', [id]);
    return result.rows[0] || null;
}


const updateDepense = async(id: string, depense: Partial<Omit<Depense,'id'>>): Promise<Depense | null> => {
    const fields = [];
    const values = [];
    let index = 1;
    for(const key in depense){
        fields.push(`${key.toUpperCase()} = $${index}`);
        values.push((depense as any)[key]);
        index++;
    }
    values.push(id);
    const result = await db.query(
        `UPDATE DEPENSE SET ${fields.join(', ')} WHERE DEPENSE_ID = $${index} RETURNING *`,
        values
    );
    return result.rows[0] || null;
}

const deleteDepense = async(id: string): Promise<boolean> => {
    const result = await db.query('DELETE FROM DEPENSE WHERE DEPENSE_ID = $1', [id]);
    return result.rowCount > 0;
}

const getSumDepensesByActivity = async(activityId: number): Promise<number> => {
    const result = await db.query(
        'SELECT SUM(MONTANT) as total FROM DEPENSE WHERE ACTIVITE_ID = $1',
        [activityId]
    );
    return result.rows[0].total || 0;
}

const getSumDepenses = async(): Promise<number> => {
    const result = await db.query(
        'SELECT SUM(MONTANT) as total FROM DEPENSE'
    );
    return result.rows[0].total || 0;
}


module.exports = {
    addDepense,
    getAllDepenses,
    getDepense,
    updateDepense,
    deleteDepense,
    getSumDepensesByActivity,
    getSumDepenses
};
