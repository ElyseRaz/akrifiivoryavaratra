import express from 'express';

const {addLotBillet, getLotBillets, getLotBillet, updateLotBillet, deleteLotBillet, generateBillets, getBilletsByActivite} = require('../controllers/lot_billet.controller');

const router = express.Router();


/**
 * @swagger
 * /api/lot_billet:
 *   get:
 *     summary: Récupérer la liste des lots de billets
 *     tags: ["Lot de Billets"]
 *     responses:
 *       200:
 *         description: Liste des lots de billets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LotBillet'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getLotBillets);

/**
 * @swagger
 * /api/lot_billet/add:
 *   post:
 *     summary: Ajouter un nouveau lot de billet
 *     tags: ["Lot de Billets"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activite_id
 *               - nom_lot_billet
 *             properties:
 *               activite_id:
 *                 type: integer
 *                 description: ID de l'activité associée
 *               nom_lot_billet:
 *                 type: string
 *                 description: Nom du lot de billet
 *               description:
 *                 type: string
 *                 description: Description du lot de billet
 *             example:
 *               activite_id: 1
 *               nom_lot_billet: "Lot Standard"
 *               description: "Lot de billets standard"
 *     responses:
 *       201:
 *         description: Lot de billet créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LotBillet'
 *       500:
 *         description: Erreur serveur
 */
router.post('/add', addLotBillet);

/**
 * @swagger
 * /api/lot_billet/update/{id}:
 *   put:
 *     summary: Mettre à jour un lot de billet
 *     tags: ["Lot de Billets"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du lot de billet à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activite_id:
 *                 type: integer
 *                 description: ID de l'activité associée
 *               nom_lot_billet:
 *                 type: string
 *                 description: Nom du lot de billet
 *               description:
 *                 type: string
 *                 description: Description du lot de billet
 *             example:
 *               nom_lot_billet: "Lot Premium"
 *               description: "Lot de billets premium mis à jour"
 *     responses:
 *       200:
 *         description: Lot de billet mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LotBillet'
 *       404:
 *         description: Lot de billet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/update/:id', updateLotBillet);

/**
 * @swagger
 * /api/lot_billet/delete/{id}:
 *   delete:
 *     summary: Supprimer un lot de billet
 *     tags: ["Lot de Billets"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du lot de billet à supprimer
 *     responses:
 *       200:
 *         description: Lot de billet supprimé avec succès
 *       404:
 *         description: Lot de billet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/delete/:id', deleteLotBillet);

/**
 * @swagger
 * /api/lot_billet/generate:
 *   post:
 *     summary: Générer les billets pour un lot
 *     tags: ["Lot de Billets"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lot_billet_id:
 *                 type: string
 *               prix_unitaire:
 *                 type: number
 *     responses:
 *       200:
 *         description: Billets générés avec succès
 *       404:
 *         description: Lot de billet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/generate', generateBillets);

/**
 * @swagger
 * /api/lot_billet/billets/{activite_id}:
 *   get:
 *     summary: Récupérer tous les billets pour une activité
 *     tags: ["Lot de Billets"]
 *     parameters:
 *       - in: path
 *         name: activite_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'activité
 *     responses:
 *       200:
 *         description: Liste des billets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Billet'
 *       500:
 *         description: Erreur serveur
 */
router.get('/billets/:activite_id', getBilletsByActivite);

module.exports = router;