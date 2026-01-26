import express from 'express';

const {getSansBillets, addSansBillet, updateSansBillet, deleteSansBillet} = require('../controllers/sans_billets.controller');

const router = express.Router();

/**
 * @swagger
 * /api/sans_billets:
 *   get:
 *     summary: Récupérer la liste des sans billets
 *     tags: ["Sans Billets"]
 *     responses:
 *       200:
 *         description: Liste des sans billets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sans_billet_id:
 *                     type: string
 *                   montant:
 *                     type: number
 *                   membre_id:
 *                     type: string
 *                   activite_id:
 *                     type: number
 *                   date_don:
 *                     type: string
 *                     format: date
 *                   nom_membre:
 *                     type: string
 *                   prenom_membre:
 *                     type: string
 */
router.get('/', getSansBillets);

/**
 * @swagger
 * /api/sans_billets/add:
 *   post:
 *     summary: Ajouter un nouveau sans billet
 *     tags: ["Sans Billets"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               montant:
 *                 type: number
 *               membre_id:
 *                 type: string
 *               activite_id:
 *                 type: number
 *               date_don:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Sans billet ajouté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sans_billet_id:
 *                   type: string
 *                 montant:
 *                   type: number
 *                 membre_id:
 *                   type: string
 *                 activite_id:
 *                   type: number
 *                 date_don:
 *                   type: string
 *                   format: date
 *                 nom_membre:
 *                   type: string
 *                 prenom_membre:
 *                   type: string
 */
router.post('/add', addSansBillet);

/**
 * @swagger
 * /api/sans_billets/update/{id}:
 *   put:
 *     summary: Mettre à jour un sans billet
 *     tags: ["Sans Billets"]
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
 *               montant:
 *                 type: number
 *               membre_id:
 *                 type: string
 *               activite_id:
 *                 type: number
 *               date_don:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Sans billet mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sans_billet_id:
 *                   type: string
 *                 montant:
 *                   type: number
 *                 membre_id:
 *                   type: string
 *                 activite_id:
 *                   type: number
 *                 date_don:
 *                   type: string
 *                   format: date
 *                 nom_membre:
 *                   type: string
 *                 prenom_membre:
 *                   type: string
 *       404:
 *         description: Sans billet non trouvé
 */
router.put('/update/:id', updateSansBillet);

/**
 * @swagger
 * /api/sans_billets/delete/{id}:
 *   delete:
 *     summary: Supprimer un sans billet
 *     tags: ["Sans Billets"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sans billet supprimé
 *       404:
 *         description: Sans billet non trouvé
 */
router.delete('/delete/:id', deleteSansBillet);

module.exports = router;
