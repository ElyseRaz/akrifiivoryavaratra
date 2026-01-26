import express from 'express';
import { getMembers, getMember, addMember, updateMember, deleteMember } from '../controllers/members.controller';
const router = express.Router();

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Récupérer la liste des membres
 *     tags: ["Membres"]
 *     responses:
 *       200:
 *         description: Liste des membres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   membre_id:
 *                     type: string
 *                   nom_membre:
 *                     type: string
 *                   prenom_membre:
 *                     type: string
 *                   contact_membre:
 *                     type: string
 */

/**
 * @swagger
 * /api/members/{id}:
 *   get:
 *     summary: Récupérer un membre par ID
 *     tags: ["Membres"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du membre
 *       404:
 *         description: Membre non trouvé
 */

/**
 * @swagger
 * /api/members/add:
 *   post:
 *     summary: Ajouter un nouveau membre
 *     tags: ["Membres"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_membre:
 *                 type: string
 *               prenom_membre:
 *                 type: string
 *               contact_membre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Membre ajouté
 */

/**
 * @swagger
 * /api/members/update/{id}:
 *   put:
 *     summary: Mettre à jour un membre
 *     tags: ["Membres"]
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
 *               nom_membre:
 *                 type: string
 *               prenom_membre:
 *                 type: string
 *               contact_membre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membre mis à jour
 */

/**
 * @swagger
 * /api/members/delete/{id}:
 *   delete:
 *     summary: Supprimer un membre
 *     tags: ["Membres"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membre supprimé
 */

router.get('/', getMembers);
router.get('/:id', getMember);
router.post('/add', addMember);
router.put('/update/:id', updateMember);
router.delete('/delete/:id', deleteMember);

module.exports = router;