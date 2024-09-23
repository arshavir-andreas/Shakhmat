# Shakhmat

Une nouvelle façon pédagogique d'améliorer les compétences aux échecs.

[aperçu.webm](https://github.com/user-attachments/assets/5a50ab63-64f9-4f35-be49-6e7fda61cd3c)


* [English](https://github.com/arshavir-andreas/Shakhmat)
* [Français](https://github.com/arshavir-andreas/Shakhmat/blob/main/README.fr.md)

# Table des matières

- [Pourquoi Shakhmat ?](#pourquoi-shakhmat)
- [Todos](#todos "Fonctionnalités")
- [Commencer](#commencer)
- [Licence](#licence)

## Pourquoi Shakhmat ?

Pour autant que je sache, de nombreux joueurs d'échecs dans mon pays (moi y compris) ne maîtrisent pas vraiment la notation PGN. Même si des plateformes d'échecs comme Chess.com ou Lichess.org proposent quelques méthodes pour apprendre cette notation, j'ai personnellement trouvé que c'était un peu difficile à maîtriser. C'est la raison pour laquelle Shakhmat a été créé : **pourquoi ne pas simplement jouer contre un moteur d'échecs en utilisant la notation PGN du tout début jusqu'à la fin d'une partie**?

Il s'agit d'une approche didactique inspirée des _Échecs avec les yeux bandés_.

##### Amélioration des compétences aux échecs

En jouant régulièrement contre des moteurs d'échecs en utilisant Shakhmat, les utilisateurs maîtriseront la notation PGN.

La maîtrise de la notation PGN présente certains avantages :

1. Ils apprendront les ouvertures plus facilement.
2. Il leur sera simple de mémoriser les lignes principales et les variantes des ouvertures.
3. Ils reconnaîtront et assimileront plus facilement les schémas tactiques.
4. Leurs capacités de calcul seront améliorées.

##### Interface utilisateur moderne et responsive :

![1726143997279](docs/mobile-version.png)

##### Gestion conviviale des erreurs :

![1726144142931](docs/error-handling.png)

##### Application Web hautement performante (Excellente expérience utilisateur)

Cette application Web est écrite en :

- Next.TS :
  - Hautes performances, grâce au rendu côté serveur.
- ASP.NET Core Minimal API:
  - Récupérations et mises à jour de données très performantes et à faible latence.
- Base de données Oracle :
  - Base de données d'entreprise hautement performante et évolutive.

## Tous

- [X] ~~Paramètres ELO des moteurs d'échecs~~
- [X] ~~Déplacements utilisateur basés sur la notation PGN~~
- [X] H~~istorique des coups en PGN~~
- [X] ~~Choix des moteurs d'échecs~~
- [X] ~~Enregistrement du compte utilisateur~~
- [X] ~~Authentification et autorisation des utilisateurs~~
- [ ] Export PGN
- [ ] Jeux en temps réel contre d'autres joueurs humains

## Commencer

##### Utiliser Docker

###### Exigences:

- Docker

Ouvrez un nouveau terminal et lancez les commandes suivantes :

```bash
git clone https://github.com/arshavir-andreas/Shakhmat
cd Shakhmat
docker compose -f ./docker-compose.dev.yml up
```

Attendez que la interface de la ligne de commande affiche : "dotnet watch 🚀 Started".

Ensuite, ouvrez un nouveau terminal et lancez cette commande :

```bash
sh ./oracle-db.init.sh <your-oracle-db-SYSTEM-user-password>
```

Enfin, ouvrez [**http://localhost:3000/sign-up**](http://localhost:3000/sign-up) dans votre navigateur préféré, et créez votre compte.

## Licence

Shakhmat est gratuit et distribué sous la [**Licence publique générale GNU version 3**](https://github.com/arshavir-andreas/Shakhmat/blob/main/LICENSE)(GPLv3). Essentiellement, cela signifie que vous êtes libre de faire presque exactement ce que vous voulez avec le programme, y compris le distribuer à vos amis, le rendre disponible en téléchargement sur votre site Web, le vendre (soit seul, soit dans le cadre d'un logiciel plus important), ou l'utiliser comme point de départ pour votre propre projet logiciel.

La seule véritable limitation est que chaque fois que vous distribuez Shakhmat d'une manière ou d'une autre, vous DEVEZ toujours inclure la licence et le code source complet (ou un pointeur vers l'endroit où le code source peut être trouvé) pour générer le binaire exact que vous distribuez. Si vous apportez des modifications au code source, ces modifications DOIVENT également être rendues disponibles sous GPL v3.
