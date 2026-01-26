const Activity = require('../models/activities.model');

export const getActivities = async (req: any, res: any) => {
    try {
        const activities = await Activity.getAllActivities();
        res.json(activities);
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
    } catch (error) {
        res.status(500).json({ error: 'Erreur pour la suppression de l\'activité' });
    }
};