import express from 'express';

const {getBillets, getBilletsByLot, addBillet, updateBillet, deleteBillet, getSumBilletsByLot, getSumBillets} = require('../controllers/billets.controller');

const router = express.Router();

/**
 * @swagger
 * /api/billets:
 *   get:
 *     summary: Récupérer la liste des billets
 *     tags: ["Billets"]
 *     responses:
 *       200:
 *         description: Liste des billets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   billet_id:
 *                     type: string
 *                   membre_id:
 *                     type: string
 *                   lot_billet_id:
 *                     type: string
 *                   numero:
 *                     type: number
 *                   statut:
 *                     type: string
 *                   prix_unitaire:
 *                     type: number
 *                   nom_membre:
 *                     type: string
 *                   prenom_membre:
 *                     type: string
 */
router.get('/', getBillets);

/**
 * @swagger
 * /api/billets/lot/{lot_billet_id}:
 *   get:
 *     summary: Récupérer les billets par lot
 *     tags: ["Billets"]
 *     parameters:
 *       - in: path
 *         name: lot_billet_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des billets du lot
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   billet_id:
 *                     type: string
 *                   membre_id:
 *                     type: string
 *                   lot_billet_id:
 *                     type: string
 *                   numero:
 *                     type: number
 *                   statut:
 *                     type: string
 *                   prix_unitaire:
 *                     type: number
 *                   nom_membre:
 *                     type: string
 *                   prenom_membre:
 *                     type: string
 */
router.get('/lot/:lot_billet_id', getBilletsByLot);

/**
 * @swagger
 * /api/billets/sum/lot/{lot_billet_id}:
 *   get:
 *     summary: Récupérer la somme des billets par lot
 *     tags: ["Billets"]
 *     parameters:
 *       - in: path
 *         name: lot_billet_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Somme des billets du lot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 */
router.get('/sum/lot/:lot_billet_id', getSumBilletsByLot);

/**
 * @swagger
 * /api/billets/sum:
 *   get:
 *     summary: Récupérer la somme totale des billets
 *     tags: ["Billets"]
 *     responses:
 *       200:
 *         description: Somme totale des billets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 */
router.get('/sum', getSumBillets);

/**
 * @swagger
 * /api/billets/add:
 *   post:
 *     summary: Ajouter un nouveau billet
 *     tags: ["Billets"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               membre_id:
 *                 type: string
 *               lot_billet_id:
 *                 type: string
 *               numero:
 *                 type: number
 *               statut:
 *                 type: string
 *               prix_unitaire:
 *                 type: number
 *     responses:
 *       201:
 *         description: Billet ajouté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 billet_id:
 *                   type: string
 *                 membre_id:
 *                   type: string
 *                 lot_billet_id:
 *                   type: string
 *                 numero:
 *                   type: number
 *                 statut:
 *                   type: string
 *                 prix_unitaire:
 *                   type: number
 *                 nom_membre:
 *                   type: string
 *                 prenom_membre:
 *                   type: string
 */
router.post('/add', addBillet);

/**
 * @swagger
 * /api/billets/update/{id}:
 *   put:
 *     summary: Mettre à jour un billet
 *     tags: ["Billets"]
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
 *               membre_id:
 *                 type: string
 *               lot_billet_id:
 *                 type: string
 *               numero:
 *                 type: number
 *               statut:
 *                 type: string
 *               prix_unitaire:
 *                 type: number
 *     responses:
 *       200:
 *         description: Billet mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 billet_id:
 *                   type: string
 *                 membre_id:
 *                   type: string
 *                 lot_billet_id:
 *                   type: string
 *                 numero:
 *                   type: number
 *                 statut:
 *                   type: string
 *                 prix_unitaire:
 *                   type: number
 *                 nom_membre:
 *                   type: string
 *                 prenom_membre:
 *                   type: string
 *       404:
 *         description: Billet non trouvé
 */
router.put('/update/:id', updateBillet);

/**
 * @swagger
 * /api/billets/delete/{id}:
 *   delete:
 *     summary: Supprimer un billet
 *     tags: ["Billets"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billet supprimé
 *       404:
 *         description: Billet non trouvé
 */
router.delete('/delete/:id', deleteBillet);

module.exports = router;