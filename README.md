# 📌 FIRESTOCK - Solution de stockage en ligne
Firestock est une solution de stockage en ligne reposant exclusivement sur des technologies recentes telles que Firebase, Node.JS, React, Flutter et bien plus encore ...

_Lien vers la plateforme : https://firestock.fr/_

> Information : Cette section concerne uniquement le backend.


## Installation

Récupérer les ressources du projet associées à ce README dans un dossier vierge.

Rendez-vous dans le dossier `/functions` puis procéder à l'installation des dépendances :

```sh
npm install
```

> Note: nous vous recommandons fortement d'installer les firebases tools sur votre poste, voir https://firebase.google.com/docs/cli

Il est possible que Firebase vous demande de connecter un compte pour pouvoir travailler avec la CLI, pour cela, exécuter :

```sh
firebase login
```

Vous pouvez démarrer le backend localement avec :

```sh
firebase serve
```

Ou bien avec l'émulateur :

```sh
firebase emulators:start
```

## À savoir

La mise en route du backend depuis un projet Firebase non connecté ou depuis un poste non configuré est une opération délicate.
Nous vous recommandons de demander les accès au projet Firebase à notre équipe en écrivant à `contact@firestock.fr`