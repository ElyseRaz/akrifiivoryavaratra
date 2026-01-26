import express from 'express';
import { getActivities, getActivity, createActivity, updateActivity, deleteActivity } from '../controllers/activities.controller';
const router = express.Router();

/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Récupérer la liste des activités
 *     tags: ["Activités"]
 *     responses:
 *       200:
 *         description: Liste des activités
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nom:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date_activite:
 *                     type: string
 *                     format: date-time
 */

/**
 * @swagger
 * /api/activities/{id}:
 *   get:
 *     summary: Récupérer une activité par ID
 *     tags: ["Activités"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'activité
 *       404:
 *         description: Activité non trouvée
 */

/**
 * @swagger
 * /api/activities/add:
 *   post:
 *     summary: Ajouter une nouvelle activité
 *     tags: ["Activités"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               date_activite:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Activité ajoutée
 */

/**
 * @swagger
 * /api/activities/update/{id}:
 *   put:
 *     summary: Mettre à jour une activité
 *     tags: ["Activités"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               date_activite:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Activité mise à jour
 */

/**
 * @swagger
 * /api/activities/delete/{id}:
 *   delete:
 *     summary: Supprimer une activité
 *     tags: ["Activités"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activité supprimée
 */

router.get('/', getActivities);
router.get('/:id', getActivity);
router.post('/add', createActivity);
router.put('/update/:id', updateActivity);
router.delete('/delete/:id', deleteActivity);

module.exports = router;