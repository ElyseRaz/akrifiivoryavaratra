const db = require('../config/db');

export interface Activity {
    id: number;
    nom: string;
    description ?: string;
    date_activite: Date;
}

export const getAllActivities = async (limit: number = 10, offset: number = 0): Promise<Activity[]> => {
    const result = await db.query('SELECT ACTIVITE_ID as id, NOM as nom, DESCRIPTION as description, DATE_ACTIVITE as date_activite FROM ACTIVITES ORDER BY DATE_ACTIVITE DESC LIMIT $1 OFFSET $2', [limit, offset]);
    return result.rows;
}

export const getTotalActivities = async (): Promise<number> => {
    const result = await db.query('SELECT COUNT(*) as total FROM ACTIVITES');
    return parseInt(result.rows[0].total, 10);
}

export const getActivityById = async (id: number): Promise<Activity | null> => {
    const result = await db.query('SELECT ACTIVITE_ID as id, NOM as nom, DESCRIPTION as description, DATE_ACTIVITE as date_activite FROM ACTIVITES WHERE ACTIVITE_ID = $1', [id]);
    return result.rows[0] || null;
}

export const addActivity = async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
    const result = await db.query(
        'INSERT INTO ACTIVITES (NOM, DESCRIPTION, DATE_ACTIVITE) VALUES ($1, $2, $3) RETURNING ACTIVITE_ID as id, NOM as nom, DESCRIPTION as description, DATE_ACTIVITE as date_activite',
        [activity.nom, activity.description, activity.date_activite]
    );
    return result.rows[0];
}

export const updateActivity = async (id: number, activity: Partial<Omit<Activity, 'id'>>): Promise<Activity | null> => {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in activity) {
        fields.push(`${key.toUpperCase()} = $${index}`);
        values.push((activity as any)[key]);
        index++;
    }
    values.push(id);
    const result = await db.query(
        `UPDATE ACTIVITES SET ${fields.join(', ')} WHERE ACTIVITE_ID = $${index} RETURNING ACTIVITE_ID as id, NOM as nom, DESCRIPTION as description, DATE_ACTIVITE as date_activite`,
        values
    );
    return result.rows[0] || null;
}

export const deleteActivity = async (id: number): Promise<boolean> => {
    const result = await db.query('DELETE FROM ACTIVITES WHERE ACTIVITE_ID = $1', [id]);
    return result.rowCount > 0;
}