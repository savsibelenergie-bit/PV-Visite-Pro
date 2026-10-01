# PV Visite Pro V4 — version connectée

Cette version ajoute une architecture serveur avec :
- comptes technicien / administrateur ;
- authentification ;
- base centralisée (fichier JSON pour prototype) ;
- synchronisation des visites ;
- filtrage des visites par technicien ;
- accès administrateur à tous les dossiers ;
- stockage des photos dans les dossiers de visite ;
- suppression protégée par rôle.

## Installation
Prérequis : Node.js 18+.

1. Décompresser.
2. Dans le dossier : `npm install`
3. Lancer : `npm start`
4. Ouvrir `http://localhost:3000`.

Comptes de démonstration :
- technicien : `tech@pv.local` / `tech123`
- administrateur : `admin@pv.local` / `admin123`

## Pour la vraie mise en production
Remplacer le fichier JSON par PostgreSQL/Supabase ou autre base sécurisée, utiliser HTTPS, mots de passe hashés, stockage objet pour les photos, sauvegardes, gestion de sessions sécurisées et politique RGPD.
