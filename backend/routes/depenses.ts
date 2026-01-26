import express from "express"
import { get } from "node:http";
const { addDepense, deleteDepense, getDepense, getDepenses, updateDepense,getSumDepensesByActivity,getSumDepenses } = require("../controllers/depense.controller");

const router = express.Router();

/**
 * @swagger
 * /api/depenses:
 *   get:
 *     summary: Récupérer la liste des dépenses
 *     tags: ["Dépenses"]
 *     responses:
 *       200:
 *         description: Liste des dépenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   activity_id:
 *                     type: string
 *                   nom_depense:
 *                     type: string
 *                   piece_justificatif:
 *                     type: string
 *                   date_depense:
 *                     type: string
 *                     format: date-time
 *                   montant:
 *                     type: number
 */

/**
 * @swagger
 * /api/depenses/{id}:
 *   get:
 *     summary: Récupérer une dépense par ID
 *     tags: ["Dépenses"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la dépense
 *       404:
 *         description: Dépense non trouvée
 */

/**
 * @swagger
 * /api/depenses/activity/sum/{activityId}:
 *   get:
 *     summary: Récupérer la somme des dépenses pour une activité
 *     tags: ["Dépenses"]
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'activité
 *     responses:
 *       200:
 *         description: Somme des dépenses pour l'activité
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 1500.00
 *       404:
 *         description: Activité non trouvée
 */

/**
 * @swagger
 * /api/depenses/sum/all:
 *   get:
 *     summary: Récupérer la somme totale de toutes les dépenses
 *     tags: ["Dépenses"]
 *     responses:
 *       200:
 *         description: Somme totale des dépenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 5000.00
 */


/**
 * @swagger
 * /api/depenses/add:
 *   post:
 *     summary: Ajouter une nouvelle dépense
 *     tags: ["Dépenses"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activity_id:
 *                 type: string
 *               nom_depense:
 *                 type: string
 *               piece_justificatif:
 *                 type: string
 *               date_depense:
 *                 type: string
 *                 format: date-time
 *               montant:
 *                 type: number
 *     responses:
 *       201:
 *         description: Dépense ajoutée
 */

/**
 * @swagger
 * /api/depenses/update/{id}:
 *   put:
 *     summary: Mettre à jour une dépense
 *     tags: ["Dépenses"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activity_id:
 *                 type: string
 *               nom_depense:
 *                 type: string
 *               piece_justificatif:
 *                 type: string
 *               date_depense:
 *                 type: string
 *                 format: date-time
 *               montant:
 *                 type: number
 *     responses:
 *       200:
 *         description: Dépense mise à jour
 */

/**
 * @swagger
 * /api/depenses/delete/{id}:
 *   delete:
 *     summary: Supprimer une dépense
 *     tags: ["Dépenses"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dépense supprimée
 */



router.get('/',getDepenses);
router.get('/:id',getDepense);
router.get('/activity/sum/:activityId',getSumDepensesByActivity);
router.get('/sum/all',getSumDepenses);
router.post('/add',addDepense);
router.put('/update/:id',updateDepense);
router.delete('/delete/:id',deleteDepense);

module.exports = router;