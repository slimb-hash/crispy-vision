# Crispy Vision

Site portfolio développé pour **Crispy Vision**, la marque de Christopher Jean-Louis, vidéaste et photographe sportif (basketball et soccer, niveaux secondaire, collégial et universitaire).

**Site en ligne :** https://slimb-hash.github.io/crispy-vision/

![Aperçu de la page d'accueil](docs/apercu.png)

## Contexte

Projet réalisé pour un vrai client. Christopher avait besoin d'un site pour présenter son travail (photos, vidéos, graphiques), mettre en avant les athlètes qu'il couvre et recevoir des demandes de réservation. J'ai conçu et développé le site de A à Z : structure, design, intégration et mise en ligne.

## Fonctionnalités

- Page d'accueil avec présentation, travaux en vedette, clients et appel à l'action
- Galeries photo et vidéo organisées par sport et par événement
- Pages dédiées aux athlètes, dont une section sur Nikola Markovic (1er choix au repêchage MLS 2026)
- Formulaire de réservation pour les demandes de couverture
- Menu mobile (hamburger) et mise en page responsive
- Animations d'apparition au défilement avec `IntersectionObserver`
- Filtres de portfolio par catégorie

## Technologies

- HTML5
- CSS3 (variables CSS, Flexbox, Grid, media queries)
- JavaScript vanilla
- Hébergement : GitHub Pages

## Structure du projet

```
crispy-vision/
├── index.html              # Accueil
├── basketball.html         # Section basketball (événements, mixtapes, graphiques)
├── soccer.html             # Section soccer (photos, vidéos d'équipe et individuelles)
├── athletes.html           # Athlètes mis en avant
├── markovic.html           # Page dédiée à Nikola Markovic
├── booking.html            # Formulaire de réservation
├── style.css               # Styles globaux
├── script.js               # Interactions (menu, animations, filtres, formulaire)
├── images/                 # Images du site
├── logos/                  # Logos des clients
├── Basket/                 # Médias basketball
└── Soccer/                 # Médias soccer
```

## Lancer le projet en local

```bash
git clone https://github.com/slimb-hash/crispy-vision.git
cd crispy-vision
```

Ouvrir ensuite `index.html` dans un navigateur, ou utiliser l'extension **Live Server** de VS Code.

## Ce que j'ai appris

- Organiser un site multipage autour d'une feuille de style commune
- Rendre un site lisible et utilisable sur mobile
- Gérer un projet avec un client : recueillir ses besoins, présenter des versions et intégrer ses retours
- Optimiser le poids des médias pour garder un chargement rapide

## Auteur

**Bonberry** — étudiant au baccalauréat en informatique à l'UQO
GitHub : [@slimb-hash](https://github.com/slimb-hash)

Contenu (photos, vidéos, logos) © Crispy Vision / Christopher Jean-Louis. Utilisé avec permission.