# Script de vérification avant déploiement sur Railway (Windows)

Write-Host "🔍 Vérification de la configuration du déploiement..." -ForegroundColor Cyan
Write-Host ""

# Vérifier les fichiers nécessaires
Write-Host "✓ Vérification des fichiers..." -ForegroundColor Blue

$files = @(
    "railway.json",
    "backend\Procfile",
    "backend\.env",
    "frontend\.env",
    ".env.example",
    "backend\.env.example",
    "frontend\.env.example"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (MANQUANT)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✓ Vérification des scripts package.json..." -ForegroundColor Blue

# Vérifier backend
$backendPackage = Get-Content "backend\package.json" -Raw
if ($backendPackage -match '"build": "tsc"') {
    Write-Host "  ✅ Backend: script build disponible" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend: script build manquant" -ForegroundColor Red
}

if ($backendPackage -match '"start": "node dist/index.js"') {
    Write-Host "  ✅ Backend: script start disponible" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend: script start manquant" -ForegroundColor Red
}

# Vérifier frontend
$frontendPackage = Get-Content "frontend\package.json" -Raw
if ($frontendPackage -match '"build": "tsc -b && vite build"') {
    Write-Host "  ✅ Frontend: script build disponible" -ForegroundColor Green
} else {
    Write-Host "  ❌ Frontend: script build manquant" -ForegroundColor Red
}

Write-Host ""
Write-Host "✓ Vérification du contrôle des variables d'environnement..." -ForegroundColor Blue

$indexContent = Get-Content "backend\index.ts" -Raw
if ($indexContent -match "process\.env\.PORT") {
    Write-Host "  ✅ Backend: utilise process.env.PORT" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend: PORT hardcodé" -ForegroundColor Red
}

$frontendEnv = Get-Content "frontend\.env" -Raw
if ($frontendEnv -match "VITE_BACKEND_URL") {
    Write-Host "  ✅ Frontend: VITE_BACKEND_URL configurée" -ForegroundColor Green
} else {
    Write-Host "  ❌ Frontend: VITE_BACKEND_URL manquante" -ForegroundColor Red
}

Write-Host ""
Write-Host "✓ Vérification du .gitignore..." -ForegroundColor Blue

$backendGitignore = Get-Content "backend\.gitignore" -Raw
if ($backendGitignore -match "^\\.env$") {
    Write-Host "  ✅ Backend: .env ignoré" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend: .env non ignoré" -ForegroundColor Red
}

$frontendGitignore = Get-Content "frontend\.gitignore" -Raw
if ($frontendGitignore -match "^\\.env$") {
    Write-Host "  ✅ Frontend: .env ignoré" -ForegroundColor Green
} else {
    Write-Host "  ❌ Frontend: .env non ignoré" -ForegroundColor Red
}

Write-Host ""
Write-Host "✓ Vérification des dépendances..." -ForegroundColor Blue

if ($backendPackage -match '"pg"') {
    Write-Host "  ✅ PostgreSQL (pg) présent" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  PostgreSQL (pg) non détecté" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Vérification complète !" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Assurez-vous que vos variables d'environnement sont définies"
Write-Host "2. Testez localement: npm run dev (backend) et npm run dev (frontend)"
Write-Host "3. Poussez votre code: git push origin main"
Write-Host "4. Créez un nouveau projet sur Railway et déployez"
Write-Host ""
Write-Host "📚 Consultez RAILWAY_QUICKSTART.md pour plus de détails" -ForegroundColor Cyan
