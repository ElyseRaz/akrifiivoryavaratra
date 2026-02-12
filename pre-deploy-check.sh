#!/bin/bash

# Script de vérification avant déploiement sur Railway

echo "🔍 Vérification de la configuration du déploiement..."
echo ""

# Vérifier les fichiers nécessaires
echo "✓ Vérification des fichiers..."

files=(
  "railway.json"
  "backend/Procfile"
  "backend/.env"
  "frontend/.env"
  ".env.example"
  "backend/.env.example"
  "frontend/.env.example"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (MANQUANT)"
  fi
done

echo ""
echo "✓ Vérification des scripts package.json..."

# Vérifier backend
if grep -q "\"build\": \"tsc\"" backend/package.json; then
  echo "  ✅ Backend: script build disponible"
else
  echo "  ❌ Backend: script build manquant"
fi

if grep -q "\"start\": \"node dist/index.js\"" backend/package.json; then
  echo "  ✅ Backend: script start disponible"
else
  echo "  ❌ Backend: script start manquant"
fi

# Vérifier frontend
if grep -q "\"build\": \"tsc -b && vite build\"" frontend/package.json; then
  echo "  ✅ Frontend: script build disponible"
else
  echo "  ❌ Frontend: script build manquant"
fi

echo ""
echo "✓ Vérification du contrôle des variables d'environnement..."

if grep -q "process.env.PORT" backend/index.ts; then
  echo "  ✅ Backend: utilise process.env.PORT"
else
  echo "  ❌ Backend: PORT hardcodé"
fi

if grep -q "VITE_BACKEND_URL" frontend/.env; then
  echo "  ✅ Frontend: VITE_BACKEND_URL configurée"
else
  echo "  ❌ Frontend: VITE_BACKEND_URL manquante"
fi

echo ""
echo "✓ Vérification du .gitignore..."

if grep -q "^\.env$" backend/.gitignore; then
  echo "  ✅ Backend: .env ignoré"
else
  echo "  ❌ Backend: .env non ignoré"
fi

if grep -q "^\.env$" frontend/.gitignore; then
  echo "  ✅ Frontend: .env ignoré"
else
  echo "  ❌ Frontend: .env non ignoré"
fi

echo ""
echo "✓ Vérification des dépendances..."

if grep -q "\"pg\"" backend/package.json; then
  echo "  ✅ PostgreSQL (pg) présent"
else
  echo "  ⚠️  PostgreSQL (pg) non détecté"
fi

echo ""
echo "🎯 Vérification complète !"
echo ""
echo "Prochaines étapes :"
echo "1. Assurez-vous que vos variables d'environnement sont définies"
echo "2. Testez localement: npm run dev (backend) et npm run dev (frontend)"
echo "3. Poussez votre code: git push origin main"
echo "4. Créez un nouveau projet sur Railway et déployez"
echo ""
echo "📚 Consultez DEPLOYMENT_RAILWAY.md pour plus de détails"
