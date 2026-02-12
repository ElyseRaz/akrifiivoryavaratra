# Configuration supplémentaire pour Railway
# Ce fichier contient des informations supplémentaires et des configurations avancées

## 🐳 Utiliser Docker Localement

Avant de déployer sur Railway, vous pouvez tester avec Docker et docker-compose :

```bash
# Démarrer l'application complète
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

## 🌍 Variables d'Environnement Production

### Backend - Variables Essentielles
```env
# Port (Railway le configure automatiquement)
PORT=3000

# Base de données
DATABASE_URL=postgresql://user:password@host:5432/akrifi
# OU spécifier individuellement:
DB_HOST=postgres-service
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=akrifi

# Sécurité
JWT_SECRET=your_very_long_and_secure_secret_key_here

# Environment
NODE_ENV=production

# Optional - Uploads
UPLOAD_DIR=/tmp/uploads
```

### Frontend - Variables
```env
# URL du backend sur Railway
VITE_BACKEND_URL=https://your-backend-app-name.railway.app/api

# Environment
NODE_ENV=production
```

## 📊 Architecture de Déploiement Recommandée

```
Railway Project
│
├─ PostgreSQL Service
│  └─ Automatic DATABASE_URL variable
│
├─ Backend Service (Node.js)
│  ├─ Port: 3000 (auto)
│  ├─ Build: npm run build
│  ├─ Start: npm start
│  └─ Linked to PostgreSQL
│
└─ Frontend Service (Static/Nginx)
   ├─ Port: 80 (auto)
   └─ Build: npm run build
```

## 🔒 Sécurité - Recommandations

1. **JWT_SECRET**: Générez une clé cryptographiquement sécurisée
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Database Password**: Utilisez un mot de passe fort
3. **CORS**: Configurez les domaines autorisés
4. **Environment**: Toujours `production` en déploiement

## 📈 Surveillance et Logs

### Consulter les logs railway
```bash
railway logs --tail 100
```

### Health Check
Le backend inclut un health check automatique pour garantir sa disponibilité

## 🚨 Troubleshooting Avancé

### 1. Connexion à la base de données échoue
- Vérifiez que PostgreSQL est créé dans Railroad
- Confirmez que `DATABASE_URL` est défini
- Testez la connexion localement

### 2. Frontend ne charge pas
- Vérifiez le cache navigateur (Ctrl+Shift+Suppr)
- Consultez les logs du navigateur (F12)
- Vérifiez `VITE_BACKEND_URL`

### 3. Autres services ne sont pas accessibles
- Vérifiez les règles de firewall
- Confirmez que les variables d'environnement sont correct

## 🔄 Déploiement Continu

Railway supporte automatiquement :
- Déploiement automatique lors de pushes sur `main`
- Logs en temps réel
- Redémarrage automatique en cas d'erreur
- Scaling automatique (sur les plans payants)

## 📝 Checklist Finale

- [ ] Variables d'environnement définies dans Railroad
- [ ] PostgreSQL créé et connecté
- [ ] Backend build/start scripts corrects
- [ ] Frontend URL du backend à jour
- [ ] `.env` ignoré dans `.gitignore`
- [ ] Code poussé sur GitHub
- [ ] Tests locaux réussis
- [ ] Logs vérifiés après déploiement

## 📞 Support et Ressources

- [Railway Documentation](https://docs.railway.app/)
- [Node.js Deployment Guide](https://docs.railway.app/starters/nodejs)
- [PostgreSQL Setup](https://docs.railway.app/starters/postgresql)
- [GitHub Issues](https://github.com/railwayapp/railway/issues)
