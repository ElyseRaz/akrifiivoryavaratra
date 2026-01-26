const db = require('../config/db');

export interface Activity {
    id: number;
    nom: string;
    description ?: string;
    date_activite: Date;
}

export const getAllActivities = async (): Promise<Activity[]> => {
    const result = await db.query('SELECT * FROM ACTIVITES');
    return result.rows;
}

export const getActivityById = async (id: number): Promise<Activity | null> => {
    const result = await db.query('SELECT * FROM ACTIVITES WHERE ACTIVITE_ID = $1', [id]);
    return result.rows[0] || null;
}

export const addActivity = async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
    const result = await db.query(
        'INSERT INTO ACTIVITES (NOM, DESCRIPTION, DATE_ACTIVITE) VALUES ($1, $2, $3) RETURNING *',
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
        `UPDATE ACTIVITES SET ${fields.join(', ')} WHERE ACTIVITE_ID = $${index} RETURNING *`,
        values
    );
    return result.rows[0] || null;
}

export const deleteActivity = async (id: number): Promise<boolean> => {
    const result = await db.query('DELETE FROM ACTIVITES WHERE ACTIVITE_ID = $1', [id]);
    return result.rowCount > 0;
}