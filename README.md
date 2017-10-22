# Crash d'avions

## Description

En utilisant les données disponibles sur [FiveThirtyEight](https://github.com/fivethirtyeight/data/tree/master/airline-safety), ce programme permet, à l'aide de la librairie d3.js, de visualiser différentes statistiques touchant à la sûreté d'une cinquantaine de compagnies aériennes.

Disponible à l'adresse : https://astephan91.github.io/

## Interface

Deux graphes sont disponibles, et ce qu'ils affichent est sélectionnable à l'aide des 4 menus déroulants en haut de la page. Les trois premiers ont une influence sur le 1er graphe, et permettent de changer les axes ainsi que la période temporelle d'intérêt (1985-2000, 2000-2014, ou bien 1985-2014). Une régression linéaire (ligne orange) permet de visualiser la relation entre les deux variables sélectionnées.

Le 2e graphe présente une compagnie aérienne en particulier, choisie à l'aide du 4e menu déroulant, et la compare à la moyenne de toutes les compagnies sur la période 1985-2014. Ne sont disponibles que les statistiques liées aux accidents et aux accidents mortels.
Lorsqu'une compagnie est sélectionnée, le point qui lui correspond sur le 1er graphe devient rouge. Les autres couleurs correspondent aux continents des maisons-mères de chaque compagnie.

## Utilisation

Pour lancer le programme

### MacOS

1. Télécharger les fichiers et les extraire dans un dossier
2. Lancer une fenêtre terminal
3. Taper cd /chemin_du_dossier (ex : cd /Users/votre_username/Desktop/crash)
4. Taper python -m SimpleHTTPServer
5. Le terminal devrait afficher : Serving HTTP on 0.0.0.0 port 8000
6. Lancer un navigateur, et dans la barre d'adresse taper : 127.0.0.1:8000

### Windows

1. Télécharger les fichiers et les extraire dans un dossier
2. Lancer une invite de commande
3. Taper cd /chemin_du_dossier (ex : C:\User\votre_username\Desktop\crash)
4. Taper python3 -m http.server
5. Le terminal devrait afficher : Serving HTTP on 0.0.0.0 port 8000
6. Lancer un navigateur, et dans la barre d'adresse taper : 127.0.0.1:8000


## Auteur

Ce programme a été créé par Arnaud STEPHAN dans le cadre du cours "Visualisation de données", sous la supervision d'Isaac PANTE, section SLI, Faculté des lettres, UNIL, lors du semestre de printemps 2017 à l'Université de Lausanne.

