const Activity = require('../models/activities.model');

export const getActivities = async (req: any, res: any) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const activities = await Activity.getAllActivities(limit, offset);
        const total = await Activity.getTotalActivities();

        res.json({
            activities,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
        res.status(200);
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la récupération des activités' });
    }
};

export const getActivity = async (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    try {
        const activity = await Activity.getActivityById(id);
        if (activity) {
            res.json(activity);
            res.status(200);
        }
        else {
            res.status(404).json({ error: 'Activité non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la récupération de l\'activité' });
    }
};

export const createActivity = async (req: any, res: any) => {
    const newActivity = req.body;
    try {
        const createdActivity = await Activity.addActivity(newActivity);
        res.status(201).json(createdActivity);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur pour la création de l\'activité' });
        console.error(error);
    }
};

export const updateActivity = async (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    const updatedData = req.body;
    try {
        const updatedActivity = await Activity.updateActivity(id, updatedData);
        if (updatedActivity) {
            res.json(updatedActivity);
            res.status(200);
        }
        else {
            res.status(404).json({ error: 'Activité non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la mise à jour de l\'activité' });
    }
};

export const deleteActivity = async (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    try {
        const success = await Activity.deleteActivity(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Activité non trouvée' });
        }
    } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        if (error.code === '23503') { // Foreign key violation
            res.status(409).json({
                error: 'Impossible de supprimer cette activité car elle est liée à des dépenses ou des lots de billets'
            });
        } else {
            res.status(500).json({ error: 'Erreur pour la suppression de l\'activité' });
        }
    }
};