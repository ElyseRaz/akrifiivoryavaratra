# 📱 Guide de Déploiement sur Railway

## 🚀 Déployer votre projet AKRIFI sur Railway

Ce guide vous explique comment déployer votre application full-stack (Backend Express + Frontend React) sur Railway.

### ✅ Prérequis

- Un compte [Railway.app](https://railway.app) (inscription gratuite)
- Git installé et configuré
- Une connexion Internet

### 📋 Étapes de déploiement

#### 1. **Préparer le dépôt Git**

Assurez-vous que tous les fichiers sont commités :

```bash
git add .
git commit -m "Configuration Railway"
git push origin main
```

#### 2. **Configurer PostgreSQL sur Railway**

1. Allez sur [Railway.app](https://railway.app)
2. Créez un nouveau projet
3. Sélectionnez **"+ New"** → **"Database"** → **"PostgreSQL"**
4. Railway créera automatiquement une variable d'environnement `DATABASE_URL`

#### 3. **Déployer le Backend**

1. Dans votre projet Railway, cliquez **"+ New"** → **"Deploy from GitHub repo"**
2. Sélectionnez votre dépôt
3. Une fois déployé, allez dans les **Variables** du service backend
4. Ajoutez les variables d'environnement suivantes :

```
PORT=3000
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=akrifi
DB_PORT=5432
JWT_SECRET=your_jwt_secret_here
```

> **Note** : Railway fournit automatiquement `DATABASE_URL`. Vous pouvez l'utiliser à la place des variables individuelles.

5. Dans **Settings**, définissez :
   - **Start Command** : `npm run build && npm start`

#### 4. **Configurer le Frontend**

1. Créez un nouveau service dans votre projet Railroad
2. Sélectionnez **"+ New"** → **"Deploy from GitHub repo"** (même dépôt)
3. Railway devrait détecter automatiquement qu'il y a un frontend
4. Ajoutez les variables d'environnement :

```
VITE_BACKEND_URL=https://your-backend-url.railway.app/api
```

Remplacez `your-backend-url` par l'URL réelle de votre backend (disponible dans Railway).

5. Dans **Settings**, définissez :
   - **Start Command** : `npm run build && npm run preview`
   - Ou utilisez **"Static Site"** pour héberger une SPA

#### 5. **Configuration des Variables d'Environnement**

Pour le backend, utilisez ces variables (Railway les gère automatiquement) :

| Variable | Valeur |
|----------|--------|
| `PORT` | 3000 ou défini par Railway |
| `DATABASE_URL` | Fourni par Railway PostgreSQL |
| `JWT_SECRET` | Votre secret (générez un long string aléatoire) |
| `NODE_ENV` | production |

Pour le frontend :

| Variable | Valeur |
|----------|--------|
| `VITE_BACKEND_URL` | https://your-backend-url.railway.app/api |

#### 6. **Migration de Base de Données**

Une fois le backend déployé :

1. Connectez-vous via SSH ou utilisez la console Railway
2. Exécutez votre script de migration :

```bash
npm run create-user
# ou exécutez vos migrations SQL
```

### 🔗 Architecture du Déploiement

```
Railway Project
├── Backend Service (Node.js)
│   ├── Port: 3000
│   └── Connecté à PostgreSQL
├── Frontend Service (React)
│   ├── Port: 3000 (Vite preview)
│   └── Connecté au Backend Service
└── PostgreSQL Database
    └── DATABASE_URL
```

### 📊 Fichiers de Configuration

Les fichiers suivants ont été créés/modifiés pour supporter Railway :

- **`railway.json`** - Configuration principale de Railway
- **`backend/Procfile`** - Commandes pour le build/start du backend
- **`backend/.env.example`** - Template des variables Backend
- **`frontend/.env.example`** - Template des variables Frontend
- **Mise à jour `backend/index.ts`** - Utilise `process.env.PORT` dynamiquement
- **Mise à jour `backend/package.json`** - Scripts build et start corrigés

### 🐛 Dépannage

**Le frontend ne se connecte pas au backend :**
- Vérifiez que `VITE_BACKEND_URL` utilise l'URL complète du backend Railway
- Assurez-vous que CORS est activé côté backend

**Erreur de connexion à la base de données :**
- Vérifiez que la variable `DATABASE_URL` ou les variables de connexion sont correctes
- Assurez-vous que PostgreSQL est bien créé dans Railway

**Port déjà utilisé :**
- Railway assignera automatiquement un port. Vérifiez les logs.

### 📚 Ressources Utiles

- [Documentation Railway](https://docs.railway.app/)
- [Déployer Node.js sur Railway](https://docs.railway.app/starters/nodejs)
- [Configurer PostgreSQL sur Railway](https://docs.railway.app/starters/postgresql)

### ✨ Prochaines Étapes

1. **Domaine personnalisé** : Configurez un domaine custom dans Railway
2. **SSL/HTTPS** : Railway gère les certificats automatiquement
3. **Monitoring** : Utilisez le dashboard Railway pour surveiller vos services
4. **CI/CD** : Railway déploie automatiquement à chaque push sur la branche main

---

**Questions ?** Consultez la documentation Railway ou contactez le support.
