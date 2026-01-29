const db = require('../config/db');

export interface Quete {
    id : string;
    date_quete : Date;
    nom_donnateur : string;
    montant : number;
    piece_justificatif ?: string;
}

const generateQueteId = async(): Promise<string> => {
    const result = await db.query('SELECT MAX(QUETE_ID) as max_id FROM QUETE');
    const maxId = result.rows[0].max_id;
    if(!maxId){
        return 'QTE-001';
    }
    const num = parseInt(maxId.split('-')[1]) + 1;
    return `QTE-${num.toString().padStart(3,'0')}`;
}

const addQuete = async(quete: Omit<Quete,'id'>): Promise<Quete> => {
    const id = await generateQueteId();
    const result = await db.query(
        'INSERT INTO QUETE (QUETE_ID, DATE_QUETE, NOM_DONNATEUR, MONTANT_QUETE, PIECE_JUSTIFICATIF) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, quete.date_quete, quete.nom_donnateur, quete.montant, quete.piece_justificatif]
    );
    return result.rows[0];
}

const getAllQuetes = async(): Promise<Quete[]> => {
    const result = await db.query('SELECT * FROM QUETE');
    return result.rows;
}

const getQuete = async(id: string): Promise<Quete | null> => {
    const result = await db.query('SELECT * FROM QUETE WHERE QUETE_ID = $1', [id]);
    return result.rows[0] || null;
}

const updateQuete = async(id: string, quete: Partial<Omit<Quete,'id'>>): Promise<Quete | null> => {
    const fields = [];
    const values = [];
    let index = 1;
    for(const key in quete){
        let columnName = key.toUpperCase();
        // Mapper montant vers MONTANT_QUETE
        if(key === 'montant') {
            columnName = 'MONTANT_QUETE';
        }
        fields.push(`${columnName} = $${index}`);
        values.push((quete as any)[key]);
        index++;
    }
    values.push(id);
    const result = await db.query(
        `UPDATE QUETE SET ${fields.join(', ')} WHERE QUETE_ID = $${index} RETURNING *`,
        values
    );
    return result.rows[0] || null;
}

const deleteQuete = async(id: string): Promise<boolean> => {
    const result = await db.query('DELETE FROM QUETE WHERE QUETE_ID = $1', [id]);
    return result.rowCount > 0;
}


const getSumQuetes = async(): Promise<number> => {
    const result = await db.query('SELECT SUM(MONTANT_QUETE) as total FROM QUETE');
    return result.rows[0].total || 0;
}


module.exports = {
    addQuete,
    getAllQuetes,
    getQuete,
    updateQuete,
    deleteQuete,
    getSumQuetes
};

