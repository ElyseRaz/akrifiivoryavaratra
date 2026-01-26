import express from 'express';

const {addQuete, getQuetes, getQuete, updateQuete, deleteQuete,getSumQuetes} = require('../controllers/quete.controller');



const router = express.Router();

/**
 * @swagger
 * /api/quete:
 *   get:
 *     summary: Récupérer toutes les quêtes
 *     tags: [Quêtes]
 *     responses:
 *       200:
 *         description: Liste de toutes les quêtes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "QTE-001"
 *                   date_quete:
 *                     type: string
 *                     format: date
 *                     example: "2023-10-01"
 *                   nom_donnateur:
 *                     type: string
 *                     example: "Jean Dupont"
 *                   montant:
 *                     type: number
 *                     example: 100.50
 *                   piece_justificatif:
 *                     type: string
 *                     example: "facture.pdf"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur pour la récupération des quêtes"
 */
router.get('/', getQuetes);

/**
 * @swagger
 * /api/quete/{id}:
 *   get:
 *     summary: Récupérer une quête par ID
 *     tags: [Quêtes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la quête
 *         example: "QTE-001"
 *     responses:
 *       200:
 *         description: Détails de la quête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "QTE-001"
 *                 date_quete:
 *                   type: string
 *                   format: date
 *                   example: "2023-10-01"
 *                 nom_donnateur:
 *                   type: string
 *                   example: "Jean Dupont"
 *                 montant:
 *                   type: number
 *                   example: 100.50
 *                 piece_justificatif:
 *                   type: string
 *                   example: "facture.pdf"
 *       404:
 *         description: Quête non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Quête non trouvée"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur pour la récupération de la quête"
 */
router.get('/:id', getQuete);



/**
 * @swagger
 * /api/quete/sum:
 *   get:
 *     summary: Récupérer la somme totale des montants des quêtes
 *     tags: [Quêtes]
 *     responses:
 *       200:
 *         description: Somme totale des quêtes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 1500.75
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur pour la récupération de la somme des quêtes"
 */
router.get('/sum', getSumQuetes);

/**
 * @swagger
 * /api/quete/add:
 *   post:
 *     summary: Ajouter une nouvelle quête
 *     tags: [Quêtes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date_quete
 *               - nom_donnateur
 *               - montant
 *               - piece_justificatif
 *             properties:
 *               date_quete:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-01"
 *               nom_donnateur:
 *                 type: string
 *                 example: "Jean Dupont"
 *               montant:
 *                 type: number
 *                 example: 100.50
 *               piece_justificatif:
 *                 type: string
 *                 example: "facture.pdf"
 *     responses:
 *       201:
 *         description: Quête créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "QTE-001"
 *                 date_quete:
 *                   type: string
 *                   format: date
 *                   example: "2023-10-01"
 *                 nom_donnateur:
 *                   type: string
 *                   example: "Jean Dupont"
 *                 montant:
 *                   type: number
 *                   example: 100.50
 *                 piece_justificatif:
 *                   type: string
 *                   example: "facture.pdf"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur pour la création de la quête"
 */
router.post('/add', addQuete);

/**
 * @swagger
 * /api/quete/update/{id}:
 *   put:
 *     summary: Mettre à jour une quête
 *     tags: [Quêtes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la quête à mettre à jour
 *         example: "QTE-001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_quete:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-01"
 *               nom_donnateur:
 *                 type: string
 *                 example: "Jean Dupont"
 *               montant:
 *                 type: number
 *                 example: 100.50
 *               piece_justificatif:
 *                 type: string
 *                 example: "facture.pdf"
 *     responses:
 *       200:
 *         description: Quête mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "QTE-001"
 *                 date_quete:
 *                   type: string
 *                   format: date
 *                   example: "2023-10-01"
 *                 nom_donnateur:
 *                   type: string
 *                   example: "Jean Dupont"
 *                 montant:
 *                   type: number
 *                   example: 100.50
 *                 piece_justificatif:
 *                   type: string
 *                   example: "facture.pdf"
 *       404:
 *         description: Quête non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Quête non trouvée"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur pour la mise à jour de la quête"
 */
router.put('/update/:id', updateQuete);

/**
 * @swagger
 * /api/quete/delete/{id}:
 *   delete:
 *     summary: Supprimer une quête
 *     tags: [Quêtes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la quête à supprimer
 *         example: "QTE-001"
 *     responses:
 *       204:
 *         description: Quête supprimée avec succès
 *       404:
 *         description: Quête non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Quête non trouvée"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur pour la suppression de la quête"
 */
router.delete('/delete/:id', deleteQuete);

module.exports = router;