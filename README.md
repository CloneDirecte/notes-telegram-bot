<div align="center"><h1>notes-telegram-bot</h1>
  <h3>📱 Reçoit tes nouvelles notes d'EcoleDirecte par message Telegram</h3>
<img src="https://user-images.githubusercontent.com/24863815/167710930-c0078f9f-47aa-4aea-9e92-8f4c40db1ac0.png" width="75%" height="75%" alt="Notification iPhone Telegram"/>
</div>

<h1 align="center">Guide</h1>

## Premières étapes:

Pour créer un bot telegram, il faut d'abord un compte telegram.

Une fois le compte telegram créer, il faut DM [@BotFather](https://t.me/BotFather) la commande /start pour initialiser la conversation.

Ensuite, envoyez /newbot à @BotFather.

Il va vous demander le nom de votre bot, mettez par exemple: CloneDirecte Notes [votre prénom].

BotFather va vous demander le @ de votre bot également, mettez par exemple: CDirecte_Notes\_[votre prénom]\_Bot

Une fois cela fait, vous allez recevoir un token qui se compose comme cela: 1234567890:ac97f2xbAb3LR6a53grp8RH8cq40s27MvjR

Copiez ce token.

## Selfhosting (le hoster soi-même)

Pour hoster le bot soi-même, il faut déjà du matériel. Personellement je pense que utiliser un Raspberry Pi est un bon choix. Mais n'importe quel chose qui s'apparente à un ordinateur qui pourrait faire tourner Linux fera l'affaire.

Une fois le matériel choisi, installer [nvm](https://github.com/nvm-sh/nvm) ([windows ici](https://github.com/coreybutler/nvm-windows)).

Lorsque nvm est installé, installer la dernière versions de node en faisant:

```zsh
Linux, MacOS:
> nvm install --lts
Windows:
> nvm install lts
```

Voilà, vous avez Node.JS et npm installé sur votre serveur/ordinateur.

Maintenant clonez ce repository (nécéssite [git](https://git-scm.com/book/fr/v2/D%C3%A9marrage-rapide-Installation-de-Git) d'installé) en faisant:

```zsh
> git clone https://github.com/CloneDirecte/notes-telegram-bot
```

Puis naviguer dans ce dossier:

```zsh
> cd notes-telegram-bot
```

Ensuite, il faut installer les dépendances:

```zsh
> npm install
```

Une fois que les dépendances sont installées, il faut configuer le bot:

Créez un fichier nommé .env et entrez ceci à l'interieur:

```
TOKEN="Insérer ici entre guillement votre token de votre bot telegram."
ID=A changer une fois que le bot est lancé (ne pas mettre entre guillement)
ED_USERNAME="Insérer ici entre guillement votre Nom d'utilisateur EcoleDirecte"
ED_PASSWORD="Insérer ici entre guillement votre Mot de passe EcoleDirecte "
```

Lancez ensuite le bot:

```zsh
> npm start
```

Une fois lancé, envoyez /start à votre bot sur telegram

Il va donc vous dire que votre ID n'est pas bon et va vous donnez votre user ID que vous metterez dans le ID= du .env

Une fois le ID mit dans le .env, quittez le bot en faisant Ctrl + C et relancez le.
