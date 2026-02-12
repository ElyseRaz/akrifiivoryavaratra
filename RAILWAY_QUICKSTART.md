# 🚀 Déploiement Rapide sur Railway

## Checklist Rapide

- [ ] Compte Railway créé sur [railway.app](https://railway.app)
- [ ] Git configuré et dépôt cloné
- [ ] Variables d'environnement définies localement
- [ ] Application testée localement

## 1️⃣ Initialiser un Projet Railway

```bash
# Installer le CLI Railway (optionnel mais recommandé)
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser le projet dans votre dépôt
railway init
```

## 2️⃣ Configuration Rapide (via Dashboard)

### Créer PostgreSQL
1. Dashboard Railway → **New** → **Database** → **PostgreSQL**
2. Railway crée automatiquement `DATABASE_URL`

### Déployer le Backend
1. **New** → **Deploy from GitHub repo**
2. Sélectionner votre repo
3. Dans **Variables**, ajouter :
   ```
   DATABASE_URL=auto (Railway le configure)
   JWT_SECRET=<générer_une_clé>
   NODE_ENV=production
   ```
4. **Settings** → **Build Command**: `npm run build`
5. **Settings** → **Start Command**: `npm start`

### Déployer le Frontend
1. **New** → **Deploy from GitHub repo** (même repo)
2. Dans **Variables**:
   ```
   VITE_BACKEND_URL=https://<backend-url>.railway.app/api
   ```

## 3️⃣ Test Avant Déploiement

```bash
# Backend
cd backend
npm install
npm run build
npm start

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run build
npm run preview
```

## 🔑 Variables d'Environnement Requises

### Backend
```env
PORT=3000
DATABASE_URL=<fourni par Railway>
JWT_SECRET=<clé_secrète_longue>
NODE_ENV=production
```

### Frontend
```env
VITE_BACKEND_URL=https://your-backend.railway.app/api
```

## ✨ Problèmes Courants

| Problème | Solution |
|----------|----------|
| Frontend ne se connecte pas | Vérifiez `VITE_BACKEND_URL` avec l'URL réelle du backend |
| Erreur de base de données | Assurez-vous que `DATABASE_URL` est défini |
| Build fail | Vérifiez que `npm run build` fonctionne localement |

## 📚 Fichiers Clés

- `railway.json` - Configuration du projet
- `backend/Dockerfile` - Build optimisé backend
- `frontend/Dockerfile` - Build optimisé frontend
- `DEPLOYMENT_RAILWAY.md` - Guide complet

## 🎯 URLs Après Déploiement

- Backend API: `https://<your-backend>.railway.app/api`
- Frontend: `https://<your-frontend>.railway.app`
- Swagger Docs: `https://<your-backend>.railway.app/api-docs`

---

**Besoin d'aide ?** Consultez [docs.railway.app](https://docs.railway.app)
