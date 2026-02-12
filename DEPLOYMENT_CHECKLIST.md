# 🎯 Checklist de Déploiement Rails

## ✅ Avant le Déploiement

- [ ] Tester `npm run build` localement pour le backend
- [ ] Tester `npm run build` localement pour le frontend
- [ ] Vérifier que `.env` est dans `.gitignore`
- [ ] Vérifier qu'aucun secret n'est commité
- [ ] Exécuter le script de vérification :
  - Windows: `.\pre-deploy-check.ps1`
  - Unix: `bash pre-deploy-check.sh`
- [ ] Tous les tests passent localement
- [ ] Code mergé dans `main` branch
- [ ] Git push complété

## ➕ Configuration Rail

### Créer la Base de Données

- [ ] Créer PostgreSQL dans Railway
- [ ] Vérifier que `DATABASE_URL` est défini
- [ ] Tester la connexion

### Configurer le Backend

- [ ] Créer un nouveau service (Node.js)
- [ ] Connecter au dépôt GitHub
- [ ] Ajouter les variables d'environnement :
  ```
  DATABASE_URL = [AUTO]
  JWT_SECRET = [GÉNÉRER]
  NODE_ENV = production
  ```
- [ ] Paramètres : Build = `npm run build`, Start = `npm start`
- [ ] Déploiement lancé

### Configurer le Frontend

- [ ] Créer un nouveau service (Node.js ou Static)
- [ ] Ajouter les variables d'environnement :
  ```
  VITE_BACKEND_URL = https://[backend-url].railway.app/api
  ```
- [ ] Paramètres : Build = `npm run build`, Start = `npm run preview` (ou servir statiquement)
- [ ] Déploiement lancé

## 🧪 Tests Post-Déploiement

- [ ] Backend accessible à `https://[backend-url].railway.app`
- [ ] Swagger docs disponibles à `https://[backend-url].railway.app/api-docs`
- [ ] Frontend charge correctement
- [ ] Frontend se connecte au backend sans erreurs CORS
- [ ] Authentification fonctionne
- [ ] Créer un utilisateur de test (si applicable)
- [ ] Vérifier les logs sur le dashboard Railway

## 🚨 En Cas d'Erreur

### Backend n'affiche pas les logs

```bash
> railway logs [backend-service-id] --tail 100
```

### Frontend blanc ou ne charge pas

- Vérifier `VITE_BACKEND_URL` est correct
- Vérifier les logs du navigateur (F12)
- Vérifier que la build est réussie

### Connexion à PostgreSQL échoue

- Vérifier que PostgreSQL est créé
- Vérifier que `DATABASE_URL` est défini
- Vérifier la syntaxe de connexion

## 🔄 Redéployer After Changes

```bash
# Faire les changements
git add .
git commit -m "Description des changements"
git push origin main

# Railway redéploie automatiquement
# Vérifier le status sur le dashboard
```

## 📊 Monitoring et Maintenance

- [ ] Configurer les alertes dans Railway (optionnel)
- [ ] Ajouter un domaine personnalisé (optionnel)
- [ ] Configurer les backups PostgreSQL
- [ ] Mettre en place une stratégie de logs
- [ ] Planifier les mises à jour

## 🎉 Après le Déploiement Réussi

- [ ] Documenter l'URL de production
- [ ] Mettre à jour les configurations clients
- [ ] Informer les utilisateurs
- [ ] Surveiller les logs les premiers jours
- [ ] Préparer un plan de rollback si nécessaire

## 📝 Notes et Liens Importants

```
Backend URL: https://[your-backend].railway.app
Frontend URL: https://[your-frontend].railway.app
API Docs: https://[your-backend].railway.app/api-docs
```

---

**Besoin d'aide ?** Consultez :
- `RAILWAY_QUICKSTART.md` - Démarrage rapide
- `DEPLOYMENT_RAILWAY.md` - Guide complet
- `RAILWAY_ADVANCED.md` - Configuration avancée
