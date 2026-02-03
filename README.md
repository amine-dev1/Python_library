# Python_library

Une application web full-stack avec un frontend React + Vite et un serveur backend.

## Structure du Projet

```
Python_library/
├── frontend/         # Application React + Vite
├── backend/          # Serveur Backend
└── README.md
```

## Frontend

Le frontend est construit avec **React** et **Vite** pour un développement rapide et des builds optimisés.

### Paquets Installés

- **React** - Bibliothèque UI pour créer des interfaces utilisateur
- **Vite** - Outil de build frontend de nouvelle génération
- **Axios** - Client HTTP basé sur les promesses pour les requêtes API
- **React Router DOM** - Routage déclaratif pour les applications React
- **Tailwind CSS** - Framework CSS utilitaire pour le style
- **Lucide React** - Bibliothèque d'icônes belle et cohérente
- **Recharts** - Bibliothèque de graphiques composables pour React
- **React Hot Toast** - Notifications toast élégantes et personnalisables

### Commandes d'Installation

Installation de tous les paquets :
```bash
cd frontend
npm install
```

Installation des paquets individuels (si nécessaire) :
```bash
npm install react react-dom
npm install -D vite @vitejs/plugin-react
npm install axios
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react
npm install recharts
npm install react-hot-toast
```

### Pour Commencer

```bash
cd frontend
npm install
npm run dev
```

Le serveur de développement démarrera à l'adresse `http://localhost:5173`

## Backend

Le backend est construit avec **FastAPI** (Python 3.13+) pour une API performante et facile à utiliser.

### Fonctionnalités Clés
- **FastAPI** - Framework web moderne pour créer des APIs
- **Uvicorn** - Serveur ASGI ultra-rapide
- **Pydantic** - Validation de données utilisant les indications de type Python
- **Auto-Docs** - Documentation API interactive automatisée (Swagger/ReDoc)

### Pour Commencer

1. **Naviguer vers le backend :**
   ```bash
   cd backend
   ```

2. **Créer et activer l'environnement virtuel :**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Installer les dépendances :**
   ```bash
   pip install -r requirements.txt
   ```

4. **Lancer le serveur :**
   ```bash
   uvicorn main:app --reload
   ```

Le serveur démarrera à l'adresse `http://localhost:8000`. 
La documentation interactive de l'API est disponible sur `http://localhost:8000/docs`.

## Technologies

- **Frontend** : React 19, Vite, Tailwind CSS 4
- **Backend** : Python 3.13, FastAPI, Uvicorn
- **Outils** : Axios, React Router v7, Lucide React

## Installation Complète du Projet

### 1. Configuration Frontend
```bash
cd frontend
npm install
npm run dev
```
> S'exécute sur http://localhost:5173

### 2. Configuration Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
> S'exécute sur http://localhost:8000

## Développement

- **Frontend** : Serveur de développement Vite avec HMR (Hot Module Replacement). Configuré avec Tailwind CSS v4.
- **Backend** : Serveur FastAPI avec rechargement automatique. 
- **CORS** : Configuré pour autoriser les requêtes provenant du frontend (localhost:5173).