const db = require('../config/db');

export interface Member {
    id: string;
    nom_membre: string;
    prenom_membre: string;
    contact ?: string;
}

const generateMemberId = async (): Promise<string> => {
    const result = await db.query('SELECT MAX(MEMBRE_ID) as max_id FROM MEMBRE');
    const maxId = result.rows[0].max_id;
    if (!maxId) {
        return 'MBR-001';
    }
    const num = parseInt(maxId.split('-')[1]) + 1;
    return `MBR-${num.toString().padStart(3, '0')}`;
};


const getAllMembers = async (): Promise<Member[]> => {
    const result = await db.query('SELECT * FROM MEMBRE');
    return result.rows;
}

const getMemberById = async (id: string): Promise<Member | null> => {
    const result = await db.query('SELECT * FROM MEMBRE WHERE MEMBRE_ID = $1', [id]);
    return result.rows[0] || null;
}

const addMember = async (member: Omit<Member, 'id'>): Promise<Member> => {
    const id = await generateMemberId();
    const result = await db.query(
        'INSERT INTO MEMBRE (MEMBRE_ID, NOM_MEMBRE, PRENOM_MEMBRE, CONTACT) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, member.nom_membre, member.prenom_membre, member.contact]
    );
    return result.rows[0];
}

const updateMember = async (id: string, member: Partial<Omit<Member, 'id'>>): Promise<Member | null> => {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in member) {
        fields.push(`${key.toUpperCase()} = $${index}`);
        values.push((member as any)[key]);
        index++;
    }
    values.push(id);
    const result = await db.query(
        `UPDATE MEMBRE SET ${fields.join(', ')} WHERE MEMBRE_ID = $${index} RETURNING *`,
        values
    );
    return result.rows[0] || null;
}


const deleteMember = async (id: string): Promise<boolean> => {
    const result = await db.query('DELETE FROM MEMBRE WHERE MEMBRE_ID = $1', [id]);
    return result.rowCount > 0;
}

module.exports = {
    generateMemberId,
    getAllMembers,
    getMemberById,
    addMember,
    updateMember,
    deleteMember
};